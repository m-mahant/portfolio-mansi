import { developmentPageRepository } from '../repositories/development-page.repository';
import { DevelopmentPageConfig } from '../types/database.types';

export class DevelopmentPageService {
  async getPublicConfig(): Promise<DevelopmentPageConfig> {
    return developmentPageRepository.getConfig();
  }

  async getAdminConfig(): Promise<DevelopmentPageConfig> {
    return developmentPageRepository.getConfig();
  }

  async updateAdminConfig(updates: Partial<DevelopmentPageConfig>): Promise<DevelopmentPageConfig> {
    return developmentPageRepository.updateConfig(updates);
  }
}

export const developmentPageService = new DevelopmentPageService();
