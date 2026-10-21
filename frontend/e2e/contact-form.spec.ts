import { test, expect } from '@playwright/test';

// All submission tests intercept POST /api/v1/contact instead of hitting the real backend —
// the real endpoint writes to production Firestore and sends a real email per submission
// (see backend/tests/contact.test.ts and the NODE_ENV=test guard in email.service.ts for why
// that matters). These tests exercise the form's own validation, loading, and feedback UI.

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.sessionStorage.setItem('dev_digital_intro_seen', 'true');
  });
  await page.goto('/contact');
});

test.describe('Contact form', () => {
  test('shows validation errors when submitted empty', async ({ page }) => {
    await page.getByRole('button', { name: /send message/i }).click();
    await expect(page.getByText('Full name is required')).toBeVisible();
    await expect(page.getByText('Email address is required')).toBeVisible();
    await expect(page.getByText('Subject is required')).toBeVisible();
    await expect(page.getByText('Message is required')).toBeVisible();
  });

  test('rejects an invalid email format', async ({ page }) => {
    await page.locator('#contact-name').fill('Test Visitor');
    await page.locator('#contact-email').fill('not-an-email');
    await page.locator('#contact-subject').fill('Hello');
    await page.locator('#contact-message').fill('A message long enough to pass validation.');
    await page.getByRole('button', { name: /send message/i }).click();
    await expect(page.getByText('Please enter a valid email address')).toBeVisible();
  });

  test('honeypot field is positioned off-screen, not display:none (deliberate — see contact-form.tsx)', async ({ page }) => {
    const box = await page.locator('#contact-website').boundingBox();
    expect(box?.x).toBeLessThan(0);
  });

  test('shows a success message after a valid submission (network mocked)', async ({ page }) => {
    await page.route('**/api/v1/contact', async (route) => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: { message: 'Message sent successfully.' } }),
      });
    });

    await page.locator('#contact-name').fill('Test Visitor');
    await page.locator('#contact-email').fill('visitor@example.com');
    await page.locator('#contact-subject').fill('Project inquiry');
    await page.locator('#contact-message').fill('A message long enough to pass validation.');
    await page.getByRole('button', { name: /send message/i }).click();

    await expect(page.getByText('Message Delivered Successfully')).toBeVisible();
  });

  test('shows a server error message when submission fails (network mocked)', async ({ page }) => {
    await page.route('**/api/v1/contact', async (route) => {
      await route.fulfill({
        status: 429,
        contentType: 'application/json',
        body: JSON.stringify({ success: false, error: { message: 'Too many contact submissions. Please try again later.' } }),
      });
    });

    await page.locator('#contact-name').fill('Test Visitor');
    await page.locator('#contact-email').fill('visitor@example.com');
    await page.locator('#contact-subject').fill('Project inquiry');
    await page.locator('#contact-message').fill('A message long enough to pass validation.');
    await page.getByRole('button', { name: /send message/i }).click();

    await expect(page.getByText(/too many contact submissions/i)).toBeVisible();
  });
});
