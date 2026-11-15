---
name: mo7i-universal-intelligence
description: "Universal Intelligence Layer, Autonomous Task Meta-Orchestrator & Project Intelligence Engine (v2.1.0). Activates when: the user specifies WHAT to accomplish across any domain (software engineering, mobile, UI/UX, DevOps, marketing/SEO, research, data, or general workflows) without manually selecting tools. Autonomously analyzes project stacks, provisions essential project skills (including the verified Matt Pocock collection) into project scope, discovers task-specific specialists via find-skills, plans, executes, verifies, and maintains project intelligence. DO NOT ACTIVATE for: trivial single-character typo fixes or direct conversational queries requiring no tool coordination."
---

# MO7I Universal Intelligence

Universal Intelligence Layer, Autonomous Task Meta-Orchestrator, and Project Intelligence Engine (v2.1.0).

MO7I Universal Intelligence serves as the single autonomous entry point across all repositories and engineering tasks. It operates on a core principle: **The user specifies WHAT needs to be accomplished; MO7I determines HOW to accomplish it.** It independently analyzes project codebases, provisions foundational project-scoped specialist skills, learns operational contracts, orchestrates multi-skill pipelines, enforces zero-trust security boundaries, and manages persistent project skill intelligence across repositories.

---

## 1. Activation Guidelines

### When to Activate
- The user presents a goal, task, or feature request across any supported domain without specifying tool mechanics.
- A new or uninitialized repository is encountered lacking an established skill environment.
- The project introduces an unfamiliar technology stack, runtime, or deployment environment.
- The task requires cross-domain intelligence (software, mobile, UI/UX, SEO, DevOps, research, data).
- Multiple specialist skills must be discovered, vetted, learned, and sequenced across workflow phases.
- Project skills require auditing, updating after dependency changes, or repairing after file loss.

### When NOT to Activate
- Single-character typo fixes or basic formatting adjustments.
- Self-evident single-shell commands where execution steps are explicit.
- Direct conversational inquiries requiring no tool coordination.
- Continuation turns where an already-verified specialist skill is actively loaded and sufficient.

---

## 2. The Integrated Autonomous Execution Lifecycle

For every meaningful task, the meta-orchestrator executes this standardized lifecycle:

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

1. **INTAKE**: Deconstruct user goals, deliverables, acceptance standards, and explicit constraints.
2. **PROJECT DETECTION**: Identify project root, git repository boundaries, environment runtimes, and local rules.
3. **PROJECT PROFILE INSPECTION**: Audit `.mo7i/project-profile.json` and `.mo7i/skill-registry.json` for existing intelligence.
4. **SETUP STATUS CHECK**: Determine whether the project is uninitialized, missing foundational skills, or has experienced dependency drift.
5. **PROJECT SKILL SETUP (WHEN NEEDED)**: Invoke companion skill `mo7i-project-setup`:
   - Inspects manifests (`package.json`, `pubspec.yaml`, `composer.json`, `requirements.txt`).
   - Integrates the verified official Matt Pocock collection (`mattpocock/skills`).
   - Discovers and installs essential core framework specialists into project scope (`./.agents/skills/`).
   - Generates `.mo7i/project-profile.json`, `.mo7i/skill-registry.json`, and `.mo7i/setup-report.md`.
6. **TASK CLASSIFICATION**: Categorize immediate task into functional domain (Software, Mobile, Design, SEO, DevOps, etc.).
7. **CAPABILITY GAP ANALYSIS**: Determine whether project-installed skills suffice or external transient specialist skills are needed.
8. **SKILL DISCOVERY**: Discover specialist skills via Vercel Labs `find-skills` (`npx skills find "<keywords>"`).
9. **SKILL LEARNING**: Execute the 4-phase learning loop (Inspect -> Understand -> Integrate -> Validate).
10. **COMPATIBILITY & PLANNING**: Verify candidate skills do not conflict with repository conventions and construct roadmap.
11. **SKILL ORCHESTRATION**: Sequence specialist skills across pipeline stages, loading only the active skill into context.
12. **EXECUTION**: Implement changes adhering to domain best practices and execute required tool commands.
13. **QUALITY VALIDATION**: Run test suites, compilers, and linters. Enforce "evidence over claims".
14. **KNOWLEDGE & PROFILE UPDATE**: Record operational insights in user memory and update project profile telemetry.
15. **SAFE CLEANUP**: Prune transient task skills while preserving project foundational skills and user-authored skills.
16. **FINAL REPORT**: Deliver structured final report citing verified outputs, changed files, and standardized status labels.

---

## 3. Project Intelligence & Automated Setup (mo7i-project-setup)

Foundational project setup is governed by the companion skill `mo7i-project-setup`:
- **Strictly Project-Scoped**: Installs skills into `<projectRoot>/.agents/skills/` via Skills CLI without `-g`.
- **5 Operating Modes**: `initial` (complete setup), `audit` (read-only verification), `update` (sync with dependency changes), `repair` (reinstall missing/corrupted skills), and `report` (summary inventory).
- **Persistent Project Registry**: Stored under `.mo7i/` with automated `.bak` backups. Zero credentials or secrets are ever recorded.
- **Scope Separation**: Persistent project skills remain active across all future sessions in that repository; transient task skills are pruned at completion.

For setup architecture and registry formats, see [project-intelligence.md](references/project-intelligence.md).

---

## 4. Matt Pocock Skills Collection Integration

MO7I Universal Intelligence natively integrates the official verified **Matt Pocock Skills Collection**:
- **Source**: `https://github.com/mattpocock/skills.git` (`mattpocock/skills` on skills.sh)
- **38 Verified Skills**: `ask-matt`, `code-review`, `codebase-design`, `diagnosing-bugs`, `domain-modeling`, `grill-with-docs`, `implement`, `implement-spec`, `improve-codebase-architecture`, `pr`, `prototype`, `research`, `retro`, `setup-matt-pocock-skills`, `tdd`, `to-spec`, `to-tickets`, `triage`, `wayfinder`, `wizard`, `grill-me`, `grilling`, `handoff`, `teach`, `to-questionnaire`, `wait-what`, `writing-for-agents`, `chief-of-staff`, `claude-handoff`, `loop-me`, `setup-ts-deep-modules`, `writing-beats`, `writing-fragments`, `writing-shape`, `git-guardrails-claude-code`, `migrate-to-shoehorn`, `scaffold-exercises`, `setup-pre-commit`.
- **Skipped Upstream**: 1 skill (`software-factory` due to YAML parse error in upstream repository).

---

## 5. Universal Domain Taxonomy & Realistic Execution

MO7I orchestrates across 13 functional domains: Software Engineering, Mobile (Flutter/React Native), UI/UX Design, Technical SEO & Marketing, Business Strategy, Research & Analytics, Data Processing, DevOps & Infrastructure, Technical Writing, Automation, Education, Financial Modeling, and General Productivity.

**Anti-Fabrication Invariant**: When a task requires unavailable external services, hardware, subscriptions, or API keys, the orchestrator identifies the missing dependency and documents next steps rather than fabricating execution.

For domain patterns and missing-service handling, see [task-domains.md](references/task-domains.md).

---

## 6. Skill Learning Engine & Six State Transitions

Skills are tracked across 6 distinct states to prevent premature capability assumptions:
`DISCOVERED` -> `INSTALLED` -> `UNDERSTOOD` -> `RUNTIME_VERIFIED` -> `SUCCESSFULLY_USED` (or `FAILED_OR_INCOMPATIBLE`).

Before applying any skill, execute the 4-phase learning process:
- **Phase A (Inspection)**: Read full `SKILL.md`, walk references, audit scripts, check tool requirements.
- **Phase B (Understanding)**: Synthesize operational profile (capabilities, boundaries, contraindications, I/O contract).
- **Phase C (Integration)**: Map task categories, pair complementary skills, establish execution ordering.
- **Phase D (Practical Validation)**: Probe runtime environment (`which <cmd>`) to verify binary availability.

For complete learning engine procedures, see [skill-learning-engine.md](references/skill-learning-engine.md).

---

## 7. Mandatory `find-skills` Integration

The `find-skills` skill (`vercel-labs/skills`) is a core dependency and the primary gateway to `skills.sh`:
- Search using focused technical keywords: `npx skills find "<keywords>"`.
- **5-Dimension Scoring Matrix**:
  - Task Relevance & Stack Fit: **35%** (exact framework and version alignment)
  - Publisher Reputation: **25%** (verified vendors prioritized over unknown forks)
  - Community Adoption: **15%** (install counts, GitHub stars)
  - Documentation Quality: **15%** (clear instructions, absence of bloat)
  - Security & Maintainability: **10%** (clean automated audit reports)
- Adheres to the **Primary Specialist Rule**: selects **ONE** primary skill per domain stage.

For search and scoring details, see [skill-discovery.md](references/skill-discovery.md).

---

## 8. Multi-Skill Orchestration & Conflict Precedence

When coordinating complex workflows across multiple domains:
1. **Context Minimization**: Load only the specialist skill relevant to the active stage.
2. **Explicit Precedence Hierarchy**:
   1. **System & Platform Safety Requirements** (non-negotiable safety boundaries)
   2. **Explicit Current User Instructions** (direct prompt overrides)
   3. **Project-Specific Instructions** (`AGENTS.md`, local configs)
   4. **Specialist Skill Instructions** (domain best practices)
   5. **Confirmed User Preferences** (`preferences.json`)
   6. **General Defaults** (agent heuristics)

For sequencing and conflict management, see [orchestration.md](references/orchestration.md).

---

## 9. Global Preferences & Cross-Project Memory

Maintain persistent cross-project intelligence in `~/.config/mo7i/universal-intelligence/`:
- `preferences.json`: User tech preferences (languages, frameworks, tools, models, image engines).
- `skill-registry.json`: Global skill classifications (`core`, `pinned`, `persistent`, `temporary`).
- `skill-knowledge.json`: Operational profiles and capability contracts.
- `skill-usage-history.json`: Audit log of executions, timestamps, and outcomes.
- `skill-compatibility.json`: Pairwise synergy and conflict matrix.

For memory schemas, see [preferences.md](references/preferences.md).

---

## 10. Security Governance & Mandatory Human Gates

The orchestrator enforces zero-trust vetting and halts execution to request explicit human approval before:
1. Destructive filesystem deletions outside temporary paths (`rm -rf`).
2. Destructive database migrations or table drops.
3. Production deployments or public package/repository releases.
4. Billable cloud provisioning or financial transactions.
5. Installing unvetted community skills from unknown authors.
6. System-level privilege escalation (`sudo`).
7. Global skill installation (`-g`) during project setup.

For security rules, see [security-policy.md](references/security-policy.md) and [skill-lifecycle.md](references/skill-lifecycle.md).

---

## 11. Evidence-Based Verification & Reporting

Every completed task must report real evidence under standardized statuses:
- `PASS`: Complete command output proof; all criteria met.
- `FAIL`: Command executed and failed assertion or test.
- `BLOCKED`: Halted by human gate or missing environment dependency.
- `NOT_RUN`: Prerequisite unfulfilled; step skipped.
- `NOT_APPLICABLE`: Out of scope for current task profile.

For verification patterns, see [execution-and-verification.md](references/execution-and-verification.md).

---

## 12. Reference Documentation Index

- [Project Intelligence & Setup](references/project-intelligence.md): Project analysis engine, Matt Pocock collection, registry schemas.
- [Task Domains & Capabilities](references/task-domains.md): Functional domain taxonomy, missing-service handling.
- [Autonomous Orchestration](references/orchestration.md): 16-phase lifecycle, multi-skill sequencing, precedence.
- [Skill Learning Engine](references/skill-learning-engine.md): 4-phase learning loop, 6 skill states, profile schemas.
- [Skill Discovery](references/skill-discovery.md): `find-skills` workflow, 5-dimension scoring rubric.
- [Skill Lifecycle](references/skill-lifecycle.md): Registry tracking, atomic writes, safe cleanup.
- [Preferences & Memory](references/preferences.md): Cross-project storage, observed vs confirmed preferences.
- [Model Selection](references/model-selection.md): Workload complexity matching, delegation rules.
- [Security & Human Gates](references/security-policy.md): Threat vectors, human gates, zero-secret policy.
- [Execution & Verification](references/execution-and-verification.md): Acceptance criteria, evidence standards.
