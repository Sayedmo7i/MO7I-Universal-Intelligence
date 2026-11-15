/**
 * MO7I Universal Intelligence — Platform Command Installer & Discovery Linker
 * Version: 2.2.0
 * 
 * Automatically discovers active agent environments (Claude Code, Cursor, Codex,
 * Gemini CLI, Universal Agent) and provisions native slash command definition files.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const { generateClaudeCommandFiles } = require('./platform-adapters/claude-code-adapter');
const { generateCursorCommandFiles } = require('./platform-adapters/cursor-adapter');
const { generateUniversalCommandFiles } = require('./platform-adapters/generic-adapter');

function installSlashCommands(targetProjectDir = process.cwd()) {
  const resolvedDir = path.resolve(targetProjectDir);
  const homeDir = os.homedir();
  const summary = {
    targetDir: resolvedDir,
    installedPlatforms: [],
    createdFiles: [],
    errors: []
  };

  try {
    // 1. Universal Markdown Commands (commands/ & .agents/commands/)
    const universal = generateUniversalCommandFiles(resolvedDir);
    summary.installedPlatforms.push('Universal Agent Skills (.agents/commands, commands/)');
    summary.createdFiles.push(...universal.generated);
  } catch (err) {
    summary.errors.push(`Universal adapter: ${err.message}`);
  }

  try {
    // 2. Claude Code Local Project Commands (.claude/commands/)
    const claudeLocal = generateClaudeCommandFiles(resolvedDir);
    summary.installedPlatforms.push('Claude Code Local (.claude/commands/)');
    summary.createdFiles.push(...claudeLocal.generated);

    // 3. Claude Code User Global Commands (~/.claude/commands/)
    const userClaude = path.join(homeDir, '.claude');
    if (fs.existsSync(userClaude)) {
      const claudeGlobal = generateClaudeCommandFiles(homeDir);
      summary.installedPlatforms.push('Claude Code Global (~/.claude/commands/)');
      summary.createdFiles.push(...claudeGlobal.generated);
    }
  } catch (err) {
    summary.errors.push(`Claude Code adapter: ${err.message}`);
  }

  try {
    // 4. Cursor / Windsurf Rules (.cursor/rules/)
    const cursor = generateCursorCommandFiles(resolvedDir);
    summary.installedPlatforms.push('Cursor / Windsurf (.cursor/rules/)');
    summary.createdFiles.push(...cursor.generated);
  } catch (err) {
    summary.errors.push(`Cursor adapter: ${err.message}`);
  }

  return summary;
}

module.exports = {
  installSlashCommands
};

if (require.main === module) {
  const res = installSlashCommands();
  console.log(`MO7I Slash Commands Installed Successfully.`);
  console.log(`Platforms Supported:`, res.installedPlatforms);
  console.log(`Total Command Files Created: ${res.createdFiles.length}`);
}
