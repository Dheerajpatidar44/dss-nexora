import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate";
import { getPagination, buildMongoQuery } from "../utils/helpers";
import { ApiResponse } from "../utils/apiResponse";
import { cacheGet, cacheSet } from "../config/redis";

// Models
import { User } from "../models/User.model";
import { Customer } from "../models/Customer.model";
import { Vendor } from "../models/Vendor.model";
import { DeliveryBoy } from "../models/DeliveryBoy.model";
import { Store } from "../models/Store.model";
import { Product } from "../models/Product.model";
import { Order } from "../models/Order.model";
import { Category, Brand, TaxRate } from "../models/Catalog.model";
import {
  Settlement, Withdrawal, WalletTransaction, Referral,
} from "../models/Finance.model";
import {
  Plan, Subscription, Banner, PromoCode, AdCampaign,
  Notification, AuditLog, SystemSetting, DeliveryZone, Faq, CronLog,
} from "../models/Marketing.model";

const router = Router();

// All admin routes require authentication + admin role
router.use(authenticate, authorize("admin"));

// ═══════════════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════════════

router.get("/dashboard", async (req, res) => {
  const cacheKey = "admin:dashboard";
  const cached = await cacheGet(cacheKey);
  if (cached) return ApiResponse.success(res, cached);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const [
    totalOrders, todayOrders, monthlyOrders,
    totalRevenue, todayRevenue, monthlyRevenue,
    totalCustomers, newCustomers,
    totalVendors, activeVendors,
    totalProducts, activeProducts,
    pendingWithdrawals, pendingSettlements,
    recentOrders,
  ] = await Promise.all([
    Order.countDocuments(),
    Order.countDocuments({ createdAt: { $gte: today } }),
    Order.countDocuments({ createdAt: { $gte: thisMonth } }),
    Order.aggregate([{ $group: { _id: null, total: { $sum: "$total" } } }]),
    Order.aggregate([{ $match: { createdAt: { $gte: today } } }, { $group: { _id: null, total: { $sum: "$total" } } }]),
    Order.aggregate([{ $match: { createdAt: { $gte: thisMonth } } }, { $group: { _id: null, total: { $sum: "$total" } } }]),
    Customer.countDocuments(),
    Customer.countDocuments({ createdAt: { $gte: today } }),
    Vendor.countDocuments(),
    Vendor.countDocuments({ isApproved: true }),
    Product.countDocuments(),
    Product.countDocuments({ status: "active", isApproved: true }),
    Withdrawal.countDocuments({ status: "pending" }),
    Settlement.countDocuments({ status: "pending" }),
    Order.find().sort({ createdAt: -1 }).limit(5).populate("customerId", "name email"),
  ]);

  const data = {
    stats: {
      orders: { total: totalOrders, today: todayOrders, thisMonth: monthlyOrders },
      revenue: {
        total: totalRevenue[0]?.total || 0,
        today: todayRevenue[0]?.total || 0,
        thisMonth: monthlyRevenue[0]?.total || 0,
      },
      customers: { total: totalCustomers, newToday: newCustomers },
      vendors: { total: totalVendors, active: activeVendors },
      products: { total: totalProducts, active: activeProducts },
      pending: { withdrawals: pendingWithdrawals, settlements: pendingSettlements },
    },
    recentOrders,
  };

  await cacheSet(cacheKey, data, 300); // cache 5 min
  ApiResponse.success(res, data);
});

// Revenue chart data (last 30 days)
router.get("/dashboard/revenue-chart", async (_req, res) => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const data = await Order.aggregate([
    { $match: { createdAt: { $gte: thirtyDaysAgo }, paymentStatus: "paid" } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        revenue: { $sum: "$total" },
        orders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  ApiResponse.success(res, data);
});

// ═══════════════════════════════════════════════════════════════
// ORDERS
// ═══════════════════════════════════════════════════════════════

router.get("/orders", async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const { status, paymentStatus, search, startDate, endDate, vendorId } = req.query as Record<string, string>;

  const filter: Record<string, unknown> = {};
  if (status) filter.status = status;
  if (paymentStatus) filter.paymentStatus = paymentStatus;
  if (vendorId) filter.vendorId = vendorId;
  if (search) filter.$or = [{ orderNumber: { $regex: search, $options: "i" } }];
  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) (filter.createdAt as Record<string, unknown>).$gte = new Date(startDate);
    if (endDate) (filter.createdAt as Record<string, unknown>).$lte = new Date(endDate);
  }

  const [orders, total] = await Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit)
      .populate("customerId", "name email phone"),
    Order.countDocuments(filter),
  ]);

  ApiResponse.paginate(res, orders, total, page, limit);
});

router.get("/orders/:id", async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("customerId", "name email phone")
    .populate("vendorId", "businessName")
    .populate("deliveryBoyId", "name phone");
  if (!order) return ApiResponse.notFound(res, "Order");
  ApiResponse.success(res, order);
});

router.patch("/orders/:id/status", async (req, res) => {
  const { status, message } = req.body;
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      status,
      $push: { timeline: { status, message: message || status, timestamp: new Date(), updatedBy: req.user?._id } },
    },
    { new: true }
  );
  if (!order) return ApiResponse.notFound(res, "Order");
  ApiResponse.success(res, order, "Order status updated");
});

// ═══════════════════════════════════════════════════════════════
// CUSTOMERS
// ═══════════════════════════════════════════════════════════════

router.get("/customers", async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const { search, status } = req.query as Record<string, string>;

  const userFilter: Record<string, unknown> = { role: "customer" };
  if (status) userFilter.status = status;
  if (search) {
    userFilter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const [users, total] = await Promise.all([
    User.find(userFilter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(userFilter),
  ]);

  ApiResponse.paginate(res, users, total, page, limit);
});

router.get("/customers/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return ApiResponse.notFound(res, "Customer");
  const profile = await Customer.findOne({ userId: user._id });
  const orders = await Order.find({ customerId: profile?._id }).sort({ createdAt: -1 }).limit(10);
  ApiResponse.success(res, { user, profile, recentOrders: orders });
});

router.patch("/customers/:id/status", async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  if (!user) return ApiResponse.notFound(res, "Customer");
  ApiResponse.success(res, user, "Customer status updated");
});

// ═══════════════════════════════════════════════════════════════
// VENDORS / SELLERS
// ═══════════════════════════════════════════════════════════════

router.get("/vendors", async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const { search, isApproved } = req.query as Record<string, string>;

  const filter: Record<string, unknown> = {};
  if (isApproved !== undefined) filter.isApproved = isApproved === "true";

  const [vendors, total] = await Promise.all([
    Vendor.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit)
      .populate("userId", "name email phone avatar status"),
    Vendor.countDocuments(filter),
  ]);

  ApiResponse.paginate(res, vendors, total, page, limit);
});

router.patch("/vendors/:id/approve", async (req, res) => {
  const vendor = await Vendor.findByIdAndUpdate(
    req.params.id,
    { isApproved: true, approvedAt: new Date(), approvedBy: req.user?._id },
    { new: true }
  );
  if (!vendor) return ApiResponse.notFound(res, "Vendor");

  // Activate user account
  await User.findByIdAndUpdate(vendor.userId, { status: "active" });
  ApiResponse.success(res, vendor, "Vendor approved");
});

router.patch("/vendors/:id/reject", async (req, res) => {
  const vendor = await Vendor.findByIdAndUpdate(
    req.params.id,
    { isApproved: false },
    { new: true }
  );
  if (!vendor) return ApiResponse.notFound(res, "Vendor");
  await User.findByIdAndUpdate(vendor.userId, { status: "inactive" });
  ApiResponse.success(res, vendor, "Vendor rejected");
});

// ═══════════════════════════════════════════════════════════════
// CATEGORIES
// ═══════════════════════════════════════════════════════════════

router.get("/categories", async (req, res) => {
  const categories = await Category.find().sort({ sortOrder: 1, name: 1 });
  ApiResponse.success(res, categories);
});

router.post("/categories", async (req, res) => {
  const { name, slug, image, icon, description, parentId, sortOrder } = req.body;
  const category = await Category.create({ name, slug, image, icon, description, parentId, sortOrder });
  ApiResponse.created(res, category);
});

router.put("/categories/:id", async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!category) return ApiResponse.notFound(res, "Category");
  ApiResponse.success(res, category, "Category updated");
});

router.delete("/categories/:id", async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  ApiResponse.success(res, null, "Category deleted");
});

// ═══════════════════════════════════════════════════════════════
// PRODUCTS
// ═══════════════════════════════════════════════════════════════

router.get("/products", async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const { search, status, isApproved, vendorId, categoryId } = req.query as Record<string, string>;

  const filter: Record<string, unknown> = {};
  if (status) filter.status = status;
  if (isApproved !== undefined) filter.isApproved = isApproved === "true";
  if (vendorId) filter.vendorId = vendorId;
  if (categoryId) filter.categoryId = categoryId;
  if (search) filter.$text = { $search: search };

  const [products, total] = await Promise.all([
    Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit)
      .populate("categoryId", "name").populate("vendorId", "businessName"),
    Product.countDocuments(filter),
  ]);

  ApiResponse.paginate(res, products, total, page, limit);
});

router.patch("/products/:id/approve", async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { isApproved: true, status: "active", approvedBy: req.user?._id },
    { new: true }
  );
  if (!product) return ApiResponse.notFound(res, "Product");
  ApiResponse.success(res, product, "Product approved");
});

router.delete("/products/:id", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  ApiResponse.success(res, null, "Product deleted");
});

// ═══════════════════════════════════════════════════════════════
// BRANDS
// ═══════════════════════════════════════════════════════════════

router.get("/brands", async (_req, res) => {
  const brands = await Brand.find().sort({ name: 1 });
  ApiResponse.success(res, brands);
});

router.post("/brands", async (req, res) => {
  const brand = await Brand.create(req.body);
  ApiResponse.created(res, brand);
});

router.put("/brands/:id", async (req, res) => {
  const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!brand) return ApiResponse.notFound(res, "Brand");
  ApiResponse.success(res, brand);
});

router.delete("/brands/:id", async (req, res) => {
  await Brand.findByIdAndDelete(req.params.id);
  ApiResponse.success(res, null, "Brand deleted");
});

// ═══════════════════════════════════════════════════════════════
// DELIVERY BOYS
// ═══════════════════════════════════════════════════════════════

router.get("/delivery-boys", async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const deliveryBoys = await DeliveryBoy.find().sort({ createdAt: -1 }).skip(skip).limit(limit)
    .populate("userId", "name email phone avatar status");
  const total = await DeliveryBoy.countDocuments();
  ApiResponse.paginate(res, deliveryBoys, total, page, limit);
});

router.patch("/delivery-boys/:id/status", async (req, res) => {
  const db = await DeliveryBoy.findByIdAndUpdate(req.params.id, { isAvailable: req.body.isAvailable }, { new: true });
  if (!db) return ApiResponse.notFound(res, "Delivery Boy");
  ApiResponse.success(res, db);
});

// ═══════════════════════════════════════════════════════════════
// BANNERS
// ═══════════════════════════════════════════════════════════════

router.get("/banners", async (_req, res) => {
  const banners = await Banner.find().sort({ sortOrder: 1 });
  ApiResponse.success(res, banners);
});

router.post("/banners", async (req, res) => {
  const banner = await Banner.create(req.body);
  ApiResponse.created(res, banner);
});

router.put("/banners/:id", async (req, res) => {
  const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!banner) return ApiResponse.notFound(res, "Banner");
  ApiResponse.success(res, banner);
});

router.delete("/banners/:id", async (req, res) => {
  await Banner.findByIdAndDelete(req.params.id);
  ApiResponse.success(res, null, "Banner deleted");
});

// ═══════════════════════════════════════════════════════════════
// PROMO CODES
// ═══════════════════════════════════════════════════════════════

router.get("/promo-codes", async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const [promos, total] = await Promise.all([
    PromoCode.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
    PromoCode.countDocuments(),
  ]);
  ApiResponse.paginate(res, promos, total, page, limit);
});

router.post("/promo-codes", async (req, res) => {
  const promo = await PromoCode.create({ ...req.body, createdBy: req.user?._id });
  ApiResponse.created(res, promo);
});

router.put("/promo-codes/:id", async (req, res) => {
  const promo = await PromoCode.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!promo) return ApiResponse.notFound(res, "Promo Code");
  ApiResponse.success(res, promo);
});

router.delete("/promo-codes/:id", async (req, res) => {
  await PromoCode.findByIdAndDelete(req.params.id);
  ApiResponse.success(res, null, "Promo code deleted");
});

// ═══════════════════════════════════════════════════════════════
// SUBSCRIPTIONS & PLANS
// ═══════════════════════════════════════════════════════════════

router.get("/plans", async (_req, res) => {
  const plans = await Plan.find().sort({ sortOrder: 1 });
  ApiResponse.success(res, plans);
});

router.post("/plans", async (req, res) => {
  const plan = await Plan.create(req.body);
  ApiResponse.created(res, plan);
});

router.put("/plans/:id", async (req, res) => {
  const plan = await Plan.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!plan) return ApiResponse.notFound(res, "Plan");
  ApiResponse.success(res, plan);
});

router.delete("/plans/:id", async (req, res) => {
  await Plan.findByIdAndDelete(req.params.id);
  ApiResponse.success(res, null, "Plan deleted");
});

router.get("/subscriptions", async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const [subs, total] = await Promise.all([
    Subscription.find().sort({ createdAt: -1 }).skip(skip).limit(limit)
      .populate("vendorId", "businessName").populate("planId", "name price"),
    Subscription.countDocuments(),
  ]);
  ApiResponse.paginate(res, subs, total, page, limit);
});

// ═══════════════════════════════════════════════════════════════
// SETTLEMENTS & WITHDRAWALS
// ═══════════════════════════════════════════════════════════════

router.get("/settlements", async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const { status } = req.query as Record<string, string>;
  const filter = status ? { status } : {};
  const [settlements, total] = await Promise.all([
    Settlement.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit)
      .populate("vendorId", "businessName"),
    Settlement.countDocuments(filter),
  ]);
  ApiResponse.paginate(res, settlements, total, page, limit);
});

router.get("/withdrawals", async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const { status } = req.query as Record<string, string>;
  const filter = status ? { status } : {};
  const [withdrawals, total] = await Promise.all([
    Withdrawal.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit)
      .populate("userId", "name email"),
    Withdrawal.countDocuments(filter),
  ]);
  ApiResponse.paginate(res, withdrawals, total, page, limit);
});

router.patch("/withdrawals/:id/approve", async (req, res) => {
  const withdrawal = await Withdrawal.findByIdAndUpdate(
    req.params.id,
    { status: "approved", processedBy: req.user?._id },
    { new: true }
  );
  if (!withdrawal) return ApiResponse.notFound(res, "Withdrawal");
  ApiResponse.success(res, withdrawal, "Withdrawal approved");
});

router.patch("/withdrawals/:id/reject", async (req, res) => {
  const withdrawal = await Withdrawal.findByIdAndUpdate(
    req.params.id,
    { status: "rejected", rejectionReason: req.body.reason, processedBy: req.user?._id },
    { new: true }
  );
  if (!withdrawal) return ApiResponse.notFound(res, "Withdrawal");
  ApiResponse.success(res, withdrawal, "Withdrawal rejected");
});

// ═══════════════════════════════════════════════════════════════
// DELIVERY ZONES
// ═══════════════════════════════════════════════════════════════

router.get("/delivery-zones", async (_req, res) => {
  const zones = await DeliveryZone.find().sort({ name: 1 });
  ApiResponse.success(res, zones);
});

router.post("/delivery-zones", async (req, res) => {
  const zone = await DeliveryZone.create(req.body);
  ApiResponse.created(res, zone);
});

router.put("/delivery-zones/:id", async (req, res) => {
  const zone = await DeliveryZone.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!zone) return ApiResponse.notFound(res, "Delivery Zone");
  ApiResponse.success(res, zone);
});

router.delete("/delivery-zones/:id", async (req, res) => {
  await DeliveryZone.findByIdAndDelete(req.params.id);
  ApiResponse.success(res, null, "Zone deleted");
});

// ═══════════════════════════════════════════════════════════════
// FAQs
// ═══════════════════════════════════════════════════════════════

router.get("/faqs", async (_req, res) => {
  const faqs = await Faq.find().sort({ sortOrder: 1 });
  ApiResponse.success(res, faqs);
});

router.post("/faqs", async (req, res) => {
  const faq = await Faq.create(req.body);
  ApiResponse.created(res, faq);
});

router.put("/faqs/:id", async (req, res) => {
  const faq = await Faq.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!faq) return ApiResponse.notFound(res, "FAQ");
  ApiResponse.success(res, faq);
});

router.delete("/faqs/:id", async (req, res) => {
  await Faq.findByIdAndDelete(req.params.id);
  ApiResponse.success(res, null, "FAQ deleted");
});

// ═══════════════════════════════════════════════════════════════
// SYSTEM SETTINGS
// ═══════════════════════════════════════════════════════════════

router.get("/settings", async (req, res) => {
  const { group } = req.query as { group?: string };
  const filter = group ? { group } : {};
  const settings = await SystemSetting.find(filter);
  const result: Record<string, unknown> = {};
  settings.forEach((s) => { result[s.key] = s.value; });
  ApiResponse.success(res, result);
});

router.put("/settings", async (req, res) => {
  const updates = req.body as Record<string, unknown>;
  const ops = Object.entries(updates).map(([key, value]) => ({
    updateOne: {
      filter: { key },
      update: { $set: { value: value as any, updatedBy: req.user?._id as any } },
      upsert: true,
    },
  }));
  await SystemSetting.bulkWrite(ops as any);
  ApiResponse.success(res, null, "Settings updated");
});

// ═══════════════════════════════════════════════════════════════
// NOTIFICATIONS (BROADCAST)
// ═══════════════════════════════════════════════════════════════

router.post("/notifications/broadcast", async (req, res) => {
  const { title, message, type, userRole } = req.body;
  const userFilter = userRole ? { role: userRole } : {};
  const users = await User.find(userFilter).select("_id");

  const notifications = users.map((u) => ({
    userId: u._id,
    title,
    message,
    type: type || "system",
    isRead: false,
  }));

  await Notification.insertMany(notifications);
  ApiResponse.success(res, { sent: notifications.length }, "Notifications sent");
});

// ═══════════════════════════════════════════════════════════════
// CRON MONITOR
// ═══════════════════════════════════════════════════════════════

router.get("/cron-logs", async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const [logs, total] = await Promise.all([
    CronLog.find().sort({ startedAt: -1 }).skip(skip).limit(limit),
    CronLog.countDocuments(),
  ]);
  ApiResponse.paginate(res, logs, total, page, limit);
});

// ═══════════════════════════════════════════════════════════════
// WALLET TRANSACTIONS
// ═══════════════════════════════════════════════════════════════

router.get("/wallet-transactions", async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const [txns, total] = await Promise.all([
    WalletTransaction.find().sort({ createdAt: -1 }).skip(skip).limit(limit)
      .populate("userId", "name email"),
    WalletTransaction.countDocuments(),
  ]);
  ApiResponse.paginate(res, txns, total, page, limit);
});

// ═══════════════════════════════════════════════════════════════
// REFERRALS
// ═══════════════════════════════════════════════════════════════

router.get("/referrals", async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const [referrals, total] = await Promise.all([
    Referral.find().sort({ createdAt: -1 }).skip(skip).limit(limit)
      .populate("referrerId", "name email").populate("refereeId", "name email"),
    Referral.countDocuments(),
  ]);
  ApiResponse.paginate(res, referrals, total, page, limit);
});

// ═══════════════════════════════════════════════════════════════
// TAX RATES
// ═══════════════════════════════════════════════════════════════

router.get("/tax-rates", async (_req, res) => {
  const taxes = await TaxRate.find().sort({ name: 1 });
  ApiResponse.success(res, taxes);
});

router.post("/tax-rates", async (req, res) => {
  const tax = await TaxRate.create(req.body);
  ApiResponse.created(res, tax);
});

router.put("/tax-rates/:id", async (req, res) => {
  const tax = await TaxRate.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!tax) return ApiResponse.notFound(res, "Tax Rate");
  ApiResponse.success(res, tax);
});

router.delete("/tax-rates/:id", async (req, res) => {
  await TaxRate.findByIdAndDelete(req.params.id);
  ApiResponse.success(res, null, "Tax rate deleted");
});

// ═══════════════════════════════════════════════════════════════
// AD CAMPAIGNS
// ═══════════════════════════════════════════════════════════════

router.get("/ad-campaigns", async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const [campaigns, total] = await Promise.all([
    AdCampaign.find().sort({ createdAt: -1 }).skip(skip).limit(limit)
      .populate("vendorId", "businessName"),
    AdCampaign.countDocuments(),
  ]);
  ApiResponse.paginate(res, campaigns, total, page, limit);
});

router.patch("/ad-campaigns/:id/status", async (req, res) => {
  const campaign = await AdCampaign.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );
  if (!campaign) return ApiResponse.notFound(res, "Campaign");
  ApiResponse.success(res, campaign);
});

export default router;
