import { z } from 'zod';
import { normalizeSlug } from './database.validators';

// Zod schema for validating media reference structure.
const mediaRefSchema = z.object({
  mediaId: z.string().optional().transform((val) => val || `media-${Date.now()}`),
  url: z.string().url('Valid image URL is required'),
  provider: z.literal('imagekit').optional(),
  fileId: z.string().optional(),
  thumbnailUrl: z.string().optional(),
  storagePath: z.string().optional(),
  altText: z.string().optional(),
  caption: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  displayOrder: z.number().optional(),
});

// Zod schema for SEO metadata attached to blogs.
const seoMetadataSchema = z.object({
  title: z.string().max(200).optional(),
  description: z.string().max(500).optional(),
  keywords: z.array(z.string()).optional(),
  canonicalUrl: z.string().url().optional(),
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  ogImage: z.string().optional(),
  twitterTitle: z.string().optional(),
  twitterDescription: z.string().optional(),
  twitterImage: z.string().optional(),
  noIndex: z.boolean().optional(),
});

// Blog status enum validator
export const blogStatusSchema = z.enum(['draft', 'published', 'archived']);

// Zod schema for creating a new blog post.
export const createBlogSchema = z.object({
  title: z.string().min(1, 'Blog title is required').max(200, 'Title cannot exceed 200 characters'),
  slug: z.string().optional().transform((val) => (val ? normalizeSlug(val) : '')),
  content: z.string().min(1, 'Blog content is required'),
  excerpt: z.string().max(1000, 'Excerpt cannot exceed 1000 characters').optional(),
  featuredImage: mediaRefSchema.optional(),
  status: blogStatusSchema.default('draft'),
  tags: z.array(z.string()).optional().default([]),
  category: z.string().optional().default('General'),
  publishedAt: z.string().nullable().optional(),
  seo: seoMetadataSchema.optional(),
}).transform((data) => {
  if (!data.slug || !data.slug.trim()) {
    data.slug = normalizeSlug(data.title);
  }
  if (data.status === 'published' && !data.publishedAt) {
    data.publishedAt = new Date().toISOString();
  }
  return data;
});

export type CreateBlogInput = z.infer<typeof createBlogSchema>;

// Zod schema for updating an existing blog post.
export const updateBlogSchema = z.object({
  title: z.string().min(1, 'Blog title is required').max(200).optional(),
  slug: z.string().optional().transform((val) => (val ? normalizeSlug(val) : undefined)),
  content: z.string().min(1, 'Blog content is required').optional(),
  excerpt: z.string().max(1000).optional(),
  featuredImage: mediaRefSchema.optional(),
  status: blogStatusSchema.optional(),
  tags: z.array(z.string()).optional(),
  category: z.string().optional(),
  publishedAt: z.string().nullable().optional(),
  seo: seoMetadataSchema.optional(),
}).transform((data) => {
  if (data.title && (!data.slug || !data.slug.trim())) {
    data.slug = normalizeSlug(data.title);
  }
  if (data.status === 'published' && !data.publishedAt) {
    data.publishedAt = new Date().toISOString();
  }
  return data;
});

export type UpdateBlogInput = z.infer<typeof updateBlogSchema>;

// Zod schema for listing/searching blog posts.
export const blogQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  tag: z.string().optional(),
  category: z.string().optional(),
  search: z.string().optional(),
  status: blogStatusSchema.optional(),
});

export type BlogQueryInput = z.infer<typeof blogQuerySchema>;
