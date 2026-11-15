---
description: "Universal Intelligence Meta-Orchestrator entry point"
---

# /mo7i [task]

Execute the MO7I Universal Intelligence Meta-Orchestrator for the requested task:
$ARGUMENTS

When invoked:
1. If no arguments are provided, invoke `node /root/github.com/Sayedmo7i/MO7I-Universal-Intelligence/src/commands/command-router.js help` and display available commands.
2. If a task is specified:
   - Run `node /root/github.com/Sayedmo7i/MO7I-Universal-Intelligence/src/commands/command-router.js "$ARGUMENTS"` to inspect project context and classify domain.
   - Execute the 16-phase autonomous orchestration lifecycle.
   - Verify outcomes with command evidence and log results.
