import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DemoPage } from '../pages/DemoPage';

test.describe('Cross-Functional Scenarios', () => {
  test('should retain cart after logout and re-login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const demoPage = new DemoPage(page);
    
    // Step 1: Login
    await loginPage.goto();
    await loginPage.login('demouser', 'testingisfun99');
    
    // Step 2: Add item to cart
    await demoPage.addToCart('iPhone 12 Pro');
    await expect(demoPage.cartCount).toHaveText('1');
    
    // Step 3: Logout
    await page.locator('text=Logout, .logout').click();
    
    // Step 4: Login again
    await loginPage.login('demouser', 'testingisfun99');
    
    // Expected: Cart retains item
    await expect(demoPage.cartCount).toHaveText('1');
  });

  test('should handle network interruption during checkout', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const demoPage = new DemoPage(page);
    
    await loginPage.goto();
    await loginPage.login('demouser', 'testingisfun99');
    await demoPage.addToCart('iPhone 12 Pro');
    await demoPage.clickCart();
    
    // Simulate network interruption
    await page.route('**/checkout', route => route.abort());
    
    await page.locator('text=Checkout').click();
    
    await expect(page.locator('text=Network error. Please try again')).toBeVisible();
  });

  test('should handle concurrent user access', async ({ browser }) => {
    // Create two browser contexts to simulate different devices
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();
    
    const page1 = await context1.newPage();
    const page2 = await context2.newPage();
    
    const loginPage1 = new LoginPage(page1);
    const loginPage2 = new LoginPage(page2);
    const demoPage1 = new DemoPage(page1);
    const demoPage2 = new DemoPage(page2);
    
    // Login on both devices
    await loginPage1.goto();
    await loginPage1.login('demouser', 'testingisfun99');
    
    await loginPage2.goto();
    await loginPage2.login('demouser', 'testingisfun99');
    
    // Add different products on each device
    await demoPage1.addToCart('iPhone 12 Pro');
    await demoPage2.addToCart('iPhone 12 Pro Max');
    
    // Refresh both pages to check sync
    await page1.reload();
    await page2.reload();
    
    // Expected: Cart syncs or shows conflict message
    const cart1Count = await demoPage1.getCartItemCount();
    const cart2Count = await demoPage2.getCartItemCount();
    
    expect(cart1Count).toBe(cart2Count); // Should be synced
    
    await context1.close();
    await context2.close();
  });
});