# Automated Software Testing Report

## 1. System Description

**Project:** AI Career Launchpad

AI Career Launchpad is a web application for university students who want help preparing for careers. It includes authentication, profile management, resume building, skill gap analysis, job/internship search, mock interviews, an AI career chatbot, and a dashboard.

**Testing scope:** The project is developed by the student, so unit testing, API testing, UI testing, and end-to-end testing are applicable. For this submission, the automated suite intentionally focuses on the main local modules: authentication UI behavior, resume personal information editing, mock interview interaction, shared validators, and interview scoring. Modules that depend heavily on external APIs, such as live job providers or AI providers, are skipped or tested only through mocked/fallback behavior.

## 2. Key Functionalities

- User registration, login, OTP/security verification, logout, and protected routes
- Profile creation and update, including skills, education, work experience, and avatar upload
- Resume create, update, delete, preview, and PDF generation
- Skill gap analysis based on selected target career roles
- Job and internship search with saved jobs and fallback data
- Mock interview session start, answer save, submission, scoring, and history
- AI chatbot career guidance with fallback behavior when an external provider is unavailable
- Dashboard summary cards, charts, and recent activity

## 3. Assumptions and Constraints

- Backend runs at `http://localhost:5000/api`.
- Frontend runs at `http://localhost:5173`.
- MySQL is available and configured through `backend/.env`.
- Development login may use `DEV_BYPASS_AUTH=true` with `dev@localhost.com` and `devpassword`.
- External AI/job providers may be unavailable, so fallback responses are valid expected behavior.
- Tests should avoid paid APIs and should be repeatable on a local machine.

## 4. Test Strategy

| Test Level | Tool | Purpose |
|---|---|---|
| Unit testing | Node built-in test runner | Validate pure functions such as form validators and interview scoring |
| Property-based testing | Deterministic generated input loops | Check invariants across many input variations |
| API testing | Node `fetch` smoke suite | Validate backend endpoints, status codes, response shapes, and authenticated flows |
| React component testing | Vitest, jsdom, React Testing Library | Validate main frontend modules with mocked services/stores |
| UI testing | Selenium (Node) in `e2e/` | GUI checks for Login, Resume personal info, Mock Interview (modules with unit/component tests) |
| Performance testing | Apache JMeter in `jmeter/` | Load test Auth, Profile, Dashboard, Resume, Mock Interview APIs |
| End-to-end testing | API smoke suite plus Selenium GUI suite | Validate login to dashboard, resume edit, and interview scoring in a real browser |

## 5. Test Objectives

| Feature | What Should Be Tested | What Can Go Wrong | Must Never Fail |
|---|---|---|---|
| Authentication | Valid login, invalid login, token-protected routes | Wrong credentials accepted, token missing, session not stored | Protected data must not be accessible without a valid token |
| Profile | Load/save fields, validation, avatar behavior | Invalid data saved, private fields returned | Password/security fields must not be exposed |
| Resume | Create/update/delete, section editing, reload persistence | Duplicate resume, lost edits, invalid payload | User should only access their own resume |
| Skill Analyzer | Role selection, match percentage, missing skills | Incorrect role data, empty skills crash | Match score must remain within 0 to 100 |
| Jobs | Search, filters, save/remove, fallback mode | API timeout, duplicate saved job, bad pagination | App must show stable fallback data if provider fails |
| Interview | Start session, save answers, submit scoring | Blank answers crash, score outside range | Scores must remain within 0 to 100 |
| Chatbot | Prompt submit, reply render, history | Empty prompt, provider failure | Fallback guidance should be returned when provider fails |
| Dashboard | Summary values and charts | Stale counts, missing new-user state | Dashboard must load for a valid logged-in user |

## 6. Oracle Design

Correctness is verified with these oracles:

- **Expected value comparison:** invalid email returns `false`; password length below 6 returns `false`; blank interview answer scores `0`.
- **Invariant checks:** interview scores and skill match percentages must stay between `0` and `100`; protected routes must reject missing/invalid tokens.
- **State validation:** successful login returns a token and allows dashboard/profile access; logout clears the session; saved jobs update dashboard count.
- **API response validation:** endpoints return expected status codes and response shapes, such as `jobs` arrays and `summary` objects.
- **UI visibility validation:** after login, the dashboard is visible; after submitting a form, success/error messages appear.

Every automated test should clearly name the behavior being checked and should use assertions that match the project requirement.

## 7. Automated Test Cases

### Backend Unit and Property Tests

Run from `backend`:

```bash
npm run test:unit
```

Implemented in `backend/tests/unit.test.mjs`:

| Test Case | Type | Oracle |
|---|---|---|
| Valid email formats are accepted | Functional | `validateEmail()` returns `true` |
| Invalid email formats are rejected | Negative/boundary | `validateEmail()` returns `false` |
| Password length boundary | Boundary | length `5` fails, length `6` passes |
| Required form fields | Negative | error object contains required-field messages |
| Blank interview answer | Negative/state | score equals `0` and feedback says blank |
| Relevant structured answer | Functional | score improves compared with blank answer |
| Generated password lengths | Property-based | validation equals `length >= 6` |
| Generated interview answers | Property-based | all scores stay between `0` and `100` |

### API Smoke Tests

Run from `backend` while the server and database are running:

```bash
npm run test:smoke
```

Implemented in `backend/tests/smoke.mjs`:

| Endpoint | Expected Result |
|---|---|
| `GET /health` | status `200` and health status returned |
| `POST /auth/login` | status `200` and token returned |
| `GET /users/profile` | status `200` and user profile returned |
| `GET /dashboard/summary` | status `200` and summary object returned |
| `GET /skills/roles` | status `200` and roles array returned |
| `GET /jobs/search` | status `200` and jobs array returned |
| `POST /ai/chat` | status `200` and reply returned |
| `POST /interviews/start` | status `201` and interview id returned |
| `POST /interviews/:id/submit` | status `200` and score returned |

### Focused React Component Tests

Run from `frontend`:

```bash
npm test
```

Implemented test files:

| Test File | Module | Coverage |
|---|---|---|
| `src/utils/validators.test.js` | Shared validators | valid/invalid email, password boundary, required form errors |
| `src/components/Auth/Login.test.jsx` | Login | successful login redirect, invalid credential error, security-question step |
| `src/components/Resume/PersonalInfoSection.test.jsx` | Resume builder | existing data render, nested personal info update events |
| `src/components/Interview/MockInterview.test.jsx` | Mock interview | role/history load, role selection start, active question answer/save behavior |

These tests mock services and stores where needed, so they do not require backend, database, external job APIs, or paid AI APIs.

### Selenium GUI Tests (installed)

Install and run from project root:

```bash
cd e2e
npm install
npm run test:gui
```

See `e2e/README.md`. Tests only cover modules with existing unit/component coverage:

| Flow | Steps | Expected Output |
|---|---|---|
| Login to dashboard | Dev credentials, submit | `dashboard-welcome` visible |
| Invalid login | Wrong password | `login-error` visible |
| Resume personal info | Edit full name, save, refresh | Value persists |
| Mock interview | Start Frontend Developer, answer, submit | Session summary with score |

Job finder, chatbot, skill analyzer, and full profile avatar flows are **not** in the Selenium suite (broader manual/API coverage only).

### JMeter performance tests

Test plan: `jmeter/ai-career-launchpad-core-modules.jmx`

| Transaction | API | Module |
|---|---|---|
| `01_Auth_Login` | `POST /api/auth/login` | Authentication |
| `02_Profile_Get` | `GET /api/users/profile` | Profile |
| `03_Dashboard_Summary` | `GET /api/dashboard/summary` | Dashboard (post-login) |
| `04_Resume_Module` | `GET` + `PUT /api/resume` | Resume |
| `05_Mock_Interview` | `POST start` + `POST submit` | Mock interview |

```powershell
cd jmeter
.\run-jmeter.ps1
# Or: jmeter -n -t ai-career-launchpad-core-modules.jmx -l results/out.jtl -e -o reports/html-report
```

Before running: increase `RATE_LIMIT_MAX_REQUESTS` in `backend/.env` and ensure the dev user has a resume (open `/resume` once in the app). See `jmeter/README.md`.

## 8. Flaky Test Handling

Possible flaky areas:

- **Timing:** UI waits for API responses before elements appear.
- **Network:** external AI/job providers can fail.
- **Database state:** repeated tests may reuse previous user data.
- **Randomness:** generated questions or fallback responses may vary.

Fixes:

- Use Playwright auto-waiting and stable locators.
- Prefer local fallback mode for automated tests.
- Seed or reset test data before end-to-end suites.
- Assert stable properties, such as status code and visible section, instead of exact long AI text.

## 9. Test Adequacy Evaluation

The implemented tests cover important logical and backend behavior:

- Validator unit tests cover normal, boundary, and invalid inputs.
- Property-style tests cover repeated input variations and invariants.
- API smoke tests cover the main authenticated backend workflow.
- Manual checklist in `TESTING_CHECKLIST.md` covers broader feature and UX scenarios.

Current limitations:

- Selenium GUI tests cover Login, Resume personal info, and Mock Interview only (aligned with unit/component tests).
- Database reset/seed automation is not included.
- Visual regression testing is not included.
- External provider behavior is tested mainly through fallback assumptions.
- Job finder, full dashboard charts, profile avatar upload, and AI provider integrations are not fully automated because they depend on backend state, file upload, or external provider behavior.

The suite gives reasonable confidence in the main flows, but it does not prove complete correctness.

## 10. Commands for Final Submission

From `backend`:

```bash
npm run test:unit
npm run test:smoke
```

Full backend suite:

```bash
npm test
```

Frontend production build:

```bash
cd ../frontend
npm test
npm run build

cd ..
cd e2e
npm install
npm run test:gui
```

## 11. Challenges and Reflection

The biggest testing challenge is that the application uses real state, authentication, a database, and optional external providers. To make tests stable, the project uses development authentication, local fallback data, and assertions based on clear oracles. This makes the test suite repeatable and suitable for an automated software testing project while still testing meaningful workflows.
