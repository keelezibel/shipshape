---
name: design-system
description: Establish design tokens, typography, color, and component specs BEFORE building UI, with a collaborative decision protocol. Use when starting UI work on a new app, when the user mentions design system, tokens, theme, brand, colors, or fonts, or when UI is drifting inconsistent.
metadata:
  sources: >
    Token architecture from nextlevelbuilder/ui-ux-pro-max-skill (MIT);
    decision protocol and anti-generic guidance from bencium/bencium-claude-code-design-skill
---

# design-system

No ad-hoc styling. UI work starts from a small, explicit design system committed to the repo.

## Decision protocol (from Bencium's UX designer skill)

**Ask before deciding.** Colors, type choices, spacing scale, and overall style direction are the user's calls:

1. Propose 2-3 directions with concrete trade-offs (mood, audience fit, a11y implications).
2. User picks; record the decision in `docs/design-system.md`.
3. Never unilaterally restyle existing UI — that's a plan-worthy change (`plan-feature`).

**Avoid the AI-generic look.** Default-avoid: generic SaaS blue (#3B82F6 on white), glassmorphism/liquid-glass, Apple-clone minimalism, gratuitous gradients, Inter-for-everything. Prefer: a distinctive color pair, one characterful display face + one workhorse text face, and restraint (typography and spacing do the work before decoration does).

## Token architecture (from ui-ux-pro-max, three layers)

Define as CSS variables in `globals.css` (and mirror in Tailwind theme config). Components consume ONLY semantic/component tokens — never primitives, never raw hex:

```css
/* 1. Primitive — raw values, no opinions */
--blue-600: #2563eb;  --gray-50: #f9fafb;  --space-4: 1rem;

/* 2. Semantic — purpose aliases (theme switching happens here) */
--color-primary: var(--blue-600);
--color-surface: var(--gray-50);
--color-danger: ...;  --color-text-muted: ...;

/* 3. Component — component-specific hooks */
--button-bg: var(--color-primary);
--card-padding: var(--space-4);
```

Dark mode = redefining layer 2 under `[data-theme="dark"]`. If a component needs a raw value, it's missing a token — add the token.

## Minimum viable system (define before the first screen)

- **Color**: primary, secondary, surface ×2, text ×2 (primary/muted), semantic (success/warning/danger/info). Every text/surface pair ≥ 4.5:1 contrast — verify, don't eyeball.
- **Type scale**: 1 display + 1 text family (`next/font`); modular scale (e.g. 1.25 ratio): 14/16/20/25/31/39px; line-height 1.5 body, 1.2 headings; 16px minimum on mobile inputs.
- **Spacing**: 4px base grid — 4/8/12/16/24/32/48/64. No off-grid values.
- **Radii & elevation**: pick ONE radius scale (e.g. 4/8/16) and ≤ 3 shadow levels; apply everywhere.
- **Motion**: 150-250ms ease-out for micro-interactions; anything moving respects `prefers-reduced-motion`; animate only `transform`/`opacity`.
- **States**: every interactive component specs default / hover / active / focus-visible / disabled / loading — as a table in `docs/design-system.md` (spec template in `references/component-spec.md`).

## Enforcement

- `docs/design-system.md` is the single source of truth; PRs introducing raw hex values, off-scale spacing, or new fonts fail `pr-review`.
- When reviewing UI code, grep for hex literals and arbitrary Tailwind values (`p-[13px]`) — each is a finding.
