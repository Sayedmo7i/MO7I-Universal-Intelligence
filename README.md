# MO7I Universal Intelligence

> Autonomous orchestration agent skill serving as a single, evidence-based entry point for complex engineering tasks.

MO7I Universal Intelligence is a portable [Agent Skill](https://skills.sh) designed to coordinate multi-step workflows. It analyzes incoming requirements, initializes project context, detects domain requirements, discovers and vets specialist skills from the open ecosystem, guides execution through testable acceptance criteria, verifies outcomes with real command output, and cleans up temporary dependencies.

**It orchestrates; it never replaces specialist skills.**

---

## Architecture Overview

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

## Installation

Install using the Skills CLI (`npx skills`):

### Global Scope (User-Level Orchestrator)
Recommended for general AI coding assistants:
```bash
npx skills add Sayedmo7i/MO7I-Universal-Intelligence --skill mo7i-universal-intelligence -g -y
```

### Project Scope (Repository-Bound)
Recommended when anchoring workflows to a specific project workspace:
```bash
npx skills add Sayedmo7i/MO7I-Universal-Intelligence --skill mo7i-universal-intelligence -y
```

---

## Core Dependencies

- **`find-skills`**: Required for ecosystem discovery. MO7I Universal Intelligence leverages `find-skills` (`vercel-labs/skills`) to search and evaluate candidates across the open agent skills leaderboard.
- **`npx skills` CLI**: Used for atomic installation, dependency querying, and temporary skill removal.

---

## Discovery & Selection Flow

The orchestrator classifies incoming tasks before querying the network:
1. **Meaningful Task Assessment**: Tasks requiring framework-specific architecture, domain knowledge, or security standards trigger discovery. Trivial edits, typo fixes, and workflows with already-loaded verified skills skip discovery.
2. **Local Probe**: Probes `npx skills list` (project) and `npx skills list -g` (global) first.
3. **Keyword Discovery**: Generates focused keywords and runs `npx skills find "<keywords>"`.
4. **Candidate Scoring**: Evaluates domain fit (35%), publisher reputation (25%), adoption metrics (15%), documentation quality (15%), and security audit rating (10%).
5. **Primary Specialist Rule**: Selects **ONE** primary specialist skill per domain.

---

## Security Model & Trust Tiers

Every discovered skill is classified into one of three strict tiers before installation:

| Trust Tier | Definition | Action |
| :--- | :--- | :--- |
| **Trusted** | Official, verified organizations (e.g., `vercel-labs`, `anthropics`, `microsoft`) | Read `SKILL.md`, verify scope, install directly. |
| **Unknown** | Community or third-party repositories | Audit `SKILL.md` and all bundled scripts. Report audit summary and **ask user confirmation** before installation. |
| **Suspicious** | Malicious patterns, credential exfiltration, obfuscated commands, or destructive actions | **REJECT immediately.** Do not install. Inform user. |

---

## Lifecycle & Registry Management

The orchestrator tracks all installed skills in a local JSON registry:
`~/.config/mo7i/universal-intelligence/skill-registry.json`

### Skill Types
- `core`: Infrastructure dependencies (e.g., `find-skills`). Never uninstalled.
- `pinned`: User-designated permanent skills. Never uninstalled.
- `persistent`: Multi-session skills retained across runs.
- `temporary`: Task-specific skills eligible for automated cleanup.

### Safe Cleanup Protocol
At task completion, skills marked `temporary` and installed by the orchestrator are uninstalled cleanly via `npx skills remove <name>`. If uncertainty exists regarding other project dependencies, the skill is retained and marked as a `cleanup candidate`.

---

## Preferences Model

Directives resolve in strict priority order:
1. **Current Prompt Instruction** (highest authority)
2. **Confirmed Long-Term Preferences** (`~/.config/mo7i/preferences.json`, explicitly confirmed by user)
3. **Project Instructions** (`AGENTS.md`, `CLAUDE.md`, or repository conventions)
4. **Past Successful Workflows**
5. **System Defaults**

*Note: The orchestrator never writes to the private preferences file without explicit user confirmation, and always probes the environment to verify preferred tools before falling back.*

---

## Examples

- [Task Walkthrough](examples/task-walkthrough.md): Complete end-to-end trace of a Next.js App Router optimization workflow.
- [Orchestration Scenarios](examples/orchestration-scenarios.md): Decision matrices across trivial edits, existing skill reuse, suspicious skill rejection, and missing skill fallbacks.

---

## Reference Documentation

- [Orchestration Architecture](references/orchestration.md)
- [Skill Discovery & Selection](references/skill-discovery.md)
- [Skill Lifecycle & Registry](references/skill-lifecycle.md)
- [Preferences Model](references/preferences.md)
- [Model Selection & Delegation](references/model-selection.md)
- [Execution & Verification](references/execution-and-verification.md)
- [Security & Vetting Policy](references/security-policy.md)

---

## Troubleshooting

### Skill Not Found on CLI Search
If `npx skills find` returns no results:
- Broaden the search query keywords.
- Proceed with direct foundation model capabilities; avoid installing unvetted packages.

### Permission Denied on Global Install
If installing with `-g` fails due to filesystem permissions:
- Install to project scope without the `-g` flag: `npx skills add Sayedmo7i/MO7I-Universal-Intelligence --skill mo7i-universal-intelligence -y`.

---

## Contributing

Contributions, feedback, and pull requests are welcome! Please review [CONTRIBUTING.md](CONTRIBUTING.md) and [SECURITY.md](SECURITY.md) before submitting changes.

---

## License

This project is licensed under the [MIT License](LICENSE).
