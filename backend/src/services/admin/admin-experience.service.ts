import { experienceRepository } from '../../repositories/experience.repository';
import { Experience } from '../../types/database.types';
import { AppError } from '../../errors/app-error';

// Service orchestrating administrative CRUD operations for professional experience entries.
export class AdminExperienceService {
  // Retrieves paginated list of professional experience entries for admin management.
  async getAllExperiences(query: { isVisible?: boolean; page: number; limit: number }): Promise<{ items: Experience[]; total: number }> {
    return experienceRepository.getAllExperiencesAdmin(query);
  }

  // Creates a new professional experience entry with current role date validation.
  async createExperience(data: Omit<Experience, 'id' | 'createdAt' | 'updatedAt'>): Promise<Experience> {
    const payload = { ...data };
    if (payload.isCurrent) {
      delete payload.endDate;
    }
    return experienceRepository.createExperience(payload);
  }

  // Updates an existing professional experience entry by ID.
  async updateExperience(id: string, updates: Partial<Experience>): Promise<Experience> {
    const existing = await experienceRepository.getExperienceById(id);
    if (!existing) {
      throw AppError.notFound(`Experience record with ID '${id}' not found.`);
    }

    const payload = { ...updates };
    if (payload.isCurrent === true) {
      payload.endDate = undefined;
    }

    const updated = await experienceRepository.updateExperience(id, payload);
    if (!updated) {
      throw AppError.notFound(`Experience record with ID '${id}' not found.`);
    }
    return updated;
  }

  // Deletes a professional experience entry by ID.
  async deleteExperience(id: string): Promise<void> {
    const deleted = await experienceRepository.deleteExperience(id);
    if (!deleted) {
      throw AppError.notFound(`Experience record with ID '${id}' not found.`);
    }
  }
}

export const adminExperienceService = new AdminExperienceService();
