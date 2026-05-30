import mongoose, { Document, Schema } from "mongoose";

// ─── Plan ─────────────────────────────────────────────────────────────────────

export interface IPlan extends Document {
  name: string;
  description?: string;
  price: number;
  duration: number; // days
  features: string[];
  maxProducts?: number;
  commissionDiscount?: number;
  isPopular: boolean;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const planSchema = new Schema<IPlan>(
  {
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true, min: 0 },
    duration: { type: Number, required: true, min: 1 },
    features: [{ type: String }],
    maxProducts: Number,
    commissionDiscount: { type: Number, default: 0 },
    isPopular: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Plan = mongoose.model<IPlan>("Plan", planSchema);

// ─── Subscription ─────────────────────────────────────────────────────────────

export interface ISubscription extends Document {
  vendorId: mongoose.Types.ObjectId;
  planId: mongoose.Types.ObjectId;
  status: "active" | "expired" | "cancelled" | "pending";
  startDate: Date;
  endDate: Date;
  amount: number;
  paymentMethod: string;
  paymentId?: string;
  autoRenew: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const subscriptionSchema = new Schema<ISubscription>(
  {
    vendorId: { type: Schema.Types.ObjectId, ref: "Vendor", required: true },
    planId: { type: Schema.Types.ObjectId, ref: "Plan", required: true },
    status: {
      type: String,
      enum: ["active", "expired", "cancelled", "pending"],
      default: "pending",
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    amount: { type: Number, required: true },
    paymentMethod: String,
    paymentId: String,
    autoRenew: { type: Boolean, default: false },
  },
  { timestamps: true }
);

subscriptionSchema.index({ vendorId: 1, status: 1 });
subscriptionSchema.index({ endDate: 1, status: 1 });

export const Subscription = mongoose.model<ISubscription>("Subscription", subscriptionSchema);

// ─── Banner ───────────────────────────────────────────────────────────────────

export interface IBanner extends Document {
  title: string;
  subtitle?: string;
  image: string;
  link?: string;
  position: "hero" | "section" | "popup" | "sidebar" | "category";
  isActive: boolean;
  startDate?: Date;
  endDate?: Date;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const bannerSchema = new Schema<IBanner>(
  {
    title: { type: String, required: true },
    subtitle: String,
    image: { type: String, required: true },
    link: String,
    position: {
      type: String,
      enum: ["hero", "section", "popup", "sidebar", "category"],
      default: "hero",
    },
    isActive: { type: Boolean, default: true },
    startDate: Date,
    endDate: Date,
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Banner = mongoose.model<IBanner>("Banner", bannerSchema);

// ─── PromoCode ────────────────────────────────────────────────────────────────

export interface IPromoCode extends Document {
  code: string;
  type: "percent" | "fixed";
  value: number;
  minOrderAmount: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  userLimit: number;
  applicableFor: "all" | "first_order" | "specific_category" | "specific_product";
  categoryIds?: mongoose.Types.ObjectId[];
  productIds?: mongoose.Types.ObjectId[];
  isActive: boolean;
  expiresAt?: Date;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const promoCodeSchema = new Schema<IPromoCode>(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    type: { type: String, enum: ["percent", "fixed"], required: true },
    value: { type: Number, required: true, min: 0 },
    minOrderAmount: { type: Number, default: 0 },
    maxDiscount: Number,
    usageLimit: Number,
    usedCount: { type: Number, default: 0 },
    userLimit: { type: Number, default: 1 },
    applicableFor: {
      type: String,
      enum: ["all", "first_order", "specific_category", "specific_product"],
      default: "all",
    },
    categoryIds: [{ type: Schema.Types.ObjectId, ref: "Category" }],
    productIds: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    isActive: { type: Boolean, default: true },
    expiresAt: Date,
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const PromoCode = mongoose.model<IPromoCode>("PromoCode", promoCodeSchema);

// ─── AdCampaign ───────────────────────────────────────────────────────────────

export interface IAdCampaign extends Document {
  vendorId: mongoose.Types.ObjectId;
  title: string;
  type: "banner" | "product" | "store";
  targetId?: mongoose.Types.ObjectId;
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  ctr: number;
  status: "draft" | "active" | "paused" | "ended" | "rejected";
  startDate: Date;
  endDate: Date;
  adImage?: string;
  adLink?: string;
  createdAt: Date;
  updatedAt: Date;
}

const adCampaignSchema = new Schema<IAdCampaign>(
  {
    vendorId: { type: Schema.Types.ObjectId, ref: "Vendor", required: true },
    title: { type: String, required: true },
    type: { type: String, enum: ["banner", "product", "store"], required: true },
    targetId: Schema.Types.ObjectId,
    budget: { type: Number, required: true, min: 0 },
    spent: { type: Number, default: 0 },
    impressions: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    ctr: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["draft", "active", "paused", "ended", "rejected"],
      default: "draft",
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    adImage: String,
    adLink: String,
  },
  { timestamps: true }
);

export const AdCampaign = mongoose.model<IAdCampaign>("AdCampaign", adCampaignSchema);

// ─── Notification ─────────────────────────────────────────────────────────────

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  message: string;
  type: "order" | "payment" | "system" | "marketing" | "delivery" | "wallet";
  isRead: boolean;
  link?: string;
  data?: Record<string, unknown>;
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ["order", "payment", "system", "marketing", "delivery", "wallet"],
      required: true,
    },
    isRead: { type: Boolean, default: false },
    link: String,
    data: { type: Schema.Types.Mixed },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

export const Notification = mongoose.model<INotification>("Notification", notificationSchema);

// ─── AuditLog ─────────────────────────────────────────────────────────────────

export interface IAuditLog extends Document {
  userId: mongoose.Types.ObjectId;
  action: string;
  resource: string;
  resourceId?: string;
  changes?: Record<string, unknown>;
  ip?: string;
  userAgent?: string;
  createdAt: Date;
}

const auditLogSchema = new Schema<IAuditLog>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, required: true },
    resource: { type: String, required: true },
    resourceId: String,
    changes: { type: Schema.Types.Mixed },
    ip: String,
    userAgent: String,
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

auditLogSchema.index({ userId: 1, createdAt: -1 });
auditLogSchema.index({ resource: 1, resourceId: 1 });

export const AuditLog = mongoose.model<IAuditLog>("AuditLog", auditLogSchema);

// ─── SystemSetting ────────────────────────────────────────────────────────────

export interface ISystemSetting extends Document {
  key: string;
  value: any;
  group: string;
  label?: string;
  type: "string" | "number" | "boolean" | "json" | "array";
  isPublic: boolean;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const systemSettingSchema = new Schema<ISystemSetting>(
  {
    key: { type: String, required: true, unique: true },
    value: { type: Schema.Types.Mixed },
    group: { type: String, required: true },
    label: String,
    type: {
      type: String,
      enum: ["string", "number", "boolean", "json", "array"],
      default: "string",
    },
    isPublic: { type: Boolean, default: false },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

systemSettingSchema.index({ key: 1 });
systemSettingSchema.index({ group: 1 });

export const SystemSetting = mongoose.model<ISystemSetting>(
  "SystemSetting",
  systemSettingSchema
);

// ─── DeliveryZone ─────────────────────────────────────────────────────────────

export interface IDeliveryZone extends Document {
  name: string;
  description?: string;
  pincodes: string[];
  cities: string[];
  states: string[];
  deliveryCharge: number;
  minOrderAmount: number;
  estimatedTime: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const deliveryZoneSchema = new Schema<IDeliveryZone>(
  {
    name: { type: String, required: true },
    description: String,
    pincodes: [{ type: String }],
    cities: [{ type: String }],
    states: [{ type: String }],
    deliveryCharge: { type: Number, required: true, min: 0 },
    minOrderAmount: { type: Number, default: 0 },
    estimatedTime: { type: String, default: "30-45 mins" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

deliveryZoneSchema.index({ pincodes: 1 });
deliveryZoneSchema.index({ isActive: 1 });

export const DeliveryZone = mongoose.model<IDeliveryZone>(
  "DeliveryZone",
  deliveryZoneSchema
);

// ─── Faq ─────────────────────────────────────────────────────────────────────

export interface IFaq extends Document {
  question: string;
  answer: string;
  category?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const faqSchema = new Schema<IFaq>(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    category: { type: String, default: "general" },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Faq = mongoose.model<IFaq>("Faq", faqSchema);

// ─── CronLog ─────────────────────────────────────────────────────────────────

export interface ICronLog extends Document {
  jobName: string;
  status: "running" | "success" | "failed";
  message?: string;
  duration?: number;
  startedAt: Date;
  completedAt?: Date;
}

const cronLogSchema = new Schema<ICronLog>({
  jobName: { type: String, required: true },
  status: { type: String, enum: ["running", "success", "failed"], required: true },
  message: String,
  duration: Number,
  startedAt: { type: Date, default: Date.now },
  completedAt: Date,
});

cronLogSchema.index({ jobName: 1, startedAt: -1 });

export const CronLog = mongoose.model<ICronLog>("CronLog", cronLogSchema);
