---
name: python-quality
description: Python code quality standards - uv for all package management, PEP 8/PEP 20 via ruff, mypy strict, pytest, FastAPI conventions. Use whenever writing or reviewing Python code in this repo.
---

# python-quality

Target: Python 3.12+. Tooling is configured in `templates/api-python/pyproject.toml` — copy it, don't reinvent it.

## Package management: uv only

[uv](https://docs.astral.sh/uv/) is the single tool for Python environments. `pip`, `pip-tools`, `poetry`, `pipenv`, and manual venv activation are banned in this repo.

```bash
uv sync                     # create/update .venv from pyproject.toml + uv.lock (includes dev group)
uv add fastapi              # add a dependency (updates pyproject.toml AND uv.lock)
uv add --dev pytest-mock    # add a dev dependency
uv remove <pkg>             # remove — never hand-edit installed state
uv lock --upgrade           # upgrade within constraints; review the lock diff
uv run <cmd>                # run anything in the project env — no activation needed
uv python pin 3.12          # pin interpreter (.python-version, committed)
```

Rules: `uv.lock` is committed and never hand-edited; dependencies change only via `uv add`/`uv remove` so pyproject and lock stay in sync; CI and all commands go through `uv run` so there's exactly one environment story. One-off tools run via `uvx <tool>`, never installed globally.

## Quality gate (all must pass — CI runs exactly these)

```bash
uv run ruff format --check .   # formatting (Black-compatible, 100-col); fix with: uv run ruff format .
uv run ruff check .            # lint: pycodestyle (PEP 8), pyflakes, isort, bugbear, comprehensions, pyupgrade, simplify
uv run mypy .                  # strict mode
uv run pytest                  # unit + integration tests with coverage
```

## Standards

- **PEP 8 via ruff** — never hand-format. Naming: `snake_case` functions/vars, `PascalCase` classes, `UPPER_SNAKE` constants, `_leading_underscore` private.
- **PEP 20 in practice** — explicit over implicit: no wildcard imports, no mutable default args, no bare `except:`, no magic re-exports.
- **Types everywhere** — full annotations on all public functions; `mypy --strict` clean. `X | None` over `Optional[X]`; an `Any` needs a justifying comment.
- **Data shapes** — Pydantic models at I/O boundaries (requests, responses, config); `dataclass` internally. Never pass raw dicts across module boundaries.
- **Errors** — specific exceptions, small domain hierarchy, never swallowed. `logging`, never `print`.
- **Docstrings** — Google style on public API; explain the why, not the signature.

## FastAPI conventions

- Routers per resource under `app/routers/`; business logic in `app/services/` — handlers stay thin (parse → call service → shape response).
- `response_model` on every route; DI via `Depends` for DB sessions/auth; settings via `pydantic-settings` from env.
- Async by default; no blocking calls in async handlers (async clients or thread offload).

## Tests (pytest)

- Plain `assert`; fixtures over setup methods; `parametrize` over copy-paste; tests mirror source layout (`tests/test_<module>.py`).
- Failing test FIRST — the full discipline lives in `test-driven-development`; the anti-pattern list there (`testing-anti-patterns.md`) applies to Python too.
- Mock at boundaries only (HTTP, DB, clock) — never your own internals.
- API endpoints get httpx `AsyncClient` integration tests against the app with a seeded test DB; user-journey coverage happens in `e2e-testing`.
