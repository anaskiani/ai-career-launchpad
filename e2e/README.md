# Selenium GUI tests



Browser automation for **AI Career Launchpad** — navigation, form submissions, and user interactions aligned with shortlisted sprint requirements.



See **[GUI_TESTING_REPORT.md](../GUI_TESTING_REPORT.md)** for full documentation, challenges, and Grid setup.



## Test suites



| Script | Scenarios |

|--------|-----------|

| `tests/auth-and-core.test.mjs` | Login (valid/invalid), resume save, mock interview |

| `tests/navigation.test.mjs` | Protected routes, sidebar, home links, profile nav |

| `tests/forms.test.mjs` | Profile save, job search, skill gap analysis |

| `tests/interactions.test.mjs` | Chatbot, job detail modal, logout |

| `test_grid_parallel.mjs` | Parallel login on Chrome + Firefox via Selenium Grid |



## Prerequisites



1. **MySQL** running (XAMPP)

2. **Backend:** `cd backend && npm run dev` → port 5000

3. **Frontend:** `cd frontend && npm run dev` → port 5173

4. **Dev auth** in `backend/.env`: `DEV_BYPASS_AUTH=true`



## Install



```bash

cd e2e

npm install

```



Requires **Google Chrome** for local runs. Grid runs use Docker images for Chrome and Firefox.



## Run all GUI tests



```bash

cd e2e

npm run test:gui:all

```



Legacy alias: `npm run test:gui`



## Selenium Grid (parallel browsers)



```bash

cd e2e

npm run grid:up          # Start hub + Chrome + Firefox nodes

npm run test:grid        # Run login test in parallel on both browsers

npm run grid:down        # Stop Grid

```



Grid UI: [http://localhost:4444](http://localhost:4444)



## Recorded tests (Selenium IDE & Katalon)



| Tool | File |

|------|------|

| Selenium IDE | `recorded/selenium-ide/login-dashboard.side` |

| Katalon Recorder | `recorded/katalon/login-dashboard-webdriver.py` |



## Screenshots



PNG files saved to `e2e/screenshots/report/` when `SAVE_SCREENSHOTS` is not `0`.



## Environment variables



```bash

set GUI_BASE_URL=http://localhost:5173

set GUI_GRID_BASE_URL=http://host.docker.internal:5173

set SELENIUM_GRID_URL=http://localhost:4444/wd/hub

set DEV_LOGIN_EMAIL=dev@localhost.com

set DEV_LOGIN_PASSWORD=devpassword

set GUI_HEADLESS=1

```



## With other automated tests



```bash

cd backend && npm run test:unit && npm run test:smoke

cd ../frontend && npm test

cd ../e2e && npm run test:gui:all

cd ../e2e && npm run test:grid

```



## Alternative: Python



```bash

pip install -r e2e/requirements.txt

python e2e/test_gui_modules.py

```

