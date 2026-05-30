import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User } from "../models/User.model";
import { Customer } from "../models/Customer.model";
import { Vendor } from "../models/Vendor.model";
import { DeliveryBoy } from "../models/DeliveryBoy.model";
import { Category, Brand, TaxRate } from "../models/Catalog.model";
import { Plan, Banner, Faq, SystemSetting } from "../models/Marketing.model";

dotenv.config();

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI!);
  console.log("🌱 Connected to MongoDB for seeding...");

  // Clear existing data
  await Promise.all([
    User.deleteMany({}),
    Customer.deleteMany({}),
    Vendor.deleteMany({}),
    DeliveryBoy.deleteMany({}),
    Category.deleteMany({}),
    Brand.deleteMany({}),
    TaxRate.deleteMany({}),
    Plan.deleteMany({}),
    Banner.deleteMany({}),
    Faq.deleteMany({}),
    SystemSetting.deleteMany({}),
  ]);

  console.log("🗑️  Cleared existing data");

  // ─── Admin User ──────────────────────────────────────────────────────────────
  await User.create({
    name: process.env.ADMIN_NAME || "Super Admin",
    email: process.env.ADMIN_EMAIL || "admin@dssnexus.com",
    password: process.env.ADMIN_PASSWORD || "Admin@123456",
    role: "admin",
    status: "active",
    isEmailVerified: true,
  });

  // ─── Sample Vendor ────────────────────────────────────────────────────────────
  const vendorUser = await User.create({
    name: "Sample Vendor",
    email: "vendor@dssnexus.com",
    password: "Vendor@123456",
    role: "vendor",
    status: "active",
    isEmailVerified: true,
  });

  await Vendor.create({
    userId: vendorUser._id,
    businessName: "Sample Store Ltd.",
    isApproved: true,
    commissionRate: 10,
  });

  // ─── Sample Customer ──────────────────────────────────────────────────────────
  const customerUser = await User.create({
    name: "Test Customer",
    email: "customer@dssnexus.com",
    password: "Customer@123456",
    role: "customer",
    status: "active",
    isEmailVerified: true,
  });

  await Customer.create({
    userId: customerUser._id,
    referralCode: "TESTCUST001",
    walletBalance: 500,
  });

  // ─── Sample Delivery Boy ──────────────────────────────────────────────────────
  const deliveryUser = await User.create({
    name: "Delivery Hero",
    email: "delivery@dssnexus.com",
    password: "Delivery@123456",
    role: "delivery",
    status: "active",
    isEmailVerified: true,
  });

  await DeliveryBoy.create({
    userId: deliveryUser._id,
    vehicleType: "bike",
    vehicleNumber: "MH-01-AB-1234",
    kycStatus: "approved",
    isAvailable: true,
  });

  // ─── Categories ───────────────────────────────────────────────────────────────
  const categoriesData = [
    { name: "Fruits & Vegetables", slug: "fruits-vegetables", icon: "🥦" },
    { name: "Dairy & Eggs", slug: "dairy-eggs", icon: "🥚" },
    { name: "Beverages", slug: "beverages", icon: "🥤" },
    { name: "Snacks", slug: "snacks", icon: "🍿" },
    { name: "Bakery", slug: "bakery", icon: "🍞" },
    { name: "Meat & Seafood", slug: "meat-seafood", icon: "🥩" },
    { name: "Personal Care", slug: "personal-care", icon: "🧴" },
    { name: "Home & Kitchen", slug: "home-kitchen", icon: "🍳" },
    { name: "Electronics", slug: "electronics", icon: "📱" },
    { name: "Fashion", slug: "fashion", icon: "👕" },
    { name: "Toys & Games", slug: "toys-games", icon: "🎮" },
    { name: "Health & Wellness", slug: "health-wellness", icon: "💊" },
  ];

  await Category.insertMany(
    categoriesData.map((c, i) => ({ ...c, sortOrder: i, isActive: true }))
  );

  // ─── Brands ───────────────────────────────────────────────────────────────────
  await Brand.insertMany([
    { name: "Amul", slug: "amul", isActive: true },
    { name: "Nestle", slug: "nestle", isActive: true },
    { name: "Britannia", slug: "britannia", isActive: true },
    { name: "ITC", slug: "itc", isActive: true },
    { name: "HUL", slug: "hul", isActive: true },
    { name: "Parle", slug: "parle", isActive: true },
  ]);

  // ─── Tax Rates ────────────────────────────────────────────────────────────────
  await TaxRate.insertMany([
    { name: "GST 0%", rate: 0, isActive: true },
    { name: "GST 5%", rate: 5, isActive: true },
    { name: "GST 12%", rate: 12, isActive: true },
    { name: "GST 18%", rate: 18, isActive: true },
    { name: "GST 28%", rate: 28, isActive: true },
  ]);

  // ─── Subscription Plans ───────────────────────────────────────────────────────
  await Plan.insertMany([
    {
      name: "Starter",
      description: "Perfect for new sellers",
      price: 0,
      duration: 30,
      features: ["Up to 10 products", "Basic analytics", "Email support"],
      maxProducts: 10,
      isActive: true,
      sortOrder: 0,
    },
    {
      name: "Growth",
      description: "For growing businesses",
      price: 999,
      duration: 30,
      features: ["Up to 100 products", "Advanced analytics", "Priority support", "Ad campaigns"],
      maxProducts: 100,
      commissionDiscount: 2,
      isPopular: true,
      isActive: true,
      sortOrder: 1,
    },
    {
      name: "Enterprise",
      description: "For large sellers",
      price: 2999,
      duration: 30,
      features: ["Unlimited products", "Full analytics suite", "Dedicated account manager", "Custom commission rates"],
      commissionDiscount: 5,
      isActive: true,
      sortOrder: 2,
    },
  ]);

  // ─── FAQs ─────────────────────────────────────────────────────────────────────
  await Faq.insertMany([
    { question: "How do I place an order?", answer: "Browse products, add to cart, and proceed to checkout.", sortOrder: 0 },
    { question: "What payment methods are accepted?", answer: "We accept Razorpay, Stripe, COD, and Wallet payments.", sortOrder: 1 },
    { question: "How do I track my order?", answer: "Go to My Orders and click on your order to see live tracking.", sortOrder: 2 },
    { question: "What is the return policy?", answer: "You can return items within 7 days of delivery.", sortOrder: 3 },
    { question: "How does the referral program work?", answer: "Share your referral code. When a friend places their first order, you both earn ₹100.", sortOrder: 4 },
  ]);

  // ─── System Settings ──────────────────────────────────────────────────────────
  await SystemSetting.insertMany([
    { key: "app_name", value: "DSS Nexus Commerce", group: "app", type: "string", isPublic: true },
    { key: "app_logo", value: "", group: "app", type: "string", isPublic: true },
    { key: "currency", value: "INR", group: "app", type: "string", isPublic: true },
    { key: "currency_symbol", value: "₹", group: "app", type: "string", isPublic: true },
    { key: "free_delivery_above", value: 499, group: "delivery", type: "number", isPublic: true },
    { key: "default_delivery_charge", value: 40, group: "delivery", type: "number", isPublic: true },
    { key: "platform_commission", value: 10, group: "finance", type: "number" },
    { key: "min_withdrawal_amount", value: 500, group: "finance", type: "number" },
    { key: "referral_reward", value: 100, group: "referral", type: "number" },
    { key: "maintenance_mode", value: false, group: "system", type: "boolean" },
  ]);

  console.log("✅ Database seeded successfully!");
  console.log("\n🔑 Test Credentials:");
  console.log("   Admin: admin@dssnexus.com / Admin@123456");
  console.log("   Vendor: vendor@dssnexus.com / Vendor@123456");
  console.log("   Customer: customer@dssnexus.com / Customer@123456");
  console.log("   Delivery: delivery@dssnexus.com / Delivery@123456\n");

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
