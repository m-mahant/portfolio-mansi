import { db, isFirebaseInitialized } from '../config/firebase.config';
import { ContactMessage } from '../types/database.types';
import { AppError } from '../errors/app-error';

// Memory fallback store for contact messages when Firestore is unavailable.
const inMemoryContactMessages: ContactMessage[] = [];

// Repository for persisting contact messages to Firestore collection: contactMessages/{id}
export class ContactRepository {
  // Saves a new contact submission message to Firestore.
  async createMessage(data: Omit<ContactMessage, 'id'>): Promise<ContactMessage> {
    const id = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const message: ContactMessage = {
      id,
      ...data,
    };

    if (!isFirebaseInitialized() || !db) {
      inMemoryContactMessages.push(message);
      return message;
    }

    try {
      const docRef = db.collection('contactMessages').doc(id);
      await docRef.set(message);
      return message;
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Failed to save contact message to database';
      throw AppError.internal(msg);
    }
  }

  // Retrieves a message by ID (for admin or testing purposes).
  async getMessageById(id: string): Promise<ContactMessage | null> {
    if (!isFirebaseInitialized() || !db) {
      return inMemoryContactMessages.find((m) => m.id === id) || null;
    }

    try {
      const docRef = db.collection('contactMessages').doc(id);
      const snapshot = await docRef.get();
      if (!snapshot.exists) {
        return null;
      }
      return snapshot.data() as ContactMessage;
    } catch {
      return null;
    }
  }

  // Deletes a message by ID (for testing cleanup or admin moderation).
  async deleteMessage(id: string): Promise<boolean> {
    if (!isFirebaseInitialized() || !db) {
      const index = inMemoryContactMessages.findIndex((m) => m.id === id);
      if (index !== -1) {
        inMemoryContactMessages.splice(index, 1);
        return true;
      }
      return false;
    }

    try {
      await db.collection('contactMessages').doc(id).delete();
      return true;
    } catch {
      return false;
    }
  }
}

export const contactRepository = new ContactRepository();
