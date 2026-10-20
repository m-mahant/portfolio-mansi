import { Request, Response, NextFunction } from 'express';
import { workPageService } from '../services/work-page.service';

// Controller for retrieving public work overview payload (GET /api/v1/work).
export async function getPublicWorkPage(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await workPageService.getPublicWorkPage();
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
}

// Controller for retrieving admin work page configuration (GET /api/v1/admin/work).
export async function getAdminWorkPage(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await workPageService.getAdminWorkPage();
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
}

// Controller for updating admin work page configuration (PATCH /api/v1/admin/work).
export async function updateAdminWorkPage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await workPageService.updateAdminWorkPage(req.body);
    res.status(200).json({
      success: true,
      data,
      message: 'Work page configuration successfully updated.',
    });
  } catch (error) {
    next(error);
  }
}
