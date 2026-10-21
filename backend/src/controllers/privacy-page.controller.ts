import { Request, Response, NextFunction } from 'express';
import { privacyPageService } from '../services/privacy-page.service';

// Controller for retrieving public privacy page configuration (GET /api/v1/privacy).
export async function getPublicPrivacyPage(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await privacyPageService.getPublicPrivacyPage();
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
}

// Controller for retrieving admin privacy page configuration (GET /api/v1/admin/privacy).
export async function getAdminPrivacyPage(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await privacyPageService.getAdminPrivacyPage();
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
}

// Controller for updating admin privacy page configuration (PATCH /api/v1/admin/privacy).
export async function updateAdminPrivacyPage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await privacyPageService.updateAdminPrivacyPage(req.body);
    res.status(200).json({
      success: true,
      data,
      message: 'Privacy page configuration successfully updated.',
    });
  } catch (error) {
    next(error);
  }
}
