import { By, WebDriver } from "selenium-webdriver";
import { BasePage } from "./BasePage.js";

export class LandingPage extends BasePage {
  private readonly title = By.xpath(
    "//h1[contains(., 'Distributed Smart Campus Platform')]",
  );

  private readonly moduleLabel = By.xpath(
    "//*[contains(., 'SMART CAMPUS MODULE 3')]",
  );

  private readonly loginButton = By.xpath("//button[normalize-space()='Login']");

  private readonly registerButton = By.xpath(
    "//button[normalize-space()='Register']",
  );

  private readonly qaReadinessSection = By.xpath(
    "//*[contains(., 'QA Readiness')]",
  );

  constructor(driver: WebDriver) {
    super(driver);
  }

  async open(): Promise<void> {
    await super.open("/");
  }

  async isLoaded(): Promise<boolean> {
    return this.isVisible(this.title);
  }

  async hasModuleLabel(): Promise<boolean> {
    return this.isVisible(this.moduleLabel);
  }

  async hasQaReadinessSection(): Promise<boolean> {
    return this.isVisible(this.qaReadinessSection);
  }

  async goToLogin(): Promise<void> {
    await this.click(this.loginButton);
  }

  async goToRegister(): Promise<void> {
    await this.click(this.registerButton);
  }
}
