import { Request, Response, NextFunction } from 'express';
import { adminAuthService } from '../services/admin-auth.service';
import { AppError } from '../errors/app-error';

// Middleware to verify that an authenticated request belongs to an active administrator.
export async function authorizeAdmin(req: Request, _res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user || !req.user.uid) {
      throw AppError.unauthorized('Authentication is required.');
    }

    const isAuthorized = await adminAuthService.isUserActiveAdmin(req.user.uid);
    if (!isAuthorized) {
      throw AppError.forbidden('Administrator access is required.');
    }

    next();
  } catch (error) {
    next(error);
  }
}
