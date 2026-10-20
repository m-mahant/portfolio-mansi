import { Request, Response, NextFunction } from 'express';
import { experienceService } from '../services/experience.service';
import { ApiResponse } from '../types';
import { Experience } from '../types/database.types';

// Controller for handling public professional experience endpoint (GET /api/v1/experience).
export async function getExperiences(
  _req: Request,
  res: Response<ApiResponse<Experience[]>>,
  next: NextFunction
): Promise<void> {
  try {
    const data = await experienceService.getPublicExperiences();
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
}
