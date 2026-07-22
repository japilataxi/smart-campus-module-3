import { By, WebDriver } from "selenium-webdriver";
import { BasePage } from "./BasePage.js";

export class DashboardPage extends BasePage {
  private readonly moduleLabel = By.xpath(
    "//*[contains(., 'Smart Campus Module 3')]",
  );

  private readonly welcomeTitle = By.xpath("//h1[contains(., 'Welcome,')]");

  private readonly platformOverview = By.xpath(
    "//*[contains(., 'Platform Overview')]",
  );

  private readonly microservicesSummary = By.xpath(
    "//*[contains(., 'Microservices Summary')]",
  );

  private readonly currentRole = By.xpath("//*[contains(., 'Current Role')]");

  private readonly authServiceLink = By.linkText("Auth Service");

  private readonly usersLink = By.linkText("Users");

  private readonly rolesLink = By.linkText("Roles");

  private readonly systemInfoLink = By.linkText("System Info");

  private readonly logoutButton = By.xpath("//button[normalize-space()='Logout']");

  constructor(driver: WebDriver) {
    super(driver);
  }

  async open(): Promise<void> {
    await super.open("/dashboard");
  }

  async isLoaded(): Promise<boolean> {
    const isWelcomeVisible = await this.isVisible(this.welcomeTitle);
    const isOverviewVisible = await this.isVisible(this.platformOverview);

    return isWelcomeVisible && isOverviewVisible;
  }

  async getWelcomeText(): Promise<string> {
    return this.getText(this.welcomeTitle);
  }

  async hasModuleLabel(): Promise<boolean> {
    return this.isVisible(this.moduleLabel);
  }

  async hasMicroservicesSummary(): Promise<boolean> {
    return this.isVisible(this.microservicesSummary);
  }

  async hasCurrentRoleSection(): Promise<boolean> {
    return this.isVisible(this.currentRole);
  }

  async isAdminSidebarVisible(): Promise<boolean> {
    const hasAuthService = await this.isVisible(this.authServiceLink);
    const hasUsers = await this.isVisible(this.usersLink);
    const hasRoles = await this.isVisible(this.rolesLink);
    const hasSystemInfo = await this.isVisible(this.systemInfoLink);

    return hasAuthService && hasUsers && hasRoles && hasSystemInfo;
  }

  async logout(): Promise<void> {
    await this.click(this.logoutButton);
  }
}
