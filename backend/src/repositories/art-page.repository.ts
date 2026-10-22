import { db, isFirebaseInitialized } from '../config/firebase.config';
import { ArtPageConfig } from '../types/database.types';
import { AppError } from '../errors/app-error';
import { normalizeForFirestore } from '../utils/firestore.utils';

const DEFAULT_ART_PAGE_CONFIG: ArtPageConfig = {
  eyebrow: 'Art & Crafts',
  title: 'Art & Crafts Portfolio',
  subtitle: 'Digital illustration and concept art exploring color, light, and emotion.',
  description:
    'A personal space for visual storytelling, outside of any client brief — portrait and character illustration, fantasy concept art, botanical studies, and abstract composition.',
  galleryHeading: 'Art & Crafts Gallery',
  seo: {
    title: 'Art & Crafts Gallery | Mansi Mahant',
    description: 'Digital illustration, portrait studies, and conceptual art by Mansi Mahant.',
  },
  updatedAt: new Date().toISOString(),
};

let inMemoryConfig: ArtPageConfig = { ...DEFAULT_ART_PAGE_CONFIG };

// Repository for artPage/config singleton (public /work/art-crafts chrome).
export class ArtPageRepository {
  async getConfig(): Promise<ArtPageConfig> {
    if (!isFirebaseInitialized() || !db) {
      return inMemoryConfig;
    }

    try {
      const snapshot = await db.collection('artPage').doc('config').get();
      if (!snapshot.exists) {
        return inMemoryConfig;
      }
      return snapshot.data() as ArtPageConfig;
    } catch {
      return inMemoryConfig;
    }
  }

  async updateConfig(updates: Partial<ArtPageConfig>): Promise<ArtPageConfig> {
    const current = await this.getConfig();
    const updated: ArtPageConfig = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    if (!isFirebaseInitialized() || !db) {
      inMemoryConfig = updated;
      return inMemoryConfig;
    }

    try {
      await db.collection('artPage').doc('config').set(normalizeForFirestore(updated), { merge: true });
      return updated;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update art page configuration';
      throw AppError.internal(message);
    }
  }
}

export const artPageRepository = new ArtPageRepository();
