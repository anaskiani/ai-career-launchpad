/**
 * Navigation GUI tests — sidebar links and protected routes.
 * Maps to TESTING_CHECKLIST: protected routes, token-gated modules.
 */

import { By, until } from 'selenium-webdriver';
import {
  BASE_URL,
  EXPLICIT_WAIT_MS,
  clickSidebarLink,
  loginDev,
  clearSession,
  waitForPageHeading,
} from '../helpers/gui_helpers.mjs';

const SIDEBAR_MODULES = [
  { label: 'Dashboard', heading: 'Welcome', urlPart: '/dashboard' },
  { label: 'Resume Builder', heading: 'Resume', urlPart: '/resume' },
  { label: 'Skill Gap', heading: 'Skill Gap Analyzer', urlPart: '/skills' },
  { label: 'Job Finder', heading: 'Job & Internship Finder', urlPart: '/jobs' },
  { label: 'Mock Interview', heading: 'Mock Interview', urlPart: '/interview' },
  { label: 'AI Chatbot', heading: 'AI Career Chatbot', urlPart: '/chatbot' },
];

export async function runNavigationTests(driver, reporter) {
  await testProtectedRouteRedirect(driver, reporter);
  await testHomePagePublicLinks(driver, reporter);
  await testSidebarNavigation(driver, reporter);
  await testNavbarProfileLink(driver, reporter);
}

async function testProtectedRouteRedirect(driver, reporter) {
  await clearSession(driver);
  await driver.get(`${BASE_URL}/dashboard`);
  await driver.wait(until.urlContains('/login'), EXPLICIT_WAIT_MS);
  await reporter.snap(driver, 'protected-route-redirect', 'Unauthenticated user redirected to login');
  const url = await driver.getCurrentUrl();
  reporter.assert(url.includes('/login'), 'NAV-01: Protected /dashboard redirects to login');
}

async function testHomePagePublicLinks(driver, reporter) {
  await clearSession(driver);
  await driver.get(`${BASE_URL}/`);
  await driver.wait(
    until.elementLocated(By.xpath("//h1[contains(., 'AI Career Launchpad')]")),
    EXPLICIT_WAIT_MS,
  );
  const loginLink = await driver.findElement(By.xpath("//a[contains(., 'Login')]"));
  await loginLink.click();
  await driver.wait(until.urlContains('/login'), EXPLICIT_WAIT_MS);
  reporter.assert(true, 'NAV-02: Home page Login link navigates to /login');
}

async function testSidebarNavigation(driver, reporter) {
  await loginDev(driver);
  for (const module of SIDEBAR_MODULES) {
    await clickSidebarLink(driver, module.label);
    await driver.wait(until.urlContains(module.urlPart), EXPLICIT_WAIT_MS);
    await waitForPageHeading(driver, module.heading);
    reporter.assert(true, `NAV-03: Sidebar "${module.label}" opens ${module.urlPart}`);
  }
  await reporter.snap(driver, 'sidebar-navigation', 'All sidebar modules reachable after login');
}

async function testNavbarProfileLink(driver, reporter) {
  await loginDev(driver);
  const profileLink = await driver.wait(
    until.elementLocated(By.xpath("//nav//a[contains(., 'Profile')]")),
    EXPLICIT_WAIT_MS,
  );
  await profileLink.click();
  await driver.wait(until.urlContains('/profile'), EXPLICIT_WAIT_MS);
  await driver.wait(
    until.elementLocated(By.xpath("//button[contains(., 'Save Changes')]")),
    EXPLICIT_WAIT_MS,
  );
  reporter.assert(true, 'NAV-04: Navbar Profile link opens profile form');
}
