---
name: mo7i-universal-intelligence
description: "Autonomous orchestration skill serving as a single entry point for complex engineering tasks. Activates when: a task requires cross-domain intelligence, multi-step problem solving, domain-specific specialist discovery (via find-skills), tech stack evaluation, or controlled skill lifecycle management (vet, install, execute, verify, cleanup). DO NOT ACTIVATE for: trivial one-line edits, basic shell commands, immediate questions with known direct answers, or continuations where an already-verified specialist skill is actively loaded and sufficient."
---

# MO7I Universal Intelligence

Universal orchestrator and intelligent skill coordinator for autonomous agents.

MO7I Universal Intelligence provides a structured, evidence-based orchestration pipeline that analyzes incoming tasks, initializes project context, identifies domain requirements, discovers and vets specialist skills via the open agent skills ecosystem, executes with acceptance criteria, verifies outcomes with real evidence, and safely manages temporary skill lifecycles.

It orchestrates; it never replaces specialist skills.

---

## 1. Activation Guidelines

### When to Activate
- The task requires non-trivial multi-step planning or domain expertise.
- The project introduces a new framework, language, or ecosystem.
- Existing installed skills lack specialized domain depth for the task.
- Controlled evaluation, sandboxed vetting, or temporary lifecycle cleanup is required.

### When NOT to Activate
- Single-file trivial changes or typo corrections.
- Standard shell operations with self-evident commands.
- Direct factual queries requiring no tool coordination.
- Continuation tasks where a suitable specialist skill is already verified and active.

---

## 2. Core Orchestration Lifecycle

The orchestrator operates in 12 strict, evidence-driven stages:

```
[1. Understand] ────► [2. Init Context] ────► [3. Discover] ────► [4. Evaluate]
                                                                        │
[8. Execute] ◄────── [7. Plan Criteria] ◄─── [6. Load] ◄────── [5. Install]
     │
     ▼
[9. Verify] ───────► [10. Remediate] ──────► [11. Cleanup] ────► [12. Report]
```

1. **Understand**: Parse objectives, constraints, explicit rules, and user intent.
2. **Initialize**: Check project configuration, local rules (`AGENTS.md`), and environment state.
3. **Discover**: Classify task difficulty. If non-trivial, check installed skills; if missing, invoke `find-skills`.
4. **Evaluate & Vet**: Audit candidate skills across security tiers (Trusted, Unknown, Suspicious).
5. **Install**: Install approved specialist skill with deliberate scope (`project` vs `global`).
6. **Load**: Confirm skill availability and read instructions into agent context.
7. **Plan**: Formulate execution roadmap with measurable acceptance criteria.
8. **Execute**: Implement changes adhering to domain best practices from specialist skill.
9. **Verify**: Run real tests, compiler passes, or command executions. Evidence over claims.
10. **Remediate**: If verification fails, diagnose and iterate until resolved or confirmed blocked.
11. **Cleanup**: Deregister and uninstall temporary skills installed specifically for this workflow.
12. **Report**: Summarize results, cite verified command outputs, and report status.

---

## 3. Skill Discovery & Selection Logic

### Defining Meaningful Tasks
A task is **meaningful** if it demands domain patterns (e.g., framework idioms, security patterns, compiler setups, performance tuning) that standard direct prompting cannot reliably deliver.

- **Check Local First**: Scan installed project and global skills before making network queries:
  ```bash
  npx skills list
  npx skills list -g
  ```
- **Discover via `find-skills`**: If no suitable skill exists locally:
  ```bash
  npx skills find "<task-derived keywords>"
  ```
- **Candidate Scoring**: Score candidates on:
  1. *Domain Relevance & Stack Fit* (exact match for stack version and task)
  2. *Publisher Reputation* (official organizations preferred)
  3. *Community Adoption* (install counts, stars, reviews)
  4. *Maintenance & Quality* (clear instructions, absence of bloat)
  5. *Security Risk Score* (clean automated audit reports)
- **Primary Specialist Rule**: Select **ONE** primary specialist skill per domain. Avoid installing overlapping or competing skills.

For detailed discovery procedures, refer to [skill-discovery.md](references/skill-discovery.md).

---

## 4. Security Tiers & Vetting Protocol

Never execute arbitrary or unvetted third-party code. All discovered skills must be categorized prior to installation:

| Trust Tier | Source Definition | Installation Action |
| :--- | :--- | :--- |
| **Trusted** | Official, verified publishers (e.g., `vercel-labs`, `anthropics`, `microsoft`) | Read `SKILL.md`, verify permissions, install directly. |
| **Unknown** | Community or third-party repositories | Read `SKILL.md` + all bundled scripts. Present audit findings to user and request approval before installing. |
| **Suspicious** | Any skill with credential access, obfuscation, unauthorized network calls, or destructive commands | **REJECT immediately.** Do not install. Inform user. |

For full security evaluation checklists, refer to [security-policy.md](references/security-policy.md).

---

## 5. Registry & Lifecycle Management

Track orchestrator-managed skills in the persistent registry:
`~/.config/mo7i/universal-intelligence/skill-registry.json`

### Skill Classifications
- `core`: Built-in or critical orchestrator skills (never automatically removed).
- `pinned`: User-designated permanent skills (never automatically removed).
- `persistent`: Installed for ongoing multi-session project use.
- `temporary`: Installed for a specific workflow (eligible for automated cleanup).

### Safe Cleanup Procedure
At workflow conclusion:
1. Identify skills installed by orchestrator marked `temporary`.
2. Confirm the skill is not required by other active projects.
3. Remove cleanly via Skills CLI:
   ```bash
   npx skills remove <name> [-g] -y
   ```
4. Verify removal from filesystem and update registry.
5. If uncertain about dependencies, mark as `cleanup candidate` and retain.

For lifecycle transitions and schema details, refer to [skill-lifecycle.md](references/skill-lifecycle.md).

---

## 6. Preference Resolution Hierarchy

When executing decisions, preferences resolve strictly in this descending priority:

1. **Current Prompt Instruction**: Direct user instructions for the immediate task.
2. **Confirmed Long-Term Preferences**: Stored in `~/.config/mo7i/preferences.json` (explicitly confirmed by user).
3. **Project Instructions**: Local `AGENTS.md`, `CLAUDE.md`, or repository conventions.
4. **Past Successful Workflows**: Verified historical patterns from registry/logs.
5. **System Defaults**: Orchestrator default configurations and general agent capabilities.

*Note: Never assume a preferred tool or model is installed or available. Probe the environment first; if missing, explain and select the nearest verified alternative.*

For preferences schema and management, refer to [preferences.md](references/preferences.md).

---

## 7. Execution, Verification & Reporting

- **Measurable Acceptance Criteria**: Every execution plan must define testable criteria before running edits.
- **Evidence Over Claims**: Mark tasks completed ONLY when verified by command exit codes, test suite passes, or concrete file diffs.
- **Reporting Status Labels**:
  - `VERIFIED`: Complete evidence gathered; all criteria passed.
  - `IMPLEMENTED`: Changes made, partial test evidence available.
  - `PARTIALLY VERIFIED`: Some tests passed, others blocked or pending external services.
  - `BLOCKED`: Precondition or human gate halted progress (error quoted, remaining steps documented).
  - `NOT IMPLEMENTED`: Out of scope or rejected due to safety/security.

For verification patterns and error loops, refer to [execution-and-verification.md](references/execution-and-verification.md).

---

## 8. Reference Documentation Index

Consult these deep references on demand during orchestration:

- [Orchestration Architecture](references/orchestration.md): Pipeline mechanics, state transitions, context boundaries.
- [Skill Discovery](references/skill-discovery.md): Query generation, scoring matrices, fallback logic.
- [Skill Lifecycle](references/skill-lifecycle.md): Registry management, atomic operations, safe cleanup.
- [Preferences Model](references/preferences.md): Multi-tier configuration, private storage, tool probing.
- [Model Selection](references/model-selection.md): Capability matching, context budgets, delegation rules.
- [Execution & Verification](references/execution-and-verification.md): Acceptance testing, diagnosis, evidence capture.
- [Security Policy](references/security-policy.md): Threat vectors, auditing scripts, gatekeeping rules.
