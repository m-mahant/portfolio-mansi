// Dynamic sitemap metadata generator for public portfolio pages, dynamic project case studies, and artwork gallery items.

import { MetadataRoute } from 'next';
import { getProjects, getArtworks, getBlogs } from '@/services/api/public-api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const currentDate = new Date().toISOString();

  // Core static public routes. /education is deliberately excluded: it's a redirect-only
  // route (see (public)/education/page.tsx), and a sitemap should only list real indexable
  // pages — listing a redirect here was a confirmed cause of "Page with redirect" exclusions
  // in Search Console.
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: currentDate, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/work`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/work/development`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/work/art-crafts`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/blog`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/experience`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/privacy`, lastModified: currentDate, changeFrequency: 'yearly', priority: 0.3 },
  ];

  // Requesting more than 50 throws BAD_REQUEST from the list APIs (blogQuerySchema caps limit
  // at 50; projects/artworks silently clamp to the same ceiling) — this previously caused the
  // blog fetch below to fail and get swallowed by the catch block, leaving every published blog
  // post out of the sitemap entirely.
  let projectRoutes: MetadataRoute.Sitemap = [];
  try {
    const projectsResponse = await getProjects({ limit: 50 });
    projectRoutes = projectsResponse.items.map((project) => ({
      url: `${baseUrl}/work/development/${project.slug}`,
      lastModified: project.updatedAt || currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    }));
  } catch {
    // Gracefully handle backend unavailability during static export/build
  }

  let artworkRoutes: MetadataRoute.Sitemap = [];
  try {
    const artworksResponse = await getArtworks({ limit: 50 });

    artworkRoutes = artworksResponse.items.map((artwork) => ({
      url: `${baseUrl}/work/art-crafts/${artwork.slug}`,
      lastModified: artwork.updatedAt || currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    }));
  } catch {
    // Gracefully handle backend unavailability during static export/build
  }

  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const blogsResponse = await getBlogs({ limit: 50 });
    blogRoutes = blogsResponse.items.map((blog) => ({
      url: `${baseUrl}/blog/${blog.slug}`,
      lastModified: blog.updatedAt || blog.publishedAt || currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    }));
  } catch {
    // Gracefully handle backend unavailability during static export/build
  }

  return [...staticRoutes, ...projectRoutes, ...artworkRoutes, ...blogRoutes];
}
