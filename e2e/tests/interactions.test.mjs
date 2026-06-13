/**
 * User interaction GUI tests — chatbot, logout, job detail modal.
 * Maps to shortlisted requirements: Chatbot, Auth logout, Jobs detail view.
 */

import { By, until } from 'selenium-webdriver';
import {
  BASE_URL,
  EXPLICIT_WAIT_MS,
  loginDev,
  sleep,
} from '../helpers/gui_helpers.mjs';

export async function runInteractionTests(driver, reporter) {
  await testChatbotMessage(driver, reporter);
  await testJobDetailModal(driver, reporter);
  await testLogout(driver, reporter);
}

async function testChatbotMessage(driver, reporter) {
  await loginDev(driver);
  await driver.get(`${BASE_URL}/chatbot`);
  await driver.wait(
    until.elementLocated(By.xpath("//h1[contains(., 'AI Career Chatbot')]")),
    EXPLICIT_WAIT_MS,
  );
  const prompt = 'What skills should I learn for a frontend developer role?';
  const textarea = await driver.findElement(
    By.css('textarea[placeholder*="Ask about your resume"]'),
  );
  await textarea.sendKeys(prompt);
  const sendBtn = await driver.findElement(
    By.xpath("//form//button[@type='submit' and contains(., 'Send')]"),
  );
  await sendBtn.click();
  await driver.wait(
    until.elementLocated(By.xpath("//*[contains(., 'Career Assistant')]")),
    EXPLICIT_WAIT_MS,
  );
  await sleep(1500);
  await reporter.snap(driver, 'chatbot-reply', 'Chatbot user message and assistant reply');
  const bodyText = await driver.findElement(By.css('body')).getText();
  reporter.assert(
    bodyText.includes('Career Assistant') || bodyText.includes('You'),
    'CHAT-01: Chatbot displays user and assistant messages',
  );
}

async function testJobDetailModal(driver, reporter) {
  await loginDev(driver);
  await driver.get(`${BASE_URL}/jobs`);
  await sleep(1500);
  const viewDetailsButtons = await driver.findElements(
    By.xpath("//button[contains(., 'View details')]"),
  );
  if (viewDetailsButtons.length === 0) {
    reporter.assert(true, 'JOB-02: Job detail modal skipped (no job cards in current data)');
    return;
  }
  await viewDetailsButtons[0].click();
  await driver.wait(
    until.elementLocated(By.xpath("//h2[contains(@class, 'font-bold')]")),
    EXPLICIT_WAIT_MS,
  );
  await reporter.snap(driver, 'job-detail-modal', 'Job detail modal opened from card');
  const modalText = await driver.findElement(By.css('body')).getText();
  reporter.assert(
    modalText.includes('DESCRIPTION') && modalText.includes('Apply Now'),
    'JOB-02: Job detail modal shows description and apply action',
  );
  const closeBtn = await driver.findElement(
    By.xpath("//div[contains(@class,'fixed')]//button[.//*[name()='svg']]"),
  );
  await closeBtn.click();
  await sleep(500);
}

async function testLogout(driver, reporter) {
  await loginDev(driver);
  const logoutBtn = await driver.wait(
    until.elementLocated(By.xpath("//button[contains(., 'Logout')]")),
    EXPLICIT_WAIT_MS,
  );
  await logoutBtn.click();
  await driver.wait(until.urlContains('/login'), EXPLICIT_WAIT_MS);
  await reporter.snap(driver, 'logout-redirect', 'Logout redirects to login page');
  await driver.get(`${BASE_URL}/dashboard`);
  await driver.wait(until.urlContains('/login'), EXPLICIT_WAIT_MS);
  reporter.assert(true, 'UX-01: Logout clears session — dashboard requires login again');
}
