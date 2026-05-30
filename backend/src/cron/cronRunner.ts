import cron from "node-cron";
import { logger } from "../config/logger";
import { CronLog } from "../models/Marketing.model";
import { Settlement } from "../models/Finance.model";
import { Subscription } from "../models/Marketing.model";
import { Order } from "../models/Order.model";
import { Vendor } from "../models/Vendor.model";

// ─── Run Job Helper ───────────────────────────────────────────────────────────
const runJob = async (name: string, fn: () => Promise<void>) => {
  const log = await CronLog.create({ jobName: name, status: "running", startedAt: new Date() });
  const startTime = Date.now();
  try {
    await fn();
    const duration = Date.now() - startTime;
    await CronLog.findByIdAndUpdate(log._id, {
      status: "success",
      completedAt: new Date(),
      duration,
    });
    logger.info(`✅ Cron job '${name}' completed in ${duration}ms`);
  } catch (error: unknown) {
    const duration = Date.now() - startTime;
    await CronLog.findByIdAndUpdate(log._id, {
      status: "failed",
      completedAt: new Date(),
      duration,
      message: error instanceof Error ? error.message : "Unknown error",
    });
    logger.error(`❌ Cron job '${name}' failed:`, error);
  }
};

// ─── Settlement Processor (Daily 2AM) ────────────────────────────────────────
const processSettlements = async () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  // Find delivered orders that are not settled
  const orders = await Order.find({
    status: "delivered",
    paymentStatus: "paid",
    isSettled: false,
    deliveredAt: { $gte: yesterday, $lt: todayStart },
  });

  for (const order of orders) {
    const vendor = await Vendor.findById(order.vendorId);
    if (!vendor) continue;

    const commissionRate = vendor.commissionRate;
    const commission = (order.total * commissionRate) / 100;
    const netAmount = order.total - commission - order.deliveryCharge;

    const settlement = await Settlement.create({
      vendorId: order.vendorId,
      orderId: order._id,
      orderAmount: order.total,
      commission,
      commissionRate,
      netAmount,
      status: "pending",
    });

    await Order.findByIdAndUpdate(order._id, {
      isSettled: true,
      settlementId: settlement._id,
    });

    await Vendor.findByIdAndUpdate(order.vendorId, {
      $inc: { walletBalance: netAmount, totalSales: order.total },
    });
  }

  logger.info(`Settlement processed for ${orders.length} orders`);
};

// ─── Subscription Expiry Checker (Daily Midnight) ─────────────────────────────
const checkSubscriptions = async () => {
  const expired = await Subscription.updateMany(
    { status: "active", endDate: { $lt: new Date() } },
    { status: "expired" }
  );
  logger.info(`${expired.modifiedCount} subscriptions expired`);
};

// ─── OTP/Session Cleanup (Hourly) ────────────────────────────────────────────
const cleanupSessions = async () => {
  // Handled by Redis TTL — this is a no-op placeholder
  logger.info("Session cleanup completed (handled by Redis TTL)");
};

// ─── Init All Cron Jobs ───────────────────────────────────────────────────────
export const initCronJobs = () => {
  // Settlement: Daily at 2AM
  cron.schedule(process.env.CRON_SETTLEMENT_SCHEDULE || "0 2 * * *", () => {
    runJob("settlement-processor", processSettlements);
  });

  // Subscription check: Daily at midnight
  cron.schedule(process.env.CRON_SUBSCRIPTION_SCHEDULE || "0 0 * * *", () => {
    runJob("subscription-checker", checkSubscriptions);
  });

  // Cleanup: Every hour
  cron.schedule(process.env.CRON_SESSION_CLEANUP_SCHEDULE || "0 * * * *", () => {
    runJob("session-cleanup", cleanupSessions);
  });

  logger.info("✅ All cron jobs registered");
};
