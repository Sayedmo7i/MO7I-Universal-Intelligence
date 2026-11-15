---
name: "/setup-project-skills"
description: "Analyze project stack and provision project-scoped specialist skills"
usage: "/setup-project-skills [initial|audit|update|repair|report] [--dry-run] [--project <path>]"
readOnly: false
---

# /setup-project-skills

Analyzes project dependencies and architecture, integrates verified Matt Pocock skills and stack specialists into project scope without global pollution.

## Usage
```text
/setup-project-skills [initial|audit|update|repair|report] [--dry-run] [--project <path>]
```

## Examples
- `/setup-project-skills initial`
- `/setup-project-skills initial --dry-run`
- `/setup-project-skills audit`
- `/setup-project-skills update`
- `/setup-project-skills repair`
- `/setup-project-skills report`

## Direct Execution
```bash
mo7i setup-project-skills $ARGUMENTS
```
