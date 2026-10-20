import { db, storage, auth, isFirebaseInitialized, getFirebaseStatus } from '../config/firebase.config';
import { FirebaseStatus } from '../types';

// Performs a non-destructive verification check across initialized Firebase Admin services.
export async function verifyFirebaseServices(): Promise<FirebaseStatus> {
  const status = getFirebaseStatus();

  if (!isFirebaseInitialized) {
    return status;
  }

  try {
    // Check Firestore readiness (without writing data)
    status.services.firestore = Boolean(db);

    // Check Storage readiness
    status.services.storage = Boolean(storage);

    // Check Auth readiness
    status.services.auth = Boolean(auth);

    return status;
  } catch (error) {
    return {
      ...status,
      error: error instanceof Error ? error.message : 'Firebase verification error',
    };
  }
}
