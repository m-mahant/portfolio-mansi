import { Request, Response, NextFunction } from 'express';
import { introPageService } from '../services/intro-page.service';

// Controller for retrieving public intro page configuration (GET /api/v1/intro).
export async function getPublicIntroPage(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await introPageService.getPublicIntroPage();
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
}

// Controller for retrieving admin intro page configuration (GET /api/v1/admin/intro).
export async function getAdminIntroPage(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await introPageService.getAdminIntroPage();
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
}

// Controller for updating admin intro page configuration (PATCH /api/v1/admin/intro).
export async function updateAdminIntroPage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await introPageService.updateAdminIntroPage(req.body);
    res.status(200).json({
      success: true,
      data,
      message: 'Intro page configuration successfully updated.',
    });
  } catch (error) {
    next(error);
  }
}
