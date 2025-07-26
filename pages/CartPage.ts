import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly cartItems: Locator;
  readonly emptyCartMessage: Locator;
  readonly totalPrice: Locator;
  readonly checkoutButton: Locator;

  // Cart Modal Elements (from screenshot 1)
  readonly cartModal: Locator;
  readonly cartModalCloseButton: Locator;
  readonly cartModalCheckoutButton: Locator;
  readonly cartModalSubtotal: Locator;
  readonly cartModalQuantity: Locator;

  constructor(page: Page) {
    super(page);
    this.cartItems = page.locator('.cart-item, [data-testid="cart-item"]');
    this.emptyCartMessage = page.locator('text=Your cart is empty');
    this.totalPrice = page.locator('.total-price, [data-testid="total"]');
    this.checkoutButton = page.getByRole('button', { name: /checkout/i });

    // Cart Modal locators using simple text and class selectors
    this.cartModal = page.locator('.bag, .cart-modal, [class*="bag"], [class*="cart"]');
    this.cartModalCloseButton = page.locator('button:has-text("×"), button[aria-label="Close"]');
    this.cartModalCheckoutButton = page.locator('button:has-text("CHECKOUT")');
    this.cartModalSubtotal = page.locator('text=SUBTOTAL');
    this.cartModalQuantity = page.locator('text=Quantity:');
  }

  async goto() {
    await this.page.goto('/cart');
  }

  async removeAllItems() {
    const removeButtons = await this.page.locator('.remove-item, [data-testid="remove"]').all();
    for (const button of removeButtons) {
      await button.click();
    }
  }

  async getCartItemsCount() {
    return await this.cartItems.count();
  }

  // Cart Modal Methods
  async waitForCartModal() {
    await this.cartModal.waitFor({ state: 'visible', timeout: 10000 });
  }

  async closeCartModal() {
    await this.cartModalCloseButton.click();
    await this.cartModal.waitFor({ state: 'hidden', timeout: 5000 });
  }

  async proceedToCheckout() {
    await this.cartModalCheckoutButton.click();
  }

  async getCartModalSubtotal() {
    const subtotalText = await this.cartModalSubtotal.textContent();
    return subtotalText?.replace(/[^\d.]/g, '') || '0';
  }

  async getCartModalQuantity() {
    const quantityText = await this.cartModalQuantity.textContent();
    return quantityText?.match(/\d+/)?.[0] || '0';
  }

  async verifyCartModalContent(expectedProduct: string, expectedPrice: string) {
    await this.waitForCartModal();

    // Verify product name using simple text locator
    const productName = this.page.locator(`text=${expectedProduct}`);
    await expect(productName).toBeVisible();

    // Verify price using simple text locator
    const price = this.page.locator(`text=${expectedPrice}`);
    await expect(price).toBeVisible();

    return true;
  }
}