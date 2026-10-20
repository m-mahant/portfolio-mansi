import { educationRepository } from '../repositories/education.repository';
import { Education } from '../types/database.types';

// Service for academic background and credentials data.
export class EducationService {
  async getPublicEducation(): Promise<Education[]> {
    return educationRepository.getVisibleEducation();
  }
}

export const educationService = new EducationService();
