import { imagekitService, ImageKitService } from './imagekit.service';
import { mediaRepository, MediaRepository } from '../repositories/media.repository';
import { Media } from '../types/database.types';
import { AppError } from '../errors/app-error';
import { normalizeMediaMetadata } from '../utils/firestore.utils';
import {
  ALLOWED_IMAGE_MIME_TYPES,
  MAX_UPLOAD_FILE_SIZE,
  buildImageKitFolder,
  uploadMediaMetadataSchema,
  updateMediaMetadataSchema,
  listMediaQuerySchema,
  ListMediaQueryInput,
  UpdateMediaMetadataInput,
} from '../validators/media.validators';

export interface UploadMediaParams {
  fileBuffer: Buffer;
  originalName: string;
  mimeType: string;
  fileSize: number;
  mediaType: string;
  slug?: string;
  sectionContext?: string;
  altText?: string;
  caption?: string;
  displayOrder?: number;
}

export class MediaService {
  private ikService: ImageKitService;
  private mediaRepo: MediaRepository;

  constructor(
    ikService: ImageKitService = imagekitService,
    mediaRepo: MediaRepository = mediaRepository
  ) {
    this.ikService = ikService;
    this.mediaRepo = mediaRepo;
  }

  // Uploads a binary media file to ImageKit and stores metadata in Firestore with automatic rollback.
  async uploadMedia(params: UploadMediaParams): Promise<Media> {
    if (!params.fileBuffer || params.fileBuffer.length === 0) {
      throw AppError.badRequest('No file uploaded or file buffer is empty.');
    }

    if (!ALLOWED_IMAGE_MIME_TYPES.includes(params.mimeType as unknown as (typeof ALLOWED_IMAGE_MIME_TYPES)[number])) {
      throw AppError.badRequest(
        `Unsupported file format "${params.mimeType}". Allowed formats: ${ALLOWED_IMAGE_MIME_TYPES.join(', ')}`
      );
    }

    if (params.fileSize > MAX_UPLOAD_FILE_SIZE) {
      throw AppError.badRequest(
        `File size (${(params.fileSize / (1024 * 1024)).toFixed(2)} MB) exceeds maximum allowed limit of 10 MB.`
      );
    }

    const parseResult = uploadMediaMetadataSchema.safeParse({
      mediaType: params.mediaType,
      slug: params.slug,
      sectionContext: params.sectionContext,
      altText: params.altText,
      caption: params.caption,
      displayOrder: params.displayOrder,
    });

    if (!parseResult.success) {
      const issueMessage = parseResult.error.issues.map((e) => e.message).join(' ');
      throw AppError.badRequest(`Invalid upload metadata: ${issueMessage}`);
    }

    const metadata = parseResult.data;
    const targetFolder = buildImageKitFolder(metadata.mediaType, metadata.slug, metadata.sectionContext);

    // 1. Upload asset to ImageKit CDN
    const uploadResult = await this.ikService.uploadFile({
      fileBuffer: params.fileBuffer,
      fileName: params.originalName,
      folder: targetFolder,
      useUniqueFileName: true,
    });

    // 2. Persist metadata record to Cloud Firestore with rollback handling
    try {
      const storagePath = uploadResult.filePath || `${targetFolder}/${uploadResult.name}`;
      const payload = normalizeMediaMetadata({
        provider: 'imagekit' as const,
        fileId: uploadResult.fileId,
        fileName: uploadResult.name,
        url: uploadResult.url,
        thumbnailUrl: uploadResult.thumbnailUrl,
        folder: targetFolder,
        storagePath,
        mimeType: params.mimeType,
        fileSize: uploadResult.size,
        width: uploadResult.width,
        height: uploadResult.height,
        altText: metadata.altText,
        caption: metadata.caption,
        displayOrder: metadata.displayOrder ?? 0,
      });

      const mediaRecord = await this.mediaRepo.createMediaRecord(payload);
      return mediaRecord;
    } catch (firestoreError) {
      // Partial Failure Recovery: Delete binary asset from ImageKit to prevent orphan accumulation
      try {
        await this.ikService.deleteFile(uploadResult.fileId);
      } catch (cleanupError) {
        const cleanupMessage = cleanupError instanceof Error ? cleanupError.message : 'Unknown cleanup error';
        process.stderr.write(`[MediaService Warning] Rollback cleanup failed for fileId ${uploadResult.fileId}: ${cleanupMessage}\n`);
      }

      const errorMessage = firestoreError instanceof Error ? firestoreError.message : 'Firestore persistence error';
      throw AppError.internal(`Failed to store media metadata after ImageKit upload: ${errorMessage}`);
    }
  }

  // Deletes an asset by deleting the stored ImageKit asset first, then removing Firestore metadata.
  async deleteMedia(mediaId: string): Promise<void> {
    const mediaRecord = await this.mediaRepo.getMediaById(mediaId);
    if (!mediaRecord) {
      throw AppError.notFound(`Media item with ID "${mediaId}" was not found.`);
    }

    // 1. Delete binary from ImageKit using stored fileId
    await this.ikService.deleteFile(mediaRecord.fileId);

    // 2. Delete metadata document from Cloud Firestore
    await this.mediaRepo.deleteMediaRecord(mediaId);
  }

  // Retrieves media metadata by ID.
  async getMedia(mediaId: string): Promise<Media> {
    const mediaRecord = await this.mediaRepo.getMediaById(mediaId);
    if (!mediaRecord) {
      throw AppError.notFound(`Media item with ID "${mediaId}" was not found.`);
    }
    return mediaRecord;
  }

  // Lists media records with pagination and filters, syncing missing ImageKit CDN files and returning subfolders.
  async listMedia(rawFilters: unknown): Promise<{
    items: Media[];
    subfolders: Array<{ name: string; path: string }>;
    total: number;
    page: number;
    limit: number;
  }> {
    const parseResult = listMediaQuerySchema.safeParse(rawFilters);
    if (!parseResult.success) {
      const message = parseResult.error.issues.map((e) => e.message).join(' ');
      throw AppError.badRequest(`Invalid query parameters: ${message}`);
    }

    const queryFilters = parseResult.data as ListMediaQueryInput;
    const targetFolder = queryFilters.folder ? queryFilters.folder.replace(/^\//, '').replace(/\/$/, '') : 'portfolio';
    const ikFolderPath = `/${targetFolder}`;

    const result = await this.mediaRepo.listMedia({ ...queryFilters, folder: targetFolder });

    // 1. Fetch subdirectories under targetFolder from ImageKit CDN
    const subfolders: Array<{ name: string; path: string }> = [];
    try {
      const ikFolders = await this.ikService.listFolders({ path: ikFolderPath });
      if (Array.isArray(ikFolders)) {
        for (const f of ikFolders) {
          const folderName = f.name || (f.folderPath ? f.folderPath.split('/').filter(Boolean).pop() : '');
          const fPath = (f.folderPath || `${targetFolder}/${folderName}`).replace(/^\//, '');
          if (folderName && fPath && !subfolders.some((s) => s.path === fPath)) {
            subfolders.push({ name: folderName, path: fPath });
          }
        }4
      }
    } catch {
      // Ignore folder list errors gracefully
    }

    // 2. Sync missing ImageKit files into Firestore if present on CDN
    try {
      const ikFiles = await this.ikService.listFiles({ path: ikFolderPath });
      if (ikFiles && ikFiles.length > 0) {
        const existingFileIds = new Set(result.items.map((i) => i.fileId));
        for (const file of ikFiles) {
          if ('fileId' in file && file.fileId && !existingFileIds.has(file.fileId)) {
            const filePath = 'filePath' in file ? (file.filePath as string) : '';
            const fileName = ('name' in file && typeof file.name === 'string') ? file.name : 'asset';
            const fileUrl = ('url' in file && typeof file.url === 'string') ? file.url : '';
            const rawFolder = filePath ? filePath.substring(0, filePath.lastIndexOf('/')) || targetFolder : targetFolder;
            const cleanFolder = rawFolder.replace(/^\//, '');
            const storagePath = filePath ? filePath.replace(/^\//, '') : `${cleanFolder}/${fileName}`;
            const syncedRecord = await this.mediaRepo.createMediaRecord({
              provider: 'imagekit',
              fileId: file.fileId,
              fileName,
              url: fileUrl,
              thumbnailUrl: 'thumbnailUrl' in file && typeof file.thumbnailUrl === 'string' ? file.thumbnailUrl : fileUrl,
              folder: cleanFolder,
              storagePath,
              mimeType: 'mime' in file && typeof file.mime === 'string' ? file.mime : 'image/png',
              fileSize: 'size' in file && typeof file.size === 'number' ? file.size : 0,
              width: 'width' in file && typeof file.width === 'number' ? file.width : undefined,
              height: 'height' in file && typeof file.height === 'number' ? file.height : undefined,
              altText: fileName,
              displayOrder: 99,
            });
            result.items.push(syncedRecord);
            result.total += 1;
          }
        }
      }
    } catch (err) {
      const warnMsg = err instanceof Error ? err.message : 'Unknown sync warning';
      process.stderr.write(`[MediaService Sync Warning] Failed to sync ImageKit assets: ${warnMsg}\n`);
    }

    // Ensure every item guarantees a storagePath string
    result.items = result.items.map((item) => ({
      ...item,
      storagePath: item.storagePath || `${item.folder}/${item.fileName}`,
    }));

    return {
      ...result,
      subfolders,
    };
  }

  // Updates metadata attributes (altText, caption, displayOrder).
  async updateMediaMetadata(mediaId: string, rawUpdates: unknown): Promise<Media> {
    const parseResult = updateMediaMetadataSchema.safeParse(rawUpdates);
    if (!parseResult.success) {
      const message = parseResult.error.issues.map((e) => e.message).join(' ');
      throw AppError.badRequest(`Invalid metadata update payload: ${message}`);
    }

    return this.mediaRepo.updateMediaMetadata(mediaId, parseResult.data as UpdateMediaMetadataInput);
  }
}

export const mediaService = new MediaService();
