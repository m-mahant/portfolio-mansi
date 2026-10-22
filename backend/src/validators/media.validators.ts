import { z } from 'zod';
import { normalizeSlug } from './database.validators';

// Supported initial image MIME types
export const ALLOWED_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/avif',
] as const;

// Maximum allowed upload size (10 MB in bytes)
export const MAX_UPLOAD_FILE_SIZE = 10 * 1024 * 1024;

// Supported folder domain contexts for structured ImageKit directory organization
export const MEDIA_CONTEXT_TYPES = [
  'site',
  'profile',
  'about',
  'development',
  'project',
  'art',
  'artwork',
  'blog',
] as const;
export type MediaContextType = (typeof MEDIA_CONTEXT_TYPES)[number];

// Helper path generators for canonical structure
export function getSiteMediaPath(): string {
  return 'portfolio/site';
}

export function getProfileMediaPath(): string {
  return 'portfolio/profile';
}

export function getDevelopmentProjectMediaPath(slug?: string, sectionContext?: string): string {
  const root = 'portfolio/development';
  if (!slug) return root;
  const sanitizedSlug = normalizeSlug(slug);
  if (!sectionContext) return `${root}/${sanitizedSlug}`;
  const sanitizedSection = sanitizeFolderSegment(sectionContext);
  return `${root}/${sanitizedSlug}/${sanitizedSection}`;
}

export function getArtworkMediaPath(slug?: string, sectionContext?: string): string {
  const root = 'portfolio/art';
  if (!slug) return root;
  const sanitizedSlug = normalizeSlug(slug);
  if (!sectionContext) return `${root}/${sanitizedSlug}`;
  const sanitizedSection = sanitizeFolderSegment(sectionContext);
  return `${root}/${sanitizedSlug}/${sanitizedSection}`;
}

export function getBlogMediaPath(slug?: string): string {
  const root = 'portfolio/blog';
  if (!slug) return root;
  const sanitizedSlug = normalizeSlug(slug);
  return `${root}/${sanitizedSlug}`;
}

// Sanitizes path components to prevent path traversal or invalid characters.
export function sanitizeFolderSegment(segment: string): string {
  if (!segment || typeof segment !== 'string') return '';
  return segment
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Builds a safe, canonical ImageKit folder path based on media type, slug, and section context.
export function buildImageKitFolder(
  mediaType: MediaContextType | string,
  slug?: string,
  sectionContext?: string
): string {
  const normalizedType = (mediaType || '').toLowerCase();

  if (normalizedType === 'site') {
    return getSiteMediaPath();
  }

  if (normalizedType === 'profile' || normalizedType === 'about') {
    return getProfileMediaPath();
  }

  if (normalizedType === 'development' || normalizedType === 'project') {
    return getDevelopmentProjectMediaPath(slug, sectionContext);
  }

  if (normalizedType === 'art' || normalizedType === 'artwork') {
    return getArtworkMediaPath(slug, sectionContext);
  }

  if (normalizedType === 'blog') {
    return getBlogMediaPath(slug);
  }

  return 'portfolio/site';
}

// Zod schema for multipart upload metadata validation.
export const uploadMediaMetadataSchema = z
  .object({
    mediaType: z.enum(MEDIA_CONTEXT_TYPES).default('site'),
    slug: z.string().optional(),
    sectionContext: z.string().optional(),
    altText: z.string().max(500, 'altText cannot exceed 500 characters').optional(),
    caption: z.string().max(1000, 'caption cannot exceed 1000 characters').optional(),
    displayOrder: z.coerce.number().int().min(0).optional(),
  })
  .refine(
    (data) => {
      if (['development', 'project', 'art', 'artwork', 'blog'].includes(data.mediaType)) {
        return !!data.slug && data.slug.trim().length > 0;
      }
      return true;
    },
    {
      message: 'Slug is required when uploading media for a project, artwork, or blog post.',
      path: ['slug'],
    }
  );

// Zod schema for updating media metadata (PATCH /api/v1/admin/media/:mediaId).
export const updateMediaMetadataSchema = z.object({
  altText: z.string().max(500, 'altText cannot exceed 500 characters').optional(),
  caption: z.string().max(1000, 'caption cannot exceed 1000 characters').optional(),
  displayOrder: z.coerce.number().int().min(0).optional(),
});

export type UpdateMediaMetadataInput = z.infer<typeof updateMediaMetadataSchema>;

// Zod schema for listing media query parameters (GET /api/v1/admin/media).
export const listMediaQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  folder: z.string().optional(),
  provider: z.string().optional(),
  mimeType: z.string().optional(),
});

export type ListMediaQueryInput = z.infer<typeof listMediaQuerySchema>;
