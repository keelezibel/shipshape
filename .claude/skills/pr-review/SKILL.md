---
name: pr-review
description: Gate a branch before it becomes a PR - run the full validation pipeline and a structured review checklist. Use before opening any PR, when the user says review this PR, check my changes, or is this ready to merge.
---

# pr-review

Nothing reaches `main` unvalidated. Model: [no-mistakes](https://github.com/kunchenguid/no-mistakes) — a local gate that runs review → test → docs → lint → push → PR → CI, forwarding only when everything is green.

## Preferred path: no-mistakes

```bash
curl -fsSL https://raw.githubusercontent.com/kunchenguid/no-mistakes/main/docs/install.sh | sh   # once
no-mistakes init      # once per repo
git push no-mistakes  # instead of git push origin
```

Findings come back as **auto-fix** (apply) or **ask-user** (escalate to the human — never silently decide).

## Fallback: manual gate (run ALL, in order)

1. **Rebase** on `origin/main`; resolve conflicts locally.
2. **Machine checks** — must be zero-warning clean:
   - TS: `pnpm lint && pnpm format && pnpm typecheck && pnpm test && pnpm build`
   - Python: `uv run ruff format --check . && uv run ruff check . && uv run mypy . && uv run pytest`
   - E2E: `pnpm test:e2e` — feature PRs must include a passing Playwright journey for their P1 acceptance scenario (`e2e-testing`)
3. **Diff self-review** — read the full `git diff origin/main...HEAD`. Run the multi-axis review from `code-review-and-quality` (vendored from Addy Osmani), then check:
   - Scope: does every hunk serve the stated task? Remove drive-by changes.
   - Simplicity: after green, could `code-simplification` shrink this without behavior change? Apply before review, not after merge.
   - Spec: behavior changes trace to a spec (`docs/specs/`) and the spec is updated in the same PR (`spec-driven`).
   - Smells: run the `code-smells` checklist over new/changed code; React diffs also against `react-best-practices`.
   - Contracts: API/MCP changes match `api-design` / `mcp-design`; breaking changes are flagged.
   - Security: no secrets, no injection-prone string building (SQL/shell/HTML), authz checked on new endpoints, user input validated at the boundary.
   - Tests: new behavior has tests that FAIL without the change (`test-driven-development`). No assertions weakened, no tests deleted to go green, none of `testing-anti-patterns.md`.
   - UI changes: `web-design-review` + `a11y-audit` in report mode; critical findings block.
   - Leftovers: no `console.log`/`print` debugging, no commented-out code, no TODOs without an issue link, no `test.only`.
4. **Docs** — README/AGENTS/spec/plan files updated if behavior or commands changed.
5. **PR body** — problem, approach, test evidence (paste the passing output), risk level, rollback note.

## Hard rules

- A red check is a blocker, not a suggestion. Never merge with failing/ skipped CI.
- Never edit lint/type configs to silence an error unless that is the reviewed intent of the PR.
- If the diff exceeds ~400 lines, propose splitting before review, not after.
