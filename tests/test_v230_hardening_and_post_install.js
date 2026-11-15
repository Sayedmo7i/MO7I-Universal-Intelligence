/**
 * MO7I Universal Intelligence v2.3.0 Acceptance & Hardening Test Suite
 * 
 * Covers:
 * 1. Skill Discovery & T3 Code Entry Points (.agents/skills/mo7i, setup-project-skills)
 * 2. Registry / Lockfile / Profile Reconciliation (Fails if disk skill not in registry)
 * 3. Post-Install Setup Detection (Dynamic first, map second)
 * 4. Setup-State Transitions & Verification (not-required -> pending -> completed / skipped / failed)
 * 5. Human Gate Enforcement & Skip Path
 * 6. Fast Path for Trivial Tasks & Phase Logging
 * 7. Capability-Gap Analysis for Uncovered Domains
 * 8. Command Router Path-Traversal Protection
 * 9. Machine-Readable Doctor & Status JSON Schemas
 * 10. Dynamic Port Probing Utility
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const setupEngine = require('../skills/mo7i-project-setup/scripts/setup-engine');
const { routeCommand, isTrivialTask, analyzeCapabilityGaps } = require('../src/commands/command-router');
const { checkPathTraversal, parseCommand } = require('../src/commands/argument-parser');
const { PLATFORM_VERIFICATION } = require('../src/commands/platform-installer');

const REPO_DIR = path.resolve(__dirname, '..');
const FIXTURES_DIR = path.join(REPO_DIR, 'tests', 'fixtures', 'projects');

function test(num, description, fn) {
  try {
    fn();
    console.log(`[PASS] Test 2.3.${num}: ${description}`);
  } catch (err) {
    console.error(`[FAIL] Test 2.3.${num}: ${description} - ${err.message}`);
    throw err;
  }
}

console.log('=== MO7I v2.3.0 Hardening, Entry Points & Post-Install Test Suite ===\n');

// 1. Skill Discovery & T3 Code Entry Points
test(1, 'T3 Code entry point .agents/skills/mo7i/SKILL.md exists with name: mo7i', () => {
  const mo7iSkillPath = path.join(REPO_DIR, '.agents', 'skills', 'mo7i', 'SKILL.md');
  assert(fs.existsSync(mo7iSkillPath), 'SKILL.md must exist in .agents/skills/mo7i/');
  const content = fs.readFileSync(mo7iSkillPath, 'utf8');
  assert(/^name:\s*mo7i$/m.test(content), 'Frontmatter name must be "mo7i" for T3 Code autocomplete');
  assert(content.includes('audit, learn, discover, status, doctor, update, help'), 'Must document subcommands');
});

test(2, 'T3 Code companion setup-project-skills exists with name: setup-project-skills', () => {
  const setupSkillPath = path.join(REPO_DIR, '.agents', 'skills', 'setup-project-skills', 'SKILL.md');
  assert(fs.existsSync(setupSkillPath), 'SKILL.md must exist in .agents/skills/setup-project-skills/');
  const content = fs.readFileSync(setupSkillPath, 'utf8');
  assert(/^name:\s*setup-project-skills$/m.test(content), 'Frontmatter name must be "setup-project-skills"');
});

test(3, 'Root SKILL.md has name: mo7i and version v2.3.0', () => {
  const rootSkillPath = path.join(REPO_DIR, 'SKILL.md');
  const content = fs.readFileSync(rootSkillPath, 'utf8');
  assert(/^name:\s*mo7i$/m.test(content), 'Root SKILL.md frontmatter name must be "mo7i"');
  assert(content.includes('v2.3.0'), 'Root SKILL.md must reference v2.3.0');
});

// 2. Registry Reconciliation
test(4, 'Reconciliation detects when a skill exists on disk but is missing from registry', () => {
  const tempProject = path.join('/tmp', 'mo7i-test-reconcile-' + Date.now());
  const agentSkills = path.join(tempProject, '.agents', 'skills');
  const mo7iDir = path.join(tempProject, '.mo7i');
  fs.mkdirSync(path.join(agentSkills, 'unregistered-specialist'), { recursive: true });
  fs.mkdirSync(mo7iDir, { recursive: true });

  fs.writeFileSync(path.join(agentSkills, 'unregistered-specialist', 'SKILL.md'), '---\nname: unregistered-specialist\n---\n');
  
  // Registry missing this skill
  const initialRegistry = {
    version: '2.3.0',
    installedSkills: [{ id: 'registered-skill', scope: 'project' }]
  };
  fs.writeFileSync(path.join(mo7iDir, 'skill-registry.json'), JSON.stringify(initialRegistry, null, 2));

  const recon = setupEngine.reconcileSkills(tempProject);
  assert.strictEqual(recon.reconciled, false, 'Must flag un-reconciled state');
  assert(recon.unregisteredOnDisk.includes('unregistered-specialist'), 'Must identify unregistered disk skill');

  // Clean up
  fs.rmSync(tempProject, { recursive: true, force: true });
});

// 3. Post-Install Setup Detection Against Fixtures
test(5, 'Dynamic post-install detection identifies setup-* skills on disk', () => {
  const tempProject = path.join('/tmp', 'mo7i-test-postinstall-' + Date.now());
  const agentSkills = path.join(tempProject, '.agents', 'skills');
  fs.mkdirSync(path.join(agentSkills, 'setup-custom-database'), { recursive: true });
  fs.mkdirSync(path.join(agentSkills, 'normal-skill'), { recursive: true });

  fs.writeFileSync(
    path.join(agentSkills, 'setup-custom-database', 'SKILL.md'),
    '---\nname: setup-custom-database\ndescription: "Configure database schemas and connection parameters. Run once before use."\n---\n# Setup Database\nAsk the user for database credentials and confirmation.'
  );
  fs.writeFileSync(
    path.join(agentSkills, 'normal-skill', 'SKILL.md'),
    '---\nname: normal-skill\ndescription: "Standard execution skill."\n---\n# Normal'
  );

  const detected = setupEngine.detectPostInstallSetups(tempProject, ['setup-custom-database', 'normal-skill']);
  assert.strictEqual(detected.length, 1, 'Must detect exactly 1 setup skill');
  assert.strictEqual(detected[0].setupSkill, 'setup-custom-database');
  assert.strictEqual(detected[0].interactive, true, 'Must detect interactive prompt pattern');
  assert.strictEqual(detected[0].status, 'pending', 'Initial status must be pending');

  // Clean up
  fs.rmSync(tempProject, { recursive: true, force: true });
});

// 4. Setup-State Transitions & Human Gate
test(6, 'Post-install setup lifecycle transitions: pending -> skipped', () => {
  const tempProject = path.join('/tmp', 'mo7i-test-lifecycle-' + Date.now());
  const mo7iDir = path.join(tempProject, '.mo7i');
  fs.mkdirSync(mo7iDir, { recursive: true });

  const registry = {
    version: '2.3.0',
    installedSkills: [
      { id: 'setup-matt-pocock-skills', setupSkill: 'setup-matt-pocock-skills', setupStatus: 'pending' }
    ],
    pendingSetups: [{ setupSkill: 'setup-matt-pocock-skills' }]
  };
  fs.writeFileSync(path.join(mo7iDir, 'skill-registry.json'), JSON.stringify(registry, null, 2));

  const skipRes = setupEngine.skipSetup(tempProject, 'setup-matt-pocock-skills', 'Team uses external Jira tracker');
  assert.strictEqual(skipRes.status, 'skipped');
  assert.strictEqual(skipRes.reason, 'Team uses external Jira tracker');

  const updatedReg = JSON.parse(fs.readFileSync(path.join(mo7iDir, 'skill-registry.json'), 'utf8'));
  const targetSkill = updatedReg.installedSkills.find(s => s.setupSkill === 'setup-matt-pocock-skills');
  assert.strictEqual(targetSkill.setupStatus, 'skipped');
  assert.strictEqual(targetSkill.skipReason, 'Team uses external Jira tracker');

  // Clean up
  fs.rmSync(tempProject, { recursive: true, force: true });
});

test(7, 'Verification verifies completed state with real evidence', () => {
  const tempProject = path.join('/tmp', 'mo7i-test-verify-' + Date.now());
  const docsAgents = path.join(tempProject, 'docs', 'agents');
  fs.mkdirSync(docsAgents, { recursive: true });

  // Initially unverified
  const initialVer = setupEngine.verifySetupCompletion(tempProject, 'setup-matt-pocock-skills');
  assert.strictEqual(initialVer.verified, false, 'Must fail verification when artifacts missing');

  // Create real required artifacts (from Phase 0B findings)
  fs.writeFileSync(path.join(docsAgents, 'issue-tracker.md'), '# Issue Tracker\nUses GitHub Issues.');
  fs.writeFileSync(path.join(docsAgents, 'domain.md'), '# Domain Docs\nSingle-context GLOSSARY.');
  fs.writeFileSync(path.join(tempProject, 'AGENTS.md'), '# Instructions\n\n## Agent skills\n### Issue tracker\nGitHub\n');

  const completedVer = setupEngine.verifySetupCompletion(tempProject, 'setup-matt-pocock-skills');
  assert.strictEqual(completedVer.verified, true, 'Must pass verification when real artifacts exist');
  assert(completedVer.evidence.includes('issue-tracker.md'), 'Evidence must cite issue-tracker.md');

  // Clean up
  fs.rmSync(tempProject, { recursive: true, force: true });
});

test(8, 'Human gate notices format accurately and never invent silent answers', () => {
  const notice = setupEngine.formatHumanGateNotice([
    { setupSkill: 'setup-matt-pocock-skills', interactive: true, description: 'Configure issue tracker' }
  ]);
  assert(notice.includes('[MO7I HUMAN GATE: POST-INSTALL SETUP REQUIRED]'), 'Must format official Human Gate header');
  assert(notice.includes('$setup-matt-pocock-skills'), 'Must provide exact T3 Code invocation syntax');
  assert(notice.includes('will NOT invent answers'), 'Must declare anti-fabrication boundary');
});

// 5. Fast Path Execution & Phase Logging
test(9, 'Fast path recognizes trivial tasks and logs shortened phases', () => {
  assert.strictEqual(isTrivialTask('Fix typo in README.md'), true);
  assert.strictEqual(isTrivialTask('What is the architecture of this project?'), true);
  assert.strictEqual(isTrivialTask('Build a distributed microservice system with Kafka and Redis'), false);

  const res = routeCommand('/mo7i Fix typo in README.md');
  assert.strictEqual(res.status, 'DISPATCHED');
  assert.strictEqual(res.fastPath, true);
  assert.strictEqual(res.phasesExecuted.length, 4);
  assert(res.phasesExecuted.includes('FAST_PATH_EXECUTION'));
});

test(10, 'Standard path executes full 16-phase lifecycle for non-trivial tasks', () => {
  const res = routeCommand('/mo7i Implement Next.js dashboard with Stripe billing and PostgreSQL');
  assert.strictEqual(res.status, 'DISPATCHED');
  assert.strictEqual(res.fastPath, false);
  assert.strictEqual(res.phasesExecuted.length, 16);
  assert(res.phasesExecuted.includes('7. CAPABILITY_GAP_ANALYSIS'));
  assert(res.phasesExecuted.includes('13. QUALITY_VALIDATION'));
});

// 6. Capability-Gap Analysis (Phase 7)
test(11, 'Capability-gap analysis reports uncovered domains and proposes discover queries', () => {
  const gaps = analyzeCapabilityGaps('Security & AppSec', ['nextjs-best-practices', 'codebase-design']);
  assert.strictEqual(gaps.length, 1);
  assert.strictEqual(gaps[0].domain, 'Security & AppSec');
  assert(gaps[0].suggestedDiscoverQueries.length > 0);
  assert(gaps[0].suggestedDiscoverQueries[0].includes('/mo7i discover'));
});

// 7. Command Router Path Traversal Rejection
test(12, 'Path traversal protection rejects directory climbing and system paths', () => {
  assert.strictEqual(checkPathTraversal('../../etc'), true);
  assert.strictEqual(checkPathTraversal('/etc/shadow'), true);
  assert.strictEqual(checkPathTraversal('./src/packages'), false);

  const res1 = routeCommand('/mo7i status --project ../../../root');
  assert.strictEqual(res1.status, 'ERROR');
  assert(res1.error.includes('Path traversal detected'));

  const res2 = routeCommand('/mo7i doctor --project /etc');
  assert.strictEqual(res2.status, 'ERROR');
  assert(res2.error.includes('Path traversal detected'));
});

// 8. Machine-Readable Doctor & Status JSON Schemas
test(13, '/mo7i doctor --json returns valid schema with platforms and diagnostics', () => {
  const res = routeCommand('/mo7i doctor --json');
  assert.strictEqual(res.status, 'HEALTHY');
  assert.strictEqual(res.command, 'doctor');
  const parsed = JSON.parse(res.output);
  assert.strictEqual(parsed.version, '2.3.0');
  assert(Array.isArray(parsed.diagnostics));
  assert(typeof parsed.platforms === 'object');
  assert.strictEqual(parsed.platforms['T3 Code ($mo7i via .agents/skills/)'].status, 'VERIFIED');
  assert.strictEqual(parsed.platforms['Cursor / Windsurf (.cursor/rules/)'].status, 'UNVERIFIED');
});

test(14, '/mo7i status --json returns valid schema with post-install telemetry', () => {
  const res = routeCommand('/mo7i status --json');
  assert.strictEqual(res.status, 'SUCCESS');
  const parsed = JSON.parse(res.output);
  assert.strictEqual(parsed.version, '2.3.0');
  assert(typeof parsed.postInstallSetups === 'object');
  assert(typeof parsed.reconciliation === 'object');
});

// 9. Dynamic Port Probing
test(15, 'Dynamic port probing utility returns open port', () => {
  const port = setupEngine.findAvailablePortSync(9870);
  assert(typeof port === 'number');
  assert(port >= 9870);
});

console.log('\nAll 15 v2.3.0 Hardening and Post-Install Acceptance Tests Passed!\n');
