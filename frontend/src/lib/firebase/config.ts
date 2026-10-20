import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// True when the public Firebase web config is present (skips Auth during Vercel builds).
export function isFirebaseClientConfigured(): boolean {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.apiKey !== 'undefined');
}

// Initializes and returns the single Firebase App client instance safely.
export function initFirebaseApp(): FirebaseApp {
  if (!isFirebaseClientConfigured()) {
    throw new Error('Firebase client config is missing NEXT_PUBLIC_FIREBASE_API_KEY');
  }
  if (!getApps().length) {
    return initializeApp(firebaseConfig);
  }
  return getApp();
}

// Lazy Firebase App — do not initialize during prerender without env keys.
export function getFirebaseApp(): FirebaseApp {
  return initFirebaseApp();
}

// Initializes and returns the Firebase Authentication client instance.
export function initFirebaseAuth(firebaseApp?: FirebaseApp): Auth {
  return getAuth(firebaseApp ?? getFirebaseApp());
}

// Lazy Auth accessor so admin layouts can prerender without calling getAuth at import time.
export function getFirebaseAuth(): Auth {
  return initFirebaseAuth();
}
