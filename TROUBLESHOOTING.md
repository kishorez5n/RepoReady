# Troubleshooting

## The scanner reports a documented command as missing

Repo Ready validates backticked npm, pnpm, Yarn, and Bun commands in agent instruction files against package scripts. Correct the instruction or add the missing script. Commands in general README prose are not treated as agent contracts in the MVP.

## Verify changes the working tree

`verify` compares Git status before and after declared commands. Run those commands manually and inspect generated or formatted files. Either commit deterministic generated artifacts, stop validation from rewriting source files, or exclude disposable output appropriately.

## A rule does not apply to the repository

First select the correct profile in `.repo-ready.json`. If the rule remains intentionally irrelevant, add its stable ID to `ignoreRules`. Ignored rules are shown as skipped and do not affect the score.

## A verification command times out

Increase `timeoutSeconds` in `.repo-ready.json` only after confirming the command is non-interactive. Prefer adding a narrower unit-test or affected-package command rather than allowing an unbounded run.

## The action cannot find built files

The reusable action executes `dist/src/action.js`. Published release tags must contain the compiled `dist` directory produced by `npm run build`.
