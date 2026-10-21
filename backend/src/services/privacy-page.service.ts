import { privacyPageRepository } from '../repositories/privacy-page.repository';
import { PrivacyPageConfig } from '../types/database.types';

export class PrivacyPageService {
  // Retrieves privacy page configuration for public display.
  async getPublicPrivacyPage(): Promise<PrivacyPageConfig> {
    return privacyPageRepository.getPrivacyPageConfig();
  }

  // Gets privacy page configuration for administrative management.
  async getAdminPrivacyPage(): Promise<PrivacyPageConfig> {
    return privacyPageRepository.getPrivacyPageConfig();
  }

  // Updates privacy page configuration document.
  async updateAdminPrivacyPage(updates: Partial<PrivacyPageConfig>): Promise<PrivacyPageConfig> {
    return privacyPageRepository.updatePrivacyPageConfig(updates);
  }
}

export const privacyPageService = new PrivacyPageService();
