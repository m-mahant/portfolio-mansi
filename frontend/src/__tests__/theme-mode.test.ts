import { test, describe } from 'node:test';
import assert from 'node:assert';
import {
  getSystemThemeMode,
  resolveActiveThemeMode,
  DEFAULT_THEME,
  DEFAULT_LIGHT_COLORS,
  DEFAULT_DARK_COLORS,
} from '../context/theme-runtime';

describe('Phase 9B — Client-Side Theme Mode Preference Unit Tests', () => {
  test('getSystemThemeMode should return dark as fallback in SSR environment', () => {
    const mode = getSystemThemeMode();
    assert.strictEqual(mode, 'dark');
  });

  test('resolveActiveThemeMode should resolve explicit light and dark preferences', () => {
    assert.strictEqual(resolveActiveThemeMode('light'), 'light');
    assert.strictEqual(resolveActiveThemeMode('dark'), 'dark');
  });

  test('resolveActiveThemeMode should resolve null preference (system default) using fallback in test runner', () => {
    const systemMode = resolveActiveThemeMode(null);
    assert.strictEqual(systemMode, 'dark');
  });

  test('DEFAULT_THEME contains valid lightColors and darkColors palettes', () => {
    assert.ok(DEFAULT_THEME.lightColors);
    assert.ok(DEFAULT_THEME.darkColors);
    assert.strictEqual(DEFAULT_THEME.lightColors.primary, DEFAULT_LIGHT_COLORS.primary);
    assert.strictEqual(DEFAULT_THEME.darkColors.primary, DEFAULT_DARK_COLORS.primary);
  });
});
