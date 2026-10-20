import { socialLinkRepository } from '../../repositories/social-link.repository';
import { SocialLink } from '../../types/database.types';
import { AppError } from '../../errors/app-error';

// Service orchestrating administrative CRUD operations for social links.
export class AdminSocialService {
  // Retrieves paginated list of social links for admin management.
  async getAllSocialLinks(query: { isVisible?: boolean; page: number; limit: number }): Promise<{ items: SocialLink[]; total: number }> {
    return socialLinkRepository.getAllSocialLinksAdmin(query);
  }

  // Creates a new social link entry.
  async createSocialLink(data: Omit<SocialLink, 'id' | 'createdAt' | 'updatedAt'>): Promise<SocialLink> {
    return socialLinkRepository.createSocialLink(data);
  }

  // Updates an existing social link entry.
  async updateSocialLink(id: string, updates: Partial<SocialLink>): Promise<SocialLink> {
    const updated = await socialLinkRepository.updateSocialLink(id, updates);
    if (!updated) {
      throw AppError.notFound(`Social link with ID '${id}' not found.`);
    }
    return updated;
  }

  // Deletes a social link entry.
  async deleteSocialLink(id: string): Promise<void> {
    const deleted = await socialLinkRepository.deleteSocialLink(id);
    if (!deleted) {
      throw AppError.notFound(`Social link with ID '${id}' not found.`);
    }
  }
}

export const adminSocialService = new AdminSocialService();
