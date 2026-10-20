import { homePageRepository } from '../repositories/home-page.repository';
import { HomePageConfig } from '../types/database.types';

export interface PublicHomePageResponse {
  config: HomePageConfig;
}

export class HomePageService {
  // Returns public home page configuration (hero only).
  async getPublicHomePage(): Promise<PublicHomePageResponse> {
    const config = await homePageRepository.getHomePageConfig();
    return { config };
  }

  // Gets home page configuration for administrative management.
  async getAdminHomePage(): Promise<HomePageConfig> {
    return homePageRepository.getHomePageConfig();
  }

  // Updates home page configuration, merging hero fields so portrait is not wiped.
  async updateAdminHomePage(updates: Partial<HomePageConfig>): Promise<HomePageConfig> {
    return homePageRepository.updateHomePageConfig(updates);
  }
}

export const homePageService = new HomePageService();
