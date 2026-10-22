import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { getAuth, Auth } from 'firebase-admin/auth';
import { env } from './env.config';
import { FirebaseStatus } from '../types';

let adminApp: App | null = null;
let dbInstance: Firestore | null = null;
let storageInstance: ReturnType<typeof getStorage> | null = null;
let authInstance: Auth | null = null;
let isInitialized = false;
let initError: string | undefined;

// Initializes Firebase Admin SDK using environment credentials or default application credentials.
export function initFirebaseAdmin(): App | null {
  if (getApps().length > 0) {
    adminApp = getApps()[0]!;
    isInitialized = true;
    return adminApp;
  }

  try {
    const hasCredentials = Boolean(
      (env.firebaseClientEmail && env.firebasePrivateKey) || process.env.FIRESTORE_EMULATOR_HOST
    );

    if (hasCredentials) {
      if (env.firebaseClientEmail && env.firebasePrivateKey) {
        adminApp = initializeApp({
          credential: cert({
            projectId: env.firebaseProjectId,
            clientEmail: env.firebaseClientEmail,
            privateKey: env.firebasePrivateKey,
          }),
          storageBucket: env.firebaseStorageBucket,
        });
      } else {
        adminApp = initializeApp({
          projectId: env.firebaseProjectId,
          storageBucket: env.firebaseStorageBucket,
        });
      }

      dbInstance = getFirestore(adminApp);
      storageInstance = getStorage(adminApp);
      authInstance = getAuth(adminApp);
      isInitialized = true;
    } else {
      isInitialized = false;
      initError = 'Firebase credentials or emulator host not configured.';
    }

    return adminApp;
  } catch (error) {
    isInitialized = false;
    initError = error instanceof Error ? error.message : 'Unknown Firebase initialization error';
    return null;
  }
}

// Initializing Admin SDK
initFirebaseAdmin();

export const db: Firestore | null = dbInstance;
export const storage: ReturnType<typeof getStorage> | null = storageInstance;
export const auth: Auth | null = authInstance;

export function isFirebaseInitialized(): boolean {
  return isInitialized;
}

// Safe diagnostic summary of Firebase Admin services without exposing sensitive credentials.
export function getFirebaseStatus(): FirebaseStatus {
  return {
    initialized: isInitialized,
    services: {
      firestore: Boolean(dbInstance),
      storage: Boolean(storageInstance),
      auth: Boolean(authInstance),
    },
    projectId: env.firebaseProjectId,
    error: initError,
  };
}
