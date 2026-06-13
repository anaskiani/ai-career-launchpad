/**
 * Shared Selenium helpers for AI Career Launchpad GUI tests.
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import chrome from 'selenium-webdriver/chrome.js';
import firefox from 'selenium-webdriver/firefox.js';
import { Builder, By, until } from 'selenium-webdriver';
import {
  BASE_URL,
  DEV_EMAIL,
  DEV_PASSWORD,
  EXPLICIT_WAIT_MS,
  GRID_HUB_URL,
  GRID_APP_URL,
  HEADLESS,
} from '../gui_config.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const SCREENSHOT_DIR = path.join(__dirname, '..', 'screenshots', 'report');

export class TestReporter {
  constructor({ saveScreenshots = process.env.SAVE_SCREENSHOTS !== '0' } = {}) {
    this.passed = 0;
    this.failed = 0;
    this.saveScreenshots = saveScreenshots;
    this.screenshotIndex = 0;
  }

  assert(condition, label) {
    if (condition) {
      this.passed += 1;
      console.log(`  ✓ ${label}`);
    } else {
      this.failed += 1;
      console.error(`  ✗ ${label}`);
    }
  }

  async ensureScreenshotDir() {
    if (this.saveScreenshots) {
      await fs.mkdir(SCREENSHOT_DIR, { recursive: true });
    }
  }

  async snap(driver, name, caption) {
    if (!this.saveScreenshots) {
      return null;
    }
    this.screenshotIndex += 1;
    const fileName = `${String(this.screenshotIndex).padStart(2, '0')}-${name}.png`;
    const filePath = path.join(SCREENSHOT_DIR, fileName);
    const png = await driver.takeScreenshot();
    await fs.writeFile(filePath, png, 'base64');
    console.log(`  📷 ${fileName} — ${caption}`);
    return filePath;
  }

  summary() {
    return { passed: this.passed, failed: this.failed };
  }
}

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function createDriver({
  browser = 'chrome',
  headless = HEADLESS,
  gridUrl = null,
} = {}) {
  let builder = new Builder();

  if (gridUrl) {
    builder = builder.usingServer(gridUrl);
  }

  if (browser === 'firefox') {
    const options = new firefox.Options();
    if (headless) {
      options.addArguments('-headless');
    }
    builder = builder.forBrowser('firefox').setFirefoxOptions(options);
  } else {
    const options = new chrome.Options();
    if (headless) {
      options.addArguments('--headless=new');
    }
    options.addArguments('--window-size=1400,900');
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments('--no-sandbox');
    builder = builder.forBrowser('chrome').setChromeOptions(options);
  }

  return builder.build();
}

export async function clearSession(driver, baseUrl = BASE_URL) {
  await driver.get(`${baseUrl}/`);
  await driver.executeScript('window.localStorage.clear(); window.sessionStorage.clear();');
  await driver.manage().deleteAllCookies();
}

export async function loginDev(driver, baseUrl = BASE_URL) {
  await clearSession(driver, baseUrl);
  await driver.get(`${baseUrl}/login`);
  const email = await driver.wait(
    until.elementLocated(By.css('[data-testid="login-email"]')),
    EXPLICIT_WAIT_MS,
  );
  const password = await driver.findElement(By.css('[data-testid="login-password"]'));
  await email.clear();
  await email.sendKeys(DEV_EMAIL);
  await password.clear();
  await password.sendKeys(DEV_PASSWORD);
  await driver.findElement(By.css('[data-testid="login-submit"]')).click();
  await driver.wait(until.urlContains('/dashboard'), EXPLICIT_WAIT_MS);
  await driver.wait(
    until.elementLocated(By.css('[data-testid="dashboard-welcome"]')),
    EXPLICIT_WAIT_MS,
  );
}

export async function clickSidebarLink(driver, label) {
  const link = await driver.wait(
    until.elementLocated(By.xpath(`//aside//a[contains(., '${label}')]`)),
    EXPLICIT_WAIT_MS,
  );
  await driver.executeScript('arguments[0].scrollIntoView({block: "center"});', link);
  await link.click();
}

export async function waitForPageHeading(driver, text) {
  await driver.wait(
    until.elementLocated(By.xpath(`//h1[contains(normalize-space(.), '${text}')]`)),
    EXPLICIT_WAIT_MS,
  );
}

export { BASE_URL, GRID_HUB_URL, GRID_APP_URL, DEV_EMAIL, DEV_PASSWORD, EXPLICIT_WAIT_MS };
