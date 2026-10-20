import { Request, Response } from 'express';
import { ApiSuccessResponse } from '../types';

// Handles health check requests to confirm system availability.
export function getHealthStatus(_req: Request, res: Response<ApiSuccessResponse<{ status: string }>>): void {
  res.status(200).json({
    success: true,
    data: {
      status: 'ok',
    },
  });
}
