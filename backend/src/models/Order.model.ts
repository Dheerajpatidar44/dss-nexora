import mongoose, { Document, Schema } from "mongoose";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "packed"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "return_requested"
  | "returned"
  | "refunded";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type PaymentMethod = "razorpay" | "stripe" | "cod" | "wallet";

export interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  productName: string;
  productImage: string;
  variantId?: mongoose.Types.ObjectId;
  variantName?: string;
  vendorId: mongoose.Types.ObjectId;
  storeId: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
  originalPrice: number;
  tax: number;
  total: number;
  sku?: string;
}

export interface IOrderTimeline {
  status: OrderStatus;
  message: string;
  timestamp: Date;
  updatedBy?: mongoose.Types.ObjectId;
}

export interface IOrder extends Document {
  orderNumber: string;
  customerId: mongoose.Types.ObjectId;
  items: IOrderItem[];
  address: {
    name: string;
    phone: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    lat?: number;
    lng?: number;
  };
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  razorpayOrderId?: string;
  stripePaymentIntentId?: string;
  subtotal: number;
  discount: number;
  couponCode?: string;
  couponDiscount: number;
  deliveryCharge: number;
  tax: number;
  walletUsed: number;
  total: number;
  vendorId?: mongoose.Types.ObjectId;
  storeId?: mongoose.Types.ObjectId;
  deliveryBoyId?: mongoose.Types.ObjectId;
  estimatedDelivery?: Date;
  deliveredAt?: Date;
  timeline: IOrderTimeline[];
  notes?: string;
  isSettled: boolean;
  settlementId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  productName: { type: String, required: true },
  productImage: { type: String },
  variantId: Schema.Types.ObjectId,
  variantName: String,
  vendorId: { type: Schema.Types.ObjectId, ref: "Vendor", required: true },
  storeId: { type: Schema.Types.ObjectId, ref: "Store", required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
  originalPrice: { type: Number, required: true },
  tax: { type: Number, default: 0 },
  total: { type: Number, required: true },
  sku: String,
});

const orderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    items: [orderItemSchema],
    address: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      line1: { type: String, required: true },
      line2: String,
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      country: { type: String, default: "India" },
      lat: Number,
      lng: Number,
    },
    status: {
      type: String,
      enum: [
        "pending","confirmed","processing","packed","shipped",
        "out_for_delivery","delivered","cancelled",
        "return_requested","returned","refunded",
      ],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["razorpay", "stripe", "cod", "wallet"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    paymentId: String,
    razorpayOrderId: String,
    stripePaymentIntentId: String,
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    couponCode: String,
    couponDiscount: { type: Number, default: 0 },
    deliveryCharge: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    walletUsed: { type: Number, default: 0 },
    total: { type: Number, required: true },
    vendorId: { type: Schema.Types.ObjectId, ref: "Vendor" },
    storeId: { type: Schema.Types.ObjectId, ref: "Store" },
    deliveryBoyId: { type: Schema.Types.ObjectId, ref: "DeliveryBoy" },
    estimatedDelivery: Date,
    deliveredAt: Date,
    timeline: [
      {
        status: String,
        message: String,
        timestamp: { type: Date, default: Date.now },
        updatedBy: Schema.Types.ObjectId,
      },
    ],
    notes: String,
    isSettled: { type: Boolean, default: false },
    settlementId: { type: Schema.Types.ObjectId, ref: "Settlement" },
  },
  { timestamps: true }
);

// orderSchema.index({ orderNumber: 1 }); // Removed duplicate index
orderSchema.index({ customerId: 1, createdAt: -1 });
orderSchema.index({ vendorId: 1, status: 1 });
orderSchema.index({ deliveryBoyId: 1, status: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ paymentStatus: 1 });

export const Order = mongoose.model<IOrder>("Order", orderSchema);
