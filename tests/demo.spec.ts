import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DemoPage } from '../pages/DemoPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

test.describe('DEMO Page Tests', () => {
  let loginPage: LoginPage;
  let demoPage: DemoPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    demoPage = new DemoPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);

    // Login before each test
    await loginPage.goto();
    await loginPage.login('demouser', 'testingisfun99');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Product Display', () => {
    test('should display all iPhone models', async ({ page }) => {
      const expectedProducts = [
        'iPhone 11', 'iPhone 12', 'iPhone 12 Mini', 
        'iPhone 12 Pro', 'iPhone 12 Pro Max', 
        'iPhone XS', 'iPhone XR', 'iPhone 11 Pro', 'iPhone XS Max'
      ];
      
      for (const product of expectedProducts) {
        await expect(await demoPage.getProduct(product)).toBeVisible();
      }
    });

    test('should show correct products count', async ({ page }) => {
      const count = await demoPage.getProductsCount();
      expect(count).toBe(25);
      
      await expect(demoPage.productsFoundText).toContainText('25 Product(s) found');
    });

    test('should display both iPhone and Samsung products', async ({ page }) => {
      const allTitles = await demoPage.getAllProductTitles();
      
      const iPhoneProducts = allTitles.filter(title => title.includes('iPhone'));
      const samsungProducts = allTitles.filter(title => title.includes('Galaxy'));
      
      expect(iPhoneProducts.length).toBeGreaterThan(0);
      expect(samsungProducts.length).toBeGreaterThan(0);
    });

  // test.describe('Add to Cart Functionality', () => {
  //   test('should add single product to cart', async ({ page }) => {
  //     await demoPage.addToCart('iPhone 12 Pro');
      
  //     // Wait for cart update and verify
  //     await page.waitForTimeout(1000);
  //     const cartCount = await demoPage.getCartItemCount();
  //     expect(cartCount).toBe('1');
  //   });

  //   test('should add multiple different products to cart', async ({ page }) => {
  //     await demoPage.addToCart('iPhone 12 Pro');
  //     await page.waitForTimeout(500);
  //     await demoPage.addToCart('iPhone 12 Pro Max');
  //     await page.waitForTimeout(500);
      
  //     const cartCount = await demoPage.getCartItemCount();
  //     expect(cartCount).toBe('2');
  //   });

  //   test('should increment quantity for duplicate products', async ({ page }) => {
  //     await demoPage.addToCart('iPhone 12 Pro');
  //     await page.waitForTimeout(500);
  //     await demoPage.addToCart('iPhone 12 Pro');
  //     await page.waitForTimeout(500);
      
  //     const cartCount = await demoPage.getCartItemCount();
  //     expect(cartCount).toBe('2');
  //   });
  // });

  // test.describe('Price Verification', () => {
  //   test('should verify iPhone 12 Pro price and installment', async ({ page }) => {
  //     const details = await demoPage.verifyProductDetails(
  //       'iPhone 12 Pro', 
  //       '$999.00', 
  //       '5 x $ 199.80'
  //     );
      
  //     expect(details.priceMatch).toBeTruthy();
  //     expect(details.installmentMatch).toBeTruthy();
      
  //     // Verify calculation: 5 x 199.80 = 999.00
  //     const calculation = 5 * 199.80;
  //     expect(calculation).toBe(999.00);
  //   });

  //   test('should verify iPhone 12 price and installment', async ({ page }) => {
  //     const details = await demoPage.verifyProductDetails(
  //       'iPhone 12', 
  //       '$799.00', 
  //       '9 x $ 88.78'
  //     );
      
  //     expect(details.priceMatch).toBeTruthy();
  //     expect(details.installmentMatch).toBeTruthy();
  //   });

  //   test('should verify Galaxy S20 Ultra price', async ({ page }) => {
  //     const details = await demoPage.verifyProductDetails(
  //       'Galaxy S20 Ultra', 
  //       '$1399.00', 
  //       '12 x $ 116.58'
  //     );
      
  //     expect(details.priceMatch).toBeTruthy();
  //     expect(details.installmentMatch).toBeTruthy();
  //   });
  // });

  // test.describe('Wishlist Functionality', () => {
  //   test('should add product to wishlist', async ({ page }) => {
  //     await demoPage.addToWishlist('iPhone 12 Pro');
      
  //     // Verify heart icon is clicked (you may need to check for visual changes)
  //     const product = await demoPage.getProduct('iPhone 12 Pro');
  //     const heartButton = product.locator('.shelf-stopper button');
  //     await expect(heartButton).toBeVisible();
  //   });
  // });

  // test.describe('Cart Page Navigation', () => {
  //   test('should navigate to cart with items', async ({ page }) => {
  //     await demoPage.addToCart('iPhone 12 Pro');
  //     await page.waitForTimeout(1000);
  //     await demoPage.clickCart();
      
  //     await expect(page).toHaveURL(/.*cart/);
  //   });

  //   test('should show empty cart when no items', async ({ page }) => {
  //     await demoPage.clickCart();
      
  //     await expect(page).toHaveURL(/.*cart/);
  //     await expect(cartPage.emptyCartMessage).toBeVisible();
  //   });
  // });

  // test.describe('Edge Cases', () => {
  //   test('should handle product interaction', async ({ page }) => {
  //     // Test clicking on product image/title
  //     const product = await demoPage.getProduct('iPhone 12 Pro');
  //     const productTitle = product.locator('.shelf-item__title');
      
  //     await expect(productTitle).toBeVisible();
  //     await expect(productTitle).toContainText('iPhone 12 Pro');
  //   });

  //   test('should verify all products have required elements', async ({ page }) => {
  //     const products = await demoPage.getAllProducts();
      
  //     for (const product of products.slice(0, 5)) { // Test first 5 products
  //       await expect(product.locator('.shelf-item__title')).toBeVisible();
  //       await expect(product.locator('.shelf-item__price')).toBeVisible();
  //       await expect(product.locator('.shelf-item__buy-btn')).toBeVisible();
  //       await expect(product.locator('.shelf-item__thumb img')).toBeVisible();
  //     }
  //   });

  //   test('should retain cart on page refresh', async ({ page }) => {
  //     await demoPage.addToCart('iPhone 12 Pro');
  //     await page.waitForTimeout(1000);
      
  //     const cartCountBefore = await demoPage.getCartItemCount();
      
  //     await page.reload();
  //     await page.waitForLoadState('networkidle');
      
  //     const cartCountAfter = await demoPage.getCartItemCount();
  //     expect(cartCountAfter).toBe(cartCountBefore);
  //   });
  });

  test.describe('Complete Checkout Process', () => {
    test('should complete full checkout process for iPhone 12', async ({ page }) => {
      // Step 1: Add iPhone 12 to cart
      await demoPage.addToCart('iPhone 12');

      // Step 2: Wait for cart modal to appear and verify content
      await cartPage.waitForCartModal();
      await cartPage.verifyCartModalContent('iPhone 12', '$799.00');

      // Step 3: Proceed to checkout from modal
      await cartPage.proceedToCheckout();

      // Step 4: Verify we're on checkout page
      await expect(page).toHaveURL(/.*checkout/);

      // Step 5: Verify order summary on checkout page
      await checkoutPage.verifyOrderSummary('iPhone 12', '$799.00', '1');

      // Step 6: Fill shipping address
      const shippingInfo = {
        firstName: 'John',
        lastName: 'Doe',
        address: '123 Test Street',
        stateProvince: 'California',
        postalCode: '90210'
      };

      await checkoutPage.fillShippingAddress(shippingInfo);

      // Step 7: Submit the order
      await checkoutPage.submitOrder();

      // Step 8: Verify success page
      await checkoutPage.verifySuccessPage();

      // Step 9: Get and verify order number
      const orderNumber = await checkoutPage.getOrderNumber();
      expect(orderNumber).toBeTruthy();
      expect(parseInt(orderNumber)).toBeGreaterThan(0);

      // Step 10: Verify success message contains expected text
      const successText = await checkoutPage.successMessage.textContent();
      expect(successText).toContain('Your Order has been successfully placed');

      console.log(`Order completed successfully with order number: ${orderNumber}`);
    });

    test('should complete checkout with different product and shipping info', async ({ page }) => {
      // Test with iPhone 12 Pro
      await demoPage.addToCart('iPhone 12 Pro');

      await cartPage.waitForCartModal();
      await cartPage.proceedToCheckout();

      await expect(page).toHaveURL(/.*checkout/);

      const shippingInfo = {
        firstName: 'Jane',
        lastName: 'Smith',
        address: '456 Demo Avenue',
        stateProvince: 'New York',
        postalCode: '10001'
      };

      const orderNumber = await checkoutPage.completeCheckoutProcess(shippingInfo);
      expect(orderNumber).toBeTruthy();

      console.log(`Second order completed with order number: ${orderNumber}`);
    });
  });
});
