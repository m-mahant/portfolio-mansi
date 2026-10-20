import { Request, Response, NextFunction } from 'express';
import { adminExperienceService } from '../../services/admin/admin-experience.service';
import { createExperienceSchema, updateExperienceSchema, adminListQuerySchema } from '../../validators/admin.validators';

// Controller for listing professional experience entries (GET /api/v1/admin/experience).
export async function getExperiences(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const query = adminListQuerySchema.parse(req.query);
    const isVisible = query.isVisible ? query.isVisible === 'true' : undefined;
    const result = await adminExperienceService.getAllExperiences({
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

// Controller for creating a new experience entry (POST /api/v1/admin/experience).
export async function createExperience(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const validatedBody = createExperienceSchema.parse(req.body);
    const data = await adminExperienceService.createExperience(validatedBody);
    res.status(201).json({
      success: true,
      data,
      message: 'Experience entry successfully created.',
    });
  } catch (error) {
    next(error);
  }
}

// Controller for updating an existing experience entry (PATCH /api/v1/admin/experience/:experienceId).
export async function updateExperience(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const experienceId = Array.isArray(req.params.experienceId) ? req.params.experienceId[0] : req.params.experienceId;
    const validatedBody = updateExperienceSchema.parse(req.body);
    const data = await adminExperienceService.updateExperience(experienceId, validatedBody);
    res.status(200).json({
      success: true,
      data,
      message: 'Experience entry successfully updated.',
    });
  } catch (error) {
    next(error);
  }
}

// Controller for deleting an experience entry (DELETE /api/v1/admin/experience/:experienceId).
export async function deleteExperience(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const experienceId = Array.isArray(req.params.experienceId) ? req.params.experienceId[0] : req.params.experienceId;
    await adminExperienceService.deleteExperience(experienceId);
    res.status(200).json({
      success: true,
      message: 'Experience entry successfully deleted.',
    });
  } catch (error) {
    next(error);
  }
}
