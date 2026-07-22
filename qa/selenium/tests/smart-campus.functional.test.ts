import assert from "node:assert/strict";
import test, { after } from "node:test";
import { WebDriver } from "selenium-webdriver";
import { DashboardPage } from "../pages/DashboardPage.js";
import { LandingPage } from "../pages/LandingPage.js";
import { LoginPage } from "../pages/LoginPage.js";
import { createDriver } from "../utils/driver.js";
import { getRequiredEnv } from "../utils/env.js";
import { writeExecutionReport, TestReportEntry } from "../utils/report.js";
import { captureScreenshot } from "../utils/screenshots.js";

type SeleniumTest = (driver: WebDriver) => Promise<void>;

type TestCaseMetadata = {
  code: string;
  name: string;
  passedScreenshot: string;
  failedScreenshot: string;
};

const reportEntries: TestReportEntry[] = [];

async function runSeleniumTest(
  metadata: TestCaseMetadata,
  callback: SeleniumTest,
): Promise<void> {
  const driver = await createDriver();
  const startedAt = Date.now();
  const executedAt = new Date().toISOString();
  let evidencePath = "";

  try {
    await callback(driver);
    evidencePath = await captureScreenshot(driver, metadata.passedScreenshot);

    reportEntries.push({
      code: metadata.code,
      name: metadata.name,
      status: "aprobado",
      durationMs: Date.now() - startedAt,
      executedAt,
      evidencePath,
    });
  } catch (error) {
    evidencePath = await captureScreenshot(driver, metadata.failedScreenshot);
    const errorMessage = error instanceof Error ? error.message : String(error);

    reportEntries.push({
      code: metadata.code,
      name: metadata.name,
      status: "fallido",
      durationMs: Date.now() - startedAt,
      executedAt,
      evidencePath,
      error: errorMessage,
    });

    console.error(`${metadata.code} failed. Screenshot saved at: ${evidencePath}`);
    throw error;
  } finally {
    await driver.quit();
  }
}

after(async () => {
  const reportPath = await writeExecutionReport(reportEntries);
  console.log(`Selenium execution report saved at: ${reportPath}`);
});

test("CP-001 - Open Landing Page and verify it loads correctly", async () => {
  await runSeleniumTest(
    {
      code: "CP-001",
      name: "Open Landing Page and verify it loads correctly",
      passedScreenshot: "CP-001-landing-page-aprobado.png",
      failedScreenshot: "CP-001-landing-page-fallido.png",
    },
    async (driver) => {
      const landingPage = new LandingPage(driver);

      await landingPage.open();

      assert.equal(await landingPage.isLoaded(), true);
      assert.equal(await landingPage.hasModuleLabel(), true);
      assert.equal(await landingPage.hasQaReadinessSection(), true);
    },
  );
});

test("CP-002 - Navigate from Landing Page to Login", async () => {
  await runSeleniumTest(
    {
      code: "CP-002",
      name: "Navigate from Landing Page to Login",
      passedScreenshot: "CP-002-login-navigation-aprobado.png",
      failedScreenshot: "CP-002-login-navigation-fallido.png",
    },
    async (driver) => {
      const landingPage = new LandingPage(driver);
      const loginPage = new LoginPage(driver);

      await landingPage.open();
      await landingPage.goToLogin();

      assert.equal(await loginPage.isLoaded(), true);
    },
  );
});

test("CP-012 - Login successfully as Administrator", async () => {
  await runSeleniumTest(
    {
      code: "CP-012",
      name: "Login successfully as Administrator",
      passedScreenshot: "CP-012-login-admin-aprobado.png",
      failedScreenshot: "CP-012-login-admin-fallido.png",
    },
    async (driver) => {
      const adminEmail = getRequiredEnv("SELENIUM_ADMIN_EMAIL");
      const adminPassword = getRequiredEnv("SELENIUM_ADMIN_PASSWORD");
      const loginPage = new LoginPage(driver);
      const dashboardPage = new DashboardPage(driver);

      await loginPage.open();
      await loginPage.login(adminEmail, adminPassword);

      assert.equal(await dashboardPage.isLoaded(), true);
      assert.equal(await dashboardPage.isAdminSidebarVisible(), true);
    },
  );
});

test("CP-013 - Login with invalid credentials and verify error message", async () => {
  await runSeleniumTest(
    {
      code: "CP-013",
      name: "Login with invalid credentials and verify error message",
      passedScreenshot: "CP-013-credenciales-invalidas-aprobado.png",
      failedScreenshot: "CP-013-credenciales-invalidas-fallido.png",
    },
    async (driver) => {
      const loginPage = new LoginPage(driver);

      await loginPage.open();
      await loginPage.login("invalid.user@uce.edu.ec", "InvalidPassword123");

      const errorMessage = await loginPage.getErrorMessage();
      assert.match(errorMessage, /We could not sign you in/i);
    },
  );
});

test("CP-016 - Verify Dashboard loads after login", async () => {
  await runSeleniumTest(
    {
      code: "CP-016",
      name: "Verify Dashboard loads after login",
      passedScreenshot: "CP-016-dashboard-aprobado.png",
      failedScreenshot: "CP-016-dashboard-fallido.png",
    },
    async (driver) => {
      const adminEmail = getRequiredEnv("SELENIUM_ADMIN_EMAIL");
      const adminPassword = getRequiredEnv("SELENIUM_ADMIN_PASSWORD");
      const loginPage = new LoginPage(driver);
      const dashboardPage = new DashboardPage(driver);

      await loginPage.open();
      await loginPage.login(adminEmail, adminPassword);

      assert.equal(await dashboardPage.isLoaded(), true);
      assert.match(await dashboardPage.getWelcomeText(), /Welcome,/);
      assert.equal(await dashboardPage.hasMicroservicesSummary(), true);
      assert.equal(await dashboardPage.hasCurrentRoleSection(), true);
    },
  );
});