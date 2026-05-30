export class AppError extends Error {
  statusCode: number;
  code: string;
  isOperational: boolean;

  constructor(message: string, statusCode = 500, code = "INTERNAL_ERROR") {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  errors: unknown;
  constructor(message: string, errors?: unknown) {
    super(message, 422, "VALIDATION_ERROR");
    this.errors = errors;
  }
}

export class AuthenticationError extends AppError {
  constructor(message = "Authentication required") {
    super(message, 401, "UNAUTHORIZED");
  }
}

export class AuthorizationError extends AppError {
  constructor(message = "You do not have permission to perform this action") {
    super(message, 403, "FORBIDDEN");
  }
}

export class NotFoundError extends AppError {
  constructor(resource = "Resource") {
    super(`${resource} not found`, 404, "NOT_FOUND");
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409, "CONFLICT");
  }
}

export class BadRequestError extends AppError {
  constructor(message: string) {
    super(message, 400, "BAD_REQUEST");
  }
}

export class RateLimitError extends AppError {
  constructor() {
    super("Too many requests. Please try again later.", 429, "RATE_LIMIT_EXCEEDED");
  }
}

export class PaymentError extends AppError {
  constructor(message: string) {
    super(message, 402, "PAYMENT_ERROR");
  }
}
