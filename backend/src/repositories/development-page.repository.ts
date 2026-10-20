import { db, isFirebaseInitialized } from '../config/firebase.config';
import { DevelopmentPageConfig } from '../types/database.types';
import { AppError } from '../errors/app-error';
import { normalizeForFirestore } from '../utils/firestore.utils';

const DEFAULT_DEVELOPMENT_PAGE_CONFIG: DevelopmentPageConfig = {
  title: 'Software Development Portfolio',
  subtitle:
    'Explore software engineering case studies, full-stack architectures, API systems, and production implementations.',
  seo: {
    title: 'Software Development Portfolio | Lumenfolio',
    description:
      'Explore software engineering case studies, full-stack architectures, API systems, and production implementations.',
  },
  updatedAt: new Date().toISOString(),
};

let inMemoryConfig: DevelopmentPageConfig = { ...DEFAULT_DEVELOPMENT_PAGE_CONFIG };

// Repository for developmentPage/config singleton (public /work/development chrome).
export class DevelopmentPageRepository {
  async getConfig(): Promise<DevelopmentPageConfig> {
    if (!isFirebaseInitialized() || !db) {
      return inMemoryConfig;
    }

    try {
      const snapshot = await db.collection('developmentPage').doc('config').get();
      if (!snapshot.exists) {
        return inMemoryConfig;
      }
      return snapshot.data() as DevelopmentPageConfig;
    } catch {
      return inMemoryConfig;
    }
  }

  async updateConfig(updates: Partial<DevelopmentPageConfig>): Promise<DevelopmentPageConfig> {
    const current = await this.getConfig();
    const updated: DevelopmentPageConfig = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    if (!isFirebaseInitialized() || !db) {
      inMemoryConfig = updated;
      return inMemoryConfig;
    }

    try {
      await db.collection('developmentPage').doc('config').set(normalizeForFirestore(updated), { merge: true });
      return updated;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update development page configuration';
      throw AppError.internal(message);
    }
  }
}

export const developmentPageRepository = new DevelopmentPageRepository();
