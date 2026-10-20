import { aboutRepository } from '../repositories/about.repository';
import { AboutProfile } from '../types/database.types';

// Service for fetching public about profile data.
export class AboutService {
  async getPublicAboutProfile(): Promise<AboutProfile> {
    const profile = await aboutRepository.getAboutProfile();
    return {
      introduction: profile.introduction,
      myStory: profile.myStory,
      whatIDo: profile.whatIDo,
      developerSide: profile.developerSide,
      artistSide: profile.artistSide,
      philosophy: profile.philosophy,
      interests: profile.interests,
      profileImage: profile.profileImage,
      secondaryImage: profile.secondaryImage,
      resumeUrl: profile.resumeUrl,
      resumeLabel: profile.resumeLabel,
      shortBio: profile.shortBio,
      longBio: profile.longBio,
      updatedAt: profile.updatedAt,
    };
  }
}

export const aboutService = new AboutService();
