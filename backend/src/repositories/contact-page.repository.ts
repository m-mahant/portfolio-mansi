import { db, isFirebaseInitialized } from '../config/firebase.config';
import { ContactPageConfig } from '../types/database.types';
import { AppError } from '../errors/app-error';
import { normalizeForFirestore } from '../utils/firestore.utils';

// Default Contact page configuration.
const DEFAULT_CONTACT_PAGE_CONFIG: ContactPageConfig = {
  heading: "Let's Build & Create Together",
  subtitle: 'Have a project in mind, a potential collaboration, or a technical inquiry? Send a message and I will get back to you promptly.',
  email: 'contact@example.com',
  location: 'San Francisco, CA & Remote',
  availabilityStatus: 'Available for engineering projects & commissions',
  showForm: true,
  closedTitle: 'Inquiries Temporarily Closed',
  closedMessage: 'Direct form submissions are currently unavailable. Please connect via direct email or social profiles.',
  resumeUrl: '#',
  resumeLabel: 'Download Resume (PDF)',
  seo: {
    title: 'Contact | Mansi Mahant',
    description: 'Get in touch for software engineering opportunities, commissions, or technical collaborations.',
  },
  updatedAt: new Date().toISOString(),
};

let inMemoryContactPageConfig: ContactPageConfig = { ...DEFAULT_CONTACT_PAGE_CONFIG };

// Repository for accessing and mutating Contact Page configuration document in Firestore (contactPage/config).
export class ContactPageRepository {
  // Retrieves contact page configuration from Firestore or fallback memory store.
  async getContactPageConfig(): Promise<ContactPageConfig> {
    if (!isFirebaseInitialized() || !db) {
      return inMemoryContactPageConfig;
    }

    try {
      const docRef = db.collection('contactPage').doc('config');
      const snapshot = await docRef.get();
      if (!snapshot.exists) {
        return inMemoryContactPageConfig;
      }
      return snapshot.data() as ContactPageConfig;
    } catch {
      return inMemoryContactPageConfig;
    }
  }

  // Updates contact page configuration in Firestore.
  async updateContactPageConfig(updates: Partial<ContactPageConfig>): Promise<ContactPageConfig> {
    const current = await this.getContactPageConfig();
    const updated: ContactPageConfig = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    if (!isFirebaseInitialized() || !db) {
      inMemoryContactPageConfig = updated;
      return inMemoryContactPageConfig;
    }

    try {
      const docRef = db.collection('contactPage').doc('config');
      await docRef.set(normalizeForFirestore(updated), { merge: true });
      return updated;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update contact page configuration in database';
      throw AppError.internal(message);
    }
  }
}

export const contactPageRepository = new ContactPageRepository();
