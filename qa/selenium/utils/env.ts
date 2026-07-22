import dotenv from "dotenv";

dotenv.config();

export const seleniumEnv = {
  baseUrl: process.env.SELENIUM_BASE_URL || "http://localhost:3003",
  browser: process.env.SELENIUM_BROWSER || "chrome",
  headless: (process.env.SELENIUM_HEADLESS || "false").toLowerCase() === "true",
  timeoutMs: Number(process.env.SELENIUM_TIMEOUT_MS || 10000),
  adminEmail: process.env.SELENIUM_ADMIN_EMAIL,
  adminPassword: process.env.SELENIUM_ADMIN_PASSWORD,
};

export function getRequiredEnv(name: "SELENIUM_ADMIN_EMAIL" | "SELENIUM_ADMIN_PASSWORD"): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is required to execute authentication tests.`);
  }

  return value;
}