import { artPageRepository } from '../repositories/art-page.repository';
import { ArtPageConfig } from '../types/database.types';

export class ArtPageService {
  async getPublicConfig(): Promise<ArtPageConfig> {
    return artPageRepository.getConfig();
  }

  async getAdminConfig(): Promise<ArtPageConfig> {
    return artPageRepository.getConfig();
  }

  async updateAdminConfig(updates: Partial<ArtPageConfig>): Promise<ArtPageConfig> {
    return artPageRepository.updateConfig(updates);
  }
}

export const artPageService = new ArtPageService();
