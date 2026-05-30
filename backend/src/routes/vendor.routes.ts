import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { ApiResponse } from "../utils/apiResponse";
import { getPagination } from "../utils/helpers";
import { generateSlug, generateSKU } from "../utils/helpers";

// Models
import { Vendor } from "../models/Vendor.model";
import { Store } from "../models/Store.model";
import { Product } from "../models/Product.model";
import { Order } from "../models/Order.model";
import { Category, Brand, Attribute, TaxRate } from "../models/Catalog.model";
import { Settlement, Withdrawal, WalletTransaction } from "../models/Finance.model";
import { Plan, Subscription, AdCampaign, Notification } from "../models/Marketing.model";
import { User } from "../models/User.model";

const router = Router();
router.use(authenticate, authorize("vendor"));

// ─── Helper: Get vendor profile ───────────────────────────────────────────────
const getVendor = async (userId: string) => {
  const vendor = await Vendor.findOne({ userId });
  if (!vendor) throw new Error("Vendor profile not found");
  return vendor;
};

// ═══════════════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════════════

router.get("/dashboard", async (req, res) => {
  const vendor = await getVendor(req.user!._id);
  const store = await Store.findOne({ vendorId: vendor._id });

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const [
    totalOrders, todayOrders,
    totalRevenue, monthRevenue,
    activeProducts, pendingWithdrawals, activeSub,
  ] = await Promise.all([
    Order.countDocuments({ vendorId: vendor._id }),
    Order.countDocuments({ vendorId: vendor._id, createdAt: { $gte: today } }),
    Order.aggregate([
      { $match: { vendorId: vendor._id, paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]),
    Order.aggregate([
      { $match: { vendorId: vendor._id, paymentStatus: "paid", createdAt: { $gte: thisMonth } } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]),
    Product.countDocuments({ vendorId: vendor._id, status: "active" }),
    Withdrawal.countDocuments({ userId: req.user!._id, status: "pending" }),
    Subscription.findOne({ vendorId: vendor._id, status: "active" }).populate("planId"),
  ]);

  ApiResponse.success(res, {
    vendor,
    store,
    stats: {
      orders: { total: totalOrders, today: todayOrders },
      revenue: { total: totalRevenue[0]?.total || 0, thisMonth: monthRevenue[0]?.total || 0 },
      walletBalance: vendor.walletBalance,
      activeProducts,
      pendingWithdrawals,
    },
    subscription: activeSub,
  });
});

// ═══════════════════════════════════════════════════════════════
// ORDERS
// ═══════════════════════════════════════════════════════════════

router.get("/orders", async (req, res) => {
  const vendor = await getVendor(req.user!._id);
  const { page, limit, skip } = getPagination(req.query);
  const { status } = req.query as Record<string, string>;

  const filter: Record<string, unknown> = { vendorId: vendor._id };
  if (status) filter.status = status;

  const [orders, total] = await Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Order.countDocuments(filter),
  ]);

  ApiResponse.paginate(res, orders, total, page, limit);
});

router.patch("/orders/:id/status", async (req, res) => {
  const vendor = await getVendor(req.user!._id);
  const { status } = req.body;

  const allowedStatuses = ["confirmed", "processing", "packed", "shipped"];
  if (!allowedStatuses.includes(status)) {
    return ApiResponse.badRequest(res, "Invalid status transition");
  }

  const order = await Order.findOneAndUpdate(
    { _id: req.params.id, vendorId: vendor._id },
    { status, $push: { timeline: { status, message: status, timestamp: new Date() } } },
    { new: true }
  );
  if (!order) return ApiResponse.notFound(res, "Order");
  ApiResponse.success(res, order, "Order status updated");
});

// ═══════════════════════════════════════════════════════════════
// PRODUCTS
// ═══════════════════════════════════════════════════════════════

router.get("/products", async (req, res) => {
  const vendor = await getVendor(req.user!._id);
  const { page, limit, skip } = getPagination(req.query);
  const { status, search } = req.query as Record<string, string>;

  const filter: Record<string, unknown> = { vendorId: vendor._id };
  if (status) filter.status = status;
  if (search) filter.$text = { $search: search };

  const [products, total] = await Promise.all([
    Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit)
      .populate("categoryId", "name").populate("brandId", "name"),
    Product.countDocuments(filter),
  ]);

  ApiResponse.paginate(res, products, total, page, limit);
});

router.post("/products", async (req, res) => {
  const vendor = await getVendor(req.user!._id);
  const store = await Store.findOne({ vendorId: vendor._id });
  if (!store) return ApiResponse.badRequest(res, "Please create a store first");

  const slug = generateSlug(req.body.name) + "-" + Date.now();
  const sku = generateSKU(req.body.name);

  const product = await Product.create({
    ...req.body,
    slug,
    sku,
    vendorId: vendor._id,
    storeId: store._id,
    isApproved: false,
    status: "draft",
  });

  // Update product count
  await Store.findByIdAndUpdate(store._id, { $inc: { productCount: 1 } });

  ApiResponse.created(res, product, "Product created. Pending admin approval.");
});

router.put("/products/:id", async (req, res) => {
  const vendor = await getVendor(req.user!._id);
  const product = await Product.findOneAndUpdate(
    { _id: req.params.id, vendorId: vendor._id },
    { ...req.body, isApproved: false },
    { new: true, runValidators: true }
  );
  if (!product) return ApiResponse.notFound(res, "Product");
  ApiResponse.success(res, product, "Product updated. Pending re-approval.");
});

router.delete("/products/:id", async (req, res) => {
  const vendor = await getVendor(req.user!._id);
  await Product.findOneAndDelete({ _id: req.params.id, vendorId: vendor._id });
  ApiResponse.success(res, null, "Product deleted");
});

// ═══════════════════════════════════════════════════════════════
// STORE
// ═══════════════════════════════════════════════════════════════

router.get("/store", async (req, res) => {
  const vendor = await getVendor(req.user!._id);
  const store = await Store.findOne({ vendorId: vendor._id });
  ApiResponse.success(res, { store, vendor });
});

router.post("/store", async (req, res) => {
  const vendor = await getVendor(req.user!._id);
  const exists = await Store.findOne({ vendorId: vendor._id });
  if (exists) return ApiResponse.conflict(res, "Store already exists");

  const slug = generateSlug(req.body.name) + "-" + Date.now();
  const store = await Store.create({ ...req.body, slug, vendorId: vendor._id });
  ApiResponse.created(res, store);
});

router.put("/store", async (req, res) => {
  const vendor = await getVendor(req.user!._id);
  const store = await Store.findOneAndUpdate(
    { vendorId: vendor._id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!store) return ApiResponse.notFound(res, "Store");
  ApiResponse.success(res, store, "Store updated");
});

// ═══════════════════════════════════════════════════════════════
// FINANCE
// ═══════════════════════════════════════════════════════════════

router.get("/wallet", async (req, res) => {
  const vendor = await getVendor(req.user!._id);
  const transactions = await WalletTransaction.find({ userId: req.user!._id })
    .sort({ createdAt: -1 }).limit(20);
  ApiResponse.success(res, { balance: vendor.walletBalance, transactions });
});

router.get("/settlements", async (req, res) => {
  const vendor = await getVendor(req.user!._id);
  const { page, limit, skip } = getPagination(req.query);
  const [settlements, total] = await Promise.all([
    Settlement.find({ vendorId: vendor._id }).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Settlement.countDocuments({ vendorId: vendor._id }),
  ]);
  ApiResponse.paginate(res, settlements, total, page, limit);
});

router.post("/withdrawals", async (req, res) => {
  const vendor = await getVendor(req.user!._id);
  const minAmount = Number(process.env.MIN_WITHDRAWAL_AMOUNT) || 500;

  if (req.body.amount > vendor.walletBalance) {
    return ApiResponse.badRequest(res, "Insufficient wallet balance");
  }
  if (req.body.amount < minAmount) {
    return ApiResponse.badRequest(res, `Minimum withdrawal amount is ₹${minAmount}`);
  }

  const withdrawal = await Withdrawal.create({
    userId: req.user!._id,
    userType: "vendor",
    ...req.body,
  });
  ApiResponse.created(res, withdrawal);
});

router.get("/withdrawals", async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const [withdrawals, total] = await Promise.all([
    Withdrawal.find({ userId: req.user!._id }).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Withdrawal.countDocuments({ userId: req.user!._id }),
  ]);
  ApiResponse.paginate(res, withdrawals, total, page, limit);
});

// ═══════════════════════════════════════════════════════════════
// SUBSCRIPTIONS
// ═══════════════════════════════════════════════════════════════

router.get("/subscriptions/plans", async (_req, res) => {
  const plans = await Plan.find({ isActive: true }).sort({ sortOrder: 1 });
  ApiResponse.success(res, plans);
});

router.get("/subscriptions/current", async (req, res) => {
  const vendor = await getVendor(req.user!._id);
  const sub = await Subscription.findOne({ vendorId: vendor._id, status: "active" })
    .populate("planId");
  ApiResponse.success(res, sub);
});

router.get("/subscriptions/history", async (req, res) => {
  const vendor = await getVendor(req.user!._id);
  const subs = await Subscription.find({ vendorId: vendor._id })
    .sort({ createdAt: -1 }).populate("planId");
  ApiResponse.success(res, subs);
});

// ═══════════════════════════════════════════════════════════════
// AD CAMPAIGNS
// ═══════════════════════════════════════════════════════════════

router.get("/ad-campaigns", async (req, res) => {
  const vendor = await getVendor(req.user!._id);
  const campaigns = await AdCampaign.find({ vendorId: vendor._id }).sort({ createdAt: -1 });
  ApiResponse.success(res, campaigns);
});

router.post("/ad-campaigns", async (req, res) => {
  const vendor = await getVendor(req.user!._id);
  const campaign = await AdCampaign.create({
    ...req.body,
    vendorId: vendor._id,
    status: "draft",
  });
  ApiResponse.created(res, campaign);
});

router.put("/ad-campaigns/:id", async (req, res) => {
  const vendor = await getVendor(req.user!._id);
  const campaign = await AdCampaign.findOneAndUpdate(
    { _id: req.params.id, vendorId: vendor._id },
    req.body,
    { new: true }
  );
  if (!campaign) return ApiResponse.notFound(res, "Campaign");
  ApiResponse.success(res, campaign);
});

// ═══════════════════════════════════════════════════════════════
// CATEGORIES (Vendor-visible)
// ═══════════════════════════════════════════════════════════════

router.get("/categories", async (_req, res) => {
  const categories = await Category.find({ isActive: true }).sort({ name: 1 });
  ApiResponse.success(res, categories);
});

// ═══════════════════════════════════════════════════════════════
// NOTIFICATIONS
// ═══════════════════════════════════════════════════════════════

router.get("/notifications", async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const [notifs, total] = await Promise.all([
    Notification.find({ userId: req.user!._id }).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Notification.countDocuments({ userId: req.user!._id }),
  ]);
  ApiResponse.paginate(res, notifs, total, page, limit);
});

router.patch("/notifications/:id/read", async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
  ApiResponse.success(res, null, "Marked as read");
});

// ═══════════════════════════════════════════════════════════════
// PROFILE
// ═══════════════════════════════════════════════════════════════

router.get("/profile", async (req, res) => {
  const user = await User.findById(req.user!._id);
  const vendor = await getVendor(req.user!._id);
  ApiResponse.success(res, { user, vendor });
});

router.put("/profile", async (req, res) => {
  const { name, phone, avatar, businessName, gstNumber, panNumber, bankAccountName, bankAccountNumber, bankIfscCode, bankName } = req.body;

  const [user, vendor] = await Promise.all([
    User.findByIdAndUpdate(req.user!._id, { name, phone, avatar }, { new: true }),
    Vendor.findOneAndUpdate({ userId: req.user!._id }, { businessName, gstNumber, panNumber, bankAccountName, bankAccountNumber, bankIfscCode, bankName }, { new: true }),
  ]);

  ApiResponse.success(res, { user, vendor }, "Profile updated");
});

export default router;
