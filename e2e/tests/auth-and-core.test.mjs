/**
 * AUTH + core module GUI tests (shortlisted sprint requirements).
 * Covers: valid login, invalid login, resume save, mock interview scoring.
 */

import { By, until } from 'selenium-webdriver';
import {
  BASE_URL,
  EXPLICIT_WAIT_MS,
  loginDev,
  clearSession,
  sleep,
} from '../helpers/gui_helpers.mjs';

export async function runAuthAndCoreTests(driver, reporter) {
  await testLoginSuccess(driver, reporter);
  await testLoginInvalid(driver, reporter);
  await testResumePersonalInfo(driver, reporter);
  await testMockInterview(driver, reporter);
}

async function testLoginSuccess(driver, reporter) {
  await clearSession(driver);
  await driver.get(`${BASE_URL}/login`);
  await reporter.snap(driver, 'login-page', 'Login page before submit');
  const email = await driver.wait(
    until.elementLocated(By.css('[data-testid="login-email"]')),
    EXPLICIT_WAIT_MS,
  );
  const password = await driver.findElement(By.css('[data-testid="login-password"]'));
  await email.clear();
  await email.sendKeys(process.env.DEV_LOGIN_EMAIL || 'dev@localhost.com');
  await password.clear();
  await password.sendKeys(process.env.DEV_LOGIN_PASSWORD || 'devpassword');
  await driver.findElement(By.css('[data-testid="login-submit"]')).click();
  await driver.wait(until.urlContains('/dashboard'), EXPLICIT_WAIT_MS);
  await driver.wait(
    until.elementLocated(By.css('[data-testid="dashboard-welcome"]')),
    EXPLICIT_WAIT_MS,
  );
  await reporter.snap(driver, 'dashboard-after-login', 'Dashboard after successful dev login');
  const welcome = await driver.findElement(By.css('[data-testid="dashboard-welcome"]'));
  const text = await welcome.getText();
  reporter.assert(text.includes('Welcome'), 'AUTH-01: Login → dashboard welcome visible');
}

async function testLoginInvalid(driver, reporter) {
  await clearSession(driver);
  await driver.get(`${BASE_URL}/login`);
  await driver.wait(
    until.elementLocated(By.css('[data-testid="login-email"]')),
    EXPLICIT_WAIT_MS,
  );
  const email = await driver.findElement(By.css('[data-testid="login-email"]'));
  const password = await driver.findElement(By.css('[data-testid="login-password"]'));
  await email.clear();
  await email.sendKeys('invalid-user@example.com');
  await password.clear();
  await password.sendKeys('wrong-password-xyz');
  await driver.findElement(By.css('[data-testid="login-submit"]')).click();
  await driver.wait(async () => {
    const url = await driver.getCurrentUrl();
    return !url.includes('/dashboard');
  }, EXPLICIT_WAIT_MS);
  await sleep(500);
  await reporter.snap(driver, 'invalid-login-blocked', 'Invalid login — user stays on login');
  const url = await driver.getCurrentUrl();
  reporter.assert(
    url.includes('/login') && !url.includes('/dashboard'),
    'AUTH-02: Invalid login blocked from dashboard',
  );
}

async function testResumePersonalInfo(driver, reporter) {
  await loginDev(driver);
  await driver.get(`${BASE_URL}/resume`);
  const nameInput = await driver.wait(until.elementLocated(By.id('resume-full-name')), EXPLICIT_WAIT_MS);
  const testName = `Selenium Test ${Date.now()}`;
  await nameInput.clear();
  await nameInput.sendKeys(testName);
  await reporter.snap(driver, 'resume-edit', 'Resume builder — personal info edited');
  const saveBtn = await driver.wait(
    until.elementLocated(By.css('[data-testid="resume-save-btn"]')),
    EXPLICIT_WAIT_MS,
  );
  await driver.executeScript('arguments[0].click();', saveBtn);
  await driver.wait(
    until.elementLocated(By.css('[data-testid="resume-success-message"]')),
    EXPLICIT_WAIT_MS,
  );
  await reporter.snap(driver, 'resume-saved', 'Resume saved — success message visible');
  await driver.navigate().refresh();
  const refreshed = await driver.wait(until.elementLocated(By.id('resume-full-name')), EXPLICIT_WAIT_MS);
  const value = await refreshed.getAttribute('value');
  reporter.assert(value === testName, 'RES-01: Resume full name saved after refresh');
}

async function testMockInterview(driver, reporter) {
  await loginDev(driver);
  await driver.get(`${BASE_URL}/interview`);
  const roleSelect = await driver.wait(
    until.elementLocated(By.css('[data-testid="interview-role-select"]')),
    EXPLICIT_WAIT_MS,
  );
  await roleSelect.sendKeys('Frontend Developer');
  await driver.findElement(By.css('[data-testid="interview-start-btn"]')).click();
  const answer = await driver.wait(
    until.elementLocated(By.css('[data-testid="interview-answer-first"]')),
    EXPLICIT_WAIT_MS,
  );
  await answer.sendKeys(
    'For example, I debug React components by checking props, reading console errors, and writing tests. The result is a clear fix.',
  );
  await reporter.snap(driver, 'interview-answered', 'Mock interview — role selected and answer entered');
  await driver.findElement(By.css('[data-testid="interview-submit-btn"]')).click();
  const summary = await driver.wait(
    until.elementLocated(By.css('[data-testid="interview-session-summary"]')),
    EXPLICIT_WAIT_MS,
  );
  await reporter.snap(driver, 'interview-score', 'Mock interview submitted — score and feedback shown');
  const text = await summary.getText();
  reporter.assert(
    text.includes('Overall score') && /\d+\/100/.test(text),
    'INT-01: Interview submit shows score summary',
  );
}
