import { db, isFirebaseInitialized } from '../config/firebase.config';
import { ExperiencePageConfig } from '../types/database.types';
import { AppError } from '../errors/app-error';
import { normalizeForFirestore } from '../utils/firestore.utils';

const DEFAULT_EXPERIENCE_PAGE_CONFIG: ExperiencePageConfig = {
  title: 'Professional Experience & Education',
  subtitle:
    'A timeline of software engineering roles, technical leadership positions, cloud infrastructure projects, and formal academic background.',
  educationSectionTitle: 'Education & Certifications',
  educationSectionSubtitle: 'Academic background and professional certifications.',
  seo: {
    title: 'Experience & Education | Lumenfolio',
    description:
      'A timeline of software engineering roles, technical leadership positions, and formal academic background.',
  },
  updatedAt: new Date().toISOString(),
};

let inMemoryConfig: ExperiencePageConfig = { ...DEFAULT_EXPERIENCE_PAGE_CONFIG };

// Repository for experiencePage/config singleton (public /experience chrome).
export class ExperiencePageRepository {
  async getConfig(): Promise<ExperiencePageConfig> {
    if (!isFirebaseInitialized() || !db) {
      return inMemoryConfig;
    }

    try {
      const snapshot = await db.collection('experiencePage').doc('config').get();
      if (!snapshot.exists) {
        return inMemoryConfig;
      }
      return snapshot.data() as ExperiencePageConfig;
    } catch {
      return inMemoryConfig;
    }
  }

  async updateConfig(updates: Partial<ExperiencePageConfig>): Promise<ExperiencePageConfig> {
    const current = await this.getConfig();
    const updated: ExperiencePageConfig = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    if (!isFirebaseInitialized() || !db) {
      inMemoryConfig = updated;
      return inMemoryConfig;
    }

    try {
      await db.collection('experiencePage').doc('config').set(normalizeForFirestore(updated), { merge: true });
      return updated;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update experience page configuration';
      throw AppError.internal(message);
    }
  }
}

export const experiencePageRepository = new ExperiencePageRepository();
