# Repository instructions

Repo Ready is a dependency-light TypeScript CLI. Preserve its deterministic, evidence-backed scoring model.

## Required validation

Run `npm run verify` before completing a change. Use `npm run scan` to inspect this repository's own readiness report.

## Boundaries

- Do not add an LLM dependency to the core score. Advisory AI analysis must remain separate and explicitly labeled.
- Every failed rule must include a stable rule ID, inspectable evidence, a remediation, and a bounded deduction.
- A critical safety or reproducibility failure must not be hidden by unrelated passing checks; use a score cap.
- `scan` must remain read-only. `verify` may execute declared validation commands but must never install dependencies automatically.
- Keep runtime dependencies at zero unless a concrete requirement justifies changing that constraint.
- Treat GitHub workflow files, the action manifest, scoring logic, and rule definitions as sensitive review areas.

## Code style

Use strict TypeScript, Node built-ins, explicit types at public boundaries, and provider-neutral terminology. Add or update a fixture for every behavior-changing rule.
