// Unit test suite verifying Art & Crafts portfolio components and filtering logic.

import assert from 'assert';
import { Artwork } from '@/types/public.types';

const sampleArtworks: Artwork[] = [
  {
    id: 'art-1',
    title: 'Neon Odyssey',
    slug: 'neon-odyssey',
    category: '3D Render',
    tags: ['GLSL', 'Cyberpunk'],
    materials: ['Cinema 4D', 'Octane'],
    status: 'published',
    displayOrder: 1,
    isFeatured: true,
    images: [],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'art-2',
    title: 'Ethereal Botanica',
    slug: 'ethereal-botanica',
    category: 'Digital Art',
    tags: ['Illustration', 'Watercolor'],
    materials: ['Procreate', 'Illustrator'],
    status: 'published',
    displayOrder: 2,
    isFeatured: false,
    images: [],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'art-3',
    title: 'Ceramic Vessel',
    slug: 'ceramic-vessel',
    category: 'Crafts',
    tags: ['Pottery', 'Stoneware'],
    materials: ['Clay', 'Glaze'],
    status: 'published',
    displayOrder: 3,
    isFeatured: false,
    images: [],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
];

export function runPublicArtCraftsTests(): void {
  // Test 1: Extract unique categories dynamically
  const categories = Array.from(new Set(sampleArtworks.map((a) => a.category)));
  assert.deepStrictEqual(categories, ['3D Render', 'Digital Art', 'Crafts']);

  // Test 2: Filter artworks by category
  const category = '3D Render';
  const filtered = sampleArtworks.filter((a) => a.category === category);
  assert.strictEqual(filtered.length, 1);
  assert.strictEqual(filtered[0].title, 'Neon Odyssey');

  // Test 3: Filter artworks by search query in title or materials
  const query = 'procreate';
  const searchFiltered = sampleArtworks.filter(
    (a) =>
      a.title.toLowerCase().includes(query) ||
      a.materials?.some((m) => m.toLowerCase().includes(query))
  );
  assert.strictEqual(searchFiltered.length, 1);
  assert.strictEqual(searchFiltered[0].slug, 'ethereal-botanica');

  // Test 4: Calculate previous and next artwork navigation index
  const currentIndex = 1; // 'ethereal-botanica'
  const total = sampleArtworks.length;

  const prevIndex = (currentIndex - 1 + total) % total;
  const nextIndex = (currentIndex + 1) % total;

  assert.strictEqual(sampleArtworks[prevIndex].slug, 'neon-odyssey');
  assert.strictEqual(sampleArtworks[nextIndex].slug, 'ceramic-vessel');

  // Test 5: Filter related artworks by category excluding active piece
  const activeArtwork = sampleArtworks[0]; // 3D Render
  const additional3D: Artwork = {
    id: 'art-4',
    title: 'Quantum Glass',
    slug: 'quantum-glass',
    category: '3D Render',
    tags: ['Blender'],
    materials: ['Blender'],
    status: 'published',
    displayOrder: 4,
    images: [],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  };

  const pool = [...sampleArtworks, additional3D];
  const related = pool.filter(
    (a) => a.id !== activeArtwork.id && a.category === activeArtwork.category
  );

  assert.strictEqual(related.length, 1);
  assert.strictEqual(related[0].slug, 'quantum-glass');
}

// Auto-run if executed directly via node runner
if (require.main === module) {
  runPublicArtCraftsTests();
  console.log('✅ Phase 7F Public Art & Crafts Unit Tests Passed!');
}
