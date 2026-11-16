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

const setupEngine = require('../skills/mo7i/scripts/setup-engine');
const {
  routeCommand,
  isTrivialTask,
  analyzeCapabilityGaps,
  reportCapabilityGaps,
  validateResearchEvidence,
  writeRunLog
} = require('../src/commands/command-router');
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
  assert(content.includes('audit, learn, discover, status, doctor, update'), 'Must document subcommands');
});

test(2, 'Single-skill architecture verification: mo7i contains self-contained setup engine', () => {
  const enginePath = path.join(REPO_DIR, 'skills', 'mo7i', 'scripts', 'setup-engine.js');
  assert(fs.existsSync(enginePath), 'setup-engine.js must exist in skills/mo7i/scripts/');
  const engine = require(enginePath);
  assert.strictEqual(typeof engine.analyzeProject, 'function');
  assert.strictEqual(typeof engine.recommendProjectSkills, 'function');
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
  assert(['2.3.0', '2.4.0', '2.5.0', '2.6.0'].includes(parsed.version));
  assert(Array.isArray(parsed.diagnostics));
  assert(parsed.platforms['Standard Agent Skills (.agents/skills/)']);
  assert.strictEqual(parsed.platforms['Standard Agent Skills (.agents/skills/)'].status, 'VERIFIED');
  assert.strictEqual(parsed.platforms['Cursor / Windsurf (.cursor/rules/)'].status, 'UNVERIFIED');
});

test(14, '/mo7i status --json returns valid schema with post-install telemetry', () => {
  const res = routeCommand('/mo7i status --json');
  assert.strictEqual(res.status, 'SUCCESS');
  const parsed = JSON.parse(res.output);
  assert(['2.3.0', '2.4.0', '2.5.0', '2.6.0'].includes(parsed.version));
  assert(typeof parsed.postInstallSetups === 'object');
  assert(typeof parsed.reconciliation === 'object');
});

// 9. Dynamic Port Probing
test(15, 'Dynamic port probing utility returns open port', () => {
  const port = setupEngine.findAvailablePortSync(9870);
  assert(typeof port === 'number');
  assert(port >= 9870);
});

// 10. Research Tasks Evidence Protocol
test(16, 'Research tasks require >=3 web searches, >=2 primary source fetches, and reject non-tool URLs', () => {
  // Case A: insufficient searches (<3)
  const res1 = validateResearchEvidence({
    webSearches: ['search 1', 'search 2'],
    sourcesFetched: ['https://example.com/doc1', 'https://example.com/doc2'],
    citedUrls: ['https://example.com/doc1'],
    toolReturnedUrls: ['https://example.com/doc1', 'https://example.com/doc2']
  });
  assert.strictEqual(res1.valid, false);
  assert(res1.error.includes('at least 3 web searches'));

  // Case B: insufficient sources fetched (<2)
  const res2 = validateResearchEvidence({
    webSearches: ['search 1', 'search 2', 'search 3'],
    sourcesFetched: ['https://example.com/doc1'],
    citedUrls: ['https://example.com/doc1'],
    toolReturnedUrls: ['https://example.com/doc1']
  });
  assert.strictEqual(res2.valid, false);
  assert(res2.error.includes('at least 2 primary sources'));

  // Case C: cited URL not returned by tool (anti-hallucination violation)
  const res3 = validateResearchEvidence({
    webSearches: ['search 1', 'search 2', 'search 3'],
    sourcesFetched: ['https://example.com/doc1', 'https://example.com/doc2'],
    citedUrls: ['https://hallucinated-source.org/paper.pdf'],
    toolReturnedUrls: ['https://example.com/doc1', 'https://example.com/doc2']
  });
  assert.strictEqual(res3.valid, false);
  assert(res3.error.includes('Anti-hallucination violation'));

  // Case D: valid evidence with tool-returned URLs
  const res4 = validateResearchEvidence({
    webSearches: ['query 1', 'query 2', 'query 3'],
    sourcesFetched: ['https://source1.com/benchmark', 'https://source2.com/paper'],
    citedUrls: ['https://source1.com/benchmark'],
    toolReturnedUrls: ['https://source1.com/benchmark', 'https://source2.com/paper']
  });
  assert.strictEqual(res4.valid, true);
  assert.strictEqual(res4.webSearchesCount, 3);
  assert.strictEqual(res4.sourcesFetchedCount, 2);
});

// 11. Capability Gap Reporting
test(17, 'Gap analysis reports "no gap" when existing tools suffice for the current task', () => {
  // Software Engineering domain with standard development skills
  const gapsNoGap = analyzeCapabilityGaps('Software Engineering', ['codebase-design', 'tdd']);
  assert.strictEqual(gapsNoGap.length, 0);
  assert.strictEqual(gapsNoGap.report, 'no gap');
  assert.strictEqual(gapsNoGap.status, 'NO_GAP');
  assert.strictEqual(reportCapabilityGaps('Software Engineering', ['codebase-design']), 'no gap');

  // Security domain with semgrep covered
  const securityCovered = analyzeCapabilityGaps('Security & AppSec', ['semgrep-rules', 'appsec-scanner']);
  assert.strictEqual(securityCovered.length, 0);
  assert.strictEqual(securityCovered.report, 'no gap');
  assert.strictEqual(reportCapabilityGaps('Security & AppSec', ['semgrep-rules']), 'no gap');

  // Dispatched universal task with covered skills
  const taskRes = routeCommand('/mo7i Refactor the authentication service helper', {
    projectDir: REPO_DIR
  });
  assert.strictEqual(taskRes.gapReport, 'no gap');
  assert.strictEqual(taskRes.gapAnalysis.status, 'NO_GAP');
  assert(taskRes.output.includes('• Gap Analysis: no gap (existing tools suffice for the current task)'));
});

// 12. Real Per-Run Logging (.mo7i/runs/<timestamp>.json)
test(18, 'Write a real per-run log (.mo7i/runs/<timestamp>.json) with phases, skills read/excluded, tools called', () => {
  const tempProject = path.join('/tmp', 'mo7i-test-runlog-' + Date.now());
  fs.mkdirSync(tempProject, { recursive: true });

  const testTs = '2026-11-16T00-30-00-000Z';
  const runRes = routeCommand('/mo7i Run benchmark tests and inspect memory consumption', {
    projectDir: tempProject,
    timestamp: testTs,
    toolsCalled: ['search_web', 'read_url_content', 'run_command'],
    skillsRead: ['research', 'codebase-design'],
    skillsExcluded: ['mo7i', 'mo7i-project-setup', 'email-sender']
  });

  const runsDir = path.join(tempProject, '.mo7i', 'runs');
  assert(fs.existsSync(runsDir), '.mo7i/runs directory must be created');

  const files = fs.readdirSync(runsDir);
  assert(files.length >= 1, 'At least one run log must be generated');
  assert(files.includes(`${testTs}.json`), `Run file ${testTs}.json must exist`);

  const runLogContent = JSON.parse(fs.readFileSync(path.join(runsDir, `${testTs}.json`), 'utf8'));
  assert(Array.isArray(runLogContent.phasesExecuted), 'phasesExecuted must be an array');
  assert(runLogContent.phasesExecuted.length > 0, 'phasesExecuted must not be empty');
  assert(Array.isArray(runLogContent.skillsRead), 'skillsRead must be an array');
  assert(runLogContent.skillsRead.includes('research'), 'skillsRead must include research');
  assert(Array.isArray(runLogContent.skillsExcluded), 'skillsExcluded must be an array');
  assert(runLogContent.skillsExcluded.includes('mo7i'), 'skillsExcluded must include mo7i');
  assert(runLogContent.skillsExcluded.includes('mo7i-project-setup'), 'skillsExcluded must include mo7i-project-setup');
  assert(Array.isArray(runLogContent.toolsCalled), 'toolsCalled must be an array');
  assert(runLogContent.toolsCalled.includes('search_web'), 'toolsCalled must include search_web');
  assert.strictEqual(runLogContent.status, 'PASS');

  // Clean up
  fs.rmSync(tempProject, { recursive: true, force: true });
});

// 13. Exclusion of MO7I's Own Skills from Post-Install Setup Detection
test(19, 'Exclude MO7Is own skills (mo7i, mo7i-project-setup) from post-install setup detection', () => {
  const tempProject = path.join('/tmp', 'mo7i-test-internal-exclusion-' + Date.now());
  const agentSkills = path.join(tempProject, '.agents', 'skills');
  fs.mkdirSync(agentSkills, { recursive: true });

  // Create mo7i and mo7i-project-setup on disk
  const internalSkills = ['mo7i', 'mo7i-project-setup'];
  for (const sId of internalSkills) {
    const sDir = path.join(agentSkills, sId);
    fs.mkdirSync(sDir, { recursive: true });
    fs.writeFileSync(
      path.join(sDir, 'SKILL.md'),
      `---\nname: ${sId}\ndescription: "Setup and orchestrate repository workflows. Run once before first use."\n---\n# ${sId}\nInternal skill.`
    );
  }

  // Also include a genuine setup skill to ensure detection still works for real setup skills
  const genuineSkillDir = path.join(agentSkills, 'setup-matt-pocock-skills');
  fs.mkdirSync(genuineSkillDir, { recursive: true });
  fs.writeFileSync(
    path.join(genuineSkillDir, 'SKILL.md'),
    `---\nname: setup-matt-pocock-skills\ndescription: "Configure this repo for engineering skills. Run once before first use."\n---\n# Setup\nAsk questions.`
  );

  const detected = setupEngine.detectPostInstallSetups(tempProject, ['mo7i', 'mo7i-project-setup', 'setup-matt-pocock-skills']);
  const detectedIds = detected.map(d => d.setupSkill);

  // mo7i and mo7i-project-setup MUST NOT be in detected post-install setup skills
  assert.strictEqual(detectedIds.includes('mo7i'), false, 'mo7i must NEVER be detected as a post-install setup skill');
  assert.strictEqual(detectedIds.includes('mo7i-project-setup'), false, 'mo7i-project-setup must NEVER be detected as a post-install setup skill');

  // Genuine setup skill MUST still be detected
  assert.strictEqual(detectedIds.includes('setup-matt-pocock-skills'), true, 'Genuine setup skill must still be detected');
  assert.strictEqual(detected.length, 1, 'Only genuine setup skill should be detected');

  // Clean up
  fs.rmSync(tempProject, { recursive: true, force: true });
});

console.log('\nAll 19 v2.3.0 Hardening, Post-Install & Evidence Acceptance Tests Passed!\n');
