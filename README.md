# MO7I Universal Intelligence

> **Universal Intelligence Layer, Autonomous Task Meta-Orchestrator & Official Slash Commands System (v2.3.0)**  
> *The user specifies WHAT needs to be accomplished. MO7I determines HOW to accomplish it.*

MO7I Universal Intelligence is an autonomous intelligence layer, task meta-orchestrator, project intelligence engine, and native slash command system built on the open [Agent Skills](https://skills.sh) standard. It operates as the single autonomous entry point across all engineering repositories and domains.

Rather than expecting users to manually configure tools or remember complex prompts, MO7I provides direct native slash command entry points (`/mo7i`, `/setup-project-skills`, `/mo7i audit`, etc.) and native T3 Code autocomplete chips (`$mo7i`, `$setup-project-skills`), automatically inspects projects, detects frameworks and architectures, provisions project-scoped specialist skills (including the verified Matt Pocock collection), handles post-install setup companions with Human Gate guards, learns operational contracts, coordinates multi-skill pipelines, enforces zero-trust safety boundaries, and verifies outcomes with real execution evidence.

---

## What's New in v2.3.0: T3 Code Entry Points, Post-Install Setups & Hardening

Version 2.3.0 resolves T3 Code skill discovery, introduces automated post-install setup handling, and hardens the orchestrator core:

1. **Native T3 Code Entry Points**: Directly invokable via `$mo7i` (and companion `$mo7i-project-setup`) chips in T3 Code through compliant `.agents/skills/` manifests.
2. **Post-Install Setup Engine**: Automatically detects companion setups (`setup-*`, `init-*`, `onboard*`) required by installed collections (e.g., Matt Pocock skills requiring `setup-matt-pocock-skills`).
3. **Strict Human Gate for Interactive Setups**: Never fabricates or silently guesses answers for interactive setup skills; surfaces prominent notices when human input is needed.
4. **Setup State Tracking & Verification**: Tracks setup lifecycle states (`not-required`, `pending`, `in-progress`, `completed`, `skipped`, `failed`) and verifies completion against real on-disk artifact evidence.
5. **Platform Truth & Verification**: Explicitly marks verified runtimes (`t3-code`, universal CLI, Claude Code CLI outside T3 Code) versus unverified runtimes (`cursor`, `codex`, `gemini-cli`).
6. **Orchestrator Hardening & Evidence**: Fast Path for trivial tasks with phase telemetry, dynamic TCP port probing for preview servers, capability-gap analysis reporting "no gap" when existing tools suffice, strict path traversal defense, and real per-run audit logging (`.mo7i/runs/<timestamp>.json`) recording phases executed, skills read/excluded, and tools called.
7. **Research Evidence Protocol & Clean Setups**: Enforces at least 3 web searches and 2 source fetches before citing figures, prohibits non-tool URLs, and strictly excludes MO7I's own skills (`mo7i`, `mo7i-project-setup`) from post-install setup detection.

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
