import { projectRepository } from '../repositories/project.repository';
import { Project } from '../types/database.types';
import { computeProjectSections } from '../validators/database.validators';
import { AppError } from '../errors/app-error';

export interface PaginatedProjectsResponse {
  items: Project[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Service for managing software project retrieval and section normalization.
export class ProjectService {
  async getPublicProjects(options: {
    featured?: boolean;
    page?: number;
    limit?: number;
  }): Promise<PaginatedProjectsResponse> {
    const page = Math.max(1, options.page || 1);
    const limit = Math.min(50, Math.max(1, options.limit || 12));

    const { items, total } = await projectRepository.getPublishedProjects({
      featured: options.featured,
      page,
      limit,
    });

    const totalPages = Math.ceil(total / limit);

    // Compute availability map for each project in list
    const itemsWithSections = items.map((project) => ({
      ...project,
      sections: computeProjectSections(project),
    }));

    return {
      items: itemsWithSections,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  async getPublicProjectBySlug(slug: string): Promise<Project> {
    const cleanSlug = slug.trim();
    if (!cleanSlug) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Project slug parameter is required.');
    }

    const project = await projectRepository.getPublishedProjectBySlug(cleanSlug);
    if (!project) {
      throw new AppError(
        404,
        'RESOURCE_NOT_FOUND',
        `Project with slug '${cleanSlug}' was not found or is not published.`
      );
    }

    // Apply Hide Empty Sections Engine
    const sections = computeProjectSections(project);

    return {
      ...project,
      sections,
    };
  }
}

export const projectService = new ProjectService();
