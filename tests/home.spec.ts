import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

test.describe('Home Page Tests', () => {
  test('should load homepage successfully', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    
    await expect(page).toHaveTitle(/testathon/i);
    await expect(homePage.heroSection).toBeVisible();
  });

  test('should navigate through main sections', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    
    await expect(homePage.navigationMenu).toBeVisible();
    // Add more navigation tests based on actual site structure
  });
});