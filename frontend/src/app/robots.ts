// Dynamic robots.txt metadata generator disallowing admin control panel indexing while permitting public search crawling.

import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/v1/admin/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
