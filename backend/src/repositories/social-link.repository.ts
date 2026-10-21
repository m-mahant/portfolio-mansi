import { Query } from 'firebase-admin/firestore';
import { db, isFirebaseInitialized } from '../config/firebase.config';
import { SocialLink } from '../types/database.types';
import { AppError } from '../errors/app-error';

// Memory fallback store for social links when Firestore is uninitialized.
let inMemorySocialLinks: SocialLink[] = [];

// Repository for querying and mutating Social Links in Firestore.
export class SocialLinkRepository {
  // Retrieves publicly visible social links sorted by display order.
  async getVisibleSocialLinks(): Promise<SocialLink[]> {
    if (!isFirebaseInitialized() || !db) {
      return inMemorySocialLinks.filter((item) => item.isVisible).sort((a, b) => a.displayOrder - b.displayOrder);
    }

    try {
      const snapshot = await db
        .collection('socialLinks')
        .where('isVisible', '==', true)
        .get();

      if (snapshot.empty) {
        return [];
      }

      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<SocialLink, 'id'>),
      }));

      return items.sort((a, b) => a.displayOrder - b.displayOrder);
    } catch {
      return inMemorySocialLinks.filter((item) => item.isVisible).sort((a, b) => a.displayOrder - b.displayOrder);
    }
  }

  // Retrieves all social links for admin management with filtering and pagination.
  async getAllSocialLinksAdmin(options: {
    isVisible?: boolean;
    page: number;
    limit: number;
  }): Promise<{ items: SocialLink[]; total: number }> {
    if (!isFirebaseInitialized() || !db) {
      let filtered = [...inMemorySocialLinks];
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
      let query: Query = db.collection('socialLinks');
      if (options.isVisible !== undefined) {
        query = query.where('isVisible', '==', options.isVisible);
      }

      const snapshot = await query.get();
      const allDocs: SocialLink[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<SocialLink, 'id'>),
      }));

      allDocs.sort((a, b) => a.displayOrder - b.displayOrder);
      const total = allDocs.length;
      const offset = (options.page - 1) * options.limit;
      const items = allDocs.slice(offset, offset + options.limit);

      return { items, total };
    } catch {
      return { items: [], total: 0 };
    }
  }

  // Retrieves a single social link document by unique ID.
  async getSocialLinkById(id: string): Promise<SocialLink | null> {
    if (!isFirebaseInitialized() || !db) {
      return inMemorySocialLinks.find((item) => item.id === id) || null;
    }

    try {
      const docRef = db.collection('socialLinks').doc(id);
      const snapshot = await docRef.get();
      if (!snapshot.exists) {
        return null;
      }
      return {
        id: snapshot.id,
        ...(snapshot.data() as Omit<SocialLink, 'id'>),
      };
    } catch {
      return null;
    }
  }

  // Creates a new social link entry in Firestore.
  async createSocialLink(data: Omit<SocialLink, 'id' | 'createdAt' | 'updatedAt'>): Promise<SocialLink> {
    const now = new Date().toISOString();

    if (!isFirebaseInitialized() || !db) {
      const newId = `social_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const newRecord: SocialLink = {
        id: newId,
        ...data,
        createdAt: now,
        updatedAt: now,
      };
      inMemorySocialLinks.push(newRecord);
      return newRecord;
    }

    try {
      const docRef = db.collection('socialLinks').doc();
      const newRecord: SocialLink = {
        id: docRef.id,
        ...data,
        createdAt: now,
        updatedAt: now,
      };
      const { id, ...persistedData } = newRecord;
      await docRef.set(persistedData);
      return newRecord;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create social link';
      throw AppError.internal(message);
    }
  }

  // Updates an existing social link entry by ID.
  async updateSocialLink(id: string, updates: Partial<SocialLink>): Promise<SocialLink | null> {
    const existing = await this.getSocialLinkById(id);
    if (!existing) {
      return null;
    }

    const updated: SocialLink = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    if (!isFirebaseInitialized() || !db) {
      const index = inMemorySocialLinks.findIndex((item) => item.id === id);
      if (index !== -1) {
        inMemorySocialLinks[index] = updated;
      }
      return updated;
    }

    try {
      const docRef = db.collection('socialLinks').doc(id);
      const { id: _, ...persistedData } = updated;
      await docRef.set(persistedData, { merge: true });
      return updated;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update social link';
      throw AppError.internal(message);
    }
  }

  // Deletes a social link record from Firestore by ID.
  async deleteSocialLink(id: string): Promise<boolean> {
    const existing = await this.getSocialLinkById(id);
    if (!existing) {
      return false;
    }

    if (!isFirebaseInitialized() || !db) {
      inMemorySocialLinks = inMemorySocialLinks.filter((item) => item.id !== id);
      return true;
    }

    try {
      await db.collection('socialLinks').doc(id).delete();
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete social link';
      throw AppError.internal(message);
    }
  }
}

export const socialLinkRepository = new SocialLinkRepository();
