# Autonomous Orchestration Lifecycle & Execution Protocol

This document specifies the 14-phase execution lifecycle, multi-skill coordination protocols, and cross-domain task orchestration implemented by MO7I Universal Intelligence.

---

## 1. Core Operating Philosophy

> **The user specifies WHAT needs to be accomplished. MO7I determines HOW to accomplish it.**

MO7I Universal Intelligence acts as a meta-orchestrator. It translates high-level user intentions into structured, evidence-based execution phases, dynamically finding and applying specialist domain intelligence without requiring the user to select or operate individual skills.

---

## 2. The 14-Phase Autonomous Lifecycle

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

### Detailed Phase Breakdown

1. **INTAKE**: Receive user prompt, extract explicit objectives, deliverables, and hard constraints.
2. **CONTEXT INSPECTION**: Inspect current repository, working directory, git state, and project rules (`AGENTS.md`, `CLAUDE.md`, configs).
3. **TASK CLASSIFICATION**: Classify task into one of the 13 functional domains (Software, Mobile, Design, SEO, DevOps, Research, etc.) and assess complexity tier.
4. **CAPABILITY GAP ANALYSIS**: Determine whether the active environment and installed skills provide required domain capabilities or if specialist skills are needed.
5. **SKILL DISCOVERY**: If specialist intelligence is missing, invoke Vercel Labs `find-skills` (`npx skills find "<keywords>"`). Evaluate candidate pools across the 5-point scoring matrix.
6. **SKILL LEARNING**: Execute the 4-phase learning loop (Inspect -> Understand -> Integrate -> Validate) before using any selected skill.
7. **COMPATIBILITY VALIDATION**: Verify that selected skills do not conflict with repository conventions or each other.
8. **EXECUTION PLANNING**: Construct a phased roadmap defining measurable acceptance criteria and required tool invocations prior to making code modifications.
9. **SKILL ORCHESTRATION**: Sequence specialist skills across pipeline stages, minimizing context by loading only the skill needed for the active phase.
10. **EXECUTION**: Apply domain best practices and execute implementation commands with real tools.
11. **QUALITY VALIDATION**: Run test suites, compilers, static analyzers, and linters. Enforce "evidence over claims".
12. **LEARNING & KNOWLEDGE UPDATE**: Record operational findings, execution telemetry, and compatibility notes in user memory.
13. **SAFE CLEANUP**: Uninstall temporary skills installed by the orchestrator for this specific task after verifying no other projects depend on them.
14. **FINAL REPORT**: Deliver structured final report citing verified outputs, changed files, and standardized status labels (`PASS`, `FAIL`, `BLOCKED`).

---

## 3. Conflict Resolution & Precedence Hierarchy

When directives between user prompts, repository rules, and specialist skills conflict, the orchestrator enforces an explicit 6-level descending precedence hierarchy:

```
┌────────────────────────────────────────────────────────────────────────┐
│ 1. System & Platform Safety Requirements (HIGHEST AUTHORITY)           │
│    Sandbox boundaries, secret protection, destructive action blocks.   │
├────────────────────────────────────────────────────────────────────────┤
│ 2. Explicit Current User Instructions                                  │
│    Direct prompt overrides for the immediate turn.                     │
├────────────────────────────────────────────────────────────────────────┤
│ 3. Project-Specific Instructions                                       │
│    Repository conventions (AGENTS.md, CLAUDE.md, linters, configs).    │
├────────────────────────────────────────────────────────────────────────┤
│ 4. Specialist Skill Instructions                                       │
│    Domain-specific guidelines from the actively loaded specialist.    │
├────────────────────────────────────────────────────────────────────────┤
│ 5. Confirmed User Preferences                                          │
│    Preferences confirmed in ~/.config/mo7i/universal-intelligence/.    │
├────────────────────────────────────────────────────────────────────────┤
│ 6. General Defaults (LOWEST AUTHORITY)                                 │
│    Built-in agent heuristics and fallbacks.                            │
└────────────────────────────────────────────────────────────────────────┘
```
