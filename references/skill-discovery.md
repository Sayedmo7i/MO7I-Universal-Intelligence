# Skill Discovery & Candidate Selection

This document specifies the discovery workflows, candidate scoring matrices, and selection algorithms implemented by MO7I Universal Intelligence.

---

## 1. Mandatory `find-skills` Integration

MO7I Universal Intelligence designates `find-skills` (`vercel-labs/skills`) as a **CORE mandatory dependency**. Rather than maintaining a brittle internal catalog, the orchestrator connects directly to the open agent skills ecosystem via `find-skills` and [skills.sh](https://skills.sh).

### The Discovery Trigger
The orchestrator triggers discovery whenever a meaningful task requires domain expertise not already satisfied by installed skills:
1. Probe local project and global skills first (`npx skills list [-g]`).
2. If an installed skill satisfies the domain, reuse it immediately.
3. If no matching skill is installed, invoke the discovery workflow.

---

## 2. Discovery Workflow

```
   [1. Formulate Query Keywords]
                 │
                 ▼
   [2. Execute npx skills find] ──────► [No Results] ──► [Broaden Keywords]
                 │                                               │
                 ▼                                               ▼
   [3. Fetch Candidate Pool] ◄───────────────────────────────────┘
                 │
                 ▼
   [4. Inspect Source & Metadata]
                 │
                 ▼
   [5. Score Across 5 Dimensions]
                 │
                 ▼
   [6. Select Primary Specialist]
```

### Search Query Engineering
Queries must target the specific framework, runtime, and objective:
- **Optimal Queries**: `"nextjs app-router caching"`, `"pixijs rendering"`, `"auth0 authentication"`, `"playwright e2e"`
- **Suboptimal Queries**: `"how to code"`, `"make site fast"`, `"fix bugs"`

### Never Stop at the First Result
Search ranking alone does not guarantee fitness. The orchestrator collects the top candidate pool (typically 3 to 5 candidates) and inspects their actual documentation before making an installation decision.

---

## 3. The 5-Dimension Scoring Matrix

Candidates are evaluated across an objective 100-point rubric:

| Dimension | Weight | Evaluation Criteria |
| :--- | :---: | :--- |
| **Task Relevance & Stack Fit** | **35%** | Direct alignment with the project's exact framework, major version, and language runtime. Penalizes mismatched major versions (e.g., Pages Router when project uses App Router). |
| **Publisher Reputation** | **25%** | Prioritizes official vendor organizations (`vercel-labs`, `anthropics`, `cloudflare`, `auth0`, `microsoft`) over unverified community forks. |
| **Community Adoption** | **15%** | Install counts and GitHub stars on skills.sh indicate battle-tested community usage. *Note: Adoption is a factor, not a sole criterion; an official vendor repo with 2K installs beats an unknown author with 5K installs.* |
| **Documentation Quality** | **15%** | Clear, concise `SKILL.md` with explicit triggers, structured workflows, minimal bloat, and modular references. |
| **Security & Maintainability** | **10%** | Clean automated audit reports (Gen, Socket, Snyk Safe badges on skills.sh) and absence of risky runtime shell scripts. |

---

## 4. Single Primary Specialist Rule

To prevent instruction collisions and context bloat, the orchestrator selects **ONE** primary specialist skill per domain stage. Secondary skills are only introduced when a multi-domain workflow transitions to a different technical stage (e.g., transition from database schema design to frontend UI implementation).

---

## 5. Graceful Fallback (No Match Found)

If `npx skills find` returns 0 candidates, or if all candidates fail the minimum quality or security threshold:
1. Acknowledge the absence clearly in the turn:
   > *"No specialist skill found on skills.sh matching '<query>'. Proceeding using direct foundation agent capabilities."*
2. Proceed immediately with native tool and reasoning capabilities.
3. **Never install irrelevant or low-quality skills simply to satisfy an install step.**
