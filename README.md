# MO7I Universal Intelligence

> **Universal Intelligence Layer, Autonomous Task Meta-Orchestrator & Official Slash Commands System (v2.2.0)**  
> *The user specifies WHAT needs to be accomplished. MO7I determines HOW to accomplish it.*

MO7I Universal Intelligence is an autonomous intelligence layer, task meta-orchestrator, project intelligence engine, and native slash command system built on the open [Agent Skills](https://skills.sh) standard. It operates as the single autonomous entry point across all engineering repositories and domains.

Rather than expecting users to manually configure tools or remember complex prompts, MO7I provides direct native slash command entry points (`/mo7i`, `/setup-project-skills`, `/mo7i audit`, etc.), automatically inspects projects, detects frameworks and architectures, provisions project-scoped specialist skills (including the verified Matt Pocock collection), learns operational contracts, coordinates multi-skill pipelines, enforces zero-trust safety boundaries, and verifies outcomes with real execution evidence.

---

## What's New in v2.2.0: Official Slash Commands System

Version 2.2.0 introduces native, executable Slash Commands across all supported agent environments:

```text
User Slash Commands
  ├── /mo7i [task]              -> Autonomous Universal Intelligence Meta-Orchestrator
  ├── /mo7i help                -> Command catalog, usage syntax, and platform guides
  ├── /setup-project-skills     -> Project Intelligence & Skill Setup (mo7i-project-setup)
  ├── /mo7i audit               -> Read-only project stack, skills, and configuration audit
  ├── /mo7i learn [skill]       -> 4-phase Skill Learning Engine (Inspect -> Understand -> Integrate -> Validate)
  ├── /mo7i discover <query>    -> find-skills dynamic discovery with 5-dimension scoring
  ├── /mo7i status              -> System telemetry, project archetype, and installed skills inventory
  ├── /mo7i doctor              -> Diagnostics for runtimes, scripts, registries, and links
  └── /mo7i update              -> Dependency drift detection and safe registry synchronization
```

### Key Highlights:
1. **Real Native Slash Commands**: Registered and discoverable in Claude Code (`.claude/commands/`), Cursor (`.cursor/rules/`), and universal shell/agents (`bin/mo7i`).
2. **Unified Command Router**: Reuses core engines without duplicating business logic; features input tokenization and strict path traversal protection.
3. **Safety & Read-Only Strictness**: Inspection commands (`audit`, `status`, `doctor`, `help`, `discover`) are guaranteed non-destructive.
4. **Approval Gate Integration**: Destructive actions and package updates require explicit user authorization.

---

## The Official Command Set

| Command | Usage | Description | Safety Profile |
| :--- | :--- | :--- | :--- |
| **`/mo7i`** | `/mo7i <task>` | Primary entry point to the 16-phase Universal Intelligence Meta-Orchestrator. | Standard Execution |
| **`/mo7i help`** | `/mo7i help` | Displays the complete catalog of commands, syntax, and examples. | Read-Only |
| **`/setup-project-skills`** | `/setup-project-skills [mode]` | Provisions project-scoped skills (`initial`, `audit`, `update`, `repair`, `report`). | Standard Execution |
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

| Platform | Native Location | Registration Mechanism |
| :--- | :--- | :--- |
| **Claude Code** | `.claude/commands/` and `~/.claude/commands/` | Native Markdown slash commands (`mo7i.md`, `setup-project-skills.md`) |
| **Cursor & Windsurf** | `.cursor/rules/` and `.cursorrules` | MDC rule-based command dispatch (`mo7i-commands.mdc`) |
| **OpenAI Codex** | `.codex/prompts/` | Prompt command files |
| **Gemini CLI** | `.gemini/commands/` | Command extensions |
| **Universal Shell & Agent** | `bin/mo7i`, `bin/setup-project-skills` | Executable Node.js binary via `npx mo7i` or local path |

---

## Installation & Usage

Install using the Skills CLI (`npx skills`) or run directly via Node.js / npx:

### Global Scope (Universal Meta-Orchestrator)
```bash
npx skills add Sayedmo7i/MO7I-Universal-Intelligence --skill mo7i-universal-intelligence -g -y
```

### Project Scope (Companion Skill & Project Setup)
```bash
npx skills add Sayedmo7i/MO7I-Universal-Intelligence --skill mo7i-project-setup -y
```

### CLI Execution
```bash
# Display help and commands catalog
./bin/mo7i help

# Execute a universal engineering task
./bin/mo7i "Build a responsive Next.js landing page"

# Run project setup in initial mode
./bin/setup-project-skills initial

# Audit project dependencies and skills
./bin/mo7i audit

# Run system doctor diagnostics
./bin/mo7i doctor
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
