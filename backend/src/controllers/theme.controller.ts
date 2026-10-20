import { Request, Response, NextFunction } from 'express';
import { themeService } from '../services/theme.service';
import { ApiResponse } from '../types';
import { ThemeSettings } from '../types/database.types';

// Controller for handling public dynamic theme settings endpoint (GET /api/v1/theme).
export async function getThemeSettings(
  _req: Request,
  res: Response<ApiResponse<ThemeSettings>>,
  next: NextFunction
): Promise<void> {
  try {
    const data = await themeService.getPublicThemeSettings();
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
}
