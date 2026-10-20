import { Request, Response, NextFunction } from 'express';
import { adminSiteService } from '../../services/admin/admin-site.service';
import { updateSiteSettingsSchema } from '../../validators/admin.validators';

// Controller for retrieving global site settings document (GET /api/v1/admin/site).
export async function getSiteSettings(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await adminSiteService.getSiteSettings();
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
}

// Controller for updating global site settings document (PATCH /api/v1/admin/site).
export async function updateSiteSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const validatedBody = updateSiteSettingsSchema.parse(req.body);
    const data = await adminSiteService.updateSiteSettings(validatedBody);
    res.status(200).json({
      success: true,
      data,
      message: 'Site settings successfully updated.',
    });
  } catch (error) {
    next(error);
  }
}
