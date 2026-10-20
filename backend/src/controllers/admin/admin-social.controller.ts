import { Request, Response, NextFunction } from 'express';
import { adminSocialService } from '../../services/admin/admin-social.service';
import { createSocialLinkSchema, updateSocialLinkSchema, adminListQuerySchema } from '../../validators/admin.validators';

// Controller for listing all social links with filtering and pagination (GET /api/v1/admin/social-links).
export async function getSocialLinks(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const query = adminListQuerySchema.parse(req.query);
    const isVisible = query.isVisible ? query.isVisible === 'true' : undefined;
    const result = await adminSocialService.getAllSocialLinks({
      isVisible,
      page: query.page,
      limit: query.limit,
    });
    res.status(200).json({
      success: true,
      data: result.items,
      pagination: {
        page: query.page,
        limit: query.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / query.limit) || 1,
      },
    });
  } catch (error) {
    next(error);
  }
}

// Controller for creating a new social link entry (POST /api/v1/admin/social-links).
export async function createSocialLink(req: Request, res: Response, Next: NextFunction): Promise<void> {
  try {
    const validatedBody = createSocialLinkSchema.parse(req.body);
    const data = await adminSocialService.createSocialLink(validatedBody);
    res.status(201).json({
      success: true,
      data,
      message: 'Social link successfully created.',
    });
  } catch (error) {
    Next(error);
  }
}

// Controller for updating an existing social link entry (PATCH /api/v1/admin/social-links/:socialId).
export async function updateSocialLink(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const socialId = Array.isArray(req.params.socialId) ? req.params.socialId[0] : req.params.socialId;
    const validatedBody = updateSocialLinkSchema.parse(req.body);
    const data = await adminSocialService.updateSocialLink(socialId, validatedBody);
    res.status(200).json({
      success: true,
      data,
      message: 'Social link successfully updated.',
    });
  } catch (error) {
    next(error);
  }
}

// Controller for deleting a social link entry (DELETE /api/v1/admin/social-links/:socialId).
export async function deleteSocialLink(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const socialId = Array.isArray(req.params.socialId) ? req.params.socialId[0] : req.params.socialId;
    await adminSocialService.deleteSocialLink(socialId);
    res.status(200).json({
      success: true,
      message: 'Social link successfully deleted.',
    });
  } catch (error) {
    next(error);
  }
}
