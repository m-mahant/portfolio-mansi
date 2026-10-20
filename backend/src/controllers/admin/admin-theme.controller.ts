import { Request, Response, NextFunction } from 'express';
import { adminThemeService } from '../../services/admin/admin-theme.service';
import { updateThemeSettingsSchema } from '../../validators/admin.validators';

// Controller for retrieving active theme settings (GET /api/v1/admin/theme).
export async function getThemeSettings(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await adminThemeService.getThemeSettings();
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
}

// Controller for updating active theme settings (PATCH /api/v1/admin/theme).
export async function updateThemeSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const validatedBody = updateThemeSettingsSchema.parse(req.body);
    const data = await adminThemeService.updateThemeSettings(validatedBody);
    res.status(200).json({
      success: true,
      data,
      message: 'Theme settings successfully updated.',
    });
  } catch (error) {
    next(error);
  }
}
