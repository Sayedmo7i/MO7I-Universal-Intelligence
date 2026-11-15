# Security Policy

## Supported Versions

The following versions of `mo7i-universal-intelligence` are currently receiving security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

Security and safe execution are top priorities for MO7I Universal Intelligence. If you discover a security vulnerability or suspect a malicious behavior pattern:

1. **Do not create a public issue.**
2. Report the vulnerability privately via GitHub Security Advisories on the repository.
3. Include detailed reproduction steps, sample inputs, and observed vs expected behavior.

We acknowledge reports within 48 hours and coordinate public fixes and advisories transparently.

## Security Architecture Principles

- **Zero Blind Execution**: No skill script is executed without source code inspection.
- **Strict Scope Boundaries**: Skills are scoped to project environments by default.
- **No Secret Access**: Orchestrator never accesses, reads, or transmits private credentials, API tokens, or keys.
- **Human Gates**: Untrusted publishers, destructive operations, and repository publications strictly require human confirmation.
