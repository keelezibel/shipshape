# app-boilerplate

A reusable template repo for building **mobile-friendly web apps** with AI coding agents. Push to GitHub, mark as a *Template repository*, and start every new app from it.

Stack: Next.js + TypeScript (**pnpm**) frontend, optional FastAPI (**uv**) backend. Agent skills live in `.claude/skills/` (auto-loaded by Claude Code, readable by any agent via `AGENTS.md`); strict configs and CI live in `templates/`.

## Feature lifecycle: from idea to `main`

Every feature — backend, frontend, or both — moves through these stages. Skills enforce each gate; nothing skips ahead.

**1. Specify** (`spec-driven`, from GitHub's spec-kit) — turn the idea into `docs/specs/<###-feature>.md`: prioritized user stories (P1 = standalone MVP), Given/When/Then acceptance scenarios, measurable success criteria, edge cases. No tech decisions here. Ambiguities are asked, not guessed. **Gate: user approves the spec.**

**2. Plan** (`plan-feature`) — HOW: files to change, API contract (`api-design` — endpoint shapes, error format, pagination), DB schema, test plan, risks, rollback. Backend and frontend changes are planned together so the contract is agreed before either side is built. **Gate: user approves the plan.**

**3. Design (UI features)** (`design-system`, `mobile-first-ui`) — tokens/type/spacing come from the committed design system in `docs/design-system.md`; new components get a state-spec table first; layouts designed at 375px. Design direction is proposed with options, decided by you.

**4. Branch** (`parallel-agents`) — feature branch off fresh `origin/main`; parallel tasks each get their own worktree (treehouse or `git worktree`).

**5. Build backend** (`test-driven-development` + `python-quality`) — for each endpoint in the contract: failing pytest first (httpx AsyncClient against the app), minimal code in `app/services/` + thin router, refactor. Gate locally: `uv run ruff format --check . && uv run ruff check . && uv run mypy . && uv run pytest`.

**6. Build frontend** (`test-driven-development` + `typescript-quality`, `react-best-practices`, `composition-patterns`) — against the agreed contract (zod-validated at the boundary), Server Components by default: failing Vitest/RTL test first, minimal component, refactor. Gate locally: `pnpm lint && pnpm format && pnpm typecheck && pnpm test && pnpm build`.

**7. Prove the journey** (`e2e-testing`) — one Playwright test per user story, derived from the spec's acceptance scenarios, running frontend + backend together at mobile viewport first: `pnpm test:e2e`. A feature without its P1 journey test is not done.

**8. Simplify & review** (`code-simplification`, then `pr-review` with `code-review-and-quality` + `code-smells`; `security-and-hardening` if the change touches input/auth/storage; UI also `web-design-review` + `a11y-audit`) — reduce complexity while green, full multi-axis diff review, spec updated in the same PR, no weakened tests/configs. Then `git push no-mistakes` (or plain PR); CI re-runs every gate (`.github/workflows/ci.yml`: web, api, e2e jobs).

**9. Merge** — human approves, CI green is a hard precondition, one PR at a time; parallel branches rebase after each merge.

## Skills (24)

| Category | Skills | Source |
|---|---|---|
| Process | `spec-driven` · `plan-feature` · `test-driven-development` (vendored, MIT) · `incremental-implementation` (vendored, MIT) · `parallel-agents` · `pr-review` | [github/spec-kit](https://github.com/github/spec-kit), [obra/superpowers](https://github.com/obra/superpowers), [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills), [kunchenguid](https://github.com/kunchenguid)'s treehouse/no-mistakes/lavish-axi |
| Anti-slop (vendored from Addy Osmani, MIT) | `code-review-and-quality` (multi-axis review) · `code-simplification` (reduce complexity, preserve behavior) · `security-and-hardening` (untrusted input, auth, storage) · `debugging-and-error-recovery` (root-cause, not guessing) · `doubt-driven-development` (adversarial self-review for high-stakes changes) | [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) |
| Testing | `e2e-testing` (Playwright) · `webapp-testing` (vendored, Apache-2.0 — agent-driven browser debugging) | [anthropics/skills](https://github.com/anthropics/skills) |
| React/Next.js | `react-best-practices` (72 rules, vendored MIT) · `composition-patterns` (vendored MIT) · `typescript-quality` (pnpm, strict TS) | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) |
| Design & a11y | `design-system` · `mobile-first-ui` · `web-design-review` · `a11y-audit` | [ui-ux-pro-max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill), [bencium](https://github.com/bencium/bencium-claude-code-design-skill), [vercel web-interface-guidelines](https://github.com/vercel-labs/web-interface-guidelines), [accesslint](https://github.com/accesslint/claude-marketplace) |
| Backend & contracts | `python-quality` (uv, PEP 8, mypy strict) · `api-design` · `mcp-design` | Anthropic mcp-builder guidance |
| Meta | `new-app-setup` · `code-smells` | — |

## Quick start

```bash
git clone <your-new-repo-from-this-template> && cd <repo>
claude
> Use the new-app-setup skill to scaffold a mobile-first web app called "myapp"
```

The scaffold wires pnpm + strict ESLint/tsconfig/Prettier, Vitest, Playwright (mobile-first projects), optionally uv + ruff/mypy/pytest for the API, and CI with web/api/e2e jobs — then verifies every gate is green on the empty skeleton before feature work starts.

Optional power tools (installs in `docs/workflow.md`): [treehouse](https://github.com/kunchenguid/treehouse) (pooled worktrees), [no-mistakes](https://github.com/kunchenguid/no-mistakes) (validation-gated pushes), [lavish-axi](https://github.com/kunchenguid/lavish-axi) (HTML plan artifacts).

## Layout

```
.claude/skills/     # 24 skills (table above)
templates/          # web-nextjs configs, api-python (uv), e2e playwright config, ci.yml
docs/workflow.md    # expanded lifecycle + parallel-crew workflow + source catalog
docs/specs/         # feature specs (spec-driven)
docs/plans/         # implementation plans (plan-feature)
AGENTS.md           # agent operating manual (CLAUDE.md points here)
```

## Attribution

Vendored/adapted: [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) (MIT), [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) (MIT), [obra/superpowers](https://github.com/obra/superpowers) (MIT), [github/spec-kit](https://github.com/github/spec-kit) (MIT), [anthropics/skills](https://github.com/anthropics/skills) (Apache-2.0), [accesslint/claude-marketplace](https://github.com/accesslint/claude-marketplace), [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) (MIT), [bencium/bencium-claude-code-design-skill](https://github.com/bencium/bencium-claude-code-design-skill), [kunchenguid](https://github.com/kunchenguid). License files kept alongside vendored skills.
