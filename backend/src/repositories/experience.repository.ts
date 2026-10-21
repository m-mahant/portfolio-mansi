import { Query } from 'firebase-admin/firestore';
import { db, isFirebaseInitialized } from '../config/firebase.config';
import { Experience } from '../types/database.types';
import { AppError } from '../errors/app-error';

// Memory fallback store for experiences when Firestore is uninitialized.
let inMemoryExperiences: Experience[] = [];

// Repository for querying and mutating professional experience in Firestore.
export class ExperienceRepository {
  // Retrieves visible professional experience entries sorted by display order.
  async getVisibleExperiences(): Promise<Experience[]> {
    if (!isFirebaseInitialized() || !db) {
      return inMemoryExperiences.filter((item) => item.isVisible).sort((a, b) => a.displayOrder - b.displayOrder);
    }

    try {
      const snapshot = await db
        .collection('experiences')
        .where('isVisible', '==', true)
        .get();

      if (snapshot.empty) {
        return [];
      }

      const items: Experience[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Experience, 'id'>),
      }));

      return items.sort((a, b) => a.displayOrder - b.displayOrder);
    } catch {
      return inMemoryExperiences.filter((item) => item.isVisible).sort((a, b) => a.displayOrder - b.displayOrder);
    }
  }

  // Retrieves all experience records for admin management with filtering and pagination.
  async getAllExperiencesAdmin(options: {
    isVisible?: boolean;
    page: number;
    limit: number;
  }): Promise<{ items: Experience[]; total: number }> {
    if (!isFirebaseInitialized() || !db) {
      let filtered = [...inMemoryExperiences];
      if (options.isVisible !== undefined) {
        filtered = filtered.filter((item) => item.isVisible === options.isVisible);
      }
      filtered.sort((a, b) => a.displayOrder - b.displayOrder);
      const total = filtered.length;
      const offset = (options.page - 1) * options.limit;
      const items = filtered.slice(offset, offset + options.limit);
      return { items, total };
    }

    try {
      let query: Query = db.collection('experiences');
      if (options.isVisible !== undefined) {
        query = query.where('isVisible', '==', options.isVisible);
      }
      query = query.orderBy('displayOrder', 'asc');

      const countSnapshot = await query.get();
      const total = countSnapshot.size;

      const offset = (options.page - 1) * options.limit;
      const snapshot = await query.offset(offset).limit(options.limit).get();

      const items: Experience[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Experience, 'id'>),
      }));

      return { items, total };
    } catch {
      return { items: [], total: 0 };
    }
  }

  // Retrieves a single experience record by document ID.
  async getExperienceById(id: string): Promise<Experience | null> {
    if (!isFirebaseInitialized() || !db) {
      return inMemoryExperiences.find((item) => item.id === id) || null;
    }

    try {
      const docRef = db.collection('experiences').doc(id);
      const snapshot = await docRef.get();
      if (!snapshot.exists) {
        return null;
      }
      return {
        id: snapshot.id,
        ...(snapshot.data() as Omit<Experience, 'id'>),
      };
    } catch {
      return null;
    }
  }

  // Creates a new experience entry in Firestore.
  async createExperience(data: Omit<Experience, 'id' | 'createdAt' | 'updatedAt'>): Promise<Experience> {
    const now = new Date().toISOString();

    if (!isFirebaseInitialized() || !db) {
      const newId = `exp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const newRecord: Experience = {
        id: newId,
        ...data,
        createdAt: now,
        updatedAt: now,
      };
      inMemoryExperiences.push(newRecord);
      return newRecord;
    }

    try {
      const docRef = db.collection('experiences').doc();
      const newRecord: Experience = {
        id: docRef.id,
        ...data,
        createdAt: now,
        updatedAt: now,
      };
      const { id, ...persistedData } = newRecord;
      await docRef.set(persistedData);
      return newRecord;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create experience document';
      throw AppError.internal(message);
    }
  }

  // Updates an existing experience entry in Firestore.
  async updateExperience(id: string, updates: Partial<Experience>): Promise<Experience | null> {
    const existing = await this.getExperienceById(id);
    if (!existing) {
      return null;
    }

    const updated: Experience = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    if (!isFirebaseInitialized() || !db) {
      const index = inMemoryExperiences.findIndex((item) => item.id === id);
      if (index !== -1) {
        inMemoryExperiences[index] = updated;
      }
      return updated;
    }

    try {
      const docRef = db.collection('experiences').doc(id);
      const { id: _, ...persistedData } = updated;
      await docRef.set(persistedData, { merge: true });
      return updated;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update experience document';
      throw AppError.internal(message);
    }
  }

  // Deletes an experience document from Firestore.
  async deleteExperience(id: string): Promise<boolean> {
    const existing = await this.getExperienceById(id);
    if (!existing) {
      return false;
    }

    if (!isFirebaseInitialized() || !db) {
      inMemoryExperiences = inMemoryExperiences.filter((item) => item.id !== id);
      return true;
    }

    try {
      await db.collection('experiences').doc(id).delete();
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete experience document';
      throw AppError.internal(message);
    }
  }
}

export const experienceRepository = new ExperienceRepository();
