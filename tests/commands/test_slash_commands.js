/**
 * MO7I Universal Intelligence — Official Slash Commands Test Suite
 * Version: 2.2.0
 * 
 * Implements all 17 required acceptance test scenarios for the Slash Commands system:
 * Unit, Integration, Platform Registration, and Real End-to-End Execution.
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const { parseCommand, checkPathTraversal } = require('../../src/commands/argument-parser');
const { COMMANDS, getCommand, getAllCommands } = require('../../src/commands/command-registry');
const { routeCommand } = require('../../src/commands/command-router');
const { installSlashCommands } = require('../../src/commands/platform-installer');

const REPO_DIR = path.resolve(__dirname, '../../');
const FIXTURES_DIR = path.join(REPO_DIR, 'tests', 'fixtures', 'projects');

function runTest(num, name, fn) {
  try {
    const result = fn();
    console.log(`[PASS] Test ${num}: ${name}`);
    return { num, name, status: 'PASS', result };
  } catch (err) {
    console.error(`[FAIL] Test ${num}: ${name} - ${err.message}`);
    throw err;
  }
}

console.log('=== MO7I Slash Commands Test Suite (17 Scenarios) ===\n');

// 1. /mo7i without arguments
runTest(1, '/mo7i without arguments (Default to Help)', () => {
  const res = routeCommand('/mo7i');
  assert.strictEqual(res.status, 'SUCCESS');
  assert.strictEqual(res.command, 'help');
  assert(res.output.includes('Available Commands'), 'Output must list available commands');
});

// 2. /mo7i with natural-language tasks
runTest(2, '/mo7i with natural-language task', () => {
  const task = 'Build a modern Flutter mobile app with reactive BLoC state';
  const res = routeCommand(`/mo7i ${task}`);
  assert.strictEqual(res.status, 'DISPATCHED');
  assert.strictEqual(res.domain, 'Mobile Development');
  assert(res.output.includes(task), 'Output must include user task description');
});

// 3. /mo7i help
runTest(3, '/mo7i help command catalog', () => {
  const res = routeCommand('/mo7i help');
  assert.strictEqual(res.status, 'SUCCESS');
  assert.strictEqual(res.readOnly, true);
  for (const cmd of COMMANDS) {
    assert(res.output.includes(cmd.trigger), `Help must include trigger ${cmd.trigger}`);
  }
});

// 4. /setup-project-skills initial
runTest(4, '/setup-project-skills initial mode', () => {
  const res = routeCommand('/setup-project-skills initial --dry-run', {
    projectDir: path.join(FIXTURES_DIR, 'nextjs-app')
  });
  assert.strictEqual(res.status, 'SUCCESS');
  assert.strictEqual(res.mode, 'initial');
  assert(res.result.installResults.successful.length > 0, 'Must plan skill installations');
});

// 5. /setup-project-skills audit
runTest(5, '/setup-project-skills audit mode', () => {
  const res = routeCommand('/setup-project-skills audit', {
    projectDir: path.join(FIXTURES_DIR, 'nextjs-app')
  });
  assert.strictEqual(res.status, 'SUCCESS');
  assert.strictEqual(res.mode, 'audit');
  assert(res.result.missingSkills.length > 0, 'Audit must detect missing skills');
});

// 6. /setup-project-skills update
runTest(6, '/setup-project-skills update mode', () => {
  const res = routeCommand('/setup-project-skills update --dry-run', {
    projectDir: path.join(FIXTURES_DIR, 'nextjs-app')
  });
  assert.strictEqual(res.status, 'SUCCESS');
  assert.strictEqual(res.mode, 'update');
});

// 7. /setup-project-skills repair
runTest(7, '/setup-project-skills repair mode', () => {
  const res = routeCommand('/setup-project-skills repair --dry-run', {
    projectDir: path.join(FIXTURES_DIR, 'nextjs-app')
  });
  assert.strictEqual(res.status, 'SUCCESS');
  assert.strictEqual(res.mode, 'repair');
});

// 8. /setup-project-skills report
runTest(8, '/setup-project-skills report mode', () => {
  const res = routeCommand('/setup-project-skills report', {
    projectDir: path.join(FIXTURES_DIR, 'nextjs-app')
  });
  assert.strictEqual(res.status, 'SUCCESS');
  assert.strictEqual(res.mode, 'report');
  assert(res.output.includes('Project Intelligence & Skill Setup Report'), 'Must output markdown report');
});

// 9. Unknown commands
runTest(9, 'Unknown commands handling', () => {
  const res = routeCommand('/setup-project-skills invalid_mode_xyz');
  assert.strictEqual(res.status, 'ERROR');
  assert(res.error.includes('Unknown setup mode'), 'Must return descriptive error for invalid mode');
});

// 10. Invalid arguments & Path Traversal Protection
runTest(10, 'Path traversal protection on flags', () => {
  const res = routeCommand('/setup-project-skills initial --project ../../etc');
  assert.strictEqual(res.status, 'ERROR');
  assert(res.error.includes('Path traversal detected'), 'Must block path traversal attempts');
});

// 11. Missing project root handling
runTest(11, 'Missing project root error handling', () => {
  try {
    routeCommand('/mo7i audit --project /tmp/completely-nonexistent-project-dir-xyz987');
    assert.fail('Should have thrown an error for missing directory');
  } catch (err) {
    assert(err.message.includes('not found') || err.message.includes('ENOENT'), 'Must report missing directory');
  }
});

// 12. Missing dependencies handling
runTest(12, 'Missing dependencies diagnostic detection', () => {
  const res = routeCommand('/mo7i doctor');
  assert.strictEqual(res.command, 'doctor');
  assert(res.diagnostics.length >= 4, 'Must evaluate multiple runtime checks');
  const nodeCheck = res.diagnostics.find(d => d.check.includes('Node'));
  assert.strictEqual(nodeCheck.status, 'PASS');
});

// 13. Protected skills preservation
runTest(13, 'Protected skills preservation', () => {
  const userProjDir = path.join(FIXTURES_DIR, 'user-custom-skills');
  const res = routeCommand('/setup-project-skills initial --dry-run', { projectDir: userProjDir });
  assert.strictEqual(res.status, 'SUCCESS');
  assert(res.result.profile.existingSkills.includes('my-custom-skill'), 'Must preserve existing custom user skills');
});

// 14. Read-only enforcement
runTest(14, 'Read-only enforcement across inspection commands', () => {
  const readOnlyCmds = ['/mo7i help', '/mo7i audit', '/mo7i status', '/mo7i doctor'];
  for (const cmdStr of readOnlyCmds) {
    const res = routeCommand(cmdStr, { projectDir: path.join(FIXTURES_DIR, 'nextjs-app') });
    assert.strictEqual(res.readOnly, true, `${cmdStr} must be flagged as readOnly: true`);
  }
});

// 15. Approval requirements on update/destructive commands
runTest(15, 'Approval gate verification for updates', () => {
  const updateCmd = getCommand('mo7i update');
  assert.strictEqual(updateCmd.requiresApproval, true, 'mo7i update must require approval gate');
});

// 16. Platform-specific command discovery
runTest(16, 'Platform-specific command file registration and discovery', () => {
  const installRes = installSlashCommands(REPO_DIR);
  assert(installRes.installedPlatforms.length >= 3, 'Must support multiple agent platforms');
  assert(fs.existsSync(path.join(REPO_DIR, '.claude', 'commands', 'mo7i.md')), 'Must register .claude/commands/mo7i.md');
  assert(fs.existsSync(path.join(REPO_DIR, 'commands', 'mo7i-root.md')), 'Must register commands/mo7i-root.md');
  assert(fs.existsSync(path.join(REPO_DIR, '.cursor', 'rules', 'mo7i-commands.mdc')), 'Must register .cursor/rules/');
});

// 17. Actual command-to-engine integration (CLI End-to-End)
runTest(17, 'Actual command-to-engine integration (CLI End-to-End)', () => {
  const out = cp.execSync(`${REPO_DIR}/bin/mo7i status --json`, { cwd: REPO_DIR }).toString();
  const parsed = JSON.parse(out);
  assert.strictEqual(parsed.version, '2.3.0');
  assert.strictEqual(parsed.registeredCommandsCount, 9);
});

console.log('\nAll 17 Slash Commands acceptance tests executed successfully!');
