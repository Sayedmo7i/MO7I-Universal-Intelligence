# Skill Registry & Lifecycle Management

This document defines the schema, persistence guarantees, and lifecycle transition rules for skills managed by MO7I Universal Intelligence.

---

## 1. Registry Architecture & Location

The orchestrator maintains an explicit, audited inventory of all installed skills to prevent ghost dependencies, version conflicts, and storage bloat.

### File Locations
- **Primary Location**: `~/.config/mo7i/universal-intelligence/skill-registry.json`
- **Fallback Location**: `~/.mo7i/universal-intelligence/skill-registry.json`

The directory is created automatically on first initialization with strict user read/write permissions (`0700` directory, `0600` file).

---

## 2. Registry Schema

The registry stores structured metadata for each registered skill. Secrets, auth tokens, passwords, and private API keys are strictly forbidden.

```json
{
  "version": "1.0.0",
  "updated_at": "2026-11-15T18:00:00Z",
  "skills": {
    "nextjs-developer": {
      "name": "nextjs-developer",
      "source": "jeffallan/claude-skills@nextjs-developer",
      "scope": "project",
      "install_date": "2026-11-15T18:00:00Z",
      "installed_by": "mo7i-universal-intelligence",
      "type": "temporary",
      "last_used": "2026-11-15T18:30:00Z",
      "verification_status": "VERIFIED",
      "dependencies": [],
      "cleanup_eligibility": true,
      "project_path": "/workspace/my-nextjs-app"
    }
  }
}
```

### Field Definitions
- `name` (string, required): Lowercase hyphenated skill slug matching directory name.
- `source` (string, required): GitHub repository identifier, git URL, or local path.
- `scope` (string, enum: `["global", "project"]`): Scope of installation.
- `install_date` (string, ISO 8601): Timestamp of initial install.
- `installed_by` (string): Identifies installer agent/process (`"mo7i-universal-intelligence"` or `"user"`).
- `type` (string, enum: `["core", "pinned", "persistent", "temporary"]`):
  - `core`: Orchestrator dependencies (e.g., `find-skills`). Never automatically uninstalled.
  - `pinned`: User-explicit permanent skills. Never automatically uninstalled.
  - `persistent`: Multi-session skills retained across runs.
  - `temporary`: Task-specific skills installed for immediate workflow execution. Eligible for cleanup.
- `last_used` (string, ISO 8601): Timestamp of most recent execution.
- `verification_status` (string, enum: `["VERIFIED", "UNVERIFIED", "FAILED"]`): Status of post-install probe.
- `dependencies` (array of strings): Other skill slugs or tools required by this skill.
- `cleanup_eligibility` (boolean): `true` only if `type === "temporary"` and `installed_by === "mo7i-universal-intelligence"`.
- `project_path` (string, optional): Absolute path of the project when scope is `project`.

---

## 3. Atomic Write & Recovery Protocol

To prevent registry corruption during unexpected process interruptions:

1. **Pre-Write Backup**: Before modifying `skill-registry.json`, copy the existing file to `skill-registry.json.bak`.
2. **Atomic Write Pattern**:
   - Write updated contents to a temporary sibling file: `skill-registry.json.tmp.<pid>`.
   - Flush and sync to disk.
   - Atomically rename `skill-registry.json.tmp.<pid>` over `skill-registry.json`.
3. **Recovery on Corruption**:
   - If `skill-registry.json` is missing or contains invalid JSON, attempt to parse `skill-registry.json.bak`.
   - If both fail, regenerate a clean empty registry initialized with detected core skills.
   - Log an explicit warning detailing the recovery event.

---

## 4. Lifecycle Transitions & State Machine

Skills transition through the following lifecycle states:

```
[DISCOVERED] ──► [VETTED] ──► [INSTALLED] ──► [VERIFIED] ──► [ACTIVE]
                                                                │
                                ┌───────────────────────────────┘
                                ▼
                       [WORKFLOW COMPLETE]
                                │
                 ┌──────────────┴──────────────┐
                 ▼                             ▼
       [type === "temporary"]        [type !== "temporary"]
                 │                             │
                 ▼                             ▼
      [Execute Safe Cleanup]                 [RETAIN]
                 │                      (Update last_used)
                 ▼
       [npx skills remove]
                 │
                 ▼
       [Verify Deletion]
                 │
                 ▼
        [Deregister Entry]
```

---

## 5. Safe Automated Cleanup Protocol

Automated cleanup removes temporary skills at workflow completion to maintain system cleanliness:

### Cleanup Eligibility Gate
A skill is eligible for automated removal **ONLY IF ALL** conditions are satisfied:
1. `installed_by === "mo7i-universal-intelligence"` (the orchestrator installed it).
2. `type === "temporary"`.
3. `type !== "core"` AND `type !== "pinned"`.
4. No other concurrent project or active workflow depends on the skill.

### Ambiguity Rule
If there is any ambiguity regarding whether another project uses the skill, or if the skill was pre-existing before the orchestrator session:
- **DO NOT DELETE**.
- Mark the registry entry as `"cleanup_candidate"`: `true`.
- Notify the user of the candidate status in the final summary report.

### Removal Execution Steps
1. Determine exact removal command based on scope:
   ```bash
   # For global scope:
   npx skills remove <name> -g -y

   # For project scope:
   npx skills remove <name> -y
   ```
2. Verify removal from filesystem (confirm directory in `.agents/skills/<name>` no longer exists).
3. Remove entry from `skill-registry.json` using atomic write protocol.
4. Record removal action in final report.
