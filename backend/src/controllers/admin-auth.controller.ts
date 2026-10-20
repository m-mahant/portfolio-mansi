import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';

export interface AdminAuthCheckResponse {
  authenticated: boolean;
  authorized: boolean;
}

// Controller for handling the admin authentication verification endpoint (GET /api/v1/admin/auth-check).
export async function checkAdminAuth(
  _req: Request,
  res: Response<ApiResponse<AdminAuthCheckResponse>>,
  next: NextFunction
): Promise<void> {
  try {
    res.status(200).json({
      success: true,
      data: {
        authenticated: true,
        authorized: true,
      },
    });
  } catch (error) {
    next(error);
  }
}
