import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authRateLimiter } from "../middleware/rateLimiter";
import { validate } from "../middleware/validate";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyOTPSchema,
} from "../validators/auth.validator";

const router = Router();

// Public routes
router.post("/register", authRateLimiter, validate(registerSchema), authController.register);
router.post("/login", authRateLimiter, validate(loginSchema), authController.login);
router.post("/forgot-password", authRateLimiter, validate(forgotPasswordSchema), authController.forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), authController.resetPassword);
router.post("/refresh", authController.refreshToken);

// Protected routes
router.use(authenticate);
router.get("/me", authController.getMe);
router.post("/logout", authController.logout);
router.post("/send-otp", authController.sendOTP);
router.post("/verify-otp", validate(verifyOTPSchema), authController.verifyOTP);

export default router;
