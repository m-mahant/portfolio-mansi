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

  // Regression test for a real bug: the CSP's connect-src/script-src only allowed the backend
  // API origin, so Firebase Auth's own requests (identitytoolkit.googleapis.com) and Vercel
  // Analytics' script were silently blocked — every admin login attempt failed with
  // "auth/network-request-failed" the moment CSP shipped.
  test('admin login reaches Firebase Auth without a CSP violation blocking it', async ({ page }) => {
    const cspViolations: string[] = [];
    page.on('console', (msg) => {
      if (msg.text().toLowerCase().includes('content security policy')) {
        cspViolations.push(msg.text());
      }
    });

    const authRequests: string[] = [];
    page.on('request', (req) => {
      if (req.url().includes('identitytoolkit.googleapis.com')) authRequests.push(req.url());
    });

    await page.goto('/admin/login');
    await page.fill('input[type="email"]', 'nobody@example.com');
    await page.fill('input[type="password"]', 'wrong-password-123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    expect(cspViolations, cspViolations.join('\n')).toHaveLength(0);
    expect(authRequests.length, 'expected a real request to identitytoolkit.googleapis.com').toBeGreaterThan(0);
  });

  // Regression test for a real bug: a global loading.tsx wrapped every route in an automatic
  // Suspense boundary, which committed a 200 status the instant navigation started — by the time
  // a dynamic detail page's own notFound() call resolved, the status could no longer change, so
  // an invalid slug rendered a real "Not Found" page under a 200 (a soft 404).
  test('an invalid slug on a dynamic detail route returns a real 404, not a soft 404', async ({ page }) => {
    const routes = [
      '/blog/this-slug-does-not-exist',
      '/work/development/this-slug-does-not-exist',
      '/work/art-crafts/this-slug-does-not-exist',
    ];

    for (const route of routes) {
      const response = await page.goto(route);
      expect(response?.status(), `${route} should return 404`).toBe(404);
    }
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
