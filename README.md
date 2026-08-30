# Repo Ready

Repo Ready is an evidence-backed readiness score for repositories used by autonomous coding agents. It checks whether an agent can discover the right commands, reproduce the environment, validate a change, follow repository context, and operate within safe boundaries.

The score is deterministic. Every deduction includes a stable rule ID, evidence, remediation, and—when necessary—a hard score cap. No LLM decides the grade.

```text
Agent Readiness: 87/100 — Grade A-

Environment reproducibility    ██████████ 100/100
Build and test discovery       ██████████ 100/100
Validation quality             ████████░░  80/100
Agent context                  █████████░  90/100
Safety and permissions         ████████░░  85/100
```

## Quick start

The project currently runs from source:

```powershell
npm install
npm run build
node dist/src/cli.js scan .
```

Generate machine-readable or visual reports:

```powershell
node dist/src/cli.js scan . --format json --output .repo-ready/report.json
node dist/src/cli.js scan . --format html --output .repo-ready/report.html
```

Run dynamic verification using commands the repository already declares:

```powershell
node dist/src/cli.js verify . --timeout 180
```

`scan` is read-only. `verify` executes declared validation commands but never installs dependencies.

## What is measured

| Dimension | Weight | Question |
|---|---:|---|
| Environment reproducibility | 15% | Can a clean agent environment reproduce the project? |
| Build and test discovery | 15% | Are canonical commands explicit and non-interactive? |
| Validation quality | 20% | Can the agent prove a change works? |
| Agent context | 15% | Are instructions present, scoped, and internally consistent? |
| Safety and permissions | 15% | Are secrets and sensitive paths protected? |
| Feedback speed | 10% | Is a narrow validation loop discoverable? |
| Change isolation | 5% | Can changes remain deterministic and reviewable? |
| Observability and recovery | 5% | Can agents diagnose and recover from failures? |

Scores use deductions inside each dimension and weighted aggregation across dimensions. Critical findings can cap the final score. For example, a likely committed credential caps a repository at 39 even if its documentation and tests are otherwise excellent.

## Configuration

Add `.repo-ready.json` to make repository-specific contracts explicit:

```json
{
  "profile": "node",
  "protectedPaths": [
    ".github/workflows/**",
    "infra/production/**",
    "security/**"
  ],
  "excludePaths": [
    "test/fixtures/intentionally-unsafe/**"
  ],
  "commands": {
    "verify": "npm run lint && npm test"
  },
  "timeoutSeconds": 180,
  "ignoreRules": []
}
```

Path exclusions are explicit because benchmark and security fixtures may intentionally contain suspicious filenames. Excluding a path does not disable the corresponding rule when that fixture is scanned directly.

Supported profiles in the MVP are `node`, `python`, `monorepo`, `docs`, and `generic`. The scanner detects a profile when none is configured.

## CLI

```text
repo-ready scan [path] [options]
repo-ready verify [path] [options]

--format <terminal|json|html>
--output <file>
--config <file>
--min-score <0-100>
--timeout <seconds>
```

Use `--min-score` in CI to prevent readiness regressions without demanding a perfect score immediately.

## GitHub Action

The repository includes a dependency-free JavaScript action. After publishing a tagged release, consumers can use:

```yaml
- uses: kishorez5n/RepoReady@v1
  with:
    mode: scan
    min-score: "75"
    output: .repo-ready/report.json
```

The action emits `score`, `grade`, and `report` outputs and writes JSON and HTML reports.

## Design principles

- Evidence before judgment.
- Deterministic scoring before advisory AI analysis.
- Critical gates cannot be averaged away.
- Static scanning is read-only.
- Dynamic verification is explicit and non-installing.
- Repository types receive profile-appropriate checks.
- Every rule is reproducible from public repository state.

## Development

```powershell
npm run build
npm test
npm run verify
npm run scan
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for rule requirements and [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for common failures.

## Current MVP limitations

- Dynamic verification executes commands in the current environment; sandbox orchestration is planned.
- Python and generic project discovery are intentionally narrower than Node support.
- GitHub Actions is the only CI provider inspected in the first version.
- The score is a readiness diagnostic, not a guarantee that an agent will produce correct code.

## License

MIT
