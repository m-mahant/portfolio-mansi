import { FieldValue } from 'firebase-admin/firestore';
import { db, isFirebaseInitialized } from '../config/firebase.config';
import { HomePageConfig } from '../types/database.types';
import { AppError } from '../errors/app-error';
import { normalizeForFirestore } from '../utils/firestore.utils';

// Default home page configuration when Firestore document is uninitialized.
const DEFAULT_HOME_PAGE_CONFIG: HomePageConfig = {
  hero: {
    mainHeading: 'Building Digital Futures × Creative Crafts',
    accentHeading: 'Full-stack engineering meets visual design & digital craftsmanship.',
    description: 'Specializing in robust cloud architecture, interactive frontends, and fine digital illustration.',
    devCardTitle: 'Software Engineering',
    devCardDescription: 'Full-stack web apps, cloud architectures, REST APIs, and high-performance algorithms.',
    artCardTitle: 'Creative Visual Art',
    artCardDescription: 'Digital illustrations, 3D modeling, traditional painting, and interactive visual media.',
    devCtaText: 'Explore Engineering Work',
    artCtaText: 'View Digital Art Gallery',
    devCtaTarget: '/work/development',
    artCtaTarget: '/work/art-crafts',
  },
  seo: {
    title: 'Home | Lumenfolio',
    description: 'Official portfolio showcasing full-stack engineering projects and digital artwork.',
  },
  updatedAt: new Date().toISOString(),
};

// In-memory fallback store for home page configuration when Firestore is unavailable.
let inMemoryHomePageConfig: HomePageConfig = { ...DEFAULT_HOME_PAGE_CONFIG };

const RETIRED_HOME_FIELDS = [
  'creativeWorlds',
  'announcement',
  'featuredDevelopment',
  'featuredArt',
  'latestBlog',
] as const;

// Drops retired Home fields so leftover Firestore keys never reach Admin or Public APIs.
function sanitizeHomePageConfig(raw: HomePageConfig | Record<string, unknown>): HomePageConfig {
  const config = { ...(raw as Record<string, unknown>) };
  for (const key of RETIRED_HOME_FIELDS) {
    delete config[key];
  }
  const hero = config.hero;
  if (hero && typeof hero === 'object' && !Array.isArray(hero)) {
    const nextHero = { ...(hero as Record<string, unknown>) };
    delete nextHero.eyebrow;
    config.hero = nextHero;
  }
  return config as unknown as HomePageConfig;
}

// Repository for accessing and mutating Home Page configuration document in Firestore (homePage/config).
export class HomePageRepository {
  // Retrieves home page configuration document from Firestore or fallback memory store.
  async getHomePageConfig(): Promise<HomePageConfig> {
    if (!isFirebaseInitialized() || !db) {
      return sanitizeHomePageConfig(inMemoryHomePageConfig);
    }

    try {
      const docRef = db.collection('homePage').doc('config');
      const snapshot = await docRef.get();
      if (!snapshot.exists) {
        return sanitizeHomePageConfig(inMemoryHomePageConfig);
      }
      return sanitizeHomePageConfig(snapshot.data() as Record<string, unknown>);
    } catch {
      return sanitizeHomePageConfig(inMemoryHomePageConfig);
    }
  }

  // Updates home page configuration document in Firestore.
  async updateHomePageConfig(updates: Partial<HomePageConfig>): Promise<HomePageConfig> {
    const current = await this.getHomePageConfig();
    const updated = sanitizeHomePageConfig({
      ...current,
      ...updates,
      hero: {
        ...current.hero,
        ...updates.hero,
      },
      seo: {
        ...current.seo,
        ...updates.seo,
      },
      updatedAt: new Date().toISOString(),
    });

    if (!isFirebaseInitialized() || !db) {
      inMemoryHomePageConfig = updated;
      return inMemoryHomePageConfig;
    }

    try {
      const docRef = db.collection('homePage').doc('config');
      const payload: Record<string, unknown> = {
        ...normalizeForFirestore(updated),
      };
      for (const key of RETIRED_HOME_FIELDS) {
        payload[key] = FieldValue.delete();
      }
      await docRef.set(payload, { merge: true });
      await docRef.update({ 'hero.eyebrow': FieldValue.delete() });
      return updated;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update home page configuration in database';
      throw AppError.internal(message);
    }
  }
}

export const homePageRepository = new HomePageRepository();
