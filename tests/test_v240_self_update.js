/**
 * MO7I Universal Intelligence v2.4.0 Self-Update Test Suite
 * 
 * Tests with fixtures:
 * 1. Up-to-date detection (--check and execution)
 * 2. Newer version available (--check, human gate, and successful --yes install)
 * 3. Network / authentication failure (stops immediately and reports exact error)
 * 4. Install failure + rollback (restores original skills, preserves secrets & other skills)
 * 5. Dry-run changes nothing (simulates backup and commands without disk modification)
 * 6. Scope detection (project vs global install)
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const REPO_DIR = path.resolve(__dirname, '..');
const {
  parseSemver,
  compareSemver,
  getInstalledVersion,
  getLatestVersion,
  detectInstallScope,
  backupSkills,
  rollbackSkills,
  handleSelfUpdate,
  NEUTRAL_RESTART_NOTICE
} = require('../src/commands/self-update-engine');
const { routeCommand } = require('../src/commands/command-router');

function runTest(num, description, fn) {
  try {
    fn();
    console.log(`[PASS] Test 2.4.${num}: ${description}`);
  } catch (err) {
    console.error(`[FAIL] Test 2.4.${num}: ${description} - ${err.message}`);
    throw err;
  }
}

console.log('=== MO7I v2.4.0 Self-Update Acceptance Test Suite ===\n');

// 1. Semver Parsing and Comparison
runTest(1, 'Semver parsing and comparison handles standard and prefixed tags', () => {
  assert.deepStrictEqual(parseSemver('2.4.0'), [2, 4, 0]);
  assert.deepStrictEqual(parseSemver('v2.3.1'), [2, 3, 1]);
  assert.deepStrictEqual(parseSemver('v3.0.0-rc.1'), [3, 0, 0]);

  assert.strictEqual(compareSemver('2.4.0', '2.3.1'), 1);
  assert.strictEqual(compareSemver('2.3.0', '2.3.0'), 0);
  assert.strictEqual(compareSemver('2.3.0', '2.4.0'), -1);
});

// 2. Installed Version Detection
runTest(2, 'Installed version detection reads VERSION file or SKILL.md frontmatter', () => {
  const tempDir = fs.mkdtempSync('/tmp/mo7i-test-version-');
  const skillDir = path.join(tempDir, 'skills', 'mo7i');
  fs.mkdirSync(skillDir, { recursive: true });

  // From VERSION file
  fs.writeFileSync(path.join(skillDir, 'VERSION'), '2.4.0\n');
  assert.strictEqual(getInstalledVersion(tempDir), '2.4.0');

  // From SKILL.md frontmatter if VERSION file absent
  fs.rmSync(path.join(skillDir, 'VERSION'));
  fs.writeFileSync(path.join(skillDir, 'SKILL.md'), '---\nname: mo7i\ndescription: "v2.3.5 test"\n---\n# MO7I (v2.3.5)');
  assert.strictEqual(getInstalledVersion(tempDir), '2.3.5');

  fs.rmSync(tempDir, { recursive: true, force: true });
});

// 3. Up-to-date Fixture
runTest(3, 'Up-to-date: --check reports up-to-date and execution makes zero changes', () => {
  const tempDir = fs.mkdtempSync('/tmp/mo7i-test-uptodate-');
  const skillDir = path.join(tempDir, 'skills', 'mo7i');
  fs.mkdirSync(skillDir, { recursive: true });
  fs.writeFileSync(path.join(skillDir, 'VERSION'), '2.4.0\n');

  // --check mode
  const checkRes = routeCommand('/mo7i self-update --check', {
    projectDir: tempDir,
    mockLatestVersion: '2.4.0'
  });
  assert.strictEqual(checkRes.status, 'SUCCESS');
  assert.strictEqual(checkRes.readOnly, true);
  assert.strictEqual(checkRes.isUpToDate, true);
  assert(checkRes.output.includes('MO7I is up to date'));

  // Normal execution when already up-to-date
  const runRes = routeCommand('/mo7i self-update', {
    projectDir: tempDir,
    mockLatestVersion: '2.4.0'
  });
  assert.strictEqual(runRes.status, 'SUCCESS');
  assert.strictEqual(runRes.isUpToDate, true);
  assert(runRes.output.includes('already up to date'));

  fs.rmSync(tempDir, { recursive: true, force: true });
});

// 4. Newer Version Available: --check and Human Gate
runTest(4, 'Newer available: --check displays changelog and default mode enforces Human Gate', () => {
  const tempDir = fs.mkdtempSync('/tmp/mo7i-test-newer-');
  const skillDir = path.join(tempDir, 'skills', 'mo7i');
  fs.mkdirSync(skillDir, { recursive: true });
  fs.writeFileSync(path.join(skillDir, 'VERSION'), '2.3.0\n');
  fs.writeFileSync(path.join(tempDir, 'CHANGELOG.md'), '## [2.4.0]\n- Self-update support\n- Rollback engine\n');

  // --check mode
  const checkRes = routeCommand('/mo7i self-update --check', {
    projectDir: tempDir,
    mockLatestVersion: '2.4.0'
  });
  assert.strictEqual(checkRes.status, 'SUCCESS');
  assert.strictEqual(checkRes.isUpToDate, false);
  assert(checkRes.output.includes('Update available (v2.3.0 -> v2.4.0)'));
  assert(checkRes.output.includes('Self-update support'));

  // Default mode without --yes triggers Human Gate
  const gateRes = routeCommand('/mo7i self-update', {
    projectDir: tempDir,
    mockLatestVersion: '2.4.0'
  });
  assert.strictEqual(gateRes.status, 'GATE_REQUIRED');
  assert.strictEqual(gateRes.requiresApproval, true);
  assert(gateRes.output.includes('[MO7I HUMAN GATE: SELF-UPDATE CONFIRMATION REQUIRED]'));
  assert(gateRes.output.includes('/mo7i self-update --yes'));

  fs.rmSync(tempDir, { recursive: true, force: true });
});

// 5. Dry-Run Changes Nothing
runTest(5, 'Dry-run changes nothing: simulates backup and commands without touching disk', () => {
  const tempDir = fs.mkdtempSync('/tmp/mo7i-test-dryrun-');
  const skillDir = path.join(tempDir, 'skills', 'mo7i');
  fs.mkdirSync(skillDir, { recursive: true });
  fs.writeFileSync(path.join(skillDir, 'VERSION'), '2.3.0\n');

  const dryRes = routeCommand('/mo7i self-update --dry-run', {
    projectDir: tempDir,
    mockLatestVersion: '2.4.0'
  });

  assert.strictEqual(dryRes.status, 'SUCCESS');
  assert.strictEqual(dryRes.dryRun, true);
  assert(dryRes.output.includes('[MO7I Self-Update (Dry Run)]'));
  assert(dryRes.output.includes('Zero modifications applied'));

  // Verify no backups or modifications occurred
  const backupDir = path.join(tempDir, '.mo7i', 'backups');
  assert(!fs.existsSync(backupDir), 'Backup directory must not be created during dry-run');
  assert.strictEqual(fs.readFileSync(path.join(skillDir, 'VERSION'), 'utf8').trim(), '2.3.0');

  fs.rmSync(tempDir, { recursive: true, force: true });
});

// 6. Network Failure: Reports exact error and stops immediately
runTest(6, 'Network failure: stops execution immediately and surfaces exact error', () => {
  const tempDir = fs.mkdtempSync('/tmp/mo7i-test-neterr-');
  const skillDir = path.join(tempDir, 'skills', 'mo7i');
  fs.mkdirSync(skillDir, { recursive: true });
  fs.writeFileSync(path.join(skillDir, 'VERSION'), '2.3.0\n');

  const exactGitError = "fatal: unable to access 'https://github.com/Sayedmo7i/MO7I-Universal-Intelligence.git': Could not resolve host: github.com";
  const errRes = routeCommand('/mo7i self-update --yes', {
    projectDir: tempDir,
    mockNetworkError: exactGitError
  });

  assert.strictEqual(errRes.status, 'ERROR');
  assert(errRes.output.includes('[MO7I Self-Update Error] Network/authentication failure'));
  assert(errRes.output.includes(exactGitError));

  // Verify disk remains untouched
  const backupDir = path.join(tempDir, '.mo7i', 'backups');
  assert(!fs.existsSync(backupDir), 'Backup must not be created on network failure');

  fs.rmSync(tempDir, { recursive: true, force: true });
});

// 7. Install Failure + Rollback: Restores original skills, preserves other skills & secrets
runTest(7, 'Install failure + rollback: restores original skills without touching secrets or other skills', () => {
  const tempDir = fs.mkdtempSync('/tmp/mo7i-test-rollback-');
  const skillsDir = path.join(tempDir, 'skills');
  const mo7iDir = path.join(skillsDir, 'mo7i');
  const mo7iSetupDir = path.join(skillsDir, 'mo7i-project-setup');
  const otherSkillDir = path.join(skillsDir, 'custom-unrelated-skill');
  fs.mkdirSync(mo7iDir, { recursive: true });
  fs.mkdirSync(mo7iSetupDir, { recursive: true });
  fs.mkdirSync(otherSkillDir, { recursive: true });

  // Original files
  fs.writeFileSync(path.join(mo7iDir, 'VERSION'), '2.3.0\n');
  fs.writeFileSync(path.join(mo7iDir, 'ORIGINAL.txt'), 'mo7i original content');
  fs.writeFileSync(path.join(mo7iSetupDir, 'ORIGINAL.txt'), 'setup original content');
  fs.writeFileSync(path.join(otherSkillDir, 'SKILL.md'), 'custom unrelated skill content');

  // Secrets and project files
  fs.writeFileSync(path.join(tempDir, '.env'), 'SECRET_API_KEY=supersecret123');
  fs.writeFileSync(path.join(tempDir, 'package.json'), '{"name":"my-project"}');

  const failRes = routeCommand('/mo7i self-update --yes', {
    projectDir: tempDir,
    mockLatestVersion: '2.4.0',
    mockInstallError: 'Command failed: npx skills add - simulated installation fault',
    timestamp: '2026-11-16T00-00-00-000Z'
  });

  assert.strictEqual(failRes.status, 'ERROR');
  assert.strictEqual(failRes.rolledBack, true);
  assert(failRes.output.includes('Automated Rollback: SUCCESS'));

  // Assert rollback restored original files intact
  assert(fs.existsSync(path.join(mo7iDir, 'ORIGINAL.txt')));
  assert.strictEqual(fs.readFileSync(path.join(mo7iDir, 'ORIGINAL.txt'), 'utf8'), 'mo7i original content');
  assert.strictEqual(fs.readFileSync(path.join(mo7iDir, 'VERSION'), 'utf8').trim(), '2.3.0');

  // Assert other skills, project files, and secrets are completely untouched
  assert.strictEqual(fs.readFileSync(path.join(otherSkillDir, 'SKILL.md'), 'utf8'), 'custom unrelated skill content');
  assert.strictEqual(fs.readFileSync(path.join(tempDir, '.env'), 'utf8'), 'SECRET_API_KEY=supersecret123');
  assert.strictEqual(fs.readFileSync(path.join(tempDir, 'package.json'), 'utf8'), '{"name":"my-project"}');

  fs.rmSync(tempDir, { recursive: true, force: true });
});

// 8. Successful Execution: Backup, Disk Verification, Doctor, Neutral Notice & Run Log
runTest(8, 'Successful self-update executes backup, updates skills, verifies disk, runs doctor, and writes run log', () => {
  const tempDir = fs.mkdtempSync('/tmp/mo7i-test-success-');
  const skillsDir = path.join(tempDir, 'skills');
  const mo7iDir = path.join(skillsDir, 'mo7i');
  const mo7iSetupDir = path.join(skillsDir, 'mo7i-project-setup');
  fs.mkdirSync(mo7iDir, { recursive: true });
  fs.mkdirSync(mo7iSetupDir, { recursive: true });

  fs.writeFileSync(path.join(mo7iDir, 'VERSION'), '2.3.0\n');
  fs.writeFileSync(path.join(mo7iSetupDir, 'VERSION'), '2.3.0\n');

  const ts = '2026-11-16T01-00-00-000Z';
  const successRes = routeCommand('/mo7i self-update --yes', {
    projectDir: tempDir,
    mockLatestVersion: '2.4.0',
    mockInstallSuccess: true,
    mockPostInstallVersion: '2.4.0',
    timestamp: ts
  });

  assert.strictEqual(successRes.status, 'SUCCESS');
  assert.strictEqual(successRes.previousVersion, '2.3.0');
  assert.strictEqual(successRes.newVersion, '2.4.0');
  assert(successRes.output.includes('[MO7I Self-Update Complete]'));
  assert(successRes.output.includes(NEUTRAL_RESTART_NOTICE));

  // Verify backup exists
  assert(fs.existsSync(successRes.backupDir));

  // Verify run log written to .mo7i/runs/
  const logFile = path.join(tempDir, '.mo7i', 'runs', `${ts}.json`);
  assert(fs.existsSync(logFile), `Run log file must exist at ${logFile}`);
  const log = JSON.parse(fs.readFileSync(logFile, 'utf8'));
  assert.strictEqual(log.metadata.command, 'self-update');
  assert.strictEqual(log.metadata.installedVersion, '2.3.0');
  assert.strictEqual(log.metadata.newVersion, '2.4.0');
  assert.strictEqual(log.status, 'PASS');

  fs.rmSync(tempDir, { recursive: true, force: true });
});

// 9. Scope Detection: Project vs Global
runTest(9, 'Scope detection identifies project-level vs global install', () => {
  const tempProjectDir = fs.mkdtempSync('/tmp/mo7i-test-scope-');
  fs.mkdirSync(path.join(tempProjectDir, 'skills', 'mo7i'), { recursive: true });

  assert.strictEqual(detectInstallScope(tempProjectDir), 'project');
  assert.strictEqual(detectInstallScope(tempProjectDir, { scope: 'global' }), 'global');
  assert.strictEqual(detectInstallScope(tempProjectDir, { global: true }), 'global');

  fs.rmSync(tempProjectDir, { recursive: true, force: true });
});

console.log('\nAll 9 v2.4.0 Self-Update Acceptance Tests Passed Successfully!\n');
