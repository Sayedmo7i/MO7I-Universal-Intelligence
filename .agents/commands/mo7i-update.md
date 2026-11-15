---
name: "/mo7i update"
description: "Check for stack changes, skill updates, and registry sync"
usage: "/mo7i update [--dry-run] [--project <path>]"
readOnly: false
---

# /mo7i update

Detects new project dependencies, identifies newly recommended skills, checks upstream updates, and safely synchronizes the project registry with backups.

## Usage
```text
/mo7i update [--dry-run] [--project <path>]
```

## Examples
- `/mo7i update`
- `/mo7i update --dry-run`

## Direct Execution
```bash
mo7i update $ARGUMENTS
```
