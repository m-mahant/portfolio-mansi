import { Request, Response, NextFunction } from 'express';
import { aboutService } from '../services/about.service';
import { ApiResponse } from '../types';
import { AboutProfile } from '../types/database.types';

// Controller for handling public about profile endpoint (GET /api/v1/about).
export async function getAboutProfile(
  _req: Request,
  res: Response<ApiResponse<AboutProfile>>,
  next: NextFunction
): Promise<void> {
  try {
    const data = await aboutService.getPublicAboutProfile();
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
}
