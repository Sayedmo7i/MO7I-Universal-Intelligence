# Orchestration Architecture

This document describes the orchestration architecture and end-to-end execution lifecycle of MO7I Universal Intelligence.

---

## 1. Architectural Philosophy

MO7I Universal Intelligence operates as a meta-orchestrator. It does not replace specialist skills or hardcode implementation domain rules. Instead, it creates an intelligent, evidence-governed coordination layer that:
1. Deconstructs complex user requests into discrete technical requirements.
2. Discovers and installs specialized domain intelligence dynamically.
3. Guides execution through testable acceptance criteria.
4. Manages the lifecycle and hygiene of temporary agent skills.

```
                    ┌─────────────────────────┐
                    │      User Request       │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │ 1. Understand Intent &  │
                    │    Project Context      │
                    └────────────┬────────────┘
                                 │
                 ┌───────────────┴───────────────┐
                 ▼                               ▼
       [Trivial / Immediate]           [Meaningful / Complex]
                 │                               │
                 ▼                               ▼
       [Direct Execution]              [2. Check Local Skills]
                                                 │
                                 ┌───────────────┴───────────────┐
                                 ▼                               ▼
                           [Skill Found]                  [Skill Missing]
                                 │                               │
                                 │                               ▼
                                 │                    [3. Discover via find-skills]
                                 │                               │
                                 │                               ▼
                                 │                    [4. Vetting & Trust Tiers]
                                 │                               │
                                 │                               ▼
                                 │                    [5. Scope-Deliberate Install]
                                 │                               │
                                 └───────────────┬───────────────┘
                                                 │
                                                 ▼
                                     ┌─────────────────────────┐
                                     │ 6. Plan Acceptance      │
                                     │    Criteria             │
                                     └───────────┬─────────────┘
                                                 │
                                                 ▼
                                     ┌─────────────────────────┐
                                     │ 7. Execute with Domain  │
                                     │    Specialist Context   │
                                     └───────────┬─────────────┘
                                                 │
                                                 ▼
                                     ┌─────────────────────────┐
                                     │ 8. Evidence Verification│
                                     │    & Test Execution     │
                                     └───────────┬─────────────┘
                                                 │
                                                 ▼
                                     ┌─────────────────────────┐
                                     │ 9. Lifecycle Cleanup &  │
                                     │    Reporting            │
                                     └─────────────────────────┘
```

---

## 2. End-to-End Execution Stages

### Stage 1: Understand
- Parse user constraints, deliverables, project boundaries, and acceptance conditions.
- Identify the core domain (e.g., Cloudflare Workers, Next.js App Router, PixiJS, Postgres).
- Ensure no hidden assumptions are made: ask clarifying questions only if a critical requirement is ambiguous.

### Stage 2: Initialize
- Read local instructions: `AGENTS.md`, `CLAUDE.md`, or repository conventions.
- Detect active package managers (`pnpm`, `npm`, `yarn`, `bun`, `cargo`, `pip`).
- Record the working directory, git state, and environment constraints.

### Stage 3: Discover Specialist
- Evaluate whether the task qualifies as "meaningful" (requiring domain knowledge).
- Probe installed skills (`npx skills list`, `npx skills list -g`).
- If an existing skill satisfies the domain, reuse it immediately.
- If missing, initiate discovery using `npx skills find "<keywords>"`.

### Stage 4: Evaluate & Score
- Compare candidate skills against the candidate scoring rubric:
  - Domain specificity and relevance.
  - Source reputation (official vendor vs unverified author).
  - Adoption metrics (install counts, GitHub stars).
  - Documentation clarity and maintenance status.
  - Security audit summary from registry.
- Select the single best specialist skill.

### Stage 5: Vet & Install
- Classify against trust tiers:
  - *Trusted*: Proceed to read `SKILL.md` and install.
  - *Unknown*: Read `SKILL.md` + scripts, audit code, report findings, and ask user approval before installation.
  - *Suspicious*: Reject immediately.
- Install with deliberate scope (`-g` for general user workflows; project-local for repository-bound workflows).

### Stage 6: Load Context
- Verify skill files exist on disk.
- Read instructions into the active agent context.
- Confirm agent recognition of the specialist skill.

### Stage 7: Plan Acceptance Criteria
- Create a step-by-step roadmap before making code edits.
- Define measurable pass/fail criteria (e.g., specific test outputs, compiler exit codes, file assertions).

### Stage 8: Execute
- Implement code and configuration changes according to domain instructions provided by the specialist skill.
- Maintain minimal necessary footprint; do not modify unrelated code.

### Stage 9: Verify
- Run actual test suites, linters, and compilers.
- Inspect exit codes and concrete outputs.
- Never assert success without command proof.

### Stage 10: Remediate
- If tests fail, run targeted diagnosis.
- Apply targeted fixes and re-verify until resolved or identified as an environment blocker.

### Stage 11: Cleanup
- Identify temporary skills installed exclusively for the completed workflow.
- Execute clean removal via `npx skills remove <name>`.
- Update the registry and verify filesystem state.

### Stage 12: Report
- Output a structured final summary.
- List verified evidence, files created or modified, and outstanding items.
- Assign a clear status label (`VERIFIED`, `IMPLEMENTED`, `PARTIALLY VERIFIED`, `BLOCKED`, `NOT IMPLEMENTED`).

---

## 3. Project Context Isolation

The orchestrator enforces strict boundaries between different projects:
- **Project Isolation**: Project-level skills are installed in project directories and never leak into global agent configurations.
- **Preference Separation**: Project-specific preferences in `AGENTS.md` override global defaults without modifying user-level global configuration.
- **Temporary State Encapsulation**: Scratch files and temporary test scripts remain confined to dedicated temporary directories and are removed during cleanup.
