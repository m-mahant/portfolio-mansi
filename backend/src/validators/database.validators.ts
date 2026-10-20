import { z } from 'zod';
import { Project, ProjectSections, Artwork, ArtworkSections } from '../types/database.types';

// Converts any title or string into a normalized, URL-safe slug.
export function normalizeSlug(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}

// Evaluates and computes explicit section availability for Hide Empty Sections engine.
export function computeProjectSections(project: Partial<Project>): ProjectSections {
  return {
    overview: Boolean(project.overview && project.overview.trim().length > 0),
    problem: Boolean(project.problem && project.problem.trim().length > 0),
    solution: Boolean(project.solution && project.solution.trim().length > 0),
    features: Boolean(project.features && project.features.length > 0),
    architecture: Boolean(
      project.architecture?.enabled &&
        (project.architecture.description?.trim() || project.architecture.diagramUrl)
    ),
    workflow: Boolean(
      project.workflow?.enabled &&
        project.workflow.steps &&
        project.workflow.steps.length > 0
    ),
    apiFlow: Boolean(
      project.apiFlow?.enabled &&
        project.apiFlow.endpoints &&
        project.apiFlow.endpoints.length > 0
    ),
    gallery: Boolean(project.gallery && project.gallery.length > 0),
    performance: Boolean(
      project.performance?.enabled &&
        project.performance.metrics &&
        project.performance.metrics.length > 0
    ),
    challenges: Boolean(project.challenges && project.challenges.trim().length > 0),
    results: Boolean(project.results && project.results.trim().length > 0),
    links: Boolean(project.links && project.links.filter((l) => l.isVisible).length > 0),
  };
}

// Evaluates and computes explicit section availability for Artwork documents.
export function computeArtworkSections(artwork: Partial<Artwork>): ArtworkSections {
  return {
    description: Boolean(artwork.description && artwork.description.trim().length > 0),
    inspiration: Boolean(artwork.inspiration && artwork.inspiration.trim().length > 0),
    materials: Boolean(artwork.materials && artwork.materials.length > 0),
    dimensions: Boolean(artwork.dimensions && artwork.dimensions.trim().length > 0),
    process: Boolean(artwork.process && artwork.process.trim().length > 0),
    story: Boolean(artwork.story && artwork.story.trim().length > 0),
    gallery: Boolean(artwork.images && artwork.images.length > 0),
  };
}

// Zod Schema for reusable SEO Metadata
export const seoMetadataSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  canonicalUrl: z.string().url().optional().or(z.literal('')),
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  ogImage: z.string().url().optional().or(z.literal('')),
  twitterTitle: z.string().optional(),
  twitterDescription: z.string().optional(),
  twitterImage: z.string().url().optional().or(z.literal('')),
  noIndex: z.boolean().optional(),
});

// Zod Schema for Media Reference
export const mediaRefSchema = z.object({
  mediaId: z.string().min(1, 'Media ID is required'),
  url: z.string().url('Must be a valid media URL'),
  storagePath: z.string().optional().or(z.literal('')),
  altText: z.string().optional(),
  caption: z.string().optional(),
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
  displayOrder: z.number().int().optional(),
});

// Zod Schema for Site Settings
export const siteSettingsSchema = z.object({
  siteName: z.string().min(1, 'Site name is required'),
  siteTitle: z.string().min(1, 'Site title is required'),
  siteSubtitle: z.string().optional(),
  shortDescription: z.string().optional(),
  logo: mediaRefSchema.optional(),
  favicon: mediaRefSchema.optional(),
  copyrightText: z.string().optional(),
  seo: seoMetadataSchema.optional(),
  updatedAt: z.string().datetime().optional(),
});

// Zod Schema for Intro Page Configuration
export const introPageConfigSchema = z.object({
  headline: z.string().optional(),
  headlineAccent: z.string().optional(),
  subtitle: z.string().optional(),
  exploreButtonLabel: z.string().optional(),
  exploreButtonTarget: z.string().optional(),
  loadingText: z.string().optional(),
  autoRedirect: z.boolean().optional(),
  autoRedirectDelay: z.number().optional(),
  showOnInitialVisit: z.boolean().optional(),
  redirectTarget: z.string().optional(),
  enabled: z.boolean().optional().default(true),
  seo: seoMetadataSchema.optional(),
  updatedAt: z.string().optional(),
});

export const updateIntroPageConfigSchema = introPageConfigSchema.partial();


// Zod Schema for About Profile
export const aboutProfileSchema = z.object({
  introduction: z.string().optional(),
  myStory: z.string().optional(),
  whatIDo: z.array(z.string()).optional(),
  developerSide: z.string().optional(),
  artistSide: z.string().optional(),
  philosophy: z.string().optional(),
  interests: z.array(z.string()).optional(),
  profileImage: mediaRefSchema.optional(),
  secondaryImage: mediaRefSchema.optional(),
  shortBio: z.string().optional(),
  longBio: z.string().optional(),
  resumeUrl: z.string().url().optional().or(z.literal('')),
  resumeLabel: z.string().optional(),
  seo: seoMetadataSchema.optional(),
  updatedAt: z.string().datetime().optional(),
});

// Zod Schema for Social Links
export const socialLinkSchema = z.object({
  id: z.string().optional(),
  platform: z.string().min(1, 'Platform is required'),
  label: z.string().min(1, 'Label is required'),
  url: z.string().url('Must be a valid URL'),
  icon: z.string().optional(),
  displayOrder: z.number().int().default(0),
  isVisible: z.boolean().default(true),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

// Zod Schema for Projects
export const projectSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  subtitle: z.string().optional(),
  shortDescription: z.string().min(1, 'Short description is required'),
  description: z.string().optional(),
  coverImage: mediaRefSchema.optional(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  isFeatured: z.boolean().default(false),
  displayOrder: z.number().int().default(0),
  tags: z.array(z.string()).default([]),
  technologies: z.array(z.string()).default([]),

  overview: z.string().optional(),
  problem: z.string().optional(),
  solution: z.string().optional(),
  features: z
    .array(
      z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        icon: z.string().optional(),
      })
    )
    .optional(),
  architecture: z
    .object({
      enabled: z.boolean(),
      description: z.string().optional(),
      diagramMediaId: z.string().optional(),
      diagramUrl: z.string().url().optional().or(z.literal('')),
      diagramAltText: z.string().optional(),
    })
    .optional(),
  workflow: z
    .object({
      enabled: z.boolean(),
      description: z.string().optional(),
      steps: z.array(
        z.object({
          stepNumber: z.number().int(),
          title: z.string().min(1),
          description: z.string().min(1),
          image: mediaRefSchema.optional(),
        })
      ),
    })
    .optional(),
  apiFlow: z
    .object({
      enabled: z.boolean(),
      description: z.string().optional(),
      diagramMediaId: z.string().optional(),
      diagramUrl: z.string().url().optional().or(z.literal('')),
      endpoints: z.array(
        z.object({
          method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']),
          path: z.string().min(1),
          description: z.string().min(1),
          authenticationRequired: z.boolean(),
        })
      ),
    })
    .optional(),
  performance: z
    .object({
      enabled: z.boolean(),
      summary: z.string().optional(),
      metrics: z.array(
        z.object({
          name: z.string().min(1),
          value: z.string().min(1),
          unit: z.string().optional(),
          description: z.string().optional(),
        })
      ),
    })
    .optional(),
  challenges: z.string().optional(),
  results: z.string().optional(),
  gallery: z
    .array(
      z.object({
        mediaId: z.string().min(1),
        url: z.string().url(),
        altText: z.string().optional(),
        caption: z.string().optional(),
        displayOrder: z.number().int(),
      })
    )
    .optional(),
  links: z
    .array(
      z.object({
        label: z.string().min(1),
        url: z.string().url(),
        type: z.string().min(1),
        isVisible: z.boolean(),
        displayOrder: z.number().int(),
      })
    )
    .optional(),

  seo: seoMetadataSchema.optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

// Zod Schema for Artwork
export const artworkSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  subtitle: z.string().optional(),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  tags: z.array(z.string()).default([]),
  materials: z.array(z.string()).default([]),
  year: z.string().optional(),
  dimensions: z.string().optional(),
  inspiration: z.string().optional(),
  process: z.string().optional(),
  story: z.string().optional(),
  featuredImage: mediaRefSchema.optional(),
  images: z
    .array(
      z.object({
        mediaId: z.string().min(1),
        url: z.string().url(),
        storagePath: z.string().optional().or(z.literal('')),
        altText: z.string().optional(),
        caption: z.string().optional(),
        width: z.number().positive().optional(),
        height: z.number().positive().optional(),
        displayOrder: z.number().int().default(0),
      })
    )
    .default([]),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  displayOrder: z.number().int().default(0),
  seo: seoMetadataSchema.optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

// Zod Schema for Experience
export const experienceSchema = z.object({
  id: z.string().optional(),
  company: z.string().min(1, 'Company name is required'),
  role: z.string().min(1, 'Role title is required'),
  employmentType: z.string().optional(),
  location: z.string().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  isCurrent: z.boolean().default(false),
  description: z.string().min(1, 'Description is required'),
  responsibilities: z.array(z.string()).default([]),
  technologies: z.array(z.string()).default([]),
  achievements: z.array(z.string()).default([]),
  displayOrder: z.number().int().default(0),
  isVisible: z.boolean().default(true),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

// Zod Schema for Education
export const educationSchema = z.object({
  id: z.string().optional(),
  institution: z.string().min(1, 'Institution is required'),
  degree: z.string().min(1, 'Degree is required'),
  field: z.string().min(1, 'Field of study is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  description: z.string().optional(),
  achievements: z.array(z.string()).default([]),
  displayOrder: z.number().int().default(0),
  isVisible: z.boolean().default(true),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

const themeColorsSchema = z.object({
  primary: z.string().min(1),
  secondary: z.string().min(1),
  accent: z.string().min(1),
  background: z.string().min(1),
  surface: z.string().min(1),
  text: z.string().min(1),
  mutedText: z.string().min(1),
  border: z.string().min(1),
});

// Zod Schema for Theme Settings
export const themeSettingsSchema = z.object({
  mode: z.enum(['light', 'dark']).optional(),
  colors: themeColorsSchema,
  lightColors: themeColorsSchema.optional(),
  darkColors: themeColorsSchema.optional(),
  fonts: z.object({
    headingFont: z.string().min(1),
    bodyFont: z.string().min(1),
    accentFont: z.string().min(1),
    buttonFont: z.string().optional(),
    cardTitleFont: z.string().optional(),
    cardSubtitleFont: z.string().optional(),
    cardDescriptionFont: z.string().optional(),
    tagFont: z.string().optional(),
    navigationFont: z.string().optional(),
    monoFont: z.string().optional(),
  }),
  styles: z.object({
    borderRadius: z.string().min(1),
    cardStyle: z.enum(['glassmorphism', 'bordered', 'flat']),
    buttonStyle: z.enum(['glass', 'solid', 'outline']),
  }),
  animations: z.object({
    pageTransitions: z.enum(['smooth', 'fade', 'none']),
    scrollReveal: z.boolean(),
    hoverEffects: z.boolean(),
    imageHoverEffects: z.boolean(),
  }),
  updatedAt: z.string().optional(),
});

// Zod Schema for Media Documents
export const mediaSchema = z.object({
  id: z.string().optional(),
  storagePath: z.string().min(1, 'Storage path is required'),
  url: z.string().url('Must be a valid URL'),
  fileName: z.string().min(1, 'File name is required'),
  mimeType: z.string().min(1, 'Mime type is required'),
  fileSize: z.number().positive('File size must be positive'),
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
  altText: z.string().optional(),
  caption: z.string().optional(),
  displayOrder: z.number().int().optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});
