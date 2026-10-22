import ImageKit from '@imagekit/nodejs';
import { env } from './env.config';

let imagekitInstance: ImageKit | null = null;
let isConfigured = false;

// Initializes and exports the centralized ImageKit SDK client instance.
function initializeImageKit(): { client: ImageKit | null; isConfigured: boolean } {
  const { imagekitPrivateKey, imagekitUrlEndpoint } = env;

  if (!imagekitPrivateKey || !imagekitUrlEndpoint) {
    return { client: null, isConfigured: false };
  }

  try {
    const client = new ImageKit({
      privateKey: imagekitPrivateKey,
    });

    return { client, isConfigured: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown ImageKit initialization error';
    process.stderr.write(`[ImageKit Config Warning] Failed to initialize ImageKit client: ${errorMessage}\n`);
    return { client: null, isConfigured: false };
  }
}

const initialized = initializeImageKit();
imagekitInstance = initialized.client;
isConfigured = initialized.isConfigured;

export const imagekitClient = imagekitInstance;
export const isImageKitConfigured = isConfigured;
