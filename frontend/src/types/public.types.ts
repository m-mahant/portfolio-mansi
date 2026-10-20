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
  DevelopmentPageConfig,
  ArtPageConfig,
  BlogPageConfig,
  ExperiencePageConfig,
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
  DevelopmentPageConfig,
  ArtPageConfig,
  BlogPageConfig,
  ExperiencePageConfig,
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

// Standardized public theme CSS variables map.
export interface ThemeCssVariables {
  '--color-primary': string;
  '--color-secondary': string;
  '--color-accent': string;
  '--color-background': string;
  '--color-surface': string;
  '--color-text': string;
  '--color-muted': string;
  '--color-border': string;
  '--font-heading': string;
  '--font-body': string;
  '--font-accent': string;
  '--font-button': string;
  '--font-card-title': string;
  '--font-card-subtitle': string;
  '--font-card-description': string;
  '--font-tag': string;
  '--font-nav': string;
  '--font-mono': string;
  '--radius-base': string;
}

// Contact submission payload interface.
export interface ContactSubmissionData {
  name: string;
  email: string;
  subject: string;
  message: string;
  // Honeypot: left blank by real visitors, caught in CSS, filled by most spam bots.
  website?: string;
}

// Contact submission response data interface.
export interface ContactResponseData {
  message: string;
}
