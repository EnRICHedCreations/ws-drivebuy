import { test, expect } from '@playwright/test';

test('user can tag a property', async ({ page }) => {
  await page.goto('http://localhost:5173');
  
  // Login
  await page.fill('input[type="email"]', 'test@example.com');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');
  
  // Wait for map to load
  await page.waitForSelector('.map-container');
  
  // Click tag button
  await page.click('button:has-text("Tag Property")');
  
  // Fill form
  await page.selectOption('select', 'sfh');
  await page.fill('textarea', 'Test property');
  await page.click('button:has-text("Save Lead")');
  
  // Verify lead appears in sidebar
  await expect(page.locator('.lead-card')).toHaveCount(1);
});
