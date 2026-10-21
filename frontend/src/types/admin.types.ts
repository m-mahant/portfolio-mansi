// Type definitions for Admin CMS payloads and API responses.

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    timestamp: string;
  };
}

export interface AdminUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  token: string;
  isAuthorizedAdmin: boolean;
}

export interface AuthCheckResponse {
  authenticated: boolean;
  authorized: boolean;
}

export interface MediaRef {
  id?: string;
  mediaId?: string;
  url: string;
  storagePath?: string;
  altText?: string;
  caption?: string;
  fileId?: string;
}

export interface SeoMetadata {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  noIndex?: boolean;
}

export interface SiteSettings {
  siteName: string;
  siteTitle: string;
  siteSubtitle?: string;
  shortDescription?: string;
  logo?: MediaRef;
  favicon?: MediaRef;
  copyrightText?: string;
  seo?: SeoMetadata;
  updatedAt?: string;
}

export interface AboutProfile {
  heroBadge?: string;
  heroHeadline?: string;
  introduction: string;
  shortBio: string;
  longBio?: string;
  myStory?: string;
  storyHeading?: string;
  storyImage?: MediaRef;
  developerHeading?: string;
  developerSide?: string;
  artistHeading?: string;
  artistSide?: string;
  philosophyHeading?: string;
  philosophy?: string;
  whatIDo?: string[];
  interests?: string[];
  profileImage?: MediaRef;
  secondaryImage?: MediaRef;
  resumeUrl?: string;
  resumeLabel?: string;
  seo?: SeoMetadata;
  updatedAt?: string;
}

export interface HomePageHero {
  mainHeading?: string;
  accentHeading?: string;
  description?: string;
  profileImage?: MediaRef;
  imageLabel?: string;
  devCardTitle?: string;
  devCardDescription?: string;
  artCardTitle?: string;
  artCardDescription?: string;
  devCtaText?: string;
  devCtaTarget?: string;
  artCtaText?: string;
  artCtaTarget?: string;
}

export interface HomePageConfig {
  hero?: HomePageHero;
  seo?: SeoMetadata;
  updatedAt?: string;
}

export interface IntroPageConfig {
  headline?: string;
  headlineAccent?: string;
  subtitle?: string;
  exploreButtonLabel?: string;
  exploreButtonTarget?: string;
  loadingText?: string;
  autoRedirect?: boolean;
  autoRedirectDelay?: number;
  showOnInitialVisit?: boolean;
  redirectTarget?: string;
  enabled?: boolean;
  seo?: SeoMetadata;
  updatedAt?: string;
}

export interface WorkPageConfig {
  title?: string;
  subtitle?: string;
  description?: string;
  devTitle?: string;
  devDescription?: string;
  artTitle?: string;
  artDescription?: string;
  seo?: SeoMetadata;
  updatedAt?: string;
}

export interface DevelopmentPageConfig {
  title?: string;
  subtitle?: string;
  seo?: SeoMetadata;
  updatedAt?: string;
}

export interface ArtPageConfig {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  galleryHeading?: string;
  seo?: SeoMetadata;
  updatedAt?: string;
}

export interface BlogPageConfig {
  title?: string;
  subtitle?: string;
  seo?: SeoMetadata;
  updatedAt?: string;
}

export interface ExperiencePageConfig {
  title?: string;
  subtitle?: string;
  educationSectionTitle?: string;
  educationSectionSubtitle?: string;
  seo?: SeoMetadata;
  updatedAt?: string;
}

export interface ContactPageConfig {
  heading?: string;
  subtitle?: string;
  email?: string;
  location?: string;
  availabilityStatus?: string;
  showForm?: boolean;
  closedTitle?: string;
  closedMessage?: string;
  resumeUrl?: string;
  resumeLabel?: string;
  seo?: SeoMetadata;
  updatedAt?: string;
}

export interface PrivacyPageConfig {
  content: string;
  seo?: SeoMetadata;
  updatedAt?: string;
}

export interface SocialLink {
  id?: string;
  platform: string;
  label: string;
  url: string;
  icon?: string;
  displayOrder: number;
  isVisible: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type PublishStatus = 'draft' | 'published' | 'archived';

export interface ProjectSections {
  overview?: boolean;
  problem?: boolean;
  solution?: boolean;
  architecture?: boolean;
  workflow?: boolean;
  apiFlow?: boolean;
  gallery?: boolean;
  performance?: boolean;
  challenges?: boolean;
  results?: boolean;
}

export interface Project {
  id?: string;
  title: string;
  slug: string;
  subtitle?: string;
  shortDescription: string;
  description?: string;
  coverImage?: MediaRef;
  status: PublishStatus;
  isFeatured: boolean;
  displayOrder: number;
  tags: string[];
  technologies: string[];
  overview?: string;
  problem?: string;
  solution?: string;
  features?: Array<{ title: string; description: string; icon?: string }>;
  architecture?: {
    enabled: boolean;
    description?: string;
    diagramMediaId?: string;
    diagramUrl?: string;
  };
  workflow?: {
    enabled: boolean;
    description?: string;
    steps?: Array<{ title: string; description: string; displayOrder: number }>;
  };
  apiFlow?: {
    enabled: boolean;
    description?: string;
    endpoints?: Array<{ method: string; path: string; description: string }>;
  };
  performance?: {
    enabled: boolean;
    summary?: string;
    metrics?: Array<{ label: string; value: string; improvement?: string }>;
  };
  challenges?: string;
  results?: string;
  gallery?: Array<{ mediaId: string; url: string; storagePath?: string; altText?: string; displayOrder: number }>;
  links?: Array<{ label: string; url: string; type: string; isVisible: boolean; displayOrder: number }>;
  sections?: ProjectSections;
  seo?: SeoMetadata;
  createdAt?: string;
  updatedAt?: string;
}

export interface ArtworkImage {
  mediaId: string;
  url: string;
  storagePath?: string;
  altText?: string;
  caption?: string;
  displayOrder: number;
}

export interface ArtworkSections {
  story?: boolean;
  inspiration?: boolean;
  process?: boolean;
  materials?: boolean;
  gallery?: boolean;
}

export interface Artwork {
  id?: string;
  title: string;
  slug: string;
  subtitle?: string;
  shortDescription?: string;
  description?: string;
  category: string;
  tags: string[];
  materials: string[];
  year?: string;
  dimensions?: string;
  inspiration?: string;
  process?: string;
  story?: string;
  featuredImage?: MediaRef;
  images: ArtworkImage[];
  status: PublishStatus;
  isFeatured?: boolean;
  displayOrder: number;
  sections?: ArtworkSections;
  seo?: SeoMetadata;
  createdAt?: string;
  updatedAt?: string;
}

export interface Experience {
  id?: string;
  company: string;
  role: string;
  employmentType?: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description: string;
  responsibilities: string[];
  technologies: string[];
  achievements: string[];
  displayOrder: number;
  isVisible: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Education {
  id?: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  description?: string;
  achievements: string[];
  displayOrder: number;
  isVisible: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type ThemeMode = 'light' | 'dark';
export type UserThemePreference = 'light' | 'dark' | null;

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  mutedText: string;
  border: string;
}

export interface ThemeFonts {
  headingFont: string;
  bodyFont: string;
  accentFont: string;
  buttonFont?: string;
  cardTitleFont?: string;
  cardSubtitleFont?: string;
  cardDescriptionFont?: string;
  tagFont?: string;
  navigationFont?: string;
  monoFont?: string;
}

export interface ThemeSettings {
  mode?: ThemeMode;
  colors: ThemeColors;
  lightColors?: ThemeColors;
  darkColors?: ThemeColors;
  fonts: ThemeFonts;
  styles: {
    borderRadius: string;
    cardStyle: 'glassmorphism' | 'bordered' | 'flat';
    buttonStyle: 'glass' | 'solid' | 'outline';
  };
  animations: {
    pageTransitions: 'smooth' | 'fade' | 'none';
    scrollReveal: boolean;
    hoverEffects: boolean;
    imageHoverEffects: boolean;
  };
  updatedAt?: string;
}

export interface MediaItem {
  id: string;
  fileId: string;
  filePath: string;
  url: string;
  thumbnailUrl?: string;
  storagePath?: string;
  folder?: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  width?: number;
  height?: number;
  altText?: string;
  caption?: string;
  displayOrder?: number;
  createdAt: string;
  updatedAt: string;
}

export interface SelectedMediaPayload {
  mediaId: string;
  url: string;
  storagePath: string;
  thumbnailUrl?: string;
  altText?: string;
  caption?: string;
  width?: number;
  height?: number;
}

export interface DashboardSummary {
  projectsCount: number;
  artworksCount: number;
  experienceCount: number;
  mediaCount: number;
  blogsCount?: number;
}

export type BlogStatus = 'draft' | 'published' | 'archived';

export interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featuredImage?: MediaRef;
  status: BlogStatus;
  tags?: string[];
  category?: string;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  seo?: SeoMetadata;
}

export interface PaginatedBlogs {
  items: Blog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext?: boolean;
    hasPrev?: boolean;
  };
}
