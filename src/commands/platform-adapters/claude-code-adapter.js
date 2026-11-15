/**
 * MO7I Universal Intelligence — Claude Code Command Adapter
 * Version: 2.2.0
 * 
 * Generates and validates native Claude Code custom slash command files
 * in .claude/commands/ and ~/.claude/commands/.
 */

const fs = require('fs');
const path = require('path');

function generateClaudeCommandFiles(targetDir) {
  const claudeCommandsDir = path.join(targetDir, '.claude', 'commands');
  if (!fs.existsSync(claudeCommandsDir)) {
    fs.mkdirSync(claudeCommandsDir, { recursive: true });
  }

  const commands = [
    {
      name: 'mo7i.md',
      content: `---
description: "Universal Intelligence Meta-Orchestrator entry point"
---

# /mo7i [task]

Execute the MO7I Universal Intelligence Meta-Orchestrator for the requested task:
$ARGUMENTS

When invoked:
1. If no arguments are provided, invoke \`node /root/github.com/Sayedmo7i/MO7I-Universal-Intelligence/src/commands/command-router.js help\` and display available commands.
2. If a task is specified:
   - Run \`node /root/github.com/Sayedmo7i/MO7I-Universal-Intelligence/src/commands/command-router.js "$ARGUMENTS"\` to inspect project context and classify domain.
   - Execute the 16-phase autonomous orchestration lifecycle.
   - Verify outcomes with command evidence and log results.
`
    },
    {
      name: 'setup-project-skills.md',
      content: `---
description: "Analyze project technical stack and provision specialist skills"
---

# /setup-project-skills [mode] [options]

Invoke the MO7I Project Intelligence and skill setup engine:
$ARGUMENTS

When invoked:
- Execute: \`node /root/github.com/Sayedmo7i/MO7I-Universal-Intelligence/src/commands/command-router.js setup-project-skills $ARGUMENTS\`
- Supported modes: \`initial\` (default), \`audit\`, \`update\`, \`repair\`, \`report\`
- Options: \`--dry-run\`, \`--project <path>\`
- Scope: Strictly project-scoped (./.agents/skills/), never global.
`
    },
    {
      name: 'mo7i-audit.md',
      content: `---
description: "Perform read-only project and skill audit"
---

# /mo7i-audit

Run read-only audit of project stack, installed skills, and missing capabilities:
Execute: \`node /root/github.com/Sayedmo7i/MO7I-Universal-Intelligence/src/commands/command-router.js audit $ARGUMENTS\`
`
    },
    {
      name: 'mo7i-status.md',
      content: `---
description: "Display MO7I system, project profile, and active engines status"
---

# /mo7i-status

Display comprehensive MO7I system status:
Execute: \`node /root/github.com/Sayedmo7i/MO7I-Universal-Intelligence/src/commands/command-router.js status $ARGUMENTS\`
`
    },
    {
      name: 'mo7i-doctor.md',
      content: `---
description: "Run diagnostic checks on runtimes, scripts, registries, and links"
---

# /mo7i-doctor

Run system diagnostic checks:
Execute: \`node /root/github.com/Sayedmo7i/MO7I-Universal-Intelligence/src/commands/command-router.js doctor $ARGUMENTS\`
`
    }
  ];

  const generated = [];
  for (const cmd of commands) {
    const dest = path.join(claudeCommandsDir, cmd.name);
    fs.writeFileSync(dest, cmd.content, 'utf8');
    generated.push(dest);
  }

  return {
    claudeCommandsDir,
    generated
  };
}

module.exports = {
  generateClaudeCommandFiles
};
