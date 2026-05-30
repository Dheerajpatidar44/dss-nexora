import { Response } from "express";

export interface ApiMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
}

export class ApiResponse {
  static success<T>(
    res: Response,
    data: T,
    message = "Success",
    statusCode = 200,
    meta?: ApiMeta
  ) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      ...(meta && { meta }),
    });
  }

  static created<T>(res: Response, data: T, message = "Created successfully") {
    return this.success(res, data, message, 201);
  }

  static noContent(res: Response) {
    return res.status(204).send();
  }

  static error(
    res: Response,
    message = "Something went wrong",
    statusCode = 500,
    errors?: unknown,
    code?: string
  ) {
    const body: Record<string, unknown> = { success: false, message };
    if (errors !== undefined) body.errors = errors;
    if (code) body.code = code;
    return res.status(statusCode).json(body);
  }

  static badRequest(res: Response, message: string, errors?: unknown) {
    return this.error(res, message, 400, errors, "BAD_REQUEST");
  }

  static unauthorized(res: Response, message = "Unauthorized") {
    return this.error(res, message, 401, undefined, "UNAUTHORIZED");
  }

  static forbidden(res: Response, message = "Forbidden") {
    return this.error(res, message, 403, undefined, "FORBIDDEN");
  }

  static notFound(res: Response, message = "Not found") {
    return this.error(res, message, 404, undefined, "NOT_FOUND");
  }

  static conflict(res: Response, message: string) {
    return this.error(res, message, 409, undefined, "CONFLICT");
  }

  static validationError(res: Response, errors: unknown) {
    return this.error(res, "Validation failed", 422, errors, "VALIDATION_ERROR");
  }

  static tooManyRequests(res: Response) {
    return this.error(
      res,
      "Too many requests. Please try again later.",
      429,
      undefined,
      "RATE_LIMIT_EXCEEDED"
    );
  }

  static paginate(
    res: Response,
    data: unknown,
    total: number,
    page: number,
    limit: number,
    message = "Success"
  ) {
    return this.success(
      res,
      data,
      message,
      200,
      {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    );
  }
}
