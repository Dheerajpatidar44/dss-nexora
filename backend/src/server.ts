import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import "express-async-errors";
import dotenv from "dotenv";

import { connectDB } from "./database/connection";
import { connectRedis } from "./config/redis";
import { logger } from "./config/logger";
import { errorHandler } from "./middleware/errorHandler";
import { notFound } from "./middleware/notFound";
import { initCronJobs } from "./cron/cronRunner";

// Route imports
import authRoutes from "./routes/auth.routes";
import adminRoutes from "./routes/admin.routes";
import vendorRoutes from "./routes/vendor.routes";
import deliveryRoutes from "./routes/delivery.routes";
import customerRoutes from "./routes/customer.routes";
import paymentRoutes from "./routes/payment.routes";
import uploadRoutes from "./routes/upload.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Security Middleware ────────────────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ─── Body Parsing ───────────────────────────────────────────────────────────
// Raw body needed for Stripe webhook signature verification
app.use(
  "/api/payments/stripe/webhook",
  express.raw({ type: "application/json" })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use(compression());

// ─── Logging ─────────────────────────────────────────────────────────────────
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ─── Health Check ────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({
    success: true,
    message: "DSS Nexus Commerce API is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: "1.0.0",
  });
});

// ─── API Routes ──────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/vendor", vendorRoutes);
app.use("/api/delivery", deliveryRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/upload", uploadRoutes);

// ─── Error Handling ──────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── Start Server ────────────────────────────────────────────────────────────
const startServer = async () => {
  try {
    await connectDB();
    await connectRedis();

    app.listen(PORT, () => {
      logger.info(`🚀 DSS Nexus Commerce API running on port ${PORT}`);
      logger.info(`📦 Environment: ${process.env.NODE_ENV}`);
      logger.info(`🌐 Health: http://localhost:${PORT}/health`);
    });

    // Initialize cron jobs
    if (process.env.ENABLE_CRON_JOBS === "true") {
      initCronJobs();
      logger.info("⏰ Cron jobs initialized");
    }
  } catch (error) {
    logger.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on("unhandledRejection", (err: Error) => {
  logger.error("Unhandled Rejection:", err.message);
  process.exit(1);
});

process.on("uncaughtException", (err: Error) => {
  logger.error("Uncaught Exception:", err.message);
  process.exit(1);
});

startServer();

export default app;
