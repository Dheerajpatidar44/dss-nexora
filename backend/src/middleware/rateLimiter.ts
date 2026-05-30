import { Request, Response, NextFunction } from "express";
import { incrementRateLimit } from "../config/redis";
import { RateLimitError } from "../utils/errors";

interface RateLimitOptions {
  windowMs?: number;
  max?: number;
  keyGenerator?: (req: Request) => string;
}

export const rateLimiter = (options: RateLimitOptions = {}) => {
  const windowMs = options.windowMs || Number(process.env.RATE_LIMIT_WINDOW_MS) || 900000;
  const max = options.max || Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100;
  const keyGenerator = options.keyGenerator || ((req: Request) => req.ip || "unknown");

  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const key = keyGenerator(req);
      const count = await incrementRateLimit(key, windowMs);

      if (count > max) {
        return next(new RateLimitError());
      }
      next();
    } catch {
      next(); // fail open
    }
  };
};

// Stricter limiter for auth routes
export const authRateLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 min
  max: Number(process.env.AUTH_RATE_LIMIT_MAX) || 10,
  keyGenerator: (req) => `auth:${req.ip}:${req.body?.email || ""}`,
});
