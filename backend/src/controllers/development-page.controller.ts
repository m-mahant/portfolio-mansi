import { Request, Response, NextFunction } from 'express';
import { developmentPageService } from '../services/development-page.service';

// GET /api/v1/development — public development listing page chrome.
export async function getPublicDevelopmentPage(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await developmentPageService.getPublicConfig();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

// GET /api/v1/admin/development — admin development page config.
export async function getAdminDevelopmentPage(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await developmentPageService.getAdminConfig();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

// PATCH /api/v1/admin/development — update development page config.
export async function updateAdminDevelopmentPage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await developmentPageService.updateAdminConfig(req.body);
    res.status(200).json({
      success: true,
      data,
      message: 'Development page configuration successfully updated.',
    });
  } catch (error) {
    next(error);
  }
}
