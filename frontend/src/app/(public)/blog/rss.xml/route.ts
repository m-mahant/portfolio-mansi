import { publicApi } from '@/services/api/public-api';
import { BRAND_NAME } from '@/lib/brand';

// Escapes text for safe inclusion inside XML element content.
function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Serves an RSS 2.0 feed of published blog posts at /blog/rss.xml.
export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  let items = '';
  try {
    const { items: posts } = await publicApi.getBlogs({ limit: 50 });
    items = posts
      .map((post) => {
        const url = `${siteUrl}/blog/${post.slug}`;
        const pubDate = new Date(post.publishedAt || post.createdAt).toUTCString();
        return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(post.excerpt || post.title)}</description>
    </item>`;
      })
      .join('\n');
  } catch {
    // Empty feed if the backend is unreachable, rather than erroring the request.
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(BRAND_NAME)} — Blog</title>
    <link>${siteUrl}/blog</link>
    <description>${escapeXml(`Insights and notes from ${BRAND_NAME}'s portfolio.`)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link xmlns:atom="http://www.w3.org/2005/Atom" href="${siteUrl}/blog/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
}
