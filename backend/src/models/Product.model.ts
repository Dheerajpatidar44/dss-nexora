import mongoose, { Document, Schema } from "mongoose";

export interface IProductVariant {
  _id?: mongoose.Types.ObjectId;
  name: string;
  value: string;
  price?: number;
  originalPrice?: number;
  stock: number;
  sku?: string;
  image?: string;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  images: string[];
  thumbnail: string;
  categoryId: mongoose.Types.ObjectId;
  brandId?: mongoose.Types.ObjectId;
  vendorId: mongoose.Types.ObjectId;
  storeId: mongoose.Types.ObjectId;
  taxRateId?: mongoose.Types.ObjectId;
  sku: string;
  stock: number;
  minOrderQty: number;
  maxOrderQty?: number;
  unit?: string;
  weight?: number;
  tags?: string[];
  variants?: IProductVariant[];
  attributes?: { attributeId: mongoose.Types.ObjectId; value: string }[];
  rating: number;
  ratingCount: number;
  reviewCount: number;
  totalSold: number;
  isFeatured: boolean;
  isFlashSale: boolean;
  flashSalePrice?: number;
  flashSaleEndsAt?: Date;
  status: "active" | "inactive" | "draft" | "out_of_stock";
  isApproved: boolean;
  approvedBy?: mongoose.Types.ObjectId;
  faqs?: { question: string; answer: string }[];
  metaTitle?: string;
  metaDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const productVariantSchema = new Schema<IProductVariant>({
  name: { type: String, required: true },
  value: { type: String, required: true },
  price: Number,
  originalPrice: Number,
  stock: { type: Number, default: 0 },
  sku: String,
  image: String,
});

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    shortDescription: { type: String },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 },
    discount: { type: Number, min: 0, max: 100 },
    images: [{ type: String }],
    thumbnail: { type: String, required: true },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    brandId: { type: Schema.Types.ObjectId, ref: "Brand" },
    vendorId: {
      type: Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    storeId: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },
    taxRateId: { type: Schema.Types.ObjectId, ref: "TaxRate" },
    sku: { type: String, required: true, unique: true },
    stock: { type: Number, default: 0, min: 0 },
    minOrderQty: { type: Number, default: 1 },
    maxOrderQty: { type: Number },
    unit: { type: String, default: "piece" },
    weight: { type: Number },
    tags: [{ type: String }],
    variants: [productVariantSchema],
    attributes: [
      {
        attributeId: { type: Schema.Types.ObjectId, ref: "Attribute" },
        value: String,
      },
    ],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    ratingCount: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    totalSold: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isFlashSale: { type: Boolean, default: false },
    flashSalePrice: { type: Number },
    flashSaleEndsAt: { type: Date },
    status: {
      type: String,
      enum: ["active", "inactive", "draft", "out_of_stock"],
      default: "active",
    },
    isApproved: { type: Boolean, default: false },
    approvedBy: { type: Schema.Types.ObjectId, ref: "User" },
    faqs: [{ question: String, answer: String }],
    metaTitle: { type: String },
    metaDescription: { type: String },
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
// productSchema.index({ slug: 1 }); // Removed duplicate index
productSchema.index({ vendorId: 1 });
productSchema.index({ storeId: 1 });
productSchema.index({ categoryId: 1 });
productSchema.index({ status: 1, isApproved: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ isFlashSale: 1, flashSaleEndsAt: 1 });
productSchema.index({ name: "text", description: "text", tags: "text" });

// ─── Virtual: Effective Price ─────────────────────────────────────────────────
productSchema.virtual("effectivePrice").get(function () {
  if (this.isFlashSale && this.flashSalePrice) return this.flashSalePrice;
  return this.price;
});

export const Product = mongoose.model<IProduct>("Product", productSchema);
