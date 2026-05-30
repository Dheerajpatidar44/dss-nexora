import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../utils/apiResponse";

export const notFound = (req: Request, res: Response, _next: NextFunction) => {
  ApiResponse.notFound(res, `Route ${req.originalUrl} not found`);
};
