import { Request, Response, NextFunction } from 'express';
import { siteSettingsService } from '../services/site-settings.service';
import { ApiResponse } from '../types';
import { SiteSettings } from '../types/database.types';

// Controller for handling public site settings endpoint (GET /api/v1/site).
export async function getSiteSettings(
  _req: Request,
  res: Response<ApiResponse<SiteSettings>>,
  next: NextFunction
): Promise<void> {
  try {
    const data = await siteSettingsService.getPublicSiteSettings();
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
}
