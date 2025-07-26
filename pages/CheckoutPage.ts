import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
  // Shipping Address Form Elements using XPath with text
  readonly firstNameField: Locator;
  readonly lastNameField: Locator;
  readonly addressField: Locator;
  readonly stateProvinceField: Locator;
  readonly postalCodeField: Locator;
  readonly submitButton: Locator;
  
  // Order Summary Elements
  readonly orderSummary: Locator;
  readonly orderTotal: Locator;
  readonly itemCount: Locator;
  
  // Success Page Elements
  readonly successMessage: Locator;
  readonly orderNumber: Locator;
  readonly downloadReceiptLink: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    super(page);
    
    // Form fields using simple selectors and labels
    this.firstNameField = page.locator('input[placeholder*="First"], input[name*="first"], input[id*="first"]').first();
    this.lastNameField = page.locator('input[placeholder*="Last"], input[name*="last"], input[id*="last"]').first();
    this.addressField = page.locator('input[placeholder*="Address"], input[name*="address"], input[id*="address"]').first();
    this.stateProvinceField = page.locator('input[placeholder*="State"], input[name*="state"], input[id*="state"]').first();
    this.postalCodeField = page.locator('input[placeholder*="Postal"], input[name*="postal"], input[id*="postal"], input[placeholder*="Zip"], input[name*="zip"]').first();

    // Submit button using simple text selector
    this.submitButton = page.locator('button:has-text("SUBMIT")');

    // Order Summary using simple text selectors
    this.orderSummary = page.locator('text=Order Summary');
    this.orderTotal = page.locator('text=Total (USD)');
    this.itemCount = page.locator('text=item(s)');

    // Success page elements using simple text selectors
    this.successMessage = page.locator('text=Your Order has been successfully placed');
    this.orderNumber = page.locator('text=Your order number is');
    this.downloadReceiptLink = page.locator('text=Download order receipt');
    this.continueShoppingButton = page.locator('text=CONTINUE SHOPPING');
  }

  async goto() {
    await this.page.goto('/checkout');
  }

  async fillShippingAddress(shippingInfo: {
    firstName: string;
    lastName: string;
    address: string;
    stateProvince: string;
    postalCode: string;
  }) {
    await this.firstNameField.fill(shippingInfo.firstName);
    await this.lastNameField.fill(shippingInfo.lastName);
    await this.addressField.fill(shippingInfo.address);
    await this.stateProvinceField.fill(shippingInfo.stateProvince);
    await this.postalCodeField.fill(shippingInfo.postalCode);
  }

  async submitOrder() {
    await this.submitButton.click();
  }

  async verifyOrderSummary(expectedProduct: string, expectedPrice: string, expectedItemCount: string) {
    // Verify order summary is visible
    await expect(this.orderSummary).toBeVisible();

    // Verify product in order summary using simple text locator
    const productInSummary = this.page.locator(`text=${expectedProduct}`);
    await expect(productInSummary).toBeVisible();

    // Verify total price using simple text locator
    const totalPrice = this.page.locator(`text=${expectedPrice}`);
    await expect(totalPrice).toBeVisible();

    // Verify item count
    const itemCount = this.page.locator(`text=${expectedItemCount} item(s)`);
    await expect(itemCount).toBeVisible();
  }

  async verifySuccessPage() {
    // Wait for success message
    await expect(this.successMessage).toBeVisible({ timeout: 10000 });
    
    // Verify order number is displayed
    await expect(this.orderNumber).toBeVisible();
    
    // Verify download receipt link
    await expect(this.downloadReceiptLink).toBeVisible();
    
    // Verify continue shopping button
    await expect(this.continueShoppingButton).toBeVisible();
  }

  async getOrderNumber() {
    const orderText = await this.orderNumber.textContent();
    return orderText?.match(/\d+/)?.[0] || '';
  }

  async downloadReceipt() {
    await this.downloadReceiptLink.click();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }

  async completeCheckoutProcess(shippingInfo: {
    firstName: string;
    lastName: string;
    address: string;
    stateProvince: string;
    postalCode: string;
  }) {
    // Fill shipping address
    await this.fillShippingAddress(shippingInfo);
    
    // Submit the order
    await this.submitOrder();
    
    // Wait for success page
    await this.verifySuccessPage();
    
    // Return order number
    return await this.getOrderNumber();
  }
}
