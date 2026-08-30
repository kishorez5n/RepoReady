# Contributing

## Setup

Install the pinned Node and npm versions, then run `npm install`.

## Validation

Run `npm run verify`. This performs strict type checking and the complete test suite. Run `npm run scan` to dogfood the readiness rules against this repository.

## Adding a rule

Every rule must provide:

- A stable `RR-<CATEGORY>-<NUMBER>` identifier.
- A category, severity, and bounded deduction.
- Concrete, inspectable evidence when it fails.
- A remediation that a maintainer can act on.
- A fixture and test covering pass and failure behavior.
- An applicability decision for documentation-only and unsupported repository profiles.

Avoid checks based only on filenames when executable evidence is practical. Do not use model judgment in the deterministic score.

## Pull requests

Keep changes focused. Explain scoring changes and call out any changed grade cap. Do not include credentials, generated reports, or private repository data.
