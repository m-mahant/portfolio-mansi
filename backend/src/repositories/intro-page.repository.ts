import { db, isFirebaseInitialized } from '../config/firebase.config';
import { IntroPageConfig } from '../types/database.types';
import { AppError } from '../errors/app-error';
import { normalizeForFirestore } from '../utils/firestore.utils';

// Default Intro page configuration.
const DEFAULT_INTRO_PAGE_CONFIG: IntroPageConfig = {
  headline: 'Where Logic Meets',
  headlineAccent: 'Imagination',
  subtitle: 'Engineering digital experiences with the precision of code and the freedom of art.',
  exploreButtonLabel: 'Explore Lumenfolio',
  exploreButtonTarget: '/',
  enabled: true,
  seo: {
    title: 'Welcome | Lumenfolio',
    description: 'Entry experience for Lumenfolio portfolio.',
  },
  updatedAt: new Date().toISOString(),
};

let inMemoryIntroPageConfig: IntroPageConfig = { ...DEFAULT_INTRO_PAGE_CONFIG };

// Repository for accessing and mutating Intro Page configuration document in Firestore (introPage/config).
export class IntroPageRepository {
  // Retrieves intro page configuration document from Firestore or fallback memory store.
  async getIntroPageConfig(): Promise<IntroPageConfig> {
    if (!isFirebaseInitialized() || !db) {
      return inMemoryIntroPageConfig;
    }

    try {
      const docRef = db.collection('introPage').doc('config');
      const snapshot = await docRef.get();
      if (!snapshot.exists) {
        return inMemoryIntroPageConfig;
      }
      return snapshot.data() as IntroPageConfig;
    } catch {
      return inMemoryIntroPageConfig;
    }
  }

  // Updates intro page configuration document in Firestore.
  async updateIntroPageConfig(updates: Partial<IntroPageConfig>): Promise<IntroPageConfig> {
    const current = await this.getIntroPageConfig();
    const updated: IntroPageConfig = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    if (!isFirebaseInitialized() || !db) {
      inMemoryIntroPageConfig = updated;
      return inMemoryIntroPageConfig;
    }

    try {
      const docRef = db.collection('introPage').doc('config');
      await docRef.set(normalizeForFirestore(updated), { merge: true });
      return updated;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update intro page configuration in database';
      throw AppError.internal(message);
    }
  }
}

export const introPageRepository = new IntroPageRepository();
