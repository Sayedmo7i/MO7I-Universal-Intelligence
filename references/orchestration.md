# Orchestration Architecture & Multi-Skill Coordination

This document specifies the orchestration architecture, the 16-stage execution lifecycle, and the multi-skill coordination protocols enforced by MO7I Universal Intelligence.

---

## 1. Architectural Philosophy

MO7I Universal Intelligence operates as the universal single entry point for autonomous engineering tasks across all repositories. It is designed around three fundamental principles:
1. **Dynamic Specialization**: Rather than bundling thousands of static rules, it dynamically identifies, vets, learns, and applies specialist skills from the open ecosystem.
2. **Context Minimization**: It never dumps multiple skills into agent context simultaneously. It breaks multi-domain tasks into stages and loads only the specialist skill relevant to the currently executing phase.
3. **Rigorous Evidence**: Claims of completion, capability usage, or verification are forbidden unless corroborated by actual command outputs, compiler results, or file diffs.

---

## 2. The Universal 16-Stage Execution Protocol

For meaningful engineering tasks, the orchestrator executes this deterministic sequence:

```
┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    STAGE 1: UNDERSTAND OBJECTIVE                               │
│                    Parse user constraints, deliverables, technical requirements.               │
└───────────────────────────────────────────────┬────────────────────────────────────────────────┘
                                                │
                                                ▼
┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│                               STAGE 2: IDENTIFY ACTIVE PROJECT                                 │
│               Detect repo root, working branch, language runtime, package manager.             │
└───────────────────────────────────────────────┬────────────────────────────────────────────────┘
                                                │
                                                ▼
┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│                             STAGE 3: READ PROJECT INSTRUCTIONS                                 │
│                  Ingest local AGENTS.md, CLAUDE.md, and repository linters/rules.               │
└───────────────────────────────────────────────┬────────────────────────────────────────────────┘
                                                │
                                                ▼
┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                STAGE 4: INSPECT REPOSITORY STATE                               │
│                   Audit git cleanliness, uncommitted changes, existing tests.                  │
└───────────────────────────────────────────────┬────────────────────────────────────────────────┘
                                                │
                                                ▼
┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│                              STAGE 5: IDENTIFY REQUIRED CAPABILITIES                           │
│               Decompose task into technical domains (e.g., UI, DB, Auth, Testing).             │
└───────────────────────────────────────────────┬────────────────────────────────────────────────┘
                                                │
                                                ▼
┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│                              STAGE 6: INSPECT INSTALLED SKILLS                                 │
│                  Probe local and global skills via `npx skills list [-g]`.                     │
└───────────────────────────────────────────────┬────────────────────────────────────────────────┘
                                                │
                                                ▼
┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│                             STAGE 7: DISCOVER VIA `find-skills`                                │
│                Search skills.sh; evaluate candidates against 5-point scoring rubric.           │
└───────────────────────────────────────────────┬────────────────────────────────────────────────┘
                                                │
                                                ▼
┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│                             STAGE 8: INSPECT & LEARN SPECIALIST SKILL                          │
│          Run 4-phase learning loop: Inspect -> Understand -> Integrate -> Validate.           │
└───────────────────────────────────────────────┬────────────────────────────────────────────────┘
                                                │
                                                ▼
┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                STAGE 9: BUILD TASK EXECUTION PLAN                              │
│              Sequence work stages; assign appropriate specialist skills per phase.             │
└───────────────────────────────────────────────┬────────────────────────────────────────────────┘
                                                │
                                                ▼
┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│                            STAGE 10: DEFINE ACCEPTANCE CRITERIA                                │
│               Establish measurable pass/fail test assertions prior to code edits.              │
└───────────────────────────────────────────────┬────────────────────────────────────────────────┘
                                                │
                                                ▼
┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│                             STAGE 11: EXECUTE WITH SPECIALIST SKILL                            │
│                 Apply domain patterns under guidance of active specialist skill.               │
└───────────────────────────────────────────────┬────────────────────────────────────────────────┘
                                                │
                                                ▼
┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│                             STAGE 12: RUN TESTS & EVIDENCE VERIFICATION                        │
│                 Run compilers, unit tests, and linters; collect raw outputs.                   │
└───────────────────────────────────────────────┬────────────────────────────────────────────────┘
                                                │
                                                ▼
┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│                              STAGE 13: DIAGNOSE & RESOLVE FAILURES                             │
│                  If verification fails, diagnose and iterate on targeted fixes.                │
└───────────────────────────────────────────────┬────────────────────────────────────────────────┘
                                                │
                                                ▼
┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│                            STAGE 14: CLEAN UP TEMPORARY DEPENDENCIES                           │
│              Safely prune eligible temporary skills; preserve core and pinned skills.          │
└───────────────────────────────────────────────┬────────────────────────────────────────────────┘
                                                │
                                                ▼
┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│                             STAGE 15: UPDATE SKILL KNOWLEDGE RECORDS                           │
│              Record execution outcomes, compatibility insights, and usage history.             │
└───────────────────────────────────────────────┬────────────────────────────────────────────────┘
                                                │
                                                ▼
┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                STAGE 16: DELIVER EVIDENCE REPORT                               │
│              Provide structured final summary citing verified logs and status labels.          │
└────────────────────────────────────────────────────────────────────────────────────────────────┘
```

*Note: For trivial edits (e.g., single-line typo fix) or immediate factual answers, the orchestrator bypasses external skill discovery and executes directly.*

---

## 3. Multi-Skill Orchestration Mechanics

Complex workflows frequently require expertise across multiple decoupled domains. For example:
> *"Build a Next.js application with Tailwind CSS styling, Prisma ORM, Auth0 authentication, and Playwright E2E tests."*

### Orchestration Sequence
1. **Deconstruct Domains**: Identify required specialist domains:
   - Framework: `nextjs-best-practices`
   - UI/UX: `tailwind-design`
   - Database: `prisma-database`
   - Authentication: `auth0-nextjs`
   - Testing: `playwright-testing`
2. **Sequential Phase Assignment**:
   - **Phase 1 (Data Layer)**: Load `prisma-database` -> Generate schema -> Run migration -> Unload.
   - **Phase 2 (Routing & APIs)**: Load `nextjs-best-practices` -> Build server actions & routes -> Unload.
   - **Phase 3 (Authentication)**: Load `auth0-nextjs` -> Configure session middleware -> Unload.
   - **Phase 4 (UI & Components)**: Load `tailwind-design` -> Implement layouts and components -> Unload.
   - **Phase 5 (E2E Verification)**: Load `playwright-testing` -> Execute automated test suite -> Unload.
3. **Context Minimization Benefit**: At no point are all 5 skills competing for agent context. Each phase receives focused, uncluttered domain guidance.

---

## 4. Conflict Resolution & Precedence Hierarchy

When directives or conventions between user prompts, repository rules, and specialist skills conflict, the orchestrator enforces an explicit 6-level descending precedence hierarchy:

```
┌────────────────────────────────────────────────────────────────────────┐
│ 1. System & Platform Safety Requirements (HIGHEST AUTHORITY)           │
│    Sandbox boundaries, secret protection, destructive action blocks.   │
├────────────────────────────────────────────────────────────────────────┤
│ 2. Explicit Current User Instructions                                  │
│    Direct prompt overrides for the immediate turn.                     │
├────────────────────────────────────────────────────────────────────────┤
│ 3. Project-Specific Instructions                                       │
│    Repository conventions (AGENTS.md, CLAUDE.md, linters, tsconfig).   │
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

### Conflict Scenarios
- **Scenario A (Project vs Specialist)**: If a specialist skill recommends Tailwind v4 but the repository's `package.json` pins Tailwind v3 with an explicit `AGENTS.md` directive, the repository instruction wins (Level 3 > Level 4).
- **Scenario B (User vs Preference)**: If stored user preferences request Vitest, but the current prompt explicitly specifies Jest, the prompt directive wins (Level 2 > Level 5).
- **Scenario C (Specialist vs Safety)**: If a specialist skill instructs the agent to run `curl http://... | bash`, the safety policy overrides and halts the command (Level 1 > Level 4).
