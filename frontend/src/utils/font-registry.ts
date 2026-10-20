// Provides a secure font registry and dynamic font loader for approved theme typography.

export type FontCategory = 'serif' | 'sans-serif' | 'display' | 'handwriting' | 'monospace';

export interface FontDefinition {
  id: string;
  name: string;
  family: string;
  category: FontCategory;
  googleFontName: string; // Exact family name for Google Fonts API
  weights?: string;       // e.g. "400;600;700" or "400"
}

// Complete Catalog of Approved Fonts (20 requested Google Fonts + established foundation fonts)
export const APPROVED_FONT_CATALOG: FontDefinition[] = [
  // 1. Caacupe One
  {
    id: 'caacupe-one',
    name: 'Caacupe One',
    family: '"Caacupe One", sans-serif',
    category: 'display',
    googleFontName: 'Caacupe One',
    weights: '400',
  },
  // 2. Betania Patmos
  {
    id: 'betania-patmos',
    name: 'Betania Patmos',
    family: '"Betania Patmos", serif',
    category: 'serif',
    googleFontName: 'Betania Patmos',
    weights: '400',
  },
  // 3. Roboto Slab
  {
    id: 'roboto-slab',
    name: 'Roboto Slab',
    family: '"Roboto Slab", serif',
    category: 'serif',
    googleFontName: 'Roboto Slab',
    weights: '400;600;700',
  },
  // 4. Bebas Neue
  {
    id: 'bebas-neue',
    name: 'Bebas Neue',
    family: '"Bebas Neue", sans-serif',
    category: 'display',
    googleFontName: 'Bebas Neue',
    weights: '400',
  },
  // 5. Lora
  {
    id: 'lora',
    name: 'Lora',
    family: 'Lora, serif',
    category: 'serif',
    googleFontName: 'Lora',
    weights: '400;600;700',
  },
  // 6. PT Serif
  {
    id: 'pt-serif',
    name: 'PT Serif',
    family: '"PT Serif", serif',
    category: 'serif',
    googleFontName: 'PT Serif',
    weights: '400;700',
  },
  // 7. Lobster Two
  {
    id: 'lobster-two',
    name: 'Lobster Two',
    family: '"Lobster Two", cursive',
    category: 'handwriting',
    googleFontName: 'Lobster Two',
    weights: '400;700',
  },
  // 8. Anton
  {
    id: 'anton',
    name: 'Anton',
    family: 'Anton, sans-serif',
    category: 'display',
    googleFontName: 'Anton',
    weights: '400',
  },
  // 9. Fraunces
  {
    id: 'fraunces',
    name: 'Fraunces',
    family: 'Fraunces, serif',
    category: 'serif',
    googleFontName: 'Fraunces',
    weights: '400;600;700',
  },
  // 10. Dancing Script
  {
    id: 'dancing-script',
    name: 'Dancing Script',
    family: '"Dancing Script", cursive',
    category: 'handwriting',
    googleFontName: 'Dancing Script',
    weights: '400;600;700',
  },
  // 11. Changa One
  {
    id: 'changa-one',
    name: 'Changa One',
    family: '"Changa One", display',
    category: 'display',
    googleFontName: 'Changa One',
    weights: '400',
  },
  // 12. Caveat
  {
    id: 'caveat',
    name: 'Caveat',
    family: 'Caveat, cursive',
    category: 'handwriting',
    googleFontName: 'Caveat',
    weights: '400;600;700',
  },
  // 13. Satisfy
  {
    id: 'satisfy',
    name: 'Satisfy',
    family: 'Satisfy, cursive',
    category: 'handwriting',
    googleFontName: 'Satisfy',
    weights: '400',
  },
  // 14. Cormorant
  {
    id: 'cormorant',
    name: 'Cormorant',
    family: 'Cormorant, serif',
    category: 'serif',
    googleFontName: 'Cormorant',
    weights: '400;600;700',
  },
  // 15. Indie Flower
  {
    id: 'indie-flower',
    name: 'Indie Flower',
    family: '"Indie Flower", cursive',
    category: 'handwriting',
    googleFontName: 'Indie Flower',
    weights: '400',
  },
  // 16. Cinzel
  {
    id: 'cinzel',
    name: 'Cinzel',
    family: 'Cinzel, serif',
    category: 'serif',
    googleFontName: 'Cinzel',
    weights: '400;600;700',
  },
  // 17. Yellowtail
  {
    id: 'yellowtail',
    name: 'Yellowtail',
    family: 'Yellowtail, cursive',
    category: 'handwriting',
    googleFontName: 'Yellowtail',
    weights: '400',
  },
  // 18. Great Vibes
  {
    id: 'great-vibes',
    name: 'Great Vibes',
    family: '"Great Vibes", cursive',
    category: 'handwriting',
    googleFontName: 'Great Vibes',
    weights: '400',
  },
  // 19. Bangers
  {
    id: 'bangers',
    name: 'Bangers',
    family: 'Bangers, display',
    category: 'display',
    googleFontName: 'Bangers',
    weights: '400',
  },
  // 20. Macondo
  {
    id: 'macondo',
    name: 'Macondo',
    family: 'Macondo, cursive',
    category: 'display',
    googleFontName: 'Macondo',
    weights: '400',
  },

  // Foundation & UI Fonts
  {
    id: 'inter',
    name: 'Inter',
    family: 'Inter, sans-serif',
    category: 'sans-serif',
    googleFontName: 'Inter',
    weights: '400;500;600;700',
  },
  {
    id: 'pacifico',
    name: 'Pacifico',
    family: 'Pacifico, cursive',
    category: 'handwriting',
    googleFontName: 'Pacifico',
    weights: '400',
  },
  {
    id: 'outfit',
    name: 'Outfit',
    family: 'Outfit, sans-serif',
    category: 'sans-serif',
    googleFontName: 'Outfit',
    weights: '400;500;600;700',
  },
  {
    id: 'roboto',
    name: 'Roboto',
    family: 'Roboto, sans-serif',
    category: 'sans-serif',
    googleFontName: 'Roboto',
    weights: '400;500;700',
  },
  {
    id: 'playfair-display',
    name: 'Playfair Display',
    family: '"Playfair Display", serif',
    category: 'serif',
    googleFontName: 'Playfair Display',
    weights: '400;600;700',
  },
  {
    id: 'fira-code',
    name: 'Fira Code',
    family: '"Fira Code", monospace',
    category: 'monospace',
    googleFontName: 'Fira Code',
    weights: '400;600',
  },
  {
    id: 'space-grotesk',
    name: 'Space Grotesk',
    family: '"Space Grotesk", sans-serif',
    category: 'sans-serif',
    googleFontName: 'Space Grotesk',
    weights: '400;600;700',
  },
  {
    id: 'plus-jakarta-sans',
    name: 'Plus Jakarta Sans',
    family: '"Plus Jakarta Sans", sans-serif',
    category: 'sans-serif',
    googleFontName: 'Plus Jakarta Sans',
    weights: '400;600;700',
  },
  {
    id: 'marcellus',
    name: 'Marcellus',
    family: 'Marcellus, serif',
    category: 'serif',
    googleFontName: 'Marcellus',
    weights: '400',
  },
  {
    id: 'jacques-francois',
    name: 'Jacques Francois',
    family: '"Jacques Francois", serif',
    category: 'serif',
    googleFontName: 'Jacques Francois',
    weights: '400',
  },
];

// Helper dictionary mapping font name or ID to CSS font-family
export const APPROVED_FONTS: Record<string, string> = APPROVED_FONT_CATALOG.reduce(
  (acc, font) => {
    acc[font.name] = font.family;
    acc[font.id] = font.family;
    return acc;
  },
  {} as Record<string, string>
);

export const DEFAULT_HEADING_FONT = 'Cinzel';
export const DEFAULT_BODY_FONT = 'Inter';
export const DEFAULT_ACCENT_FONT = 'Pacifico';
export const DEFAULT_MONO_FONT = 'Fira Code';

// Lookup a font definition by name or ID
export function getFontDefinition(fontNameOrId: string): FontDefinition | undefined {
  if (!fontNameOrId) return undefined;
  const normalized = fontNameOrId.trim().toLowerCase();
  return APPROVED_FONT_CATALOG.find(
    (f) => f.name.toLowerCase() === normalized || f.id.toLowerCase() === normalized
  );
}

// Validates whether a font family is present in the approved catalog.
export function isApprovedFont(fontName: string): boolean {
  if (!fontName) return false;
  return Boolean(getFontDefinition(fontName));
}

// Sanitizes input font string and returns the approved CSS font-family stack.
export function getSafeFontStack(fontName?: string, fallbackFont: string = 'Inter'): string {
  if (!fontName) {
    const fallbackDef = getFontDefinition(fallbackFont);
    return fallbackDef ? fallbackDef.family : 'sans-serif';
  }

  const def = getFontDefinition(fontName);
  if (def) return def.family;

  const fallbackDef = getFontDefinition(fallbackFont);
  if (fallbackDef) return fallbackDef.family;

  return 'sans-serif';
}

// Dynamically loads Google Fonts for preview or runtime if not already loaded.
export function loadGoogleFont(fontNameOrId: string): void {
  if (typeof document === 'undefined' || !fontNameOrId) return;

  const def = getFontDefinition(fontNameOrId);
  if (!def) return;

  const fontId = `public-google-font-${def.id}`;
  if (document.getElementById(fontId)) return;

  const weights = def.weights || '400;600;700';
  const link = document.createElement('link');
  link.id = fontId;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
    def.googleFontName
  )}:wght@${weights}&display=swap`;
  document.head.appendChild(link);
}
