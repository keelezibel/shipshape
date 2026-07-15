---
name: mobile-first-ui
description: Mobile-first responsive web UI standards - breakpoints, touch targets, performance budgets, accessibility. Use whenever building or reviewing UI components, pages, or styles.
---

# mobile-first-ui

This repo builds mobile-first web apps. The phone view IS the design; desktop is the enhancement.

For concrete adaptation patterns (component mobile→desktop mappings, fluid type with `clamp()`, container queries, responsive images, viewport gotchas), read `references/responsive-patterns.md`. Pair with `design-system` (tokens before styling) and `web-design-review` / `a11y-audit` (gates before merge).

## Process

- Build and verify every screen at **375px width first** (iPhone-class), then adapt upward. Never design at desktop and squeeze down.
- Base styles are mobile; media queries only widen: `min-width` queries exclusively (Tailwind's default `sm: md: lg:` model). A `max-width` query is a smell.
- Breakpoints: 640 / 768 / 1024 / 1280 (Tailwind defaults). Don't invent custom ones without cause.

## Touch & layout

- Touch targets ≥ 44×44px with ≥ 8px spacing between adjacent targets.
- Primary actions within thumb reach (bottom half of viewport); prefer bottom nav/sheet patterns over top menus for core actions.
- No hover-only affordances — every interaction must work with tap. Hover is enhancement.
- Respect safe areas (`env(safe-area-inset-*)`) and use `dvh` not `vh` for full-height layouts (mobile URL bar).
- Inputs: correct `type`/`inputmode`/`autocomplete` so mobile keyboards match the field; font-size ≥ 16px on inputs to prevent iOS zoom.

## Performance budget (mobile 4G, mid-range device)

- LCP < 2.5s, INP < 200ms, CLS < 0.1 — check with Lighthouse mobile preset before PR on UI-heavy changes.
- Initial JS < ~200KB gzipped: Server Components by default, dynamic-import heavy client components, no moment/lodash-style monoliths.
- `next/image` with correct `sizes`; explicit dimensions on all media (no CLS); `next/font` with `display: swap`.

## Accessibility (non-negotiable subset)

- Semantic HTML first (`button`, `nav`, `main`, `label`); ARIA only when semantics can't express it.
- Contrast ≥ 4.5:1 for text; visible focus states; keyboard-operable everything.
- One `h1` per page, logical heading order; alt text on informative images.
- Respect `prefers-reduced-motion`.

## Verification

Before PR on any UI change: test at 375px and 1280px, keyboard-only pass, Lighthouse mobile run. Screenshot evidence in the PR body.
