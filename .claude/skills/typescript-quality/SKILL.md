---
name: typescript-quality
description: TypeScript/Next.js code quality standards - strict tsconfig, typescript-eslint, Prettier, Vercel deployment conventions. Use whenever writing or reviewing TypeScript, React, or Next.js code.
---

# typescript-quality

Configs live in `templates/web-nextjs/` — copy them, don't reinvent.

## Package management: pnpm only

`npm` and `yarn` are banned in this repo. Enable via corepack so the version is pinned in `package.json` (`"packageManager": "pnpm@<version>"`):

```bash
corepack enable && corepack use pnpm@latest   # once per machine / setup
pnpm install                    # from lockfile
pnpm add <pkg>                  # dependency (updates package.json + pnpm-lock.yaml)
pnpm add -D <pkg>               # dev dependency
pnpm dlx <tool>                 # one-off tools (equivalent of npx)
```

`pnpm-lock.yaml` is committed and never hand-edited. CI uses `pnpm install --frozen-lockfile`. pnpm's strict node_modules also surfaces phantom dependencies — if an import fails that worked under npm, add the missing direct dependency; don't hoist.

## Quality gate (all must pass — CI runs exactly these)

```bash
pnpm lint           # ESLint flat config: next/core-web-vitals + typescript-eslint strict, --max-warnings 0
pnpm format         # prettier --check .
pnpm typecheck      # tsc --noEmit against strict tsconfig
pnpm test           # Vitest + React Testing Library (unit/component)
pnpm build          # next build must succeed
pnpm test:e2e       # Playwright user journeys (see e2e-testing skill)
```

## TypeScript standards

- **Strict everything**: `strict`, `noUncheckedIndexedAccess`, `noImplicitOverride`, `exactOptionalPropertyTypes`. Never weaken tsconfig to fix an error.
- `any` is banned (`@typescript-eslint/no-explicit-any`); use `unknown` + narrowing. `as` casts need a comment; `@ts-ignore` is banned (`@ts-expect-error` with reason only).
- Prefer `type` for shapes, discriminated unions for state (`{ status: "loading" } | { status: "error"; error: Error } | ...`) — make illegal states unrepresentable.
- Validate ALL external data (API responses, forms, env vars, route params) with zod at the boundary; types flow from schemas (`z.infer`).
- No default exports except where Next.js requires them (pages/layouts/routes).

## React/Next.js conventions

- App Router. Server Components by default; add `"use client"` only when the component needs state/effects/browser APIs — and push it to the leaves.
- Data fetching on the server (RSC or route handlers); mutations via Server Actions or `app/api/*` route handlers validated with zod.
- Component files: `PascalCase.tsx`, one exported component per file; colocate small helpers, extract to `lib/` when reused.
- State: server state via query/cache (or RSC), local UI state via `useState`; never mirror server data into local state.
- No `useEffect` for data fetching or derived state — derive during render, fetch on the server.

## Vercel conventions

- Env vars via `process.env` typed and validated in `lib/env.ts` (zod); client-exposed vars must be prefixed `NEXT_PUBLIC_` and treated as public.
- `next/image` for images, `next/font` for fonts; no layout-shifting media.
- Route handlers stateless; no writes to local filesystem at runtime; long work goes to background jobs, not request handlers.
- Keep serverless bundles lean: no heavyweight deps in edge/serverless routes; check `next build` output sizes.

## Tests

- **Unit/component (Vitest + React Testing Library)**: test behavior through the accessible interface — `getByRole`/`getByLabelText`, user-event interactions, assert visible outcomes. Never assert implementation details (state values, internal calls, snapshots-of-everything).
- Failing test FIRST — full discipline in `test-driven-development`; its `testing-anti-patterns.md` applies.
- Colocate as `Component.test.tsx`; pure logic in `lib/` gets plain unit tests.
- **User journeys are Playwright's job** (`e2e-testing`) — don't simulate full flows in jsdom.

## Formatting

Prettier owns style (config in template). No manual formatting debates; `prettier --check .` runs in CI.
