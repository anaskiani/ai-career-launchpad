"""
Selenium GUI tests for modules covered by unit/component tests:

- Login (Login.test.jsx + auth smoke + validators unit tests)
- Resume personal info (PersonalInfoSection.test.jsx)
- Mock interview (MockInterview.test.jsx + interviewScoring unit tests)

Prerequisites:
  - MySQL running, backend: npm run dev (port 5000)
  - Frontend: npm run dev (port 5173)
  - DEV_BYPASS_AUTH=true in backend/.env

Run:
  pip install -r e2e/requirements.txt
  python e2e/test_gui_modules.py
"""

from __future__ import annotations

import os
import sys
import time
import unittest

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select, WebDriverWait
from webdriver_manager.chrome import ChromeDriverManager

from gui_config import BASE_URL, DEV_EMAIL, DEV_PASSWORD, EXPLICIT_WAIT, HEADLESS, IMPLICIT_WAIT


def create_driver() -> webdriver.Chrome:
    options = Options()
    if HEADLESS:
        options.add_argument("--headless=new")
    options.add_argument("--window-size=1400,900")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=options)
    driver.implicitly_wait(IMPLICIT_WAIT)
    return driver


def wait(driver) -> WebDriverWait:
    return WebDriverWait(driver, EXPLICIT_WAIT)


def login_dev(driver) -> None:
    driver.get(f"{BASE_URL}/login")
    wait(driver).until(EC.presence_of_element_located((By.CSS_SELECTOR, '[data-testid="login-email"]')))
    driver.find_element(By.CSS_SELECTOR, '[data-testid="login-email"]').clear()
    driver.find_element(By.CSS_SELECTOR, '[data-testid="login-email"]').send_keys(DEV_EMAIL)
    driver.find_element(By.CSS_SELECTOR, '[data-testid="login-password"]').clear()
    driver.find_element(By.CSS_SELECTOR, '[data-testid="login-password"]').send_keys(DEV_PASSWORD)
    driver.find_element(By.CSS_SELECTOR, '[data-testid="login-submit"]').click()
    wait(driver).until(EC.url_contains("/dashboard"))
    wait(driver).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, '[data-testid="dashboard-welcome"]'))
    )


class LoginGuiTests(unittest.TestCase):
    """Maps to Login.test.jsx + validator unit tests + POST /auth/login smoke."""

    @classmethod
    def setUpClass(cls):
        cls.driver = create_driver()

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

    def test_dev_login_reaches_dashboard(self):
        login_dev(self.driver)
        welcome = self.driver.find_element(By.CSS_SELECTOR, '[data-testid="dashboard-welcome"]')
        self.assertIn("Welcome", welcome.text)

    def test_invalid_login_shows_error(self):
        self.driver.get(f"{BASE_URL}/login")
        wait(self.driver).until(EC.presence_of_element_located((By.CSS_SELECTOR, '[data-testid="login-email"]')))
        email = self.driver.find_element(By.CSS_SELECTOR, '[data-testid="login-email"]')
        password = self.driver.find_element(By.CSS_SELECTOR, '[data-testid="login-password"]')
        email.clear()
        email.send_keys(DEV_EMAIL)
        password.clear()
        password.send_keys("wrong-password-xyz")
        self.driver.find_element(By.CSS_SELECTOR, '[data-testid="login-submit"]').click()
        error = wait(self.driver).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, '[data-testid="login-error"]'))
        )
        self.assertTrue(error.is_displayed())
        self.assertNotIn("/dashboard", self.driver.current_url)


class ResumePersonalInfoGuiTests(unittest.TestCase):
    """Maps to PersonalInfoSection.test.jsx (resume personal fields)."""

    @classmethod
    def setUpClass(cls):
        cls.driver = create_driver()
        login_dev(cls.driver)

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

    def test_edit_full_name_and_save(self):
        driver = self.driver
        driver.get(f"{BASE_URL}/resume")
        name_input = wait(driver).until(EC.presence_of_element_located((By.ID, "resume-full-name")))
        test_name = f"Selenium Test User {int(time.time())}"
        name_input.clear()
        name_input.send_keys(test_name)
        save_btn = wait(driver).until(EC.element_to_be_clickable((By.CSS_SELECTOR, '[data-testid="resume-save-btn"]')))
        save_btn.click()
        success = wait(driver).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, '[data-testid="resume-success-message"]'))
        )
        self.assertTrue(success.is_displayed())
        driver.refresh()
        refreshed = wait(driver).until(EC.presence_of_element_located((By.ID, "resume-full-name")))
        self.assertEqual(refreshed.get_attribute("value"), test_name)


class MockInterviewGuiTests(unittest.TestCase):
    """Maps to MockInterview.test.jsx + interviewScoring unit tests + interview smoke."""

    @classmethod
    def setUpClass(cls):
        cls.driver = create_driver()
        login_dev(cls.driver)

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

    def test_start_answer_submit_shows_score(self):
        driver = self.driver
        driver.get(f"{BASE_URL}/interview")
        role_select = wait(driver).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, '[data-testid="interview-role-select"]'))
        )
        Select(role_select).select_by_visible_text("Frontend Developer")
        driver.find_element(By.CSS_SELECTOR, '[data-testid="interview-start-btn"]').click()
        answer = wait(driver).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, '[data-testid="interview-answer-first"]'))
        )
        answer.send_keys(
            "For example, I debug React components by checking props and state, "
            "reading console errors, and writing a small test. The result is a clear fix."
        )
        driver.find_element(By.CSS_SELECTOR, '[data-testid="interview-submit-btn"]').click()
        summary = wait(driver).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, '[data-testid="interview-session-summary"]'))
        )
        self.assertIn("Overall score", summary.text)
        self.assertRegex(summary.text, r"\d+/100")


def run_suite() -> int:
    loader = unittest.TestLoader()
    suite = unittest.TestSuite()
    suite.addTests(loader.loadTestsFromTestCase(LoginGuiTests))
    suite.addTests(loader.loadTestsFromTestCase(ResumePersonalInfoGuiTests))
    suite.addTests(loader.loadTestsFromTestCase(MockInterviewGuiTests))
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    return 0 if result.wasSuccessful() else 1


if __name__ == "__main__":
    print(f"\nGUI tests → {BASE_URL}")
    print("Modules: Login, Resume (personal info), Mock Interview\n")
    sys.exit(run_suite())
