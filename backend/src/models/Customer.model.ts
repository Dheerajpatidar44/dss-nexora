import mongoose, { Document, Schema } from "mongoose";

export interface ICustomer extends Document {
  userId: mongoose.Types.ObjectId;
  dateOfBirth?: Date;
  gender?: "male" | "female" | "other";
  referralCode: string;
  referredBy?: mongoose.Types.ObjectId;
  walletBalance: number;
  totalOrders: number;
  totalSpent: number;
  loyaltyPoints: number;
  createdAt: Date;
  updatedAt: Date;
}

const customerSchema = new Schema<ICustomer>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ["male", "female", "other"] },
    referralCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    referredBy: { type: Schema.Types.ObjectId, ref: "User" },
    walletBalance: { type: Number, default: 0, min: 0 },
    totalOrders: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    loyaltyPoints: { type: Number, default: 0 },
  },
  { timestamps: true }
);

customerSchema.index({ userId: 1 });
customerSchema.index({ referralCode: 1 });

export const Customer = mongoose.model<ICustomer>("Customer", customerSchema);
