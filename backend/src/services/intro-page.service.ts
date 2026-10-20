import { introPageRepository } from '../repositories/intro-page.repository';
import { IntroPageConfig } from '../types/database.types';

export class IntroPageService {
  // Resolves public intro page configuration document.
  async getPublicIntroPage(): Promise<IntroPageConfig> {
    return introPageRepository.getIntroPageConfig();
  }

  // Resolves admin intro page configuration document.
  async getAdminIntroPage(): Promise<IntroPageConfig> {
    return introPageRepository.getIntroPageConfig();
  }

  // Updates admin intro page configuration document.
  async updateAdminIntroPage(updates: Partial<IntroPageConfig>): Promise<IntroPageConfig> {
    return introPageRepository.updateIntroPageConfig(updates);
  }
}

export const introPageService = new IntroPageService();
