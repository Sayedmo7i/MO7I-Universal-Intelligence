# MO7I Universal Intelligence

> **Universal Intelligence Layer, Autonomous Task Meta-Orchestrator & Project Intelligence Engine (v2.1.0)**  
> *The user specifies WHAT needs to be accomplished. MO7I determines HOW to accomplish it.*

MO7I Universal Intelligence is an autonomous intelligence layer, task meta-orchestrator, and project intelligence engine built on the open [Agent Skills](https://skills.sh) standard. It operates as the single autonomous entry point across all engineering repositories and domains.

Rather than expecting users to manually configure tools, MO7I automatically inspects new projects, detects their frameworks and architectures, provisions project-scoped specialist skills (including the verified official Matt Pocock skills collection), learns operational contracts, coordinates multi-skill pipelines, enforces zero-trust safety boundaries, verifies outcomes with real execution evidence, and preserves persistent intelligence across project lifecycles.

---

## What's New in v2.1.0: Project Intelligence & Automated Skill Setup

Version 2.1.0 introduces **MO7I Project Intelligence** and the companion skill **`mo7i-project-setup`**:

1. **Automated Technical Stack Analysis**: Analyzes manifests (`package.json`, `pubspec.yaml`, `composer.json`, `requirements.txt`), lockfiles, config files, source structures, testing setups, and CI/CD pipelines to build an objective project profile.
2. **Matt Pocock Skills Collection Integration**: Integrates the complete official collection from `mattpocock/skills` (38 verified skills ready in project scope, with upstream exceptions transparently reported).
3. **Strict Project-Scope Isolation**: All foundational skills install into `<projectRoot>/.agents/skills/` without global (`-g`) pollution. Existing user-authored skills are strictly preserved.
4. **Persistent Project Intelligence Registry**: Maintains `.mo7i/project-profile.json`, `.mo7i/skill-registry.json`, and `.mo7i/setup-report.md` with zero credential storage and automated `.bak` backups.
5. **Five Operational Modes**:
   - `initial`: Complete technical stack analysis and project skill provisioning.
   - `audit`: Read-only inspection of installed skills vs project requirements.
   - `update`: Safe detection and installation of newly required skills when dependencies change.
   - `repair`: Reinstallation of missing or corrupted skills from lockfiles.
   - `report`: Executive markdown report of project capabilities.

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

1. **INTAKE**: Deconstruct user goals, deliverables, acceptance criteria, and hard constraints.
2. **PROJECT DETECTION**: Identify project root, git repository boundaries, environment runtimes, and local rules.
3. **PROJECT PROFILE INSPECTION**: Audit `.mo7i/project-profile.json` and `.mo7i/skill-registry.json` for existing intelligence.
4. **SETUP STATUS CHECK**: Determine whether the project is uninitialized, missing foundational skills, or has experienced dependency drift.
5. **PROJECT SKILL SETUP (WHEN NEEDED)**: Invoke companion skill `mo7i-project-setup` to analyze the codebase and provision project-scoped skills.
6. **TASK CLASSIFICATION**: Categorize immediate task into one of 13 functional domains and assess complexity tier.
7. **CAPABILITY GAP ANALYSIS**: Determine whether project-installed skills suffice or if a task-level transient skill is needed.
8. **SKILL DISCOVERY**: Discover specialist skills via Vercel Labs `find-skills` (`npx skills find "<keywords>"`).
9. **SKILL LEARNING**: Execute the 4-phase learning loop (Inspect -> Understand -> Integrate -> Validate).
10. **COMPATIBILITY & PLANNING**: Verify candidate skills do not conflict with repository conventions and construct roadmap.
11. **SKILL ORCHESTRATION**: Sequence specialist skills across pipeline stages, minimizing context by loading only the skill needed for the active phase.
12. **EXECUTION**: Apply domain best practices and execute implementation commands with real tools.
13. **QUALITY VALIDATION**: Run test suites, compilers, static analyzers, and linters. Enforce "evidence over claims".
14. **KNOWLEDGE & PROFILE UPDATE**: Record operational insights in user memory and update project profile telemetry.
15. **SAFE CLEANUP**: Prune transient task skills while strictly preserving project foundational skills and user-authored skills.
16. **FINAL REPORT**: Deliver structured final report citing verified outputs, changed files, and standardized status labels.

---

## Universal Task Domain Taxonomy

MO7I orchestrates across 13 distinct functional domains:

| Domain | Scope & Workload |
| :--- | :--- |
| **Software Engineering** | Full-stack web architectures, distributed systems, REST/GraphQL APIs, compiler transforms. |
| **Mobile Development** | Flutter, React Native, Swift, Kotlin, responsive multi-device widget layouts. |
| **UI/UX & Visual Design** | Design tokens, WCAG AAA accessibility, typography, responsive design systems. |
| **Marketing, SEO & Growth** | Technical SEO, OpenGraph metadata, JSON-LD Schema.org structured data, XML sitemaps. |
| **Business Strategy** | Process mapping, product requirement documents, workflow optimization. |
| **Research & Analysis** | Literature synthesis, quantitative benchmark extraction, comparative trade-offs. |
| **Data Processing** | ETL pipelines, SQL queries, analytical data transforms. |
| **DevOps & Infrastructure** | Container security, non-root Dockerfiles, multi-stage builds, CI/CD pipelines. |
| **Technical Writing** | Architecture decision records (ADRs), API documentation, release notes. |
| **Automation & Tooling** | Custom CLI utilities, webhooks, cron-based maintenance jobs. |
| **Education & Learning** | Step-by-step technical explainers, interactive exercise scaffolding. |
| **Financial Modeling** | Unit economics, valuation formulas, quantitative metric verification. |
| **General Productivity** | Multi-step task tracking, project planning, backlog refinement. |

*Anti-Fabrication Guard*: If a task requires an unavailable tool, hardware device, paid subscription, or private API key (e.g., Stripe, AWS), the orchestrator identifies the missing dependency and documents clear next steps rather than fabricating execution.

---

## Project-Level vs. Global Skills Architecture

| Dimension | Project-Level Skills | Global Skills | Task-Level Discovered Skills |
| :--- | :--- | :--- | :--- |
| **Location** | `<projectRoot>/.agents/skills/` | `~/.agents/skills/` | Memory / Temporary Path |
| **Scope** | Repository-bound | Universal cross-project | Ephemeral for single turn |
| **Lockfile** | `<projectRoot>/skills-lock.json` | Global agent config | Pruned during cleanup |
| **Registry** | `.mo7i/skill-registry.json` | `~/.config/mo7i/` | Transient runtime state |
| **Global Flag** | **Prohibited** (no `-g`) | Required (`-g`) | Not applicable |

---

## Matt Pocock Skills Collection Roster

MO7I includes native support for the 38 verified skills in `mattpocock/skills`:

- **Development & Architecture**: `ask-matt`, `codebase-design`, `domain-modeling`, `grill-with-docs`, `implement`, `implement-spec`, `improve-codebase-architecture`, `pr`, `prototype`, `research`, `retro`, `setup-matt-pocock-skills`, `to-spec`, `to-tickets`, `triage`, `wayfinder`, `wizard`, `grill-me`, `grilling`, `handoff`, `teach`, `to-questionnaire`, `wait-what`, `writing-for-agents`, `chief-of-staff`, `claude-handoff`, `loop-me`, `writing-beats`, `writing-fragments`, `writing-shape`.
- **Quality Assurance & Safety**: `code-review`, `diagnosing-bugs`, `tdd`, `git-guardrails-claude-code`, `setup-pre-commit`.
- **Project-Specific Specialists**: `setup-ts-deep-modules`, `migrate-to-shoehorn`, `scaffold-exercises`.

*Note on Upstream Exceptions: `software-factory` from `skills/in-progress/` is transparently skipped during discovery due to an upstream YAML parse error.*

---

## CLI & Companion Skill Usage

You can invoke the companion skill `mo7i-project-setup` directly:

```bash
# Perform initial complete setup on a repository
node skills/mo7i-project-setup/scripts/setup-engine.js initial /path/to/project

# Dry-run analysis without making disk changes
node skills/mo7i-project-setup/scripts/setup-engine.js initial /path/to/project --dry-run

# Audit installed skills against project dependencies
node skills/mo7i-project-setup/scripts/setup-engine.js audit /path/to/project

# Update project skills after adding new frameworks
node skills/mo7i-project-setup/scripts/setup-engine.js update /path/to/project

# Repair corrupted or missing skills from lockfiles
node skills/mo7i-project-setup/scripts/setup-engine.js repair /path/to/project

# Generate and display the project intelligence report
node skills/mo7i-project-setup/scripts/setup-engine.js report /path/to/project
```

---

## Installation

Install using the Skills CLI (`npx skills`):

### Global Scope (Universal Meta-Orchestrator)
```bash
npx skills add Sayedmo7i/MO7I-Universal-Intelligence --skill mo7i-universal-intelligence -g -y
```

### Project Scope (Companion Skill & Project Setup)
```bash
npx skills add Sayedmo7i/MO7I-Universal-Intelligence --skill mo7i-project-setup -y
```

---

## Verification & Standard Statuses

Every task reports verifiable command evidence under standardized statuses:
- **`PASS`**: Complete execution evidence; all criteria met.
- **`FAIL`**: Execution failed assertions or returned non-zero exit codes.
- **`BLOCKED`**: Progress halted by human gate or missing environment prerequisite.
- **`NOT_RUN`**: Step skipped due to failed prerequisite.
- **`NOT_APPLICABLE`**: Step bypassed due to task complexity profile.

---

## Reference Documentation Index

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
