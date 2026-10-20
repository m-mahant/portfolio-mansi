// Public REST API client for fetching published site content and dynamic theme tokens.

import { ApiResponse } from '@/types/admin.types';
import {
  SiteSettings,
  AboutProfile,
  SocialLink,
  Project,
  Artwork,
  Experience,
  Education,
  Blog,
  PaginatedBlogs,
  ThemeSettings,
  PaginatedProjects,
  PaginatedArtworks,
  PublicProjectQueryParams,
  PublicArtworkQueryParams,
  ContactSubmissionData,
  ContactResponseData,
  HomePageConfig,
  IntroPageConfig,
  WorkPageConfig,
  ContactPageConfig,
  DevelopmentPageConfig,
  ArtPageConfig,
  BlogPageConfig,
  ExperiencePageConfig,
} from '@/types/public.types';

export interface HomePublicResponse {
  config: HomePageConfig;
}

export interface WorkPagePublicResponse {
  config: WorkPageConfig;
}

// Computes the consistent backend API v1 base URL.
function getApiBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  return envUrl.endsWith('/api/v1') ? envUrl : `${envUrl.replace(/\/+$/, '')}/api/v1`;
}

function shouldSkipBuildTimeFetch(url: string): boolean {
  const isLocal = url.includes('localhost') || url.includes('127.0.0.1');
  return isLocal && process.env.VERCEL === '1';
}

// Helper function to perform GET requests against the backend API.
async function fetchPublicApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint}`;

  if (shouldSkipBuildTimeFetch(url)) {
    throw new Error(`Skipped local API fetch during Vercel build: ${endpoint}`);
  }

  const defaultOptions: RequestInit = {
    cache: 'no-store',
    next: { revalidate: 0 },
  };

  const finalOptions: RequestInit = {
    ...defaultOptions,
    ...options,
    signal: options?.signal || AbortSignal.timeout(10000),
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  };

  let response: Response;
  try {
    response = await fetch(url, finalOptions);
  } catch {
    throw new Error(`Failed to reach API ${endpoint}`);
  }

  let json: ApiResponse<T>;
  try {
    json = (await response.json()) as ApiResponse<T>;
  } catch {
    throw new Error(`Invalid API response from ${endpoint}`);
  }

  if (!response.ok || !json.success || json.data === undefined) {
    throw new Error(json.error?.message || `Failed to fetch from ${endpoint}`);
  }

  return json.data;
}

// Submits a user contact message to POST /api/v1/contact.
export async function submitContact(data: ContactSubmissionData): Promise<ContactResponseData> {
  const baseUrl = getApiBaseUrl();
  const response = await fetch(`${baseUrl}/contact`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const json: ApiResponse<ContactResponseData> = await response.json();

  if (!response.ok || !json.success || json.data === undefined) {
    throw new Error(json.error?.message || 'Failed to submit contact message.');
  }

  return json.data;
}

// Fetches public intro page configuration.
export async function getIntro(options?: RequestInit): Promise<IntroPageConfig> {
  return fetchPublicApi<IntroPageConfig>('/intro', options);
}

// Fetches public home page configuration.
export async function getHome(options?: RequestInit): Promise<HomePublicResponse> {
  return fetchPublicApi<HomePublicResponse>('/home', options);
}

// Fetches public work overview page configuration.
export async function getWorkPage(options?: RequestInit): Promise<WorkPagePublicResponse> {
  return fetchPublicApi<WorkPagePublicResponse>('/work', options);
}

// Fetches development listing page chrome.
export async function getDevelopmentPage(options?: RequestInit): Promise<DevelopmentPageConfig> {
  return fetchPublicApi<DevelopmentPageConfig>('/development', options);
}

// Fetches art listing page chrome.
export async function getArtPage(options?: RequestInit): Promise<ArtPageConfig> {
  return fetchPublicApi<ArtPageConfig>('/art', options);
}

// Fetches blog listing page chrome.
export async function getBlogPage(options?: RequestInit): Promise<BlogPageConfig> {
  return fetchPublicApi<BlogPageConfig>('/blog-page', options);
}

// Fetches experience page chrome.
export async function getExperiencePage(options?: RequestInit): Promise<ExperiencePageConfig> {
  return fetchPublicApi<ExperiencePageConfig>('/experience-page', options);
}

// Fetches public contact page configuration.
export async function getContactPage(options?: RequestInit): Promise<ContactPageConfig> {
  return fetchPublicApi<ContactPageConfig>('/contact', options);
}

// Fetches public site settings, title, branding, and contact availability toggles.
export async function getSite(options?: RequestInit): Promise<SiteSettings> {
  return fetchPublicApi<SiteSettings>('/site', options);
}

// Fetches public biography, personal story, and discipline breakdowns.
export async function getAbout(options?: RequestInit): Promise<AboutProfile> {
  return fetchPublicApi<AboutProfile>('/about', options);
}

// Fetches the ordered list of visible social profile links.
export async function getSocialLinks(options?: RequestInit): Promise<SocialLink[]> {
  return fetchPublicApi<SocialLink[]>('/social-links', options);
}

// Alias fetching visible social profile links via /social API endpoint.
export async function getSocial(options?: RequestInit): Promise<SocialLink[]> {
  return fetchPublicApi<SocialLink[]>('/social', options);
}

// Fetches published development projects with optional pagination and featured filtering.
export async function getProjects(
  params?: PublicProjectQueryParams,
  options?: RequestInit
): Promise<PaginatedProjects> {
  const query = new URLSearchParams();
  if (params?.featured !== undefined) query.set('featured', String(params.featured));
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));

  const queryString = query.toString() ? `?${query.toString()}` : '';
  return fetchPublicApi<PaginatedProjects>(`/projects${queryString}`, options);
}

// Fetches a single published development project by its unique SEO slug.
export async function getProjectBySlug(slug: string, options?: RequestInit): Promise<Project> {
  return fetchPublicApi<Project>(`/projects/${encodeURIComponent(slug)}`, options);
}

// Fetches published artwork and craft items with optional category filtering and pagination.
export async function getArtworks(
  params?: PublicArtworkQueryParams,
  options?: RequestInit
): Promise<PaginatedArtworks> {
  const query = new URLSearchParams();
  if (params?.category) query.set('category', params.category);
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));

  const queryString = query.toString() ? `?${query.toString()}` : '';
  return fetchPublicApi<PaginatedArtworks>(`/artworks${queryString}`, options);
}

// Fetches a single published artwork item by its unique SEO slug.
export async function getArtworkBySlug(slug: string, options?: RequestInit): Promise<Artwork> {
  return fetchPublicApi<Artwork>(`/artworks/${encodeURIComponent(slug)}`, options);
}

// Fetches the visible career experience timeline entries directly from the Experience catalog.
export async function getExperience(options?: RequestInit): Promise<Experience[]> {
  const res = await fetchPublicApi<Experience[]>('/experience', options);
  return Array.isArray(res) ? res : [];
}

// Fetches the visible education history entries directly from the Education catalog.
export async function getEducation(options?: RequestInit): Promise<Education[]> {
  const res = await fetchPublicApi<Education[]>('/education', options);
  return Array.isArray(res) ? res : [];
}

// Fetches active dynamic visual theme colors, fonts, and styling parameters without ISR cache delay.
export async function getTheme(options?: RequestInit): Promise<ThemeSettings> {
  return fetchPublicApi<ThemeSettings>('/theme', { cache: 'no-store', ...options });
}

// Fetches published blog posts with optional category/tag filtering and pagination.
export async function getBlogs(
  params?: { page?: number; limit?: number; tag?: string; category?: string; search?: string },
  options?: RequestInit
): Promise<PaginatedBlogs> {
  const query = new URLSearchParams();
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));
  if (params?.tag) query.set('tag', params.tag);
  if (params?.category) query.set('category', params.category);
  if (params?.search) query.set('search', params.search);

  const queryString = query.toString() ? `?${query.toString()}` : '';
  return fetchPublicApi<PaginatedBlogs>(`/blogs${queryString}`, options);
}

// Fetches a single published blog post by its unique SEO slug.
export async function getBlogBySlug(slug: string, options?: RequestInit): Promise<Blog> {
  return fetchPublicApi<Blog>(`/blogs/${encodeURIComponent(slug)}`, options);
}

export const publicApi = {
  getIntro,
  getHome,
  getWorkPage,
  getDevelopmentPage,
  getArtPage,
  getBlogPage,
  getExperiencePage,
  getContactPage,
  getSite,
  getAbout,
  getSocial,
  getSocialLinks,
  getProjects,
  getProjectBySlug,
  getArtworks,
  getArtworkBySlug,
  getBlogs,
  getBlogBySlug,
  getExperience,
  getEducation,
  getTheme,
  submitContact,
};
