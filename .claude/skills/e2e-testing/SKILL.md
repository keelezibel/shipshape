---
name: e2e-testing
description: End-to-end testing with Playwright - user-journey tests derived from spec acceptance scenarios, run against the real app (frontend + backend together). Use when writing E2E tests, testing user flows, before merging features, or when the user mentions Playwright, integration, or end-to-end testing.
metadata:
  related: webapp-testing skill (Anthropic, Apache-2.0) for agent-driven interactive browser debugging
---

# e2e-testing

Unit tests prove functions work; E2E tests prove the FEATURE works. Every user story ships with at least one E2E test covering its main acceptance scenario, derived from the spec's Given/When/Then (`spec-driven`).

## Setup (once per app, part of new-app-setup)

```bash
cd apps/web && pnpm create playwright   # or: pnpm add -D @playwright/test && pnpm exec playwright install
```

Use `templates/e2e/playwright.config.ts` — it runs a **mobile viewport project first** (Pixel 7) plus desktop Chromium, starts the dev servers via `webServer`, and enables trace-on-retry.

## What to test at E2E level (and what not)

- **Test**: the critical user journeys — one happy path + the highest-risk failure path per user story. Signup, checkout, create/edit/delete of the core entity, auth-gated access.
- **Don't test**: every permutation (that's unit/component territory), pixel styling, third-party internals. The pyramid holds: many unit, some integration, few meaningful E2E. A 40-minute flaky suite is worse than 8 sharp journeys.
- E2E tests hit the real backend (local FastAPI/route handlers with a seeded test DB) — mock only true third parties (payments, email) at the network edge.

## Writing tests that don't flake

- **User-facing locators only**: `getByRole`, `getByLabel`, `getByText`; `getByTestId` as last resort. Never CSS/XPath chains — they break on refactor and don't verify accessibility. (A page you can't select by role is failing `a11y-audit` too.)
- **Web-first assertions, zero sleeps**: `await expect(locator).toBeVisible()` auto-waits. `waitForTimeout` is banned; wait for state, not time.
- **Independent tests**: each test seeds its own data (API call or fixture), owns its state, and can run in isolation and in parallel. Auth via a saved `storageState` fixture, not logging in through the UI in every test.
- **Test through the UI, assert on outcomes**: after "create item", assert the item is visible in the list (user-visible outcome), not that a POST happened.
- One `test.describe` per user story, named after it: `describe('P1: guest checkout', ...)`.

## Running

```bash
pnpm exec playwright test                    # full suite (CI mode)
pnpm exec playwright test --ui               # interactive development
pnpm exec playwright test --project=mobile   # mobile viewport only
pnpm exec playwright show-report             # failure triage; traces attached on retry
```

## Gate integration

- CI runs the E2E suite on every PR (see `templates/ci/ci.yml` e2e job); red E2E blocks merge like any other check.
- A feature PR without an E2E test for its P1 scenario fails `pr-review`.
- For exploratory/interactive browser debugging (not test authoring), use the vendored `webapp-testing` skill.
