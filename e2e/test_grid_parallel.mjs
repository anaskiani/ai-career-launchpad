/**
 * Selenium Grid parallel test — same login scenario on Chrome and Firefox.
 * Prerequisites: docker compose -f docker-compose.grid.yml up -d
 * Run: cd e2e && npm run test:grid
 */

import { By, until } from 'selenium-webdriver';
import {
  createDriver,
  GRID_HUB_URL,
  GRID_APP_URL,
  DEV_EMAIL,
  DEV_PASSWORD,
  EXPLICIT_WAIT_MS,
} from './helpers/gui_helpers.mjs';

async function runLoginOnBrowser(browser, baseUrl) {
  const label = `${browser}@${baseUrl}`;
  let driver;
  const started = Date.now();
  try {
    driver = await createDriver({ browser, gridUrl: GRID_HUB_URL, headless: true });
    await driver.get(`${baseUrl}/login`);
    const email = await driver.wait(
      until.elementLocated(By.css('[data-testid="login-email"]')),
      EXPLICIT_WAIT_MS,
    );
    await email.sendKeys(DEV_EMAIL);
    await driver.findElement(By.css('[data-testid="login-password"]')).sendKeys(DEV_PASSWORD);
    await driver.findElement(By.css('[data-testid="login-submit"]')).click();
    await driver.wait(until.urlContains('/dashboard'), EXPLICIT_WAIT_MS);
    await driver.wait(
      until.elementLocated(By.css('[data-testid="dashboard-welcome"]')),
      EXPLICIT_WAIT_MS,
    );
    const elapsed = ((Date.now() - started) / 1000).toFixed(1);
    console.log(`  ✓ GRID-${browser.toUpperCase()}: Login → dashboard (${elapsed}s)`);
    return { browser, ok: true, elapsed };
  } catch (error) {
    console.error(`  ✗ GRID-${browser.toUpperCase()}: ${error.message}`);
    return { browser, ok: false, error: error.message };
  } finally {
    if (driver) {
      await driver.quit();
    }
  }
}

async function run() {
  console.log('\nSelenium Grid parallel test');
  console.log(`Hub: ${GRID_HUB_URL}`);
  console.log(`App (from Grid nodes): ${GRID_APP_URL}`);
  console.log('Running login test in parallel on Chrome + Firefox...\n');

  const results = await Promise.all([
    runLoginOnBrowser('chrome', GRID_APP_URL),
    runLoginOnBrowser('firefox', GRID_APP_URL),
  ]);

  const failed = results.filter((r) => !r.ok).length;
  console.log(`\nGrid results: ${results.length - failed}/${results.length} browsers passed`);
  if (failed > 0) {
    console.log('\nTip: Start Grid with: npm run grid:up');
    console.log('Ensure frontend/backend are running and reachable at host.docker.internal:5173\n');
  }
  process.exit(failed > 0 ? 1 : 0);
}

run();
