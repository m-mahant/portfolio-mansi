import { Request, Response, NextFunction } from 'express';
import { experiencePageService } from '../services/experience-page.service';

// GET /api/v1/experience-page — public experience page chrome.
export async function getPublicExperiencePage(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await experiencePageService.getPublicConfig();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

// GET /api/v1/admin/experience-page — admin experience page config.
export async function getAdminExperiencePage(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await experiencePageService.getAdminConfig();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

// PATCH /api/v1/admin/experience-page — update experience page config.
export async function updateAdminExperiencePage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await experiencePageService.updateAdminConfig(req.body);
    res.status(200).json({
      success: true,
      data,
      message: 'Experience page configuration successfully updated.',
    });
  } catch (error) {
    next(error);
  }
}
