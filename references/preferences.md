# Preferences Management

This document defines the preference resolution hierarchy, private storage schema, and tool probing guarantees implemented by MO7I Universal Intelligence.

---

## 1. Five-Tier Preference Resolution Hierarchy

When executing decisions, conflicting directives are resolved strictly in accordance with this 5-tier descending hierarchy:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Current Prompt Instruction (Highest Authority)           │
│    Direct instructions given in the immediate user turn.    │
├─────────────────────────────────────────────────────────────┤
│ 2. Confirmed Long-Term Preferences                          │
│    Explicitly confirmed by user in ~/.config/mo7i/prefs.json │
├─────────────────────────────────────────────────────────────┤
│ 3. Project-Specific Instructions                            │
│    Local repository rules (AGENTS.md, CLAUDE.md, etc.)      │
├─────────────────────────────────────────────────────────────┤
│ 4. Past Successful Workflows                                │
│    Demonstrated execution patterns in project history.       │
├─────────────────────────────────────────────────────────────┤
│ 5. System Defaults (Lowest Authority)                       │
│    Built-in orchestrator heuristics and agent defaults.     │
└─────────────────────────────────────────────────────────────┘
```

### Hierarchy Rules
- An explicit instruction in the active user prompt always overrides stored long-term preferences.
- Stored long-term preferences override project-level instructions unless the user prompt specifically commands adherence to repository rules.
- Project instructions override historical workflows and built-in defaults.

---

## 2. Storage & Privacy Guarantees

User preferences contain workflow habits, model choices, and environment customizations:
1. **Never in Repository**: Preference files must NEVER be tracked in git, committed to repos, or bundled in published skills.
2. **Private File Path**:
   - Primary: `~/.config/mo7i/preferences.json`
   - Fallback: `~/.mo7i/preferences.json`
3. **Write Protection Gate**:
   - The orchestrator reads `preferences.json` automatically on startup if present.
   - The orchestrator **NEVER writes to `preferences.json`** without explicit user confirmation in chat.

---

## 3. Preferences File Schema

Preferences are split into global defaults and project-specific overrides:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "version": "1.0.0",
  "global": {
    "model_preferences": {
      "preferred_provider": "antigravity",
      "planning_tier": "pro",
      "execution_tier": "flash",
      "image_generation": {
        "preferred_engine": "nano-banana",
        "fallback_engine": "native-generate-image"
      }
    },
    "skill_preferences": {
      "auto_cleanup_temporary": true,
      "max_candidates_to_evaluate": 5,
      "preferred_publishers": ["vercel-labs", "anthropics", "microsoft"]
    },
    "formatting": {
      "markdown_flavor": "github",
      "show_command_evidence": true
    }
  },
  "projects": {
    "/root/github.com/Sayedmo7i/MO7I-Universal-Intelligence": {
      "skill_preferences": {
        "enforce_mit_license": true
      }
    }
  }
}
```

---

## 4. Tool & Capability Verification (No Blind Assumptions)

Never assume that a user's preferred tool, CLI, or model engine is available in the current runtime:
1. **Probe First**: Before invoking a preferred capability, run a non-destructive verification check:
   - For CLIs: `which <tool>` or `<tool> --version`.
   - For subagent models: inspect provider capabilities or environment variables.
   - For image generation: verify presence of registered image tools or APIs.
2. **Graceful Fallback**:
   - If the preferred tool is present, invoke it immediately.
   - If the preferred tool is **absent**:
     1. Do NOT crash or fail silently.
     2. Explain the absence in the report (e.g., *"Preferred tool 'nano-banana' not available in runtime"*).
     3. Fall back to the next best available tool (e.g., native `generate_image` or SVG rendering).
