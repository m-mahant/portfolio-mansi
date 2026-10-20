import ImageKit, { toFile } from '@imagekit/nodejs';
import { imagekitClient, isImageKitConfigured } from '../config/imagekit.config';
import { AppError } from '../errors/app-error';

export interface ImageKitUploadParams {
  fileBuffer: Buffer;
  fileName: string;
  folder: string;
  useUniqueFileName?: boolean;
}

export interface ImageKitUploadResult {
  fileId: string;
  name: string;
  url: string;
  thumbnailUrl?: string;
  size: number;
  height?: number;
  width?: number;
  filePath: string;
}

// Encapsulates all raw communication with ImageKit Node SDK.
export class ImageKitService {
  private client: ImageKit | null;

  constructor(client: ImageKit | null = imagekitClient) {
    this.client = client;
  }

  // Uploads binary file buffer to ImageKit with specified options.
  async uploadFile(params: ImageKitUploadParams): Promise<ImageKitUploadResult> {
    if (!this.client || !isImageKitConfigured) {
      throw AppError.internal('ImageKit client is not properly initialized or configured.');
    }

    try {
      const uploadableFile = await toFile(params.fileBuffer, params.fileName);
      const response = await this.client.files.upload({
        file: uploadableFile,
        fileName: params.fileName,
        folder: params.folder,
        useUniqueFileName: params.useUniqueFileName ?? true,
      });

      if (!response.fileId || !response.url) {
        throw new Error('ImageKit upload returned response missing fileId or url.');
      }

      return {
        fileId: response.fileId,
        name: response.name || params.fileName,
        url: response.url,
        thumbnailUrl: response.thumbnailUrl,
        size: response.size ?? params.fileBuffer.length,
        height: response.height,
        width: response.width,
        filePath: response.filePath || '',
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown ImageKit upload error';
      throw AppError.internal(`ImageKit upload execution failed: ${message}`);
    }
  }

  // Purges an asset from ImageKit by file ID.
  async deleteFile(fileId: string): Promise<void> {
    if (!this.client || !isImageKitConfigured) {
      throw AppError.internal('ImageKit client is not properly initialized or configured.');
    }

    try {
      await this.client.files.delete(fileId);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown ImageKit delete error';
      throw AppError.internal(`ImageKit asset deletion failed: ${message}`);
    }
  }

  // Lists files stored on ImageKit CDN with pagination and path filters.
  async listFiles(params: { path?: string; limit?: number; skip?: number; searchQuery?: string }) {
    if (!this.client || !isImageKitConfigured) {
      return [];
    }
    try {
      const response = await this.client.assets.list({
        path: params.path || '/portfolio',
        limit: params.limit || 100,
        skip: params.skip || 0,
        searchQuery: params.searchQuery,
        type: 'file',
      });
      return Array.isArray(response) ? response : [];
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to list ImageKit files';
      process.stderr.write(`[ImageKitService Warning] listFiles failed: ${message}\n`);
      return [];
    }
  }

  // Lists subdirectories/folders stored on ImageKit CDN for a given path.
  async listFolders(params: { path?: string }) {
    if (!this.client || !isImageKitConfigured) {
      return [];
    }
    try {
      const response = await this.client.assets.list({
        path: params.path || '/portfolio',
        type: 'folder',
      });
      return Array.isArray(response) ? response : [];
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to list ImageKit folders';
      process.stderr.write(`[ImageKitService Warning] listFolders failed: ${message}\n`);
      return [];
    }
  }
}

export const imagekitService = new ImageKitService();
