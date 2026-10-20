import { Request, Response, NextFunction } from 'express';
import { adminEducationService } from '../../services/admin/admin-education.service';
import { createEducationSchema, updateEducationSchema, adminListQuerySchema } from '../../validators/admin.validators';

// Controller for listing education entries (GET /api/v1/admin/education).
export async function getEducation(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const query = adminListQuerySchema.parse(req.query);
    const isVisible = query.isVisible ? query.isVisible === 'true' : undefined;
    const result = await adminEducationService.getAllEducation({
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

// Controller for creating a new education entry (POST /api/v1/admin/education).
export async function createEducation(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const validatedBody = createEducationSchema.parse(req.body);
    const data = await adminEducationService.createEducation(validatedBody);
    res.status(201).json({
      success: true,
      data,
      message: 'Education entry successfully created.',
    });
  } catch (error) {
    next(error);
  }
}

// Controller for updating an existing education entry (PATCH /api/v1/admin/education/:educationId).
export async function updateEducation(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const educationId = Array.isArray(req.params.educationId) ? req.params.educationId[0] : req.params.educationId;
    const validatedBody = updateEducationSchema.parse(req.body);
    const data = await adminEducationService.updateEducation(educationId, validatedBody);
    res.status(200).json({
      success: true,
      data,
      message: 'Education entry successfully updated.',
    });
  } catch (error) {
    next(error);
  }
}

// Controller for deleting an education entry (DELETE /api/v1/admin/education/:educationId).
export async function deleteEducation(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const educationId = Array.isArray(req.params.educationId) ? req.params.educationId[0] : req.params.educationId;
    await adminEducationService.deleteEducation(educationId);
    res.status(200).json({
      success: true,
      message: 'Education entry successfully deleted.',
    });
  } catch (error) {
    next(error);
  }
}
