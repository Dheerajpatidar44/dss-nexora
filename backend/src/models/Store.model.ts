import mongoose, { Document, Schema } from "mongoose";

export interface IStore extends Document {
  vendorId: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  logo?: string;
  banner?: string;
  description?: string;
  phone?: string;
  email?: string;
  address?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    lat?: number;
    lng?: number;
  };
  rating: number;
  ratingCount: number;
  productCount: number;
  totalOrders: number;
  minimumOrder: number;
  deliveryTime?: string;
  deliveryCharge: number;
  freeDeliveryAbove?: number;
  isActive: boolean;
  isVerified: boolean;
  openingHours?: {
    day: string;
    open: string;
    close: string;
    isClosed: boolean;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const storeSchema = new Schema<IStore>(
  {
    vendorId: { type: Schema.Types.ObjectId, ref: "Vendor", required: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    logo: { type: String },
    banner: { type: String },
    description: { type: String },
    phone: { type: String },
    email: { type: String },
    address: {
      line1: String,
      line2: String,
      city: String,
      state: String,
      pincode: String,
      country: { type: String, default: "India" },
      lat: Number,
      lng: Number,
    },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    ratingCount: { type: Number, default: 0 },
    productCount: { type: Number, default: 0 },
    totalOrders: { type: Number, default: 0 },
    minimumOrder: { type: Number, default: 0 },
    deliveryTime: { type: String, default: "30-45 mins" },
    deliveryCharge: {
      type: Number,
      default: () => Number(process.env.DEFAULT_DELIVERY_CHARGE) || 40,
    },
    freeDeliveryAbove: { type: Number },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    openingHours: [
      {
        day: String,
        open: String,
        close: String,
        isClosed: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

storeSchema.index({ vendorId: 1 });
storeSchema.index({ slug: 1 });
storeSchema.index({ isActive: 1 });

export const Store = mongoose.model<IStore>("Store", storeSchema);
