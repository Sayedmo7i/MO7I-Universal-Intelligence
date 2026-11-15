# Changelog

All notable changes to the `mo7i-universal-intelligence` skill will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-11-15

### Added
- Initial public release of `mo7i-universal-intelligence` Agent Skill.
- Core 12-stage orchestration lifecycle: Understand -> Init -> Discover -> Evaluate -> Install -> Load -> Plan -> Execute -> Verify -> Remediate -> Cleanup -> Report.
- Dynamic skill discovery via `find-skills` integration and candidate scoring rubric.
- Three-tier security vetting system (Trusted, Unknown, Suspicious) with human gate enforcement.
- Safe skill lifecycle and registry tracking at `~/.config/mo7i/universal-intelligence/skill-registry.json`.
- Five-tier preference resolution hierarchy with private local storage support.
- Deep reference documentation covering architecture, discovery, lifecycle, preferences, model selection, verification, and security policy.
- Test suite with 10 real execution verification cases.
