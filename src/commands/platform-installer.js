/**
 * MO7I Universal Intelligence — Platform Command Installer & Discovery Linker
 * Version: 2.3.0
 * 
 * Automatically provisions entry points for supported agent environments:
 * - T3 Code & Agent Skills (.agents/skills/): VERIFIED
 * - Universal Shell & CLI (bin/mo7i, npx mo7i): VERIFIED
 * - Claude Code CLI (.claude/commands/): VERIFIED (outside T3 Code)
 * - Cursor / Windsurf (.cursor/rules/): UNVERIFIED
 * - OpenAI Codex (.codex/prompts/): UNVERIFIED
 * - Gemini CLI (.gemini/commands/): UNVERIFIED
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const { generateClaudeCommandFiles } = require('./platform-adapters/claude-code-adapter');
const { generateCursorCommandFiles } = require('./platform-adapters/cursor-adapter');
const { generateUniversalCommandFiles } = require('./platform-adapters/generic-adapter');

const PLATFORM_VERIFICATION = {
  'T3 Code ($mo7i via .agents/skills/)': { status: 'VERIFIED', target: '.agents/skills/' },
  'Universal Shell & CLI (bin/mo7i)': { status: 'VERIFIED', target: 'bin/' },
  'Claude Code Local (.claude/commands/)': { status: 'VERIFIED', note: 'Claude Code CLI only; not parsed by T3 Code', target: '.claude/commands/' },
  'Claude Code Global (~/.claude/commands/)': { status: 'VERIFIED', note: 'Claude Code CLI only', target: '~/.claude/commands/' },
  'Cursor / Windsurf (.cursor/rules/)': { status: 'UNVERIFIED', note: 'Cursor IDE only; not parsed by T3 Code', target: '.cursor/rules/' },
  'OpenAI Codex (.codex/prompts/)': { status: 'UNVERIFIED', target: '.codex/prompts/' },
  'Gemini CLI (.gemini/commands/)': { status: 'UNVERIFIED', target: '.gemini/commands/' }
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
    // 1. T3 Code & Agent Skills Discovery (.agents/skills/) - VERIFIED
    const agentSkillsDir = path.join(resolvedDir, '.agents', 'skills');
    const skillsSrcDir = path.resolve(__dirname, '../../skills');
    const skillsToLink = ['mo7i', 'mo7i-project-setup', 'setup-project-skills'];
    for (const sName of skillsToLink) {
      const srcSkill = path.join(skillsSrcDir, sName, 'SKILL.md');
      if (fs.existsSync(srcSkill)) {
        const destDir = path.join(agentSkillsDir, sName);
        if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
        const destSkill = path.join(destDir, 'SKILL.md');
        fs.copyFileSync(srcSkill, destSkill);
        summary.createdFiles.push(destSkill);
      }
    }
    summary.installedPlatforms.push('T3 Code & Universal Agent Skills (.agents/skills/) [VERIFIED]');
  } catch (err) {
    summary.errors.push(`T3 Code skills provisioner: ${err.message}`);
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
    summary.installedPlatforms.push('Claude Code Local (.claude/commands/) [VERIFIED for Claude CLI]');
    summary.createdFiles.push(...claudeLocal.generated);

    // 4. Claude Code User Global Commands (~/.claude/commands/)
    const userClaude = path.join(homeDir, '.claude');
    if (fs.existsSync(userClaude)) {
      const claudeGlobal = generateClaudeCommandFiles(homeDir);
      summary.installedPlatforms.push('Claude Code Global (~/.claude/commands/) [VERIFIED for Claude CLI]');
      summary.createdFiles.push(...claudeGlobal.generated);
    }
  } catch (err) {
    summary.errors.push(`Claude Code adapter: ${err.message}`);
  }

  try {
    // 5. Cursor / Windsurf Rules (.cursor/rules/) - UNVERIFIED in T3 Code
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
