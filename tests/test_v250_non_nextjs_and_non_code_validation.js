/**
 * MO7I Universal Intelligence v2.5.0 Acceptance Test Suite
 * Phase C: Non-Next.js and Non-Code Validation
 * 
 * Tests:
 * 2.5.1: Python/FastAPI fixture project analysis detects archetype and Python stack
 * 2.5.2: /mo7i setup initial on Python/FastAPI excludes Next.js, frontend, and TypeScript skills
 * 2.5.3: Non-technical empty folder fixture detects Non-Technical / General Workspace archetype
 * 2.5.4: /mo7i setup initial on non-technical workspace excludes all code-specific and frontend skills
 * 2.5.5: Real research task enforces evidence protocol (3+ searches, 2+ sources) and writes .mo7i/runs/
 * 2.5.6: Research validation rejects citations of URLs not returned by tools (anti-hallucination guard)
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { routeCommand, validateResearchEvidence } = require('../src/commands/command-router');
const { analyzeProject, recommendProjectSkills, runEngine } = require('../skills/mo7i/scripts/setup-engine');

let passedTests = 0;
let failedTests = 0;

function runTest(num, description, fn) {
  try {
    fn();
    passedTests++;
    console.log(`[PASS] Test 2.5.${num}: ${description}`);
  } catch (err) {
    failedTests++;
    console.error(`[FAIL] Test 2.5.${num}: ${description} - ${err.message}`);
    throw err;
  }
}

console.log('=== MO7I v2.5.0 Non-Next.js & Non-Code Validation Suite ===\n');

// Fixture 1: Python / FastAPI
const tmpFastapiDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mo7i-fastapi-test-'));
fs.mkdirSync(path.join(tmpFastapiDir, 'tests'), { recursive: true });
fs.writeFileSync(path.join(tmpFastapiDir, 'requirements.txt'), 'fastapi>=0.110.0\nuvicorn>=0.28.0\npytest>=8.0.0\n');
fs.writeFileSync(path.join(tmpFastapiDir, 'main.py'), 'from fastapi import FastAPI\napp = FastAPI()\n@app.get("/")\ndef root(): return {"status": "ok"}\n');
fs.writeFileSync(path.join(tmpFastapiDir, 'tests', 'test_main.py'), 'def test_dummy(): assert True\n');

// Fixture 2: Non-Technical Empty Workspace
const tmpNontechDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mo7i-nontech-test-'));

try {
  // Test 2.5.1: Python/FastAPI fixture stack analysis
  runTest(1, 'Python/FastAPI fixture project analysis detects archetype and Python stack', () => {
    const profile = analyzeProject(tmpFastapiDir);
    assert.strictEqual(profile.type, 'Web API Service (FastAPI)', 'Profile type must be Web API Service (FastAPI)');
    assert.ok(profile.languages.includes('Python'), 'Languages must include Python');
    assert.ok(!profile.languages.includes('TypeScript'), 'Languages must not include TypeScript');
    assert.ok(!profile.languages.includes('JavaScript'), 'Languages must not include JavaScript');
    assert.ok(profile.testFrameworks.includes('Pytest'), 'Test frameworks must include Pytest');
  });

  // Test 2.5.2: /mo7i setup initial on Python/FastAPI excludes Next.js, frontend, and TS skills
  runTest(2, '/mo7i setup initial on Python/FastAPI excludes Next.js, frontend, and TypeScript skills', () => {
    const res = routeCommand('/mo7i setup initial', tmpFastapiDir, { dryRun: true });
    assert.strictEqual(res.status, 'SUCCESS', 'Setup initial must succeed');
    assert.strictEqual(res.result.profile.type, 'Web API Service (FastAPI)');
    
    const installedSkillIds = res.result.installResults.successful.map(s => s.id);
    assert.ok(installedSkillIds.includes('codebase-design'), 'Must include codebase-design');
    assert.ok(!installedSkillIds.includes('nextjs-best-practices'), 'Must NOT include nextjs-best-practices');
    assert.ok(!installedSkillIds.includes('frontend-design'), 'Must NOT include frontend-design');
    assert.ok(!installedSkillIds.includes('setup-ts-deep-modules'), 'Must NOT include setup-ts-deep-modules');
    assert.ok(!installedSkillIds.includes('migrate-to-shoehorn'), 'Must NOT include migrate-to-shoehorn');
    assert.ok(!installedSkillIds.includes('flutter-specialist'), 'Must NOT include flutter-specialist');
    assert.ok(!installedSkillIds.includes('laravel-core'), 'Must NOT include laravel-core');
  });

  // Test 2.5.3: Non-technical empty folder fixture detects Non-Technical / General Workspace archetype
  runTest(3, 'Non-technical empty folder fixture detects Non-Technical / General Workspace archetype', () => {
    const profile = analyzeProject(tmpNontechDir);
    assert.strictEqual(profile.type, 'Non-Technical / General Workspace', 'Profile type must be Non-Technical / General Workspace');
    assert.strictEqual(profile.architecture, 'Document & Research Workspace', 'Architecture must be Document & Research Workspace');
    assert.strictEqual(profile.languages.length, 0, 'Languages must be empty');
    assert.strictEqual(profile.frameworks.length, 0, 'Frameworks must be empty');
  });

  // Test 2.5.4: /mo7i setup initial on non-technical workspace excludes all code-specific and frontend skills
  runTest(4, '/mo7i setup initial on non-technical workspace excludes all code-specific and frontend skills', () => {
    const res = routeCommand('/mo7i setup initial', tmpNontechDir, { dryRun: true });
    assert.strictEqual(res.status, 'SUCCESS', 'Setup initial must succeed');
    assert.strictEqual(res.result.profile.type, 'Non-Technical / General Workspace');

    const installedSkillIds = res.result.installResults.successful.map(s => s.id);
    // Allowed documentation and research skills
    assert.ok(installedSkillIds.includes('research'), 'Must include research skill');
    assert.ok(installedSkillIds.includes('writing-for-agents'), 'Must include writing-for-agents');
    
    // Explicit exclusions of software engineering and framework tooling
    assert.ok(!installedSkillIds.includes('nextjs-best-practices'), 'Must NOT include nextjs-best-practices');
    assert.ok(!installedSkillIds.includes('frontend-design'), 'Must NOT include frontend-design');
    assert.ok(!installedSkillIds.includes('setup-ts-deep-modules'), 'Must NOT include setup-ts-deep-modules');
    assert.ok(!installedSkillIds.includes('migrate-to-shoehorn'), 'Must NOT include migrate-to-shoehorn');
    assert.ok(!installedSkillIds.includes('tdd'), 'Must NOT include tdd');
    assert.ok(!installedSkillIds.includes('code-review'), 'Must NOT include code-review');
    assert.ok(!installedSkillIds.includes('diagnosing-bugs'), 'Must NOT include diagnosing-bugs');
    assert.ok(!installedSkillIds.includes('setup-pre-commit'), 'Must NOT include setup-pre-commit');
  });

  // Test 2.5.5: Real research task enforces evidence protocol (3+ searches, 2+ sources) and writes .mo7i/runs/
  runTest(5, 'Real research task enforces evidence protocol (3+ searches, 2+ sources) and writes .mo7i/runs/', () => {
    const task = 'Summarize the latest developments on sodium-ion batteries in grid energy storage with sources.';
    const res = routeCommand(task, tmpNontechDir, {
      webSearches: [
        'latest developments sodium-ion batteries energy storage 2025 2026',
        'CATL TENER sodium energy storage BESS specifications 2025 2026',
        'Peak Energy Jupiter Power sodium-ion BESS grid project United States 2025 2026'
      ],
      sourcesFetched: [
        'https://peakenergy.com',
        'https://volta.foundation'
      ],
      citedUrls: [
        'https://peakenergy.com',
        'https://volta.foundation'
      ],
      toolReturnedUrls: [
        'https://peakenergy.com',
        'https://volta.foundation',
        'https://catl.com',
        'https://energy-storage.news'
      ]
    });

    assert.strictEqual(res.status, 'DISPATCHED', 'Task must be dispatched');
    assert.strictEqual(res.domain, 'Research & Analysis', 'Domain must be classified as Research & Analysis');
    assert.strictEqual(res.projectArchetype, 'Non-Technical / General Workspace', 'Target project must remain Non-Technical');
    assert.ok(res.researchValidation, 'Research validation object must exist');
    assert.strictEqual(res.researchValidation.valid, true, 'Research evidence must pass validation');
    assert.ok(fs.existsSync(res.runLogPath), 'Run log file must exist on disk');

    const savedLog = JSON.parse(fs.readFileSync(res.runLogPath, 'utf8'));
    assert.strictEqual(savedLog.task, task);
    assert.strictEqual(savedLog.domain, 'Research & Analysis');
    assert.strictEqual(savedLog.status, 'PASS');
    assert.strictEqual(savedLog.toolsCalled.length, 5);
    assert.ok(savedLog.toolsCalled.includes('search_web'));
    assert.ok(savedLog.toolsCalled.includes('read_url_content'));
    assert.strictEqual(savedLog.metadata.isResearchTask, true);
  });

  // Test 2.5.6: Research validation rejects citations of URLs not returned by tools (anti-hallucination guard)
  runTest(6, 'Research validation rejects citations of URLs not returned by tools (anti-hallucination guard)', () => {
    const invalidValidation = validateResearchEvidence({
      webSearches: ['query 1', 'query 2', 'query 3'],
      sourcesFetched: ['https://valid.org/source1', 'https://valid.org/source2'],
      citedUrls: ['https://valid.org/source1', 'https://hallucinated-fake-url.com/paper'],
      toolReturnedUrls: ['https://valid.org/source1', 'https://valid.org/source2']
    });

    assert.strictEqual(invalidValidation.valid, false, 'Validation must reject unverified citation');
    assert.ok(invalidValidation.error.includes('Anti-hallucination violation'), 'Error must identify hallucination violation');
    assert.ok(invalidValidation.invalidUrls.includes('https://hallucinated-fake-url.com/paper'), 'Must list hallucinated URL');
  });

} finally {
  // Cleanup test directories
  fs.rmSync(tmpFastapiDir, { recursive: true, force: true });
  fs.rmSync(tmpNontechDir, { recursive: true, force: true });
}

console.log('\nAll 6 v2.5.0 Non-Next.js & Non-Code Acceptance Tests Passed Successfully!\n');
