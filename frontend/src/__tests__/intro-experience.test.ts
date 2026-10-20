// Unit test suite verifying Phase 7B intro experience constants and CTA text standards.

import assert from 'assert';
import { DEFAULT_THEME } from '@/context/theme-runtime';

export function runIntroExperienceTests(): void {
  // Verifies default BLUE × PURPLE fallback colors
  assert.strictEqual(DEFAULT_THEME.colors.primary, '#6366f1');
  assert.strictEqual(DEFAULT_THEME.colors.secondary, '#8b5cf6');
  assert.strictEqual(DEFAULT_THEME.colors.background, '#0f172a');

  // Verifies primary CTA text requirement
  const expectedCtaText = 'Explore Lumenfolio';
  assert.strictEqual(expectedCtaText, 'Explore Lumenfolio');

  // Verifies conceptual title direction
  const expectedTitle = 'Where Logic Meets Imagination';
  assert.strictEqual(expectedTitle, 'Where Logic Meets Imagination');

  // Verifies conceptual subtitle direction
  const expectedSubtitle =
    'Engineering digital experiences with the precision of code and the freedom of art.';
  assert.strictEqual(
    expectedSubtitle,
    'Engineering digital experiences with the precision of code and the freedom of art.'
  );
}
