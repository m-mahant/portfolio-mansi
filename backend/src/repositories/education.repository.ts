import { db, isFirebaseInitialized } from '../config/firebase.config';
import { Education } from '../types/database.types';
import { AppError } from '../errors/app-error';

// Memory fallback store for education records when Firestore is uninitialized.
let inMemoryEducation: Education[] = [];

// Repository for querying and mutating education entries in Firestore.
export class EducationRepository {
  // Retrieves visible education entries sorted by display order.
  async getVisibleEducation(): Promise<Education[]> {
    if (!isFirebaseInitialized() || !db) {
      return inMemoryEducation.filter((item) => item.isVisible).sort((a, b) => a.displayOrder - b.displayOrder);
    }

    try {
      const snapshot = await db
        .collection('education')
        .where('isVisible', '==', true)
        .get();

      if (snapshot.empty) {
        return [];
      }

      const items: Education[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Education, 'id'>),
      }));

      return items.sort((a, b) => a.displayOrder - b.displayOrder);
    } catch {
      return inMemoryEducation.filter((item) => item.isVisible).sort((a, b) => a.displayOrder - b.displayOrder);
    }
  }

  // Retrieves all education entries for admin management with filtering and pagination.
  async getAllEducationAdmin(options: {
    isVisible?: boolean;
    page: number;
    limit: number;
  }): Promise<{ items: Education[]; total: number }> {
    if (!isFirebaseInitialized() || !db) {
      let filtered = [...inMemoryEducation];
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
      let query: FirebaseFirestore.Query = db.collection('education');
      if (options.isVisible !== undefined) {
        query = query.where('isVisible', '==', options.isVisible);
      }
      query = query.orderBy('displayOrder', 'asc');

      const countSnapshot = await query.get();
      const total = countSnapshot.size;

      const offset = (options.page - 1) * options.limit;
      const snapshot = await query.offset(offset).limit(options.limit).get();

      const items: Education[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Education, 'id'>),
      }));

      return { items, total };
    } catch {
      return { items: [], total: 0 };
    }
  }

  // Retrieves a single education entry by ID.
  async getEducationById(id: string): Promise<Education | null> {
    if (!isFirebaseInitialized() || !db) {
      return inMemoryEducation.find((item) => item.id === id) || null;
    }

    try {
      const docRef = db.collection('education').doc(id);
      const snapshot = await docRef.get();
      if (!snapshot.exists) {
        return null;
      }
      return {
        id: snapshot.id,
        ...(snapshot.data() as Omit<Education, 'id'>),
      };
    } catch {
      return null;
    }
  }

  // Creates a new education record in Firestore.
  async createEducation(data: Omit<Education, 'id' | 'createdAt' | 'updatedAt'>): Promise<Education> {
    const now = new Date().toISOString();

    if (!isFirebaseInitialized() || !db) {
      const newId = `edu_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const newRecord: Education = {
        id: newId,
        ...data,
        createdAt: now,
        updatedAt: now,
      };
      inMemoryEducation.push(newRecord);
      return newRecord;
    }

    try {
      const docRef = db.collection('education').doc();
      const newRecord: Education = {
        id: docRef.id,
        ...data,
        createdAt: now,
        updatedAt: now,
      };
      const { id, ...persistedData } = newRecord;
      await docRef.set(persistedData);
      return newRecord;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create education record';
      throw AppError.internal(message);
    }
  }

  // Updates an existing education record in Firestore.
  async updateEducation(id: string, updates: Partial<Education>): Promise<Education | null> {
    const existing = await this.getEducationById(id);
    if (!existing) {
      return null;
    }

    const updated: Education = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    if (!isFirebaseInitialized() || !db) {
      const index = inMemoryEducation.findIndex((item) => item.id === id);
      if (index !== -1) {
        inMemoryEducation[index] = updated;
      }
      return updated;
    }

    try {
      const docRef = db.collection('education').doc(id);
      const { id: _, ...persistedData } = updated;
      await docRef.set(persistedData, { merge: true });
      return updated;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update education record';
      throw AppError.internal(message);
    }
  }

  // Deletes an education entry from Firestore by ID.
  async deleteEducation(id: string): Promise<boolean> {
    const existing = await this.getEducationById(id);
    if (!existing) {
      return false;
    }

    if (!isFirebaseInitialized() || !db) {
      inMemoryEducation = inMemoryEducation.filter((item) => item.id !== id);
      return true;
    }

    try {
      await db.collection('education').doc(id).delete();
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete education entry';
      throw AppError.internal(message);
    }
  }
}

export const educationRepository = new EducationRepository();
