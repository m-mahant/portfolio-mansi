import { socialLinkRepository } from '../repositories/social-link.repository';
import { SocialLink } from '../types/database.types';

// Service for handling social links business logic.
export class SocialLinkService {
  async getPublicSocialLinks(): Promise<SocialLink[]> {
    return socialLinkRepository.getVisibleSocialLinks();
  }
}

export const socialLinkService = new SocialLinkService();
