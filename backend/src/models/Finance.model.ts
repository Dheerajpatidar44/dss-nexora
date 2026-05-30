import mongoose, { Document, Schema } from "mongoose";

// ─── Wallet ───────────────────────────────────────────────────────────────────

export interface IWallet extends Document {
  userId: mongoose.Types.ObjectId;
  userType: "customer" | "vendor" | "delivery";
  balance: number;
  totalCredited: number;
  totalDebited: number;
  createdAt: Date;
  updatedAt: Date;
}

const walletSchema = new Schema<IWallet>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    userType: { type: String, enum: ["customer", "vendor", "delivery"], required: true },
    balance: { type: Number, default: 0, min: 0 },
    totalCredited: { type: Number, default: 0 },
    totalDebited: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Wallet = mongoose.model<IWallet>("Wallet", walletSchema);

// ─── Wallet Transaction ───────────────────────────────────────────────────────

export interface IWalletTransaction extends Document {
  walletId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  type: "credit" | "debit";
  amount: number;
  balance: number;
  description: string;
  reference?: string;
  referenceType?: "order" | "refund" | "withdrawal" | "referral" | "deposit" | "settlement" | "other";
  status: "pending" | "completed" | "failed";
  createdAt: Date;
}

const walletTransactionSchema = new Schema<IWalletTransaction>(
  {
    walletId: { type: Schema.Types.ObjectId, ref: "Wallet", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["credit", "debit"], required: true },
    amount: { type: Number, required: true, min: 0 },
    balance: { type: Number, required: true },
    description: { type: String, required: true },
    reference: String,
    referenceType: {
      type: String,
      enum: ["order", "refund", "withdrawal", "referral", "deposit", "settlement", "other"],
    },
    status: { type: String, enum: ["pending", "completed", "failed"], default: "completed" },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

walletTransactionSchema.index({ userId: 1, createdAt: -1 });
walletTransactionSchema.index({ walletId: 1 });

export const WalletTransaction = mongoose.model<IWalletTransaction>(
  "WalletTransaction",
  walletTransactionSchema
);

// ─── Settlement ───────────────────────────────────────────────────────────────

export interface ISettlement extends Document {
  vendorId: mongoose.Types.ObjectId;
  orderId?: mongoose.Types.ObjectId;
  orderAmount: number;
  commission: number;
  commissionRate: number;
  netAmount: number;
  status: "pending" | "processing" | "completed" | "failed";
  settledAt?: Date;
  transactionId?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const settlementSchema = new Schema<ISettlement>(
  {
    vendorId: { type: Schema.Types.ObjectId, ref: "Vendor", required: true },
    orderId: { type: Schema.Types.ObjectId, ref: "Order" },
    orderAmount: { type: Number, required: true },
    commission: { type: Number, required: true },
    commissionRate: { type: Number, required: true },
    netAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
    },
    settledAt: Date,
    transactionId: String,
    notes: String,
  },
  { timestamps: true }
);

settlementSchema.index({ vendorId: 1, status: 1 });

export const Settlement = mongoose.model<ISettlement>("Settlement", settlementSchema);

// ─── Withdrawal ───────────────────────────────────────────────────────────────

export interface IWithdrawal extends Document {
  userId: mongoose.Types.ObjectId;
  userType: "vendor" | "delivery";
  amount: number;
  method: "bank" | "upi";
  accountDetails: {
    accountName?: string;
    accountNumber?: string;
    ifscCode?: string;
    bankName?: string;
    upiId?: string;
  };
  status: "pending" | "approved" | "rejected" | "paid";
  rejectionReason?: string;
  paidAt?: Date;
  transactionId?: string;
  processedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const withdrawalSchema = new Schema<IWithdrawal>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    userType: { type: String, enum: ["vendor", "delivery"], required: true },
    amount: { type: Number, required: true, min: Number(process.env.MIN_WITHDRAWAL_AMOUNT) || 500 },
    method: { type: String, enum: ["bank", "upi"], required: true },
    accountDetails: {
      accountName: String,
      accountNumber: String,
      ifscCode: String,
      bankName: String,
      upiId: String,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "paid"],
      default: "pending",
    },
    rejectionReason: String,
    paidAt: Date,
    transactionId: String,
    processedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

withdrawalSchema.index({ userId: 1, status: 1 });

export const Withdrawal = mongoose.model<IWithdrawal>("Withdrawal", withdrawalSchema);

// ─── Referral ─────────────────────────────────────────────────────────────────

export interface IReferral extends Document {
  referrerId: mongoose.Types.ObjectId;
  refereeId: mongoose.Types.ObjectId;
  referralCode: string;
  rewardAmount: number;
  isRewarded: boolean;
  rewardedAt?: Date;
  orderId?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const referralSchema = new Schema<IReferral>(
  {
    referrerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    refereeId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    referralCode: { type: String, required: true },
    rewardAmount: { type: Number, default: Number(process.env.REFERRAL_REWARD_AMOUNT) || 100 },
    isRewarded: { type: Boolean, default: false },
    rewardedAt: Date,
    orderId: { type: Schema.Types.ObjectId, ref: "Order" },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Referral = mongoose.model<IReferral>("Referral", referralSchema);
