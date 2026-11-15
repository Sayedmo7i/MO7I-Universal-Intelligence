# Changelog

All notable changes to the `mo7i-universal-intelligence` skill will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.2.0] - 2026-11-15

### Added
- **Official Slash Commands System**: Introduced native, executable slash commands across all supported agent environments (`/mo7i`, `/setup-project-skills`, `/mo7i audit`, `/mo7i learn`, `/mo7i discover`, `/mo7i status`, `/mo7i doctor`, `/mo7i update`, `/mo7i help`).
- **Unified Command Router (`src/commands/command-router.js`)**: Central dispatcher connecting slash commands directly to underlying MO7I engines without logic duplication.
- **Platform Adapters & Discoverability**:
  - Claude Code: Native Markdown command definitions in `.claude/commands/` and `~/.claude/commands/`.
  - Cursor & Windsurf: Rule-based command triggers in `.cursor/rules/mo7i-commands.mdc`.
  - Universal Agent Skills & Shell: Command markdown files in `commands/`, `.agents/commands/`, and executable binaries in `bin/mo7i` and `bin/setup-project-skills`.
- **Command Argument Parser with Path Traversal Protection**: Tokenizes arguments, handles quotes, parses flags, and blocks directory traversal attempts.
- **Read-Only Strictness & Approval Gates**: Enforces strict read-only guarantees on inspection commands (`audit`, `status`, `doctor`, `help`, `discover`) and requires explicit approval for package updates.
- **17 New Slash Commands Acceptance Tests**: Added comprehensive test suite (`tests/commands/test_slash_commands.js` and Tests 39-55 in `tests/run_tests.sh`) bringing total acceptance test suite to 55 tests with 100% pass rate.
- **Root `package.json`**: Added project manifest exposing `mo7i` and `setup-project-skills` binary commands.

## [2.1.0] - 2026-11-15

### Added
- **MO7I Project Intelligence & Automated Skill Setup**: Autonomous engine that analyzes repository technical stacks, detects languages, frameworks, architectures, databases, test runners, and DevOps pipelines to prepare tailored skill environments.
- **Companion Skill (`mo7i-project-setup`)**: Standalone companion skill located in `skills/mo7i-project-setup/SKILL.md` with an executable Node.js engine in `scripts/setup-engine.js`.
- **Official Matt Pocock Skills Collection Integration**: Complete integration of `mattpocock/skills` (38 verified skills in project scope, with upstream exceptions such as `software-factory` transparently documented).
- **Five Operating Modes**: Added support for `initial` (complete setup), `audit` (read-only verification), `update` (sync with new dependencies), `repair` (reinstall missing/corrupted skills), and `report` (inventory reporting).
- **Project Intelligence Registry**: Standardized `.mo7i/project-profile.json`, `.mo7i/skill-registry.json`, and `.mo7i/setup-report.md` with zero secret storage and automated `.bak` backups.
- **Project Scope Isolation**: Strictly enforces project-level installations (`./.agents/skills/` without `-g`) and preserves existing user-authored skills.
- **Augmented 16-Phase Execution Lifecycle**: Integrated Project Detection, Profile Inspection, Setup Status Check, and Setup Gate into the core orchestrator lifecycle before task classification and execution.
- **20 New Production Acceptance Tests**: Automated acceptance suite verifying Next.js, Flutter, Laravel, Matt Pocock collection discovery, enumeration, project scoping, audit, update, repair, and security controls.

## [2.0.0] - 2026-11-15

### Added
- **Universal Intelligence Meta-Orchestrator**: Upgraded system from an agent utility into a full Universal Intelligence Layer that autonomously determines HOW to achieve goals specified by the user.
- **The 14-Phase Autonomous Execution Lifecycle**: Implemented structured execution pipeline: `INTAKE -> CONTEXT INSPECTION -> TASK CLASSIFICATION -> CAPABILITY GAP ANALYSIS -> SKILL DISCOVERY -> SKILL LEARNING -> COMPATIBILITY VALIDATION -> EXECUTION PLANNING -> SKILL ORCHESTRATION -> EXECUTION -> QUALITY VALIDATION -> LEARNING & KNOWLEDGE UPDATE -> SAFE CLEANUP -> FINAL REPORT`.
- **Universal Functional Domain Taxonomy**: Added support across 13 domains (Software, Mobile/Flutter, UI/UX Design, Marketing/SEO, Business Strategy, Research & Analytics, Data Processing, DevOps/Infrastructure, Technical Writing, Automation, Education, Financial Analysis, Productivity).
- **Anti-Fabrication Missing-Service Protocol**: Created `references/task-domains.md` governing detection of missing external credentials, hardware devices, or subscriptions without simulated execution.
- **Six-State Skill Knowledge Representation**: Explicitly tracks skills across `DISCOVERED`, `INSTALLED`, `UNDERSTOOD`, `RUNTIME_VERIFIED`, `SUCCESSFULLY_USED`, and `FAILED_OR_INCOMPATIBLE`.
- **Expanded 18 Production Acceptance Tests**: Automated tests covering Next.js, Flutter, UI/UX, SEO, DevOps, Research, Multi-Stage Pipelines, Fallback, Dependency Probing, Conflict Precedence, Security Audit, Error Remediation, Cross-Project Knowledge, Temporary Cleanup, Pinned Protection, Crash Recovery, Missing API Credentials, and Human Gates.

### Changed
- Standardized `SKILL.md` to present the Universal Intelligence Meta-Orchestrator within 184 lines.
- Updated `references/orchestration.md` and `references/security-policy.md` with mandatory interactive human gates for destructive operations and production releases.

## [1.1.0] - 2026-11-15

### Added
- Initial 4-phase learning loop and cross-project memory architecture.

## [1.0.0] - 2026-11-15

### Added
- Initial public release of `mo7i-universal-intelligence`.
