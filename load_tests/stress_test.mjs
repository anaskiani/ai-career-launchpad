/**
 * load_tests/stress_test.mjs
 * ─────────────────────────────────────────────────────────────────────────
 * Pure Node.js stress / load test using autocannon.
 * No binary install needed — runs entirely via npm.
 *
 * Tests performed (each as a standalone benchmark):
 *   1. Health endpoint    — baseline latency
 *   2. Auth validation    — validation-only endpoints (no DB)
 *   3. Protected routes   — auth middleware throughput
 *   4. Concurrent spikes  — burst traffic simulation
 *
 * Usage:
 *   node load_tests/stress_test.mjs
 *   node load_tests/stress_test.mjs --url http://localhost:5000
 *
 * Output: Console table + JSON result files in load_tests/results/
 * ─────────────────────────────────────────────────────────────────────────
 */

import autocannon from 'autocannon';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dir = dirname(fileURLToPath(import.meta.url));
const RESULTS_DIR = join(__dir, 'results');
mkdirSync(RESULTS_DIR, { recursive: true });

const BASE_URL = process.argv.includes('--url')
  ? process.argv[process.argv.indexOf('--url') + 1]
  : 'http://127.0.0.1:5000';

// ── Colour helpers ────────────────────────────────────────────────────────────
const C = {
  green:  (s) => `\x1b[32m${s}\x1b[0m`,
  red:    (s) => `\x1b[31m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  cyan:   (s) => `\x1b[36m${s}\x1b[0m`,
  bold:   (s) => `\x1b[1m${s}\x1b[0m`,
};

function printBanner(title) {
  console.log('\n' + '═'.repeat(65));
  console.log(C.bold(C.cyan(`  ${title}`)));
  console.log('═'.repeat(65));
}

function printResult(name, result) {
  const p99  = result.latency.p99;
  const p95  = result.latency.p95;
  const med  = result.latency.median;
  const rps  = result.requests.average.toFixed(0);
  const err  = result.errors;
  const non2xx = result.non2xx;
  const total  = result.requests.total;

  const latOk = p99 < 3000 && p95 < 2000 && med < 500;
  const errOk = err === 0;
  const status = latOk && errOk ? C.green('✅  PASS') : C.red('❌  FAIL');

  console.log(`\n${C.bold(name)} — ${status}`);
  console.log(`  Requests total : ${total}`);
  console.log(`  Req/sec (avg)  : ${C.bold(rps)} rps`);
  console.log(`  Latency median : ${med < 500  ? C.green(med+'ms') : C.red(med+'ms')}`);
  console.log(`  Latency p95    : ${p95 < 2000 ? C.green(p95+'ms') : C.red(p95+'ms')}`);
  console.log(`  Latency p99    : ${p99 < 3000 ? C.green(p99+'ms') : C.red(p99+'ms')}`);
  console.log(`  Errors         : ${err > 0  ? C.red(err) : C.green(err)}`);
  console.log(`  Non-2xx/3xx    : ${non2xx > 0 ? C.yellow(non2xx) : C.green(non2xx)}`);

  return { name, passed: latOk && errOk, rps: Number(rps), p50: med, p95, p99, errors: err, non2xx, total };
}

// ── Run a single autocannon benchmark ────────────────────────────────────────
function runBenchmark(opts) {
  return new Promise((resolve, reject) => {
    const instance = autocannon({ ...opts }, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
    autocannon.track(instance, { renderProgressBar: true });
  });
}

// ── BENCHMARKS ───────────────────────────────────────────────────────────────

async function benchmarkHealth() {
  printBanner('BENCHMARK 1: Health Endpoint — Baseline Latency');
  console.log('Simulates 50 concurrent users for 20 seconds on /api/health\n');

  const result = await runBenchmark({
    url: `${BASE_URL}/api/health`,
    connections: 50,          // 50 concurrent connections
    duration: 20,             // 20 seconds
    title: 'Health endpoint',
  });
  return printResult('Health Endpoint (GET /api/health)', result);
}

async function benchmarkAuthValidation() {
  printBanner('BENCHMARK 2: Auth Validation — No-DB Throughput');
  console.log('Simulates 100 concurrent users hammering validation-only auth endpoints\n');

  const result = await runBenchmark({
    url: `${BASE_URL}/api/auth/login`,
    connections: 100,
    duration: 30,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),   // empty body → 400 (validation, no DB hit)
    title: 'Auth validation (empty body → 400)',
  });
  return printResult('Auth Validation (POST /api/auth/login — empty body)', result);
}

async function benchmarkProtectedRoutes() {
  printBanner('BENCHMARK 3: Auth Middleware — Protected Route Rejection Speed');
  console.log('Simulates 200 concurrent users hitting protected endpoints without tokens\n');

  const result = await runBenchmark({
    url: `${BASE_URL}/api/users/profile`,
    connections: 200,
    duration: 30,
    title: 'Protected route rejection (no token → 401)',
  });
  return printResult('Protected Route Rejection (GET /api/users/profile)', result);
}

async function benchmarkSkillsAuth() {
  printBanner('BENCHMARK 4: Skills Auth Guard');
  console.log('Tests /api/skills/roles auth rejection under 150 concurrent users\n');

  const result = await runBenchmark({
    url: `${BASE_URL}/api/skills/roles`,
    connections: 150,
    duration: 20,
    title: 'Skills auth guard',
  });
  return printResult('Skills Auth Guard (GET /api/skills/roles)', result);
}

async function benchmarkSpike() {
  printBanner('BENCHMARK 5: Spike Test — 500 Concurrent Connections (15s)');
  console.log('Simulates sudden viral burst of traffic. Measures stability under overload.\n');
  console.log(C.yellow('⚠️  Note: Expect some errors — this tests the breaking point.\n'));

  const result = await runBenchmark({
    url: `${BASE_URL}/api/health`,
    connections: 500,         // extreme concurrency
    duration: 15,
    title: 'Spike test (500 concurrent)',
  });
  return printResult('Spike Test (500 concurrent → /api/health)', result);
}

async function benchmarkSustained() {
  printBanner('BENCHMARK 6: Sustained Load — 60s at 300 Concurrent Users');
  console.log('Validates system stability over time. Checks for memory leaks / slowdowns.\n');

  const result = await runBenchmark({
    url: `${BASE_URL}/api/health`,
    connections: 300,
    duration: 60,
    title: 'Sustained load (300 concurrent, 60s)',
  });
  return printResult('Sustained Load Test (300 concurrent for 60s)', result);
}

// ── MAIN ─────────────────────────────────────────────────────────────────────

async function main() {
  console.clear();
  console.log(C.bold('\n🔥  AI Career Launchpad — Load & Stress Testing'));
  console.log(`   Target: ${C.cyan(BASE_URL)}`);
  console.log(`   Time  : ${new Date().toLocaleTimeString()}\n`);

  // Check server is up first
  try {
    const check = await fetch(`${BASE_URL}/api/health`);
    if (!check.ok) throw new Error(`Status ${check.status}`);
    console.log(C.green(`✔ Backend is reachable at ${BASE_URL}`));
  } catch (e) {
    console.error(C.red(`✖ Cannot reach backend at ${BASE_URL}: ${e.message}`));
    console.error(C.yellow('  Start the backend with: cd backend && node server.js'));
    process.exit(1);
  }

  const summaries = [];

  // Run benchmarks sequentially (results more reliable than parallel)
  summaries.push(await benchmarkHealth());
  summaries.push(await benchmarkAuthValidation());
  summaries.push(await benchmarkProtectedRoutes());
  summaries.push(await benchmarkSkillsAuth());
  summaries.push(await benchmarkSpike());
  summaries.push(await benchmarkSustained());

  // ── FINAL REPORT ───────────────────────────────────────────────────────────
  console.log('\n\n' + '═'.repeat(65));
  console.log(C.bold('  📊  LOAD TEST SUMMARY REPORT'));
  console.log('═'.repeat(65));
  console.log(`${'Test Name'.padEnd(46)} ${'RPS'.padEnd(8)} ${'p50'.padEnd(8)} ${'p95'.padEnd(8)} ${'p99'.padEnd(8)} Result`);
  console.log('─'.repeat(100));

  let passed = 0, failed = 0;
  for (const s of summaries) {
    const result = s.passed ? C.green('PASS') : C.red('FAIL');
    const row = [
      s.name.substring(0, 45).padEnd(46),
      String(s.rps).padEnd(8),
      (s.p50 + 'ms').padEnd(8),
      (s.p95 + 'ms').padEnd(8),
      (s.p99 + 'ms').padEnd(8),
      result,
    ].join(' ');
    console.log(row);
    if (s.passed) passed++; else failed++;
  }

  console.log('─'.repeat(100));
  console.log(`\n  ${C.green(`${passed} tests PASSED`)}  |  ${failed > 0 ? C.red(`${failed} tests FAILED`) : C.green('0 tests FAILED')}`);

  // Performance thresholds
  console.log('\n  📋 Thresholds Applied:');
  console.log('     Median latency  < 500ms');
  console.log('     p95 latency     < 2000ms');
  console.log('     p99 latency     < 3000ms');
  console.log('     Errors          = 0');

  // Save JSON results
  const report = {
    timestamp: new Date().toISOString(),
    target: BASE_URL,
    summary: summaries,
    passed,
    failed,
  };
  const outPath = join(RESULTS_DIR, `load-test-${Date.now()}.json`);
  writeFileSync(outPath, JSON.stringify(report, null, 2));
  console.log(`\n  💾 Results saved: ${outPath}`);
  console.log('\n' + '═'.repeat(65) + '\n');

  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(C.red('\n✖ Load test crashed: ' + err.message));
  process.exit(1);
});
