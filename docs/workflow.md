# End-to-end workflow

How a feature moves from idea to `main`. The README's "Feature lifecycle" section is the canonical 9-step version; summary:

## Single task (default)

1. **Specify** — `spec-driven`: prioritized, independently-testable user stories + Given/When/Then acceptance scenarios in `docs/specs/`. Approved before planning.
2. **Plan** — `plan-feature`: files, API contract (`api-design`), schema, test plan in `docs/plans/`. Approved before code. (Optionally rendered via [lavish-axi](https://github.com/kunchenguid/lavish-axi).)
3. **Design first for UI work** — `design-system`: tokens/type/spacing decided WITH the user; `mobile-first-ui` governs layout at 375px first.
4. **Branch** — off fresh `origin/main`, or a [treehouse](https://github.com/kunchenguid/treehouse) worktree.
5. **Implement via TDD** — `test-driven-development` (red → green → refactor, no production code without a failing test). Standards: `typescript-quality` (pnpm) + `react-best-practices` + `composition-patterns` (frontend), `python-quality` (uv) (backend).
6. **Prove journeys** — `e2e-testing`: one Playwright test per user story from the spec's acceptance scenarios, mobile viewport first, frontend + backend together.
7. **Gate** — `pr-review`: machine checks (lint, format, typecheck, unit, build, E2E), `code-smells`, spec updated; UI adds `web-design-review` + `a11y-audit`. With [no-mistakes](https://github.com/kunchenguid/no-mistakes) installed, `git push no-mistakes` runs the pipeline automatically.
8. **Merge** — human approves; green CI is a hard precondition.

## Parallel tasks

`parallel-agents`: one worktree per task (treehouse pool or plain `git worktree`), written brief per task, disjoint file boundaries, one PR merged at a time with rebases in between. Investigation tasks produce reports, never pushes.

## Tool installs (once per machine)

```bash
# treehouse — pooled worktrees
curl -fsSL https://kunchenguid.github.io/treehouse/install.sh | sh

# no-mistakes — validation-gated pushes
curl -fsSL https://raw.githubusercontent.com/kunchenguid/no-mistakes/main/docs/install.sh | sh
# then per repo:
no-mistakes init
```

## Sources worth mining for more skills

- [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) — six anti-slop skills vendored here; the remaining 18 (performance-optimization, observability-and-instrumentation, ci-cd-and-automation, deprecation-and-migration, documentation-and-adrs...) are worth mining as the app matures
- [obra/superpowers](https://github.com/obra/superpowers) — TDD skill vendored here; also brainstorming, systematic-debugging, verification-before-completion
- [github/spec-kit](https://github.com/github/spec-kit) — full SDD framework (`uvx --from git+https://github.com/github/spec-kit.git specify init`); spec template vendored here

- [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) — react-best-practices, composition-patterns (vendored here), plus vercel-optimize, react-view-transitions, deploy-to-vercel
- [vercel-labs/web-interface-guidelines](https://github.com/vercel-labs/web-interface-guidelines) — the living UI guideline set `web-design-review` fetches
- [accesslint/claude-marketplace](https://github.com/accesslint/claude-marketplace) — install the plugin for engine-driven a11y scan/audit/diff skills
- [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) — 84 UI styles, design-system generator CLI
- [bencium/bencium-claude-code-design-skill](https://github.com/bencium/bencium-claude-code-design-skill) — UX designer skills with responsive/accessibility/motion references
- [anthropics/skills](https://github.com/anthropics/skills) — official spec + mcp-builder, webapp-testing, frontend-design
- [hesreallyhim/awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code), [ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills) — curated catalogs
