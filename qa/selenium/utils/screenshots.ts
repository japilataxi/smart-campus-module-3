import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { WebDriver } from "selenium-webdriver";

export async function captureScreenshot(driver: WebDriver, fileName: string): Promise<string> {
  const screenshotsDir = path.resolve("screenshots");
  await mkdir(screenshotsDir, { recursive: true });

  const normalizedFileName = fileName.endsWith(".png") ? fileName : `${fileName}.png`;
  const filePath = path.join(screenshotsDir, normalizedFileName);
  const image = await driver.takeScreenshot();

  await writeFile(filePath, image, "base64");

  return filePath;
}