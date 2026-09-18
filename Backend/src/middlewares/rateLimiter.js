import rateLimit, { ipKeyGenerator } from "express-rate-limit";

const rateLimitHandler = (req, res) => {
    return res.status(429).json({
        success: false,
        message: "Too many requests. Please try again in a few minutes."
    });
};

const createLimiter = (windowMs, max) => rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    handler: rateLimitHandler,
});


// * AUTH - RESEND-OTP
export const resendOtpLimiter = rateLimit({
    windowMs: 60 * 1000, 
    max: 1, 
    keyGenerator: (req) => req.body?.email?.trim()?.toLowerCase() || ipKeyGenerator(req.ip),         
    handler: rateLimitHandler,
    standardHeaders: true,
    legacyHeaders: false,
});

// * AUTH - ALL-AUTH-ROUTE
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 30,  // 30 requests per 15 minutes
    standardHeaders: true,
    legacyHeaders: false,
    handler: rateLimitHandler
});

// * AUTH - REF-TOKEN
export const refTokenLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200,  // 200 refreshes per 15 min (multi-tab friendly, per-IP)
    standardHeaders: true,
    legacyHeaders: false,
    handler: rateLimitHandler
})

// * AUTHENTICATED API ROUTES
export const apiReadLimiter = createLimiter(60 * 1000, 120);
export const apiWriteLimiter = createLimiter(60 * 1000, 60);
export const sensitiveApiLimiter = createLimiter(15 * 60 * 1000, 10);