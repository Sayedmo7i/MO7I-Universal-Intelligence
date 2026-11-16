---
name: mo7i
description: "Universal Intelligence Layer, Autonomous Task Meta-Orchestrator & Multi-Platform Entry Point (v2.5.0). Activates when: the user specifies WHAT to accomplish across any domain (software engineering, mobile, UI/UX, DevOps, marketing/SEO, research, data, or general workflows) without manually selecting tools, or invokes subcommands (audit, learn, discover, status, doctor, update, self-update, selftest, help, or a free-form task). Autonomously analyzes project stacks, provisions project-scoped skills, manages post-install setup lifecycles, and executes with verifiable evidence."
---

# MO7I Universal Intelligence

Universal Intelligence Layer, Autonomous Task Meta-Orchestrator, and Multi-Platform Entry Point (v2.5.0).

MO7I serves as the single autonomous entry point across all repositories and engineering tasks. It operates on a core principle: **The user specifies WHAT needs to be accomplished; MO7I determines HOW to accomplish it.**

---

## 1. Subcommands & Invocations

When invoking the skill (via `$mo7i`, `/mo7i`, or `./bin/mo7i`), you can supply either a natural-language task or an official subcommand:

```text
$mo7i [subcommand or task]
  ├── audit                  -> Read-only project stack, skills, and configuration audit
  ├── status [--json]        -> System telemetry, project archetype, and installed skills inventory
  ├── doctor [--json]        -> Diagnostics for runtimes, scripts, registries, and platform verification
  ├── discover <query>       -> Dynamic skill discovery on skills.sh with 5-dimension scoring
  ├── learn [skill]          -> 4-phase Skill Learning Engine (Inspect -> Understand -> Integrate -> Validate)
  ├── update [--dry-run]     -> Dependency drift detection and safe registry synchronization
  ├── self-update [--check]  -> Autonomous self-updater with backup, rollback, and semver detection
  ├── selftest               -> Black-box independent verification of installed skill footprint
  ├── help                   -> Command catalog, usage syntax, and platform guides
  └── <natural-language task> -> Autonomous Universal Intelligence Meta-Orchestrator (16-phase lifecycle)
```

---

## 2. Fast Path for Trivial Tasks

To avoid unnecessary latency and context bloat, MO7I incorporates a **Fast Path** engine:

### Fast Path Criteria:
A task executes via the Fast Path when it satisfies ANY of the following:
1. **Single-file minor edit**: modifying or fixing typos in a single file (< 50 lines modified).
2. **Direct query or explanation**: questions regarding code architecture, explanation of functions, or simple lookups.
3. **Explicit atomic command**: running an explicit test, lint, or format command without requiring cross-domain pipeline orchestration.

### Fast Path Lifecycle:
```
[1. INTAKE] ──► [2. PROJECT DETECTION] ──► [FAST PATH EXECUTION] ──► [16. FINAL REPORT]
```
Phases 3-15 (discovery, learning, deep planning) are skipped. Executed phases are recorded in execution telemetry (`phasesExecuted`).

---

## 3. The 16-Phase Meta-Orchestration Lifecycle (Standard Path)

For non-trivial tasks, MO7I executes the full autonomous pipeline:

```
[1. INTAKE] ──► [2. PROJECT DETECTION] ──► [3. PROJECT PROFILE INSPECTION]
                                                      │
[6. TASK CLASSIFICATION] ◄── [5. PROJECT SETUP (WHEN NEEDED)] ◄── [4. SETUP STATUS CHECK]
         │
         ▼
[7. CAPABILITY GAP ANALYSIS] ──► [8. SKILL DISCOVERY] ──► [9. SKILL LEARNING]
                                                              │
[12. EXECUTION] ◄── [11. SKILL ORCHESTRATION] ◄── [10. COMPATIBILITY & PLANNING]
         │
         ▼
[13. QUALITY VALIDATION] ──► [14. KNOWLEDGE & PROFILE UPDATE] ──► [15. SAFE CLEANUP] ──► [16. FINAL REPORT]
```

- **Phase 4 & 5 (Post-Install Setups & Human Gate)**: Detects companion setups required by installed skills. When an interactive setup requires human input, it halts at an explicit Human Gate and requests authorization (`skip-setup` or manual input). It strictly never fabricates answers.
- **Phase 7 (Capability Gap Analysis)**: Reports "no gap" when existing tools suffice for the current task; reports capability gaps with targeted `discover` queries when specialized domains are uncovered.
- **Phase 12 (Execution & Research Protocol)**: Enforces dynamic port probing for preview servers. For research tasks, executes at least 3 web searches and fetches 2 sources before citing figures, never citing URLs not returned by a tool.
- **Phase 13 (Quality Validation)**: Compilers, typecheckers, and test suites run to produce real evidence ("Evidence over claims").
- **Phase 14 & 16 (Per-Run Log & Final Report)**: Writes a real per-run audit log (`.mo7i/runs/<timestamp>.json`) recording phases executed, skills read/excluded, and tools called.


---

## 4. Platform Discovery & Verification

| Platform | Invocation Mechanism | Verified Status |
| :--- | :--- | :--- |
| **Universal Shell & Agent** | `bin/mo7i`, `npx mo7i` | **VERIFIED** |
| **Claude Code** | Native commands in `.claude/commands/` | **VERIFIED (Claude Code CLI only)** |
| **Cursor & Windsurf** | MDC rules in `.cursor/rules/` | **UNVERIFIED (Cursor IDE only)** |
| **OpenAI Codex** | Prompt commands in `.codex/prompts/` | **UNVERIFIED** |
| **Gemini CLI** | Command extensions in `.gemini/commands/` | **UNVERIFIED** |
