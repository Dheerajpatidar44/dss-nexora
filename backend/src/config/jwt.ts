import jwt from "jsonwebtoken";
import { Types } from "mongoose";

export interface JwtPayload {
  userId: string;
  role: string;
  email: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
const ACCESS_EXPIRES = process.env.JWT_ACCESS_EXPIRES_IN || "15m";
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

export const generateTokens = (payload: JwtPayload): TokenPair => {
  const accessToken = jwt.sign(payload, ACCESS_SECRET, {
    expiresIn: ACCESS_EXPIRES,
  } as jwt.SignOptions);

  const refreshToken = jwt.sign(payload, REFRESH_SECRET, {
    expiresIn: REFRESH_EXPIRES,
  } as jwt.SignOptions);

  return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(token, ACCESS_SECRET) as JwtPayload;
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  return jwt.verify(token, REFRESH_SECRET) as JwtPayload;
};

export const decodeToken = (token: string): JwtPayload | null => {
  try {
    return jwt.decode(token) as JwtPayload;
  } catch {
    return null;
  }
};

// Cookie options
export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};
