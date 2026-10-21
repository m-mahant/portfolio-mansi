import { db, isFirebaseInitialized } from '../config/firebase.config';
import { PrivacyPageConfig } from '../types/database.types';
import { AppError } from '../errors/app-error';
import { normalizeForFirestore } from '../utils/firestore.utils';

// Default Privacy Policy page configuration.
const DEFAULT_PRIVACY_PAGE_CONFIG: PrivacyPageConfig = {
  content: `Last updated: October 2026

This is a personal portfolio site. This page explains what information is collected from visitors, why, and how it is handled.

## What is collected

- **Contact form**: name, email address, subject, message, and IP address (the IP is used only to prevent spam and is not shared).
- **Analytics**: anonymous visit and performance data via Vercel Analytics, Vercel Speed Insights, and Google Analytics. Google Analytics uses cookies; the Vercel tools do not.

## Why it is collected

- To respond to messages sent through the contact form.
- To prevent spam and abuse (rate limiting based on IP address).
- To understand site traffic and page performance.

## Third-party services used

- **Firebase (Google Cloud)** — stores site content and contact form submissions.
- **Resend** — sends an email notification when the contact form is submitted.
- **ImageKit** — hosts and serves images.
- **Vercel** — hosts the site and provides analytics/performance monitoring.
- **Google Analytics** — traffic analytics (uses cookies).

## Data retention

Contact form submissions are kept until manually deleted from the admin panel.

## Your rights

You can request that a message you submitted be deleted by emailing the address below.

## No selling of data

Your data is never sold or shared with third parties for marketing purposes.

## Contact

Questions about this policy can be sent to hello@mansimahant.com.`,
  seo: {
    title: 'Privacy Policy | Mansi Mahant',
    description: "How Mansi Mahant's portfolio collects and uses visitor data.",
  },
  updatedAt: new Date().toISOString(),
};

let inMemoryPrivacyPageConfig: PrivacyPageConfig = { ...DEFAULT_PRIVACY_PAGE_CONFIG };

// Repository for accessing and mutating Privacy Policy page configuration document in Firestore (privacyPage/config).
export class PrivacyPageRepository {
  // Retrieves privacy page configuration from Firestore or fallback memory store.
  async getPrivacyPageConfig(): Promise<PrivacyPageConfig> {
    if (!isFirebaseInitialized() || !db) {
      return inMemoryPrivacyPageConfig;
    }

    try {
      const docRef = db.collection('privacyPage').doc('config');
      const snapshot = await docRef.get();
      if (!snapshot.exists) {
        return inMemoryPrivacyPageConfig;
      }
      return snapshot.data() as PrivacyPageConfig;
    } catch {
      return inMemoryPrivacyPageConfig;
    }
  }

  // Updates privacy page configuration in Firestore.
  async updatePrivacyPageConfig(updates: Partial<PrivacyPageConfig>): Promise<PrivacyPageConfig> {
    const current = await this.getPrivacyPageConfig();
    const updated: PrivacyPageConfig = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    if (!isFirebaseInitialized() || !db) {
      inMemoryPrivacyPageConfig = updated;
      return inMemoryPrivacyPageConfig;
    }

    try {
      const docRef = db.collection('privacyPage').doc('config');
      await docRef.set(normalizeForFirestore(updated), { merge: true });
      return updated;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update privacy page configuration in database';
      throw AppError.internal(message);
    }
  }
}

export const privacyPageRepository = new PrivacyPageRepository();
