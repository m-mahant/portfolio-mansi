import fs from 'node:fs';
import path from 'node:path';
import { EnvConfig } from '../types';

// Safely loads key-value pairs from local .env file if process.env is not populated.
function loadEnvFile(): void {
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIndex = trimmed.indexOf('=');
        if (eqIndex > 0) {
          const key = trimmed.slice(0, eqIndex).trim();
          let value = trimmed.slice(eqIndex + 1).trim();
          if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
          }
          if (process.env[key] === undefined) {
            process.env[key] = value;
          }
        }
      }
    }
  } catch {
    // Ignore .env read errors if file is inaccessible
  }
}

// Validates and returns centralized environment configuration during application startup.
export function validateAndLoadEnv(): EnvConfig {
  loadEnvFile();

  const rawPort = process.env.PORT || '4000';
  const port = parseInt(rawPort, 10);

  if (isNaN(port) || port <= 0) {
    throw new Error(`Invalid PORT environment variable: "${rawPort}". Must be a positive integer.`);
  }

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const nodeEnv = process.env.NODE_ENV || 'development';

  const firebaseProjectId = process.env.FIREBASE_PROJECT_ID || '';
  const firebaseClientEmail = process.env.FIREBASE_CLIENT_EMAIL;

  // Safely normalize escaped newline characters in private key string
  const rawPrivateKey = process.env.FIREBASE_PRIVATE_KEY;
  const firebasePrivateKey = rawPrivateKey ? rawPrivateKey.replace(/\\n/g, '\n') : undefined;

  const firebaseStorageBucket = process.env.FIREBASE_STORAGE_BUCKET || `${firebaseProjectId}.appspot.com`;

  const imagekitPublicKey = process.env.IMAGEKIT_PUBLIC_KEY;
  const imagekitPrivateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  const imagekitUrlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

  const bootstrapAdminEmail = process.env.BOOTSTRAP_ADMIN_EMAIL;

  return {
    port,
    frontendUrl,
    nodeEnv,
    firebaseProjectId,
    firebaseClientEmail,
    firebasePrivateKey,
    firebaseStorageBucket,
    imagekitPublicKey,
    imagekitPrivateKey,
    imagekitUrlEndpoint,
    bootstrapAdminEmail,
  };
}

export const env = validateAndLoadEnv();
