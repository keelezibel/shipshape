---
name: plan-feature
description: Produce an approved implementation plan before writing code. Use for any task touching more than 2 files, adding a dependency, changing a schema, or when the user asks to plan, design, or scope a feature.
---

# plan-feature

Plan first, code second. A rejected plan costs minutes; a rejected implementation costs hours.

## Output

Write the plan to `docs/plans/<yyyy-mm-dd>-<slug>.md`. If [lavish-axi](https://github.com/kunchenguid/lavish-axi) is available, also render it as an HTML artifact for richer review. The plan must contain:

1. **Problem** — one paragraph: what user-visible outcome this delivers and why now.
2. **Approach** — chosen design plus at least one alternative considered and why it was rejected.
3. **Changes** — table of files to create/modify with one-line intent each.
4. **Contracts** — new/changed API endpoints (per `api-design`), DB schema, or MCP tools (per `mcp-design`). Exact shapes, not prose.
5. **Test plan** — which failing tests get written first; what manual verification remains.
6. **Risks & rollback** — what could break, how to revert.
7. **Out of scope** — explicit non-goals to prevent scope creep.

## Rules

- Read the relevant existing code BEFORE writing the plan. Never plan against imagined code.
- Size the plan to the task: a 3-file change needs half a page, not five.
- If the plan reveals the task should be split, propose separate tasks — each one small enough for a single PR (< ~400 line diff).
- Stop and get explicit approval before implementing. Plan approval is the gate.
- When implementing, if reality diverges from the plan, update the plan file in the same PR — the plan is documentation, not decoration.
