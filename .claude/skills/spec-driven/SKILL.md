---
name: spec-driven
description: Spec-driven development - turn a feature idea into a testable specification with prioritized, independently-shippable user stories BEFORE planning or coding. Use at the start of any feature, when the user describes what they want to build, or mentions spec, requirements, PRD, or acceptance criteria.
metadata:
  source: https://github.com/github/spec-kit (MIT) - templates and SDD methodology by GitHub
---

# spec-driven

The spec is the source of truth; code is its expression. Methodology and template from GitHub's [spec-kit](https://github.com/github/spec-kit). Order is strict: **spec → plan (`plan-feature`) → tests (`test-driven-development`) → code**.

## Write the spec

Write to `docs/specs/<###-feature-name>.md` using `references/spec-template.md`. Rules that make specs work:

- **Focus on WHAT and WHY, never HOW.** No tech stack, no API shapes, no schema in the spec — that's the plan's job. If you catch yourself writing "use Redis", stop.
- **Prioritized user stories (P1, P2, P3...), each independently testable.** P1 alone must be a viable MVP. Each story is a slice that can be developed, tested, and demonstrated on its own — this is what makes stories dispatchable as parallel tasks (`parallel-agents`).
- **Acceptance scenarios as Given/When/Then.** These become the E2E tests (`e2e-testing`) almost verbatim — write them concretely enough that a test can be generated from each.
- **Mark every ambiguity** with `[NEEDS CLARIFICATION: question]` rather than guessing. Resolve them with the user before the spec is approved. An unresolved marker blocks planning.
- **Edge cases are part of the spec**: empty states, errors, permission-denied, offline, slow network, concurrent edits.
- **Success criteria must be measurable** ("user completes checkout in ≤ 3 steps", not "checkout is easy").

## Spec review gate

Before moving to `plan-feature`, verify: no implementation details leaked in; every requirement is testable; stories are truly independent; no `[NEEDS CLARIFICATION]` remains; out-of-scope section exists.

## Living spec

The spec evolves with reality: bugs found in production become new acceptance scenarios; changed requirements update the spec FIRST, then plan, then code. A PR that changes behavior without touching its spec is incomplete (`pr-review` checks this).

## Full framework

For the complete SDD toolchain (constitution, `/specify`, `/plan`, `/tasks` commands): `uvx --from git+https://github.com/github/spec-kit.git specify init`.
