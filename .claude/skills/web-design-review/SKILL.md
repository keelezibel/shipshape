---
name: web-design-review
description: Review UI code against Vercel's Web Interface Guidelines - interactions, focus, forms, animation, layout, content, performance. Use when asked to review UI, audit design, check UX, or before merging any UI-heavy PR.
metadata:
  source: https://github.com/vercel-labs/agent-skills (web-design-guidelines pattern, by Vercel)
---

# Web Interface Guidelines review

Reviews UI files against Vercel's continuously-updated Web Interface Guidelines. The guidelines are fetched fresh at review time so they never go stale (pattern borrowed from `vercel-labs/agent-skills`).

## How it works

1. Fetch the latest guidelines:

```
https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md
```

2. Read the target files (component/page paths from the user, or the UI files in the current diff).
3. Check every rule in the fetched guidelines against the code.
4. Output findings in terse `file:line — rule — fix` format, grouped by severity. No praise padding; only violations and their fixes.

## Scope

The fetched guidelines cover: interactions (keyboard, touch targets, focus management, loading states), forms (labels, autocomplete, validation UX), animation (reduced motion, compositor-friendly transforms), layout (safe areas, scroll behavior, zoom), content (contrast, truncation, i18n), and performance (CLS, virtualization, image handling).

## When offline

If the fetch fails, fall back to the `mobile-first-ui` skill's checklist plus `references/` in that skill — but note in the output that the authoritative guideline set was unavailable.

## Complements

- `a11y-audit` — engine-driven WCAG checks on the rendered DOM (this skill is source-level review)
- `react-best-practices` — performance rules for the same files
