import { experiencePageRepository } from '../repositories/experience-page.repository';
import { ExperiencePageConfig } from '../types/database.types';

export class ExperiencePageService {
  async getPublicConfig(): Promise<ExperiencePageConfig> {
    return experiencePageRepository.getConfig();
  }

  async getAdminConfig(): Promise<ExperiencePageConfig> {
    return experiencePageRepository.getConfig();
  }

  async updateAdminConfig(updates: Partial<ExperiencePageConfig>): Promise<ExperiencePageConfig> {
    return experiencePageRepository.updateConfig(updates);
  }
}

export const experiencePageService = new ExperiencePageService();
