---
name: mcp-design
description: MCP server design standards - tool naming, input schemas, error handling, response design. Use when building or reviewing an MCP server or adding tools to one.
---

# mcp-design

Based on Anthropic's [mcp-builder](https://github.com/anthropics/skills) guidance. Tools are an interface for a *model*, not a thin wrapper over your API — design for the agent's workflow.

## Tool design

- **One tool = one task the agent thinks in.** Prefer `schedule_meeting` over exposing `list_rooms` + `check_availability` + `create_event` and hoping the agent chains them. Fewer, higher-level tools beat many granular ones.
- Names: `snake_case`, verb_noun (`search_orders`, `create_invoice`), unambiguous across the whole server; consistent prefixes for families (`orders_search`, `orders_get`) when the server is large.
- Descriptions are prompts: state what the tool does, when to use it (and when NOT to), parameter semantics, and what it returns. Include an example call for anything non-obvious.

## Schemas

- Strict JSON Schema for every input: types, `enum`s for closed sets, defaults, min/max, `required` kept minimal — optional params with sensible defaults reduce agent errors.
- Flat over nested params where possible; agents fumble deep nesting.
- Validate server-side anyway (Pydantic / zod) — the schema is documentation, validation is enforcement.

## Responses

- Return what the agent needs to CONTINUE, not a full DB dump: concise, structured, token-frugal. Support a `detail` or `fields` param when both summary and full views are needed.
- Paginate large results (`nextCursor`) and say so in the tool description.
- Errors must teach: `"date must be YYYY-MM-DD, got '15/07/2026'"` beats `"invalid input"`. Return actionable errors as tool results (`isError: true`) so the agent can self-correct; reserve protocol errors for transport failures.

## Server conduct

- Idempotent reads; destructive tools clearly named (`delete_`, `_permanently`) and described so hosts can gate confirmation on them.
- No secrets in tool descriptions or outputs; auth via env/config, never parameters.
- Timeouts on all upstream calls; never hang the host.
- Log tool name + duration + outcome for every call.

## Testing

Write an eval set before shipping: 10-20 realistic natural-language tasks, verify the agent picks the right tool with the right args. If the agent misuses a tool, fix the description/schema — not the agent.
