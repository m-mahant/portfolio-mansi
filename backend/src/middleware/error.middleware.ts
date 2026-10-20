import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { ApiErrorResponse } from '../types';
import { AppError } from '../errors/app-error';

import { env } from '../config/env.config';

// Middleware for handling requests to undefined API endpoints (404 Not Found).
export function notFoundHandler(req: Request, res: Response<ApiErrorResponse>): void {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Cannot ${req.method} ${req.originalUrl}`,
    },
  });
}

// Global error handling middleware for catching and formatting application errors, Zod validation errors, and unexpected exceptions.
export function errorHandler(
  err: Error | AppError | ZodError,
  _req: Request,
  res: Response<ApiErrorResponse>,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
      },
    });
    return;
  }

  if (err instanceof ZodError) {
    const firstIssue = err.issues[0];
    const message = firstIssue ? `${firstIssue.path.join('.')}: ${firstIssue.message}` : 'Validation error';
    res.status(400).json({
      success: false,
      error: {
        code: 'BAD_REQUEST',
        message,
        details: err.flatten().fieldErrors as Record<string, unknown>,
      },
    });
    return;
  }

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  const isProduction = env.nodeEnv === 'production';
  const errorMessage = isProduction
    ? 'An internal server error occurred.'
    : err.message || 'An unexpected error occurred.';

  res.status(statusCode).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: errorMessage,
    },
  });
}
