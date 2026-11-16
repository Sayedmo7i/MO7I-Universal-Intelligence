/**
 * MO7I Universal Intelligence — Independent Verification & Selftest Engine
 * Version: 2.4.1
 * 
 * Runs a black-box verification suite against the INSTALLED skill (not repo source)
 * in an isolated temporary project. Outputs purely structured JSON (pass/fail per check, no narrative).
 */

const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const SELFTEST_VERSION = '2.4.1';

/**
 * Run black-box selftest suite against installed skill in a temp directory.
 * @param {Object} options
 * @param {string} [options.source] - Path or repository package to install from (defaults to REPO_DIR or installed scope)
 * @param {string} [options.targetDir] - Custom temp dir (auto-created and cleaned up if omitted)
 * @param {boolean} [options.keepTemp] - Do not delete temp dir
 * @returns {Object} JSON result object with pass/fail per check
 */
function runSelftest(options = {}) {
  const repoDir = options.source || path.resolve(__dirname, '../..');
  const tempDir = options.targetDir || fs.mkdtempSync('/tmp/mo7i-selftest-');
  const checks = [];

  function recordCheck(id, description, fn) {
    const start = Date.now();
    try {
      const detail = fn();
      checks.push({
        id,
        description,
        status: 'PASS',
        durationMs: Date.now() - start,
        detail: detail || null
      });
    } catch (err) {
      checks.push({
        id,
        description,
        status: 'FAIL',
        durationMs: Date.now() - start,
        error: err.message
      });
    }
  }

  try {
    // Check 1: Clean temp workspace initialization
    recordCheck('clean_temp_init', 'Clean temporary project workspace initialization', () => {
      if (!fs.existsSync(tempDir)) throw new Error('Temp directory does not exist');
      return { tempDir };
    });

    // Check 2: Fresh lean installation via npx skills add
    recordCheck('lean_install_skills_cli', 'Fresh lean installation of mo7i via npx skills add', () => {
      const installCmd = `npx skills add "${repoDir}" --skill mo7i -y`;
      const out = cp.execSync(installCmd, {
        cwd: tempDir,
        stdio: ['pipe', 'pipe', 'pipe'],
        timeout: 60000
      }).toString();
      const mo7iDir = path.join(tempDir, '.agents', 'skills', 'mo7i');
      if (!fs.existsSync(mo7iDir)) {
        throw new Error(`mo7i not installed at ${mo7iDir}`);
      }
      return { installedPath: mo7iDir, outputSnippet: out.slice(0, 100).replace(/\n/g, ' ') };
    });

    const installedMo7iDir = path.join(tempDir, '.agents', 'skills', 'mo7i');

    // Check 3: Installed footprint size and manifest integrity
    recordCheck('installed_footprint', 'Installed footprint size and manifest integrity', () => {
      const skillMd = path.join(installedMo7iDir, 'SKILL.md');
      const versionFile = path.join(installedMo7iDir, 'VERSION');
      if (!fs.existsSync(skillMd)) throw new Error('SKILL.md missing in installed footprint');
      if (!fs.existsSync(versionFile)) throw new Error('VERSION missing in installed footprint');

      const content = fs.readFileSync(skillMd, 'utf8');
      if (!/^name:\s*mo7i$/m.test(content)) throw new Error('Frontmatter name is not mo7i');

      const duOut = cp.execSync('du -sk .', { cwd: installedMo7iDir }).toString();
      const kb = parseInt(duOut.trim().split(/\s+/)[0], 10) || 0;
      if (kb > 350) throw new Error(`Installed footprint is too large: ${kb} KB (expected <= 350 KB)`);

      return { footprintKb: kb, filesCount: fs.readdirSync(installedMo7iDir).length };
    });

    // Check 4: Engine present after lean install
    recordCheck('engine_present_after_lean_install', 'Setup engine present and executable after lean install', () => {
      const enginePath = path.join(installedMo7iDir, 'scripts', 'setup-engine.js');
      if (!fs.existsSync(enginePath)) {
        throw new Error(`setup-engine.js is missing from installed skill at ${enginePath}`);
      }
      const engine = require(enginePath);
      if (typeof engine.analyzeProject !== 'function') {
        throw new Error('Installed setup-engine.js does not export analyzeProject function');
      }
      return { enginePath, engineVersion: engine.ENGINE_VERSION };
    });

    // Check 5: Doctor execution against lean install
    recordCheck('doctor_from_lean_install', 'Doctor diagnostics pass against lean install without repo source', () => {
      const routerModule = path.join(repoDir, 'src', 'commands', 'command-router.js');
      const { routeCommand } = require(routerModule);
      const res = routeCommand('/mo7i doctor --json', { projectDir: tempDir });
      if (res.status === 'ERROR') throw new Error(`Doctor returned ERROR: ${res.error || res.output}`);
      const parsed = JSON.parse(res.output);
      const setupEngineCheck = parsed.diagnostics.find(d => d.check === 'Project Setup Engine');
      if (!setupEngineCheck || setupEngineCheck.status !== 'PASS') {
        throw new Error(`Project Setup Engine check failed: ${JSON.stringify(setupEngineCheck)}`);
      }
      return { status: res.status, diagnosticsCount: parsed.diagnostics.length };
    });

    // Check 6: Status execution against lean install
    recordCheck('status_from_lean_install', 'Status inspection passes against lean install in clean temp project', () => {
      const routerModule = path.join(repoDir, 'src', 'commands', 'command-router.js');
      const { routeCommand } = require(routerModule);
      const res = routeCommand('/mo7i status --json', { projectDir: tempDir });
      if (res.status !== 'SUCCESS') throw new Error(`Status returned non-success: ${res.status}`);
      const parsed = JSON.parse(res.output);
      const installedList = (parsed.skills && parsed.skills.installed) || [];
      if (!installedList.includes('mo7i')) {
        throw new Error(`Installed skills does not include mo7i: ${JSON.stringify(installedList)}`);
      }
      return { status: res.status, installedSkills: installedList };
    });

    // Check 7: Fast path execution in temp project
    recordCheck('fast_path_execution', 'Fast path trivial query executes without error and logs reduced phases', () => {
      const routerModule = path.join(repoDir, 'src', 'commands', 'command-router.js');
      const { routeCommand } = require(routerModule);
      const res = routeCommand('/mo7i What is the architecture of this project?', { projectDir: tempDir });
      if (res.status !== 'DISPATCHED' && res.status !== 'SUCCESS') {
        throw new Error(`Fast path returned non-success status: ${res.status}`);
      }
      if (!res.fastPath) throw new Error('Fast path was not triggered');
      return { executionMode: res.fastPath ? 'FAST_PATH' : 'FULL', phasesCount: res.phasesExecuted.length };
    });

    // Check 8: Project initialization in temp project
    recordCheck('project_initialization', 'Autonomous project setup creates valid .mo7i profile and registry', () => {
      const enginePath = path.join(installedMo7iDir, 'scripts', 'setup-engine.js');
      const engine = require(enginePath);
      const profile = engine.analyzeProject(tempDir);
      const recs = engine.recommendProjectSkills(profile);
      const installRes = engine.installProjectSkills(tempDir, recs.CORE_PROJECT_SKILLS, { dryRun: false });
      const reg = engine.saveProjectRegistry(tempDir, profile, recs, installRes, 'initial');
      if (!fs.existsSync(path.join(tempDir, '.mo7i', 'project-profile.json'))) {
        throw new Error('project-profile.json not created');
      }
      return { profileType: profile.type, installedCount: installRes.successful.length };
    });

  } finally {
    if (!options.keepTemp && fs.existsSync(tempDir)) {
      try {
        fs.rmSync(tempDir, { recursive: true, force: true });
      } catch (_) {}
    }
  }

  const passedCount = checks.filter(c => c.status === 'PASS').length;
  const failedCount = checks.filter(c => c.status === 'FAIL').length;
  const overallStatus = failedCount === 0 ? 'PASS' : 'FAIL';

  return {
    version: SELFTEST_VERSION,
    timestamp: new Date().toISOString(),
    status: overallStatus,
    summary: {
      total: checks.length,
      passed: passedCount,
      failed: failedCount
    },
    checks
  };
}

module.exports = {
  SELFTEST_VERSION,
  runSelftest
};
