/**
 * Offline smoke tests — no paid APIs required.
 * Run: npm run test (from backend folder, server + MySQL must be running)
 */

const API = process.env.API_URL || 'http://localhost:5000/api';
const DEV_EMAIL = process.env.DEV_LOGIN_EMAIL || 'dev@localhost.com';
const DEV_PASSWORD = process.env.DEV_LOGIN_PASSWORD || 'devpassword';

let passed = 0;
let failed = 0;

const assert = (condition, label) => {
  if (condition) {
    passed += 1;
    console.log(`  ✓ ${label}`);
  } else {
    failed += 1;
    console.error(`  ✗ ${label}`);
  }
};

const request = async (path, options = {}) => {
  const response = await fetch(`${API}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      ...options.headers,
    },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { raw: text };
  }

  return { status: response.status, data };
};

const run = async () => {
  console.log(`\nSmoke tests → ${API}\n`);

  const health = await request('/health');
  assert(health.status === 200 && health.data?.status, 'GET /health');

  const login = await request('/auth/login', {
    method: 'POST',
    body: { email: DEV_EMAIL, password: DEV_PASSWORD },
  });
  assert(login.status === 200 && login.data?.token, 'POST /auth/login (dev bypass)');
  const token = login.data?.token;

  const profile = await request('/users/profile', { token });
  assert(profile.status === 200 && profile.data?.email, 'GET /users/profile');

  const dashboard = await request('/dashboard/summary', { token });
  assert(dashboard.status === 200 && dashboard.data?.summary, 'GET /dashboard/summary');

  const roles = await request('/skills/roles', { token });
  assert(roles.status === 200 && Array.isArray(roles.data?.roles), 'GET /skills/roles');

  const jobs = await request('/jobs/search?keyword=developer&limit=3', { token });
  assert(jobs.status === 200 && Array.isArray(jobs.data?.jobs), 'GET /jobs/search (fallback ok)');

  const chat = await request('/ai/chat', {
    method: 'POST',
    token,
    body: { message: 'How do I improve my resume?', topic: 'resume' },
  });
  assert(chat.status === 200 && chat.data?.reply, 'POST /ai/chat (offline coach)');

  const interviewStart = await request('/interviews/start', {
    method: 'POST',
    token,
    body: { role: 'Frontend Developer' },
  });
  assert(interviewStart.status === 201 && interviewStart.data?.interview?._id, 'POST /interviews/start');

  const interviewId = interviewStart.data?.interview?._id;
  const questions = (interviewStart.data?.interview?.questions || []).map((q, i) => ({
    ...q,
    answer: i === 0 ? 'React uses a virtual DOM to minimize direct DOM updates and improve performance.' : q.answer,
  }));

  const submit = await request(`/interviews/${interviewId}/submit`, {
    method: 'POST',
    token,
    body: { questions },
  });
  assert(submit.status === 200 && submit.data?.interview?.score != null, 'POST /interviews/:id/submit (local scoring)');

  console.log(`\nResults: ${passed} passed, ${failed} failed\n`);
  process.exit(failed > 0 ? 1 : 0);
};

run().catch((error) => {
  console.error('Smoke test crashed:', error.message);
  process.exit(1);
});
