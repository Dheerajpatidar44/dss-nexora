import mongoose, { Document, Schema } from "mongoose";

export interface ICategory extends Document {
  name: string;
  slug: string;
  image?: string;
  icon?: string;
  description?: string;
  parentId?: mongoose.Types.ObjectId;
  level: number;
  sortOrder: number;
  isActive: boolean;
  productCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    image: { type: String },
    icon: { type: String },
    description: { type: String },
    parentId: { type: Schema.Types.ObjectId, ref: "Category", default: null },
    level: { type: Number, default: 0 },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    productCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

categorySchema.index({ slug: 1 });
categorySchema.index({ parentId: 1 });
categorySchema.index({ isActive: 1, sortOrder: 1 });

export const Category = mongoose.model<ICategory>("Category", categorySchema);

// ─── Brand ───────────────────────────────────────────────────────────────────

export interface IBrand extends Document {
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const brandSchema = new Schema<IBrand>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    logo: { type: String },
    description: { type: String },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

brandSchema.index({ slug: 1 });
brandSchema.index({ isActive: 1 });

export const Brand = mongoose.model<IBrand>("Brand", brandSchema);

// ─── Attribute ───────────────────────────────────────────────────────────────

export interface IAttribute extends Document {
  name: string;
  values: string[];
  vendorId?: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const attributeSchema = new Schema<IAttribute>(
  {
    name: { type: String, required: true, trim: true },
    values: [{ type: String, trim: true }],
    vendorId: { type: Schema.Types.ObjectId, ref: "Vendor" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Attribute = mongoose.model<IAttribute>("Attribute", attributeSchema);

// ─── TaxRate ──────────────────────────────────────────────────────────────────

export interface ITaxRate extends Document {
  name: string;
  rate: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const taxRateSchema = new Schema<ITaxRate>(
  {
    name: { type: String, required: true },
    rate: { type: Number, required: true, min: 0, max: 100 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const TaxRate = mongoose.model<ITaxRate>("TaxRate", taxRateSchema);
