# Execution & Evidence-Based Verification

This document specifies the execution guidelines, verification standards, and reporting statuses enforced by MO7I Universal Intelligence.

---

## 1. Evidence Over Claims (The Core Standard)

MO7I Universal Intelligence operates under a strict anti-hallucination mandate:
1. **Never Assume Success**: No task or test is marked complete based on an assumption or unexecuted edit.
2. **Command Output Required**: Every claim of completion must cite the actual terminal command executed, its exit code, and stdout/stderr evidence.
3. **No Unapplied Skill Claims**: An agent must never claim to have benefited from a specialist skill unless it loaded its instructions, applied specific domain rules, and verified the outcome with real logs.

---

## 2. Installed vs. Runtime-Available Distinction

A skill may be successfully downloaded to disk, yet entirely non-functional due to missing runtime prerequisites:
- **`INSTALLED_ON_DISK`**: `SKILL.md` exists in `.agents/skills/<name>`.
- **`RUNTIME_AVAILABLE`**: The runtime environment contains the required compilers, runtimes, and dependencies (e.g., `which next`, `which node`).
- **`RUNTIME_UNAVAILABLE`**: The skill is installed on disk, but required tools or environment dependencies are missing.

*The orchestrator must never report a skill as actively utilized if its underlying runtime tools are missing.*

---

## 3. Standardized Status Labels

Every phase, test case, and execution summary must report one of these 5 precise status labels:

| Status Label | Formal Definition | Required Evidence |
| :--- | :--- | :--- |
| **`PASS`** | The task or test executed completely, met all acceptance criteria, and returned exit code 0. | Full terminal logs showing passing assertions and zero unexpected errors. |
| **`FAIL`** | The task or test executed and produced an error, failed assertion, or non-zero exit code. | Complete terminal logs detailing failure reason and stack trace. |
| **`BLOCKED`** | Execution was halted by a human gate, missing credentials, or unavailable external dependency. | Verbatim blocker explanation and exact next step required from user. |
| **`NOT_RUN`** | A step was intentionally bypassed because an earlier prerequisite failed or was blocked. | Identification of the missing prerequisite. |
| **`NOT_APPLICABLE`** | The step is not relevant to the current task complexity (e.g., skill discovery skipped for typo fix). | Explicit explanation of why the step was out of scope. |

*Note: It is strictly forbidden to report an unexecuted test as `PASS`.*
