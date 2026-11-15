---
name: setup-project-skills
description: "Project Intelligence & Automated Skill Setup companion for MO7I Universal Intelligence (v2.3.0). Provisions, audits, repairs, and updates project-scoped specialist skills and manages post-install configuration lifecycles."
---

# Setup Project Skills

Companion skill for **MO7I Universal Intelligence** that establishes, audits, and manages project-scoped specialist skill environments.

---

## 1. Operating Modes

```text
$setup-project-skills [mode]
  ├── initial [path]  -> Full analysis, discovery, and installation of verified skills
  ├── audit [path]    -> Non-destructive audit of stack, skills, drift, and pending setups
  ├── update [path]   -> Analyzes new dependencies and installs missing specialists
  ├── repair [path]   -> Reinstalls corrupted/missing skills according to registry
  ├── report [path]   -> Generates Markdown inventory (.mo7i/setup-report.md)
  └── skip-setup <id> -> Marks an interactive post-install setup as skipped with reason
```

---

## 2. Post-Install Setup Management

When installing skill suites (such as the verified Matt Pocock collection), some skills require repo-level configuration (e.g. `setup-matt-pocock-skills`).

- **Human Gate**: If a setup skill asks questions, MO7I does NOT invent answers silently. It presents the pending setups to the user and provides the exact command to run.
- **Verification**: Completion is verified against created files and configurations before updating status to `completed`.
- **Skip Path**: Users can explicitly mark a setup as `skipped` with `--reason "<rationale>"`.
