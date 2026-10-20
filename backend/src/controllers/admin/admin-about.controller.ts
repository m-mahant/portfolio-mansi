import { Request, Response, NextFunction } from 'express';
import { adminAboutService } from '../../services/admin/admin-about.service';
import { updateAboutProfileSchema } from '../../validators/admin.validators';

// Controller for retrieving about profile document (GET /api/v1/admin/about).
export async function getAboutProfile(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await adminAboutService.getAboutProfile();
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
}

// Controller for updating about profile document (PATCH /api/v1/admin/about).
export async function updateAboutProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const validatedBody = updateAboutProfileSchema.parse(req.body);
    const data = await adminAboutService.updateAboutProfile(validatedBody);
    res.status(200).json({
      success: true,
      data,
      message: 'About profile successfully updated.',
    });
  } catch (error) {
    next(error);
  }
}
