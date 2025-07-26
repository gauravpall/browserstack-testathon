import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

test.describe('Home Page Tests', () => {
  test('should load homepage successfully', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();
  });
});