import { createClient } from "redis";
import config from "../config/config.js";

const redisClient = createClient({
  ...(config.REDIS_PASSWORD ? { username: "default", password: config.REDIS_PASSWORD } : {}),
  socket: {
    host: config.REDIS_HOST,
    port: config.REDIS_PORT,
    reconnectStrategy: (retries) => {
      if (retries > 10) return new Error("Redis max retries reached");
      return Math.min(retries * 200, 3000);
    },
    ...(config.REDIS_TLS ? { tls: { rejectUnauthorized: false } } : {}),
  },
});

redisClient.on("error", (err) => console.error("Redis Client Error", err.message));
redisClient.on("connect", () => console.log("Redis connected"));
redisClient.on("reconnecting", () => console.log("Redis reconnecting..."));
redisClient.on("end", () => console.log("Redis connection closed"));

const CONNECT_TIMEOUT_MS = 10000;

const connectRedis = async () => {
  const connectPromise = redisClient.connect();
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Redis connection timed out")), CONNECT_TIMEOUT_MS)
  );
  try {
    await Promise.race([connectPromise, timeoutPromise]);
  } catch (err) {
    redisClient.destroy().catch(() => {});
    throw err;
  }
};

export { redisClient, connectRedis }