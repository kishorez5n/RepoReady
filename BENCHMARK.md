# Repo Ready: 20-Repository Benchmark

Benchmark date: 2026-08-30  
Repo Ready commit: [`5a0de72`](https://github.com/kishorez5n/RepoReady/commit/5a0de72c0105784663f8805396d9bd0324b64ba6)  
Scanner version: `0.1.0`

## Executive summary

Repo Ready was run against 20 well-known public repositories: 7 small, 7 medium, and 6 large projects spanning JavaScript, TypeScript, Python, Go, and Rust.

- All 20 scans completed successfully with exit code `0`.
- No scanner crashed, including repositories with more than 60,000 tracked files.
- Representative mean scan time was 288 ms; the range was 152-1,040 ms.
- The mean final score was 54.6/100; the mean raw score before caps was 68.8/100.
- Nineteen of 20 scores landed exactly on a hard cap: 7 at 39, 10 at 59, and 2 at 69.
- TypeScript was the only uncapped repository, scoring 91/100 (A).

The execution engine is fast and stable, but this corpus exposed systematic scoring false positives, incomplete large-repository scans, and missing ecosystem support. The current score should be treated as alpha-quality until the accuracy findings in this report are addressed.

## Visual overview

Each block below represents approximately 10 score points.

```text
SMALL REPOSITORIES
p-limit                       ██████░░░░  59  C-
yocto-queue                   ██████░░░░  59  C-
ansi-regex                    ██████░░░░  59  C-
is-buffer                     ██████░░░░  59  C-
is-number                     ██████░░░░  59  C-
slash                         ██████░░░░  59  C-
escape-string-regexp          ██████░░░░  59  C-

MEDIUM REPOSITORIES
Express                       ██████░░░░  59  C-
Axios                         ████░░░░░░  39  F
Flask                         ████░░░░░░  39  F
Fastify                       ██████░░░░  59  C-
GitHub CLI                    ███████░░░  69  C+
Gin                           ████░░░░░░  39  F
ripgrep                       ███████░░░  69  C+

LARGE REPOSITORIES
React                         ████░░░░░░  39  F
TypeScript                    █████████░  91  A
VS Code                       ████░░░░░░  39  F
Next.js                       ████░░░░░░  39  F
Kubernetes                    ████░░░░░░  39  F
Rust                          ██████░░░░  59  C-
```

### Mean score by repository size

```text
Small                         ██████░░░░  59.0
Medium                        █████░░░░░  53.3
Large                         █████░░░░░  51.0
Overall                       █████░░░░░  54.6
```

### Score distribution

Each block in this chart represents one repository.

```text
39  F                         ███████      7 repositories
59  C-                        ██████████  10 repositories
69  C+                        ██           2 repositories
91  A                         █            1 repository
```

### Effect of hard score caps

```text
                              Raw score           Final score         Change
Small                         ██████░░░░  63.9  →  ██████░░░░  59.0    -4.9
Medium                        ███████░░░  69.3  →  █████░░░░░  53.3   -16.0
Large                         ███████░░░  73.8  →  █████░░░░░  51.0   -22.8
Overall                       ███████░░░  68.8  →  █████░░░░░  54.6   -14.2
```

The visual concentration at 39, 59, and 69 shows that critical rule caps dominate the final result. The effect grows with repository size because large repositories are more likely to contain test fixtures, nested manifests, and more files than the scanner's current traversal limit.

## Methodology

Each target was cloned from its default branch using a shallow, single-branch clone:

```powershell
git -c core.longpaths=true clone --depth 1 --single-branch --filter=blob:none <repository-url> <temporary-directory>
```

Each repository was scanned without repository-specific Repo Ready configuration:

```powershell
node dist/src/cli.js scan <repository-directory> --format json
```

Runtime values are representative wall-clock measurements from a warm local filesystem. They are useful for identifying order-of-magnitude regressions, but they are not a controlled performance benchmark.

The `Tracked files` column comes from `git ls-files`. `Raw` is the weighted score before critical score caps. `P/F/S` means passed, failed, and skipped rule counts.

## Complete results

| Size | Repository snapshot | Branch | Tracked files | Detected profile | Runtime | Raw | Cap | Final | Grade | P/F/S |
|---|---|---|---:|---|---:|---:|---:|---:|---|---:|
| Small | [sindresorhus/p-limit](https://github.com/sindresorhus/p-limit/commit/df476048d023ff868cd45b35ee47f5fb0ca2b25a) | `main` | 16 | Node | 152 ms | 64 | 59 | 59 | C- | 11/11/1 |
| Small | [sindresorhus/yocto-queue](https://github.com/sindresorhus/yocto-queue/commit/b07eac099753833b29d06c614149904445739776) | `main` | 13 | Node | 163 ms | 64 | 59 | 59 | C- | 11/11/1 |
| Small | [chalk/ansi-regex](https://github.com/chalk/ansi-regex/commit/7cf0228990eb38c27f9897f4fb17d42d39075a20) | `main` | 16 | Node | 181 ms | 64 | 59 | 59 | C- | 11/11/1 |
| Small | [feross/is-buffer](https://github.com/feross/is-buffer/commit/ec4bf3415108e8971375e6717ad63dde752faebf) | `master` | 10 | Node | 156 ms | 68 | 59 | 59 | C- | 10/11/2 |
| Small | [jonschlinkert/is-number](https://github.com/jonschlinkert/is-number/commit/98e8ff1da1a89f93d1397a24d7413ed15421c139) | `master` | 15 | Node | 159 ms | 59 | 59 | 59 | C- | 9/12/2 |
| Small | [sindresorhus/slash](https://github.com/sindresorhus/slash/commit/98b618f5a3bfcb5dd374b204868818845b87bb2f) | `main` | 14 | Node | 171 ms | 64 | 59 | 59 | C- | 11/11/1 |
| Small | [sindresorhus/escape-string-regexp](https://github.com/sindresorhus/escape-string-regexp/commit/cbc42403142c96923b482604e1f3d627b1956aff) | `main` | 13 | Node | 164 ms | 64 | 59 | 59 | C- | 11/11/1 |
| Medium | [expressjs/express](https://github.com/expressjs/express/commit/023767fe9872e029271df1418f73401bff20ff40) | `master` | 213 | Node | 183 ms | 74 | 59 | 59 | C- | 13/9/1 |
| Medium | [axios/axios](https://github.com/axios/axios/commit/fede1d1562e308077da7994305d63fb7722b66ac) | `v1.x` | 466 | Node | 171 ms | 75 | 39 | 39 | F | 14/8/1 |
| Medium | [pallets/flask](https://github.com/pallets/flask/commit/d318b683471101618febed18996405ad26462110) | `main` | 236 | Python | 171 ms | 56 | 39 | 39 | F | 8/13/2 |
| Medium | [fastify/fastify](https://github.com/fastify/fastify/commit/1beaf7e72d24b2fc63a02a7f5806772a00e45454) | `main` | 394 | Node | 225 ms | 75 | 59 | 59 | C- | 14/8/1 |
| Medium | [cli/cli](https://github.com/cli/cli/commit/40b742f76d68e6b1f472942a6368db4b5d765641) | `trunk` | 1,380 | Generic | 226 ms | 77 | 69 | 69 | C+ | 11/8/4 |
| Medium | [gin-gonic/gin](https://github.com/gin-gonic/gin/commit/dcaa4296d111981ffb31ac3eba90bb63e1eb5ab9) | `master` | 130 | Generic | 167 ms | 55 | 39 | 39 | F | 8/11/4 |
| Medium | [BurntSushi/ripgrep](https://github.com/BurntSushi/ripgrep/commit/3fce3b5bb0236da2df6d99672afb8a719642eca7) | `master` | 237 | Generic | 176 ms | 73 | 69 | 69 | C+ | 10/9/4 |
| Large | [facebook/react](https://github.com/facebook/react/commit/2dc7da790d6388b95b83198ca9b588b2ad5f5c0b) | `main` | 7,205 | Monorepo | 295 ms | 77 | 39 | 39 | F | 16/7/0 |
| Large | [microsoft/TypeScript](https://github.com/microsoft/TypeScript/commit/9a8581c393a38961489cc8409ae4dfbe97fc25ec) | `main` | 65,918 | Monorepo | 322 ms | 91 | - | 91 | A | 19/4/0 |
| Large | [microsoft/vscode](https://github.com/microsoft/vscode/commit/23f50094841f222bdd0e609fca3d72718048d297) | `main` | 18,387 | Node | 639 ms | 72 | 39 | 39 | F | 13/9/1 |
| Large | [vercel/next.js](https://github.com/vercel/next.js/commit/2fe6f962a1982594bdda96a7de16c594677266d2) | `canary` | 31,812 | Monorepo | 1,040 ms | 73 | 39 | 39 | F | 15/8/0 |
| Large | [kubernetes/kubernetes](https://github.com/kubernetes/kubernetes/commit/3375cb24a5f4bd42c80777231f7d364553a59e70) | `master` | 31,279 | Generic | 548 ms | 63 | 39 | 39 | F | 8/10/5 |
| Large | [rust-lang/rust](https://github.com/rust-lang/rust/commit/90850177249efe0321573c569aec5d12b257f8d6) | `main` | 62,494 | Node | 447 ms | 67 | 59 | 59 | C- | 12/10/1 |

### Results by size band

| Band | Repositories | Mean score | Minimum | Maximum | Representative mean runtime |
|---|---:|---:|---:|---:|---:|
| Small | 7 | 59.0 | 59 | 59 | 164 ms |
| Medium | 7 | 53.3 | 39 | 69 | 188 ms |
| Large | 6 | 51.0 | 39 | 91 | 549 ms |
| Overall | 20 | 54.6 | 39 | 91 | 288 ms |

### Score-cap distribution

| Effective cap | Repositories |
|---:|---:|
| 39 | 7 |
| 59 | 10 |
| 69 | 2 |
| No cap | 1 |

## Failed rules by repository

- **sindresorhus/p-limit:** `RR-ENV-002`, `RR-ENV-003`, `RR-CMD-001`, `RR-CMD-003`, `RR-VAL-001`, `RR-CTX-001`, `RR-CTX-002`, `RR-SAFE-001`, `RR-SAFE-003`, `RR-ISO-001`, `RR-OBS-002`
- **sindresorhus/yocto-queue:** `RR-ENV-002`, `RR-ENV-003`, `RR-CMD-001`, `RR-CMD-003`, `RR-VAL-001`, `RR-CTX-001`, `RR-CTX-002`, `RR-SAFE-001`, `RR-SAFE-003`, `RR-ISO-001`, `RR-OBS-002`
- **chalk/ansi-regex:** `RR-ENV-002`, `RR-ENV-003`, `RR-CMD-001`, `RR-CMD-003`, `RR-VAL-001`, `RR-CTX-001`, `RR-CTX-002`, `RR-SAFE-001`, `RR-SAFE-003`, `RR-ISO-001`, `RR-OBS-002`
- **feross/is-buffer:** `RR-ENV-002`, `RR-ENV-003`, `RR-CMD-001`, `RR-CMD-003`, `RR-VAL-002`, `RR-CTX-001`, `RR-CTX-002`, `RR-SAFE-001`, `RR-SAFE-003`, `RR-ISO-001`, `RR-OBS-002`
- **jonschlinkert/is-number:** `RR-ENV-002`, `RR-ENV-003`, `RR-CMD-001`, `RR-CMD-003`, `RR-VAL-001`, `RR-VAL-002`, `RR-CTX-001`, `RR-CTX-002`, `RR-SAFE-001`, `RR-SAFE-003`, `RR-ISO-001`, `RR-OBS-002`
- **sindresorhus/slash:** `RR-ENV-002`, `RR-ENV-003`, `RR-CMD-001`, `RR-CMD-003`, `RR-VAL-001`, `RR-CTX-001`, `RR-CTX-002`, `RR-SAFE-001`, `RR-SAFE-003`, `RR-ISO-001`, `RR-OBS-002`
- **sindresorhus/escape-string-regexp:** `RR-ENV-002`, `RR-ENV-003`, `RR-CMD-001`, `RR-CMD-003`, `RR-VAL-001`, `RR-CTX-001`, `RR-CTX-002`, `RR-SAFE-001`, `RR-SAFE-003`, `RR-ISO-001`, `RR-OBS-002`
- **expressjs/express:** `RR-ENV-002`, `RR-ENV-003`, `RR-CMD-001`, `RR-CMD-003`, `RR-CTX-001`, `RR-CTX-002`, `RR-SAFE-001`, `RR-SAFE-003`, `RR-OBS-002`
- **axios/axios:** `RR-ENV-001`, `RR-ENV-003`, `RR-CMD-003`, `RR-CTX-003`, `RR-CTX-004`, `RR-SAFE-002`, `RR-SAFE-003`, `RR-OBS-002`
- **pallets/flask:** `RR-ENV-004`, `RR-CMD-001`, `RR-CMD-002`, `RR-CMD-003`, `RR-VAL-003`, `RR-CTX-001`, `RR-CTX-002`, `RR-SAFE-001`, `RR-SAFE-002`, `RR-SAFE-003`, `RR-FBK-001`, `RR-ISO-001`, `RR-OBS-002`
- **fastify/fastify:** `RR-ENV-001`, `RR-ENV-002`, `RR-ENV-003`, `RR-CMD-001`, `RR-CMD-003`, `RR-CTX-001`, `RR-SAFE-003`, `RR-OBS-002`
- **cli/cli:** `RR-CMD-001`, `RR-CMD-002`, `RR-CMD-003`, `RR-SAFE-001`, `RR-SAFE-003`, `RR-FBK-001`, `RR-ISO-001`, `RR-OBS-002`
- **gin-gonic/gin:** `RR-CMD-001`, `RR-CMD-002`, `RR-CMD-003`, `RR-VAL-001`, `RR-CTX-001`, `RR-SAFE-001`, `RR-SAFE-002`, `RR-SAFE-003`, `RR-FBK-001`, `RR-ISO-001`, `RR-OBS-002`
- **BurntSushi/ripgrep:** `RR-CMD-001`, `RR-CMD-002`, `RR-CMD-003`, `RR-CTX-001`, `RR-SAFE-001`, `RR-SAFE-003`, `RR-FBK-001`, `RR-ISO-001`, `RR-OBS-002`
- **facebook/react:** `RR-ENV-004`, `RR-CMD-003`, `RR-SAFE-001`, `RR-SAFE-002`, `RR-SAFE-003`, `RR-FBK-002`, `RR-OBS-002`
- **microsoft/TypeScript:** `RR-CMD-003`, `RR-SAFE-003`, `RR-FBK-002`, `RR-OBS-002`
- **microsoft/vscode:** `RR-ENV-003`, `RR-ENV-004`, `RR-CMD-003`, `RR-CTX-003`, `RR-CTX-004`, `RR-SAFE-001`, `RR-SAFE-002`, `RR-SAFE-003`, `RR-ISO-001`
- **vercel/next.js:** `RR-ENV-004`, `RR-CMD-003`, `RR-CTX-003`, `RR-CTX-004`, `RR-SAFE-001`, `RR-SAFE-002`, `RR-SAFE-003`, `RR-FBK-002`
- **kubernetes/kubernetes:** `RR-CMD-001`, `RR-CMD-002`, `RR-CMD-003`, `RR-VAL-002`, `RR-SAFE-001`, `RR-SAFE-002`, `RR-SAFE-003`, `RR-FBK-001`, `RR-ISO-001`, `RR-OBS-002`
- **rust-lang/rust:** `RR-ENV-001`, `RR-ENV-002`, `RR-ENV-003`, `RR-CMD-001`, `RR-CMD-002`, `RR-CMD-003`, `RR-SAFE-001`, `RR-SAFE-003`, `RR-FBK-001`, `RR-ISO-001`

## Failure frequency

| Rule | Repositories failing | Share of corpus |
|---|---:|---:|
| `RR-CMD-003` | 20 | 100% |
| `RR-SAFE-003` | 20 | 100% |
| `RR-OBS-002` | 17 | 85% |
| `RR-SAFE-001` | 17 | 85% |
| `RR-CMD-001` | 15 | 75% |
| `RR-ISO-001` | 14 | 70% |
| `RR-CTX-001` | 12 | 60% |
| `RR-ENV-003` | 12 | 60% |
| `RR-ENV-002` | 10 | 50% |
| `RR-CTX-002` | 9 | 45% |
| `RR-SAFE-002` | 7 | 35% |
| `RR-VAL-001` | 7 | 35% |
| `RR-CMD-002` | 6 | 30% |
| `RR-FBK-001` | 6 | 30% |
| `RR-ENV-004` | 4 | 20% |
| `RR-CTX-003` | 3 | 15% |
| `RR-CTX-004` | 3 | 15% |
| `RR-ENV-001` | 3 | 15% |
| `RR-FBK-002` | 3 | 15% |
| `RR-VAL-002` | 3 | 15% |
| `RR-VAL-003` | 1 | 5% |

## Accuracy findings

### 1. Test discovery false negatives

`RR-VAL-001` reported that no tests were present in seven repositories even though the repositories contain conventional tests:

| Repository | Test evidence missed by the scanner |
|---|---|
| sindresorhus/p-limit | Root `test.js`; `npm test` runs `xo && ava && tsd` |
| sindresorhus/yocto-queue | Root `test.js`; `npm test` runs `ava && tsd` |
| chalk/ansi-regex | Root `test.js`; `npm test` runs `xo && ava && tsd` |
| jonschlinkert/is-number | Root `test.js`; `npm test` runs `mocha` |
| sindresorhus/slash | Root `test.js`; `npm test` runs `xo && ava && tsd` |
| sindresorhus/escape-string-regexp | Root `test.js`; `npm test` runs `xo && ava && tsd` |
| gin-gonic/gin | Root and nested Go files matching `*_test.go` |

Cause: the current filename expression recognizes test directories and names such as `*.test.*`, but not root `test.js`, Python `test_*.py`, or Go `*_test.go` conventions.

### 2. Test fixtures classified as exposed secrets

`RR-SAFE-002` applied a critical cap of 39 to seven repositories. Across them, 106 files were flagged by filename; 105 were inside test, testdata, fixture, example, or equivalent paths.

| Repository | Flagged | Fixture/example paths | Representative evidence |
|---|---:|---:|---|
| axios/axios | 2 | 2 | `tests/unit/adapters/cert.pem`, `tests/unit/adapters/key.pem` |
| pallets/flask | 1 | 1 | `tests/test_apps/.env` |
| gin-gonic/gin | 2 | 2 | `testdata/certificate/cert.pem`, `testdata/certificate/key.pem` |
| facebook/react | 2 | 2 | `fixtures/fiber-debugger/.env`, `fixtures/nesting/.env` |
| microsoft/vscode | 1 | 1 | `extensions/copilot/test/simulation/fixtures/.../.env` |
| vercel/next.js | 27 | 26 | Example `.env` files and localhost test certificates |
| kubernetes/kubernetes | 71 | 71 | PKI and authentication testdata keys/certificates |

Cause: the rule relies on sensitive-looking filenames without considering path context, content classification, test-only provenance, or known-safe fixture patterns.

### 3. Silent 20,000-file scan limit

The walker stops after 20,000 discovered files but the report does not say that the scan was incomplete.

| Repository | Tracked files | Files discovered by Repo Ready | Coverage status |
|---|---:|---:|---|
| microsoft/TypeScript | 65,918 | 20,000 | Truncated |
| vercel/next.js | 31,812 | 20,000 | Truncated |
| kubernetes/kubernetes | 31,279 | 20,000 | Truncated |
| rust-lang/rust | 62,494 | 20,000 | Truncated |

The file traversal sorts only after reaching the limit. Since filesystem enumeration order is not a cross-platform contract, two machines can inspect different subsets of the same repository. This conflicts with the deterministic-scoring goal.

### 4. Missing Go, Rust, Makefile, and broader Python command discovery

The command catalog currently contains only root `package.json` scripts and explicit `.repo-ready.json` commands. This causes false command failures for repositories that use ecosystem-native entry points:

- GitHub CLI, Gin, and Kubernetes use Go tooling and Make targets.
- ripgrep and Rust use Cargo and repository-specific bootstrap commands.
- Flask uses Python tooling declared through `pyproject.toml`, lock metadata, and CI.
- Rust is classified as Node because an auxiliary root `package.json` exists, even though `Cargo.toml` and `Cargo.lock` define the primary project.

### 5. Scoped and built-in commands treated as stale

`RR-CTX-003` produced false failures in three repositories:

- Axios documents `npm pack`, which is a built-in npm command rather than a package script.
- Next.js discusses `pnpm dlx`, which is a built-in pnpm command rather than a package script.
- VS Code documents `npm run typecheck` from `build/` and test commands under `extensions/copilot/`; those scripts exist in the corresponding nested `package.json` files but were compared only with the root manifest.

### 6. Rules measuring Repo Ready adoption rather than existing readiness

Every repository failed both of these rules:

- `RR-CMD-003` recognizes only scripts named `verify`, `validate`, `agent:verify`, or `ci` as a unified verification path.
- `RR-SAFE-003` requires `protectedPaths` in Repo Ready's own configuration.

Repositories may already express the same intent through `test`, Make targets, task runners, scoped instructions, CODEOWNERS, ownership files, or contribution documentation. Requiring Repo Ready-specific configuration makes the initial score partly self-referential.

### 7. Additional narrow heuristics

- `RR-SAFE-001` penalized 17 repositories for not ignoring `.env`, even when the project had no evidence that local environment files were required.
- `RR-OBS-002` penalized 17 repositories unless a dedicated file named `TROUBLESHOOTING.md`, `DEBUGGING.md`, or `KNOWN_ISSUES.md` existed; equivalent README or documentation sections were not recognized.
- `RR-CMD-001` penalized small JavaScript packages that intentionally ship source directly and require no build step.
- GitHub Actions is the only CI provider inspected, so repositories using other CI systems may receive `RR-VAL-002` or `RR-VAL-003` deductions.

## Recommended remediation order

### P0: correctness and trust

1. Make traversal deterministic and disclose incomplete coverage in every report.
2. Expand test discovery for root `test.*`, Python `test_*.py`, Go `*_test.go`, Rust test conventions, and declared test commands.
3. Split secret findings into confirmed, suspicious, and fixture/example evidence. Do not apply a critical cap based only on a filename under test data.
4. Add regression fixtures based on every false positive found in this benchmark.

### P1: ecosystem and monorepository support

1. Add Go, Rust, Makefile, task-runner, and stronger Python discovery.
2. Determine the primary profile using multiple root signals instead of letting any root `package.json` dominate.
3. Resolve instructions relative to their directory and validate commands against the nearest manifest.
4. Recognize built-in package-manager commands such as `npm pack` and `pnpm dlx`.

### P2: scoring calibration

1. Convert self-referential configuration requirements into evidence that can also be satisfied by existing repository conventions.
2. Reconsider hard caps when confidence is low or evidence is contextual.
3. Recognize troubleshooting and validation guidance embedded in existing documentation.
4. Distinguish “no build required” from “build command missing.”

## Re-test acceptance criteria

The same pinned corpus should be rerun after remediation. A corrected build should meet all of the following:

- 20/20 scans complete without crashes.
- No silent file truncation; coverage is complete or explicitly reported.
- All seven known test suites are detected.
- Test fixtures do not trigger critical secret caps without corroborating evidence.
- Go and Rust repositories receive ecosystem-aware profiles and commands.
- Built-in and directory-scoped commands are not reported as stale.
- Scores are not concentrated at hard-cap boundaries because of known false positives.
- Repeated scans of the same commit produce identical rule results and scores.

## Interpretation

These scores measure the behavior of Repo Ready `0.1.0`, not the intrinsic quality of the sampled projects. The benchmark is intentionally useful as a calibration and regression corpus: each surprising result points to a rule, discovery path, or scoring assumption that can be made more evidence-aware.
