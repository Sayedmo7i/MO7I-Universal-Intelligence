---
name: mo7i-project-setup
description: "Project Intelligence & Automated Specialist Skill Setup for MO7I Universal Intelligence. Autonomously analyzes project technical stack, inspects frameworks, architectures, dependencies, and development tools, discovers suitable specialist skills via find-skills, integrates the verified official Matt Pocock skills collection, and provisions persistent, project-scoped specialist skill environments with zero global pollution."
---

# MO7I Project Intelligence & Automated Skill Setup

A reusable companion skill for **MO7I Universal Intelligence** that analyzes project codebases and automatically establishes a tailored, project-scoped specialist skill environment.

The core principle: **When MO7I enters a new or uninitialized project, it automatically identifies the exact technical stack and configures the foundational intelligence and specialist skills required for that project's entire lifecycle.**

---

## 1. Activation Guidelines

### When to Activate
- **New Project Detected**: A project workspace without an established `.mo7i/project-profile.json`.
- **Incomplete Setup**: Existing project with partial skill coverage or missing core stack specialists.
- **Technology Stack Evolution**: Significant additions or changes in dependencies (e.g., adding Tailwind CSS, Prisma ORM, BLoC, or new frameworks).
- **User Explicit Request**: When the user requests `project setup`, `initialize skills`, `audit project skills`, `repair project skills`, or `update project skills`.
- **Pre-Task Verification Gate**: Automatically triggered by Phase 2/3 of the Universal Orchestrator before executing tasks on unfamiliar repositories.

### When NOT to Activate
- Normal recurring task turns where the project is already initialized and the skill profile is healthy.
- Trivial file edits or conversational interactions.
- Simple tasks where existing foundational skills already cover the operational domain.

---

## 2. Operating Modes

The setup engine operates in five distinct modes:

| Mode | Purpose | Disk Changes | Primary Command |
| :--- | :--- | :--- | :--- |
| **INITIAL SETUP** | Full technical analysis, candidate discovery, and project-scoped installation of verified skills. | Installs skills to `./.agents/skills/`, writes `.mo7i/` registries. | `mo7i-project-setup initial [path]` |
| **AUDIT** | Non-destructive check of installed skills against project stack requirements. Identifies gaps, drift, and unmanaged skills. | **None** (Read-only analysis). | `mo7i-project-setup audit [path]` |
| **UPDATE** | Re-analyzes dependencies, discovers newly required specialist skills, and installs missing tools while preserving user customizations. | Adds new missing skills, updates registries with backups. | `mo7i-project-setup update [path]` |
| **REPAIR** | Detects missing or corrupted skill directories on disk and reinstalls them according to `skills-lock.json` and `.mo7i/skill-registry.json`. | Reinstalls missing/corrupted skills only. | `mo7i-project-setup repair [path]` |
| **REPORT** | Generates an executive Markdown inventory detailing installed specialists, sources, categories, and architectural justifications. | Writes or displays `.mo7i/setup-report.md`. | `mo7i-project-setup report [path]` |

---

## 3. Project Analysis Engine

Before selecting or installing any skill, the engine inspects repository artifacts without assuming technologies based solely on directory names:

1. **Agent Instructions**: `AGENTS.md`, `CLAUDE.md`, `README.md`.
2. **Dependency Manifests & Locks**:
   - Node/TypeScript: `package.json`, `pnpm-lock.yaml`, `package-lock.json`, `yarn.lock`, `bun.lockb`.
   - PHP/Laravel: `composer.json`, `composer.lock`.
   - Flutter/Dart: `pubspec.yaml`, `pubspec.lock`.
   - Python: `requirements.txt`, `pyproject.toml`, `Pipfile`.
3. **Framework Configurations**: `next.config.*`, `vite.config.*`, `nuxt.config.*`, `tsconfig.json`, `tailwind.config.*`, `artisan`.
4. **Source Architecture**: Directory layout (`src/app`, `lib/`, `tests/`), state management libraries, API patterns.
5. **Testing & QA**: Test runners (`vitest`, `jest`, `playwright`, `cypress`, `flutter_test`, `phpunit`, `pest`, `pytest`).
6. **Deployment & DevOps**: `Dockerfile`, `docker-compose.yml`, `.github/workflows/`.
7. **Existing Skills**: Scans `./.agents/skills/`, `./.gemini/skills/`, and `skills-lock.json` to prevent overwriting user-authored skills.

---

## 4. Mandatory Matt Pocock Skills Integration

The engine integrates the official, verified **Matt Pocock Skills Collection**:
- **Publisher**: Matt Pocock (`mattpocock`)
- **Source**: `https://github.com/mattpocock/skills.git`
- **Catalog**: `https://skills.sh/mattpocock/skills`
- **Total Discovered**: 39 skills
- **Verified Active in Project Scope**: 38 skills
- **Skipped Upstream**: 1 skill (`software-factory` due to upstream YAML description syntax error in `skills/in-progress/software-factory/SKILL.md`).

### Verified Matt Pocock Skills Roster:
`ask-matt`, `code-review`, `codebase-design`, `diagnosing-bugs`, `domain-modeling`, `grill-with-docs`, `implement`, `implement-spec`, `improve-codebase-architecture`, `pr`, `prototype`, `research`, `retro`, `setup-matt-pocock-skills`, `tdd`, `to-spec`, `to-tickets`, `triage`, `wayfinder`, `wizard`, `grill-me`, `grilling`, `handoff`, `teach`, `to-questionnaire`, `wait-what`, `writing-for-agents`, `chief-of-staff`, `claude-handoff`, `loop-me`, `setup-ts-deep-modules`, `writing-beats`, `writing-fragments`, `writing-shape`, `git-guardrails-claude-code`, `migrate-to-shoehorn`, `scaffold-exercises`, `setup-pre-commit`.

---

## 5. Skill Categorization Structure

All candidate project skills are organized into 6 standardized categories:

1. **A. CORE PROJECT SKILLS**: Foundational skills required for the project's primary framework and language (e.g., `nextjs-best-practices`, `flutter-specialist`, `laravel-core`).
2. **B. DEVELOPMENT SKILLS**: Implementation, architecture, and developer workflow (`implement`, `codebase-design`, `prototype`, `wayfinder`).
3. **C. QUALITY ASSURANCE**: Testing, debugging, accessibility, and security (`tdd`, `diagnosing-bugs`, `code-review`, `setup-pre-commit`).
4. **D. PROJECT-SPECIFIC SPECIALISTS**: Specialists mapped to specific project features (e.g., `setup-ts-deep-modules`, `mobile-ui-ux`, `migrate-to-shoehorn`).
5. **E. MATT POCOCK COLLECTION**: Complete verified skills from the official Matt Pocock collection.
6. **F. OPTIONAL SKILLS**: Specialized tools requiring explicit review prior to activation (e.g., `scaffold-exercises`).

---

## 6. Project-Scope Installation & Security Guarantees

### Scope Isolation
- **Strictly Project-Level**: All skills install into `<projectRoot>/.agents/skills/<skill-name>/` managed via `skills-lock.json`.
- **Global Installation Strictly Forbidden**: Flags such as `-g` or `--global` are barred during project setup.
- **Cross-Project Protection**: Changes made within one repository never modify `~/.agents/skills` or unrelated project workspaces.

### User Skill Preservation
- Pre-existing skills in `./.agents/skills/` are cataloged and preserved.
- The engine checks for existing skill directories and never overwrites user-authored customizations without explicit instruction.

### Zero-Secret Policy
- The engine actively scrubs credentials, private keys (`id_rsa`), tokens (`AWS_*`, `STRIPE_*`, `GITHUB_TOKEN`), and `.env` values before saving any `.mo7i/` metadata.
- Pre-install static security audits scan for suspicious shell scripts, destructive commands (`rm -rf /`), or prompt injections.

---

## 7. Project Intelligence Registry

Every initialized project maintains its persistent metadata inside the project root under `.mo7i/`:

- `.mo7i/project-profile.json`: Detected technical stack, versions, architecture, test runners, and setup timestamp.
- `.mo7i/skill-registry.json`: Installed skills inventory, categories, installation scope, and upstream package identifiers.
- `.mo7i/setup-report.md`: Markdown summary of project intelligence and specialist capabilities.
- Backups (`.bak`) are automatically generated prior to any registry modification.

---

## 8. Slash Command & CLI Usage

### Native Slash Command
In any supported agent environment (Claude Code, Cursor, etc.):
```text
/setup-project-skills initial
/setup-project-skills initial --dry-run
/setup-project-skills audit
/setup-project-skills update
/setup-project-skills repair
/setup-project-skills report
```

### Direct CLI Invocation
Run directly via Node.js or the bundled binary:

```bash
# Initial complete setup
setup-project-skills initial /path/to/project
# or: node skills/mo7i-project-setup/scripts/setup-engine.js initial /path/to/project

# Dry run analysis without writing changes
setup-project-skills initial /path/to/project --dry-run

# Audit project skills against current dependencies
setup-project-skills audit /path/to/project

# Update skills after adding new frameworks/tools
setup-project-skills update /path/to/project

# Repair corrupted or missing skills
setup-project-skills repair /path/to/project

# Generate and print project inventory report
setup-project-skills report /path/to/project
```
