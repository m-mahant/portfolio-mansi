// Estimates article reading time in minutes from body copy.
export function calculateReadTime(text?: string): number {
  if (!text) return 3;
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

// Formats a published or created date for public blog surfaces.
export function formatBlogDate(iso?: string | null, style: 'short' | 'long' = 'short'): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString(
    'en-US',
    style === 'long'
      ? { year: 'numeric', month: 'long', day: 'numeric' }
      : { year: 'numeric', month: 'short', day: 'numeric' }
  );
}
