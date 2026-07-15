---
name: a11y-audit
description: Find and fix WCAG 2.2 accessibility issues in the running app - live-DOM audits via the AccessLint engine, prioritized reports, and an audit-fix-verify loop. Use for "is this accessible", "a11y audit", "check accessibility", or before merging UI changes.
metadata:
  source: https://github.com/accesslint/claude-marketplace (audit/scan skills, by AccessLint)
---

# a11y-audit

Audit the rendered DOM, not just the source — many WCAG failures (contrast, computed names, focus order) only exist in the live page. Workflow adapted from AccessLint's marketplace skills.

## Two modes — pick from the user's intent

- **Report mode** — "audit this", "what's wrong": audit + write a prioritized report. Do NOT edit files.
- **Fix mode** — "fix the a11y issues", "make this accessible": audit → edit → re-audit to verify. Loop until clean or only NEEDS-HUMAN items remain.

If unsure, ask. Never default to fixing when only an audit was requested.

## Live audit (preferred)

With the dev server running:

```bash
PORT=$(npx -y @accesslint/chrome@latest ensure | node -e 'process.stdin.on("data",d=>process.stdout.write(""+JSON.parse(d).port))')
npx -y @accesslint/cli@latest scan http://localhost:3000 --port "$PORT" --format json
# scope: --selector "main" ; async content: --wait-for "[data-loaded]"
npx -y @accesslint/chrome@latest stop --all   # teardown
```

Never hardcode port 9222 — `ensure` decides. If the CLI can't run (no Chrome, sandboxed env), fall back to a source-level review using `references/wcag-checklist.md` and say so in the report.

## Reporting rules (what makes a report useful)

- **Deduplicate by pattern, not instance.** One `<IconButton>` missing a name is one finding, even if it renders 40 times. Group by rule × component family.
- **Prioritize by user impact**: critical (blocks access) → serious → moderate → minor.
- **Ground every finding**: selector + `file:line` where known — never fabricate locations.
- Each finding: where → evidence (e.g. "contrast 2.7:1, needs 4.5:1") → fix (mechanical change, or `NEEDS HUMAN` for judgment calls).
- If a single audit returns 50+ violations, stop and report the top patterns instead of a wall of noise.
- The engine catches what's mechanically detectable. Flag for human review (don't guess): screen-reader announcement quality, keyboard flow coherence, content clarity, focus order sense.

## Fix mode loop

1. Audit → 2. apply mechanical fixes (names, labels, roles, contrast tokens, alt text) → 3. re-audit the same scope → 4. repeat; escalate NEEDS-HUMAN items with options rather than deciding design trade-offs unilaterally.

## Gate integration

UI-touching PRs run this in report mode as part of `pr-review`. Critical/serious findings are merge blockers.
