---
name: api-design
description: REST API design standards - resources, versioning, error shapes, pagination, auth. Use when creating or changing any HTTP endpoint, in FastAPI or Next.js route handlers.
---

# api-design

Contract first: define the endpoint shape in the plan (`plan-feature`) before implementing.

## Resources & methods

- Nouns, plural, kebab-case: `/api/v1/user-profiles/{id}` — never verbs (`/getUser`) or actions in paths; actions that don't map to CRUD become sub-resources (`POST /orders/{id}/cancellation`).
- Methods carry the semantics: GET (safe, cacheable), POST (create/process), PUT (full replace), PATCH (partial), DELETE. GET/PUT/DELETE must be idempotent.
- Version in the path from day one: `/api/v1/...`. Breaking changes (removing/renaming fields, changing types/status codes) require `v2` or an additive alternative — never mutate a published contract.

## Requests & responses

- JSON bodies, `camelCase` fields, ISO 8601 UTC timestamps, IDs as strings.
- Validate every input at the boundary (Pydantic / zod). Reject unknown critical fields; never trust client-supplied identity (user id comes from the auth token, not the body).
- Success: return the resource (POST → 201 + body + `Location`), 204 for no-content deletes.
- Error shape — one format everywhere:

```json
{ "error": { "code": "VALIDATION_ERROR", "message": "human-readable", "details": [{"field": "email", "issue": "invalid format"}] } }
```

- Status codes honestly: 400 validation, 401 unauthenticated, 403 unauthorized, 404 missing (also for resources the caller may not know exist), 409 conflict, 422 semantic errors, 429 rate-limited, 500 never with internal details leaked.

## Collections

- Pagination is mandatory on every list endpoint from v1: cursor-based preferred — `?limit=50&cursor=...` returning `{ "items": [...], "nextCursor": "..." }`.
- Filtering/sorting via query params (`?status=active&sort=-createdAt`); document defaults and maximums.

## Cross-cutting

- Auth on every endpoint by default; public endpoints are the explicit exception. Authorization checked per-resource (object-level), not just per-route.
- Rate limiting and request size limits at the edge; timeouts on all downstream calls.
- Log request id + outcome, never bodies containing PII/secrets.
- Every endpoint ships with: schema validation, at least one success + one failure test, and OpenAPI docs (FastAPI generates it — keep summaries/descriptions filled in).
