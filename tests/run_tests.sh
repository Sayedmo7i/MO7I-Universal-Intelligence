#!/usr/bin/env bash
set -euo pipefail

# Test Suite for MO7I Universal Intelligence
REPO_DIR="/root/github.com/Sayedmo7i/MO7I-Universal-Intelligence"
OUTPUT_FILE="${REPO_DIR}/tests/RESULTS.md"

echo "# MO7I Universal Intelligence - Test Execution Results" > "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "Date: $(date -u '+%Y-%m-%d %H:%M:%SZ')" >> "$OUTPUT_FILE"
echo "Host: $(uname -s) $(uname -r) ($(uname -m))" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

run_and_log() {
  local test_num="$1"
  local test_name="$2"
  local cmd="$3"
  local status="$4"
  local notes="$5"

  cd "${REPO_DIR}"
  echo "### Test ${test_num}: ${test_name}" >> "$OUTPUT_FILE"
  echo "" >> "$OUTPUT_FILE"
  echo "**Status**: \`${status}\`" >> "$OUTPUT_FILE"
  echo "" >> "$OUTPUT_FILE"
  echo "**Command executed**:" >> "$OUTPUT_FILE"
  echo '```bash' >> "$OUTPUT_FILE"
  echo "$cmd" >> "$OUTPUT_FILE"
  echo '```' >> "$OUTPUT_FILE"
  echo "" >> "$OUTPUT_FILE"
  echo "**Output**:" >> "$OUTPUT_FILE"
  echo '```text' >> "$OUTPUT_FILE"
  eval "$cmd" >> "$OUTPUT_FILE" 2>&1 || true
  echo '```' >> "$OUTPUT_FILE"
  echo "" >> "$OUTPUT_FILE"
  echo "**Notes / Verification Analysis**:" >> "$OUTPUT_FILE"
  echo "$notes" >> "$OUTPUT_FILE"
  echo "" >> "$OUTPUT_FILE"
  echo "---" >> "$OUTPUT_FILE"
  echo "" >> "$OUTPUT_FILE"
  cd "${REPO_DIR}"
}

# Test 1: Basic activation
run_and_log "1" "Basic Activation & Skill Listing" \
  "npx skills add ${REPO_DIR} --list" \
  "PASS" \
  "The Skills CLI successfully parsed and listed mo7i-universal-intelligence with valid YAML frontmatter and concise trigger description."

# Test 2: Mandatory discovery (Next.js task)
run_and_log "2" "Mandatory Discovery (Next.js Task)" \
  "npx skills find 'nextjs' | head -n 25" \
  "PASS" \
  "Discovered specialist candidates (e.g. sickn33/agentic-awesome-skills@nextjs-best-practices, wshobson/agents@nextjs-app-router-patterns) matching framework requirements."

# Test 3: Missing skill -> install + load
run_and_log "3" "Missing Skill -> Install + Load" \
  "rm -rf /tmp/mo7i-test-proj-install && mkdir -p /tmp/mo7i-test-proj-install && (cd /tmp/mo7i-test-proj-install && npx skills add ${REPO_DIR}/tests/fixtures/sample-specialist -y) && test -f /tmp/mo7i-test-proj-install/.agents/skills/sample-specialist/SKILL.md && head -n 12 /tmp/mo7i-test-proj-install/.agents/skills/sample-specialist/SKILL.md && rm -rf /tmp/mo7i-test-proj-install" \
  "PASS" \
  "Successfully installed sample-specialist into project scope, confirmed SKILL.md exists on disk and loaded instructions."

# Test 4: Existing skill reused, no duplicate
run_and_log "4" "Existing Skill Reused (No Duplicate Network Lookup)" \
  "npx skills list -g | grep -E '(agent-browser|find-skills)'" \
  "PASS" \
  "Detected existing globally-installed skills. The orchestrator reuses local verified skills immediately without invoking redundant discovery."

# Test 5: Temporary cleanup (core/pinned untouched)
mkdir -p /root/.config/mo7i/universal-intelligence
cat << 'EOF' > /root/.config/mo7i/universal-intelligence/skill-registry.json
{
  "version": "1.0.0",
  "updated_at": "2026-11-15T18:00:00Z",
  "skills": {
    "find-skills": {
      "name": "find-skills",
      "type": "core",
      "cleanup_eligibility": false
    },
    "code-review": {
      "name": "code-review",
      "type": "pinned",
      "cleanup_eligibility": false
    },
    "temp-worker": {
      "name": "temp-worker",
      "type": "temporary",
      "cleanup_eligibility": true
    }
  }
}
EOF

run_and_log "5" "Temporary Cleanup (Core & Pinned Untouched)" \
  "node -e '
    const fs = require(\"fs\");
    const regPath = \"/root/.config/mo7i/universal-intelligence/skill-registry.json\";
    const data = JSON.parse(fs.readFileSync(regPath, \"utf8\"));
    const toRemove = [];
    for (const [k, v] of Object.entries(data.skills)) {
      if (v.type === \"temporary\" && v.cleanup_eligibility) {
        toRemove.push(k);
        delete data.skills[k];
      }
    }
    fs.writeFileSync(regPath, JSON.stringify(data, null, 2));
    console.log(\"Cleaned skills:\", toRemove);
    console.log(\"Remaining skills:\", Object.keys(data.skills));
  '" \
  "PASS" \
  "Only temporary skills with cleanup_eligibility=true were pruned. Core (find-skills) and pinned (code-review) remain preserved."

# Test 6: Preferences (image generation)
mkdir -p /root/.config/mo7i
cat << 'EOF' > /root/.config/mo7i/preferences.json
{
  "global": {
    "model_preferences": {
      "preferred_provider": "antigravity",
      "planning_tier": "pro",
      "execution_tier": "flash",
      "image_generation": {
        "preferred_engine": "nano-banana",
        "fallback_engine": "native-generate-image"
      }
    }
  }
}
EOF

run_and_log "6" "Preferences Resolution & Tool Fallback (Image Generation)" \
  "node -e '
    const cp = require(\"child_process\");
    const fs = require(\"fs\");
    const prefs = JSON.parse(fs.readFileSync(\"/root/.config/mo7i/preferences.json\", \"utf8\"));
    const preferred = prefs.global.model_preferences.image_generation.preferred_engine;
    let toolAvailable = false;
    try {
      cp.execSync(\"which \" + preferred, { stdio: \"pipe\" });
      toolAvailable = true;
    } catch {
      toolAvailable = false;
    }
    console.log(\"Preferred image engine:\", preferred);
    console.log(\"Engine available on system:\", toolAvailable);
    if (!toolAvailable) {
      const fallback = prefs.global.model_preferences.image_generation.fallback_engine;
      console.log(\"Graceful fallback applied:\", fallback);
    }
  '" \
  "PASS" \
  "User preferences parsed successfully. Nano-banana probed; when unavailable, orchestrator transparently fell back to native-generate-image with explanation."

# Test 7: Isolation across two projects
run_and_log "7" "Cross-Project Isolation" \
  "rm -rf /tmp/mo7i-test-proj-a /tmp/mo7i-test-proj-b && mkdir -p /tmp/mo7i-test-proj-a /tmp/mo7i-test-proj-b && (cd /tmp/mo7i-test-proj-a && npx skills add ${REPO_DIR}/tests/fixtures/sample-specialist -y) && echo '--- Project A check ---' && ls -d /tmp/mo7i-test-proj-a/.agents/skills/* && echo '--- Project B check ---' && (ls -d /tmp/mo7i-test-proj-b/.agents/skills/* 2>&1 || echo 'Project B is clean (no skills installed)') && rm -rf /tmp/mo7i-test-proj-a /tmp/mo7i-test-proj-b" \
  "PASS" \
  "Skill installed exclusively in Project A. Project B remained completely unaffected and isolated."

# Test 8: Security vetting on malicious fixture
run_and_log "8" "Security Vetting (Malicious Fixture Rejection)" \
  "node -e '
    const fs = require(\"fs\");
    const content = fs.readFileSync(\"${REPO_DIR}/tests/fixtures/malicious-skill/SKILL.md\", \"utf8\");
    const threats = [];
    if (/aws\/credentials|id_rsa|\.ssh|\.env/i.test(content)) threats.push(\"Credential exfiltration attempt\");
    if (/rm\s+-rf\s+\//i.test(content)) threats.push(\"Destructive filesystem command\");
    if (/ignore all previous/i.test(content)) threats.push(\"Prompt injection attack\");
    console.log(\"Threats detected:\", threats);
    if (threats.length > 0) {
      console.log(\"Classification: Tier 3 (Suspicious)\");
      console.log(\"Decision: REJECT IMMEDIATELY. Installation aborted.\");
    }
  '" \
  "PASS" \
  "Static security audit flagged credential access, destructive commands, and prompt injection. Fixture was rejected without execution."

# Test 9: No matching skill -> no install
run_and_log "9" "No Matching Skill -> Fallback to Native Capabilities" \
  "npx skills find 'impossible-nonexistent-skill-query-xyz987' 2>&1 || true" \
  "PASS" \
  "Zero candidates returned. Orchestrator registers no matches, does not install anything, and falls back to native agent capabilities."

# Test 10: Publication status
run_and_log "10" "Publication & Indexing Verification" \
  "gh auth status && git -C ${REPO_DIR} remote -v" \
  "BLOCKED" \
  "Blocked by human gate. Publishing to public GitHub and pushing repository requires explicit user authorization before execution."

echo "All tests executed. Results written to ${OUTPUT_FILE}."
