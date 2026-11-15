---
description: "Analyze project technical stack and provision specialist skills"
---

# /setup-project-skills [mode] [options]

Invoke the MO7I Project Intelligence and skill setup engine:
$ARGUMENTS

When invoked:
- Execute: `node /root/github.com/Sayedmo7i/MO7I-Universal-Intelligence/src/commands/command-router.js setup-project-skills $ARGUMENTS`
- Supported modes: `initial` (default), `audit`, `update`, `repair`, `report`
- Options: `--dry-run`, `--project <path>`
- Scope: Strictly project-scoped (./.agents/skills/), never global.
