import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { ApiResponse } from "../utils/apiResponse";
import { getPagination } from "../utils/helpers";

import { DeliveryBoy } from "../models/DeliveryBoy.model";
import { Order } from "../models/Order.model";
import { Withdrawal, WalletTransaction } from "../models/Finance.model";
import { Notification } from "../models/Marketing.model";
import { User } from "../models/User.model";

const router = Router();
router.use(authenticate, authorize("delivery"));

const getDeliveryBoy = async (userId: string) => {
  const db = await DeliveryBoy.findOne({ userId });
  if (!db) throw new Error("Delivery boy profile not found");
  return db;
};

// ─── Dashboard ───────────────────────────────────────────────────────────────

router.get("/dashboard", async (req, res) => {
  const db = await getDeliveryBoy(req.user!._id);
  const today = new Date(); today.setHours(0, 0, 0, 0);

  const [todayDeliveries, pendingOrders, totalEarnings] = await Promise.all([
    Order.countDocuments({ deliveryBoyId: db._id, status: "delivered", deliveredAt: { $gte: today } }),
    Order.countDocuments({ deliveryBoyId: db._id, status: { $in: ["shipped", "out_for_delivery"] } }),
    Order.aggregate([
      { $match: { deliveryBoyId: db._id, status: "delivered" } },
      { $group: { _id: null, total: { $sum: "$deliveryCharge" } } },
    ]),
  ]);

  ApiResponse.success(res, {
    deliveryBoy: db,
    stats: {
      todayDeliveries,
      pendingOrders,
      totalDeliveries: db.totalDeliveries,
      walletBalance: db.walletBalance,
      totalEarnings: totalEarnings[0]?.total || 0,
      rating: db.rating,
    },
  });
});

// ─── Orders ───────────────────────────────────────────────────────────────────

router.get("/orders", async (req, res) => {
  const db = await getDeliveryBoy(req.user!._id);
  const { page, limit, skip } = getPagination(req.query);
  const { status } = req.query as Record<string, string>;

  const filter: Record<string, unknown> = { deliveryBoyId: db._id };
  if (status) filter.status = status;

  const [orders, total] = await Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Order.countDocuments(filter),
  ]);
  ApiResponse.paginate(res, orders, total, page, limit);
});

router.get("/orders/:id", async (req, res) => {
  const db = await getDeliveryBoy(req.user!._id);
  const order = await Order.findOne({ _id: req.params.id, deliveryBoyId: db._id });
  if (!order) return ApiResponse.notFound(res, "Order");
  ApiResponse.success(res, order);
});

router.patch("/orders/:id/status", async (req, res) => {
  const db = await getDeliveryBoy(req.user!._id);
  const { status } = req.body;
  const allowed = ["out_for_delivery", "delivered"];

  if (!allowed.includes(status)) {
    return ApiResponse.badRequest(res, "Invalid status for delivery boy");
  }

  const order = await Order.findOneAndUpdate(
    { _id: req.params.id, deliveryBoyId: db._id },
    {
      status,
      $push: { timeline: { status, message: status, timestamp: new Date() } },
      ...(status === "delivered" && { deliveredAt: new Date() }),
    },
    { new: true }
  );
  if (!order) return ApiResponse.notFound(res, "Order");

  // Update delivery stats
  if (status === "delivered") {
    await DeliveryBoy.findByIdAndUpdate(db._id, {
      $inc: { totalDeliveries: 1, totalEarnings: order.deliveryCharge, walletBalance: order.deliveryCharge },
    });
  }

  ApiResponse.success(res, order, "Order status updated");
});

// ─── Return Requests ─────────────────────────────────────────────────────────

router.get("/return-requests", async (req, res) => {
  const db = await getDeliveryBoy(req.user!._id);
  const orders = await Order.find({
    deliveryBoyId: db._id,
    status: "return_requested",
  }).sort({ updatedAt: -1 });
  ApiResponse.success(res, orders);
});

// ─── Withdrawals ─────────────────────────────────────────────────────────────

router.get("/withdrawals", async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const [withdrawals, total] = await Promise.all([
    Withdrawal.find({ userId: req.user!._id }).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Withdrawal.countDocuments({ userId: req.user!._id }),
  ]);
  ApiResponse.paginate(res, withdrawals, total, page, limit);
});

router.post("/withdrawals", async (req, res) => {
  const db = await getDeliveryBoy(req.user!._id);
  const minAmount = Number(process.env.MIN_WITHDRAWAL_AMOUNT) || 500;

  if (req.body.amount > db.walletBalance) {
    return ApiResponse.badRequest(res, "Insufficient wallet balance");
  }
  if (req.body.amount < minAmount) {
    return ApiResponse.badRequest(res, `Minimum withdrawal is ₹${minAmount}`);
  }

  const withdrawal = await Withdrawal.create({
    userId: req.user!._id,
    userType: "delivery",
    ...req.body,
  });
  ApiResponse.created(res, withdrawal);
});

// ─── Wallet ───────────────────────────────────────────────────────────────────

router.get("/wallet", async (req, res) => {
  const db = await getDeliveryBoy(req.user!._id);
  const transactions = await WalletTransaction.find({ userId: req.user!._id })
    .sort({ createdAt: -1 }).limit(20);
  ApiResponse.success(res, { balance: db.walletBalance, transactions });
});

// ─── Salary ───────────────────────────────────────────────────────────────────

router.get("/salary", async (req, res) => {
  const db = await getDeliveryBoy(req.user!._id);
  ApiResponse.success(res, {
    salary: db.salary,
    totalEarnings: db.totalEarnings,
    totalDeliveries: db.totalDeliveries,
  });
});

// ─── Availability ─────────────────────────────────────────────────────────────

router.patch("/availability", async (req, res) => {
  const db = await DeliveryBoy.findOneAndUpdate(
    { userId: req.user!._id },
    { isAvailable: req.body.isAvailable, isOnDuty: req.body.isOnDuty },
    { new: true }
  );
  ApiResponse.success(res, db, "Availability updated");
});

// ─── Profile ─────────────────────────────────────────────────────────────────

router.get("/profile", async (req, res) => {
  const user = await User.findById(req.user!._id);
  const db = await getDeliveryBoy(req.user!._id);
  ApiResponse.success(res, { user, deliveryBoy: db });
});

router.put("/profile", async (req, res) => {
  const { name, phone, avatar, vehicleType, vehicleNumber, bankAccountName, bankAccountNumber, bankIfscCode, bankName } = req.body;

  const [user, db] = await Promise.all([
    User.findByIdAndUpdate(req.user!._id, { name, phone, avatar }, { new: true }),
    DeliveryBoy.findOneAndUpdate({ userId: req.user!._id }, { vehicleType, vehicleNumber, bankAccountName, bankAccountNumber, bankIfscCode, bankName }, { new: true }),
  ]);
  ApiResponse.success(res, { user, deliveryBoy: db }, "Profile updated");
});

// ─── Notifications ────────────────────────────────────────────────────────────

router.get("/notifications", async (req, res) => {
  const notifs = await Notification.find({ userId: req.user!._id })
    .sort({ createdAt: -1 }).limit(50);
  ApiResponse.success(res, notifs);
});

export default router;
