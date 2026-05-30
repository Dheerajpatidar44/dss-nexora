import { Request, Response } from "express";
import * as authService from "../services/auth.service";
import { ApiResponse } from "../utils/apiResponse";
import { cookieOptions } from "../config/jwt";

// ─── Register ─────────────────────────────────────────────────────────────────
export const register = async (req: Request, res: Response) => {
  const result = await authService.registerService(req.body);
  res.cookie("accessToken", result.tokens.accessToken, cookieOptions);
  res.cookie("refreshToken", result.tokens.refreshToken, cookieOptions);
  ApiResponse.created(res, result, "Registration successful");
};

// ─── Login ────────────────────────────────────────────────────────────────────
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await authService.loginService(email, password);
  res.cookie("accessToken", result.tokens.accessToken, cookieOptions);
  res.cookie("refreshToken", result.tokens.refreshToken, cookieOptions);
  ApiResponse.success(res, result, "Login successful");
};

// ─── Logout ───────────────────────────────────────────────────────────────────
export const logout = async (req: Request, res: Response) => {
  await authService.logoutService(req.user!._id);
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  ApiResponse.success(res, null, "Logged out successfully");
};

// ─── Refresh Token ────────────────────────────────────────────────────────────
export const refreshToken = async (req: Request, res: Response) => {
  const token =
    req.cookies?.refreshToken || req.body?.refreshToken;
  const tokens = await authService.refreshTokenService(token);
  res.cookie("accessToken", tokens.accessToken, cookieOptions);
  res.cookie("refreshToken", tokens.refreshToken, cookieOptions);
  ApiResponse.success(res, tokens, "Token refreshed");
};

// ─── Get Me ───────────────────────────────────────────────────────────────────
export const getMe = async (req: Request, res: Response) => {
  const result = await authService.getMeService(req.user!._id);
  ApiResponse.success(res, result);
};

// ─── Send OTP ─────────────────────────────────────────────────────────────────
export const sendOTP = async (req: Request, res: Response) => {
  const { type = "email" } = req.body;
  const result = await authService.sendOTPService(req.user!._id, type);
  ApiResponse.success(res, result);
};

// ─── Verify OTP ───────────────────────────────────────────────────────────────
export const verifyOTP = async (req: Request, res: Response) => {
  const { otp, type = "email" } = req.body;
  const result = await authService.verifyOTPService(req.user!._id, otp, type);
  ApiResponse.success(res, result);
};

// ─── Forgot Password ──────────────────────────────────────────────────────────
export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  const result = await authService.forgotPasswordService(email);
  ApiResponse.success(res, result);
};

// ─── Reset Password ───────────────────────────────────────────────────────────
export const resetPassword = async (req: Request, res: Response) => {
  const { email, otp, password } = req.body;
  const result = await authService.resetPasswordService(email, otp, password);
  ApiResponse.success(res, result);
};
