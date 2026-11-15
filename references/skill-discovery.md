# Skill Discovery & Selection Logic

This document specifies the discovery, evaluation, and selection algorithms used by MO7I Universal Intelligence to discover specialist skills.

---

## 1. Meaningful Task Classification

Before invoking external skill discovery, the orchestrator classifies the task complexity:

### Criteria for "Meaningful Task"
A task is classified as meaningful and eligible for specialist discovery when it satisfies at least one of the following:
1. **Domain Expertise Required**: The task involves specialized domain concepts (e.g., WebGL shaders, AST transformations, distributed caching, OAuth flow implementations, behavior trees).
2. **New or Unfamiliar Tech Stack**: The project introduces frameworks, libraries, or tools not already mastered in existing project context (e.g., migrating from Pages Router to Next.js App Router, configuring Cloudflare Workers).
3. **Specialized Quality Standard**: The task demands strict domain-specific best practices, architectural patterns, or security hardening guidelines.

### Criteria to Skip Discovery
The orchestrator MUST skip skill discovery when:
1. **Trivial Edits**: Single-line fixes, simple typo corrections, standard documentation grammar updates, or renaming variables.
2. **Active Verified Skill Available**: A suitable specialist skill is already installed, verified, and loaded in the current conversation.
3. **General Agent Capabilities Sufficient**: Standard programming and shell actions that standard foundation models execute without specialized prompts.
4. **Immediate Clarifications**: Tasks consisting purely of clarifying user intent or inspecting existing repository files.

---

## 2. Discovery Workflow

The discovery process follows a deterministic sequence:

```
                  ┌─────────────────────────────────────────┐
                  │ 1. Extract Task, Stack, and Constraints │
                  └────────────────────┬────────────────────┘
                                       │
                                       ▼
                  ┌─────────────────────────────────────────┐
                  │ 2. Check Installed Skills (Local/Global)│
                  └────────────────────┬────────────────────┘
                                       │
                      ┌────────────────┴────────────────┐
                      ▼                                 ▼
             [Suitable Match Exists]          [No Suitable Match]
                      │                                 │
                      ▼                                 ▼
             [Reuse Existing Skill]           ┌─────────────────────────────────┐
                                              │ 3. Execute npx skills find      │
                                              │    "<task-derived keywords>"    │
                                              └─────────────────┬───────────────┘
                                                                │
                                                                ▼
                                              ┌─────────────────────────────────┐
                                              │ 4. Score Candidate Results      │
                                              └─────────────────┬───────────────┘
                                                                │
                                              ┌─────────────────┴───────────────┐
                                              ▼                                 ▼
                                     [Candidate Found]                 [No Match Found]
                                              │                                 │
                                              ▼                                 ▼
                                     [Select ONE Primary]              [Report & Fall Back to]
                                     [Proceed to Vetting]              [Direct Capabilities  ]
```

### Step 1: Extract Query Keywords
Generate focused search terms from the core domain rather than vague problem descriptions:
- **Good queries**: `nextjs app-router`, `pixijs rendering`, `playwright e2e`, `tailwind design`
- **Poor queries**: `how to make website fast`, `fix code`, `improve styling`

### Step 2: Probe Installed Skills
Inspect existing local and global installations to avoid redundant network lookups and installations:
```bash
# Check project-level skills
npx skills list

# Check global skills
npx skills list -g
```
If an existing skill provides sufficient instructions, activate it and skip discovery.

### Step 3: Execute `npx skills find`
Execute keyword search:
```bash
npx skills find "<keywords>"
```
If zero results return, retry with alternative or broader domain keywords (e.g., retry `nextjs-turbopack` -> `nextjs` -> `react`).

---

## 3. Candidate Scoring Rubric

When search results return multiple candidates, compute an objective score:

| Evaluation Dimension | Weight | Scoring Factors |
| :--- | :---: | :--- |
| **Domain Relevance & Stack Fit** | 35% | Direct match with the user's specific framework version, runtime, and objective. Penalize generic or mismatched versions. |
| **Publisher Reputation** | 25% | Official publishers (e.g., `vercel-labs`, `anthropics`, `cloudflare`, `auth0`, `microsoft`) receive priority over unverified personal forks. |
| **Adoption & Usage Metrics** | 15% | High install counts (e.g., >10K) and GitHub stars indicate community testing. *Note: Installs are not the sole criterion; an official repo with 2K installs beats an unknown fork with 5K.* |
| **Documentation & Quality** | 15% | Clear, concise `SKILL.md` with targeted triggers, structured instructions, and minimal bloat. |
| **Security Audit Standing** | 10% | Clean automated risk reports (e.g., Gen, Socket, Snyk Safe badges on skills.sh). Zero suspicious scripts. |

### Single Primary Specialist Rule
The orchestrator must pick **ONE** primary specialist skill that best aligns with the immediate task. Secondary skills may only be introduced if the task explicitly spans distinct decoupled domains (e.g., a frontend React skill combined with a database migration skill).

### Fallback Behavior
If no candidate meets the minimum quality threshold, or if no results are returned:
1. Clearly inform the user that no specialist skill met criteria.
2. Proceed immediately using core foundation agent capabilities.
3. Do NOT install low-quality, untrusted, or irrelevant packages merely to satisfy an installation step.
