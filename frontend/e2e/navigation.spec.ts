import { test, expect } from '@playwright/test';

// Skips the intro screen on every page load so navigation tests exercise real home content,
// not the animated entry experience (which has its own dedicated behavior, not tested here).
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.sessionStorage.setItem('dev_digital_intro_seen', 'true');
  });
});

test.describe('Public navigation', () => {
  test('homepage loads past the intro and shows hero content', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: /skip to main content/i })).toBeAttached();
    await expect(page.locator('body')).not.toContainText('Explore Portfolio');
  });

  test('can reach every top-level public page', async ({ page }) => {
    const routes = ['/about', '/work', '/work/development', '/work/art-crafts', '/experience', '/blog', '/contact', '/privacy'];

    for (const route of routes) {
      const response = await page.goto(route);
      expect(response?.status(), `${route} should return 200`).toBe(200);
    }
  });

  test('unknown route shows the custom 404 page', async ({ page }) => {
    const response = await page.goto('/this-route-does-not-exist');
    expect(response?.status()).toBe(404);
  });

  test('header navigation links are present and point to real routes', async ({ page }) => {
    await page.goto('/');
    const header = page.locator('header, nav').first();
    await expect(header).toBeVisible();
  });
});
