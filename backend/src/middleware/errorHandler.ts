import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors";
import { logger } from "../config/logger";
import mongoose from "mongoose";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) => {
  let statusCode = 500;
  let message = "Internal Server Error";
  let code = "INTERNAL_ERROR";
  let errors: unknown;

  // Known operational errors
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    code = err.code;
    if ("errors" in err) errors = (err as { errors: unknown }).errors;
  }

  // Mongoose Validation Error
  else if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 422;
    message = "Validation failed";
    code = "VALIDATION_ERROR";
    errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }

  // Mongoose Cast Error (invalid ObjectId)
  else if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
    code = "INVALID_ID";
  }

  // MongoDB Duplicate Key
  else if ((err as NodeJS.ErrnoException).code === "11000") {
    statusCode = 409;
    const field = Object.keys(
      (err as { keyValue?: Record<string, unknown> }).keyValue || {}
    )[0];
    message = `${field} already exists`;
    code = "DUPLICATE_KEY";
  }

  // JWT Errors
  else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
    code = "INVALID_TOKEN";
  } else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token has expired";
    code = "TOKEN_EXPIRED";
  }

  // Log non-operational errors
  if (statusCode >= 500) {
    logger.error({
      message: err.message,
      stack: err.stack,
      url: req.url,
      method: req.method,
      ip: req.ip,
    });
  }

  const body: Record<string, unknown> = { success: false, message, code };
  if (errors !== undefined) body.errors = errors;
  if (process.env.NODE_ENV === "development") body.stack = err.stack;
  res.status(statusCode).json(body);
};
