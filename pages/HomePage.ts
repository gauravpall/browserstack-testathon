import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly heroSection: Locator;
  readonly navigationMenu: Locator;
  readonly getStartedButton: Locator;

  constructor(page: Page) {
    super(page);
    this.heroSection = page.locator('[data-testid="hero-section"]');
    this.navigationMenu = page.locator('nav');
    this.getStartedButton = page.getByRole('button', { name: /get started/i });
  }

  async goto() {
    await this.page.goto('/');
  }

  async navigateToSection(sectionName: string) {
    await this.page.getByRole('link', { name: sectionName }).click();
  }

  async clickGetStarted() {
    await this.getStartedButton.click();
  }
}