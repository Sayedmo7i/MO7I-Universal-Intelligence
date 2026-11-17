# ADR 0001: Mandatory Per-Run Logging and Turn-End Execution Summary

## Context
Users executing tasks across different projects under MO7I Universal Intelligence reported uncertainty regarding whether MO7I was actively functioning. Specifically:
1. When tasks were dispatched, the operational pipeline did not visibly report what tools were called or what skills were consulted.
2. In agent environments, lacking explicit imperative instructions in `SKILL.md`, LLMs frequently responded conversationally without bootstrapping missing project skills or persisting execution logs.
3. While `.mo7i/runs/<timestamp>.json` was written by the CLI router, there was no continuous human-readable log file (`.mo7i/mo7i.log`) for rapid inspection, nor a mandatory summary table concluding each interaction turn.

## Decision
1. **Continuous Human-Readable Logging**:
   `writeRunLog` in `src/commands/command-router.js` will append every execution record to `.mo7i/mo7i.log` in addition to writing the structured `.mo7i/runs/<timestamp>.json` record. The log entry includes the timestamp, task intent, classified domain, execution status, mode, tools called, skills activated, and newly installed skills.

2. **Standardized Turn-End Execution Summary**:
   `handleUniversalTask` in `src/commands/command-router.js` appends an explicit execution summary block to `output` and returns it in the response payload.
   In addition, `skills/mo7i/SKILL.md` mandates that any AI assistant operating under MO7I MUST end its response with the standard Execution Summary block listing:
   - Tools Executed
   - Skills Activated
   - Skills Installed
   - Execution Status
   - Audit Log Paths (`.mo7i/runs/<timestamp>.json` & `.mo7i/mo7i.log`)

3. **Autonomous Stack Initialization Contract**:
   When entering uninitialized workspaces, agents and orchestrators MUST detect the lack of `.mo7i/project-profile.json` and run project setup (`setup-project-skills initial`) to provision foundational skills to `.agents/skills/`.

## Consequences
- **Positive**: Complete transparency and verifiable evidence across all execution turns. Users immediately see tools used, skills activated, skills installed, and log locations.
- **Positive**: Strict backwards compatibility: existing tests checking `.mo7i/runs/*.json` continue to pass without regression.
- **Verification**: Verified via test suite assertions verifying `.mo7i/mo7i.log` appending and `[MO7I EXECUTION SUMMARY]` output.
