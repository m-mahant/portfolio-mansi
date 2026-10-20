import { Request, Response, NextFunction } from 'express';
import { verifyFirebaseIdToken } from '../utils/auth.utils';
import { AppError } from '../errors/app-error';

// Middleware to extract, verify, and attach Firebase ID token credentials to incoming requests.
export async function authenticate(req: Request, _res: Response, next: NextFunction): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw AppError.unauthorized('Authentication token is required.');
    }

    const token = authHeader.split('Bearer ')[1]?.trim();
    if (!token) {
      throw AppError.unauthorized('Authentication token is required.');
    }

    try {
      const decodedToken = await verifyFirebaseIdToken(token);
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        emailVerified: decodedToken.email_verified,
      };
      next();
    } catch {
      throw AppError.unauthorized('Invalid or expired authentication token.');
    }
  } catch (error) {
    next(error);
  }
}
