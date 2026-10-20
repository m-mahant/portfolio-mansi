// Centralized API client for Admin CMS endpoints.

import {
  ApiResponse,
  AuthCheckResponse,
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
  MediaItem,
  DashboardSummary,
  HomePageConfig,
  IntroPageConfig,
  WorkPageConfig,
  ContactPageConfig,
  DevelopmentPageConfig,
  ArtPageConfig,
  BlogPageConfig,
  ExperiencePageConfig,
} from '@/types/admin.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

class ApiError extends Error {
  code: string;
  details?: unknown;

  constructor(message: string, code: string = 'UNKNOWN_ERROR', details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.details = details;
  }
}

// Executes authenticated HTTP requests to the backend Express REST API.
async function fetchWithAuth<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const json: ApiResponse<T> = await response.json().catch(() => ({
    success: false,
    error: {
      code: 'INVALID_JSON',
      message: 'Server returned an invalid JSON response.',
    },
  }));

  if (!response.ok || !json.success) {
    const errorMsg = json.error?.message || `HTTP ${response.status} Request Failed`;
    const errorCode = json.error?.code || `HTTP_${response.status}`;
    throw new ApiError(errorMsg, errorCode, json.error?.details);
  }

  return json.data as T;
}

export const adminApi = {
  // Verifies authentication ID token and admin status.
  async checkAuth(token: string): Promise<AuthCheckResponse> {
    return fetchWithAuth<AuthCheckResponse>('/api/v1/admin/auth-check', { method: 'GET' }, token);
  },

  // Fetches counts summary for the dashboard home.
  async getDashboardSummary(token: string): Promise<DashboardSummary> {
    const [projects, artworks, experiences, media] = await Promise.all([
      fetchWithAuth<Project[]>('/api/v1/admin/projects', { method: 'GET' }, token).catch(() => []),
      fetchWithAuth<Artwork[]>('/api/v1/admin/artworks', { method: 'GET' }, token).catch(() => []),
      fetchWithAuth<Experience[]>('/api/v1/admin/experience', { method: 'GET' }, token).catch(() => []),
      fetchWithAuth<MediaItem[]>('/api/v1/admin/media', { method: 'GET' }, token).catch(() => []),
    ]);

    return {
      projectsCount: Array.isArray(projects) ? projects.length : 0,
      artworksCount: Array.isArray(artworks) ? artworks.length : 0,
      experienceCount: Array.isArray(experiences) ? experiences.length : 0,
      mediaCount: Array.isArray(media) ? media.length : 0,
    };
  },

  // Site Settings
  async getSiteSettings(token: string): Promise<SiteSettings> {
    return fetchWithAuth<SiteSettings>('/api/v1/admin/site', { method: 'GET' }, token);
  },
  async updateSiteSettings(data: Partial<SiteSettings>, token: string): Promise<SiteSettings> {
    return fetchWithAuth<SiteSettings>(
      '/api/v1/admin/site',
      { method: 'PATCH', body: JSON.stringify(data) },
      token
    );
  },

  // About Profile
  async getAboutProfile(token: string): Promise<AboutProfile> {
    return fetchWithAuth<AboutProfile>('/api/v1/admin/about', { method: 'GET' }, token);
  },
  async updateAboutProfile(data: Partial<AboutProfile>, token: string): Promise<AboutProfile> {
    return fetchWithAuth<AboutProfile>(
      '/api/v1/admin/about',
      { method: 'PATCH', body: JSON.stringify(data) },
      token
    );
  },

  // Social Links
  async getSocialLinks(token: string): Promise<SocialLink[]> {
    return fetchWithAuth<SocialLink[]>('/api/v1/admin/social-links', { method: 'GET' }, token);
  },
  async createSocialLink(data: Omit<SocialLink, 'id'>, token: string): Promise<SocialLink> {
    return fetchWithAuth<SocialLink>(
      '/api/v1/admin/social-links',
      { method: 'POST', body: JSON.stringify(data) },
      token
    );
  },
  async updateSocialLink(id: string, data: Partial<SocialLink>, token: string): Promise<SocialLink> {
    return fetchWithAuth<SocialLink>(
      `/api/v1/admin/social-links/${id}`,
      { method: 'PATCH', body: JSON.stringify(data) },
      token
    );
  },
  async deleteSocialLink(id: string, token: string): Promise<{ id: string }> {
    return fetchWithAuth<{ id: string }>(
      `/api/v1/admin/social-links/${id}`,
      { method: 'DELETE' },
      token
    );
  },

  // Projects
  async getProjects(token: string): Promise<Project[]> {
    return fetchWithAuth<Project[]>('/api/v1/admin/projects', { method: 'GET' }, token);
  },
  async getProjectById(id: string, token: string): Promise<Project> {
    return fetchWithAuth<Project>(`/api/v1/admin/projects/${id}`, { method: 'GET' }, token);
  },
  async createProject(data: Omit<Project, 'id'>, token: string): Promise<Project> {
    return fetchWithAuth<Project>(
      '/api/v1/admin/projects',
      { method: 'POST', body: JSON.stringify(data) },
      token
    );
  },
  async updateProject(id: string, data: Partial<Project>, token: string): Promise<Project> {
    return fetchWithAuth<Project>(
      `/api/v1/admin/projects/${id}`,
      { method: 'PATCH', body: JSON.stringify(data) },
      token
    );
  },
  async deleteProject(id: string, token: string): Promise<{ id: string }> {
    return fetchWithAuth<{ id: string }>(
      `/api/v1/admin/projects/${id}`,
      { method: 'DELETE' },
      token
    );
  },

  // Artworks
  async getArtworks(token: string): Promise<Artwork[]> {
    return fetchWithAuth<Artwork[]>('/api/v1/admin/artworks', { method: 'GET' }, token);
  },
  async getArtworkById(id: string, token: string): Promise<Artwork> {
    return fetchWithAuth<Artwork>(`/api/v1/admin/artworks/${id}`, { method: 'GET' }, token);
  },
  async createArtwork(data: Omit<Artwork, 'id'>, token: string): Promise<Artwork> {
    return fetchWithAuth<Artwork>(
      '/api/v1/admin/artworks',
      { method: 'POST', body: JSON.stringify(data) },
      token
    );
  },
  async updateArtwork(id: string, data: Partial<Artwork>, token: string): Promise<Artwork> {
    return fetchWithAuth<Artwork>(
      `/api/v1/admin/artworks/${id}`,
      { method: 'PATCH', body: JSON.stringify(data) },
      token
    );
  },
  async deleteArtwork(id: string, token: string): Promise<{ id: string }> {
    return fetchWithAuth<{ id: string }>(
      `/api/v1/admin/artworks/${id}`,
      { method: 'DELETE' },
      token
    );
  },

  // Experience
  async getExperiences(token: string): Promise<Experience[]> {
    return fetchWithAuth<Experience[]>('/api/v1/admin/experience', { method: 'GET' }, token);
  },
  async createExperience(data: Omit<Experience, 'id'>, token: string): Promise<Experience> {
    return fetchWithAuth<Experience>(
      '/api/v1/admin/experience',
      { method: 'POST', body: JSON.stringify(data) },
      token
    );
  },
  async updateExperience(id: string, data: Partial<Experience>, token: string): Promise<Experience> {
    return fetchWithAuth<Experience>(
      `/api/v1/admin/experience/${id}`,
      { method: 'PATCH', body: JSON.stringify(data) },
      token
    );
  },
  async deleteExperience(id: string, token: string): Promise<{ id: string }> {
    return fetchWithAuth<{ id: string }>(
      `/api/v1/admin/experience/${id}`,
      { method: 'DELETE' },
      token
    );
  },

  // Education
  async getEducation(token: string): Promise<Education[]> {
    return fetchWithAuth<Education[]>('/api/v1/admin/education', { method: 'GET' }, token);
  },
  async createEducation(data: Omit<Education, 'id'>, token: string): Promise<Education> {
    return fetchWithAuth<Education>(
      '/api/v1/admin/education',
      { method: 'POST', body: JSON.stringify(data) },
      token
    );
  },
  async updateEducation(id: string, data: Partial<Education>, token: string): Promise<Education> {
    return fetchWithAuth<Education>(
      `/api/v1/admin/education/${id}`,
      { method: 'PATCH', body: JSON.stringify(data) },
      token
    );
  },
  async deleteEducation(id: string, token: string): Promise<{ id: string }> {
    return fetchWithAuth<{ id: string }>(
      `/api/v1/admin/education/${id}`,
      { method: 'DELETE' },
      token
    );
  },

  // Blogs
  async getBlogs(token: string, options?: { page?: number; limit?: number; status?: string; search?: string }): Promise<PaginatedBlogs> {
    const params = new URLSearchParams();
    if (options?.page) params.append('page', options.page.toString());
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.status) params.append('status', options.status);
    if (options?.search) params.append('search', options.search);
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return fetchWithAuth<PaginatedBlogs>(`/api/v1/admin/blogs${queryString}`, { method: 'GET' }, token);
  },
  async getBlogById(id: string, token: string): Promise<Blog> {
    return fetchWithAuth<Blog>(`/api/v1/admin/blogs/${id}`, { method: 'GET' }, token);
  },
  async createBlog(data: Partial<Blog>, token: string): Promise<Blog> {
    return fetchWithAuth<Blog>('/api/v1/admin/blogs', { method: 'POST', body: JSON.stringify(data) }, token);
  },
  async updateBlog(id: string, data: Partial<Blog>, token: string): Promise<Blog> {
    return fetchWithAuth<Blog>(`/api/v1/admin/blogs/${id}`, { method: 'PATCH', body: JSON.stringify(data) }, token);
  },
  async deleteBlog(id: string, token: string): Promise<{ id: string }> {
    return fetchWithAuth<{ id: string }>(`/api/v1/admin/blogs/${id}`, { method: 'DELETE' }, token);
  },

  // Theme Settings

  async getThemeSettings(token: string): Promise<ThemeSettings> {
    return fetchWithAuth<ThemeSettings>('/api/v1/admin/theme', { method: 'GET' }, token);
  },
  async updateThemeSettings(data: Partial<ThemeSettings>, token: string): Promise<ThemeSettings> {
    return fetchWithAuth<ThemeSettings>(
      '/api/v1/admin/theme',
      { method: 'PATCH', body: JSON.stringify(data) },
      token
    );
  },

  // Media
  async getMediaList(token: string, folder?: string): Promise<{ items: MediaItem[]; subfolders: Array<{ name: string; path: string }>; total: number }> {
    const query = folder ? `?folder=${encodeURIComponent(folder)}` : '';
    const res = await fetchWithAuth<{ items?: MediaItem[]; subfolders?: Array<{ name: string; path: string }>; total?: number } | MediaItem[]>(
      `/api/v1/admin/media${query}`,
      { method: 'GET' },
      token
    );
    if (Array.isArray(res)) {
      return { items: res, subfolders: [], total: res.length };
    }
    if (res && Array.isArray(res.items)) {
      return {
        items: res.items,
        subfolders: Array.isArray(res.subfolders) ? res.subfolders : [],
        total: typeof res.total === 'number' ? res.total : res.items.length,
      };
    }
    return { items: [], subfolders: [], total: 0 };
  },
  async getMediaListItems(token: string, folder?: string): Promise<MediaItem[]> {
    const res = await this.getMediaList(token, folder);
    return res.items || [];
  },
  async uploadMedia(formData: FormData, token: string): Promise<MediaItem> {
    return fetchWithAuth<MediaItem>(
      '/api/v1/admin/media/upload',
      { method: 'POST', body: formData },
      token
    );
  },
  async deleteMedia(mediaId: string, token: string): Promise<{ mediaId: string }> {
    return fetchWithAuth<{ mediaId: string }>(
      `/api/v1/admin/media/${mediaId}`,
      { method: 'DELETE' },
      token
    );
  },

  // Intro Page Config
  async getIntroPageConfig(token: string): Promise<IntroPageConfig> {
    return fetchWithAuth<IntroPageConfig>('/api/v1/admin/intro', { method: 'GET' }, token);
  },
  async updateIntroPageConfig(data: Partial<IntroPageConfig>, token: string): Promise<IntroPageConfig> {
    return fetchWithAuth<IntroPageConfig>(
      '/api/v1/admin/intro',
      { method: 'PATCH', body: JSON.stringify(data) },
      token
    );
  },

  // Home Page Config
  async getHomePageConfig(token: string): Promise<HomePageConfig> {
    return fetchWithAuth<HomePageConfig>('/api/v1/admin/home', { method: 'GET' }, token);
  },
  async updateHomePageConfig(data: Partial<HomePageConfig>, token: string): Promise<HomePageConfig> {
    return fetchWithAuth<HomePageConfig>(
      '/api/v1/admin/home',
      { method: 'PATCH', body: JSON.stringify(data) },
      token
    );
  },

  // Work Page Config
  async getWorkPageConfig(token: string): Promise<WorkPageConfig> {
    return fetchWithAuth<WorkPageConfig>('/api/v1/admin/work', { method: 'GET' }, token);
  },
  async updateWorkPageConfig(data: Partial<WorkPageConfig>, token: string): Promise<WorkPageConfig> {
    return fetchWithAuth<WorkPageConfig>(
      '/api/v1/admin/work',
      { method: 'PATCH', body: JSON.stringify(data) },
      token
    );
  },

  // Development listing page chrome
  async getDevelopmentPageConfig(token: string): Promise<DevelopmentPageConfig> {
    return fetchWithAuth<DevelopmentPageConfig>('/api/v1/admin/development', { method: 'GET' }, token);
  },
  async updateDevelopmentPageConfig(
    data: Partial<DevelopmentPageConfig>,
    token: string
  ): Promise<DevelopmentPageConfig> {
    return fetchWithAuth<DevelopmentPageConfig>(
      '/api/v1/admin/development',
      { method: 'PATCH', body: JSON.stringify(data) },
      token
    );
  },

  // Art listing page chrome
  async getArtPageConfig(token: string): Promise<ArtPageConfig> {
    return fetchWithAuth<ArtPageConfig>('/api/v1/admin/art', { method: 'GET' }, token);
  },
  async updateArtPageConfig(data: Partial<ArtPageConfig>, token: string): Promise<ArtPageConfig> {
    return fetchWithAuth<ArtPageConfig>(
      '/api/v1/admin/art',
      { method: 'PATCH', body: JSON.stringify(data) },
      token
    );
  },

  // Blog listing page chrome
  async getBlogPageConfig(token: string): Promise<BlogPageConfig> {
    return fetchWithAuth<BlogPageConfig>('/api/v1/admin/blog-page', { method: 'GET' }, token);
  },
  async updateBlogPageConfig(data: Partial<BlogPageConfig>, token: string): Promise<BlogPageConfig> {
    return fetchWithAuth<BlogPageConfig>(
      '/api/v1/admin/blog-page',
      { method: 'PATCH', body: JSON.stringify(data) },
      token
    );
  },

  // Experience page chrome
  async getExperiencePageConfig(token: string): Promise<ExperiencePageConfig> {
    return fetchWithAuth<ExperiencePageConfig>('/api/v1/admin/experience-page', { method: 'GET' }, token);
  },
  async updateExperiencePageConfig(
    data: Partial<ExperiencePageConfig>,
    token: string
  ): Promise<ExperiencePageConfig> {
    return fetchWithAuth<ExperiencePageConfig>(
      '/api/v1/admin/experience-page',
      { method: 'PATCH', body: JSON.stringify(data) },
      token
    );
  },

  // Contact Page Config
  async getContactPageConfig(token: string): Promise<ContactPageConfig> {
    return fetchWithAuth<ContactPageConfig>('/api/v1/admin/contact', { method: 'GET' }, token);
  },
  async updateContactPageConfig(data: Partial<ContactPageConfig>, token: string): Promise<ContactPageConfig> {
    return fetchWithAuth<ContactPageConfig>(
      '/api/v1/admin/contact',
      { method: 'PATCH', body: JSON.stringify(data) },
      token
    );
  },
};
