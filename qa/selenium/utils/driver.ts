import { Builder, WebDriver } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";
import { seleniumEnv } from "./env.js";

export async function createDriver(): Promise<WebDriver> {
  if (seleniumEnv.browser !== "chrome") {
    throw new Error(`Unsupported browser: ${seleniumEnv.browser}. Only chrome is configured.`);
  }

  const options = new chrome.Options();
  options.addArguments("--window-size=1366,768");

  if (seleniumEnv.headless) {
    options.addArguments("--headless=new");
  }

  return new Builder().forBrowser("chrome").setChromeOptions(options).build();
}