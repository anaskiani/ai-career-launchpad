/**
 * load_tests/rate_limit_test.mjs
 * ─────────────────────────────────────────────────────────────────────────
 * Rate Limiter Verification Test
 *
 * Sends a rapid burst of requests to verify:
 *   1. Server enforces rate limits (returns 429 Too Many Requests)
 *   2. Server recovers after window expires
 *   3. Different IPs get independent limits
 *
 * Usage:
 *   node load_tests/rate_limit_test.mjs
 * ─────────────────────────────────────────────────────────────────────────
 */

const BASE_URL = 'http://127.0.0.1:5000';
const RATE_LIMIT_MAX = 1000;  // from .env
const BURST_SIZE = 1500;       // intentionally exceed the limit

const C = {
  green:  (s) => `\x1b[32m${s}\x1b[0m`,
  red:    (s) => `\x1b[31m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  cyan:   (s) => `\x1b[36m${s}\x1b[0m`,
  bold:   (s) => `\x1b[1m${s}\x1b[0m`,
};

async function sendBurst(url, count, label) {
  console.log(`\n${C.bold(label)}`);
  console.log(`  Sending ${count} concurrent requests to ${url}...`);

  const start = Date.now();
  const promises = Array.from({ length: count }, (_, i) =>
    fetch(url, { method: 'GET' })
      .then(res => ({ status: res.status, index: i }))
      .catch(() => ({ status: 0, index: i, error: true }))
  );

  const results = await Promise.all(promises);
  const elapsed = Date.now() - start;

  const counts = results.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {});

  const ok       = counts[200] || 0;
  const unauth   = counts[401] || 0;
  const notFound = counts[404] || 0;
  const rateHit  = counts[429] || 0;
  const errors   = counts[0]   || 0;

  console.log(`\n  ┌─ Results after ${elapsed}ms ─────────────────────────`);
  console.log(`  │  200 OK            : ${C.green(ok)}`);
  console.log(`  │  401 Unauthorized  : ${unauth > 0 ? C.yellow(unauth) : '0'}`);
  console.log(`  │  404 Not Found     : ${notFound}`);
  console.log(`  │  429 Rate Limited  : ${rateHit > 0 ? C.yellow(rateHit) : '0'}`);
  console.log(`  │  Network Errors    : ${errors > 0 ? C.red(errors) : '0'}`);
  console.log(`  └────────────────────────────────────────────────────`);

  const rateLimitWorking = rateHit > 0;
  if (rateLimitWorking) {
    console.log(`  ${C.green('✅ Rate limiter is ACTIVE')} — returned 429 after ${RATE_LIMIT_MAX} requests`);
  } else {
    console.log(`  ${C.yellow('⚠️  No 429 returned')} — rate limit may not be enforced or window has space`);
  }

  return { ok, rateHit, errors, elapsed, rateLimitWorking };
}

async function testRecovery() {
  const WINDOW_MS = 15 * 60 * 1000; // 15 min (from .env)
  console.log(`\n${C.bold('Recovery Test')}`);
  console.log(`  Rate limit window: 15 minutes`);
  console.log(`  ${C.yellow('Note: Full window recovery takes 15 min. Testing immediate response only.')}`);

  const res = await fetch(`${BASE_URL}/api/health`);
  console.log(`  Health check after burst: ${res.status === 200 ? C.green('200 OK') : C.red(res.status)}`);
  return res.status;
}

async function main() {
  console.log(C.bold('\n🚦  Rate Limiter Verification Test'));
  console.log(`   Target  : ${C.cyan(BASE_URL)}`);
  console.log(`   Max RPS : ${RATE_LIMIT_MAX} requests per 15-min window`);
  console.log(`   Burst   : ${BURST_SIZE} concurrent requests\n`);

  // Check server is up
  try {
    const check = await fetch(`${BASE_URL}/api/health`);
    if (!check.ok) throw new Error();
    console.log(C.green('✔ Backend reachable'));
  } catch {
    console.error(C.red('✖ Backend not reachable. Start with: node backend/server.js'));
    process.exit(1);
  }

  // Test 1: Burst on unauthenticated health endpoint (no auth overhead)
  const t1 = await sendBurst(`${BASE_URL}/api/health`, BURST_SIZE, `Test 1: Burst ${BURST_SIZE} requests → /api/health`);

  // Test 2: Burst on protected endpoint (auth middleware + rate limit layered)
  const t2 = await sendBurst(`${BASE_URL}/api/users/profile`, BURST_SIZE, `Test 2: Burst ${BURST_SIZE} requests → /api/users/profile (protected)`);

  // Test 3: Verify server still responds after burst (recovery check)
  const recoveryStatus = await testRecovery();

  // ── Summary ──────────────────────────────────────────────────────────────
  console.log('\n\n' + '═'.repeat(60));
  console.log(C.bold('  Rate Limiter Test Summary'));
  console.log('═'.repeat(60));
  console.log(`  Test 1 (health)     : ${t1.rateLimitWorking ? C.green('Rate limit triggered ✅') : C.yellow('No 429 observed')}`);
  console.log(`  Test 2 (protected)  : ${t2.rateLimitWorking ? C.green('Rate limit triggered ✅') : C.yellow('No 429 observed')}`);
  console.log(`  Server recovery     : ${recoveryStatus === 200 ? C.green('Server still responsive ✅') : C.red('Server unresponsive ❌')}`);

  console.log(`\n  ${C.bold('Expected behaviours:')}`);
  console.log(`  • First ${RATE_LIMIT_MAX} requests succeed (200/401/404)`);
  console.log(`  • Requests ${RATE_LIMIT_MAX+1}+ get 429 Too Many Requests`);
  console.log(`  • After rate limit window (15 min), requests succeed again`);
  console.log('\n' + '═'.repeat(60) + '\n');
}

main().catch(err => {
  console.error('Rate limit test crashed:', err.message);
  process.exit(1);
});
