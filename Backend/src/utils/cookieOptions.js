import config from "../config/config.js";

const isProduction = config.NODE_ENV === "production";

export const refreshTokenCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "lax" : "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const clearRefreshTokenCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "lax" : "strict",
};

export const deviceIdCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "lax" : "lax",
  maxAge: 365 * 24 * 60 * 60 * 1000,
};

export const resetTokenCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "lax" : "strict",
  maxAge: 10 * 60 * 1000,
};

export const clearResetTokenCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "lax" : "strict",
};