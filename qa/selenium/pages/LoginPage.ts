import { By, WebDriver } from "selenium-webdriver";
import { BasePage } from "./BasePage.js";

export class LoginPage extends BasePage {
  private readonly form = By.css("form");

  private readonly title = By.xpath("//*[contains(., 'Welcome back')]");

  private readonly emailInput = By.css("input[type='email']");

  private readonly passwordInput = By.css("input[type='password']");

  private readonly loginButton = By.xpath("//button[normalize-space()='Login']");

  private readonly registerLink = By.linkText("Register");

  private readonly errorMessage = By.xpath(
    "//*[contains(., 'We could not sign you in')]",
  );

  constructor(driver: WebDriver) {
    super(driver);
  }

  async open(): Promise<void> {
    await super.open("/login");
  }

  async isLoaded(): Promise<boolean> {
    const isTitleVisible = await this.isVisible(this.title);
    const isFormVisible = await this.isVisible(this.form);

    return isTitleVisible && isFormVisible;
  }

  async enterEmail(email: string): Promise<void> {
    await this.type(this.emailInput, email);
  }

  async enterPassword(password: string): Promise<void> {
    await this.type(this.passwordInput, password);
  }

  async submitLogin(): Promise<void> {
    await this.click(this.loginButton);
  }

  async login(email: string, password: string): Promise<void> {
    await this.enterEmail(email);
    await this.enterPassword(password);
    await this.submitLogin();
  }

  async getErrorMessage(): Promise<string> {
    return this.getText(this.errorMessage);
  }

  async goToRegister(): Promise<void> {
    await this.click(this.registerLink);
  }
}
