import mongoose, { Document, Schema } from "mongoose";

export interface IDeliveryBoy extends Document {
  userId: mongoose.Types.ObjectId;
  vehicleType?: "bike" | "bicycle" | "scooter" | "car" | "van";
  vehicleNumber?: string;
  licenseNumber?: string;
  zone?: string;
  isAvailable: boolean;
  isOnDuty: boolean;
  currentLocation?: { lat: number; lng: number };
  totalDeliveries: number;
  totalEarnings: number;
  walletBalance: number;
  salary: number;
  rating: number;
  ratingCount: number;
  bankAccountName?: string;
  bankAccountNumber?: string;
  bankIfscCode?: string;
  bankName?: string;
  kycStatus: "pending" | "submitted" | "approved" | "rejected";
  kycDocuments?: { type: string; url: string }[];
  createdAt: Date;
  updatedAt: Date;
}

const deliveryBoySchema = new Schema<IDeliveryBoy>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    vehicleType: {
      type: String,
      enum: ["bike", "bicycle", "scooter", "car", "van"],
    },
    vehicleNumber: { type: String, trim: true },
    licenseNumber: { type: String, trim: true },
    zone: { type: String },
    isAvailable: { type: Boolean, default: true },
    isOnDuty: { type: Boolean, default: false },
    currentLocation: {
      lat: { type: Number },
      lng: { type: Number },
    },
    totalDeliveries: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },
    walletBalance: { type: Number, default: 0, min: 0 },
    salary: { type: Number, default: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    ratingCount: { type: Number, default: 0 },
    bankAccountName: { type: String },
    bankAccountNumber: { type: String },
    bankIfscCode: { type: String },
    bankName: { type: String },
    kycStatus: {
      type: String,
      enum: ["pending", "submitted", "approved", "rejected"],
      default: "pending",
    },
    kycDocuments: [
      {
        type: { type: String },
        url: { type: String },
      },
    ],
  },
  { timestamps: true }
);

// deliveryBoySchema.index({ userId: 1 }); // Removed duplicate index
deliveryBoySchema.index({ zone: 1, isAvailable: 1 });

export const DeliveryBoy = mongoose.model<IDeliveryBoy>("DeliveryBoy", deliveryBoySchema);
