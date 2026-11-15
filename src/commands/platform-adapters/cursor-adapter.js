/**
 * MO7I Universal Intelligence — Cursor & Windsurf Command Adapter
 * Version: 2.2.0
 * 
 * Generates Cursor rules and slash command triggers in .cursor/rules/ and .cursorrules.
 */

const fs = require('fs');
const path = require('path');

function generateCursorCommandFiles(targetDir) {
  const cursorRulesDir = path.join(targetDir, '.cursor', 'rules');
  if (!fs.existsSync(cursorRulesDir)) {
    fs.mkdirSync(cursorRulesDir, { recursive: true });
  }

  const ruleContent = `---
description: "MO7I Universal Intelligence Slash Commands & Rules"
globs: ["*"]
---

# MO7I Slash Command Interface

When the user enters slash commands starting with /mo7i or /setup-project-skills:

- **/mo7i <task>**: Route task to the MO7I Universal Intelligence Meta-Orchestrator. Run \`node ./src/commands/command-router.js "$TASK"\`.
- **/mo7i help**: Display all MO7I commands. Run \`node ./src/commands/command-router.js help\`.
- **/setup-project-skills [mode]**: Invoke MO7I Project Intelligence. Run \`node ./src/commands/command-router.js setup-project-skills [mode]\`.
- **/mo7i audit**: Run read-only stack audit. Run \`node ./src/commands/command-router.js audit\`.
- **/mo7i status**: Display system status. Run \`node ./src/commands/command-router.js status\`.
- **/mo7i doctor**: Run system diagnostics. Run \`node ./src/commands/command-router.js doctor\`.
`;

  const dest = path.join(cursorRulesDir, 'mo7i-commands.mdc');
  fs.writeFileSync(dest, ruleContent, 'utf8');

  return {
    cursorRulesDir,
    generated: [dest]
  };
}

module.exports = {
  generateCursorCommandFiles
};
