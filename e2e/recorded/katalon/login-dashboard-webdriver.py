# Katalon Recorder export — Dev login to dashboard
# Recorded against AI Career Launchpad (http://localhost:5173)
# Import: Katalon Recorder extension → Open → select this file, OR paste commands manually.
#
# Prerequisites:
#   - Backend: cd backend && npm run dev  (DEV_BYPASS_AUTH=true)
#   - Frontend: cd frontend && npm run dev
#
# Export formats supported by Katalon Recorder:
#   - Selenium WebDriver (Python) — this file
#   - .side (Selenium IDE compatible) — see selenium-ide/login-dashboard.side

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

BASE_URL = "http://localhost:5173"
DEV_EMAIL = "dev@localhost.com"
DEV_PASSWORD = "devpassword"
WAIT_SECONDS = 20

driver = webdriver.Chrome()
driver.set_window_size(1400, 900)
wait = WebDriverWait(driver, WAIT_SECONDS)

try:
    # Step 1: Open login page
    driver.get(f"{BASE_URL}/login")

    # Step 2: Enter credentials
    email = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, '[data-testid="login-email"]')))
    email.clear()
    email.send_keys(DEV_EMAIL)

    password = driver.find_element(By.CSS_SELECTOR, '[data-testid="login-password"]')
    password.clear()
    password.send_keys(DEV_PASSWORD)

    # Step 3: Submit login
    driver.find_element(By.CSS_SELECTOR, '[data-testid="login-submit"]').click()

    # Step 4: Assert dashboard loaded
    wait.until(EC.url_contains("/dashboard"))
    welcome = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, '[data-testid="dashboard-welcome"]')))
    assert "Welcome" in welcome.text, "Dashboard welcome heading not found"

    print("Katalon-style test PASSED: Dev login → dashboard")
finally:
    driver.quit()
