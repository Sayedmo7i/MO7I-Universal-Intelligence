/**
 * MO7I Universal Intelligence v2.6.0 Acceptance Test Suite
 * Phases D, E, F: Overhead Benchmarking, Platform Honesty & Publish Readiness
 * 
 * Tests:
 * 2.6.1: Benchmark engine runs all 5 tasks and measures baseline vs orchestrated metrics
 * 2.6.2: /mo7i bench CLI and programmatic route outputs formatted markdown report and supports --json
 * 2.6.3: Benchmark reports honest overhead analysis (trivial edit/question) and documents fast-path bypass
 * 2.6.4: Platform verification matrix honestly marks Universal CLI & Agent Skills as VERIFIED, and Claude Code/Cursor/Codex/Gemini as UNVERIFIED
 * 2.6.5: Strict platform-agnostic check asserts zero occurrences of prohibited names in code, docs, and skills
 * 2.6.6: Pre-publish readiness checklist, license, and security policy pass all gate criteria
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const { runBenchmark } = require('../src/commands/bench-engine');
const { routeCommand } = require('../src/commands/command-router');
const { PLATFORM_VERIFICATION } = require('../src/commands/platform-installer');

let passedTests = 0;
let failedTests = 0;

function runTest(num, description, fn) {
  try {
    fn();
    passedTests++;
    console.log(`[PASS] Test 2.6.${num}: ${description}`);
  } catch (err) {
    failedTests++;
    console.error(`[FAIL] Test 2.6.${num}: ${description} - ${err.message}`);
    throw err;
  }
}

console.log('=== MO7I v2.6.0 Overhead Benchmarking, Platform Honesty & Publish Readiness Suite ===\n');

try {
  // Test 2.6.1: Benchmark engine runs all 5 tasks and measures baseline vs orchestrated metrics
  runTest(1, 'Benchmark engine runs all 5 tasks and measures baseline vs orchestrated metrics', () => {
    const res = runBenchmark();
    assert.strictEqual(res.results.length, 5, 'Must benchmark exactly 5 standard tasks');
    
    for (const r of res.results) {
      assert.ok(r.baseline.wallTimeMs > 0, `Baseline wall time must be > 0 for ${r.task}`);
      assert.ok(r.orchestrated.wallTimeMs > 0, `Orchestrated wall time must be > 0 for ${r.task}`);
      assert.ok(r.orchestrated.phasesRun >= 4, `Orchestrated phases run must be >= 4 for ${r.task}`);
      assert.ok(r.overhead.timeOverheadFactor, `Overhead factor must be computed for ${r.task}`);
    }
  });

  // Test 2.6.2: /mo7i bench CLI and programmatic route outputs formatted markdown report and supports --json
  runTest(2, '/mo7i bench route outputs formatted markdown report and supports --json', () => {
    const mdRes = routeCommand('bench');
    assert.strictEqual(mdRes.status, 'SUCCESS');
    assert.ok(mdRes.output.includes('# MO7I Universal Intelligence — Overhead & Performance Benchmark'));
    assert.ok(mdRes.output.includes('Executive Summary Table'));

    const jsonRes = routeCommand('bench --json');
    assert.strictEqual(jsonRes.status, 'SUCCESS');
    const parsed = JSON.parse(jsonRes.output);
    assert.strictEqual(parsed.results.length, 5);
    assert.ok(parsed.tokenTelemetryNotice.includes('Token telemetry is not exposed'));
  });

  // Test 2.6.3: Benchmark reports honest overhead analysis (trivial edit/question) and documents fast-path bypass
  runTest(3, 'Benchmark reports honest overhead analysis (trivial edit/question) and documents fast-path bypass', () => {
    const res = runBenchmark();
    const md = res.markdownReport;

    assert.ok(md.includes('Where MO7I Adds Overhead Without Benefit'), 'Must include honest overhead section');
    assert.ok(md.includes('Trivial Edits'), 'Must analyze trivial edits overhead');
    assert.ok(md.includes('Direct Factual Questions'), 'Must analyze direct questions overhead');
    assert.ok(md.includes('Fast-Path Bypass Recommendation'), 'Must document fast-path recommendation');
    assert.ok(fs.existsSync(path.resolve(__dirname, '../docs/BENCHMARK.md')), 'docs/BENCHMARK.md must exist on disk');
  });

  // Test 2.6.4: Platform verification matrix honestly marks Universal CLI & Agent Skills as VERIFIED, and Claude Code/Cursor/Codex/Gemini as UNVERIFIED
  runTest(4, 'Platform verification matrix honestly marks Universal CLI & Agent Skills as VERIFIED, and Claude Code/Cursor/Codex/Gemini as UNVERIFIED', () => {
    assert.strictEqual(PLATFORM_VERIFICATION['Universal Shell & CLI (bin/mo7i)'].status, 'VERIFIED');
    assert.strictEqual(PLATFORM_VERIFICATION['Standard Agent Skills (.agents/skills/)'].status, 'VERIFIED');
    
    assert.strictEqual(PLATFORM_VERIFICATION['Claude Code Local (.claude/commands/)'].status, 'UNVERIFIED');
    assert.ok(PLATFORM_VERIFICATION['Claude Code Local (.claude/commands/)'].note.includes('login'));
    assert.strictEqual(PLATFORM_VERIFICATION['Cursor / Windsurf (.cursor/rules/)'].status, 'UNVERIFIED');
    assert.strictEqual(PLATFORM_VERIFICATION['OpenAI Codex (.codex/prompts/)'].status, 'UNVERIFIED');
    assert.strictEqual(PLATFORM_VERIFICATION['Gemini CLI (.gemini/commands/)'].status, 'UNVERIFIED');
  });

  // Test 2.6.5: Strict platform-agnostic check asserts zero occurrences of prohibited names in code, docs, and skills
  runTest(5, 'Strict platform-agnostic check asserts zero occurrences of prohibited names in code, docs, and skills', () => {
    const repoRoot = path.resolve(__dirname, '..');
    const grepCmd = `grep -rnI -i "t3 code" "${repoRoot}/src" "${repoRoot}/skills" "${repoRoot}/references" "${repoRoot}/bin" "${repoRoot}/README.md" || true`;
    const hits = cp.execSync(grepCmd).toString().trim();
    assert.strictEqual(hits, '', `Prohibited platform name 'T3 Code' found in codebase:\n${hits}`);
  });

  // Test 2.6.6: Pre-publish readiness checklist, license, and security policy pass all gate criteria
  runTest(6, 'Pre-publish readiness checklist, license, and security policy pass all gate criteria', () => {
    const checklistPath = path.resolve(__dirname, '../docs/PUBLISH-CHECKLIST.md');
    assert.ok(fs.existsSync(checklistPath), 'docs/PUBLISH-CHECKLIST.md must exist');
    const checklist = fs.readFileSync(checklistPath, 'utf8');
    assert.ok(checklist.includes('Git History Deep Scan:'), 'Must include Git History Deep Scan section');
    assert.ok(checklist.includes('git log -p'), 'Must cite git log -p command');
    assert.ok(checklist.includes('CLEAN'), 'Must assert Verdict: CLEAN');

    const securityPath = path.resolve(__dirname, '../SECURITY.md');
    const security = fs.readFileSync(securityPath, 'utf8');
    assert.ok(security.includes('2.x.x'), 'SECURITY.md must support 2.x.x');

    const readmePath = path.resolve(__dirname, '../README.md');
    const readme = fs.readFileSync(readmePath, 'utf8');
    const requiredRoleStatement = 'A project onboarding and orchestration layer for AI agents: detects the stack, provisions the right skills, tracks manual setup steps, selects the minimum skills per task, verifies with evidence, and logs every run. Same commands and same state (.mo7i/) across projects and agents.';
    assert.ok(readme.includes(requiredRoleStatement), 'README.md must contain exact required role statement');
  });

  console.log(`\nAll ${passedTests} v2.6.0 tests passed successfully!\n`);
} catch (err) {
  console.error('\nv2.6.0 Test suite failed!');
  process.exit(1);
}
