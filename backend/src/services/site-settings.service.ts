import { siteSettingsRepository } from '../repositories/site-settings.repository';
import { SiteSettings } from '../types/database.types';

// Service for fetching and formatting public site settings (global branding only).
export class SiteSettingsService {
  async getPublicSiteSettings(): Promise<SiteSettings> {
    const settings = await siteSettingsRepository.getSiteSettings();
    return {
      siteName: settings.siteName,
      siteTitle: settings.siteTitle,
      siteSubtitle: settings.siteSubtitle,
      shortDescription: settings.shortDescription,
      logo: settings.logo,
      favicon: settings.favicon,
      copyrightText: settings.copyrightText,
      seo: settings.seo,
      updatedAt: settings.updatedAt,
    };
  }
}

export const siteSettingsService = new SiteSettingsService();
