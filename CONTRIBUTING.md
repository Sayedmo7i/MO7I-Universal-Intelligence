# Contributing to MO7I Universal Intelligence

Thank you for your interest in improving MO7I Universal Intelligence!

## Code of Conduct

All contributors and maintainers are expected to uphold respectful, inclusive, and professional communication at all times.

## Design Philosophy

MO7I Universal Intelligence is an **orchestrator**, not a monolithic library of implementations:
1. **Keep `SKILL.md` Lean**: The root `SKILL.md` must remain concise (<300 lines) and trigger-focused.
2. **Deep Documentation in `references/`**: Complex algorithms, schemas, and scoring tables belong in dedicated reference files.
3. **Evidence-Driven**: Every capability or claim must be testable with automated command outputs.
4. **Privacy-Preserving**: Never commit credentials, personal data, project names, or private environment paths.

## Development Workflow

1. Fork and clone the repository.
2. Create a feature branch: `git checkout -b feature/my-enhancement`.
3. Test skill validity:
   ```bash
   npx skills add . --list
   ```
4. Run test cases and update test results.
5. Submit a pull request with a clear description of changes.

## License

By contributing to this repository, you agree that your contributions will be licensed under the project's MIT License.
