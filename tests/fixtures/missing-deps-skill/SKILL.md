---
name: missing-deps-skill
description: Fixture skill that requires unavailable system dependencies to test runtime validation.
---

# Missing Dependencies Skill

## Required Dependencies
- `nonexistent-esoteric-compiler-binary-xyz` (CLI binary)
- `CUSTOM_SECRET_ENV_VAR_UNSET` (Environment variable)

## Execution Instructions
1. Run `nonexistent-esoteric-compiler-binary-xyz --compile main.src`.
