import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";

// ─── OTP Generation ───────────────────────────────────────────────────────────
export const generateOTP = (): string => {
  const length = Number(process.env.OTP_LENGTH) || 6;
  return Math.floor(Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1)).toString();
};

// ─── Referral Code ────────────────────────────────────────────────────────────
export const generateReferralCode = (name: string): string => {
  const prefix = name.replace(/[^a-zA-Z]/g, "").substring(0, 4).toUpperCase();
  const suffix = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `${prefix}${suffix}`;
};

// ─── Order Number ─────────────────────────────────────────────────────────────
export const generateOrderNumber = (): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${timestamp}-${random}`;
};

// ─── SKU Generation ───────────────────────────────────────────────────────────
export const generateSKU = (productName: string): string => {
  const prefix = productName.replace(/[^a-zA-Z0-9]/g, "").substring(0, 6).toUpperCase();
  const suffix = Date.now().toString(36).slice(-4).toUpperCase();
  return `${prefix}-${suffix}`;
};

// ─── Slug Generation ──────────────────────────────────────────────────────────
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// ─── UUID ─────────────────────────────────────────────────────────────────────
export const generateId = (): string => uuidv4();

// ─── Pagination ───────────────────────────────────────────────────────────────
export interface PaginationOptions {
  page?: number | string;
  limit?: number | string;
}

export const getPagination = (options: PaginationOptions) => {
  const page = Math.max(1, Number(options.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(options.limit) || 20));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

// ─── Query Builder ────────────────────────────────────────────────────────────
export interface QueryOptions {
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  [key: string]: unknown;
}

export const buildMongoQuery = (options: QueryOptions, searchFields: string[]) => {
  const { search, sortBy = "createdAt", sortOrder = "desc", ...filters } = options;
  
  const query: Record<string, unknown> = {};

  // Full-text search
  if (search && searchFields.length > 0) {
    query.$or = searchFields.map((field) => ({
      [field]: { $regex: search, $options: "i" },
    }));
  }

  // Apply additional filters (ignore undefined/empty values)
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "" && value !== null) {
      query[key] = value;
    }
  });

  const sort: Record<string, 1 | -1> = {
    [sortBy]: sortOrder === "asc" ? 1 : -1,
  };

  return { query, sort };
};

// ─── Calculate Discount ───────────────────────────────────────────────────────
export const calculateDiscount = (original: number, discounted: number): number => {
  if (original <= 0) return 0;
  return Math.round(((original - discounted) / original) * 100);
};

// ─── Mask Email ───────────────────────────────────────────────────────────────
export const maskEmail = (email: string): string => {
  const [local, domain] = email.split("@");
  return `${local.substring(0, 2)}***@${domain}`;
};

// ─── Mask Phone ───────────────────────────────────────────────────────────────
export const maskPhone = (phone: string): string => {
  return phone.replace(/(\d{2})\d{6}(\d{2})/, "$1******$2");
};

// ─── Hash ─────────────────────────────────────────────────────────────────────
export const hashString = (str: string): string => {
  return crypto.createHash("sha256").update(str).digest("hex");
};

// ─── Format Currency ─────────────────────────────────────────────────────────
export const formatCurrency = (amount: number, currency = "INR"): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
};
