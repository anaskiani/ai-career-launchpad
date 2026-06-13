/**
 * Form submission GUI tests — profile, job search, skill analysis.
 * Maps to shortlisted requirements: Profile, Jobs, Skill Analyzer.
 */

import { By, until } from 'selenium-webdriver';
import {
  BASE_URL,
  EXPLICIT_WAIT_MS,
  loginDev,
  sleep,
} from '../helpers/gui_helpers.mjs';

export async function runFormTests(driver, reporter) {
  await testProfileSave(driver, reporter);
  await testJobSearch(driver, reporter);
  await testSkillGapAnalysis(driver, reporter);
}

async function testProfileSave(driver, reporter) {
  await loginDev(driver);
  await driver.get(`${BASE_URL}/profile`);
  const nameInput = await driver.wait(
    until.elementLocated(By.css('input[name="name"]')),
    EXPLICIT_WAIT_MS,
  );
  const testBio = `GUI test bio ${Date.now()}`;
  await nameInput.clear();
  await nameInput.sendKeys(`Selenium User ${Date.now()}`);
  const bioInput = await driver.findElement(By.css('textarea[name="bio"]'));
  await bioInput.clear();
  await bioInput.sendKeys(testBio);
  await reporter.snap(driver, 'profile-edit', 'Profile personal fields edited');
  const saveBtn = await driver.wait(
    until.elementLocated(By.xpath("//button[contains(., 'Save Changes') and not(@disabled)]")),
    EXPLICIT_WAIT_MS,
  );
  await driver.executeScript('arguments[0].scrollIntoView({block: "center"});', saveBtn);
  await sleep(500);
  await saveBtn.click();
  try {
    await driver.wait(
      until.elementLocated(By.xpath("//*[contains(., 'Profile updated successfully')]")),
      EXPLICIT_WAIT_MS,
    );
  } catch (err) {
    const bodyText = await driver.findElement(By.css('body')).getText();
    console.error("BODY TEXT ON TIMEOUT:", bodyText);
    throw err;
  }
  await sleep(500); // Give time for toast to be fully visible before snapshot
  await reporter.snap(driver, 'profile-saved', 'Profile save success message shown');
  await driver.navigate().refresh();
  const refreshedBio = await driver.wait(
    until.elementLocated(By.css('textarea[name="bio"]')),
    EXPLICIT_WAIT_MS,
  );
  const value = await refreshedBio.getAttribute('value');
  reporter.assert(value === testBio, 'PROF-01: Profile bio persists after refresh');
}

async function testJobSearch(driver, reporter) {
  await loginDev(driver);
  await driver.get(`${BASE_URL}/jobs`);
  await driver.wait(
    until.elementLocated(By.xpath("//h1[contains(., 'Job & Internship Finder')]")),
    EXPLICIT_WAIT_MS,
  );
  const keywordInput = await driver.findElement(
    By.css('input[placeholder*="frontend developer"]'),
  );
  await keywordInput.clear();
  await keywordInput.sendKeys('developer');
  const searchBtn = await driver.findElement(
    By.xpath("//form//button[@type='submit' and contains(., 'Search')]"),
  );
  await searchBtn.click();
  await sleep(1500);
  await reporter.snap(driver, 'job-search', 'Job finder search submitted');
  const pageText = await driver.findElement(By.css('body')).getText();
  const hasResults =
    pageText.includes('results found') ||
    pageText.includes('No jobs found') ||
    pageText.includes('fallback sample jobs');
  reporter.assert(hasResults, 'JOB-01: Job search renders result summary or empty state');
}

async function testSkillGapAnalysis(driver, reporter) {
  await loginDev(driver);
  await driver.get(`${BASE_URL}/skills`);
  const roleSelect = await driver.wait(
    until.elementLocated(By.xpath("//select[option[contains(., 'Choose a role')]]")),
    EXPLICIT_WAIT_MS,
  );
  const options = await roleSelect.findElements(By.css('option'));
  let selected = false;
  for (const option of options) {
    const value = await option.getAttribute('value');
    if (value) {
      await roleSelect.sendKeys(value);
      selected = true;
      break;
    }
  }
  reporter.assert(selected, 'SKILL-00: At least one target role available');
  const analyzeBtn = await driver.findElement(
    By.xpath("//button[contains(., 'Analyze Skills')]"),
  );
  await analyzeBtn.click();
  await driver.wait(
    until.elementLocated(By.xpath("//*[contains(., 'Skill Match')]")),
    EXPLICIT_WAIT_MS,
  );
  await reporter.snap(driver, 'skill-analysis', 'Skill gap analysis results displayed');
  const bodyText = await driver.findElement(By.css('body')).getText();
  reporter.assert(
    /Skill Match/.test(bodyText) && /\d+%/.test(bodyText),
    'SKILL-01: Skill analysis shows match percentage',
  );
}
