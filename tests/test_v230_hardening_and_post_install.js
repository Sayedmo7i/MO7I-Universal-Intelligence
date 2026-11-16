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

test(2, 'T3 Code companion mo7i-project-setup exists with name: mo7i-project-setup', () => {
  const setupSkillPath = path.join(REPO_DIR, '.agents', 'skills', 'mo7i-project-setup', 'SKILL.md');
  assert(fs.existsSync(setupSkillPath), 'SKILL.md must exist in .agents/skills/mo7i-project-setup/');
  const content = fs.readFileSync(setupSkillPath, 'utf8');
  assert(/^name:\s*mo7i-project-setup$/m.test(content), 'Frontmatter name must be "mo7i-project-setup"');
});

test(3, 'Specification file SKILL-SPEC.md exists with name: mo7i and version v2.3.0', () => {
  const specSkillPath = path.join(REPO_DIR, 'SKILL-SPEC.md');
  assert(fs.existsSync(specSkillPath), 'SKILL-SPEC.md must exist in repository root');
  const content = fs.readFileSync(specSkillPath, 'utf8');
  assert(/^name:\s*mo7i$/m.test(content), 'SKILL-SPEC.md frontmatter name must be "mo7i"');
  assert(content.includes('v2.3.0'), 'SKILL-SPEC.md must reference v2.3.0');
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
test(5, 'Dynamic post-install detection identifies setup-* skills and eliminates false positives', () => {
  const tempProject = path.join('/tmp', 'mo7i-test-postinstall-' + Date.now());
  const agentSkills = path.join(tempProject, '.agents', 'skills');
  
  // Create folders
  const skillsToCreate = {
    'ask-matt': {
      desc: 'Ask which skill or flow fits your situation. A router over the skills in this repo.',
      content: '# Ask Matt\nYou do not remember every skill, so ask. Configure things later.'
    },
    'to-tickets': {
      desc: 'Break a plan, spec, or the current conversation into a set of tracer-bullet tickets, each declaring its blocking edges, published to the configured tracker (edges as text in one file per ticket locally, or native blocking links on a real tracker).',
      content: '# To Tickets\nTell the user to configure their tracker.'
    },
    'wizard': {
      desc: 'Generate an interactive bash wizard that walks a human through steps only they can perform. Use when provisioning infrastructure, setting up credentials or CI secrets, walking an unfamiliar third-party dashboard, or running a one-off migration or cutover. Don',
      content: '# Wizard\nInteractive bash wizard for setup procedures.'
    },
    'setup-matt-pocock-skills': {
      desc: 'Configure this repo for the engineering skills: set up its issue tracker, triage label vocabulary, and domain doc layout. Run once before first use of the other engineering skills.',
      content: '# Setup Matt Pocock Skills\nAsk the user for tracker choices.'
    },
    'setup-ts-deep-modules': {
      desc: 'Wire dependency-cruiser into a TypeScript repo so each package is a deep module, with implementation hidden in subfolders and reachable only through its entry-point files. User-invoked.',
      content: '# Setup TS Deep Modules\nWire dependency-cruiser.'
    },
    'setup-pre-commit': {
      desc: 'Set up Husky pre-commit hooks with lint-staged (Prettier), type checking, and tests in the current repo. Use when user wants to add pre-commit hooks, set up Husky, configure lint-staged, or add commit-time formatting/typechecking/testing.',
      content: '# Setup Pre-Commit\nConfigure hooks.'
    }
  };

  for (const [id, data] of Object.entries(skillsToCreate)) {
    const sDir = path.join(agentSkills, id);
    fs.mkdirSync(sDir, { recursive: true });
    fs.writeFileSync(
      path.join(sDir, 'SKILL.md'),
      `---\nname: ${id}\ndescription: "${data.desc}"\n---\n${data.content}`
    );
  }

  const detected = setupEngine.detectPostInstallSetups(tempProject, Object.keys(skillsToCreate));
  const detectedIds = detected.map(d => d.setupSkill);

  // False positives check: ask-matt, to-tickets, wizard MUST NOT be detected as setup skills
  assert.strictEqual(detectedIds.includes('ask-matt'), false, 'ask-matt must NOT be a setup skill');
  assert.strictEqual(detectedIds.includes('to-tickets'), false, 'to-tickets must NOT be a setup skill');
  assert.strictEqual(detectedIds.includes('wizard'), false, 'wizard must NOT be a setup skill');

  // True positives check: setup-matt-pocock-skills, setup-ts-deep-modules, setup-pre-commit MUST be detected
  assert.strictEqual(detectedIds.includes('setup-matt-pocock-skills'), true, 'setup-matt-pocock-skills must be detected');
  assert.strictEqual(detectedIds.includes('setup-ts-deep-modules'), true, 'setup-ts-deep-modules must be detected');
  assert.strictEqual(detectedIds.includes('setup-pre-commit'), true, 'setup-pre-commit must be detected');

  assert.strictEqual(detected.length, 3, 'Must detect exactly the 3 genuine setup skills');

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
  fs.writeFileSync(path.join(docsAgents, 'triage-labels.md'), '# Triage Labels\nCanonical labels.');
  fs.writeFileSync(path.join(tempProject, 'AGENTS.md'), '# Instructions\n\n## Agent skills\n### Issue tracker\nGitHub\n');

  const completedVer = setupEngine.verifySetupCompletion(tempProject, 'setup-matt-pocock-skills');
  assert.strictEqual(completedVer.verified, true, 'Must pass verification when real artifacts exist');
  assert(completedVer.evidence.includes('issue-tracker'), 'Evidence must cite issue-tracker');
  assert(completedVer.evidence.includes('triage-labels'), 'Evidence must cite triage-labels');

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
  assert.strictEqual(parsed.platforms['T3 Code ($mo7i via .agents/skills/)'].status, 'FILE_PRESENT');
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
