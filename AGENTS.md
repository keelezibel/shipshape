# Agent Operating Manual

You are working in a repo created from `app-boilerplate`. Follow this manual for every task.

## Non-negotiables

1. **Spec before plan, plan before code.** Features start as a spec (`spec-driven`, `docs/specs/`), then an approved plan (`plan-feature`, `docs/plans/`) for anything touching >2 files, adding a dependency, or changing a schema.
2. **No production code without a failing test first.** The `test-driven-development` skill is law — red, green, refactor. Every user story also gets a Playwright journey (`e2e-testing`); unit tests alone are not done.
3. **Never work directly on `main`.** Feature branches only; parallel tasks get their own worktree (`parallel-agents`).
4. **Every PR passes the gate** (`pr-review`): lint, format, typecheck, unit tests, build, E2E — all green, zero warnings. With `no-mistakes` installed, push via `git push no-mistakes`. Never weaken configs or tests to go green.
5. **One package manager per language**: `pnpm` for TypeScript (npm/yarn banned), `uv` for Python (pip/poetry banned). Lockfiles are committed and never hand-edited.
6. **Design before styling.** UI starts from the committed design system (`design-system` — tokens, type, spacing, component specs; design decisions are asked, not assumed). All UI built at 375px first (`mobile-first-ui`). React code follows the vendored `react-best-practices` (72 Vercel rules) and `composition-patterns`.
7. **UI PRs get design + a11y review**: `web-design-review` and `a11y-audit` in report mode; critical findings block.

8. **Land incrementally, then simplify.** Big changes ship as a sequence of small, individually-green steps (`incremental-implementation`); once green, run `code-simplification` — same behavior, less complexity. Never dump a 1000-line diff in one shot.
9. **Debug by root cause, not by guessing** (`debugging-and-error-recovery`). For high-stakes or unfamiliar code, subject your own conclusion to an adversarial fresh-context review (`doubt-driven-development`) before it stands.
10. **Security is a feature requirement.** Anything touching user input, auth, storage, or third parties goes through `security-and-hardening`.

## Task lifecycle

```
idea → spec (spec-driven) → plan (plan-feature) → approve
     → branch/worktree (parallel-agents) → design tokens if UI (design-system)
     → TDD loop (test-driven-development): failing test → code → refactor
       — landed as small green increments (incremental-implementation)
     → E2E journey per user story (e2e-testing)
     → simplify while green (code-simplification)
     → self-review (code-review-and-quality + code-smells;
       react-best-practices for React diffs; security-and-hardening if untrusted input/auth)
     → full gate (pr-review) → PR (no-mistakes if available) → merge
```

## Commands

Frontend (`apps/web/`):

- `pnpm lint` — ESLint, zero warnings
- `pnpm format` — prettier --check
- `pnpm typecheck` — tsc --noEmit
- `pnpm test` — Vitest unit/component tests
- `pnpm test:e2e` — Playwright journeys (mobile + desktop projects)
- `pnpm build` — must pass before PR

Backend (`apps/api/`):

- `uv sync` — env from lockfile; `uv add <pkg>` / `uv add --dev <pkg>` to change deps
- `uv run ruff format --check . && uv run ruff check .` — format + lint (PEP 8)
- `uv run mypy .` — strict typing
- `uv run pytest` — unit + endpoint tests

## Conventions

- Conventional Commits (`feat:`, `fix:`, `chore:`, `refactor:`, `test:`, `docs:`)
- Small PRs: one logical change, < ~400 lines of diff where possible
- New API endpoints follow `api-design`; new MCP tools follow `mcp-design`
- Specs, plans, docs, and tests update in the same PR as the code they cover

## When unsure

Prefer asking over guessing on: product behavior, design direction, destructive operations, dependency additions, schema changes, and anything auth/payments/PII related.
