import zlib from "node:zlib";
import { promisify } from "node:util";

// * Response compression middleware with zstd > br > gzip negotiation.
// * - Buffers the response, then serves the best encoding the client accepts.
// * - zstd needs Node >= 22.15 / 23.8 (present in node:zlib). On older runtimes
// *   (or clients without zstd support) it falls back to brotli/gzip.
// * - Small bodies are sent uncompressed; already-compressed types (images,
// *   woff2) are skipped.

const THRESHOLD = 1024; // bytes — don't bother compressing tiny bodies
const ZSTD_LEVEL = 3; // ZSTD_CLEVEL_DEFAULT
const GZIP_LEVEL = 6;
const BROTLI_QUALITY = 4;

const ZSTD_SUPPORTED = typeof zlib.zstdCompress === "function";

const gzipAsync = promisify(zlib.gzip);
const brotliAsync = promisify(zlib.brotliCompress);
const zstdAsync = ZSTD_SUPPORTED ? promisify(zlib.zstdCompress) : null;

// Content types worth compressing (skip images, woff/woff2, video, ...)
const COMPRESSIBLE_RE =
  /^(?:text\/|application\/(?:json|javascript|x-javascript|xml|wasm|[a-z0-9.+-]+\+json|vnd\.ms-opentype|x-font-ttf|font-ttf|font-otf)|font\/(?:ttf|otf)|image\/svg\+xml)/i;

const parseAcceptEncoding = (header) => {
  const available = {};
  for (const part of String(header || "").split(",")) {
    const [name, ...params] = part.trim().toLowerCase().split(";");
    if (!name) continue;
    const qParam = params.find((p) => p.trim().startsWith("q="));
    const q = qParam ? Number.parseFloat(qParam.split("=")[1]) : 1;
    if (!Number.isFinite(q)) continue;
    if (!(name in available) || q > available[name]) available[name] = q;
  }
  return available;
};

const pickEncoding = (header) => {
  const accepted = parseAcceptEncoding(header);
  const preference = [];
  if (ZSTD_SUPPORTED) preference.push("zstd");
  preference.push("br", "gzip");

  for (const encoding of preference) {
    if ((accepted[encoding] ?? 0) > 0) return encoding;
  }
  return "identity";
};

const lowerKeys = (obj) => Object.fromEntries(Object.entries(obj || {}).map(([k, v]) => [k.toLowerCase(), v]));

// Headers the handler passed to res.writeHead must not resurrect stale
// values once we have rewritten Content-Length/Content-Encoding.
const withoutFreshHeaders = (obj) =>
  Object.fromEntries(Object.entries(obj || {}).filter(([k]) => !["content-length", "content-encoding", "vary"].includes(k)));

const compressBody = async (body, encoding) => {
  switch (encoding) {
    case "zstd":
      return zstdAsync(body, { level: ZSTD_LEVEL });
    case "br":
      return brotliAsync(body, {
        params: {
          [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_TEXT,
          [zlib.constants.BROTLI_PARAM_QUALITY]: BROTLI_QUALITY,
        },
      });
    case "gzip":
      return gzipAsync(body, { level: GZIP_LEVEL });
    default:
      return body;
  }
};

const smartCompression = () => {
  return (req, res, next) => {
    if (req.method === "HEAD" || req.headers.range || res.headersSent) return next();

    const originalWrite = res.write.bind(res);
    const originalEnd = res.end.bind(res);
    const originalWriteHead = res.writeHead.bind(res);

    let capturedStatus = null;
    let capturedReason = null;
    let capturedHeaders = null;
    let chunks = [];
    let ended = false;

    // Defer real header serialization until we know the final body so we can
    // rewrite Content-Length and add Content-Encoding.
    res.writeHead = function writeHead(statusCode, reason, headers) {
      if (typeof reason === "object" && reason !== null) {
        headers = reason;
        reason = undefined;
      }
      capturedStatus = statusCode;
      capturedReason = reason;
      capturedHeaders = { ...(res.getHeaders?.() || {}), ...lowerKeys(headers) };
      return res;
    };

    res.write = function write(chunk, encoding, callback) {
      if (typeof encoding === "function") {
        callback = encoding;
        encoding = "utf8";
      }
      if (chunk === null || chunk === undefined) return originalWrite.call(res, chunk, encoding, callback);
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, encoding || "utf8"));
      if (typeof callback === "function") process.nextTick(callback);
      return true;
    };

    res.end = function end(chunk, encoding, callback) {
      if (typeof chunk === "function") {
        callback = chunk;
        chunk = null;
      } else if (typeof encoding === "function") {
        callback = encoding;
        encoding = "utf8";
      }
      if (ended) {
        if (typeof callback === "function") process.nextTick(callback);
        return res;
      }
      ended = true;

      if (chunk !== undefined && chunk !== null) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, encoding || "utf8"));
      }
      const body = Buffer.concat(chunks);
      chunks = [];

      // Restore originals so the final send goes straight to the socket.
      res.write = originalWrite;
      res.end = originalEnd;
      res.writeHead = originalWriteHead;

      const finalize = (data, contentEncoding) => {
        res.removeHeader("Content-Length");
        res.setHeader("Content-Length", data.length);
        if (contentEncoding !== "identity") {
          res.setHeader("Content-Encoding", contentEncoding);
        }

        if (capturedStatus != null) {
          const merged = { ...withoutFreshHeaders(capturedHeaders), ...(res.getHeaders?.() || {}) };
          if (capturedReason != null) {
            originalWriteHead(capturedStatus, capturedReason, merged);
          } else {
            originalWriteHead(capturedStatus, merged);
          }
        }

        if (typeof callback === "function") {
          return originalEnd.call(res, data, callback);
        }
        return originalEnd.call(res, data);
      };

      const appendVary = () => res.append("Vary", "Accept-Encoding");

      // Headers passed to res.writeHead were captured, not applied — merge them
      // (lowercased) so content-type/content-encoding checks see the real values.
      const currentHeaders = { ...(res.getHeaders?.() || {}), ...lowerKeys(capturedHeaders) };
      const contentType = String(currentHeaders["content-type"] || "");
      if (
        body.length < THRESHOLD ||
        currentHeaders["content-encoding"] ||
        !COMPRESSIBLE_RE.test(contentType)
      ) {
        appendVary();
        return finalize(body, "identity");
      }

      const chosenEncoding = pickEncoding(req.headers["accept-encoding"]);
      if (chosenEncoding === "identity") {
        appendVary();
        return finalize(body, "identity");
      }

      compressBody(body, chosenEncoding)
        .then((compressed) => {
          appendVary();
          if (compressed.length >= body.length) return finalize(body, "identity");
          return finalize(compressed, chosenEncoding);
        })
        .catch(() => {
          appendVary();
          return finalize(body, "identity");
        });
    };

    return next();
  };
};

export default smartCompression;