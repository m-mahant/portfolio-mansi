// Unit test suite verifying Phase 7C public home navigation items and profile data mapping.

import assert from 'assert';
import { PUBLIC_NAV_ITEMS } from '@/components/public/public-navigation';

export function runPublicHomeTests(): void {
  // Verify top-level navigation items
  const labels = PUBLIC_NAV_ITEMS.map((item) => item.label);
  assert.deepStrictEqual(labels, ['Home', 'About', 'Work', 'Experience', 'Blogs', 'Contact']);

  // Verify Work dropdown contents
  const workItem = PUBLIC_NAV_ITEMS.find((item) => item.label === 'Work');
  assert.ok(workItem && workItem.children);
  assert.strictEqual(workItem.children.length, 2);

  const workChildrenLabels = workItem.children.map((child) => child.label);
  assert.deepStrictEqual(workChildrenLabels, ['Development', 'Art & Crafts']);

  const workChildrenHrefs = workItem.children.map((child) => child.href);
  assert.deepStrictEqual(workChildrenHrefs, ['/work/development', '/work/art-crafts']);
}

// Auto-run if executed directly via node
if (require.main === module) {
  runPublicHomeTests();
  console.log('✅ Phase 7C Public Home Unit Tests Passed!');
}
