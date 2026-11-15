# MO7I Universal Intelligence

> **Autonomous Cross-Project Skill Orchestrator & Specialist Learning Engine**  
> *ONE SKILL. ALL PROJECTS. ALL TASKS. INTELLIGENT SPECIALIST ORCHESTRATION.*

MO7I Universal Intelligence is a portable [Agent Skill](https://skills.sh) designed to serve as the user's single entry point across all engineering projects. It does not replace specialist skills; it discovers them, learns their operational contracts, sequences multi-skill pipelines, enforces zero-trust security boundaries, verifies outcomes with real command outputs, and safely manages lifecycle dependencies.

---

## Architecture: The 16-Stage Universal Protocol

```
 1. Understand Objective ──────►  2. Identify Active Project ───►  3. Read Project Rules (AGENTS.md)
              │                                                                 │
 4. Inspect Repo State   ◄──────  5. Determine Capabilities  ◄──────────────────┘
              │
              ▼
 6. Check Installed Skills ────►  7. Discover via find-skills ──►  8. Inspect & Learn Skill
              │                                                                 │
 9. Plan Task Sequence   ◄────── 10. Define Acceptance Criteria ◄───────────────┘
              │
              ▼
11. Execute with Specialist ───► 12. Run Tests & Verify       ──► 13. Diagnose & Resolve
              │                                                                 │
14. Prune Temporary Skills ◄──── 15. Record Skill Knowledge   ◄─────────────────┘
              │
              ▼
16. Deliver Evidence Report
```

---

## Core Capabilities

### 1. Universal Skill Intelligence & Learning Engine
Installing a skill does not make it ready to use. MO7I Universal Intelligence executes a 4-phase learning loop before applying any specialist skill:
- **Phase A — Inspection**: Reads full `SKILL.md`, walks linked references in `references/`, inspects bundled scripts, and verifies tool requirements.
- **Phase B — Understanding**: Synthesizes an operational profile detailing core capabilities, activation boundaries, contraindications, required inputs, and expected artifacts.
- **Phase C — Integration**: Maps task categories, pairs complementary skills, identifies conflicting conventions, and establishes stage sequencing.
- **Phase D — Practical Validation**: Probes the runtime environment (`which <cmd>`) to distinguish between *installed on disk* and *available in runtime*.

### 2. Mandatory `find-skills` Integration
MO7I Universal Intelligence designates `find-skills` (`vercel-labs/skills`) as a core discovery dependency. For meaningful tasks requiring uninstalled expertise:
- Queries the ecosystem: `npx skills find "<keywords>"`.
- Evaluates candidate pools across a 5-dimension scoring rubric:
  - **Task Relevance & Stack Fit**: 35%
  - **Publisher Reputation**: 25% (official vendors prioritized over unverified forks)
  - **Community Adoption**: 15% (installs and stars on skills.sh)
  - **Documentation Quality**: 15% (modular guides, clear triggers)
  - **Security & Maintainability**: 10% (automated audit ratings)
- Adheres to the **Primary Specialist Rule**: selects ONE best specialist skill per domain stage.

### 3. Multi-Skill Orchestration & Precedence Hierarchy
When coordinating complex full-stack workflows (e.g., Next.js + Tailwind + Prisma + Auth0):
- **Context Minimization**: Sequentially loads only the skill relevant to the active stage, avoiding context bloat and token degradation.
- **Explicit Conflict Resolution**: Resolves contradictory instructions in strict priority order:
  1. *System & Platform Safety Requirements* (Highest Authority)
  2. *Explicit Current User Instructions*
  3. *Project-Specific Instructions* (`AGENTS.md`, `CLAUDE.md`, repository linters)
  4. *Specialist Skill Instructions*
  5. *Confirmed User Preferences*
  6. *General Defaults* (Lowest Authority)

### 4. Global Preferences & Cross-Project Skill Memory
Persistent cross-project intelligence is stored in user profile space (`~/.config/mo7i/universal-intelligence/`):
- `preferences.json`: Confirmed user tech preferences (languages, frameworks, tools, models, image engines).
- `skill-registry.json`: Canonical inventory and classifications (`core`, `pinned`, `persistent`, `temporary`).
- `skill-knowledge.json`: Operational profiles and capability contracts derived by the learning engine.
- `skill-usage-history.json`: Auditable append-only execution history and outcomes.
- `skill-compatibility.json`: Pairwise synergy and sequencing matrix.

*Note: The orchestrator automatically respects active project rules, distinguishes observed behavior from confirmed preferences, and never stores private credentials or secrets.*

### 5. Zero-Trust Security & Safe Lifecycle
- **Three Trust Tiers**: Trusted (official vendors), Unknown (requires static audit and human approval), Suspicious (credential theft, destructive commands -> immediate rejection).
- **Safe Cleanup**: Automated cleanup removes ONLY temporary skills installed by the orchestrator for the specific task. Core and user-pinned skills are strictly permanent. Cross-project dependencies are verified prior to any removal.
- **Anti-Hallucination Mandate**: An agent must never claim to have used a specialist skill unless its instructions were loaded, applied, and verified by command logs.

---

## Installation

Install using the Skills CLI (`npx skills`):

### Global Scope (Universal Orchestrator)
```bash
npx skills add Sayedmo7i/MO7I-Universal-Intelligence --skill mo7i-universal-intelligence -g -y
```

### Project Scope (Repository-Bound)
```bash
npx skills add Sayedmo7i/MO7I-Universal-Intelligence --skill mo7i-universal-intelligence -y
```

---

## Verification & Standard Statuses

Every task reports verifiable command evidence under 5 standardized statuses:
- **`PASS`**: Complete execution evidence; all criteria met.
- **`FAIL`**: Execution failed assertions or returned non-zero exit codes.
- **`BLOCKED`**: Progress halted by human gate or missing environment prerequisite.
- **`NOT_RUN`**: Step skipped due to failed prerequisite.
- **`NOT_APPLICABLE`**: Step bypassed due to task complexity profile (e.g. trivial edit).

---

## Reference Documentation

- [Skill Learning Engine](references/skill-learning-engine.md): 4-phase learning loop, profile schemas, validation.
- [Orchestration Architecture](references/orchestration.md): 16-stage protocol, multi-skill sequencing, precedence.
- [Skill Discovery](references/skill-discovery.md): `find-skills` workflow, 5-dimension scoring rubric.
- [Skill Lifecycle](references/skill-lifecycle.md): Registry tracking, atomic writes, safe cleanup.
- [Preferences & Memory](references/preferences.md): Cross-project storage, observed vs confirmed preferences.
- [Model Selection](references/model-selection.md): Workload complexity matching, delegation rules.
- [Security Policy](references/security-policy.md): Threat vectors, script auditing, trust tiers.
- [Execution & Verification](references/execution-and-verification.md): Acceptance criteria, evidence standards.

---

## License

This project is licensed under the [MIT License](LICENSE).
