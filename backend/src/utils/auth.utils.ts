import { DecodedIdToken } from 'firebase-admin/auth';
import { auth, isFirebaseInitialized } from '../config/firebase.config';

type TokenVerifier = (idToken: string) => Promise<DecodedIdToken>;

let customTokenVerifier: TokenVerifier | null = null;

// Sets a custom token verifier hook for testing environments.
export function setCustomTokenVerifier(verifier: TokenVerifier | null): void {
  customTokenVerifier = verifier;
}

// Verifies a Firebase Auth ID token and returns decoded token payload or throws error.
export async function verifyFirebaseIdToken(idToken: string): Promise<DecodedIdToken> {
  if (customTokenVerifier) {
    return await customTokenVerifier(idToken);
  }
  if (!isFirebaseInitialized || auth === null) {
    throw new Error('Firebase Admin Auth is not initialized.');
  }
  return await auth.verifyIdToken(idToken);
}
