import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DemoPage } from '../pages/DemoPage';

test.describe('Debug Checkout Process', () => {
  test('simple product add to cart test', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const demoPage = new DemoPage(page);

    // Login
    await loginPage.goto();
    await loginPage.login('demouser', 'testingisfun99');
    await page.waitForLoadState('networkidle');

    // Try the simplest approach - just add iPhone 12 Pro to cart
    console.log('Trying to add iPhone 12 Pro to cart...');

    try {
      await demoPage.addToCart('iPhone 12 Pro');
      console.log('Successfully added iPhone 12 Pro to cart!');

      // Wait for any modal or response
      await page.waitForTimeout(3000);

      // Take screenshot to see what happened
      await page.screenshot({ path: 'debug-after-simple-add.png', fullPage: true });

      // Check if there's a checkout button visible
      const checkoutBtn = page.locator('button:has-text("CHECKOUT")');
      if (await checkoutBtn.isVisible()) {
        console.log('Checkout button found, clicking...');
        await checkoutBtn.click();
        await page.waitForTimeout(2000);
        console.log('Current URL after checkout click:', page.url());
      } else {
        console.log('No checkout button found');
      }

    } catch (error) {
      console.log('Error adding to cart:', error);
      await page.screenshot({ path: 'debug-error.png', fullPage: true });
    }
  });
});
