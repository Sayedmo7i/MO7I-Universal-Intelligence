# MO7I Universal Intelligence

> **Universal Intelligence Layer & Autonomous Task Meta-Orchestrator**  
> *The user specifies WHAT needs to be accomplished. MO7I determines HOW to accomplish it.*

MO7I Universal Intelligence is an autonomous intelligence layer and meta-orchestrator built on the open [Agent Skills](https://skills.sh) standard. It operates as the single autonomous entry point across all engineering repositories and domains. 

It does not simply install or manage skills; it independently analyzes project context, classifies cross-domain task requirements, discovers and vets specialist skills via Vercel Labs `find-skills`, learns their operational contracts, coordinates multi-skill pipelines, enforces zero-trust safety boundaries, verifies outcomes with real execution evidence, and preserves reusable intelligence across projects.

---

## The 14-Phase Autonomous Execution Lifecycle

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

1. **INTAKE**: Deconstruct user goals, deliverables, acceptance criteria, and hard constraints.
2. **CONTEXT INSPECTION**: Audit repository root, active branch, runtime environment, and project rules (`AGENTS.md`, `CLAUDE.md`, linters).
3. **TASK CLASSIFICATION**: Categorize into functional domain (Software, Mobile, Design, SEO, DevOps, Research, etc.) and assess complexity tier.
4. **CAPABILITY GAP ANALYSIS**: Determine whether installed skills suffice or external specialist skills are needed.
5. **SKILL DISCOVERY**: Discover specialist skills via Vercel Labs `find-skills` (`npx skills find "<keywords>"`).
6. **SKILL LEARNING**: Execute the 4-phase learning loop (Inspect -> Understand -> Integrate -> Validate).
7. **COMPATIBILITY VALIDATION**: Verify that candidate skills do not conflict with repository conventions or each other.
8. **EXECUTION PLANNING**: Construct a phased roadmap defining measurable acceptance criteria before making edits.
9. **SKILL ORCHESTRATION**: Sequence specialist skills across pipeline stages, loading only the active skill into context.
10. **EXECUTION**: Implement changes adhering to domain best practices and execute required tool commands.
11. **QUALITY VALIDATION**: Run test suites, compilers, and linters. Enforce "evidence over claims".
12. **LEARNING & KNOWLEDGE UPDATE**: Record operational insights, execution telemetry, and compatibility in user memory.
13. **SAFE CLEANUP**: Prune eligible temporary skills installed by the orchestrator after checking cross-project usage.
14. **FINAL REPORT**: Deliver structured final report citing verified outputs, changed files, and standardized status labels.

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

## Core Systems

### 1. Skill Learning Engine & Six State Transitions
The orchestrator tracks skills across six distinct states to prevent premature capability assumptions:
`DISCOVERED` -> `INSTALLED` -> `UNDERSTOOD` -> `RUNTIME_VERIFIED` -> `SUCCESSFULLY_USED` (or `FAILED_OR_INCOMPATIBLE`).

Before using any skill, it executes a 4-phase learning loop:
- **Phase A (Inspection)**: Reads full `SKILL.md`, walks linked references in `references/`, audits bundled scripts, and verifies tool requirements.
- **Phase B (Understanding)**: Synthesizes an operational profile detailing core capabilities, activation boundaries, contraindications, required inputs, and expected artifacts.
- **Phase C (Integration)**: Maps task categories, pairs complementary skills, identifies conflicting conventions, and establishes stage sequencing.
- **Phase D (Practical Validation)**: Probes the runtime environment (`which <cmd>`) to distinguish between *installed on disk* and *available in runtime*.

### 2. Mandatory `find-skills` Integration
MO7I Universal Intelligence designates `find-skills` (`vercel-labs/skills`) as a core discovery dependency:
- Queries the ecosystem: `npx skills find "<keywords>"`.
- Evaluates candidate pools across a 5-dimension scoring rubric:
  - **Task Relevance & Stack Fit**: 35%
  - **Publisher Reputation**: 25% (official vendors prioritized over unverified forks)
  - **Community Adoption**: 15% (installs and stars on skills.sh)
  - **Documentation Quality**: 15% (modular guides, clear triggers)
  - **Security & Maintainability**: 10% (automated audit ratings)
- Adheres to the **Primary Specialist Rule**: selects ONE best specialist skill per domain stage.

### 3. Multi-Skill Context Minimization & Precedence
When coordinating complex workflows across multiple domains (e.g., Database + Backend + Frontend + E2E Tests):
- **Context Minimization**: Sequentially loads only the skill relevant to the active stage, avoiding context bloat and token degradation.
- **Explicit Conflict Resolution**: Resolves contradictory instructions in strict descending priority order:
  1. *System & Platform Safety Requirements* (Highest Authority)
  2. *Explicit Current User Instructions*
  3. *Project-Specific Instructions* (`AGENTS.md`, `CLAUDE.md`, repository linters)
  4. *Specialist Skill Instructions*
  5. *Confirmed User Preferences*
  6. *General Defaults* (Lowest Authority)

### 4. Global Preferences & Cross-Project Memory
Persistent cross-project intelligence is stored in user profile space (`~/.config/mo7i/universal-intelligence/`):
- `preferences.json`: Confirmed user tech preferences (languages, frameworks, tools, models, image engines).
- `skill-registry.json`: Canonical inventory and classifications (`core`, `pinned`, `persistent`, `temporary`).
- `skill-knowledge.json`: Operational profiles and capability contracts derived by the learning engine.
- `skill-usage-history.json`: Auditable append-only execution history and outcomes.
- `skill-compatibility.json`: Pairwise synergy and sequencing matrix.

*Cross-Project Invariant: Global preferences never override explicit project conventions. No secrets or tokens are ever stored.*

### 5. Security Governance & Mandatory Human Gates
The orchestrator enforces zero-trust vetting and halts execution to request explicit interactive human approval before:
- Destructive filesystem operations outside temporary paths (`rm -rf`).
- Destructive database migrations or table drops.
- Production deployments or public package/repository releases.
- Billable cloud provisioning or financial transactions.
- Installing unvetted community skills from unknown authors.
- System-level privilege escalation (`sudo`).

---

## Installation

Install using the Skills CLI (`npx skills`):

### Global Scope (Universal Meta-Orchestrator)
```bash
npx skills add Sayedmo7i/MO7I-Universal-Intelligence --skill mo7i-universal-intelligence -g -y
```

### Project Scope (Repository-Bound)
```bash
npx skills add Sayedmo7i/MO7I-Universal-Intelligence --skill mo7i-universal-intelligence -y
```

---

## Verification & Standard Statuses

Every task reports verifiable command evidence under standardized statuses:
- **`PASS`**: Complete execution evidence; all criteria met.
- **`FAIL`**: Execution failed assertions or returned non-zero exit codes.
- **`BLOCKED`**: Progress halted by human gate or missing environment prerequisite.
- **`NOT_RUN`**: Step skipped due to failed prerequisite.
- **`NOT_APPLICABLE`**: Step bypassed due to task complexity profile (e.g. trivial edit).

---

## Reference Documentation Index

- [Universal Task Domains](references/task-domains.md): Functional domain taxonomy, missing-service handling.
- [Autonomous Orchestration](references/orchestration.md): 14-phase lifecycle, multi-skill sequencing, precedence.
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
