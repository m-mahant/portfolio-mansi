import { Request, Response, NextFunction } from 'express';
import { projectService, PaginatedProjectsResponse } from '../services/project.service';
import { ApiResponse } from '../types';
import { Project } from '../types/database.types';

// Controller for handling public project list endpoint (GET /api/v1/projects).
export async function getProjects(
  req: Request,
  res: Response<ApiResponse<PaginatedProjectsResponse>>,
  next: NextFunction
): Promise<void> {
  try {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
    const featured = req.query.featured === 'true' ? true : undefined;

    const data = await projectService.getPublicProjects({
      featured,
      page,
      limit,
    });

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
}

// Controller for handling public project detail endpoint by slug (GET /api/v1/projects/:slug).
export async function getProjectBySlug(
  req: Request,
  res: Response<ApiResponse<Project>>,
  next: NextFunction
): Promise<void> {
  try {
    const rawSlug = req.params.slug;
    const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;
    const data = await projectService.getPublicProjectBySlug(slug);
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
}
