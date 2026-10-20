import { experienceRepository } from '../repositories/experience.repository';
import { Experience } from '../types/database.types';

// Service for career timeline experience data.
export class ExperienceService {
  async getPublicExperiences(): Promise<Experience[]> {
    return experienceRepository.getVisibleExperiences();
  }
}

export const experienceService = new ExperienceService();
