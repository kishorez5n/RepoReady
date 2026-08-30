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

## 20-repository benchmark

Repo Ready `0.1.0` was tested against 20 well-known public repositories spanning JavaScript, TypeScript, Python, Go, and Rust. Each block represents approximately 10 score points. Repository links open the exact commit scanned by the benchmark.

### Small repositories

| Repository | Visual score | Score | Grade |
|---|---|---:|:---:|
| [sindresorhus/p-limit](https://github.com/sindresorhus/p-limit/commit/df476048d023ff868cd45b35ee47f5fb0ca2b25a) | `██████░░░░` | 59 | C- |
| [sindresorhus/yocto-queue](https://github.com/sindresorhus/yocto-queue/commit/b07eac099753833b29d06c614149904445739776) | `██████░░░░` | 59 | C- |
| [chalk/ansi-regex](https://github.com/chalk/ansi-regex/commit/7cf0228990eb38c27f9897f4fb17d42d39075a20) | `██████░░░░` | 59 | C- |
| [feross/is-buffer](https://github.com/feross/is-buffer/commit/ec4bf3415108e8971375e6717ad63dde752faebf) | `██████░░░░` | 59 | C- |
| [jonschlinkert/is-number](https://github.com/jonschlinkert/is-number/commit/98e8ff1da1a89f93d1397a24d7413ed15421c139) | `██████░░░░` | 59 | C- |
| [sindresorhus/slash](https://github.com/sindresorhus/slash/commit/98b618f5a3bfcb5dd374b204868818845b87bb2f) | `██████░░░░` | 59 | C- |
| [sindresorhus/escape-string-regexp](https://github.com/sindresorhus/escape-string-regexp/commit/cbc42403142c96923b482604e1f3d627b1956aff) | `██████░░░░` | 59 | C- |

### Medium repositories

| Repository | Visual score | Score | Grade |
|---|---|---:|:---:|
| [expressjs/express](https://github.com/expressjs/express/commit/023767fe9872e029271df1418f73401bff20ff40) | `██████░░░░` | 59 | C- |
| [axios/axios](https://github.com/axios/axios/commit/fede1d1562e308077da7994305d63fb7722b66ac) | `████░░░░░░` | 39 | F |
| [pallets/flask](https://github.com/pallets/flask/commit/d318b683471101618febed18996405ad26462110) | `████░░░░░░` | 39 | F |
| [fastify/fastify](https://github.com/fastify/fastify/commit/1beaf7e72d24b2fc63a02a7f5806772a00e45454) | `██████░░░░` | 59 | C- |
| [cli/cli](https://github.com/cli/cli/commit/40b742f76d68e6b1f472942a6368db4b5d765641) | `███████░░░` | 69 | C+ |
| [gin-gonic/gin](https://github.com/gin-gonic/gin/commit/dcaa4296d111981ffb31ac3eba90bb63e1eb5ab9) | `████░░░░░░` | 39 | F |
| [BurntSushi/ripgrep](https://github.com/BurntSushi/ripgrep/commit/3fce3b5bb0236da2df6d99672afb8a719642eca7) | `███████░░░` | 69 | C+ |

### Large repositories

| Repository | Visual score | Score | Grade |
|---|---|---:|:---:|
| [facebook/react](https://github.com/facebook/react/commit/2dc7da790d6388b95b83198ca9b588b2ad5f5c0b) | `████░░░░░░` | 39 | F |
| [microsoft/TypeScript](https://github.com/microsoft/TypeScript/commit/9a8581c393a38961489cc8409ae4dfbe97fc25ec) | `█████████░` | 91 | A |
| [microsoft/vscode](https://github.com/microsoft/vscode/commit/23f50094841f222bdd0e609fca3d72718048d297) | `████░░░░░░` | 39 | F |
| [vercel/next.js](https://github.com/vercel/next.js/commit/2fe6f962a1982594bdda96a7de16c594677266d2) | `████░░░░░░` | 39 | F |
| [kubernetes/kubernetes](https://github.com/kubernetes/kubernetes/commit/3375cb24a5f4bd42c80777231f7d364553a59e70) | `████░░░░░░` | 39 | F |
| [rust-lang/rust](https://github.com/rust-lang/rust/commit/90850177249efe0321573c569aec5d12b257f8d6) | `██████░░░░` | 59 | C- |

### Benchmark summary

```text
Mean score by size
Small                         ██████░░░░  59.0
Medium                        █████░░░░░  53.3
Large                         █████░░░░░  51.0
Overall                       █████░░░░░  54.6

Score distribution
39  F                         ███████      7 repositories
59  C-                        ██████████  10 repositories
69  C+                        ██           2 repositories
91  A                         █            1 repository
```

The benchmark exposed systematic accuracy gaps as well as strong runtime stability. See the full [benchmark methodology, rule results, and accuracy audit](BENCHMARK.md).

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

See [BENCHMARK.md](BENCHMARK.md) for the complete 20-repository cross-language benchmark and accuracy audit.

## Current MVP limitations

- Dynamic verification executes commands in the current environment; sandbox orchestration is planned.
- Python and generic project discovery are intentionally narrower than Node support.
- GitHub Actions is the only CI provider inspected in the first version.
- The score is a readiness diagnostic, not a guarantee that an agent will produce correct code.

## License

MIT
