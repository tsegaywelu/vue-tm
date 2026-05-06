import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should display the login form', async ({ page }) => {
    await expect(page.locator('h2')).toContainText('Welcome Back');
    await expect(page.locator('input[name="username"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('button:has-text("Sign In")')).toBeVisible();
  });

  test('should show error on invalid login', async ({ page }) => {
    await page.fill('input[name="username"]', 'wronguser');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button:has-text("Sign In")');

    // Wait for the error message to appear
    const errorMsg = page.locator('.bg-red-50 p');
    await expect(errorMsg).toBeVisible();
  });

  test('should toggle between Carrier and Shipper login modes', async ({ page }) => {
    const carrierBtn = page.locator('button:has-text("Carrier Login")');
    const shipperBtn = page.locator('button:has-text("Shipper Login")');

    await shipperBtn.click();
    await expect(shipperBtn).toHaveClass(/bg-white/);
    
    await carrierBtn.click();
    await expect(carrierBtn).toHaveClass(/bg-white/);
  });
});
