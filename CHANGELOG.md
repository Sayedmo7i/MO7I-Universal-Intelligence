# Changelog

All notable changes to the `mo7i-universal-intelligence` skill will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-11-15

### Added
- **Universal Skill Intelligence & Learning Engine**: Implemented 4-phase learning loop (Inspection, Understanding, Integration, Practical Validation) with structured operational profiles.
- **16-Stage Universal Execution Protocol**: Upgraded orchestration pipeline to 16 stages spanning project identification, capability mapping, discovery, sequencing, and verification.
- **Multi-Skill Orchestration**: Sequential context loading per stage and an explicit 6-level conflict precedence hierarchy (Safety > User Prompt > Project Rules > Specialist Skill > Preferences > Defaults).
- **Cross-Project Memory Architecture**: Local persistent schemas in `~/.config/mo7i/universal-intelligence/` (`preferences.json`, `skill-registry.json`, `skill-knowledge.json`, `skill-usage-history.json`, `skill-compatibility.json`).
- **Comprehensive 18-Scenario Automated Test Suite**: Verified detection, reference following, dependency validation, security auditing, multi-skill orchestration, cross-project isolation, and crash recovery.
- **Dedicated Reference Documentation**: Created `references/skill-learning-engine.md` detailing operational profiles and compatibility contracts.

### Changed
- Refactored `SKILL.md` to integrate universal intelligence and the 16-stage protocol while strictly maintaining line count (<300 lines).
- Enhanced `references/orchestration.md`, `references/skill-discovery.md`, `references/skill-lifecycle.md`, `references/preferences.md`, `references/security-policy.md`, and `references/execution-and-verification.md` with multi-skill and zero-trust guidelines.
- Standardized verification statuses to `PASS`, `FAIL`, `BLOCKED`, `NOT_RUN`, `NOT_APPLICABLE`.

## [1.0.0] - 2026-11-15

### Added
- Initial public release of `mo7i-universal-intelligence` Agent Skill.
- Core orchestration lifecycle, `find-skills` integration, and trust tiers.
