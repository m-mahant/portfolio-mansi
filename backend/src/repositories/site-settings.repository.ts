import { db, isFirebaseInitialized } from '../config/firebase.config';
import { SiteSettings } from '../types/database.types';
import { AppError } from '../errors/app-error';
import { BRAND_DESCRIPTION, BRAND_NAME, BRAND_TAGLINE } from '../lib/brand';
import {
  hasRetiredFields,
  normalizeForFirestore,
  omitRetiredFields,
  retiredFieldDeletes,
} from '../utils/firestore.utils';

const RETIRED_SITE_FIELDS = [
  'email',
  'location',
  'availabilityStatus',
  'resumeUrl',
  'resumeMediaId',
  'resumeDownloadLabel',
  'showResume',
  'showContact',
  'showSocialLinks',
] as const;

// Default site settings returned when document is missing or database is empty.
const DEFAULT_SITE_SETTINGS: SiteSettings = {
  siteName: BRAND_NAME,
  siteTitle: `${BRAND_NAME} — Portfolio`,
  siteSubtitle: BRAND_TAGLINE,
  shortDescription: BRAND_DESCRIPTION,
  copyrightText: `© ${BRAND_NAME}. All rights reserved.`,
  updatedAt: new Date().toISOString(),
};

// Memory fallback store for site settings when Firestore is unavailable.
let inMemorySiteSettings: SiteSettings = { ...DEFAULT_SITE_SETTINGS };

// Keeps Site Settings to global branding fields only.
function sanitizeSiteSettings(raw: Record<string, unknown> | SiteSettings): SiteSettings {
  const cleaned = omitRetiredFields(raw as Record<string, unknown>, RETIRED_SITE_FIELDS);
  return {
    siteName: typeof cleaned.siteName === 'string' ? cleaned.siteName : DEFAULT_SITE_SETTINGS.siteName,
    siteTitle: typeof cleaned.siteTitle === 'string' ? cleaned.siteTitle : DEFAULT_SITE_SETTINGS.siteTitle,
    siteSubtitle: typeof cleaned.siteSubtitle === 'string' ? cleaned.siteSubtitle : undefined,
    shortDescription: typeof cleaned.shortDescription === 'string' ? cleaned.shortDescription : undefined,
    logo: cleaned.logo as SiteSettings['logo'],
    favicon: cleaned.favicon as SiteSettings['favicon'],
    copyrightText: typeof cleaned.copyrightText === 'string' ? cleaned.copyrightText : undefined,
    seo: cleaned.seo as SiteSettings['seo'],
    updatedAt: typeof cleaned.updatedAt === 'string' ? cleaned.updatedAt : DEFAULT_SITE_SETTINGS.updatedAt,
  };
}

// Repository for accessing and mutating Site Settings documents in Firestore.
export class SiteSettingsRepository {
  // Retrieves general site settings from Firestore or fallback memory store.
  async getSiteSettings(): Promise<SiteSettings> {
    if (!isFirebaseInitialized() || !db) {
      return sanitizeSiteSettings(inMemorySiteSettings);
    }

    try {
      const docRef = db.collection('siteSettings').doc('general');
      const snapshot = await docRef.get();
      if (!snapshot.exists) {
        return sanitizeSiteSettings(inMemorySiteSettings);
      }
      const raw = (snapshot.data() || {}) as Record<string, unknown>;
      const sanitized = sanitizeSiteSettings(raw);
      if (hasRetiredFields(raw, RETIRED_SITE_FIELDS)) {
        try {
          await this.persistSiteSettings(sanitized);
        } catch {
          // Return the allowlisted shape even if leftover-key deletion fails.
        }
      }
      return sanitized;
    } catch {
      return sanitizeSiteSettings(inMemorySiteSettings);
    }
  }

  // Updates general site settings in Firestore document siteSettings/general.
  async updateSiteSettings(updates: Partial<SiteSettings>): Promise<SiteSettings> {
    const current = await this.getSiteSettings();
    const updated = sanitizeSiteSettings({
      ...current,
      ...updates,
      seo: {
        ...current.seo,
        ...updates.seo,
      },
      updatedAt: new Date().toISOString(),
    });

    if (!isFirebaseInitialized() || !db) {
      inMemorySiteSettings = updated;
      return inMemorySiteSettings;
    }

    try {
      return await this.persistSiteSettings(updated);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update site settings in database';
      throw AppError.internal(message);
    }
  }

  // Writes allowlisted Site Settings and deletes page-content leftover keys.
  private async persistSiteSettings(updated: SiteSettings): Promise<SiteSettings> {
    if (!db) {
      inMemorySiteSettings = updated;
      return updated;
    }
    const docRef = db.collection('siteSettings').doc('general');
    await docRef.set(
      {
        ...normalizeForFirestore(updated),
        ...retiredFieldDeletes(RETIRED_SITE_FIELDS),
      },
      { merge: true }
    );
    inMemorySiteSettings = updated;
    return updated;
  }
}

export const siteSettingsRepository = new SiteSettingsRepository();
