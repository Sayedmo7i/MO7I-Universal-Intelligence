# Skill Learning Engine & Multi-Skill Orchestration

This document specifies the operational learning engine, knowledge representation, inspection phases, and multi-skill orchestration mechanisms implemented by MO7I Universal Intelligence.

---

## 1. Universal Skill Intelligence Principle

The core principle of MO7I Universal Intelligence is:
> **Installation does not equal availability. Availability does not equal comprehension. Comprehension does not equal application.**

The orchestrator must never assume a skill is ready to use merely because files exist in `.agents/skills/`. Before using any specialist skill, it executes a 4-phase learning loop:

```
[Phase A: Inspection] ──► [Phase B: Understanding] ──► [Phase C: Integration] ──► [Phase D: Practical Validation]
   - Read SKILL.md           - Capabilities Profile       - Task Mapping             - Environment Probe
   - Inspect References      - Tool/Command Needs         - Complementary Skills     - Dependency Check
   - Scan Scripts            - Input/Output Contract      - Conflict Identification   - Execution Test
   - Review Permissions      - Operational Limits         - Execution Ordering       - Result Verification
```

---

## 2. The Four-Phase Learning Loop

### Phase A — Inspection
When a specialist skill is detected or newly installed:
1. Locate its installation path (e.g., `.agents/skills/<name>/`).
2. Read the complete `SKILL.md` from start to finish.
3. Read all secondary reference documents linked in `SKILL.md` (e.g., `references/`, `docs/`, `guides/`).
4. Audit all bundled scripts (`scripts/*.sh`, `*.js`, `*.py`) and configuration files.
5. Identify required CLI binaries, language runtimes, network endpoints, and environment variables.
6. Verify file integrity and validate frontmatter metadata.

### Phase B — Understanding (The Operational Profile)
Translate raw instructions into a structured operational understanding:
- **Core Mission**: What exact domain problem does this skill solve?
- **Activation Boundary**: Under what explicit conditions should it be invoked?
- **Contraindications**: When must this skill NOT be used (anti-patterns, mismatched versions, incompatible tasks)?
- **Tool Contracts**: Which specific tools (`run_command`, `generate_image`, `read_resource`, etc.) does it command?
- **Input/Output Expectations**: What files/data must be provided, and what output artifacts verify success?
- **Failure Modes**: What common errors occur, and what diagnostic steps resolve them?

### Phase C — Integration (Multi-Skill Synergy & Conflicts)
Position the skill within the active ecosystem:
- **Capability Mapping**: Which task categories trigger this skill (e.g., `frontend`, `database`, `security`, `testing`)?
- **Complementary Pairings**: Which skills synergize with it (e.g., a Tailwind UI skill pairing with a Next.js App Router skill)?
- **Conflict Identification**: Which skills compete or prescribe contradictory conventions (e.g., Pages Router vs App Router conventions)?
- **Execution Sequencing**: Should this skill execute prior to, concurrently with, or following another skill?
- **Resource Exclusivity**: Does the skill require exclusive write locks on shared project files (e.g., schema migrations, lockfiles)?

### Phase D — Practical Validation
Probe whether the skill is executable in the current runtime:
1. Check runtime availability of required binaries (`which <cmd>` / `<cmd> --version`).
2. Check presence of mandatory environment variables (without reading or logging secrets).
3. Validate that current user permissions suffice for the skill's operations.
4. Execute a dry-run or targeted verification step.
5. Record the verified operational status (`RUNTIME_AVAILABLE` vs `UNAVAILABLE_IN_RUNTIME`).

---

## 3. Skill Understanding Record Schema

Operational profiles are maintained in `~/.config/mo7i/universal-intelligence/skill-knowledge.json`.
Only derived metadata, constraints, and instructions are stored—**no secrets, credentials, or proprietary vendor tokens are ever persisted.**

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "version": "1.1.0",
  "records": {
    "nextjs-best-practices": {
      "name": "nextjs-best-practices",
      "version": "1.0.0",
      "source": "sickn33/agentic-awesome-skills@nextjs-best-practices",
      "publisher": "sickn33",
      "install_path": "/workspace/.agents/skills/nextjs-best-practices",
      "scope": "project",
      "primary_capabilities": [
        "Next.js App Router route handlers",
        "Server Components data fetching",
        "Tag-based cache revalidation",
        "Turbopack build configuration"
      ],
      "supported_task_types": ["routing", "caching", "ssr", "optimization"],
      "required_dependencies": ["node", "npm", "next"],
      "available_tools": ["run_command", "view_file", "replace_file_content"],
      "required_inputs": ["next.config.js", "app/ directory"],
      "expected_outputs": ["optimized cache headers", "valid build artifacts"],
      "limitations": [
        "Does not manage database schema migrations",
        "App Router only; incompatible with Pages Router"
      ],
      "security_tier": "Trusted",
      "complementary_skills": ["tailwind-design", "prisma-database"],
      "conflicting_skills": ["pages-router-legacy"],
      "last_successful_usage": "2026-11-15T18:15:00Z",
      "runtime_status": "VERIFIED_ACTIVE"
    }
  }
}
```

---

## 4. Multi-Skill Orchestration & Execution Sequencing

When a user request requires multiple domains (e.g., full-stack Next.js + Tailwind UI + Prisma Database + Vitest Testing):

### Step 1: Capability Decomposition
Deconstruct the request into discrete engineering stages:
```
Stage 1: Architecture & Data Modeling (Database / Prisma)
Stage 2: Core Routing & Server Actions (Next.js Specialist)
Stage 3: UI Design & Accessibility (Tailwind / Design Specialist)
Stage 4: Automated Testing & Verification (Vitest / Testing Specialist)
```

### Step 2: Context Minimization
**Never load every available skill into context at once.**
Excessive context dilutes attention, increases token latency, and causes instruction collisions.
The orchestrator loads *only* the specialist skill relevant to the currently executing stage, and transitions context sequentially.

### Step 3: Explicit Precedence Hierarchy
When instructions between user directives, project rules, and multiple skills conflict, resolve them strictly in descending order:

1. **System & Platform Safety Requirements** (Highest Authority — sandboxing, security gates, no secret leakage)
2. **Explicit Current User Instructions** (Direct orders in the immediate prompt)
3. **Project-Specific Instructions** (`AGENTS.md`, `CLAUDE.md`, repository linters)
4. **Specialist Skill Instructions** (Domain guidelines from active specialist skill)
5. **Confirmed User Preferences** (`~/.config/mo7i/universal-intelligence/preferences.json`)
6. **General Defaults** (Built-in fallbacks and basic agent heuristics)

---

## 5. Usage Verification & Anti-Hallucination Guarantees

The orchestrator enforces two strict anti-hallucination rules:
1. **Never claim a skill was used unless loaded and applied**:
   The orchestrator must cite the exact file from the skill (`SKILL.md` or reference), the specific rule applied, and the command executed under its guidance.
2. **Distinguish Installed vs Runtime Available**:
   If a skill is installed on disk but its underlying compiler or CLI is missing in the environment, report the state accurately:
   `Status: INSTALLED_BUT_UNAVAILABLE (Missing dependency: <dep>)`.
   Never falsely report successful specialist execution when the runtime failed to provide required dependencies.
