import { aboutRepository } from '../../repositories/about.repository';
import { AboutProfile } from '../../types/database.types';

// Service orchestrating administrative CRUD logic for about profile.
export class AdminAboutService {
  // Fetches current about profile document.
  async getAboutProfile(): Promise<AboutProfile> {
    return aboutRepository.getAboutProfile();
  }

  // Updates about profile document with partial validated payload.
  async updateAboutProfile(data: Partial<AboutProfile>): Promise<AboutProfile> {
    return aboutRepository.updateAboutProfile(data);
  }
}

export const adminAboutService = new AdminAboutService();
