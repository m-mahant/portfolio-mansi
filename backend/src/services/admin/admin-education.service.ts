import { educationRepository } from '../../repositories/education.repository';
import { Education } from '../../types/database.types';
import { AppError } from '../../errors/app-error';

// Service orchestrating administrative CRUD operations for education entries.
export class AdminEducationService {
  // Retrieves paginated list of education entries for admin management.
  async getAllEducation(query: { isVisible?: boolean; page: number; limit: number }): Promise<{ items: Education[]; total: number }> {
    return educationRepository.getAllEducationAdmin(query);
  }

  // Creates a new education record.
  async createEducation(data: Omit<Education, 'id' | 'createdAt' | 'updatedAt'>): Promise<Education> {
    return educationRepository.createEducation(data);
  }

  // Updates an existing education record by ID.
  async updateEducation(id: string, updates: Partial<Education>): Promise<Education> {
    const updated = await educationRepository.updateEducation(id, updates);
    if (!updated) {
      throw AppError.notFound(`Education record with ID '${id}' not found.`);
    }
    return updated;
  }

  // Deletes an education record by ID.
  async deleteEducation(id: string): Promise<void> {
    const deleted = await educationRepository.deleteEducation(id);
    if (!deleted) {
      throw AppError.notFound(`Education record with ID '${id}' not found.`);
    }
  }
}

export const adminEducationService = new AdminEducationService();
