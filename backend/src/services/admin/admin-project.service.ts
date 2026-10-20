import { projectRepository, ProjectListResult } from '../../repositories/project.repository';
import { Project, PublishStatus } from '../../types/database.types';
import { AppError } from '../../errors/app-error';
import { normalizeSlug, computeProjectSections } from '../../validators/database.validators';
import { validateProjectForPublishing } from '../../validators/admin.validators';

// Service orchestrating administrative project management, slug checks, publishing lifecycles, and section availability.
export class AdminProjectService {
  // Retrieves paginated list of projects including drafts and archived items.
  async getAllProjects(query: {
    status?: PublishStatus;
    featured?: boolean;
    page: number;
    limit: number;
  }): Promise<ProjectListResult> {
    return projectRepository.getAllProjectsAdmin(query);
  }

  // Fetches a single project by document ID or throws 404 NOT_FOUND.
  async getProjectById(id: string): Promise<Project> {
    const project = await projectRepository.getProjectById(id);
    if (!project) {
      throw AppError.notFound(`Project with ID '${id}' not found.`);
    }
    return project;
  }

  // Creates a new project with slug normalization, duplicate detection, publish validation, and section computation.
  async createProject(data: Partial<Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'sections'>> & { title: string }): Promise<Project> {
    const rawSlug = data.slug || data.title;
    const slug = normalizeSlug(rawSlug);

    if (!slug) {
      throw AppError.badRequest('A valid title or slug must be provided.');
    }

    const existingWithSlug = await projectRepository.getProjectBySlug(slug);
    if (existingWithSlug) {
      throw AppError.conflict(`A project with slug '${slug}' already exists.`);
    }

    const status: PublishStatus = data.status || 'draft';
    const projectPayload = {
      ...data,
      slug,
      shortDescription: data.shortDescription || '',
      status,
      isFeatured: data.isFeatured ?? false,
      displayOrder: data.displayOrder ?? 0,
      tags: data.tags || [],
      technologies: data.technologies || [],
      gallery: data.gallery || [],
      metrics: (data as Record<string, unknown>).metrics || [],
    };

    if (status === 'published') {
      validateProjectForPublishing(projectPayload as unknown as Record<string, unknown>);
    }

    const sections = computeProjectSections(projectPayload);

    return projectRepository.createProject({
      ...projectPayload,
      sections,
    });
  }

  // Updates an existing project with partial updates, slug conflict prevention, publish validation, and section recalculation.
  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    const existing = await projectRepository.getProjectById(id);
    if (!existing) {
      throw AppError.notFound(`Project with ID '${id}' not found.`);
    }

    let slug = existing.slug;
    if (updates.slug || updates.title) {
      const rawSlug = updates.slug || updates.title || existing.title;
      const newSlug = normalizeSlug(rawSlug);

      if (!newSlug) {
        throw AppError.badRequest('A valid title or slug must be provided.');
      }

      if (newSlug !== existing.slug) {
        const existingWithSlug = await projectRepository.getProjectBySlug(newSlug);
        if (existingWithSlug && existingWithSlug.id !== id) {
          throw AppError.conflict(`A project with slug '${newSlug}' already exists.`);
        }
        slug = newSlug;
      }
    }

    const mergedProject: Project = {
      ...existing,
      ...updates,
      slug,
      updatedAt: new Date().toISOString(),
    };

    if (mergedProject.status === 'published') {
      validateProjectForPublishing(mergedProject as unknown as Record<string, unknown>);
    }

    const sections = computeProjectSections(mergedProject);
    mergedProject.sections = sections;

    const updated = await projectRepository.updateProject(id, {
      ...updates,
      slug,
      sections,
    });

    if (!updated) {
      throw AppError.notFound(`Project with ID '${id}' not found.`);
    }

    return updated;
  }

  // Deletes project metadata from Firestore.
  async deleteProject(id: string): Promise<void> {
    const deleted = await projectRepository.deleteProject(id);
    if (!deleted) {
      throw AppError.notFound(`Project with ID '${id}' not found.`);
    }
  }
}

export const adminProjectService = new AdminProjectService();
