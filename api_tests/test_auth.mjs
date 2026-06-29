/**
 * api_tests/test_auth.mjs — API tests for /api/auth/* endpoints
 *
 * Uses Node.js built-in test runner + fetch (Node 18+)
 * Run: node --test api_tests/test_auth.mjs
 *
 * Oracle: HTTP status codes + JSON schema validation
 */

import test from 'node:test';
import assert from 'node:assert/strict';

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000';
const DEV_EMAIL    = process.env.DEV_LOGIN_EMAIL    || 'dev@localhost.com';
const DEV_PASSWORD = process.env.DEV_LOGIN_PASSWORD || 'devpassword';

// ── Helper: check server reachability ────────────────────────────────────────
async function isServerUp() {
  try {
    const res = await fetch(`${BASE_URL}/api/health`, { signal: AbortSignal.timeout(4000) });
    return res.ok;
  } catch {
    return false;
  }
}

// ── Smoke Test ───────────────────────────────────────────────────────────────

test('API-SMOKE-01: GET /api/health returns 200 and status field', async (t) => {
  if (!(await isServerUp())) {
    t.skip('Backend server not reachable at ' + BASE_URL);
    return;
  }
  /**
   * WHAT: Health endpoint responds with 200 + a status field.
   * WHY CORRECT: Unauthenticated endpoint; must always be reachable.
   * Server responds: {"status": "Server is running"}
   */
  const res = await fetch(`${BASE_URL}/api/health`);
  assert.equal(res.status, 200, 'Expected HTTP 200');
  const data = await res.json();
  assert.ok('status' in data, `Response must have a 'status' field: ${JSON.stringify(data)}`);
  assert.ok(data.status.length > 0, 'Status field must be non-empty');
});

// ── Registration ─────────────────────────────────────────────────────────────

/** Check if MySQL DB is available by attempting a login (which hits the DB). */
async function isDbAvailable() {
  try {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'probe@probe.com', password: 'probe' }),
      signal: AbortSignal.timeout(5000),
    });
    // 401 = DB responded correctly (user not found); 500 = DB error
    return res.status !== 500;
  } catch { return false; }
}

test('API-REG-01: POST /api/auth/register with missing email returns 400', async (t) => {
  if (!(await isServerUp())) { t.skip('Backend not reachable'); return; }
  /**
   * WHAT: Registration without email field → 400.
   * WHY CORRECT: express-validator requires 'email'; missing = bad request.
   */
  const res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Test User', password: 'validpass123' }),
  });
  assert.equal(res.status, 400, `Expected 400 Bad Request, got ${res.status}`);
});

test('API-REG-02: POST /api/auth/register with missing password returns 400', async (t) => {
  if (!(await isServerUp())) { t.skip('Backend not reachable'); return; }
  /**
   * WHAT: Registration without password → 400.
   * WHY CORRECT: Password is required for bcrypt hashing.
   */
  const res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Test User', email: `nopass_${Date.now()}@test.com` }),
  });
  assert.equal(res.status, 400, `Expected 400 Bad Request, got ${res.status}`);
});

test('API-REG-03 (boundary): POST /api/auth/register with 5-char password returns 400', async (t) => {
  if (!(await isServerUp())) { t.skip('Backend not reachable'); return; }
  /**
   * WHAT: Password below minimum length (5 chars, boundary = 6) → 400.
   * WHY CORRECT: Validator enforces minimum 6 chars; 5 is just below the boundary.
   * ORACLE TYPE: Boundary Test
   */
  const res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Boundary', email: `bound_${Date.now()}@test.com`, password: '12345' }),
  });
  assert.equal(res.status, 400, `Expected 400 for 5-char password, got ${res.status}`);
});

test('API-REG-04 (negative): POST /api/auth/register with malformed email returns 400', async (t) => {
  if (!(await isServerUp())) { t.skip('Backend not reachable'); return; }
  /**
   * WHAT: Non-email string in email field → 400.
   * WHY CORRECT: express-validator email() rule rejects non-email strings.
   * ORACLE TYPE: Negative Test
   */
  const res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Bad Email', email: 'not-an-email', password: 'validpass123' }),
  });
  assert.equal(res.status, 400, `Expected 400 for invalid email, got ${res.status}`);
});

test('API-REG-05: POST /api/auth/register with valid data returns 201', async (t) => {
  if (!(await isServerUp())) { t.skip('Backend not reachable'); return; }
  if (!(await isDbAvailable())) { t.skip('MySQL database not available (expected for no-DB environments)'); return; }
  /**
   * WHAT: Valid registration data → 201 Created + message field.
   * WHY CORRECT: New user created in DB, OTP queued; response confirms creation.
   */
  const uniqueEmail = `apitest_${Date.now()}@test.com`;
  const res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'API Test User', email: uniqueEmail, password: 'securepass99' }),
  });
  assert.equal(res.status, 201, `Expected 201 Created, got ${res.status}: ${await res.text()}`);
  const data = await res.json();
  assert.ok('message' in data, 'Response must contain a message field');
});

test('API-REG-06 (negative): POST /api/auth/register duplicate email returns 409', async (t) => {
  if (!(await isServerUp())) { t.skip('Backend not reachable'); return; }
  if (!(await isDbAvailable())) { t.skip('MySQL database not available'); return; }
  /**
   * WHAT: Registering with same email twice → 409 Conflict.
   * WHY CORRECT: UNIQUE constraint on users.email in MySQL; controller returns 409.
   * ORACLE TYPE: State-Based / Negative Test
   */
  const dup = `dup_${Date.now()}@test.com`;
  const payload = JSON.stringify({ name: 'Dup', email: dup, password: 'securepass99' });
  const headers = { 'Content-Type': 'application/json' };

  await fetch(`${BASE_URL}/api/auth/register`, { method: 'POST', headers, body: payload });
  const second = await fetch(`${BASE_URL}/api/auth/register`, { method: 'POST', headers, body: payload });
  assert.equal(second.status, 409, `Expected 409 Conflict for duplicate email, got ${second.status}`);
});

// ── Login ─────────────────────────────────────────────────────────────────────

test('API-LOGIN-01: POST /api/auth/login valid credentials returns token', async (t) => {
  if (!(await isServerUp())) { t.skip('Backend not reachable'); return; }
  if (!(await isDbAvailable())) { t.skip('MySQL database not available'); return; }
  /**
   * WHAT: Login with valid dev credentials → 200 + JWT token.
   * WHY CORRECT: bcrypt.compare() matches hash; JWT issued on success.
   * ORACLE TYPE: Expected Value + Schema Validation
   */
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: DEV_EMAIL, password: DEV_PASSWORD }),
  });
  assert.equal(res.status, 200, `Expected 200 OK, got ${res.status}`);
  const data = await res.json();
  const token = data.token || data.accessToken || data.access_token;
  assert.ok(token, 'Response must contain a JWT token');
  assert.ok(typeof token === 'string' && token.length > 20, 'Token must be a non-trivial string');
});

test('API-LOGIN-02 (negative): POST /api/auth/login wrong password returns 401', async (t) => {
  if (!(await isServerUp())) { t.skip('Backend not reachable'); return; }
  if (!(await isDbAvailable())) { t.skip('MySQL database not available'); return; }
  /**
   * WHAT: Correct email + wrong password → 401 Unauthorized.
   * WHY CORRECT: bcrypt.compare() fails; no token issued.
   * ORACLE TYPE: Negative Test — Must Never Fail (security)
   */
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: DEV_EMAIL, password: 'definitely-wrong-password' }),
  });
  assert.equal(res.status, 401, `Expected 401, got ${res.status}`);
});

test('API-LOGIN-03 (negative): POST /api/auth/login nonexistent user returns 401', async (t) => {
  if (!(await isServerUp())) { t.skip('Backend not reachable'); return; }
  if (!(await isDbAvailable())) { t.skip('MySQL database not available'); return; }
  /**
   * WHAT: Unknown email → 401.
   * WHY CORRECT: DB lookup returns no row; controller returns 401.
   * ORACLE TYPE: Negative Test
   */
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'nobody_xyz_ghost@fake.com', password: 'irrelevant' }),
  });
  assert.equal(res.status, 401, `Expected 401, got ${res.status}`);
});

test('API-LOGIN-04 (boundary): POST /api/auth/login empty body returns 400 or 401', async (t) => {
  if (!(await isServerUp())) { t.skip('Backend not reachable'); return; }
  /**
   * WHAT: Empty JSON body → 400 validation error.
   * WHY CORRECT: express-validator requires email+password; empty body fails.
   * ORACLE TYPE: Boundary / Negative Test
   */
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  assert.ok([400, 401].includes(res.status), `Expected 400 or 401, got ${res.status}`);
});
