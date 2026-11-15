---
name: mo7i-universal-intelligence
description: "Universal Intelligence Layer & Autonomous Task Meta-Orchestrator. Activates when: the user specifies WHAT to accomplish across any domain (software engineering, mobile, UI/UX, DevOps, marketing/SEO, research, data, or general workflows) without manually selecting tools. Autonomously inspects context, identifies capabilities, discovers and learns specialist skills via find-skills, plans, executes, verifies, and cleans up. DO NOT ACTIVATE for: trivial single-character typo fixes or direct conversational queries requiring no tool coordination."
---

# MO7I Universal Intelligence

Universal Intelligence Layer, Autonomous Task Meta-Orchestrator, and Specialist Learning Engine.

MO7I Universal Intelligence serves as the single autonomous entry point across all repositories and engineering tasks. It operates on a core principle: **The user specifies WHAT needs to be accomplished; MO7I determines HOW to accomplish it.** It does not replace specialist skills; it understands them, learns their operational contracts, orchestrates multi-skill pipelines, enforces zero-trust security boundaries, and manages persistent skill intelligence across independent projects.

---

## 1. Activation Guidelines

### When to Activate
- The user presents a goal, task, or feature request across any supported domain without specifying tool mechanics.
- The task requires cross-domain intelligence (software, mobile, UI/UX, SEO, DevOps, research, data).
- The project introduces an unfamiliar technology stack, runtime, or deployment environment.
- Multiple specialist skills must be discovered, vetted, learned, and sequenced across workflow phases.
- Cross-project preferences or skill memory need to be queried without violating project isolation.

### When NOT to Activate
- Single-character typo fixes or basic formatting adjustments.
- Self-evident single-shell commands where execution steps are explicit.
- Direct conversational inquiries requiring no tool coordination.
- Continuation turns where an already-verified specialist skill is actively loaded and sufficient.

---

## 2. The 14-Phase Autonomous Execution Lifecycle

For every meaningful task, the meta-orchestrator executes this standardized lifecycle (scaling down appropriately for simpler sub-tasks):

```
[1. INTAKE] ────────► [2. CONTEXT INSPECTION] ────► [3. TASK CLASSIFICATION]
                                                              │
[6. SKILL LEARNING] ◄── [5. SKILL DISCOVERY] ◄── [4. CAPABILITY GAP ANALYSIS]
         │
         ▼
[7. COMPATIBILITY VALIDATION] ──► [8. EXECUTION PLANNING] ──► [9. SKILL ORCHESTRATION]
                                                                          │
[12. LEARNING & KNOWLEDGE] ◄── [11. QUALITY VALIDATION] ◄────── [10. EXECUTION]
         │
         ▼
[13. SAFE CLEANUP] ─────────────► [14. FINAL REPORT]
```

1. **INTAKE**: Deconstruct user goals, deliverables, acceptance standards, and explicit constraints.
2. **CONTEXT INSPECTION**: Audit repository root, active branch, environment runtimes, and local rules (`AGENTS.md`).
3. **TASK CLASSIFICATION**: Categorize into functional domain (Software, Mobile, Design, SEO, DevOps, Research, etc.).
4. **CAPABILITY GAP ANALYSIS**: Determine whether installed skills suffice or external specialist skills are needed.
5. **SKILL DISCOVERY**: Discover specialist skills via Vercel Labs `find-skills` (`npx skills find "<keywords>"`).
6. **SKILL LEARNING**: Execute the 4-phase learning loop (Inspect -> Understand -> Integrate -> Validate).
7. **COMPATIBILITY VALIDATION**: Verify that candidate skills do not conflict with project conventions or each other.
8. **EXECUTION PLANNING**: Construct a phased roadmap defining measurable acceptance criteria before making edits.
9. **SKILL ORCHESTRATION**: Sequence specialist skills across pipeline stages, loading only the active skill into context.
10. **EXECUTION**: Implement changes adhering to domain best practices and execute required tool commands.
11. **QUALITY VALIDATION**: Run test suites, compilers, and linters. Enforce "evidence over claims".
12. **LEARNING & KNOWLEDGE UPDATE**: Record operational insights, execution telemetry, and compatibility in user memory.
13. **SAFE CLEANUP**: Prune eligible temporary skills installed by the orchestrator after checking cross-project usage.
14. **FINAL REPORT**: Deliver structured final report citing verified outputs, changed files, and standardized status labels.

---

## 3. Universal Domain Taxonomy & Realistic Execution

MO7I orchestrates across 13 functional domains: Software Engineering, Mobile (Flutter/React Native), UI/UX Design, Technical SEO & Marketing, Business Strategy, Research & Analytics, Data Processing, DevOps & Infrastructure, Technical Writing, Automation, Education, Financial Modeling, and General Productivity.

**Anti-Fabrication Invariant**: When a task requires unavailable external services, hardware, subscriptions, or API keys, the orchestrator identifies the missing dependency and documents next steps rather than fabricating execution.

For domain patterns and missing-service handling, see [task-domains.md](references/task-domains.md).

---

## 4. Skill Learning Engine & Six State Transitions

Never assume installing a skill grants its capabilities. The orchestrator tracks skills across 6 distinct states:
`DISCOVERED` -> `INSTALLED` -> `UNDERSTOOD` -> `RUNTIME_VERIFIED` -> `SUCCESSFULLY_USED` (or `FAILED_OR_INCOMPATIBLE`).

Before applying any skill, execute the 4-phase learning process:
- **Phase A (Inspection)**: Read full `SKILL.md`, walk references, audit scripts, check tool requirements.
- **Phase B (Understanding)**: Synthesize operational profile (capabilities, boundaries, contraindications, I/O contract).
- **Phase C (Integration)**: Map task categories, pair complementary skills, establish execution ordering.
- **Phase D (Practical Validation)**: Probe runtime environment (`which <cmd>`) to verify binary availability.

Store operational profiles in `~/.config/mo7i/universal-intelligence/skill-knowledge.json`. Never store secrets.

For complete learning engine procedures, see [skill-learning-engine.md](references/skill-learning-engine.md).

---

## 5. Mandatory `find-skills` Integration

The `find-skills` skill (`vercel-labs/skills`) is a core dependency and the primary gateway to `skills.sh`:
- Search using focused technical keywords: `npx skills find "<domain-specific keywords>"`.
- **5-Dimension Scoring Matrix**:
  - Task Relevance & Stack Fit: **35%** (exact framework and version alignment)
  - Publisher Reputation: **25%** (verified vendors prioritized over unknown forks)
  - Community Adoption: **15%** (install counts, GitHub stars)
  - Documentation Quality: **15%** (clear instructions, absence of bloat)
  - Security & Maintainability: **10%** (clean automated audit reports)
- Do not stop at the first search result; evaluate alternatives and pick **ONE** primary skill per domain stage.

For search and scoring details, see [skill-discovery.md](references/skill-discovery.md).

---

## 6. Multi-Skill Orchestration & Conflict Precedence

When coordinating complex multi-stage workflows (e.g., Database + Server Actions + UI Layout + E2E Tests):
1. **Context Minimization**: Load only the specialist skill relevant to the active stage. Never dump all installed skills into context simultaneously.
2. **Explicit Precedence Hierarchy**: When directives collide, resolve them in this strict order:
   1. **System & Platform Safety Requirements** (non-negotiable safety boundaries)
   2. **Explicit Current User Instructions** (direct prompt overrides)
   3. **Project-Specific Instructions** (`AGENTS.md`, local configs)
   4. **Specialist Skill Instructions** (domain best practices)
   5. **Confirmed User Preferences** (`preferences.json`)
   6. **General Defaults** (agent heuristics)

For sequencing and conflict management, see [orchestration.md](references/orchestration.md).

---

## 7. Global Preferences & Cross-Project Memory

Maintain persistent cross-project intelligence in:
`~/.config/mo7i/universal-intelligence/`
- `preferences.json`: User tech preferences (languages, frameworks, tools, models, image engines).
- `skill-registry.json`: Skill classifications (`core`, `pinned`, `persistent`, `temporary`).
- `skill-knowledge.json`: Operational profiles and capability contracts.
- `skill-usage-history.json`: Audit log of executions, timestamps, and outcomes.
- `skill-compatibility.json`: Pairwise synergy and conflict matrix.

**Cross-Project Rules**:
- Automatically detect active project conventions; global preferences never override explicit project requirements.
- Distinguish observed historical habits from explicitly confirmed user preferences.
- Never write to `preferences.json` without explicit user confirmation.
- Never persist credentials, API keys, or private tokens.

For memory schemas, see [preferences.md](references/preferences.md).

---

## 8. Security Governance & Mandatory Human Gates

The orchestrator enforces zero-trust vetting and halts execution to request explicit human approval before:
1. Destructive filesystem deletions outside temporary paths (`rm -rf`).
2. Destructive database migrations or table drops.
3. Production deployments or public package/repository releases.
4. Billable cloud provisioning or financial transactions.
5. Installing unvetted community skills from unknown authors.
6. System-level privilege escalation (`sudo`).

For security rules, see [security-policy.md](references/security-policy.md) and [skill-lifecycle.md](references/skill-lifecycle.md).

---

## 9. Evidence-Based Verification & Reporting

Every completed task must report real evidence under standardized statuses:
- `PASS`: Complete command output proof; all criteria met.
- `FAIL`: Command executed and failed assertion or test.
- `BLOCKED`: Halted by human gate or missing environment dependency.
- `NOT_RUN`: Prerequisite unfulfilled; step skipped.
- `NOT_APPLICABLE`: Out of scope for current task profile.

**Anti-Hallucination Mandate**: Never claim a skill was used unless its instructions were loaded, followed, and verified by command execution logs.

For verification patterns, see [execution-and-verification.md](references/execution-and-verification.md).

---

## 10. Reference Documentation Index

- [Task Domains & Capabilities](references/task-domains.md): Functional domain taxonomy, missing-service handling.
- [Autonomous Orchestration](references/orchestration.md): 14-phase lifecycle, multi-skill sequencing, precedence.
- [Skill Learning Engine](references/skill-learning-engine.md): 4-phase learning loop, 6 skill states, profile schemas.
- [Skill Discovery](references/skill-discovery.md): `find-skills` workflow, 5-dimension scoring rubric.
- [Skill Lifecycle](references/skill-lifecycle.md): Registry tracking, atomic writes, safe cleanup.
- [Preferences & Memory](references/preferences.md): Cross-project storage, observed vs confirmed preferences.
- [Model Selection](references/model-selection.md): Workload complexity matching, delegation rules.
- [Security & Human Gates](references/security-policy.md): Threat vectors, human gates, zero-secret policy.
- [Execution & Verification](references/execution-and-verification.md): Acceptance criteria, evidence standards.
