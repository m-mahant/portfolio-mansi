import { Request, Response, NextFunction } from 'express';
import { contactPageService } from '../services/contact-page.service';

// Controller for retrieving public contact page configuration (GET /api/v1/contact).
export async function getPublicContactPage(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await contactPageService.getPublicContactPage();
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
}

// Controller for retrieving admin contact page configuration (GET /api/v1/admin/contact).
export async function getAdminContactPage(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await contactPageService.getAdminContactPage();
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
}

// Controller for updating admin contact page configuration (PATCH /api/v1/admin/contact).
export async function updateAdminContactPage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await contactPageService.updateAdminContactPage(req.body);
    res.status(200).json({
      success: true,
      data,
      message: 'Contact page configuration successfully updated.',
    });
  } catch (error) {
    next(error);
  }
}
