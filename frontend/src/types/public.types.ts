// Defines TypeScript interfaces and types for public portfolio endpoints and components.

import {
  SiteSettings,
  AboutProfile,
  SocialLink,
  Project,
  Artwork,
  Experience,
  Education,
  Blog,
  BlogStatus,
  PaginatedBlogs,
  ThemeSettings,
  ThemeColors,
  ThemeFonts,
  ThemeMode,
  UserThemePreference,
  MediaRef,
  SeoMetadata,
  HomePageConfig,
  IntroPageConfig,
  WorkPageConfig,
  ContactPageConfig,
  PrivacyPageConfig,
  DevelopmentPageConfig,
  ArtPageConfig,
  BlogPageConfig,
  ExperiencePageConfig,
  ServiceOffering,
} from './admin.types';

export type {
  SiteSettings,
  AboutProfile,
  SocialLink,
  Project,
  Artwork,
  Experience,
  Education,
  Blog,
  BlogStatus,
  PaginatedBlogs,
  ThemeSettings,
  ThemeColors,
  ThemeFonts,
  ThemeMode,
  UserThemePreference,
  MediaRef,
  SeoMetadata,
  HomePageConfig,
  IntroPageConfig,
  WorkPageConfig,
  ContactPageConfig,
  PrivacyPageConfig,
  DevelopmentPageConfig,
  ArtPageConfig,
  BlogPageConfig,
  ExperiencePageConfig,
  ServiceOffering,
};


// Generic paginated response metadata wrapper for public listings.
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Response payload format for paginated project list.
export interface PaginatedProjects {
  items: Project[];
  pagination: PaginationMeta;
}

// Response payload format for paginated artwork list.
export interface PaginatedArtworks {
  items: Artwork[];
  pagination: PaginationMeta;
}

// Structure for top-level navigation items.
export interface NavItem {
  label: string;
  href: string;
  children?: Array<{
    label: string;
    href: string;
    description?: string;
  }>;
}

// Parameter interfaces for public project queries.
export interface PublicProjectQueryParams {
  featured?: boolean;
  page?: number;
  limit?: number;
}

// Parameter interfaces for public artwork queries.
export interface PublicArtworkQueryParams {
  category?: string;
  page?: number;
  limit?: number;
}

export type ContactInquiryType = 'new-build' | 'maintenance' | 'consulting' | 'art-commission' | 'other';

// Contact submission payload interface.
export interface ContactSubmissionData {
  name: string;
  email: string;
  subject: string;
  message: string;
  inquiryType?: ContactInquiryType;
  budget?: string;
  timeline?: string;
  website?: string;
}

// Contact submission response data interface.
export interface ContactResponseData {
  message: string;
}
