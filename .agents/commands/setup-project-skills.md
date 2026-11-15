---
name: "/setup-project-skills"
description: "Analyze project stack, provision skills, and manage post-install setups"
usage: "/setup-project-skills [initial|audit|update|repair|report|skip-setup|verify-setup] [--dry-run] [--project <path>]"
readOnly: false
---

# /setup-project-skills

Analyzes project dependencies and architecture, integrates verified Matt Pocock skills and stack specialists into project scope, and tracks post-install setup lifecycles.

## Usage
```text
/setup-project-skills [initial|audit|update|repair|report|skip-setup|verify-setup] [--dry-run] [--project <path>]
```

## Examples
- `/setup-project-skills initial`
- `/setup-project-skills initial --dry-run`
- `/setup-project-skills audit`
- `/setup-project-skills update`
- `/setup-project-skills repair`
- `/setup-project-skills report`
- `/setup-project-skills skip-setup setup-matt-pocock-skills --reason "custom tracking"`
- `/setup-project-skills verify-setup setup-matt-pocock-skills`

## Direct Execution
```bash
mo7i setup-project-skills $ARGUMENTS
```
