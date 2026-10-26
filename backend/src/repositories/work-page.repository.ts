import { db, isFirebaseInitialized } from '../config/firebase.config';
import { WorkPageConfig } from '../types/database.types';
import { AppError } from '../errors/app-error';
import {
  hasRetiredFields,
  normalizeForFirestore,
  omitRetiredFields,
  retiredFieldDeletes,
} from '../utils/firestore.utils';

const RETIRED_WORK_FIELDS = ['featuredProjectIds', 'featuredArtworkIds'] as const;

// Default Work page configuration.
const DEFAULT_WORK_PAGE_CONFIG: WorkPageConfig = {
  title: 'Work Overview',
  subtitle: 'Select a discipline to view published projects and creative artwork.',
  description: 'Comprehensive gallery of software engineering projects and digital artwork portfolios.',
  devTitle: 'Development',
  devDescription: 'Full-stack web engineering, cloud architecture diagrams, API specs, and technical case studies.',
  artTitle: 'Art & Photography',
  artDescription: 'Digital illustration, concept art, and photography — outside the client brief.',
  seo: {
    title: 'Work Overview | Mansi Mahant',
    description: 'Explore software development case studies and creative digital art portfolios.',
  },
  updatedAt: new Date().toISOString(),
};

let inMemoryWorkPageConfig: WorkPageConfig = { ...DEFAULT_WORK_PAGE_CONFIG };

// Drops leftover featured-ID arrays that are no longer part of workPage/config.
function sanitizeWorkPageConfig(raw: Record<string, unknown> | WorkPageConfig): WorkPageConfig {
  return omitRetiredFields(raw as Record<string, unknown>, RETIRED_WORK_FIELDS) as unknown as WorkPageConfig;
}

// Repository for accessing and mutating Work Page configuration document in Firestore (workPage/config).
export class WorkPageRepository {
  // Retrieves work page configuration document from Firestore or fallback memory store.
  async getWorkPageConfig(): Promise<WorkPageConfig> {
    if (!isFirebaseInitialized() || !db) {
      return sanitizeWorkPageConfig(inMemoryWorkPageConfig as unknown as Record<string, unknown>);
    }

    try {
      const docRef = db.collection('workPage').doc('config');
      const snapshot = await docRef.get();
      if (!snapshot.exists) {
        return sanitizeWorkPageConfig(inMemoryWorkPageConfig as unknown as Record<string, unknown>);
      }
      const raw = (snapshot.data() || {}) as Record<string, unknown>;
      const sanitized = sanitizeWorkPageConfig(raw);
      if (hasRetiredFields(raw, RETIRED_WORK_FIELDS)) {
        try {
          await this.persistWorkPage(sanitized);
        } catch {
          // Return the allowlisted shape even if leftover-key deletion fails.
        }
      }
      return sanitized;
    } catch {
      return sanitizeWorkPageConfig(inMemoryWorkPageConfig as unknown as Record<string, unknown>);
    }
  }

  // Updates work page configuration document in Firestore.
  async updateWorkPageConfig(updates: Partial<WorkPageConfig>): Promise<WorkPageConfig> {
    const current = await this.getWorkPageConfig();
    const updated = sanitizeWorkPageConfig({
      ...current,
      ...updates,
      seo: {
        ...current.seo,
        ...updates.seo,
      },
      updatedAt: new Date().toISOString(),
    } as Record<string, unknown>);

    if (!isFirebaseInitialized() || !db) {
      inMemoryWorkPageConfig = updated;
      return inMemoryWorkPageConfig;
    }

    try {
      return await this.persistWorkPage(updated);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update work page configuration in database';
      throw AppError.internal(message);
    }
  }

  // Writes the allowlisted Work document and deletes retired leftover keys.
  private async persistWorkPage(updated: WorkPageConfig): Promise<WorkPageConfig> {
    if (!db) {
      inMemoryWorkPageConfig = updated;
      return updated;
    }
    const docRef = db.collection('workPage').doc('config');
    await docRef.set(
      {
        ...normalizeForFirestore(updated),
        ...retiredFieldDeletes(RETIRED_WORK_FIELDS),
      },
      { merge: true }
    );
    return updated;
  }
}

export const workPageRepository = new WorkPageRepository();
