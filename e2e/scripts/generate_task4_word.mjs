/**
 * Generates Task 4 GUI Testing Word document (.docx)
 * Run: node e2e/scripts/generate_task4_word.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  AlignmentType,
  BorderStyle,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
  ImageRun,
  PageBreak,
} from 'docx';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');
const E2E = path.join(ROOT, 'e2e');
const OUT = path.join(ROOT, 'Task_4_GUI_Testing_Report.docx');
const SHOTS = path.join(E2E, 'screenshots', 'report');

function read(rel) {
  const p = path.join(ROOT, rel);
  return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : `[File not found: ${rel}]`;
}

function heading(text, level = HeadingLevel.HEADING_1) {
  return new Paragraph({ text, heading: level, spacing: { before: 240, after: 120 } });
}

function body(text) {
  return new Paragraph({ spacing: { after: 120 }, children: [new TextRun(text)] });
}

function bullet(text) {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 60 },
    children: [new TextRun(text)],
  });
}

function codeBlock(title, code) {
  const lines = code.replace(/\r\n/g, '\n').split('\n');
  const children = [];
  if (title) {
    children.push(
      new Paragraph({
        spacing: { before: 180, after: 60 },
        children: [new TextRun({ text: title, bold: true, size: 22 })],
      }),
    );
  }
  for (const line of lines) {
    children.push(
      new Paragraph({
        spacing: { after: 0 },
        shading: { fill: 'F3F4F6', type: ShadingType.CLEAR },
        children: [
          new TextRun({
            text: line || ' ',
            font: 'Consolas',
            size: 18,
          }),
        ],
      }),
    );
  }
  return children;
}

function makeTable(headers, rows) {
  const headerRow = new TableRow({
    tableHeader: true,
    children: headers.map(
      (h) =>
        new TableCell({
          shading: { fill: '2563EB', type: ShadingType.CLEAR },
          children: [
            new Paragraph({
              children: [new TextRun({ text: h, bold: true, color: 'FFFFFF', size: 20 })],
            }),
          ],
        }),
    ),
  });
  const dataRows = rows.map(
    (row) =>
      new TableRow({
        children: row.map(
          (cell) =>
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: cell, size: 20 })] })],
            }),
        ),
      }),
  );
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [headerRow, ...dataRows],
  });
}

function screenshotParagraphs() {
  const captions = {
    '01-login-page.png': 'Figure 1: Login page (GUI test start)',
    '02-dashboard-after-login.png': 'Figure 2: Successful login — dashboard loaded',
    '03-invalid-login-blocked.png': 'Figure 3: Invalid credentials blocked from dashboard',
    '04-resume-edit.png': 'Figure 4: Resume module — editing personal information',
    '05-resume-saved.png': 'Figure 5: Resume save confirmation',
    '06-interview-answered.png': 'Figure 6: Mock interview — questions and answers',
    '07-interview-score.png': 'Figure 7: Mock interview — local scoring feedback',
    '08-terminal-test-results.png': 'Figure 8: Automated test run summary',
    'profile-edit.png': 'Figure: Profile personal fields edited',
    'profile-saved.png': 'Figure: Profile save success message',
    'job-search.png': 'Figure: Job finder search submitted',
    'skill-analysis.png': 'Figure: Skill gap analysis results',
    'chatbot-reply.png': 'Figure: Chatbot user message and assistant reply',
    'job-detail-modal.png': 'Figure: Job detail modal opened',
    'logout-redirect.png': 'Figure: Logout redirects to login',
    'sidebar-navigation.png': 'Figure: All sidebar modules reachable',
    'protected-route-redirect.png': 'Figure: Unauthenticated user redirected to login',
  };

  const blocks = [heading('Appendix B: Test Execution Screenshots', HeadingLevel.HEADING_2)];
  blocks.push(
    body(
      'The following screenshots were captured automatically during Selenium GUI test execution. Each image documents a key step in navigation, form submission, or user interaction testing.',
    ),
  );

  if (!fs.existsSync(SHOTS)) {
    blocks.push(body('No screenshot folder found. Run: cd e2e && npm run test:gui:all'));
    return blocks;
  }

  const pngs = fs.readdirSync(SHOTS).filter((f) => f.endsWith('.png')).sort();
  if (pngs.length === 0) {
    blocks.push(body('Run cd e2e && npm run test:gui:all with MySQL, backend, and frontend running to capture screenshots.'));
    const runLog = path.join(SHOTS, 'run-log.txt');
    if (fs.existsSync(runLog)) {
      blocks.push(heading('Previous Test Run Log', HeadingLevel.HEADING_3));
      blocks.push(...codeBlock(null, fs.readFileSync(runLog, 'utf8')));
    }
    return blocks;
  }

  let figNum = 0;
  for (const png of pngs) {
    figNum += 1;
    const full = path.join(SHOTS, png);
    const caption = captions[png] || `Figure ${figNum}: ${png.replace('.png', '').replace(/-/g, ' ')}`;
    blocks.push(
      new Paragraph({
        spacing: { before: 240, after: 80 },
        children: [new TextRun({ text: caption, bold: true, size: 22 })],
      }),
    );
    blocks.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
        children: [
          new ImageRun({
            data: fs.readFileSync(full),
            transformation: { width: 580, height: 330 },
          }),
        ],
      }),
    );
  }

  const runLog = path.join(SHOTS, 'run-log.txt');
  if (fs.existsSync(runLog)) {
    blocks.push(heading('Test Run Terminal Output', HeadingLevel.HEADING_3));
    blocks.push(...codeBlock(null, fs.readFileSync(runLog, 'utf8')));
  }
  return blocks;
}

async function build() {
  const reqRows = [
    ['AUTH-01', 'Authentication', 'Valid dev login → dashboard', 'auth-and-core.test.mjs'],
    ['AUTH-02', 'Authentication', 'Invalid credentials blocked', 'auth-and-core.test.mjs'],
    ['NAV-01', 'Navigation', 'Protected route redirects to login', 'navigation.test.mjs'],
    ['NAV-02', 'Navigation', 'Home page public links', 'navigation.test.mjs'],
    ['NAV-03', 'Navigation', 'Sidebar links to all modules', 'navigation.test.mjs'],
    ['NAV-04', 'Navigation', 'Navbar Profile link', 'navigation.test.mjs'],
    ['PROF-01', 'Profile', 'Save fields, persist after refresh', 'forms.test.mjs'],
    ['RES-01', 'Resume', 'Edit and save personal info', 'auth-and-core.test.mjs'],
    ['SKILL-01', 'Skill Analyzer', 'Run analysis, show match %', 'forms.test.mjs'],
    ['JOB-01', 'Job Finder', 'Submit search, see results', 'forms.test.mjs'],
    ['JOB-02', 'Job Finder', 'Open job detail modal', 'interactions.test.mjs'],
    ['INT-01', 'Mock Interview', 'Submit session, show score', 'auth-and-core.test.mjs'],
    ['CHAT-01', 'AI Chatbot', 'Send message, get reply', 'interactions.test.mjs'],
    ['UX-01', 'Logout', 'Session cleared', 'interactions.test.mjs'],
  ];

  const challengeRows = [
    ['Multi-step auth (OTP, PIN)', 'Tests stall on verification', 'DEV_BYPASS_AUTH=true + dev account'],
    ['React SPA timing', 'Click intercepted / stale elements', 'WebDriverWait + executeScript click'],
    ['Save button disabled', 'Save tests fail silently', 'Edit fields first, wait for enabled button'],
    ['External APIs unavailable', 'Flaky job/AI assertions', 'Assert UI states, fallback banners'],
    ['Grid localhost networking', 'Grid timeouts', 'host.docker.internal:5173 for Docker nodes'],
    ['Small viewport sidebar hidden', 'Navigation fails headless', 'Window size 1400×900'],
    ['Async chatbot', 'Race conditions', 'Wait for Career Assistant label'],
    ['Report evidence', 'Manual screenshots tedious', 'Auto PNG capture in screenshots/report/'],
  ];

  const children = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({ text: 'AI Career Launchpad', bold: true, size: 48, color: '1E40AF' }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
      children: [new TextRun({ text: 'Task 4: GUI Testing — Complete Report', bold: true, size: 36 })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
      children: [new TextRun({ text: 'Selenium WebDriver | Selenium Grid | Selenium IDE | Katalon Recorder', size: 24, italics: true })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [new TextRun({ text: 'June 2026', size: 24 })],
    }),

    heading('Table of Contents'),
    bullet('1. Introduction and Objectives'),
    bullet('2. Change 1 — Selenium WebDriver Automated Test Scripts'),
    bullet('3. Change 2 — Selenium Grid Parallel Cross-Browser Testing'),
    bullet('4. Change 3 — Selenium IDE and Katalon Recorder Tests'),
    bullet('5. Change 4 — GUI Testing Process Documentation'),
    bullet('6. Test Requirements Mapping'),
    bullet('7. Challenges Faced and Solutions'),
    bullet('8. How to Run All Tests'),
    bullet('Appendix A: Complete Source Code Listings'),
    bullet('Appendix B: Test Execution Screenshots'),

    new Paragraph({ children: [new PageBreak()] }),

    heading('1. Introduction and Objectives'),
    body(
      'This document presents the complete deliverable for Task 4 (GUI Testing) of the AI Career Launchpad project. The application is a full-stack student career toolkit built with React + Vite (frontend), Express.js + MySQL (backend), covering authentication, profile, resume builder, skill gap analyzer, job finder, mock interviews, AI chatbot, and dashboard.',
    ),
    body('Task 4 required four deliverables:'),
    bullet('Develop automated GUI test scripts using Selenium WebDriver for navigation, form submissions, and user interactions aligned with shortlisted sprint requirements.'),
    bullet('Explore Selenium Grid and run at least one parallel test on multiple browsers and platforms.'),
    bullet('Implement at least one test using Selenium IDE and Katalon Recorder.'),
    bullet('Document the GUI testing process, including challenges faced and solutions adopted.'),

    new Paragraph({ children: [new PageBreak()] }),

    heading('2. Change 1 — Selenium WebDriver Automated Test Scripts'),
    heading('2.1 Overview', HeadingLevel.HEADING_2),
    body(
      'Automated GUI tests were implemented in Node.js using selenium-webdriver 4.x. Tests are organized into four modular suites executed by run_all_tests.mjs, with shared helpers for driver creation, dev login, assertions, and screenshot capture.',
    ),
    heading('2.2 Project Structure', HeadingLevel.HEADING_2),
    ...codeBlock(null, `e2e/
├── helpers/gui_helpers.mjs      # Driver factory, login, assertions, screenshots
├── tests/
│   ├── auth-and-core.test.mjs   # Login, resume, interview
│   ├── navigation.test.mjs      # Routes, sidebar, protected pages
│   ├── forms.test.mjs           # Profile, jobs, skills forms
│   └── interactions.test.mjs    # Chatbot, job modal, logout
├── run_all_tests.mjs            # Full suite runner
├── test_grid_parallel.mjs       # Selenium Grid parallel test
├── docker-compose.grid.yml      # Grid hub + Chrome + Firefox nodes
├── gui_config.mjs               # URLs, credentials, timeouts
├── package.json                 # npm scripts
└── recorded/                    # Selenium IDE & Katalon exports`),

    heading('2.3 Test Scenarios by Category', HeadingLevel.HEADING_2),
    heading('Navigation Tests (navigation.test.mjs)', HeadingLevel.HEADING_3),
    bullet('NAV-01: Unauthenticated /dashboard redirects to /login'),
    bullet('NAV-02: Home page Login link navigates correctly'),
    bullet('NAV-03: Sidebar links open Dashboard, Resume, Skills, Jobs, Interview, Chatbot'),
    bullet('NAV-04: Navbar Profile link opens profile form'),

    heading('Form Submission Tests (forms.test.mjs)', HeadingLevel.HEADING_3),
    bullet('PROF-01: Profile name/bio edit → Save Changes → persists after refresh'),
    bullet('JOB-01: Job keyword search → results summary or empty/fallback state'),
    bullet('SKILL-01: Select target role → Analyze Skills → match percentage displayed'),

    heading('User Interaction Tests (interactions.test.mjs)', HeadingLevel.HEADING_3),
    bullet('CHAT-01: Send chatbot message → assistant reply appears'),
    bullet('JOB-02: View details → modal with Description and Apply Now'),
    bullet('UX-01: Logout → session cleared → dashboard blocked'),

    heading('Auth & Core Module Tests (auth-and-core.test.mjs)', HeadingLevel.HEADING_3),
    bullet('AUTH-01: Valid dev login → dashboard welcome visible'),
    bullet('AUTH-02: Invalid credentials stay on login page'),
    bullet('RES-01: Resume full name saved after refresh'),
    bullet('INT-01: Mock interview submit shows score summary (X/100)'),

    heading('2.4 npm Scripts (package.json)', HeadingLevel.HEADING_2),
    ...codeBlock('e2e/package.json', read('e2e/package.json')),

    heading('2.5 Configuration (gui_config.mjs)', HeadingLevel.HEADING_2),
    ...codeBlock('e2e/gui_config.mjs', read('e2e/gui_config.mjs')),

    new Paragraph({ children: [new PageBreak()] }),

    heading('3. Change 2 — Selenium Grid Parallel Cross-Browser Testing'),
    heading('3.1 What is Selenium Grid?', HeadingLevel.HEADING_2),
    body(
      'Selenium Grid 4 distributes browser sessions across multiple nodes. A central Hub receives WebDriver commands; Node containers (Chrome, Firefox) execute tests in parallel on different browsers/platforms. This satisfies the requirement to run at least one parallel test on multiple browsers.',
    ),
    heading('3.2 Docker Compose Setup', HeadingLevel.HEADING_2),
    body('Grid is started with Docker Compose. Three services are defined:'),
    bullet('selenium-hub — Hub on port 4444'),
    bullet('chrome — Chrome node (Linux container)'),
    bullet('firefox — Firefox node (Linux container)'),
    ...codeBlock('e2e/docker-compose.grid.yml', read('e2e/docker-compose.grid.yml')),

    heading('3.3 Parallel Test Script', HeadingLevel.HEADING_2),
    body(
      'test_grid_parallel.mjs runs the login → dashboard scenario concurrently on Chrome and Firefox using Promise.all. Browsers inside Docker use host.docker.internal:5173 to reach the app on the host machine.',
    ),
    ...codeBlock('e2e/test_grid_parallel.mjs', read('e2e/test_grid_parallel.mjs')),

    heading('3.4 Grid Commands', HeadingLevel.HEADING_2),
    ...codeBlock(null, `cd e2e
npm run grid:up       # Start Hub + Chrome + Firefox nodes
npm run test:grid     # Parallel login test on both browsers
npm run grid:down     # Stop Grid containers

Grid dashboard: http://localhost:4444`),

    heading('3.5 Environment Variables for Grid', HeadingLevel.HEADING_2),
    makeTable(
      ['Variable', 'Default', 'Purpose'],
      [
        ['SELENIUM_GRID_URL', 'http://localhost:4444/wd/hub', 'Grid hub endpoint'],
        ['GUI_GRID_BASE_URL', 'http://host.docker.internal:5173', 'App URL from Docker nodes'],
        ['DEV_LOGIN_EMAIL', 'dev@localhost.com', 'Test account'],
        ['DEV_LOGIN_PASSWORD', 'devpassword', 'Test password'],
      ],
    ),

    new Paragraph({ children: [new PageBreak()] }),

    heading('4. Change 3 — Selenium IDE and Katalon Recorder Tests'),
    heading('4.1 Selenium IDE (.side project)', HeadingLevel.HEADING_2),
    body('File: e2e/recorded/selenium-ide/login-dashboard.side'),
    body('Two recorded test cases in suite "Auth GUI Tests":'),
    bullet('Dev login to dashboard — open /login, enter credentials, assert dashboard welcome'),
    bullet('Invalid login stays on login page — wrong credentials, assert URL remains /login'),
    body('How to run:'),
    bullet('Install Selenium IDE browser extension (Chrome/Firefox)'),
    bullet('Open Project → select login-dashboard.side'),
    bullet('Ensure backend + frontend running with DEV_BYPASS_AUTH=true'),
    bullet('Run the Auth GUI Tests suite'),
    heading('Selenium IDE Project (JSON)', HeadingLevel.HEADING_3),
    ...codeBlock('login-dashboard.side', read('e2e/recorded/selenium-ide/login-dashboard.side')),

    heading('4.2 Katalon Recorder (Python WebDriver export)', HeadingLevel.HEADING_2),
    body('File: e2e/recorded/katalon/login-dashboard-webdriver.py'),
    body('Exported Python Selenium script equivalent to the recorded login flow.'),
    body('How to run:'),
    ...codeBlock(null, `pip install selenium
python e2e/recorded/katalon/login-dashboard-webdriver.py`),
    ...codeBlock('login-dashboard-webdriver.py', read('e2e/recorded/katalon/login-dashboard-webdriver.py')),

    new Paragraph({ children: [new PageBreak()] }),

    heading('5. Change 4 — GUI Testing Process Documentation'),
    heading('5.1 Prerequisites', HeadingLevel.HEADING_2),
    bullet('MySQL running (XAMPP or local service)'),
    bullet('Backend: cd backend && npm run dev (port 5000)'),
    bullet('Frontend: cd frontend && npm run dev (port 5173)'),
    bullet('backend/.env: DEV_BYPASS_AUTH=true'),
    bullet('Dev credentials: dev@localhost.com / devpassword'),

    heading('5.2 Test Execution Workflow', HeadingLevel.HEADING_2),
    body('Step 1 — Install e2e dependencies: cd e2e && npm install'),
    body('Step 2 — Start MySQL, backend, and frontend'),
    body('Step 3 — Run full GUI suite: npm run test:gui:all'),
    body('Step 4 — (Optional) Start Grid: npm run grid:up && npm run test:grid'),
    body('Step 5 — Run Selenium IDE suite or Katalon Python script'),
    body('Step 6 — Collect screenshots from e2e/screenshots/report/ for submission'),

    heading('5.3 Integration with Other Test Levels', HeadingLevel.HEADING_2),
    makeTable(
      ['Test Level', 'Tool', 'Location'],
      [
        ['Unit', 'Node test runner', 'backend/tests/unit.test.mjs'],
        ['API smoke', 'Node fetch', 'backend/tests/smoke.mjs'],
        ['Component', 'Vitest + RTL', 'frontend/src/**/*.test.jsx'],
        ['GUI', 'Selenium WebDriver', 'e2e/'],
        ['Performance', 'Apache JMeter', 'jmeter/'],
      ],
    ),

    heading('5.4 Expected Terminal Output (Sample)', HeadingLevel.HEADING_2),
    ...codeBlock('Sample run (from e2e/screenshots/report/run-log.txt)', read('e2e/screenshots/report/run-log.txt')),

    new Paragraph({ children: [new PageBreak()] }),

    heading('6. Test Requirements Mapping'),
    makeTable(['ID', 'Module', 'GUI Scenario', 'Test File'], reqRows),

    new Paragraph({ spacing: { before: 240 } }),
    heading('7. Challenges Faced and Solutions'),
    makeTable(['Challenge', 'Impact', 'Solution Adopted'], challengeRows),

    new Paragraph({ spacing: { before: 240 } }),
    heading('8. How to Run All Tests'),
    ...codeBlock(null, `# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm run dev

# Terminal 3 — Full GUI suite (Chrome)
cd e2e && npm install && npm run test:gui:all

# Terminal 4 — Selenium Grid parallel (requires Docker)
cd e2e && npm run grid:up && npm run test:grid

# Selenium IDE — open e2e/recorded/selenium-ide/login-dashboard.side

# Katalon — python e2e/recorded/katalon/login-dashboard-webdriver.py`),

    new Paragraph({ children: [new PageBreak()] }),

    heading('Appendix A: Complete Source Code Listings'),
    heading('A.1 helpers/gui_helpers.mjs', HeadingLevel.HEADING_2),
    ...codeBlock(null, read('e2e/helpers/gui_helpers.mjs')),
    heading('A.2 tests/auth-and-core.test.mjs', HeadingLevel.HEADING_2),
    ...codeBlock(null, read('e2e/tests/auth-and-core.test.mjs')),
    heading('A.3 tests/navigation.test.mjs', HeadingLevel.HEADING_2),
    ...codeBlock(null, read('e2e/tests/navigation.test.mjs')),
    heading('A.4 tests/forms.test.mjs', HeadingLevel.HEADING_2),
    ...codeBlock(null, read('e2e/tests/forms.test.mjs')),
    heading('A.5 tests/interactions.test.mjs', HeadingLevel.HEADING_2),
    ...codeBlock(null, read('e2e/tests/interactions.test.mjs')),
    heading('A.6 run_all_tests.mjs', HeadingLevel.HEADING_2),
    ...codeBlock(null, read('e2e/run_all_tests.mjs')),

    new Paragraph({ children: [new PageBreak()] }),
    ...screenshotParagraphs(),

    new Paragraph({ spacing: { before: 400 } }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: '— End of Report —', italics: true, size: 22 })],
    }),
  ];

  const doc = new Document({
    creator: 'AI Career Launchpad',
    title: 'Task 4 GUI Testing Report',
    description: 'Complete GUI testing documentation for Selenium WebDriver, Grid, IDE, and Katalon',
    sections: [{ properties: {}, children }],
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(OUT, buffer);
  console.log(`\nWord document created:\n${OUT}\n`);
  console.log(`Size: ${(buffer.length / 1024).toFixed(1)} KB`);
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
