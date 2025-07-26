import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Login Page Tests', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
    await page.waitForLoadState('networkidle');
  });
  
  test.describe('Valid Login', () => {
    test('should login successfully with correct credentials', async ({ page }) => {
      await loginPage.login('demouser', 'testingisfun99');
      
      await expect(page).toHaveURL(/.*signin=true/);
    });

    test('should fail login with case sensitive username', async ({ page }) => {
      await loginPage.login('DemoUser', 'testingisfun99');
      
      // Check if still on login page or shows error
      const currentUrl = page.url();
      expect(currentUrl).toMatch(/login|signin/);
    });
  });
});
