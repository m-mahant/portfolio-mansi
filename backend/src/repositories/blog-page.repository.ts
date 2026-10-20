import { db, isFirebaseInitialized } from '../config/firebase.config';
import { BlogPageConfig } from '../types/database.types';
import { AppError } from '../errors/app-error';
import { normalizeForFirestore } from '../utils/firestore.utils';

const DEFAULT_BLOG_PAGE_CONFIG: BlogPageConfig = {
  title: 'Blog & Articles',
  subtitle: 'Insights, engineering reflections, design patterns, and creative notes.',
  seo: {
    title: 'Blog & Articles | Mansi Mahant',
    description: 'Insights, engineering reflections, design patterns, and creative notes.',
  },
  updatedAt: new Date().toISOString(),
};

let inMemoryConfig: BlogPageConfig = { ...DEFAULT_BLOG_PAGE_CONFIG };

// Repository for blogPage/config singleton (public /blog listing chrome).
export class BlogPageRepository {
  async getConfig(): Promise<BlogPageConfig> {
    if (!isFirebaseInitialized() || !db) {
      return inMemoryConfig;
    }

    try {
      const snapshot = await db.collection('blogPage').doc('config').get();
      if (!snapshot.exists) {
        return inMemoryConfig;
      }
      return snapshot.data() as BlogPageConfig;
    } catch {
      return inMemoryConfig;
    }
  }

  async updateConfig(updates: Partial<BlogPageConfig>): Promise<BlogPageConfig> {
    const current = await this.getConfig();
    const updated: BlogPageConfig = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    if (!isFirebaseInitialized() || !db) {
      inMemoryConfig = updated;
      return inMemoryConfig;
    }

    try {
      await db.collection('blogPage').doc('config').set(normalizeForFirestore(updated), { merge: true });
      return updated;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update blog page configuration';
      throw AppError.internal(message);
    }
  }
}

export const blogPageRepository = new BlogPageRepository();
