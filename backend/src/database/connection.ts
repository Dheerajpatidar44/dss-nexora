import mongoose from "mongoose";
import { logger } from "../config/logger";

export const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  try {
    mongoose.set("strictQuery", true);

    const conn = await mongoose.connect(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);

    mongoose.connection.on("error", (err) => {
      logger.error("MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      logger.warn("MongoDB disconnected. Attempting to reconnect...");
    });

    mongoose.connection.on("reconnected", () => {
      logger.info("MongoDB reconnected");
    });

    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      logger.info("MongoDB connection closed due to app termination");
      process.exit(0);
    });
  } catch (error) {
    logger.error("❌ MongoDB connection failed:", error);
    throw error;
  }
};
