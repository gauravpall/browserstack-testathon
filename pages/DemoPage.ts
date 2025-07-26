import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class DemoPage extends BasePage {
  readonly productContainer: Locator;
  readonly productItems: Locator;
  readonly productsFoundText: Locator;
  readonly cartIcon: Locator;
  readonly cartCount: Locator;

  // Cart Modal Elements (appears after adding to cart)
  readonly cartModal: Locator;
  readonly cartModalCheckoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.productContainer = page.locator('.shelf-container');
    this.productItems = page.locator('.shelf-item');
    this.productsFoundText = page.locator('.products-found span');
    // Cart locators - need to find these in the header/navigation
    this.cartIcon = page.locator('.cart-icon, [data-testid="cart"], .cart');
    this.cartCount = page.locator('.cart-count, [data-testid="cart-count"], .cart-badge');

    // Cart Modal locators using simple selectors
    this.cartModal = page.locator('.bag, .cart-modal, [class*="bag"], [class*="cart"]');
    this.cartModalCheckoutButton = page.locator('button:has-text("CHECKOUT")');
  }

  async goto() {
    await this.page.goto('/demo');
  }

  async getProduct(productName: string) {
    // Find the shelf-item container that contains the product title
    return this.page.locator(`.shelf-item:has(.shelf-item__title:text("${productName}"))`);
  }

  async getProductByTitle(productName: string) {
    return this.page.locator(`.shelf-item:has(.shelf-item__title:text("${productName}"))`);
  }

  async addToCart(productName: string) {
    // Find the shelf-item container, then click the Add to cart div
    const productContainer = this.page.locator(`.shelf-item:has(.shelf-item__title:text("${productName}"))`);
    const addToCartDiv = productContainer.locator('.shelf-item__buy-btn');
    await addToCartDiv.click();
  }

  async getProductPrice(productName: string) {
    // Find the shelf-item container, then get the price
    const productContainer = this.page.locator(`.shelf-item:has(.shelf-item__title:text("${productName}"))`);
    const priceElement = productContainer.locator('.shelf-item__price .val');
    return await priceElement.textContent();
  }

  async getProductInstallment(productName: string) {
    const product = await this.getProduct(productName);
    const installmentElement = product.locator('.shelf-item__price .installment');
    return await installmentElement.textContent();
  }

  async getCartItemCount() {
    return await this.cartCount.textContent();
  }

  async clickCart() {
    await this.cartIcon.click();
  }

  async getAllProducts() {
    return await this.productItems.all();
  }

  async getProductsCount() {
    const text = await this.productsFoundText.textContent();
    return parseInt(text?.match(/\d+/)?.[0] || '0');
  }

  async getAllProductTitles() {
    const titles = await this.page.locator('.shelf-item__title').allTextContents();
    return titles;
  }

  async isProductVisible(productName: string) {
    const product = await this.getProduct(productName);
    return await product.isVisible();
  }

  async addToWishlist(productName: string) {
    // Find the shelf-item container, then click the wishlist button
    const productContainer = this.page.locator(`.shelf-item:has(.shelf-item__title:text("${productName}"))`);
    const wishlistButton = productContainer.locator('.shelf-stopper button');
    await wishlistButton.click();
  }

  async getProductById(id: string) {
    return this.page.locator(`#${id}`);
  }

  // Cart Modal Methods
  async waitForCartModal() {
    await this.cartModal.waitFor({ state: 'visible', timeout: 10000 });
  }

  async proceedToCheckoutFromModal() {
    await this.cartModalCheckoutButton.click();
  }

  async addToCartAndProceedToCheckout(productName: string) {
    // Add product to cart
    await this.addToCart(productName);

    // Wait for cart modal to appear
    await this.waitForCartModal();

    // Click checkout button in modal
    await this.proceedToCheckoutFromModal();
  }

  async verifyProductDetails(productName: string, expectedPrice: string, expectedInstallment: string) {
    const product = await this.getProduct(productName);
    
    const actualPrice = await product.locator('.shelf-item__price .val').textContent();
    const actualInstallment = await product.locator('.shelf-item__price .installment').textContent();
    
    return {
      priceMatch: actualPrice?.includes(expectedPrice) || false,
      installmentMatch: actualInstallment?.includes(expectedInstallment) || false,
      actualPrice,
      actualInstallment
    };
  }
}

