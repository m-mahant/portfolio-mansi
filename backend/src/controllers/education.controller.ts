import { Request, Response, NextFunction } from 'express';
import { educationService } from '../services/education.service';
import { ApiResponse } from '../types';
import { Education } from '../types/database.types';

// Controller for handling public education and credentials endpoint (GET /api/v1/education).
export async function getEducation(
  _req: Request,
  res: Response<ApiResponse<Education[]>>,
  next: NextFunction
): Promise<void> {
  try {
    const data = await educationService.getPublicEducation();
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
}
