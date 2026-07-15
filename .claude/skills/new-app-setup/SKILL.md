---
name: new-app-setup
description: Scaffold a new mobile-first web app (Next.js + TypeScript with pnpm, optional Python FastAPI backend with uv) from this repo's templates with all quality gates wired - lint, unit tests, E2E tests, CI. Use when the user says new app, scaffold, set up the project, or start building.
---

# new-app-setup

Turn this template repo into a working app skeleton. Ask the user for: app name, whether a Python API is needed (default: no — start with Next.js route handlers, add FastAPI when there's a real reason), and database choice if any.

## Steps

1. **Scaffold frontend** into `apps/web/` (pnpm, never npm/yarn):

```bash
corepack enable
pnpm create next-app@latest apps/web --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-pnpm
```

2. **Apply the strict configs** — overwrite generated defaults with this repo's templates:
   - `templates/web-nextjs/tsconfig.json` → `apps/web/tsconfig.json`
   - `templates/web-nextjs/eslint.config.mjs` → `apps/web/eslint.config.mjs`
   - `templates/web-nextjs/.prettierrc.json` → `apps/web/.prettierrc.json`
   - `package.json` scripts: `"typecheck": "tsc --noEmit"`, `"format": "prettier --check ."`, `"test": "vitest run"`, `"test:e2e": "playwright test"`; ensure `"packageManager": "pnpm@<version>"` is set (corepack pins it)
   - `pnpm add -D vitest @testing-library/react @vitejs/plugin-react jsdom zod prettier prettier-plugin-tailwindcss`

3. **E2E testing** (not optional — see `e2e-testing`):
   - `pnpm add -D @playwright/test && pnpm exec playwright install chromium`
   - Copy `templates/e2e/playwright.config.ts` → `apps/web/playwright.config.ts`; create `apps/web/e2e/` with a smoke test (home page renders at mobile viewport, no console errors)

4. **Optional backend** into `apps/api/` (uv, never pip):
   - Copy `templates/api-python/` → `apps/api/`, rename the package
   - `cd apps/api && uv python pin 3.12 && uv sync` (commit `uv.lock` + `.python-version`)
   - Add a `/health` endpoint; uncomment the api `webServer` block in `playwright.config.ts` and the api steps in CI

5. **CI**: copy `templates/ci/ci.yml` → `.github/workflows/ci.yml`. Delete jobs that don't apply; keep `e2e`.

6. **Housekeeping**: update root `README.md` for the new app (keep the workflow section); ensure `.gitignore` covers `node_modules`, `.next`, `__pycache__`, `.venv`, `.env*`, `test-results`, `playwright-report`; ensure `docs/plans/` and `docs/specs/` exist.

7. **Verify every gate is green on the empty skeleton before writing any feature code**:

```bash
cd apps/web && pnpm lint && pnpm typecheck && pnpm test && pnpm build && pnpm test:e2e
cd apps/api && uv run ruff check . && uv run mypy . && uv run pytest   # if backend exists
```

8. Commit as `chore: scaffold <appname> from app-boilerplate` on a branch, PR through the `pr-review` gate.

## Rules

- Do NOT add auth, DB, or state libraries speculatively — scaffold minimal, add per approved plan (`plan-feature`).
- First real feature follows the full lifecycle: `spec-driven` → `plan-feature` → `design-system` (if UI) → `test-driven-development` → `e2e-testing` → `pr-review`. See README "Feature lifecycle".
