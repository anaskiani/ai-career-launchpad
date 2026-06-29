/**
 * api_tests/test_profile.mjs — API tests for /api/users/* endpoints
 *
 * Uses Node.js built-in test runner + fetch (Node 18+)
 * Run: node --test api_tests/test_profile.mjs
 *
 * Oracle: Status codes + state validation (update → GET confirms change)
 */

import test from 'node:test';
import assert from 'node:assert/strict';

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000';
const DEV_EMAIL    = process.env.DEV_LOGIN_EMAIL    || 'dev@localhost.com';
const DEV_PASSWORD = process.env.DEV_LOGIN_PASSWORD || 'devpassword';

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

// ── GET /api/users/profile ────────────────────────────────────────────────────

test('API-PROF-01: GET /api/users/profile without token returns 401', async (t) => {
  if (!(await isServerUp())) { t.skip('Backend not reachable'); return; }
  /**
   * WHAT: No token → 401.
   * WHY CORRECT: protect middleware verifies JWT; missing = unauthorized.
   * ORACLE TYPE: State Validation (auth guard)
   */
  const res = await fetch(`${BASE_URL}/api/users/profile`);
  assert.equal(res.status, 401, `Expected 401, got ${res.status}`);
});

test('API-PROF-02 (negative): GET /api/users/profile with malformed token returns 401', async (t) => {
  if (!(await isServerUp())) { t.skip('Backend not reachable'); return; }
  /**
   * WHAT: Malformed JWT → 401.
   * WHY CORRECT: jsonwebtoken.verify() throws on invalid token format.
   * ORACLE TYPE: Negative Test
   */
  const res = await fetch(`${BASE_URL}/api/users/profile`, {
    headers: { 'Authorization': 'Bearer this.is.not.a.valid.jwt' },
  });
  assert.equal(res.status, 401, `Expected 401, got ${res.status}`);
});

test('API-PROF-03: GET /api/users/profile with valid token returns 200 + user data', async (t) => {
  if (!(await isServerUp())) { t.skip('Backend not reachable'); return; }
  /**
   * WHAT: Valid token → 200 + user object with required fields.
   * WHY CORRECT: protect middleware sets req.user; controller queries by user.id.
   * ORACLE TYPE: Expected Value + Schema Validation
   */
  const token = await getToken();
  if (!token) { t.skip('Could not obtain auth token'); return; }

  const res = await fetch(`${BASE_URL}/api/users/profile`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  assert.equal(res.status, 200, `Expected 200, got ${res.status}`);
  const data = await res.json();
  const user = data.user || data.profile || data;
  assert.ok(user.email || user.name, `User object must have email or name: ${JSON.stringify(user)}`);
});

test('API-PROF-04: GET /api/users/profile response has required schema fields', async (t) => {
  if (!(await isServerUp())) { t.skip('Backend not reachable'); return; }
  /**
   * WHAT: Profile response contains expected fields from mapUserPublic().
   * WHY CORRECT: mapUserPublic defines the public shape; all fields always mapped.
   * ORACLE TYPE: API Response Validation (schema check)
   */
  const token = await getToken();
  if (!token) { t.skip('Could not obtain token'); return; }

  const res = await fetch(`${BASE_URL}/api/users/profile`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const data = await res.json();
  const user = data.user || data.profile || data;

  for (const field of ['email', 'skills']) {
    assert.ok(field in user, `Field "${field}" missing from profile response. Got: ${Object.keys(user).join(', ')}`);
  }
});

// ── PUT /api/users/profile ────────────────────────────────────────────────────

test('API-PROF-05: PUT /api/users/profile without token returns 401', async (t) => {
  if (!(await isServerUp())) { t.skip('Backend not reachable'); return; }
  /**
   * WHAT: Update without token → 401.
   * WHY CORRECT: protect middleware guards write operations.
   */
  const res = await fetch(`${BASE_URL}/api/users/profile`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Hacker', bio: 'Unauthorized update' }),
  });
  assert.equal(res.status, 401, `Expected 401, got ${res.status}`);
});

test('API-PROF-06 (state-based): PUT /api/users/profile bio update persists after GET', async (t) => {
  if (!(await isServerUp())) { t.skip('Backend not reachable'); return; }
  /**
   * WHAT: Update bio → GET confirms new bio value persisted in DB.
   * WHY CORRECT: Controller does UPDATE WHERE id = req.user.id; subsequent GET returns same.
   * ORACLE TYPE: State Validation (write → read confirmation)
   */
  const token = await getToken();
  if (!token) { t.skip('Could not obtain token'); return; }

  const uniqueBio = `API test bio at ${Date.now()}`;
  const authHeader = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

  const putRes = await fetch(`${BASE_URL}/api/users/profile`, {
    method: 'PUT',
    headers: authHeader,
    body: JSON.stringify({ bio: uniqueBio }),
  });
  assert.equal(putRes.status, 200, `PUT expected 200, got ${putRes.status}: ${await putRes.clone().text()}`);

  const getRes = await fetch(`${BASE_URL}/api/users/profile`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  assert.equal(getRes.status, 200, `GET expected 200, got ${getRes.status}`);
  const data = await getRes.json();
  const user = data.user || data.profile || data;
  assert.equal(user.bio, uniqueBio, `Expected bio "${uniqueBio}", got "${user.bio}"`);
});
