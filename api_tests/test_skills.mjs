/**
 * api_tests/test_skills.mjs — API tests for /api/skills/* endpoints
 *
 * Uses Node.js built-in test runner + fetch (Node 18+)
 * Run: node --test api_tests/test_skills.mjs
 *
 * Oracle: Status codes + invariant (matchPercentage in [0,100])
 */

import test from 'node:test';
import assert from 'node:assert/strict';

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000';
const DEV_EMAIL    = process.env.DEV_LOGIN_EMAIL    || 'dev@localhost.com';
const DEV_PASSWORD = process.env.DEV_LOGIN_PASSWORD || 'devpassword';

/** Obtain a valid JWT token for authenticated requests. */
async function getToken() {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: DEV_EMAIL, password: DEV_PASSWORD }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.token || data.accessToken || data.access_token || null;
}

async function isServerUp() {
  try {
    const res = await fetch(`${BASE_URL}/api/health`, { signal: AbortSignal.timeout(4000) });
    return res.ok;
  } catch { return false; }
}

// ── GET /api/skills/roles ─────────────────────────────────────────────────────

test('API-SK-01: GET /api/skills/roles without token returns 401', async (t) => {
  if (!(await isServerUp())) { t.skip('Backend not reachable'); return; }
  /**
   * WHAT: No token → 401.
   * WHY CORRECT: protect middleware verifies JWT; missing = unauthorized.
   * ORACLE TYPE: State Validation (auth guard)
   */
  const res = await fetch(`${BASE_URL}/api/skills/roles`);
  assert.equal(res.status, 401, `Expected 401, got ${res.status}`);
});

test('API-SK-02: GET /api/skills/roles with valid token returns list', async (t) => {
  if (!(await isServerUp())) { t.skip('Backend not reachable'); return; }
  /**
   * WHAT: Valid token → 200 + array of roles.
   * WHY CORRECT: skillRolesData.js defines 18+ roles; all returned.
   * ORACLE TYPE: Expected Value + Schema Validation
   */
  const token = await getToken();
  if (!token) { t.skip('Could not obtain auth token'); return; }

  const res = await fetch(`${BASE_URL}/api/skills/roles`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  assert.equal(res.status, 200, `Expected 200, got ${res.status}`);
  const data = await res.json();
  const roles = data.roles || data;
  assert.ok(Array.isArray(roles), 'Response must be an array');
  assert.ok(roles.length > 0, 'Must have at least one role');
});

test('API-SK-03: GET /api/skills/roles includes Frontend Developer', async (t) => {
  if (!(await isServerUp())) { t.skip('Backend not reachable'); return; }
  /**
   * WHAT: Role list contains "Frontend Developer".
   * WHY CORRECT: Hardcoded in skillRolesData.js; must always exist.
   */
  const token = await getToken();
  if (!token) { t.skip('Could not obtain token'); return; }

  const res = await fetch(`${BASE_URL}/api/skills/roles`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const data = await res.json();
  const roles = data.roles || data;
  const names = roles.map(r => typeof r === 'string' ? r : r.name || '');
  assert.ok(names.some(n => n.includes('Frontend')), `Expected "Frontend Developer" in roles: ${names.join(', ')}`);
});

// ── POST /api/skills/analyze ──────────────────────────────────────────────────

test('API-SK-04: POST /api/skills/analyze without token returns 401', async (t) => {
  if (!(await isServerUp())) { t.skip('Backend not reachable'); return; }
  /**
   * WHAT: No auth → 401.
   * WHY CORRECT: protect middleware guards this route.
   */
  const res = await fetch(`${BASE_URL}/api/skills/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ targetRole: 'Frontend Developer' }),
  });
  assert.equal(res.status, 401, `Expected 401, got ${res.status}`);
});

test('API-SK-05: POST /api/skills/analyze with missing targetRole returns 400', async (t) => {
  if (!(await isServerUp())) { t.skip('Backend not reachable'); return; }
  /**
   * WHAT: No targetRole field → 400.
   * WHY CORRECT: express-validator requires targetRole; missing = validation error.
   * ORACLE TYPE: Negative / Boundary Test
   */
  const token = await getToken();
  if (!token) { t.skip('Could not obtain token'); return; }

  const res = await fetch(`${BASE_URL}/api/skills/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({}),
  });
  assert.equal(res.status, 400, `Expected 400, got ${res.status}`);
});

test('API-SK-06: POST /api/skills/analyze valid role returns 200 + matchPercentage', async (t) => {
  if (!(await isServerUp())) { t.skip('Backend not reachable'); return; }
  /**
   * WHAT: Valid role → 200 + analysis object with matchPercentage.
   * WHY CORRECT: Controller computes match between user skills and role requirements.
   */
  const token = await getToken();
  if (!token) { t.skip('Could not obtain token'); return; }

  const res = await fetch(`${BASE_URL}/api/skills/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ targetRole: 'Frontend Developer' }),
  });
  assert.equal(res.status, 200, `Expected 200, got ${res.status}: ${await res.clone().text()}`);
  const data = await res.json();
  const analysis = data.analysis || data;
  const pct = analysis.matchPercentage ?? analysis.match_percentage;
  assert.ok(pct !== undefined, 'Response must contain matchPercentage');
});

test('API-SK-07 (INVARIANT): matchPercentage is always in [0, 100]', async (t) => {
  if (!(await isServerUp())) { t.skip('Backend not reachable'); return; }
  /**
   * WHAT: matchPercentage for any valid role ∈ [0, 100].
   * WHY CORRECT: Percentage = (matching / total) * 100; bounded by math.
   * ORACLE TYPE: Invariant — This must NEVER fail.
   */
  const token = await getToken();
  if (!token) { t.skip('Could not obtain token'); return; }

  const res = await fetch(`${BASE_URL}/api/skills/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ targetRole: 'Frontend Developer' }),
  });
  const data = await res.json();
  const analysis = data.analysis || data;
  const pct = parseFloat(analysis.matchPercentage ?? analysis.match_percentage ?? -1);
  assert.ok(pct >= 0, `matchPercentage ${pct} must be >= 0 — INVARIANT VIOLATED`);
  assert.ok(pct <= 100, `matchPercentage ${pct} must be <= 100 — INVARIANT VIOLATED`);
});

test('API-SK-08 (negative): POST /api/skills/analyze invalid role returns error or 0%', async (t) => {
  if (!(await isServerUp())) { t.skip('Backend not reachable'); return; }
  /**
   * WHAT: Non-existent role → 400/404 or 200 with 0% match.
   * WHY CORRECT: No matching role in skillRolesData → must reject or return empty.
   * ORACLE TYPE: Negative Test
   */
  const token = await getToken();
  if (!token) { t.skip('Could not obtain token'); return; }

  const res = await fetch(`${BASE_URL}/api/skills/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ targetRole: 'NonExistentRoleXYZ99' }),
  });
  assert.ok([400, 404, 200].includes(res.status), `Expected 400/404/200, got ${res.status}`);
  if (res.status === 200) {
    const data = await res.json();
    const analysis = data.analysis || data;
    const pct = parseFloat(analysis.matchPercentage ?? analysis.match_percentage ?? 0);
    assert.ok(pct === 0, `Unknown role should produce 0% match, got ${pct}`);
  }
});

// ── GET /api/skills/history ───────────────────────────────────────────────────

test('API-SK-09: GET /api/skills/history requires auth', async (t) => {
  if (!(await isServerUp())) { t.skip('Backend not reachable'); return; }
  /**
   * WHAT: No token → 401.
   * WHY CORRECT: protect middleware required.
   */
  const res = await fetch(`${BASE_URL}/api/skills/history`);
  assert.equal(res.status, 401, `Expected 401, got ${res.status}`);
});

test('API-SK-10: GET /api/skills/history returns array', async (t) => {
  if (!(await isServerUp())) { t.skip('Backend not reachable'); return; }
  /**
   * WHAT: Valid token → 200 + array (may be empty for fresh user).
   * WHY CORRECT: History is always a list.
   * ORACLE TYPE: State Validation
   */
  const token = await getToken();
  if (!token) { t.skip('Could not obtain token'); return; }

  const res = await fetch(`${BASE_URL}/api/skills/history`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  assert.equal(res.status, 200, `Expected 200, got ${res.status}`);
  const data = await res.json();
  const history = data.history || data;
  assert.ok(Array.isArray(history), 'History must be an array');
});
