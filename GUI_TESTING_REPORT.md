# GUI Testing Report
**Project:** AI Career Launchpad
**Date:** June 12, 2026

## 1. Overview
Automated GUI tests have been successfully developed for the AI Career Launchpad application using Selenium WebDriver. The tests validate the critical paths of the frontend built with React, ensuring robust navigation, form interactions, authentication logic, and dynamic user interactions.

## 2. Testing Scope & Scenarios Developed
The automation suite addresses the primary functional requirements of the web application:

*   **Authentication & Core (Auth-and-Core Suite):** Validates the login process, verifying successful login leads to the dashboard and blocking invalid credentials. It also validates that core modules like the Resume Builder and Mock Interview modules save state effectively.
*   **Navigation (Navigation Suite):** Ensures that routing works properly, protected routes redirect unauthenticated users to `/login`, and the sidebar correctly links to all essential modules (Resume Builder, Skill Gap, Job Finder, Mock Interview, AI Chatbot).
*   **Form Submissions (Forms Suite):** End-to-end testing of profile data entry. Validates that updating user information (like Name and Bio) triggers the React state update and correctly saves via the backend API, displaying the proper success feedback.
*   **User Interactions (Interactions Suite):** Evaluates dynamic components, specifically the AI Chatbot rendering and the Job Finder modal. It confirms that the job details modal parses description text correctly and displays action buttons (Apply Now, Save).

## 3. Toolchain & Execution
*   **Selenium WebDriver (Node.js):** Tests use `selenium-webdriver` with explicit wait conditions mapping to the frontend's `data-testid` properties and UI elements.
*   **Selenium IDE:** Created a recording scenario (`login-dashboard.side`) encapsulating a full test of the Login and Navigation flow directly from the browser extension.
*   **Katalon Recorder:** A supplementary Katalon WebDriver export (`login-dashboard-webdriver.py`) was generated to validate standard browser actions.
*   **Selenium Grid Parallelization:** The project incorporates a Docker-based Selenium Grid setup (`docker-compose.grid.yml`) allowing simultaneous execution of cross-browser tests across Chrome and Firefox nodes. This is executed using the `npm run test:grid` command.

## 4. Challenges Faced & Solutions Adopted
1.  **React State vs. Selenium Timing (Race Conditions):**
    *   *Challenge:* Selenium `sendKeys` operations sometimes triggered React synthetic events asynchronously, causing the "Save Changes" button to briefly evaluate as `disabled`.
    *   *Solution:* Implemented explicit `WebDriverWait` conditions using XPath to target elements not just by text, but by their `not(@disabled)` state.

2.  **State Management with Local Storage:**
    *   *Challenge:* The standard `driver.manage().deleteAllCookies()` failed to effectively log the user out between test sessions because the Auth context persisted the JWT token inside `localStorage`.
    *   *Solution:* Designed a `clearSession()` utility that navigates to the base URL and executes `window.localStorage.clear(); window.sessionStorage.clear();` prior to clearing cookies.

3.  **Flaky UI Interactions (Modals & Sticky Buttons):**
    *   *Challenge:* The Job details modal used CSS `text-transform: uppercase`, failing initial text-matching assertions. The Profile Form's sticky "Save Changes" button frequently encountered `ElementClickInterceptedException`.
    *   *Solution:* Adjusted assertions to match the computed DOM visibility state (e.g., matching "DESCRIPTION"). For the sticky button, we injected an `arguments[0].scrollIntoView({block: "center"})` payload via `executeScript` before performing a standard `.click()`.

## 5. Results Summary
*   **Passed Tests:** Functional GUI checks successfully executed across Auth, Navigation, Forms, and Interactions.
*   **Test Logs & Screenshots:** Captured step-by-step UI states and stored them within the `e2e/screenshots/report` directory.
