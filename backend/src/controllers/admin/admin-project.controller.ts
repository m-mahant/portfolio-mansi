import { Request, Response, NextFunction } from 'express';
import { adminProjectService } from '../../services/admin/admin-project.service';
import { createProjectSchema, updateProjectSchema, adminProjectListQuerySchema } from '../../validators/admin.validators';

// Controller for listing projects with administrative filters and pagination (GET /api/v1/admin/projects).
export async function getProjects(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const query = adminProjectListQuerySchema.parse(req.query);
    const featured = query.featured ? query.featured === 'true' : undefined;
    const result = await adminProjectService.getAllProjects({
      status: query.status,
      featured,
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

// Controller for retrieving a single project document by ID (GET /api/v1/admin/projects/:projectId).
export async function getProjectById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const projectId = Array.isArray(req.params.projectId) ? req.params.projectId[0] : req.params.projectId;
    const data = await adminProjectService.getProjectById(projectId);
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
}

// Controller for creating a new project document (POST /api/v1/admin/projects).
export async function createProject(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const validatedBody = createProjectSchema.parse(req.body);
    const data = await adminProjectService.createProject(validatedBody);
    res.status(201).json({
      success: true,
      data,
      message: 'Project document successfully created.',
    });
  } catch (error) {
    next(error);
  }
}

// Controller for updating an existing project document (PATCH /api/v1/admin/projects/:projectId).
export async function updateProject(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const projectId = Array.isArray(req.params.projectId) ? req.params.projectId[0] : req.params.projectId;
    const validatedBody = updateProjectSchema.parse(req.body);
    const data = await adminProjectService.updateProject(projectId, validatedBody);
    res.status(200).json({
      success: true,
      data,
      message: 'Project document successfully updated.',
    });
  } catch (error) {
    next(error);
  }
}

// Controller for deleting a project document (DELETE /api/v1/admin/projects/:projectId).
export async function deleteProject(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const projectId = Array.isArray(req.params.projectId) ? req.params.projectId[0] : req.params.projectId;
    await adminProjectService.deleteProject(projectId);
    res.status(200).json({
      success: true,
      message: 'Project document successfully deleted.',
    });
  } catch (error) {
    next(error);
  }
}
