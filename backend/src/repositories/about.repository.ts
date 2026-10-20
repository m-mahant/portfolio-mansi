import { db, isFirebaseInitialized } from '../config/firebase.config';
import { AboutProfile } from '../types/database.types';
import { AppError } from '../errors/app-error';
import { normalizeForFirestore } from '../utils/firestore.utils';

// Default about profile returned when document is missing or database is empty.
const DEFAULT_ABOUT_PROFILE: AboutProfile = {
  introduction: 'Software Engineer & Digital Artist combining technical depth with visual design.',
  myStory: 'Fusing engineering principles with creative crafts to craft immersive digital experiences.',
  whatIDo: ['Full-Stack Web Engineering', 'Cloud Architecture', 'Digital Illustration & 3D Modeling'],
  developerSide: 'Focusing on robust architecture, clean code, type safety, and scalable web solutions.',
  artistSide: 'Exploring visual aesthetics, traditional & digital mediums, and interactive media.',
  philosophy: 'Technical precision meets creative expression.',
  interests: ['System Design', 'Generative Art', 'UI/UX Design', 'Interactive Graphics'],
  shortBio: 'Full-Stack Developer & Creative Artist.',
  updatedAt: new Date().toISOString(),
};

// Memory fallback store for about profile when Firestore is unavailable.
let inMemoryAboutProfile: AboutProfile = { ...DEFAULT_ABOUT_PROFILE };

// Repository for accessing and mutating About Profile document in Firestore.
export class AboutRepository {
  // Retrieves about profile document from Firestore or fallback memory store.
  async getAboutProfile(): Promise<AboutProfile> {
    if (!isFirebaseInitialized() || !db) {
      return inMemoryAboutProfile;
    }

    try {
      const docRef = db.collection('about').doc('profile');
      const snapshot = await docRef.get();
      if (!snapshot.exists) {
        return inMemoryAboutProfile;
      }
      return snapshot.data() as AboutProfile;
    } catch {
      return inMemoryAboutProfile;
    }
  }

  // Updates about profile document in Firestore document about/profile.
  async updateAboutProfile(updates: Partial<AboutProfile>): Promise<AboutProfile> {
    const current = await this.getAboutProfile();
    const updated: AboutProfile = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    if (!isFirebaseInitialized() || !db) {
      inMemoryAboutProfile = updated;
      return inMemoryAboutProfile;
    }

    try {
      const docRef = db.collection('about').doc('profile');
      await docRef.set(normalizeForFirestore(updated), { merge: true });
      return updated;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update about profile in database';
      throw AppError.internal(message);
    }
  }
}

export const aboutRepository = new AboutRepository();
