import { User, IUser, UserRole } from "../models/User.model";
import { Customer } from "../models/Customer.model";
import { Vendor } from "../models/Vendor.model";
import { DeliveryBoy } from "../models/DeliveryBoy.model";
import { generateTokens, verifyRefreshToken } from "../config/jwt";
import {
  storeOTP, verifyOTP,
  storeRefreshToken, getRefreshToken, deleteRefreshToken,
} from "../config/redis";
import { sendEmail } from "../config/mailer";
import {
  AuthenticationError, ConflictError, BadRequestError, NotFoundError,
} from "../utils/errors";
import { generateOTP, generateReferralCode, generateOrderNumber } from "../utils/helpers";
import { logger } from "../config/logger";

// ─── Register ─────────────────────────────────────────────────────────────────

interface RegisterInput {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role?: UserRole;
  referralCode?: string;
}

export const registerService = async (input: RegisterInput) => {
  const { name, email, phone, password, role = "customer", referralCode } = input;

  // Check duplicate email
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) throw new ConflictError("Email already registered");

  // Create user
  const user = await User.create({ name, email, phone, password, role, status: "active" });

  // Create role-specific profile
  if (role === "customer") {
    const refCode = generateReferralCode(name);
    let referredBy: string | undefined;

    if (referralCode) {
      const referrer = await Customer.findOne({ referralCode: referralCode.toUpperCase() });
      if (referrer) referredBy = referrer.userId.toString();
    }

    await Customer.create({
      userId: user._id,
      referralCode: refCode,
      referredBy,
    });
  } else if (role === "vendor") {
    await Vendor.create({ userId: user._id, businessName: name });
  } else if (role === "delivery") {
    await DeliveryBoy.create({ userId: user._id });
  }

  // Send OTP for email verification
  const otp = generateOTP();
  await storeOTP(`email:${user._id}`, otp);
  await sendEmail({
    to: email,
    subject: "Verify your email — DSS Nexus Commerce",
    template: "otp",
    data: { name, otp, expiresIn: process.env.OTP_EXPIRES_IN_MINUTES || "10" },
  });

  const tokens = generateTokens({
    userId: user._id.toString(),
    role: user.role,
    email: user.email,
  });

  await storeRefreshToken(user._id.toString(), tokens.refreshToken);

  return { user: user.toJSON(), tokens };
};

// ─── Login ────────────────────────────────────────────────────────────────────

export const loginService = async (email: string, password: string) => {
  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+password"
  );
  if (!user) throw new AuthenticationError("Invalid email or password");

  if (user.isLocked()) {
    throw new AuthenticationError(
      "Account is temporarily locked due to too many failed attempts. Try again in 30 minutes."
    );
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    // Increment login attempts
    user.loginAttempts = (user.loginAttempts || 0) + 1;
    if (user.loginAttempts >= 5) {
      user.lockUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 min lock
    }
    await user.save();
    throw new AuthenticationError("Invalid email or password");
  }

  if (user.status === "blocked") {
    throw new AuthenticationError("Account is blocked. Contact support.");
  }
  if (user.status === "inactive") {
    throw new AuthenticationError("Account is inactive");
  }

  // Reset login attempts on success
  user.loginAttempts = 0;
  user.lockUntil = undefined;
  user.lastLogin = new Date();
  await user.save();

  const tokens = generateTokens({
    userId: user._id.toString(),
    role: user.role,
    email: user.email,
  });

  await storeRefreshToken(user._id.toString(), tokens.refreshToken);

  return { user: user.toJSON(), tokens };
};

// ─── Logout ───────────────────────────────────────────────────────────────────

export const logoutService = async (userId: string) => {
  await deleteRefreshToken(userId);
};

// ─── Refresh Token ────────────────────────────────────────────────────────────

export const refreshTokenService = async (refreshToken: string) => {
  const payload = verifyRefreshToken(refreshToken);

  // Validate stored token matches
  const stored = await getRefreshToken(payload.userId);
  if (!stored || stored !== refreshToken) {
    throw new AuthenticationError("Invalid refresh token");
  }

  const user = await User.findById(payload.userId);
  if (!user) throw new AuthenticationError("User not found");

  const tokens = generateTokens({
    userId: user._id.toString(),
    role: user.role,
    email: user.email,
  });

  await storeRefreshToken(user._id.toString(), tokens.refreshToken);

  return tokens;
};

// ─── Send OTP ─────────────────────────────────────────────────────────────────

export const sendOTPService = async (
  userId: string,
  type: "email" | "phone"
) => {
  const user = await User.findById(userId);
  if (!user) throw new NotFoundError("User");

  const otp = generateOTP();
  await storeOTP(`${type}:${userId}`, otp);

  if (type === "email") {
    await sendEmail({
      to: user.email,
      subject: "Your OTP — DSS Nexus Commerce",
      template: "otp",
      data: { name: user.name, otp, expiresIn: process.env.OTP_EXPIRES_IN_MINUTES || "10" },
    });
  }

  return { message: "OTP sent successfully" };
};

// ─── Verify OTP ───────────────────────────────────────────────────────────────

export const verifyOTPService = async (
  userId: string,
  otp: string,
  type: "email" | "phone"
) => {
  const isValid = await verifyOTP(`${type}:${userId}`, otp);
  if (!isValid) throw new BadRequestError("Invalid or expired OTP");

  const update: Partial<IUser> =
    type === "email"
      ? { isEmailVerified: true }
      : { isPhoneVerified: true };

  await User.findByIdAndUpdate(userId, update);
  return { message: "OTP verified successfully" };
};

// ─── Forgot Password ──────────────────────────────────────────────────────────

export const forgotPasswordService = async (email: string) => {
  const user = await User.findOne({ email: email.toLowerCase() });
  // Always respond success to prevent email enumeration
  if (!user) return { message: "If this email is registered, you will receive a reset link." };

  const otp = generateOTP();
  await storeOTP(`pwd-reset:${user._id}`, otp);

  await sendEmail({
    to: email,
    subject: "Reset your password — DSS Nexus Commerce",
    template: "password-reset",
    data: { name: user.name, otp, expiresIn: "10" },
  });

  return { message: "If this email is registered, you will receive a reset link." };
};

// ─── Reset Password ───────────────────────────────────────────────────────────

export const resetPasswordService = async (
  email: string,
  otp: string,
  newPassword: string
) => {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) throw new BadRequestError("Invalid request");

  const isValid = await verifyOTP(`pwd-reset:${user._id}`, otp);
  if (!isValid) throw new BadRequestError("Invalid or expired OTP");

  user.password = newPassword;
  await user.save();

  // Invalidate all sessions
  await deleteRefreshToken(user._id.toString());

  return { message: "Password reset successfully" };
};

// ─── Get Me ───────────────────────────────────────────────────────────────────

export const getMeService = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) throw new NotFoundError("User");

  let profile = null;
  if (user.role === "customer") {
    profile = await Customer.findOne({ userId: user._id });
  } else if (user.role === "vendor") {
    profile = await Vendor.findOne({ userId: user._id });
  } else if (user.role === "delivery") {
    profile = await DeliveryBoy.findOne({ userId: user._id });
  }

  return { user: user.toJSON(), profile };
};
