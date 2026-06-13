/**
 * Run all Selenium GUI test suites for AI Career Launchpad.
 * Run: cd e2e && npm run test:gui:all
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { createDriver, TestReporter, SCREENSHOT_DIR, BASE_URL } from './helpers/gui_helpers.mjs';
import { runAuthAndCoreTests } from './tests/auth-and-core.test.mjs';
import { runNavigationTests } from './tests/navigation.test.mjs';
import { runFormTests } from './tests/forms.test.mjs';
import { runInteractionTests } from './tests/interactions.test.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SUITES = [
  { name: 'Auth & core modules', run: runAuthAndCoreTests },
  { name: 'Navigation', run: runNavigationTests },
  { name: 'Form submissions', run: runFormTests },
  { name: 'User interactions', run: runInteractionTests },
];

async function writeReportIndex(reporter) {
  const { passed, failed } = reporter.summary();
  const lines = [
    '# Selenium GUI Test Screenshots',
    '',
    `Generated: ${new Date().toLocaleString()}`,
    `App URL: ${BASE_URL}`,
    `Results: ${passed} passed, ${failed} failed`,
    '',
    '## Test suites',
    '',
    '| Suite | Requirements covered |',
    '|-------|---------------------|',
    '| Auth & core | AUTH-01/02, RES-01, INT-01 |',
    '| Navigation | NAV-01–04, protected routes |',
    '| Forms | PROF-01, JOB-01, SKILL-01 |',
    '| Interactions | CHAT-01, JOB-02, UX-01 |',
    '',
    'See GUI_TESTING_REPORT.md in the project root for full documentation.',
    '',
  ];
  await fs.writeFile(path.join(SCREENSHOT_DIR, 'README-SCREENSHOTS.md'), lines.join('\n'), 'utf8');
}

async function run() {
  console.log(`\nSelenium GUI tests → ${BASE_URL}`);
  console.log('Suites: Auth, Navigation, Forms, Interactions\n');

  const reporter = new TestReporter();
  await reporter.ensureScreenshotDir();

  let driver;
  try {
    driver = await createDriver();
    for (const suite of SUITES) {
      console.log(`\n▶ ${suite.name}`);
      try {
        await suite.run(driver, reporter);
      } catch (error) {
        reporter.failed += 1;
        console.error(`  ✗ Suite crashed: ${error.message}`);
        if (reporter.saveScreenshots) {
          await reporter.snap(driver, `error-${suite.name.replace(/\s+/g, '-').toLowerCase()}`, `Error in ${suite.name}`);
        }
      }
    }
  } catch (error) {
    reporter.failed += 1;
    console.error(`  ✗ Test run crashed: ${error.message}`);
  } finally {
    if (driver) {
      await driver.quit();
    }
  }

  if (reporter.saveScreenshots) {
    await writeReportIndex(reporter);
  }

  const { passed, failed } = reporter.summary();
  console.log(`\nResults: ${passed} passed, ${failed} failed`);
  if (reporter.saveScreenshots) {
    console.log(`Screenshots saved in: ${SCREENSHOT_DIR}\n`);
  }
  process.exit(failed > 0 ? 1 : 0);
}

run();
