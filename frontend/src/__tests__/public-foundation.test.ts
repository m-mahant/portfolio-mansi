// Unit test suite verifying public font registry, theme fallback mapping, and navigation structures.

import assert from 'assert';
import { APPROVED_FONTS, isApprovedFont, getSafeFontStack } from '@/utils/font-registry';
import { PUBLIC_NAV_ITEMS } from '@/components/public/public-navigation';
import { DEFAULT_THEME } from '@/context/theme-runtime';

export function runPublicFoundationTests(): void {
  // validates approved fonts in font registry
  assert.strictEqual(isApprovedFont('Cinzel'), true);
  assert.strictEqual(isApprovedFont('Pacifico'), true);
  assert.strictEqual(isApprovedFont('Jacques Francois'), true);
  assert.strictEqual(isApprovedFont('Great Vibes'), true);
  assert.strictEqual(isApprovedFont('Marcellus'), true);
  assert.strictEqual(isApprovedFont('Playfair Display'), true);
  assert.strictEqual(isApprovedFont('Caacupe One'), true);
  assert.strictEqual(isApprovedFont('Betania Patmos'), true);
  assert.strictEqual(isApprovedFont('Roboto Slab'), true);
  assert.strictEqual(isApprovedFont('Bebas Neue'), true);
  assert.strictEqual(isApprovedFont('Lora'), true);
  assert.strictEqual(isApprovedFont('PT Serif'), true);
  assert.strictEqual(isApprovedFont('Lobster Two'), true);
  assert.strictEqual(isApprovedFont('Anton'), true);
  assert.strictEqual(isApprovedFont('Fraunces'), true);
  assert.strictEqual(isApprovedFont('Dancing Script'), true);
  assert.strictEqual(isApprovedFont('Changa One'), true);
  assert.strictEqual(isApprovedFont('Caveat'), true);
  assert.strictEqual(isApprovedFont('Satisfy'), true);
  assert.strictEqual(isApprovedFont('Cormorant'), true);
  assert.strictEqual(isApprovedFont('Indie Flower'), true);
  assert.strictEqual(isApprovedFont('Yellowtail'), true);
  assert.strictEqual(isApprovedFont('Bangers'), true);
  assert.strictEqual(isApprovedFont('Macondo'), true);
  assert.strictEqual(isApprovedFont('UnapprovedFont123'), false);

  // returns safe fallback font stack for unapproved font inputs
  const safeStack = getSafeFontStack('UnapprovedFont', 'Cinzel');
  assert.strictEqual(safeStack, APPROVED_FONTS['Cinzel']);

  // verifies Works navigation dropdown contains ONLY Development and Art & Crafts
  const workItem = PUBLIC_NAV_ITEMS.find((item) => item.label === 'Works');
  assert.ok(workItem);
  assert.strictEqual(workItem?.children?.length, 2);
  assert.strictEqual(workItem?.children?.[0].href, '/work/development');
  assert.strictEqual(workItem?.children?.[1].href, '/work/art-crafts');

  // verifies default fallback theme visual identity (BLUE x PURPLE)
  assert.strictEqual(DEFAULT_THEME.colors.primary, '#6366f1');
  assert.strictEqual(DEFAULT_THEME.colors.secondary, '#8b5cf6');
  assert.strictEqual(DEFAULT_THEME.colors.background, '#0f172a');
}
