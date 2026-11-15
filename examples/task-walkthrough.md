# Example: End-to-End Task Walkthrough

This walkthrough demonstrates how MO7I Universal Intelligence processes a user request requiring a specialist skill.

---

## Scenario
A user asks: *"Help me optimize my Next.js App Router caching strategy and revalidate server components efficiently."*

---

## Step-by-Step Orchestration Trace

### 1. Understand & Initialize Context
- **Intent**: Optimize caching and revalidation in a Next.js App Router codebase.
- **Complexity**: Meaningful task requiring framework-specific architectural patterns (Next.js Cache, Data Cache, Full Route Cache).
- **Environment**: Scans project root; detects `next.config.js` and Next.js 15.

### 2. Check Existing Skills
- Runs: `npx skills list`
- Result: No Next.js caching specialist skill currently installed in the project.

### 3. Discover Specialist
- Evaluates domain query: `"nextjs cache architecture"`
- Runs: `npx skills find "nextjs cache architecture"`
- Finds candidates:
  - `mohamed-hossam1/nextjs-skills@nextjs-cache-architecture`
  - `sickn33/agentic-awesome-skills@nextjs-best-practices`

### 4. Evaluate & Vet
- Candidate selected: `sickn33/agentic-awesome-skills@nextjs-best-practices`
- Trust classification: Tier 2 (Unknown Publisher) or Tier 1 (if official).
- Pre-install audit: Reads candidate `SKILL.md`. Checks for malicious scripts or network requests.
- Reports audit findings to user and obtains confirmation.

### 5. Install Specialist Skill
- Runs: `npx skills add sickn33/agentic-awesome-skills --skill nextjs-best-practices -y`
- Scope: Project-level.
- Registers in `~/.config/mo7i/universal-intelligence/skill-registry.json` as `type: "temporary"`.

### 6. Load & Plan
- Reads specialist instructions into active agent context.
- Formulates execution plan with acceptance criteria:
  - Identify un-cached fetch calls in server components.
  - Apply `revalidateTag` and `unstable_cache` patterns according to specialist guidelines.
  - Acceptance criterion: `npm run build` succeeds with static/dynamic route markers properly designated.

### 7. Execute & Verify
- Implements targeted caching patterns.
- Runs verification command:
  ```bash
  npm run build
  ```
- Command exit code is `0`. All route segments build with expected caching headers.

### 8. Cleanup & Report
- Identifies temporary skill installed for this task.
- Uninstalls skill cleanly:
  ```bash
  npx skills remove nextjs-best-practices -y
  ```
- Verifies filesystem removal and updates registry.
- Delivers final report citing the build logs and status: `VERIFIED`.
