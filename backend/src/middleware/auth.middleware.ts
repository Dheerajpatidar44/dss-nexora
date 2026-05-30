import { Request, Response, NextFunction } from "express";
import { verifyAccessToken, JwtPayload } from "../config/jwt";
import { User } from "../models/User.model";
import { AuthenticationError, AuthorizationError } from "../utils/errors";
import { logger } from "../config/logger";

// Extend Express Request
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & { _id: string };
      rawBody?: Buffer;
    }
  }
}

// ─── Authenticate ─────────────────────────────────────────────────────────────
export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    let token: string | undefined;

    // Check Authorization header first
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // Fallback to cookie
    if (!token && req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      throw new AuthenticationError("No authentication token provided");
    }

    const payload = verifyAccessToken(token);

    // Check user still exists and is active
    const user = await User.findById(payload.userId).select("status role");
    if (!user) {
      throw new AuthenticationError("User no longer exists");
    }
    if (user.status === "blocked") {
      throw new AuthorizationError("Your account has been blocked. Contact support.");
    }
    if (user.status === "inactive") {
      throw new AuthenticationError("Account is inactive");
    }

    req.user = { ...payload, _id: payload.userId };
    next();
  } catch (err: unknown) {
    if (
      err instanceof Error &&
      (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError")
    ) {
      next(new AuthenticationError("Invalid or expired token"));
    } else {
      next(err);
    }
  }
};

// ─── Authorize (Role-Based) ───────────────────────────────────────────────────
export const authorize = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AuthenticationError());
    }
    if (!roles.includes(req.user.role)) {
      return next(
        new AuthorizationError(
          `Role '${req.user.role}' is not allowed to access this resource`
        )
      );
    }
    next();
  };
};

// ─── Optional Auth (attach user if token present) ────────────────────────────
export const optionalAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : req.cookies?.accessToken;

    if (token) {
      const payload = verifyAccessToken(token);
      req.user = { ...payload, _id: payload.userId };
    }
  } catch {
    // ignore — optional auth
  }
  next();
};
