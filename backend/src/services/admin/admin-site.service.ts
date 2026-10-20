import { siteSettingsRepository } from '../../repositories/site-settings.repository';
import { SiteSettings } from '../../types/database.types';

// Service orchestrating administrative CRUD logic for global site settings.
export class AdminSiteService {
  // Fetches current site settings document.
  async getSiteSettings(): Promise<SiteSettings> {
    return siteSettingsRepository.getSiteSettings();
  }

  // Updates site settings document with partial validated payload.
  async updateSiteSettings(data: Partial<SiteSettings>): Promise<SiteSettings> {
    return siteSettingsRepository.updateSiteSettings(data);
  }
}

export const adminSiteService = new AdminSiteService();
