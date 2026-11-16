# MO7I Universal Intelligence — Pre-Publish Readiness Checklist

**Target Release:** v2.6.0  
**Status:** READINESS AUDIT COMPLETE (Ready for Review · No Publishing Executed)  
**Strict Policy:** *Repository visibility remains private; skills.sh submission deferred until final operator sign-off.*

---

## 1. Security & Secret History Audit

- [x] **Git History Deep Scan:** Executed `git log -p` across all commits searching for sensitive credential patterns (`api_key`, `secret`, `password`, `token`, `bearer`, `ghp_`, `private_key`).
  - **Verdict:** `CLEAN`. Zero credentials or private keys exist in the repository history.
- [x] **Runtime Credential Scrubbing:** Sanitization logic (`sanitizeObject`) automatically strips sensitive keys before writing `.mo7i/` profile or run logs.
- [x] **Environment Boundaries:** Test suites operate strictly on temporary isolated fixtures and preserve environment secrets (`.env`).

---

## 2. Platform Agnostic & Sanitization Audit

- [x] **Platform Neutrality:** Zero mentions of specific agent platforms or container runtimes in user-facing documentation, error messages, and command diagnostics.
- [x] **Standard Agent Skills Standard:** Skills definitions (`.agents/skills/`) adhere strictly to the open Agent Skills specification without host lock-in.
- [x] **Universal CLI:** Fully functional standalone executable (`bin/mo7i`) for terminal and scripted automation.

---

## 3. Documentation & Accuracy Verification

- [x] **Role Statement:** Accurately reflects exact onboarding and orchestration scope:
  > *"A project onboarding and orchestration layer for AI agents: detects the stack, provisions the right skills, tracks manual setup steps, selects the minimum skills per task, verifies with evidence, and logs every run. Same commands and same state (.mo7i/) across projects and agents."*
- [x] **Verification Honesty:** Every platform in `README.md` is classified as `VERIFIED` or `UNVERIFIED` with raw command evidence.
- [x] **Benchmark Report:** `docs/BENCHMARK.md` provides reproducible performance measurements across 5 fixed tasks and an honest overhead analysis.
- [x] **Legal Compliance:** Standard MIT `LICENSE`, comprehensive `SECURITY.md` (covering 2.x), and contributor guidelines in `CONTRIBUTING.md`.

---

## 4. Pre-Publish Release Steps (To Be Performed by Maintainer)

When the maintainer is ready to make the repository public and publish to skills.sh, follow these exact manual steps:

1. **Review and Merge PR:**
   - Inspect the pull request on GitHub.
   - Ensure all automated status checks pass.
   - Merge the pull request into `main` using squash or rebase merge.

2. **Tag Release Version:**
   ```bash
   git checkout main
   git pull origin main
   git tag -a v2.6.0 -m "Release v2.6.0: Overhead Benchmarking, Cross-Platform Honesty, and Publish Readiness"
   git push origin v2.6.0
   ```

3. **Verify Repository Visibility:**
   - Go to GitHub repository Settings -> General -> Danger Zone -> Change repository visibility.
   - Select **Make public** only after operator confirmation.

4. **Verify Skills Registry Discovery:**
   - Test installation from the public repository URL:
     ```bash
     npx skills add Sayedmo7i/MO7I-Universal-Intelligence --skill mo7i -y
     ```
   - Run black-box verification on a clean machine:
     ```bash
     ./bin/mo7i selftest --json
     ```
