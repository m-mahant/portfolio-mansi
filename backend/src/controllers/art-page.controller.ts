import { Request, Response, NextFunction } from 'express';
import { artPageService } from '../services/art-page.service';

// GET /api/v1/art — public art listing page chrome.
export async function getPublicArtPage(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await artPageService.getPublicConfig();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

// GET /api/v1/admin/art — admin art page config.
export async function getAdminArtPage(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await artPageService.getAdminConfig();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

// PATCH /api/v1/admin/art — update art page config.
export async function updateAdminArtPage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await artPageService.updateAdminConfig(req.body);
    res.status(200).json({
      success: true,
      data,
      message: 'Art page configuration successfully updated.',
    });
  } catch (error) {
    next(error);
  }
}
