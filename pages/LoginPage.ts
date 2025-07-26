import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly usernameField: Locator;
  readonly passwordField: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly usernameDropdown: Locator;
  readonly passwordDropdown: Locator;

  constructor(page: Page) {
    super(page);
    // React Select dropdowns
    this.usernameDropdown = page.locator('#username');
    this.passwordDropdown = page.locator('#password');
    
    // Input fields within the dropdowns
    this.usernameField = page.locator('#react-select-2-input');
    this.passwordField = page.locator('#react-select-3-input');
    
    // Login button
    this.loginButton = page.locator('#login-btn');
    
    // Error messages (common selectors)
    this.errorMessage = page.locator('.error-message, .alert-danger, [data-testid="error"], .error');
  }

  async goto() {
    await this.page.goto('/signin');
  }

  async selectUsername(username: string) {
    // Click on username dropdown
    await this.usernameDropdown.click();
    
    // Type the username
    await this.usernameField.type(username);
    
    // Select from dropdown or press Enter
    const option = this.page.locator(`text="${username}"`).first();
    if (await option.isVisible()) {
      await option.click();
    } else {
      await this.usernameField.press('Enter');
    }
  }

  async selectPassword(password: string) {
    // Click on password dropdown
    await this.passwordDropdown.click();
    
    // Type the password
    await this.passwordField.type(password);
    
    // Select from dropdown or press Enter
    const option = this.page.locator(`text="${password}"`).first();
    if (await option.isVisible()) {
      await option.click();
    } else {
      await this.passwordField.press('Enter');
    }
  }

  async login(username: string, password: string) {
    await this.selectUsername(username);
    await this.selectPassword(password);
    await this.loginButton.click();
  }

  async clickLoginWithoutCredentials() {
    await this.loginButton.click();
  }

  async getErrorText() {
    await this.errorMessage.waitFor({ state: 'visible', timeout: 5000 });
    return await this.errorMessage.textContent();
  }

  async clearUsername() {
    await this.usernameDropdown.click();
    await this.usernameField.clear();
    await this.page.keyboard.press('Escape');
  }

  async clearPassword() {
    await this.passwordDropdown.click();
    await this.passwordField.clear();
    await this.page.keyboard.press('Escape');
  }

  async isLoginButtonEnabled() {
    return await this.loginButton.isEnabled();
  }
}




