---
name: "/mo7i audit"
description: "Read-only audit of project stack, skills, configuration, and capabilities"
usage: "/mo7i audit [--project <path>]"
readOnly: true
---

# /mo7i audit

Performs a comprehensive, non-destructive audit of the current workspace, detecting installed skills, missing capabilities, configuration health, and drift.

## Usage
```text
/mo7i audit [--project <path>]
```

## Examples
- `/mo7i audit`
- `/mo7i audit --project ./services/web`

## Direct Execution
```bash
mo7i audit $ARGUMENTS
```
