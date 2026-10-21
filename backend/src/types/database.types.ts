// Content document publication lifecycle status.
export type PublishStatus = 'draft' | 'published' | 'archived';

// Common SEO metadata associated with pages, projects, and artworks.
export interface SeoMetadata {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  noIndex?: boolean;
}

export type MediaProvider = 'imagekit';

// Media asset metadata document stored in Firestore collection: media/{mediaId}
export interface Media {
  id: string;
  provider: MediaProvider;
  fileId: string;
  fileName: string;
  url: string;
  thumbnailUrl?: string;
  folder: string;
  mimeType: string;
  fileSize: number;
  width?: number;
  height?: number;
  altText?: string;
  caption?: string;
  displayOrder?: number;
  createdAt: string;
  updatedAt: string;
  storagePath?: string;
}

// Embedded media reference structure used across projects, artworks, and profiles.
export interface MediaRef {
  mediaId: string;
  provider?: MediaProvider;
  fileId?: string;
  url: string;
  thumbnailUrl?: string;
  storagePath?: string;
  altText?: string;
  caption?: string;
  width?: number;
  height?: number;
  displayOrder?: number;
}

// Global Site Settings document: siteSettings/general
export interface SiteSettings {
  siteName: string;
  siteTitle: string;
  siteSubtitle?: string;
  shortDescription?: string;
  logo?: MediaRef;
  favicon?: MediaRef;
  copyrightText?: string;
  seo?: SeoMetadata;
  updatedAt: string;
}

// About / Profile document: about/profile
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
  updatedAt: string;
}

// Home Page Configuration document: homePage/config (hero only — matches Public Home)
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
  updatedAt: string;
}

// Intro Page Configuration document: introPage/config
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
  updatedAt: string;
}


// Work Overview Page Configuration document: workPage/config
export interface WorkPageConfig {
  title?: string;
  subtitle?: string;
  description?: string;
  devTitle?: string;
  devDescription?: string;
  artTitle?: string;
  artDescription?: string;
  seo?: SeoMetadata;
  updatedAt: string;
}

// Development listing page config: developmentPage/config → /work/development
export interface DevelopmentPageConfig {
  title?: string;
  subtitle?: string;
  seo?: SeoMetadata;
  updatedAt: string;
}

// Art & Crafts listing page config: artPage/config → /work/art-crafts
export interface ArtPageConfig {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  galleryHeading?: string;
  seo?: SeoMetadata;
  updatedAt: string;
}

// Blog listing page config: blogPage/config → /blog
export interface BlogPageConfig {
  title?: string;
  subtitle?: string;
  seo?: SeoMetadata;
  updatedAt: string;
}

// Experience page chrome config: experiencePage/config → /experience
export interface ExperiencePageConfig {
  title?: string;
  subtitle?: string;
  educationSectionTitle?: string;
  educationSectionSubtitle?: string;
  seo?: SeoMetadata;
  updatedAt: string;
}

// Contact Page Configuration document: contactPage/config
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
  updatedAt: string;
}

// Privacy Policy page configuration document: privacyPage/config
export interface PrivacyPageConfig {
  content: string;
  seo?: SeoMetadata;
  updatedAt: string;
}

// Social Link entry document: socialLinks/{socialId}
export interface SocialLink {
  id: string;
  platform: string; // e.g. "GitHub", "LinkedIn", "LeetCode", "Instagram"
  label: string;
  url: string;
  icon?: string;
  displayOrder: number;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

// Project Architecture Section
export interface ProjectArchitecture {
  enabled: boolean;
  description?: string;
  diagramMediaId?: string;
  diagramUrl?: string;
  diagramAltText?: string;
}

// Project Workflow Step
export interface WorkflowStep {
  stepNumber: number;
  title: string;
  description: string;
  image?: MediaRef;
}

// Project Workflow Section
export interface ProjectWorkflow {
  enabled: boolean;
  description?: string;
  steps: WorkflowStep[];
}

// Project API Endpoint item
export interface ApiEndpointItem {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description: string;
  authenticationRequired: boolean;
}

// Project API Flow Section
export interface ProjectApiFlow {
  enabled: boolean;
  description?: string;
  diagramMediaId?: string;
  diagramUrl?: string;
  endpoints: ApiEndpointItem[];
}

// Project Performance Metric Item
export interface PerformanceMetricItem {
  name: string;
  value: string;
  unit?: string;
  description?: string;
}

// Project Performance Section
export interface ProjectPerformance {
  enabled: boolean;
  summary?: string;
  metrics: PerformanceMetricItem[];
}

// Project Gallery Item
export interface ProjectGalleryItem {
  mediaId: string;
  url: string;
  altText?: string;
  caption?: string;
  displayOrder: number;
}

// Project External Link item
export interface ProjectLink {
  label: string;
  url: string;
  type: string; // e.g. "github", "live", "docs", "demo", "caseStudy"
  isVisible: boolean;
  displayOrder: number;
}

// Computed section availability flags for Hide Empty Sections engine.
export interface ProjectSections {
  overview: boolean;
  problem: boolean;
  solution: boolean;
  features: boolean;
  architecture: boolean;
  workflow: boolean;
  apiFlow: boolean;
  gallery: boolean;
  performance: boolean;
  challenges: boolean;
  results: boolean;
  links: boolean;
}

// Software Development Project Document: projects/{projectId}
export interface Project {
  id: string;
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

  // Optional Detail Sections
  overview?: string;
  problem?: string;
  solution?: string;
  features?: Array<{ title: string; description: string; icon?: string }>;
  architecture?: ProjectArchitecture;
  workflow?: ProjectWorkflow;
  apiFlow?: ProjectApiFlow;
  performance?: ProjectPerformance;
  challenges?: string;
  results?: string;
  gallery?: ProjectGalleryItem[];
  links?: ProjectLink[];

  // Section availability map
  sections?: ProjectSections;

  seo?: SeoMetadata;
  createdAt: string;
  updatedAt: string;
}

// Artwork Image Item
export interface ArtworkImage {
  mediaId: string;
  url: string;
  storagePath?: string;
  altText?: string;
  caption?: string;
  width?: number;
  height?: number;
  displayOrder: number;
}

// Computed Artwork section availability map
export interface ArtworkSections {
  description: boolean;
  inspiration: boolean;
  materials: boolean;
  dimensions: boolean;
  process: boolean;
  story: boolean;
  gallery: boolean;
}

// Artwork & Craft Document: artworks/{artworkId}
export interface Artwork {
  id: string;
  title: string;
  slug: string;
  subtitle?: string;
  shortDescription?: string;
  description?: string;
  category: string; // e.g. "Digital Art", "Crafts", "3D Render", "Painting"
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
  createdAt: string;
  updatedAt: string;
}

// Professional Experience Document: experiences/{experienceId}
export interface Experience {
  id: string;
  company: string;
  role: string;
  employmentType?: string; // e.g. "Full-time", "Contract", "Freelance"
  location?: string;
  startDate: string; // YYYY-MM
  endDate?: string; // YYYY-MM or "Present"
  isCurrent: boolean;
  description: string;
  responsibilities: string[];
  technologies: string[];
  achievements: string[];
  displayOrder: number;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

// Education Document: education/{educationId}
export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string; // YYYY-MM
  endDate?: string; // YYYY-MM or "Present"
  description?: string;
  achievements: string[];
  displayOrder: number;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

// Dynamic Theme Colors
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

export type ThemeMode = 'light' | 'dark';

// Dynamic Theme Fonts
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

// Dynamic Theme UI Token Styles
export interface ThemeStyles {
  borderRadius: string;
  cardStyle: 'glassmorphism' | 'bordered' | 'flat';
  buttonStyle: 'glass' | 'solid' | 'outline';
}

// Dynamic Theme Animations
export interface ThemeAnimations {
  pageTransitions: 'smooth' | 'fade' | 'none';
  scrollReveal: boolean;
  hoverEffects: boolean;
  imageHoverEffects: boolean;
}

// Dynamic Theme Document: themeSettings/active
export interface ThemeSettings {
  mode?: ThemeMode;
  colors: ThemeColors;
  lightColors?: ThemeColors;
  darkColors?: ThemeColors;
  fonts: ThemeFonts;
  styles: ThemeStyles;
  animations: ThemeAnimations;
  updatedAt: string;
}

export type ContactMessageStatus = 'new' | 'read' | 'archived';

// Contact Submission Document stored in Firestore collection: contactMessages/{messageId}
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: ContactMessageStatus;
  createdAt: string;
  updatedAt: string;
  ipAddress?: string;
}

export type BlogStatus = 'draft' | 'published' | 'archived';

// Blog Post Document: blogs/{blogId}
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
