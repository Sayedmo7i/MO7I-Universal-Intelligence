# MO7I Universal Intelligence

> **Universal Intelligence Layer, Autonomous Task Meta-Orchestrator & Official Slash Commands System (v2.4.1)**  
> *The user specifies WHAT needs to be accomplished. MO7I determines HOW to accomplish it.*

A project onboarding and orchestration layer for AI agents: detects the stack, provisions the right skills, tracks manual setup steps, selects the minimum skills per task, verifies with evidence, and logs every run. Same commands and same state (.mo7i/) across projects and agents.

---

## What's New in v2.4.1: Independent Verification Harness & Lean Packaging

Version 2.4.1 introduces an independent verification harness addressing test bias and lean install footprint:

1. **Independent Verification Harness (`/mo7i selftest`)**: Black-box verification suite running against the freshly INSTALLED skill (not repo source) in an isolated temporary project, producing structured JSON (`pass`/`fail` per check).
2. **Self-Contained Lean Packaging**: Packages `setup-engine.js` directly within `skills/mo7i/scripts/` ensuring all inspection, doctor, status, and setup capabilities function out-of-the-box in lean single-skill installations.
3. **Automated CI Workflow**: GitHub Actions workflow (`.github/workflows/selftest.yml`) installing the skill via `npx skills add` on a clean runner and executing the black-box selftest suite.

---

## What's New in v2.4.0: Autonomous Self-Update & Rollback Safety

1. **Autonomous Self-Update (`/mo7i self-update`)**: Automatically detects installed version against remote releases via `git ls-remote` and GitHub API semver resolution.
2. **Read-Only `--check` Mode**: Inspects installed versus latest remote versions and renders a formatted changelog summary without mutating files.
3. **Strict Human Gate**: Non-interactive runs require `--yes` confirmation before replacing skills, ensuring full operator consent.
4. **Scoped Backups & Safe Rollback**: Backs up existing MO7I skills to `.mo7i/backups/<timestamp>/` prior to installation, automatically restoring original files on failure while strictly leaving secrets and project files untouched.
5. **Dry-Run Simulation (`--dry-run`)**: Simulates the complete backup and command invocation lifecycle with zero filesystem writes.
6. **Post-Update Verification & Doctor Diagnostics**: Verifies newly installed skills on disk, executes doctor diagnostics, prints a neutral agent cache restart notice, and records execution audit telemetry in `.mo7i/runs/`.

---

## The Official Command Set

| Command | Usage | Description | Safety Profile |
| :--- | :--- | :--- | :--- |
| **`/mo7i`** | `/mo7i <task>` | Primary entry point to the 16-phase Universal Intelligence Meta-Orchestrator. | Standard Execution |
| **`/mo7i help`** | `/mo7i help` | Displays the complete catalog of commands, syntax, and examples. | Read-Only |
| **`/mo7i setup`** | `/mo7i setup [mode]` | Provisions project-scoped skills (`initial`, `audit`, `update`, `repair`, `report`). | Standard Execution |
| **`/mo7i audit`** | `/mo7i audit` | Performs a read-only audit of project dependencies, installed skills, and drift. | Read-Only |
| **`/mo7i learn`** | `/mo7i learn [skill]` | Executes the 4-phase learning loop and records operational capability contracts. | Standard Execution |
| **`/mo7i discover`** | `/mo7i discover <query>` | Evaluates candidate specialists on skills.sh across 5 dimensions without auto-install. | Read-Only |
| **`/mo7i status`** | `/mo7i status [--json]` | Displays system release, active workspace, stack profile, and registry telemetry. | Read-Only |
| **`/mo7i doctor`** | `/mo7i doctor` | Validates Node.js runtimes, Skills CLI, command registrations, and script integrity. | Read-Only |
| **`/mo7i update`** | `/mo7i update [--dry-run]` | Detects new dependencies and synchronizes project skills with `.bak` backups. | Human Gate Required |
| **`/mo7i self-update`** | `/mo7i self-update [--check]` | Safely updates MO7I skills with semver comparison, backup, and rollback. | Human Gate Required |
| **`/mo7i selftest`** | `/mo7i selftest` | Black-box independent verification of installed skill in a temp project. | Read-Only |

---

## The Integrated Autonomous Execution Lifecycle

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

1. **INTAKE**: Deconstruct user goals or slash command parameters.
2. **PROJECT DETECTION**: Identify project root, git repository boundaries, and environment runtimes.
3. **PROJECT PROFILE INSPECTION**: Audit `.mo7i/project-profile.json` and `.mo7i/skill-registry.json`.
4. **SETUP STATUS CHECK**: Determine whether the project is uninitialized or missing foundational skills.
5. **PROJECT SKILL SETUP (WHEN NEEDED)**: Invoke `mo7i-project-setup` to provision project-scoped skills into `./.agents/skills/`.
6. **TASK CLASSIFICATION**: Categorize immediate task into one of 13 functional domains.
7. **CAPABILITY GAP ANALYSIS**: Determine whether project skills suffice or external specialists are required.
8. **SKILL DISCOVERY**: Discover candidate skills via Vercel Labs `find-skills` (`npx skills find "<keywords>"`).
9. **SKILL LEARNING**: Execute the 4-phase learning loop (Inspect -> Understand -> Integrate -> Validate).
10. **COMPATIBILITY & PLANNING**: Verify candidate skills do not conflict and construct phased roadmap.
11. **SKILL ORCHESTRATION**: Sequence specialist skills across pipeline stages, minimizing context bloat.
12. **EXECUTION**: Implement changes adhering to domain best practices and execute tool commands.
13. **QUALITY VALIDATION**: Run test suites, compilers, and linters ("evidence over claims").
14. **KNOWLEDGE & PROFILE UPDATE**: Record operational insights in memory and update project profile telemetry.
15. **SAFE CLEANUP**: Prune transient task skills while strictly preserving project foundational skills.
16. **FINAL REPORT**: Deliver structured final report citing verified outputs and standardized status labels.

---

## Platform Compatibility & Discovery

| Platform | Native Location | Registration Mechanism | Verification Status |
| :--- | :--- | :--- | :--- |
| **T3 Code** | `.agents/skills/mo7i/` | Native `$mo7i` autocomplete chip & trigger | **`FILE_PRESENT`** (File present; UI discovery verified manually in sandbox) |
| **Universal Shell & CLI** | `bin/mo7i`, `bin/setup-project-skills` | Executable Node.js binary CLI | **`VERIFIED`** (Tested end-to-end) |
| **Claude Code CLI** | `.claude/commands/mo7i.md` | Slash command (standalone Claude Code) | **`VERIFIED`** (Outside T3 Code runtime) |
| **Cursor / Windsurf** | `.cursor/rules/mo7i-commands.mdc` | MDC rule-based command dispatch | **`UNVERIFIED`** (Preserved for compatibility) |
| **OpenAI Codex** | `.codex/prompts/mo7i.md` | Prompt command files | **`UNVERIFIED`** (Preserved for compatibility) |
| **Gemini CLI** | `.gemini/commands/mo7i.toml` | Extension command definitions | **`UNVERIFIED`** (Preserved for compatibility) |

> [!NOTE]
> In T3 Code, skills are discovered via `.agents/skills/<name>/SKILL.md` (invoked as `$name`). T3 Code does not read `.claude/commands`, `.cursor/rules`, `.codex/prompts`, or `.gemini/commands`.

---

## Installation & Usage

Install using the Skills CLI (`npx skills`) or run directly via Node.js / npx. MO7I ships with a lean package footprint (~75 KB) containing only `SKILL.md` and `references/`:

### T3 Code & Project Scope (Recommended)
```bash
# Add main MO7I orchestrator (invokable as $mo7i in T3 Code)
npx skills add Sayedmo7i/MO7I-Universal-Intelligence --skill mo7i -y

# Optional: Add project setup companion (invokable as $mo7i-project-setup in T3 Code)
npx skills add Sayedmo7i/MO7I-Universal-Intelligence --skill mo7i-project-setup -y
```

### Direct Project Bootstrapping via `$mo7i`
Once `$mo7i` is installed, you can trigger project-scoped skill initialization directly without installing a separate command:
```bash
/mo7i setup initial      # Analyzes stack and provisions recommended skills
/mo7i setup audit        # Read-only audit of project skills and companion health
```

### Global Scope (Universal Meta-Orchestrator)
```bash
npx skills add Sayedmo7i/MO7I-Universal-Intelligence --skill mo7i -g -y
```

### CLI & Script Execution
```bash
# Display help and commands catalog
./bin/mo7i help

# Execute a universal engineering task
./bin/mo7i "Build a responsive Next.js landing page"

# Run project setup in initial mode
./bin/setup-project-skills initial

# Audit project dependencies and skills
./bin/mo7i audit

# Run system doctor diagnostics (JSON or formatted text)
./bin/mo7i doctor --json

# Check system status and post-install setups
./bin/mo7i status --json
```

---

## Reference Documentation Index

- [Slash Commands Reference](references/slash-commands.md): Architecture, command specs, parameter schemas, and platform guides.
- [Project Intelligence & Setup](references/project-intelligence.md): Technical analysis engine, Matt Pocock collection, registry schemas.
- [Universal Task Domains](references/task-domains.md): Functional domain taxonomy, missing-service handling.
- [Autonomous Orchestration](references/orchestration.md): 16-phase lifecycle, multi-skill sequencing, precedence.
- [Skill Learning Engine](references/skill-learning-engine.md): 4-phase learning loop, 6 skill states, profile schemas.
- [Skill Discovery](references/skill-discovery.md): `find-skills` workflow, 5-dimension scoring rubric.
- [Skill Lifecycle](references/skill-lifecycle.md): Registry tracking, atomic writes, safe cleanup.
- [Preferences & Memory](references/preferences.md): Cross-project storage, observed vs confirmed preferences.
- [Model Selection](references/model-selection.md): Workload complexity matching, delegation rules.
- [Security & Human Gates](references/security-policy.md): Threat vectors, human gates, zero-secret policy.
- [Execution & Verification](references/execution-and-verification.md): Acceptance criteria, evidence standards.

---

## Contributing & License

Contributions are welcome! Please review [CONTRIBUTING.md](CONTRIBUTING.md) and [SECURITY.md](SECURITY.md) before submitting pull requests.

Licensed under the [MIT License](LICENSE).
