import { z } from 'zod';
import { AppError } from '../errors/app-error';
import {
  siteSettingsSchema,
  aboutProfileSchema,
  socialLinkSchema,
  projectSchema,
  artworkSchema,
  experienceSchema,
  educationSchema,
  themeSettingsSchema,
} from './database.validators';

// Schema for updating global site settings with partial fields.
export const updateSiteSettingsSchema = siteSettingsSchema.partial().strict();

// Schema for updating about/profile document with partial fields.
export const updateAboutProfileSchema = aboutProfileSchema.partial().strict();


// Schema for creating a new social link entry.
export const createSocialLinkSchema = socialLinkSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Schema for updating an existing social link entry.
export const updateSocialLinkSchema = createSocialLinkSchema.partial();

// Schema for creating a new project document with optional auto-generated slug.
export const createProjectSchema = projectSchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    slug: z.string().optional(),
    shortDescription: z.string().optional().default(''),
  });

// Schema for updating an existing project document.
export const updateProjectSchema = createProjectSchema.partial();

// Schema for creating a new artwork document with optional auto-generated slug.
export const createArtworkSchema = artworkSchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    slug: z.string().optional(),
  });

// Schema for updating an existing artwork document.
export const updateArtworkSchema = createArtworkSchema.partial();

// Schema for creating a new experience entry.
export const createExperienceSchema = experienceSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Schema for updating an existing experience entry.
export const updateExperienceSchema = createExperienceSchema.partial();

// Schema for creating a new education entry.
export const createEducationSchema = educationSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Schema for updating an existing education entry.
export const updateEducationSchema = createEducationSchema.partial();

// Schema for updating theme settings.
export const updateThemeSettingsSchema = themeSettingsSchema.partial();

// Query parameter schema for project list filtering and pagination.
export const adminProjectListQuerySchema = z.object({
  status: z.enum(['draft', 'published', 'archived']).optional(),
  featured: z.enum(['true', 'false']).optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
});

// Query parameter schema for artwork list filtering and pagination.
export const adminArtworkListQuerySchema = z.object({
  status: z.enum(['draft', 'published', 'archived']).optional(),
  category: z.string().optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
});

// Generic query parameter schema for paginated list endpoints.
export const adminListQuerySchema = z.object({
  isVisible: z.enum(['true', 'false']).optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
});

// Validates whether a project document meets mandatory criteria prior to publication.
export function validateProjectForPublishing(projectData: Record<string, unknown>): void {
  const title = typeof projectData.title === 'string' ? projectData.title.trim() : '';
  const slug = typeof projectData.slug === 'string' ? projectData.slug.trim() : '';
  const shortDescription = typeof projectData.shortDescription === 'string' ? projectData.shortDescription.trim() : '';
  const coverImage = projectData.coverImage;

  if (!title || !slug || !shortDescription) {
    throw AppError.badRequest('Cannot publish project: title, slug, and shortDescription are required for publication.');
  }

  if (!coverImage || typeof coverImage !== 'object') {
    throw AppError.badRequest('Cannot publish project: a valid coverImage media reference is required.');
  }
}

// Validates whether an artwork document meets mandatory criteria prior to publication.
export function validateArtworkForPublishing(artworkData: Record<string, unknown>): void {
  const title = typeof artworkData.title === 'string' ? artworkData.title.trim() : '';
  const slug = typeof artworkData.slug === 'string' ? artworkData.slug.trim() : '';
  const category = typeof artworkData.category === 'string' ? artworkData.category.trim() : '';
  const featuredImage = artworkData.featuredImage;

  if (!title || !slug || !category) {
    throw AppError.badRequest('Cannot publish artwork: title, slug, and category are required for publication.');
  }

  if (!featuredImage || typeof featuredImage !== 'object') {
    throw AppError.badRequest('Cannot publish artwork: a valid featuredImage media reference is required.');
  }
}
