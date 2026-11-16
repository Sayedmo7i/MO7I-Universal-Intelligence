/**
 * MO7I Universal Intelligence — Platform Command Installer & Discovery Linker
 * Version: 2.6.0
 * 
 * Automatically provisions entry points for supported agent environments:
 * - Universal Shell & CLI (bin/mo7i, npx mo7i): VERIFIED
 * - Standard Agent Skills (.agents/skills/): VERIFIED
 * - Claude Code CLI (.claude/commands/): UNVERIFIED (requires interactive authentication)
 * - Cursor (.cursor/rules/): UNVERIFIED (system prompt rules, not slash commands)
 * - OpenAI Codex (.codex/prompts/): UNVERIFIED (no documented slash command loader)
 * - Gemini CLI (.gemini/commands/): UNVERIFIED (no documented slash command loader)
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const { generateClaudeCommandFiles } = require('./platform-adapters/claude-code-adapter');
const { generateCursorCommandFiles } = require('./platform-adapters/cursor-adapter');
const { generateUniversalCommandFiles } = require('./platform-adapters/generic-adapter');

const PLATFORM_VERIFICATION = {
  'Universal Shell & CLI (bin/mo7i)': { 
    status: 'VERIFIED', 
    target: 'bin/',
    evidence: 'Executes natively via Node.js/Bash, runs full dispatch pipeline and records .mo7i/runs/'
  },
  'Standard Agent Skills (.agents/skills/)': { 
    status: 'VERIFIED', 
    target: '.agents/skills/',
    evidence: 'Standard skill specification (.agents/skills/mo7i/SKILL.md) validated by selftest harness'
  },
  'Claude Code Local (.claude/commands/)': { 
    status: 'UNVERIFIED', 
    target: '.claude/commands/',
    note: 'CLI installed (v2.1.325) but requires interactive browser login (/login); cannot be verified non-interactively',
    evidence: 'claude command returns "Not logged in · Please run /login"'
  },
  'Claude Code Global (~/.claude/commands/)': { 
    status: 'UNVERIFIED', 
    target: '~/.claude/commands/',
    note: 'CLI installed (v2.1.325) but requires interactive browser login (/login)',
    evidence: 'Requires human browser authentication'
  },
  'Cursor / Windsurf (.cursor/rules/)': { 
    status: 'UNVERIFIED', 
    target: '.cursor/rules/',
    note: 'Cursor IDE rules provide editor context, not documented slash command discovery',
    evidence: 'CLI binary not present in PATH; rules act as system prompt additions'
  },
  'OpenAI Codex (.codex/prompts/)': { 
    status: 'UNVERIFIED', 
    target: '.codex/prompts/',
    note: 'No documented markdown slash-command discovery standard in upstream Codex specifications',
    evidence: 'Codex CLI lacks directory-based slash-command loader'
  },
  'Gemini CLI (.gemini/commands/)': { 
    status: 'UNVERIFIED', 
    target: '.gemini/commands/',
    note: 'No documented slash-command discovery standard in upstream Gemini specifications',
    evidence: 'Gemini CLI not present in PATH and lacks markdown command loader'
  }
};

function installSlashCommands(targetProjectDir = process.cwd()) {
  const resolvedDir = path.resolve(targetProjectDir);
  const homeDir = os.homedir();
  const summary = {
    targetDir: resolvedDir,
    installedPlatforms: [],
    createdFiles: [],
    verificationMap: PLATFORM_VERIFICATION,
    errors: []
  };

  try {
    // 1. Standard Agent Skills Discovery (.agents/skills/) - VERIFIED
    const agentSkillsDir = path.join(resolvedDir, '.agents', 'skills');
    const skillsSrcDir = path.resolve(__dirname, '../../skills');
    const skillsToLink = ['mo7i', 'mo7i-project-setup'];
    for (const sName of skillsToLink) {
      const srcSkill = path.join(skillsSrcDir, sName, 'SKILL.md');
      if (fs.existsSync(srcSkill)) {
        const destDir = path.join(agentSkillsDir, sName);
        if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
        const destSkill = path.join(destDir, 'SKILL.md');
        fs.copyFileSync(srcSkill, destSkill);
        summary.createdFiles.push(destSkill);

        // For mo7i, ensure lean self-contained references/ directory is copied
        if (sName === 'mo7i') {
          const srcRefs = path.resolve(__dirname, '../../references');
          const destRefs = path.join(destDir, 'references');
          if (fs.existsSync(srcRefs)) {
            if (!fs.existsSync(destRefs)) fs.mkdirSync(destRefs, { recursive: true });
            const refFiles = fs.readdirSync(srcRefs);
            for (const rf of refFiles) {
              const srcFile = path.join(srcRefs, rf);
              const destFile = path.join(destRefs, rf);
              if (fs.statSync(srcFile).isFile()) {
                fs.copyFileSync(srcFile, destFile);
                summary.createdFiles.push(destFile);
              }
            }
          }
        }
      }
    }
    summary.installedPlatforms.push('Standard Agent Skills (.agents/skills/) [VERIFIED]');
  } catch (err) {
    summary.errors.push(`Standard agent skills provisioner: ${err.message}`);
  }

  try {
    // 2. Universal Markdown Commands (commands/ & .agents/commands/)
    const universal = generateUniversalCommandFiles(resolvedDir);
    summary.installedPlatforms.push('Universal Agent Commands (.agents/commands, commands/) [VERIFIED]');
    summary.createdFiles.push(...universal.generated);
  } catch (err) {
    summary.errors.push(`Universal adapter: ${err.message}`);
  }

  try {
    // 3. Claude Code Local Project Commands (.claude/commands/)
    const claudeLocal = generateClaudeCommandFiles(resolvedDir);
    summary.installedPlatforms.push('Claude Code Local (.claude/commands/) [UNVERIFIED: requires human login]');
    summary.createdFiles.push(...claudeLocal.generated);

    // 4. Claude Code User Global Commands (~/.claude/commands/)
    const userClaude = path.join(homeDir, '.claude');
    if (fs.existsSync(userClaude)) {
      const claudeGlobal = generateClaudeCommandFiles(homeDir);
      summary.installedPlatforms.push('Claude Code Global (~/.claude/commands/) [UNVERIFIED: requires human login]');
      summary.createdFiles.push(...claudeGlobal.generated);
    }
  } catch (err) {
    summary.errors.push(`Claude Code adapter: ${err.message}`);
  }

  try {
    // 5. Cursor Rules (.cursor/rules/) - UNVERIFIED
    const cursor = generateCursorCommandFiles(resolvedDir);
    summary.installedPlatforms.push('Cursor / Windsurf (.cursor/rules/) [UNVERIFIED]');
    summary.createdFiles.push(...cursor.generated);
  } catch (err) {
    summary.errors.push(`Cursor adapter: ${err.message}`);
  }

  return summary;
}

module.exports = {
  PLATFORM_VERIFICATION,
  installSlashCommands
};

if (require.main === module) {
  const res = installSlashCommands();
  console.log(`MO7I Slash Commands Installed Successfully.`);
  console.log(`Platforms Supported:`, res.installedPlatforms);
  console.log(`Total Command Files Created: ${res.createdFiles.length}`);
}
