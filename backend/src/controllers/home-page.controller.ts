import { Request, Response, NextFunction } from 'express';
import { homePageService } from '../services/home-page.service';

// Controller for retrieving public home page payload (GET /api/v1/home).
export async function getPublicHomePage(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await homePageService.getPublicHomePage();
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
}

// Controller for retrieving admin home page configuration (GET /api/v1/admin/home).
export async function getAdminHomePage(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await homePageService.getAdminHomePage();
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
}

// Controller for updating admin home page configuration (PATCH /api/v1/admin/home).
export async function updateAdminHomePage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await homePageService.updateAdminHomePage(req.body);
    res.status(200).json({
      success: true,
      data,
      message: 'Home page configuration successfully updated.',
    });
  } catch (error) {
    next(error);
  }
}
