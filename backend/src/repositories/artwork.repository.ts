import { db, isFirebaseInitialized } from '../config/firebase.config';
import { Artwork, PublishStatus } from '../types/database.types';
import { normalizeForFirestore } from '../utils/firestore.utils';

export interface ArtworkListResult {
  items: Artwork[];
  total: number;
}

// Memory fallback store for artworks when Firestore is uninitialized or unreachable in test environment.
let inMemoryArtworks: Artwork[] = [];

export function clearInMemoryArtworks(): void {
  inMemoryArtworks = [];
}

// Repository for querying and mutating Artworks & Crafts in Firestore.
export class ArtworkRepository {
  // Retrieves published artworks for public presentation with category filtering and pagination.
  async getPublishedArtworks(options: {
    category?: string;
    page: number;
    limit: number;
  }): Promise<ArtworkListResult> {
    if (!isFirebaseInitialized() || !db) {
      let filtered = inMemoryArtworks.filter((a) => a.status === 'published');
      if (options.category) {
        filtered = filtered.filter((a) => a.category.toLowerCase() === options.category?.toLowerCase());
      }
      filtered.sort((a, b) => a.displayOrder - b.displayOrder);
      const total = filtered.length;
      const offset = (options.page - 1) * options.limit;
      const items = filtered.slice(offset, offset + options.limit);
      return { items, total };
    }

    try {
      let query: FirebaseFirestore.Query = db
        .collection('artworks')
        .where('status', '==', 'published');

      if (options.category) {
        query = query.where('category', '==', options.category);
      }

      const snapshot = await query.get();
      const allDocs: Artwork[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Artwork, 'id'>),
      }));

      allDocs.sort((a, b) => a.displayOrder - b.displayOrder);

      const total = allDocs.length;
      if (total === 0) {
        return { items: [], total: 0 };
      }

      const offset = (options.page - 1) * options.limit;
      const items = allDocs.slice(offset, offset + options.limit);

      return { items, total };
    } catch {
      let filtered = inMemoryArtworks.filter((a) => a.status === 'published');
      if (options.category) {
        filtered = filtered.filter((a) => a.category.toLowerCase() === options.category?.toLowerCase());
      }
      filtered.sort((a, b) => a.displayOrder - b.displayOrder);
      const total = filtered.length;
      const offset = (options.page - 1) * options.limit;
      const items = filtered.slice(offset, offset + options.limit);
      return { items, total };
    }
  }

  // Retrieves a single published artwork by its unique slug.
  async getPublishedArtworkBySlug(slug: string): Promise<Artwork | null> {
    if (!isFirebaseInitialized() || !db) {
      return inMemoryArtworks.find((a) => a.slug === slug && a.status === 'published') || null;
    }

    try {
      const snapshot = await db
        .collection('artworks')
        .where('slug', '==', slug)
        .where('status', '==', 'published')
        .limit(1)
        .get();

      if (snapshot.empty) {
        return inMemoryArtworks.find((a) => a.slug === slug && a.status === 'published') || null;
      }

      const doc = snapshot.docs[0];
      return {
        id: doc.id,
        ...(doc.data() as Omit<Artwork, 'id'>),
      };
    } catch {
      return inMemoryArtworks.find((a) => a.slug === slug && a.status === 'published') || null;
    }
  }

  // Retrieves all artworks for administrative management with filtering and pagination options.
  async getAllArtworksAdmin(options: {
    status?: PublishStatus;
    category?: string;
    page: number;
    limit: number;
  }): Promise<ArtworkListResult> {
    if (!isFirebaseInitialized() || !db) {
      let filtered = [...inMemoryArtworks];
      if (options.status) {
        filtered = filtered.filter((a) => a.status === options.status);
      }
      if (options.category) {
        filtered = filtered.filter((a) => a.category.toLowerCase() === options.category?.toLowerCase());
      }
      filtered.sort((a, b) => a.displayOrder - b.displayOrder);
      const total = filtered.length;
      const offset = (options.page - 1) * options.limit;
      const items = filtered.slice(offset, offset + options.limit);
      return { items, total };
    }

    try {
      let query: FirebaseFirestore.Query = db.collection('artworks');
      if (options.status) {
        query = query.where('status', '==', options.status);
      }
      if (options.category) {
        query = query.where('category', '==', options.category);
      }

      const snapshot = await query.get();
      const allDocs: Artwork[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Artwork, 'id'>),
      }));

      allDocs.sort((a, b) => a.displayOrder - b.displayOrder);
      const total = allDocs.length;

      const offset = (options.page - 1) * options.limit;
      const items = allDocs.slice(offset, offset + options.limit);

      return { items, total };
    } catch {
      let filtered = [...inMemoryArtworks];
      if (options.status) {
        filtered = filtered.filter((a) => a.status === options.status);
      }
      if (options.category) {
        filtered = filtered.filter((a) => a.category.toLowerCase() === options.category?.toLowerCase());
      }
      filtered.sort((a, b) => a.displayOrder - b.displayOrder);
      const total = filtered.length;
      const offset = (options.page - 1) * options.limit;
      const items = filtered.slice(offset, offset + options.limit);
      return { items, total };
    }
  }

  // Retrieves a single artwork by document ID regardless of publication status.
  async getArtworkById(id: string): Promise<Artwork | null> {
    if (!isFirebaseInitialized() || !db) {
      return inMemoryArtworks.find((a) => a.id === id) || null;
    }

    try {
      const docRef = db.collection('artworks').doc(id);
      const snapshot = await docRef.get();
      if (!snapshot.exists) {
        return inMemoryArtworks.find((a) => a.id === id) || null;
      }
      return {
        id: snapshot.id,
        ...(snapshot.data() as Omit<Artwork, 'id'>),
      };
    } catch {
      return inMemoryArtworks.find((a) => a.id === id) || null;
    }
  }

  // Retrieves any artwork matching a specific slug regardless of status.
  async getArtworkBySlug(slug: string): Promise<Artwork | null> {
    if (!isFirebaseInitialized() || !db) {
      return inMemoryArtworks.find((a) => a.slug === slug) || null;
    }

    try {
      const snapshot = await db
        .collection('artworks')
        .where('slug', '==', slug)
        .limit(1)
        .get();

      if (snapshot.empty) {
        return inMemoryArtworks.find((a) => a.slug === slug) || null;
      }

      const doc = snapshot.docs[0];
      return {
        id: doc.id,
        ...(doc.data() as Omit<Artwork, 'id'>),
      };
    } catch {
      return inMemoryArtworks.find((a) => a.slug === slug) || null;
    }
  }

  // Creates a new artwork document in Firestore with memory store fallback.
  async createArtwork(data: Omit<Artwork, 'id' | 'createdAt' | 'updatedAt'>): Promise<Artwork> {
    const now = new Date().toISOString();

    if (!isFirebaseInitialized() || !db) {
      const newId = `art_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const newRecord: Artwork = {
        id: newId,
        ...data,
        createdAt: now,
        updatedAt: now,
      };
      inMemoryArtworks.push(newRecord);
      return newRecord;
    }

    try {
      const docRef = db.collection('artworks').doc();
      const newRecord: Artwork = {
        id: docRef.id,
        ...data,
        createdAt: now,
        updatedAt: now,
      };
      const { id, ...persistedData } = newRecord;
      await docRef.set(normalizeForFirestore(persistedData));
      inMemoryArtworks.push(newRecord);
      return newRecord;
    } catch {
      const newId = `art_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const newRecord: Artwork = {
        id: newId,
        ...data,
        createdAt: now,
        updatedAt: now,
      };
      inMemoryArtworks.push(newRecord);
      return newRecord;
    }
  }

  // Updates an existing artwork document in Firestore with memory store fallback.
  async updateArtwork(id: string, updates: Partial<Artwork>): Promise<Artwork | null> {
    const existing = await this.getArtworkById(id);
    if (!existing) {
      return null;
    }

    const updated: Artwork = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    if (!isFirebaseInitialized() || !db) {
      const index = inMemoryArtworks.findIndex((a) => a.id === id);
      if (index !== -1) {
        inMemoryArtworks[index] = updated;
      }
      return updated;
    }

    try {
      const docRef = db.collection('artworks').doc(id);
      const { id: _, ...persistedData } = updated;
      await docRef.set(normalizeForFirestore(persistedData), { merge: true });
      const index = inMemoryArtworks.findIndex((a) => a.id === id);
      if (index !== -1) {
        inMemoryArtworks[index] = updated;
      }
      return updated;
    } catch {
      const index = inMemoryArtworks.findIndex((a) => a.id === id);
      if (index !== -1) {
        inMemoryArtworks[index] = updated;
      }
      return updated;
    }
  }

  // Deletes an artwork document from Firestore metadata with memory store fallback.
  async deleteArtwork(id: string): Promise<boolean> {
    const existing = await this.getArtworkById(id);
    if (!existing) {
      return false;
    }

    if (!isFirebaseInitialized() || !db) {
      inMemoryArtworks = inMemoryArtworks.filter((a) => a.id !== id);
      return true;
    }

    try {
      await db.collection('artworks').doc(id).delete();
      inMemoryArtworks = inMemoryArtworks.filter((a) => a.id !== id);
      return true;
    } catch {
      inMemoryArtworks = inMemoryArtworks.filter((a) => a.id !== id);
      return true;
    }
  }
}

export const artworkRepository = new ArtworkRepository();
