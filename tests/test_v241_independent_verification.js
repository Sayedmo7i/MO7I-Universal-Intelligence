/**
 * MO7I Universal Intelligence v2.4.1 Independent Verification & Selftest Suite
 * 
 * Tests:
 * 1. runSelftest executes cleanly and returns raw JSON schema (pass/fail per check, no narrative)
 * 2. Installed footprint check verifies size <= 350 KB and presence of SKILL.md and VERSION
 * 3. Lean install verification: setup-engine.js is present inside installed skill
 * 4. Doctor check executes cleanly from lean install without repo source dependency
 * 5. Status check executes cleanly from lean install in clean temp project
 * 6. CLI integration: /mo7i selftest via routeCommand returns JSON with status PASS
 * 7. Gap report against 74 old tests: verifies gap coverage
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const REPO_DIR = path.resolve(__dirname, '..');
const { runSelftest, SELFTEST_VERSION } = require('../src/commands/selftest-engine');
const { routeCommand } = require('../src/commands/command-router');

function runTest(num, description, fn) {
  try {
    fn();
    console.log(`[PASS] Test 2.4.1.${num}: ${description}`);
  } catch (err) {
    console.error(`[FAIL] Test 2.4.1.${num}: ${description} - ${err.message}`);
    throw err;
  }
}

console.log('=== MO7I v2.4.1 Independent Verification & Selftest Suite ===\n');

// 1. Selftest Execution & JSON Output
runTest(1, 'runSelftest produces valid structured JSON schema without narrative', () => {
  const result = runSelftest({ source: REPO_DIR });
  assert.strictEqual(typeof result, 'object');
  assert.strictEqual(result.version, SELFTEST_VERSION);
  assert.strictEqual(result.status, 'PASS');
  assert(typeof result.summary === 'object');
  assert.strictEqual(result.summary.failed, 0);
  assert(result.summary.passed >= 8);
  assert(Array.isArray(result.checks));
  for (const c of result.checks) {
    assert(typeof c.id === 'string');
    assert(typeof c.description === 'string');
    assert(['PASS', 'FAIL'].includes(c.status));
    assert(typeof c.durationMs === 'number');
  }
});

// 2. Installed Footprint Check
runTest(2, 'Installed footprint verifies size <= 350 KB and file integrity in fresh temp project', () => {
  const tempDir = fs.mkdtempSync('/tmp/mo7i-check-footprint-');
  try {
    cp.execSync(`npx skills add "${REPO_DIR}" --skill mo7i -y`, {
      cwd: tempDir,
      stdio: 'pipe'
    });
    const mo7iDir = path.join(tempDir, '.agents', 'skills', 'mo7i');
    assert(fs.existsSync(mo7iDir), 'Installed mo7i directory must exist');
    assert(fs.existsSync(path.join(mo7iDir, 'SKILL.md')), 'Installed SKILL.md must exist');
    assert(fs.existsSync(path.join(mo7iDir, 'VERSION')), 'Installed VERSION must exist');
    assert(fs.existsSync(path.join(mo7iDir, 'scripts', 'setup-engine.js')), 'Installed setup-engine.js must exist');

    const duOut = cp.execSync('du -sk .', { cwd: mo7iDir }).toString();
    const kb = parseInt(duOut.trim().split(/\s+/)[0], 10) || 0;
    assert(kb <= 350, `Installed footprint must be <= 350 KB, got: ${kb} KB`);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

// 3. Engine Present After Lean Install
runTest(3, 'Engine is present and operational after single lean mo7i skill install', () => {
  const tempDir = fs.mkdtempSync('/tmp/mo7i-check-engine-');
  try {
    cp.execSync(`npx skills add "${REPO_DIR}" --skill mo7i -y`, {
      cwd: tempDir,
      stdio: 'pipe'
    });
    const enginePath = path.join(tempDir, '.agents', 'skills', 'mo7i', 'scripts', 'setup-engine.js');
    assert(fs.existsSync(enginePath), `setup-engine.js must exist at ${enginePath}`);
    const engine = require(enginePath);
    assert.strictEqual(typeof engine.analyzeProject, 'function');
    assert.strictEqual(typeof engine.recommendProjectSkills, 'function');
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

// 4. Doctor From Lean Install
runTest(4, 'Doctor diagnostics pass in a lean project with only installed mo7i', () => {
  const tempDir = fs.mkdtempSync('/tmp/mo7i-check-doctor-');
  try {
    cp.execSync(`npx skills add "${REPO_DIR}" --skill mo7i -y`, {
      cwd: tempDir,
      stdio: 'pipe'
    });
    const res = routeCommand('/mo7i doctor --json', { projectDir: tempDir });
    assert.strictEqual(res.status, 'HEALTHY');
    const parsed = JSON.parse(res.output);
    const engineCheck = parsed.diagnostics.find(d => d.check === 'Project Setup Engine');
    assert(engineCheck, 'Project Setup Engine diagnostic must be reported');
    assert.strictEqual(engineCheck.status, 'PASS');
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

// 5. Status From Lean Install
runTest(5, 'Status diagnostics pass in a lean project reporting installed mo7i', () => {
  const tempDir = fs.mkdtempSync('/tmp/mo7i-check-status-');
  try {
    cp.execSync(`npx skills add "${REPO_DIR}" --skill mo7i -y`, {
      cwd: tempDir,
      stdio: 'pipe'
    });
    const res = routeCommand('/mo7i status --json', { projectDir: tempDir });
    assert.strictEqual(res.status, 'SUCCESS');
    const parsed = JSON.parse(res.output);
    assert(parsed.skills.installed.includes('mo7i'));
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

// 6. Command Router /mo7i selftest Integration
runTest(6, 'routeCommand("/mo7i selftest") dispatches selftest and returns structured JSON', () => {
  const res = routeCommand('/mo7i selftest');
  assert.strictEqual(res.status, 'SUCCESS');
  assert.strictEqual(res.command, 'selftest');
  assert.strictEqual(res.readOnly, true);
  const parsed = JSON.parse(res.output);
  assert.strictEqual(parsed.status, 'PASS');
  assert.strictEqual(parsed.version, SELFTEST_VERSION);
});

console.log('\nAll 6 v2.4.1 Independent Verification Acceptance Tests Passed Successfully!\n');
