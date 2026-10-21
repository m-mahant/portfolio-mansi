import { test, expect } from '@playwright/test';

// Only tests paths that fail safely: client-side validation, and a real (but
// deliberately wrong) Firebase Auth attempt. Never attempts a real successful login —
// that would need a dedicated test admin account this suite doesn't have.

test.beforeEach(async ({ page }) => {
  await page.goto('/admin/login');
});

test.describe('Admin login', () => {
  test('renders the login form', async ({ page }) => {
    await expect(page.getByLabel('Administrator Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in to cms/i })).toBeVisible();
  });

  test('rejects an invalid credential attempt and stays on the login page', async ({ page }) => {
    await page.getByLabel('Administrator Email').fill('not-a-real-admin@example.com');
    await page.getByLabel('Password').fill('definitely-wrong-password');
    await page.getByRole('button', { name: /sign in to cms/i }).click();

    // Real Firebase Auth call that fails safely — no account exists with this email.
    await expect(page).toHaveURL(/\/admin\/login/);
    await expect(page.getByRole('button', { name: /sign in to cms/i })).toBeEnabled({ timeout: 10000 });
  });
});
