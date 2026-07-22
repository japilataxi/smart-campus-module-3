import { By, until, WebDriver, WebElement } from "selenium-webdriver";

export class BasePage {
  protected readonly driver: WebDriver;
  protected readonly baseUrl: string;
  protected readonly timeoutMs: number;

  constructor(driver: WebDriver) {
    this.driver = driver;
    this.baseUrl = process.env.SELENIUM_BASE_URL || "http://localhost:3003";
    this.timeoutMs = Number(process.env.SELENIUM_TIMEOUT_MS || 10000);
  }

  async open(path: string): Promise<void> {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    await this.driver.get(`${this.baseUrl}${normalizedPath}`);
  }

  async waitUntilVisible(locator: By): Promise<WebElement> {
    const element = await this.driver.wait(
      until.elementLocated(locator),
      this.timeoutMs,
    );

    await this.driver.wait(until.elementIsVisible(element), this.timeoutMs);

    return element;
  }

  async click(locator: By): Promise<void> {
    const element = await this.waitUntilVisible(locator);
    await element.click();
  }

  async type(locator: By, text: string): Promise<void> {
    const element = await this.waitUntilVisible(locator);
    await element.clear();
    await element.sendKeys(text);
  }

  async getText(locator: By): Promise<string> {
    const element = await this.waitUntilVisible(locator);
    return element.getText();
  }

  async isVisible(locator: By): Promise<boolean> {
    try {
      await this.waitUntilVisible(locator);
      return true;
    } catch {
      return false;
    }
  }
}
