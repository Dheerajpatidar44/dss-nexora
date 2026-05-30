import mongoose, { Document, Schema } from "mongoose";

export interface IVendor extends Document {
  userId: mongoose.Types.ObjectId;
  businessName: string;
  businessType?: string;
  gstNumber?: string;
  panNumber?: string;
  bankAccountName?: string;
  bankAccountNumber?: string;
  bankIfscCode?: string;
  bankName?: string;
  commissionRate: number;
  walletBalance: number;
  totalSales: number;
  totalOrders: number;
  isApproved: boolean;
  approvedAt?: Date;
  approvedBy?: mongoose.Types.ObjectId;
  subscriptionId?: mongoose.Types.ObjectId;
  documents?: { type: string; url: string; verified: boolean }[];
  createdAt: Date;
  updatedAt: Date;
}

const vendorSchema = new Schema<IVendor>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    businessName: { type: String, required: true, trim: true },
    businessType: { type: String, trim: true },
    gstNumber: { type: String, trim: true },
    panNumber: { type: String, trim: true },
    bankAccountName: { type: String },
    bankAccountNumber: { type: String },
    bankIfscCode: { type: String },
    bankName: { type: String },
    commissionRate: {
      type: Number,
      default: () => Number(process.env.DEFAULT_PLATFORM_COMMISSION_PERCENT) || 10,
      min: 0,
      max: 100,
    },
    walletBalance: { type: Number, default: 0, min: 0 },
    totalSales: { type: Number, default: 0 },
    totalOrders: { type: Number, default: 0 },
    isApproved: { type: Boolean, default: false },
    approvedAt: { type: Date },
    approvedBy: { type: Schema.Types.ObjectId, ref: "User" },
    subscriptionId: { type: Schema.Types.ObjectId, ref: "Subscription" },
    documents: [
      {
        type: { type: String },
        url: { type: String },
        verified: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

// vendorSchema.index({ userId: 1 }); // Removed duplicate index
vendorSchema.index({ isApproved: 1 });

export const Vendor = mongoose.model<IVendor>("Vendor", vendorSchema);
