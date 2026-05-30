import { Router } from "express";
import crypto from "crypto";
import Razorpay from "razorpay";
import Stripe from "stripe";
import { authenticate } from "../middleware/auth.middleware";
import { ApiResponse } from "../utils/apiResponse";
import { Order } from "../models/Order.model";
import { Customer } from "../models/Customer.model";
import { logger } from "../config/logger";

const router = Router();

// ─── Razorpay Instance ────────────────────────────────────────────────────────
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_dummy",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "dummy_secret",
});

// ─── Stripe Instance ──────────────────────────────────────────────────────────
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_dummy", {
  apiVersion: "2024-11-20.acacia" as any,
});

// ═══════════════════════════════════════════════════════════════
// RAZORPAY
// ═══════════════════════════════════════════════════════════════

// Create Razorpay order
router.post("/razorpay/create", authenticate, async (req, res) => {
  const { orderId } = req.body;
  const order = await Order.findById(orderId);
  if (!order) return ApiResponse.notFound(res, "Order");

  const razorpayOrder = await razorpay.orders.create({
    amount: Math.round(order.total * 100), // paise
    currency: "INR",
    receipt: order.orderNumber,
    notes: { orderId: order._id.toString() },
  });

  await Order.findByIdAndUpdate(orderId, { razorpayOrderId: razorpayOrder.id });

  ApiResponse.success(res, {
    id: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    key: process.env.RAZORPAY_KEY_ID,
  });
});

// Verify Razorpay payment
router.post("/razorpay/verify", authenticate, async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return ApiResponse.badRequest(res, "Payment verification failed");
  }

  const order = await Order.findByIdAndUpdate(
    orderId,
    {
      paymentStatus: "paid",
      paymentId: razorpay_payment_id,
      status: "confirmed",
      $push: { timeline: { status: "confirmed", message: "Payment received", timestamp: new Date() } },
    },
    { new: true }
  );

  ApiResponse.success(res, order, "Payment verified successfully");
});

// ═══════════════════════════════════════════════════════════════
// STRIPE
// ═══════════════════════════════════════════════════════════════

// Create Stripe Payment Intent
router.post("/stripe/create-intent", authenticate, async (req, res) => {
  const { orderId } = req.body;
  const order = await Order.findById(orderId);
  if (!order) return ApiResponse.notFound(res, "Order");

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(order.total * 100), // cents/paise
    currency: "inr",
    metadata: { orderId: order._id.toString(), orderNumber: order.orderNumber },
  });

  await Order.findByIdAndUpdate(orderId, {
    stripePaymentIntentId: paymentIntent.id,
  });

  ApiResponse.success(res, {
    clientSecret: paymentIntent.client_secret,
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  });
});

// Stripe Webhook (raw body needed)
router.post("/stripe/webhook", async (req, res) => {
  const sig = req.headers["stripe-signature"] as string;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body, // raw buffer
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch (err) {
    logger.error("Stripe webhook signature verification failed:", err);
    return res.status(400).send("Webhook signature verification failed");
  }

  if (event.type === "payment_intent.succeeded") {
    const intent = event.data.object as Stripe.PaymentIntent;
    const orderId = intent.metadata.orderId;

    await Order.findByIdAndUpdate(orderId, {
      paymentStatus: "paid",
      paymentId: intent.id,
      status: "confirmed",
      $push: { timeline: { status: "confirmed", message: "Payment received via Stripe", timestamp: new Date() } },
    });
  }

  if (event.type === "payment_intent.payment_failed") {
    const intent = event.data.object as Stripe.PaymentIntent;
    const orderId = intent.metadata.orderId;
    await Order.findByIdAndUpdate(orderId, { paymentStatus: "failed" });
  }

  res.json({ received: true });
});

// ═══════════════════════════════════════════════════════════════
// REFUND
// ═══════════════════════════════════════════════════════════════

router.post("/refund", authenticate, async (req, res) => {
  const { orderId, reason } = req.body;
  const order = await Order.findById(orderId);
  if (!order) return ApiResponse.notFound(res, "Order");
  if (order.paymentStatus !== "paid") {
    return ApiResponse.badRequest(res, "Order has not been paid");
  }

  try {
    if (order.paymentMethod === "razorpay" && order.paymentId) {
      await razorpay.payments.refund(order.paymentId, {
        amount: Math.round(order.total * 100),
        notes: { reason },
      });
    } else if (order.paymentMethod === "stripe" && order.stripePaymentIntentId) {
      await stripe.refunds.create({
        payment_intent: order.stripePaymentIntentId,
        amount: Math.round(order.total * 100),
      });
    } else if (order.paymentMethod === "wallet" || order.paymentMethod === "cod") {
      // Refund to wallet
      const customer = await Customer.findOne({ userId: order.customerId });
      if (customer) {
        await Customer.findByIdAndUpdate(customer._id, {
          $inc: { walletBalance: order.total },
        });
      }
    }

    await Order.findByIdAndUpdate(orderId, {
      paymentStatus: "refunded",
      status: "refunded",
      $push: { timeline: { status: "refunded", message: `Refunded: ${reason}`, timestamp: new Date() } },
    });

    ApiResponse.success(res, null, "Refund processed successfully");
  } catch (error) {
    logger.error("Refund failed:", error);
    ApiResponse.error(res, "Refund processing failed");
  }
});

export default router;
