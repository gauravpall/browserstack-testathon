import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { DemoPage } from "../pages/DemoPage";
import { CartPage } from "../pages/CartPage";
import { CheckoutPage } from "../pages/CheckoutPage";
import { TestData } from "../utils/TestData";

test.describe("Multi-User Regression Test Suite", () => {
  let loginPage: LoginPage;
  let demoPage: DemoPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    demoPage = new DemoPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
  });

  // Helper function to verify successful login
  async function verifyLoginSuccess(page: any, username: string) {
    await expect(page).toHaveURL(/.*signin=true/);
  }

  test.describe("CRITICAL: Multi-User Authentication Tests", () => {
    test("should handle login for demouser", async ({ page }) => {
      await test.step("Navigate to login page", async () => {
        await loginPage.goto();
      });

      await test.step("Login as demouser", async () => {
        await loginPage.login(TestData.users.demouser.username, TestData.users.demouser.password);
        await verifyLoginSuccess(page, TestData.users.demouser.username);
        console.log("✅ demouser login successful");
      });
    });
  });

  test.describe("CRITICAL: Core Product Display Tests", () => {
    test("should display all iPhone models for demouser", async ({ page }) => {
      await test.step("Login as demouser", async () => {
        await loginPage.goto();
        await loginPage.login(TestData.users.demouser.username, TestData.users.demouser.password);
        await verifyLoginSuccess(page, TestData.users.demouser.username);
      });

      await test.step("Verify all iPhone models are displayed", async () => {
        const expectedProducts = [
          "iPhone 11", "iPhone 12", "iPhone 12 Mini", "iPhone 12 Pro",
          "iPhone 12 Pro Max", "iPhone XS", "iPhone XR", "iPhone 11 Pro", "iPhone XS Max"
        ];

        for (const product of expectedProducts) {
          await expect(await demoPage.getProduct(product)).toBeVisible();
        }
      });
    });
  });

  test.describe("HIGH: Multi-User Cart Functionality Tests", () => {
    test("should add single product to cart for demouser", async ({ page }) => {
      await test.step("Login as demouser", async () => {
        await loginPage.goto();
        await loginPage.login(TestData.users.demouser.username, TestData.users.demouser.password);
        await verifyLoginSuccess(page, TestData.users.demouser.username);
      });

      await test.step("Add product to cart and verify", async () => {
        await demoPage.addToCart(TestData.products.iphone12.name);
        await page.waitForTimeout(1000);
        const cartCount = await demoPage.getCartItemCount();
        expect(cartCount).toBe("1");
      });
    });
  });

  test.describe("CRITICAL: Multi-User Checkout Process Tests", () => {
    test("should complete full checkout process for demouser", async ({ page }) => {
      await test.step("Login as demouser", async () => {
        await loginPage.goto();
        await loginPage.login(TestData.users.demouser.username, TestData.users.demouser.password);
        await verifyLoginSuccess(page, TestData.users.demouser.username);
      });

      await test.step("Add iPhone 12 to cart", async () => {
        await demoPage.addToCart(TestData.products.iphone12.name);
      });

      await test.step("Verify cart modal and proceed to checkout", async () => {
        await cartPage.waitForCartModal();
        await cartPage.verifyCartModalContent(TestData.products.iphone12.name, TestData.products.iphone12.price);
        await cartPage.proceedToCheckout();
      });

      await test.step("Fill shipping information", async () => {
        await expect(page).toHaveURL(/.*checkout/);
        const shippingInfo = {
          firstName: "John",
          lastName: "Doe",
          address: "123 Test Street",
          stateProvince: "California",
          postalCode: "90210"
        };
        await checkoutPage.fillShippingAddress(shippingInfo);
      });

      await test.step("Submit order and verify success", async () => {
        await checkoutPage.submitOrder();
        await checkoutPage.verifySuccessPage();
        const orderNumber = await checkoutPage.getOrderNumber();
        expect(orderNumber).toBeTruthy();
        expect(parseInt(orderNumber)).toBeGreaterThan(0);
        console.log(`✅ demouser: Order completed with order number: ${orderNumber}`);
      });
    });
  });
});
