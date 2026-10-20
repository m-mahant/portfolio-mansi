import { themeRepository } from '../repositories/theme.repository';
import { ThemeSettings } from '../types/database.types';

// Service for fetching active public dynamic theme settings.
export class ThemeService {
  async getPublicThemeSettings(): Promise<ThemeSettings> {
    return themeRepository.getActiveThemeSettings();
  }
}

export const themeService = new ThemeService();
