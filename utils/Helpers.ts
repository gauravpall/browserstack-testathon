import { Page } from '@playwright/test';

export class Helpers {
  static async waitForElement(page: Page, selector: string, timeout = 5000) {
    await page.waitForSelector(selector, { timeout });
  }

  static async generateRandomEmail(): Promise<string> {
    const timestamp = Date.now();
    return `test${timestamp}@testathon.com`;
  }

  static async scrollToElement(page: Page, selector: string) {
    await page.locator(selector).scrollIntoViewIfNeeded();
  }
}