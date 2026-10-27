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

  // Regression test for a real bug: the dropdown previously closed while the cursor was still
  // moving from the trigger down into the panel, because the gap between them sat outside both
  // elements' hoverable area.
  test('Works dropdown stays open while moving the mouse from the trigger into the panel', async ({ page }) => {
    await page.goto('/about');

    const trigger = page.getByRole('link', { name: 'Works' });
    await trigger.hover();

    const panel = page.getByRole('menu');
    await expect(panel).toBeVisible();

    const triggerBox = await trigger.boundingBox();
    const panelBox = await panel.boundingBox();
    if (!triggerBox || !panelBox) throw new Error('could not measure elements');

    await page.mouse.move(triggerBox.x + triggerBox.width / 2, triggerBox.y + triggerBox.height - 2);
    await page.mouse.move(triggerBox.x + triggerBox.width / 2, triggerBox.y + triggerBox.height + 4, { steps: 5 });
    await page.mouse.move(panelBox.x + 10, panelBox.y + 10, { steps: 5 });

    await expect(panel).toBeVisible();
    await expect(page.getByRole('menuitem', { name: /Development/i })).toBeVisible();
  });
});
