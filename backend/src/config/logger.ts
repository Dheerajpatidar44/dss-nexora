import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import path from "path";

const { combine, timestamp, errors, json, colorize, printf } = winston.format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

const fileRotateTransport = new DailyRotateFile({
  filename: path.join("logs", "%DATE%-combined.log"),
  datePattern: "YYYY-MM-DD",
  maxSize: "20m",
  maxFiles: "14d",
});

const errorRotateTransport = new DailyRotateFile({
  filename: path.join("logs", "%DATE%-error.log"),
  datePattern: "YYYY-MM-DD",
  level: "error",
  maxSize: "20m",
  maxFiles: "30d",
});

export const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "warn" : "info",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }),
    json()
  ),
  transports: [fileRotateTransport, errorRotateTransport],
});

// Console output in development
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: combine(colorize(), timestamp({ format: "HH:mm:ss" }), logFormat),
    })
  );
}
