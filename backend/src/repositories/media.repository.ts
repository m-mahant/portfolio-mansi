import { Query } from 'firebase-admin/firestore';
import { db } from '../config/firebase.config';
import { Media } from '../types/database.types';
import { ListMediaQueryInput, UpdateMediaMetadataInput } from '../validators/media.validators';
import { AppError } from '../errors/app-error';
import { normalizeForFirestore } from '../utils/firestore.utils';

export class MediaRepository {
  private readonly collectionName = 'media';

  // Creates a new media metadata document in Firestore: media/{mediaId}
  async createMediaRecord(data: Omit<Media, 'id' | 'createdAt' | 'updatedAt'>): Promise<Media> {
    if (!db) {
      throw AppError.internal('Firestore database instance is not available.');
    }

    const docRef = db.collection(this.collectionName).doc();
    const now = new Date().toISOString();

    const mediaRecord: Media = normalizeForFirestore({
      id: docRef.id,
      ...data,
      createdAt: now,
      updatedAt: now,
    });

    const firestoreData = normalizeForFirestore(mediaRecord);
    await docRef.set(firestoreData);
    return mediaRecord;
  }

  // Retrieves media metadata by ID.
  async getMediaById(mediaId: string): Promise<Media | null> {
    if (!db) {
      return null;
    }

    const docSnap = await db.collection(this.collectionName).doc(mediaId).get();
    if (!docSnap.exists) {
      return null;
    }

    return docSnap.data() as Media;
  }

  // Lists media metadata records with pagination and optional filters.
  async listMedia(filters: ListMediaQueryInput): Promise<{ items: Media[]; total: number; page: number; limit: number }> {
    if (!db) {
      return { items: [], total: 0, page: filters.page, limit: filters.limit };
    }

    let query: Query = db.collection(this.collectionName);

    if (filters.folder) {
      query = query.where('folder', '==', filters.folder);
    }

    if (filters.provider) {
      query = query.where('provider', '==', filters.provider);
    }

    if (filters.mimeType) {
      query = query.where('mimeType', '==', filters.mimeType);
    }

    const snapshot = await query.get();
    const allItems = snapshot.docs.map((doc) => doc.data() as Media);

    // Client-side sort by displayOrder asc, then createdAt desc
    allItems.sort((a, b) => {
      const orderA = a.displayOrder ?? 999;
      const orderB = b.displayOrder ?? 999;
      if (orderA !== orderB) return orderA - orderB;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    const total = allItems.length;
    const startIndex = (filters.page - 1) * filters.limit;
    const items = allItems.slice(startIndex, startIndex + filters.limit);

    return {
      items,
      total,
      page: filters.page,
      limit: filters.limit,
    };
  }

  // Updates metadata fields (altText, caption, displayOrder) for an existing media record.
  async updateMediaMetadata(mediaId: string, updates: UpdateMediaMetadataInput): Promise<Media> {
    if (!db) {
      throw AppError.internal('Firestore database instance is not available.');
    }

    const docRef = db.collection(this.collectionName).doc(mediaId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      throw AppError.notFound(`Media record with ID "${mediaId}" was not found.`);
    }

    const existingData = docSnap.data() as Media;
    const now = new Date().toISOString();

    const updatedRecord: Media = normalizeForFirestore({
      ...existingData,
      ...updates,
      updatedAt: now,
    });

    await docRef.set(updatedRecord, { merge: true });
    return updatedRecord;
  }

  // Deletes media metadata record from Firestore.
  async deleteMediaRecord(mediaId: string): Promise<void> {
    if (!db) {
      throw AppError.internal('Firestore database instance is not available.');
    }

    await db.collection(this.collectionName).doc(mediaId).delete();
  }
}

export const mediaRepository = new MediaRepository();
