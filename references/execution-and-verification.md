# Execution & Verification Protocol

This document specifies the execution, verification, and evidence-gathering standards required by MO7I Universal Intelligence.

---

## 1. Measurable Acceptance Criteria

Before executing code changes or running modifying commands, the orchestrator must establish a clear plan containing concrete, measurable acceptance criteria:
- Every planned step must state *how* its completion will be verified.
- Vague statements (e.g., "ensure the code works", "make the styles better") are disallowed.
- Criteria must be bound to verifiable artifacts (e.g., test suite pass, linter exit code 0, generated bundle file existence, HTTP status 200).

---

## 2. Evidence Over Claims (The Core Standard)

The orchestrator operates under strict reporting integrity:
1. **No Assumed Success**: Never declare a task, test, or feature complete based on the expectation that an edit worked.
2. **Command Output Required**: Every claim of completion must cite the actual terminal command executed, its exit code, and stdout/stderr evidence.
3. **No Fabricated Evidence**: If a command was not executed, or an error occurred, document the exact failure verbatim. Never simulate or invent successful test runs.

---

## 3. Iterative Remediation Loop

When verification yields failures or compiler errors:
1. **Preserve State**: Capture the exact error output and stack trace.
2. **Root Cause Diagnosis**: Consult specialist skill instructions to identify domain-specific anti-patterns or syntax errors.
3. **Targeted Fix**: Apply minimal corrective changes rather than broad, speculative rewrites.
4. **Re-Verification**: Re-run the exact failing test to prove remediation before moving forward.

---

## 4. Standard Status Labels

At the completion of any task or sub-phase, assign one of the following strict status labels:

| Status Label | Formal Definition | Required Evidence |
| :--- | :--- | :--- |
| **VERIFIED** | Task fully implemented and verified with definitive automated test passes or compiler outputs. | Complete command execution logs with exit code 0 and passing assertions. |
| **IMPLEMENTED** | Code written and syntactically validated, but comprehensive end-to-end testing was partially limited. | Code diffs and static validation evidence. |
| **PARTIALLY VERIFIED** | Core components tested successfully, but secondary components were skipped or blocked. | Specific passing tests cited alongside clear identification of untested items. |
| **BLOCKED** | Execution halted by missing credentials, unavailable external dependencies, or a human gate. | Verbatim error messages, missing resources, and the exact manual command for the user. |
| **NOT IMPLEMENTED** | Intentionally rejected or out of scope due to safety risks, policy violations, or user rejection. | Explicit rationale citing security or constraint boundaries. |
