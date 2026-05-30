import { Router } from "express";
import { authenticate, optionalAuth } from "../middleware/auth.middleware";
import { ApiResponse } from "../utils/apiResponse";
import { getPagination, generateOrderNumber } from "../utils/helpers";
import { cacheGet, cacheSet } from "../config/redis";

import { User } from "../models/User.model";
import { Customer } from "../models/Customer.model";
import { Product } from "../models/Product.model";
import { Category } from "../models/Catalog.model";
import { Store } from "../models/Store.model";
import { Brand } from "../models/Catalog.model";
import { Order } from "../models/Order.model";
import { PromoCode, Banner, Faq, Notification } from "../models/Marketing.model";
import { Wallet, WalletTransaction, Referral } from "../models/Finance.model";
import { BadRequestError, NotFoundError } from "../utils/errors";

interface CartItem { productId: string; quantity: number; variantId?: string; price: number; }
interface Address { id?: string; name: string; phone: string; line1: string; city: string; state: string; pincode: string; country: string; }

// In-memory cart store (production: use Redis)
const userCarts = new Map<string, CartItem[]>();
const userAddresses = new Map<string, Address[]>();

const router = Router();

// ═══════════════════════════════════════════════════════════════
// PUBLIC ROUTES (no auth needed)
// ═══════════════════════════════════════════════════════════════

// Home page data
router.get("/home", async (_req, res) => {
  const cacheKey = "customer:home";
  const cached = await cacheGet(cacheKey);
  if (cached) return ApiResponse.success(res, cached);

  const [categories, featuredProducts, flashSaleProducts, banners, featuredStores, faqs] =
    await Promise.all([
      Category.find({ isActive: true, parentId: null }).sort({ sortOrder: 1 }).limit(12),
      Product.find({ isFeatured: true, status: "active", isApproved: true })
        .sort({ rating: -1 }).limit(12).populate("categoryId", "name").populate("brandId", "name"),
      Product.find({ isFlashSale: true, status: "active", isApproved: true, flashSaleEndsAt: { $gt: new Date() } })
        .sort({ createdAt: -1 }).limit(10),
      Banner.find({ isActive: true, $or: [{ endDate: null }, { endDate: { $gt: new Date() } }] })
        .sort({ sortOrder: 1 }).limit(8),
      Store.find({ isActive: true, isVerified: true }).sort({ rating: -1 }).limit(8),
      Faq.find({ isActive: true }).sort({ sortOrder: 1 }).limit(10),
    ]);

  const data = { categories, featuredProducts, flashSaleProducts, banners, featuredStores, faqs };
  await cacheSet(cacheKey, data, 300);
  ApiResponse.success(res, data);
});

// Categories
router.get("/categories", async (_req, res) => {
  const categories = await Category.find({ isActive: true }).sort({ sortOrder: 1 });
  ApiResponse.success(res, categories);
});

router.get("/categories/:slug", async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug, isActive: true });
  if (!category) return ApiResponse.notFound(res, "Category");
  const children = await Category.find({ parentId: category._id, isActive: true });
  ApiResponse.success(res, { category, children });
});

// Products list with full filtering
router.get("/products", async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const {
    search, categoryId, brandId, vendorId, storeId,
    minPrice, maxPrice, rating, sortBy = "createdAt",
    sortOrder = "desc", isFeatured, isFlashSale,
  } = req.query as Record<string, string>;

  const filter: Record<string, unknown> = { status: "active", isApproved: true };
  if (categoryId) filter.categoryId = categoryId;
  if (brandId) filter.brandId = brandId;
  if (vendorId) filter.vendorId = vendorId;
  if (storeId) filter.storeId = storeId;
  if (isFeatured === "true") filter.isFeatured = true;
  if (isFlashSale === "true") {
    filter.isFlashSale = true;
    filter.flashSaleEndsAt = { $gt: new Date() };
  }
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) (filter.price as Record<string, number>).$gte = Number(minPrice);
    if (maxPrice) (filter.price as Record<string, number>).$lte = Number(maxPrice);
  }
  if (rating) filter.rating = { $gte: Number(rating) };
  if (search) filter.$text = { $search: search };

  const sort: Record<string, 1 | -1> = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

  const [products, total] = await Promise.all([
    Product.find(filter).sort(sort).skip(skip).limit(limit)
      .populate("categoryId", "name slug")
      .populate("brandId", "name logo"),
    Product.countDocuments(filter),
  ]);

  ApiResponse.paginate(res, products, total, page, limit);
});

// Product detail
router.get("/products/:slug", async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug, status: "active", isApproved: true })
    .populate("categoryId", "name slug")
    .populate("brandId", "name logo")
    .populate("storeId", "name logo rating deliveryTime");

  if (!product) return ApiResponse.notFound(res, "Product");

  // Get related products
  const related = await Product.find({
    categoryId: product.categoryId,
    _id: { $ne: product._id },
    status: "active",
    isApproved: true,
  }).limit(8);

  ApiResponse.success(res, { product, related });
});

// Stores
router.get("/stores", async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const [stores, total] = await Promise.all([
    Store.find({ isActive: true }).sort({ rating: -1 }).skip(skip).limit(limit),
    Store.countDocuments({ isActive: true }),
  ]);
  ApiResponse.paginate(res, stores, total, page, limit);
});

router.get("/stores/:slug", async (req, res) => {
  const store = await Store.findOne({ slug: req.params.slug, isActive: true });
  if (!store) return ApiResponse.notFound(res, "Store");
  const products = await Product.find({ storeId: store._id, status: "active", isApproved: true })
    .limit(20);
  ApiResponse.success(res, { store, products });
});

// Brands
router.get("/brands", async (_req, res) => {
  const brands = await Brand.find({ isActive: true }).sort({ name: 1 });
  ApiResponse.success(res, brands);
});

// FAQs
router.get("/faqs", async (_req, res) => {
  const faqs = await Faq.find({ isActive: true }).sort({ sortOrder: 1 });
  ApiResponse.success(res, faqs);
});

// ═══════════════════════════════════════════════════════════════
// COUPON VALIDATION (public)
// ═══════════════════════════════════════════════════════════════

router.post("/coupons/validate", optionalAuth, async (req, res) => {
  const { code, orderAmount } = req.body;
  const promo = await PromoCode.findOne({ code: code.toUpperCase(), isActive: true });

  if (!promo) return ApiResponse.notFound(res, "Coupon");
  if (promo.expiresAt && promo.expiresAt < new Date()) {
    return ApiResponse.badRequest(res, "Coupon has expired");
  }
  if (promo.usageLimit && promo.usedCount >= promo.usageLimit) {
    return ApiResponse.badRequest(res, "Coupon usage limit reached");
  }
  if (orderAmount < promo.minOrderAmount) {
    return ApiResponse.badRequest(res, `Minimum order amount is ₹${promo.minOrderAmount}`);
  }

  let discount = promo.type === "percent"
    ? (orderAmount * promo.value) / 100
    : promo.value;

  if (promo.maxDiscount) discount = Math.min(discount, promo.maxDiscount);

  ApiResponse.success(res, { promo, discount, finalAmount: orderAmount - discount });
});

// ═══════════════════════════════════════════════════════════════
// AUTHENTICATED CUSTOMER ROUTES
// ═══════════════════════════════════════════════════════════════

router.use(authenticate);

// ─── Profile ─────────────────────────────────────────────────────────────────

router.get("/profile", async (req, res) => {
  const user = await User.findById(req.user!._id);
  const customer = await Customer.findOne({ userId: req.user!._id });
  ApiResponse.success(res, { user, customer });
});

router.put("/profile", async (req, res) => {
  const { name, phone, avatar, dateOfBirth, gender } = req.body;
  const [user, customer] = await Promise.all([
    User.findByIdAndUpdate(req.user!._id, { name, phone, avatar }, { new: true }),
    Customer.findOneAndUpdate({ userId: req.user!._id }, { dateOfBirth, gender }, { new: true }),
  ]);
  ApiResponse.success(res, { user, customer }, "Profile updated");
});

// ─── Addresses ───────────────────────────────────────────────────────────────

router.get("/addresses", async (req, res) => {
  const addresses = userAddresses.get(req.user!._id) || [];
  ApiResponse.success(res, addresses);
});

router.post("/addresses", async (req, res) => {
  const addresses = userAddresses.get(req.user!._id) || [];
  const newAddress = { ...req.body, id: Date.now().toString() };
  addresses.push(newAddress);
  userAddresses.set(req.user!._id, addresses);
  ApiResponse.created(res, newAddress);
});

router.delete("/addresses/:id", async (req, res) => {
  const addresses = (userAddresses.get(req.user!._id) || []).filter(
    (a: Address) => a.id !== req.params.id
  );
  userAddresses.set(req.user!._id, addresses);
  ApiResponse.success(res, null, "Address deleted");
});

// ─── Cart ─────────────────────────────────────────────────────────────────────

router.get("/cart", async (req, res) => {
  const cartItems = userCarts.get(req.user!._id) || [];
  const productIds = cartItems.map((i) => i.productId);
  const products = await Product.find({ _id: { $in: productIds } });

  const enriched = cartItems.map((item) => {
    const product = products.find((p) => p._id.toString() === item.productId);
    return { ...item, product };
  });

  const subtotal = enriched.reduce((sum, i) => sum + (i.price * i.quantity), 0);
  ApiResponse.success(res, { items: enriched, subtotal, itemCount: cartItems.length });
});

router.post("/cart/add", async (req, res) => {
  const { productId, quantity = 1, variantId } = req.body;
  const product = await Product.findById(productId);
  if (!product) return ApiResponse.notFound(res, "Product");
  if (product.stock < quantity) return ApiResponse.badRequest(res, "Insufficient stock");

  const cart = userCarts.get(req.user!._id) || [];
  const existingIndex = cart.findIndex(
    (i) => i.productId === productId && i.variantId === variantId
  );

  if (existingIndex >= 0) {
    cart[existingIndex].quantity += quantity;
  } else {
    cart.push({ productId, quantity, variantId, price: product.price });
  }

  userCarts.set(req.user!._id, cart);
  ApiResponse.success(res, { cart }, "Added to cart");
});

router.patch("/cart/update", async (req, res) => {
  const { productId, quantity, variantId } = req.body;
  const cart = userCarts.get(req.user!._id) || [];

  const index = cart.findIndex(
    (i) => i.productId === productId && i.variantId === variantId
  );

  if (index < 0) return ApiResponse.notFound(res, "Cart item");
  if (quantity <= 0) {
    cart.splice(index, 1);
  } else {
    cart[index].quantity = quantity;
  }

  userCarts.set(req.user!._id, cart);
  ApiResponse.success(res, cart, "Cart updated");
});

router.delete("/cart/clear", async (req, res) => {
  userCarts.delete(req.user!._id);
  ApiResponse.success(res, null, "Cart cleared");
});

// ─── Wishlist (using Redis in production) ────────────────────────────────────

const userWishlists = new Map<string, string[]>();

router.get("/wishlist", async (req, res) => {
  const productIds = userWishlists.get(req.user!._id) || [];
  const products = await Product.find({ _id: { $in: productIds }, status: "active" });
  ApiResponse.success(res, products);
});

router.post("/wishlist/toggle", async (req, res) => {
  const { productId } = req.body;
  const wishlist = userWishlists.get(req.user!._id) || [];
  const index = wishlist.indexOf(productId);

  if (index >= 0) {
    wishlist.splice(index, 1);
    userWishlists.set(req.user!._id, wishlist);
    ApiResponse.success(res, { wishlisted: false }, "Removed from wishlist");
  } else {
    wishlist.push(productId);
    userWishlists.set(req.user!._id, wishlist);
    ApiResponse.success(res, { wishlisted: true }, "Added to wishlist");
  }
});

// ─── Orders ───────────────────────────────────────────────────────────────────

router.get("/orders", async (req, res) => {
  const customer = await Customer.findOne({ userId: req.user!._id });
  if (!customer) return ApiResponse.notFound(res, "Customer profile");

  const { page, limit, skip } = getPagination(req.query);
  const { status } = req.query as Record<string, string>;
  const filter: Record<string, unknown> = { customerId: customer._id };
  if (status) filter.status = status;

  const [orders, total] = await Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Order.countDocuments(filter),
  ]);
  ApiResponse.paginate(res, orders, total, page, limit);
});

router.get("/orders/:id", async (req, res) => {
  const customer = await Customer.findOne({ userId: req.user!._id });
  const order = await Order.findOne({ _id: req.params.id, customerId: customer?._id });
  if (!order) return ApiResponse.notFound(res, "Order");
  ApiResponse.success(res, order);
});

// Place order
router.post("/orders", async (req, res) => {
  const customer = await Customer.findOne({ userId: req.user!._id });
  if (!customer) return ApiResponse.notFound(res, "Customer profile");

  const { items, address, paymentMethod, couponCode, walletAmount = 0, notes } = req.body;
  if (!items?.length) return ApiResponse.badRequest(res, "No items in order");

  // Fetch all products
  const productIds = items.map((i: { productId: string }) => i.productId);
  const products = await Product.find({ _id: { $in: productIds } });

  let subtotal = 0;
  const orderItems = items.map((item: { productId: string; quantity: number; price: number }) => {
    const product = products.find((p) => p._id.toString() === item.productId);
    if (!product) throw new NotFoundError(`Product ${item.productId}`);
    const lineTotal = product.price * item.quantity;
    subtotal += lineTotal;
    return {
      productId: product._id,
      productName: product.name,
      productImage: product.thumbnail,
      vendorId: product.vendorId,
      storeId: product.storeId,
      quantity: item.quantity,
      price: product.price,
      originalPrice: product.originalPrice || product.price,
      tax: 0,
      total: lineTotal,
    };
  });

  // Apply coupon
  let couponDiscount = 0;
  if (couponCode) {
    const promo = await PromoCode.findOne({ code: couponCode.toUpperCase(), isActive: true });
    if (promo && subtotal >= promo.minOrderAmount) {
      couponDiscount = promo.type === "percent"
        ? Math.min((subtotal * promo.value) / 100, promo.maxDiscount || Infinity)
        : promo.value;
      await PromoCode.findByIdAndUpdate(promo._id, { $inc: { usedCount: 1 } });
    }
  }

  const deliveryCharge = Number(process.env.DEFAULT_DELIVERY_CHARGE) || 40;
  const walletUsed = Math.min(walletAmount, customer.walletBalance);
  const total = Math.max(0, subtotal - couponDiscount + deliveryCharge - walletUsed);

  // Deduct wallet if used
  if (walletUsed > 0) {
    await Customer.findByIdAndUpdate(customer._id, { $inc: { walletBalance: -walletUsed } });
    await WalletTransaction.create({
      walletId: customer._id,
      userId: req.user!._id,
      type: "debit",
      amount: walletUsed,
      balance: customer.walletBalance - walletUsed,
      description: "Order payment from wallet",
      referenceType: "order",
    });
  }

  const order = await Order.create({
    orderNumber: generateOrderNumber(),
    customerId: customer._id,
    items: orderItems,
    address,
    paymentMethod,
    paymentStatus: paymentMethod === "cod" ? "pending" : "pending",
    subtotal,
    couponCode,
    couponDiscount,
    deliveryCharge,
    walletUsed,
    total,
    notes,
    vendorId: orderItems[0]?.vendorId,
    storeId: orderItems[0]?.storeId,
    timeline: [{ status: "pending", message: "Order placed", timestamp: new Date() }],
  });

  // Update customer stats
  await Customer.findByIdAndUpdate(customer._id, {
    $inc: { totalOrders: 1, totalSpent: total },
  });

  // Clear cart
  userCarts.delete(req.user!._id);

  ApiResponse.created(res, order, "Order placed successfully");
});

router.patch("/orders/:id/cancel", async (req, res) => {
  const customer = await Customer.findOne({ userId: req.user!._id });
  const order = await Order.findOne({ _id: req.params.id, customerId: customer?._id });
  if (!order) return ApiResponse.notFound(res, "Order");

  if (!["pending", "confirmed"].includes(order.status)) {
    return ApiResponse.badRequest(res, "Order cannot be cancelled at this stage");
  }

  await Order.findByIdAndUpdate(order._id, {
    status: "cancelled",
    $push: { timeline: { status: "cancelled", message: req.body.reason || "Cancelled by customer", timestamp: new Date() } },
  });

  ApiResponse.success(res, null, "Order cancelled");
});

router.post("/orders/:id/return", async (req, res) => {
  const customer = await Customer.findOne({ userId: req.user!._id });
  const order = await Order.findOne({ _id: req.params.id, customerId: customer?._id });
  if (!order) return ApiResponse.notFound(res, "Order");
  if (order.status !== "delivered") {
    return ApiResponse.badRequest(res, "Only delivered orders can be returned");
  }

  await Order.findByIdAndUpdate(order._id, {
    status: "return_requested",
    $push: { timeline: { status: "return_requested", message: req.body.reason || "Return requested", timestamp: new Date() } },
  });

  ApiResponse.success(res, null, "Return request submitted");
});

// ─── Wallet ───────────────────────────────────────────────────────────────────

router.get("/wallet", async (req, res) => {
  const customer = await Customer.findOne({ userId: req.user!._id });
  const transactions = await WalletTransaction.find({ userId: req.user!._id })
    .sort({ createdAt: -1 }).limit(20);
  ApiResponse.success(res, {
    balance: customer?.walletBalance || 0,
    transactions,
  });
});

// ─── Referrals ────────────────────────────────────────────────────────────────

router.get("/referrals", async (req, res) => {
  const customer = await Customer.findOne({ userId: req.user!._id });
  const referrals = await Referral.find({ referrerId: req.user!._id })
    .populate("refereeId", "name createdAt");
  ApiResponse.success(res, {
    referralCode: customer?.referralCode,
    totalReferrals: referrals.length,
    rewardedReferrals: referrals.filter((r) => r.isRewarded).length,
    totalEarned: referrals.filter((r) => r.isRewarded).reduce((sum, r) => sum + r.rewardAmount, 0),
    referrals,
  });
});

// ─── Notifications ────────────────────────────────────────────────────────────

router.get("/notifications", async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const [notifs, total, unreadCount] = await Promise.all([
    Notification.find({ userId: req.user!._id }).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Notification.countDocuments({ userId: req.user!._id }),
    Notification.countDocuments({ userId: req.user!._id, isRead: false }),
  ]);
  ApiResponse.paginate(res, { notifications: notifs, unreadCount }, total, page, limit);
});

router.patch("/notifications/read-all", async (req, res) => {
  await Notification.updateMany({ userId: req.user!._id }, { isRead: true });
  ApiResponse.success(res, null, "All notifications marked as read");
});

export default router;
