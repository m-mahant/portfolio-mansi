import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  User,
  UserCredential,
  NextOrObserver,
  Unsubscribe,
} from 'firebase/auth';
import { getFirebaseAuth, isFirebaseClientConfigured } from './config';

// Authenticates user with email and password credentials for Admin access.
export async function signInWithEmailPassword(email: string, pass: string): Promise<UserCredential> {
  return await signInWithEmailAndPassword(getFirebaseAuth(), email, pass);
}

// Signs out the currently authenticated Firebase user.
export async function signOutUser(): Promise<void> {
  await firebaseSignOut(getFirebaseAuth());
}

// Subscribes to real-time authentication state changes.
export function onAuthStateChange(observer: NextOrObserver<User>): Unsubscribe {
  if (!isFirebaseClientConfigured()) {
    if (typeof observer === 'function') {
      observer(null);
    } else if (observer.next) {
      observer.next(null);
    }
    return () => undefined;
  }
  return firebaseOnAuthStateChanged(getFirebaseAuth(), observer);
}

// Retrieves the current Firebase ID token for authorization API headers.
export async function getIdToken(forceRefresh: boolean = false): Promise<string | null> {
  if (!isFirebaseClientConfigured()) {
    return null;
  }
  const currentUser = getFirebaseAuth().currentUser;
  if (!currentUser) {
    return null;
  }
  return await currentUser.getIdToken(forceRefresh);
}
