import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly cartItems: Locator;
  readonly emptyCartMessage: Locator;
  readonly totalPrice: Locator;
  readonly checkoutButton: Locator;

  // Cart Modal Elements (based on actual DOM structure)
  readonly cartModal: Locator;
  readonly cartModalCloseButton: Locator;
  readonly cartModalCheckoutButton: Locator;
  readonly cartModalSubtotal: Locator;
  readonly cartModalQuantity: Locator;
  readonly cartModalProductTitle: Locator;
  readonly cartModalProductPrice: Locator;

  constructor(page: Page) {
    super(page);
    this.cartItems = page.locator('.cart-item, [data-testid="cart-item"]');
    this.emptyCartMessage = page.locator('text=Your cart is empty');
    this.totalPrice = page.locator('.total-price, [data-testid="total"]');
    this.checkoutButton = page.getByRole('button', { name: /checkout/i });

    // Cart Modal locators based on actual DOM structure
    this.cartModal = page.locator('.float-cart.float-cart--open');
    this.cartModalCloseButton = page.locator('.float-cart__close-btn');
    this.cartModalCheckoutButton = page.locator('.float-cart__footer .buy-btn');
    this.cartModalSubtotal = page.locator('.float-cart__footer .sub');
    this.cartModalQuantity = page.locator('.bag__quantity');
    this.cartModalProductTitle = page.locator('.float-cart__shelf-container .title');
    this.cartModalProductPrice = page.locator('.float-cart__shelf-container .shelf-item__price p');
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
    const subtotalElement = this.page.locator('.sub-price__val');
    const subtotalText = await subtotalElement.textContent();
    return subtotalText?.replace(/[^\d.]/g, '') || '0';
  }

  async getCartModalQuantity() {
    const quantityText = await this.cartModalQuantity.textContent();
    return quantityText?.trim() || '0';
  }

  async verifyCartModalContent(expectedProduct: string, expectedPrice: string) {
    await this.waitForCartModal();

    // Verify product name in cart modal
    await expect(this.cartModalProductTitle).toHaveText(expectedProduct);

    // Verify price in cart modal (normalize both prices by removing all spaces and special characters)
    const itemPrice = this.cartModalProductPrice;
    const actualPrice = await itemPrice.textContent();

    // Normalize prices: remove all spaces, keep only digits, dots, and dollar signs
    const normalizePrice = (price: string) => price.replace(/\s+/g, '').replace(/\$\s*/g, '$');

    const normalizedActual = normalizePrice(actualPrice || '');
    const normalizedExpected = normalizePrice(expectedPrice);

    expect(normalizedActual).toContain(normalizedExpected);

    return true;
  }

  async getCartModalProductName() {
    return await this.cartModalProductTitle.textContent();
  }

  async getCartModalProductPrice() {
    return await this.cartModalProductPrice.textContent();
  }
}