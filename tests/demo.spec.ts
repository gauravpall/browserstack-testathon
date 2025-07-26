import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { DemoPage } from "../pages/DemoPage";
import { CartPage } from "../pages/CartPage";
import { CheckoutPage } from "../pages/CheckoutPage";

test.describe("DEMO Page Tests", () => {
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
    await loginPage.login("demouser", "testingisfun99");
    await page.waitForLoadState("networkidle");
  });

  test.describe("Product Display", () => {
    test("should display all iPhone models", async ({ page }) => {
      const expectedProducts = [
        "iPhone 11",
        "iPhone 12",
        "iPhone 12 Mini",
        "iPhone 12 Pro",
        "iPhone 12 Pro Max",
        "iPhone XS",
        "iPhone XR",
        "iPhone 11 Pro",
        "iPhone XS Max",
      ];

      for (const product of expectedProducts) {
        await expect(await demoPage.getProduct(product)).toBeVisible();
      }
    });

    test("should show correct products count", async ({ page }) => {
      const count = await demoPage.getProductsCount();
      expect(count).toBe(25);

      await expect(demoPage.productsFoundText).toContainText(
        "25 Product(s) found"
      );
    });

    test("should display both iPhone and Samsung products", async ({
      page,
    }) => {
      const allTitles = await demoPage.getAllProductTitles();

      const iPhoneProducts = allTitles.filter((title) =>
        title.includes("iPhone")
      );
      const samsungProducts = allTitles.filter((title) =>
        title.includes("Galaxy")
      );

      expect(iPhoneProducts.length).toBeGreaterThan(0);
      expect(samsungProducts.length).toBeGreaterThan(0);
    });
  });

  test.describe("Add to Cart Functionality", () => {
    test("should add single product to cart", async ({ page }) => {
      await demoPage.addToCart("iPhone 12");

      // Wait for cart update and verify
      await page.waitForTimeout(1000);
      const cartCount = await demoPage.getCartItemCount();
      expect(cartCount).toBe("1");
    });
  });

  test.describe("Complete Checkout Process", () => {
    test("should complete full checkout process for iPhone 12", async ({
      page,
    }) => {
      // Step 1: Add iPhone 12 to cart
      await demoPage.addToCart("iPhone 12");

      // Step 2: Wait for cart modal to appear and verify content
      await cartPage.waitForCartModal();
      await cartPage.verifyCartModalContent("iPhone 12", "$799.00");

      // Step 3: Proceed to checkout from modal
      await cartPage.proceedToCheckout();

      // Step 4: Verify we're on checkout page
      await expect(page).toHaveURL(/.*checkout/);

      // Step 5: Verify order summary on checkout page
      await checkoutPage.verifyOrderSummary("iPhone 12", "$799.00", "1");

      // Step 6: Fill shipping address
      const shippingInfo = {
        firstName: "John",
        lastName: "Doe",
        address: "123 Test Street",
        stateProvince: "California",
        postalCode: "90210",
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
      expect(successText).toContain("Your Order has been successfully placed");

      console.log(
        `Order completed successfully with order number: ${orderNumber}`
      );
    });

    test("should complete checkout with iPhone 12", async ({ page }) => {
      // Test with iPhone 12 - simple single product test
      await demoPage.addToCart("iPhone 12");

      // Wait for cart modal to appear
      await cartPage.waitForCartModal();

      // Verify cart modal content
      await cartPage.verifyCartModalContent("iPhone 12", "$799.00");

      // Proceed to checkout
      await cartPage.proceedToCheckout();

      // Verify we're on checkout page
      await expect(page).toHaveURL(/.*checkout/);

      // Fill shipping info
      const shippingInfo = {
        firstName: "John",
        lastName: "Doe",
        address: "123 Test Street",
        stateProvince: "California",
        postalCode: "90210",
      };

      // Complete checkout
      await checkoutPage.fillShippingAddress(shippingInfo);
      await checkoutPage.submitOrder();

      // Verify success
      await checkoutPage.verifySuccessPage();
      const orderNumber = await checkoutPage.getOrderNumber();
      expect(orderNumber).toBeTruthy();

      console.log(`Order completed with order number: ${orderNumber}`);
    });
  });
});
