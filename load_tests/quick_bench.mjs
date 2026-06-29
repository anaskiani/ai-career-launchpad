/**
 * load_tests/quick_bench.mjs
 * ─────────────────────────────────────────────────────────────────────────
 * Quick 30-second benchmark — run this for a fast sanity check.
 * No dependencies beyond Node.js built-in fetch.
 *
 * Usage:
 *   node load_tests/quick_bench.mjs
 * ─────────────────────────────────────────────────────────────────────────
 */

const BASE_URL = 'http://localhost:5000';
const CONCURRENCY = 50;
const DURATION_MS = 30_000;

const C = {
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  red:   (s) => `\x1b[31m${s}\x1b[0m`,
  cyan:  (s) => `\x1b[36m${s}\x1b[0m`,
  bold:  (s) => `\x1b[1m${s}\x1b[0m`,
};

const endpoints = [
  { method: 'GET',  url: '/api/health',          body: null,                   expect: 200 },
  { method: 'GET',  url: '/api/users/profile',   body: null,                   expect: 401 },
  { method: 'GET',  url: '/api/skills/roles',    body: null,                   expect: 401 },
  { method: 'POST', url: '/api/auth/login',      body: JSON.stringify({}),     expect: [400,401] },
  { method: 'GET',  url: '/api/skills/history',  body: null,                   expect: 401 },
];

async function runEndpoint(ep) {
  const timings = [];
  const statuses = {};
  let errors = 0;
  const deadline = Date.now() + DURATION_MS;

  // Keep firing concurrent requests until deadline
  while (Date.now() < deadline) {
    const batch = Array.from({ length: CONCURRENCY }, async () => {
      const t0 = performance.now();
      try {
        const opts = { method: ep.method };
        if (ep.body) opts.body = ep.body;
        if (ep.body) opts.headers = { 'Content-Type': 'application/json' };
        const res = await fetch(`${BASE_URL}${ep.url}`, opts);
        const elapsed = performance.now() - t0;
        timings.push(elapsed);
        statuses[res.status] = (statuses[res.status] || 0) + 1;
      } catch {
        errors++;
      }
    });
    await Promise.all(batch);
  }

  timings.sort((a, b) => a - b);
  const total   = timings.length;
  const sum     = timings.reduce((a, b) => a + b, 0);
  const avg     = sum / total;
  const p50     = timings[Math.floor(total * 0.50)] || 0;
  const p95     = timings[Math.floor(total * 0.95)] || 0;
  const p99     = timings[Math.floor(total * 0.99)] || 0;
  const rps     = Math.round(total / (DURATION_MS / 1000));
  const expects = Array.isArray(ep.expect) ? ep.expect : [ep.expect];
  const allOk   = Object.keys(statuses).every(s => expects.includes(Number(s)));
  const passed  = allOk && errors === 0 && p99 < 3000;

  return { url: ep.url, total, rps, avg: avg.toFixed(1), p50: p50.toFixed(1), p95: p95.toFixed(1), p99: p99.toFixed(1), statuses, errors, passed };
}

async function main() {
  console.log(C.bold('\n⚡  Quick Benchmark — 30s per endpoint'));
  console.log(`   Target      : ${C.cyan(BASE_URL)}`);
  console.log(`   Concurrency : ${CONCURRENCY} simultaneous requests`);
  console.log(`   Duration    : ${DURATION_MS / 1000}s per endpoint\n`);

  // Verify server
  try {
    await fetch(`${BASE_URL}/api/health`, { signal: AbortSignal.timeout(4000) });
    console.log(C.green('✔ Backend reachable\n'));
  } catch {
    console.error(C.red('✖ Backend not reachable at ' + BASE_URL));
    process.exit(1);
  }

  const results = [];
  for (const ep of endpoints) {
    process.stdout.write(`  Running ${ep.method} ${ep.url} ...`);
    const r = await runEndpoint(ep);
    process.stdout.write(` ${r.rps} rps\n`);
    results.push(r);
  }

  // Print report
  console.log('\n' + '═'.repeat(90));
  console.log(C.bold('  Quick Bench Results'));
  console.log('═'.repeat(90));
  console.log(`${'Endpoint'.padEnd(30)} ${'RPS'.padEnd(8)} ${'Avg'.padEnd(8)} ${'p50'.padEnd(8)} ${'p95'.padEnd(8)} ${'p99'.padEnd(8)} ${'Errors'.padEnd(8)} Pass?`);
  console.log('─'.repeat(90));

  for (const r of results) {
    const pass = r.passed ? C.green('✅') : C.red('❌');
    console.log(
      r.url.padEnd(30) +
      String(r.rps).padEnd(8) +
      (r.avg + 'ms').padEnd(8) +
      (r.p50 + 'ms').padEnd(8) +
      (r.p95 + 'ms').padEnd(8) +
      (r.p99 + 'ms').padEnd(8) +
      String(r.errors).padEnd(8) +
      pass
    );
  }

  console.log('─'.repeat(90));
  const passed = results.filter(r => r.passed).length;
  console.log(`\n  ${C.green(passed + '/' + results.length + ' endpoints within thresholds')}\n`);
}

main().catch(e => { console.error(e.message); process.exit(1); });
