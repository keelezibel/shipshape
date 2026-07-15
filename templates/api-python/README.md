# api-python template

Copy this directory to `apps/api/` when the app needs a Python backend. **All Python tooling goes through [uv](https://docs.astral.sh/uv/)** — no pip, no manual venvs.

```bash
uv python pin 3.12   # writes .python-version (commit it)
uv sync              # creates .venv from pyproject.toml, writes uv.lock (commit it)
uv run uvicorn app.main:app --reload --port 8000
```

Suggested layout:

```
apps/api/
├── pyproject.toml      # ruff (PEP 8), mypy strict, pytest wired; dev deps in [dependency-groups]
├── uv.lock             # committed, never hand-edited
├── .python-version     # committed
├── app/
│   ├── main.py         # FastAPI app factory (+ /health endpoint for e2e webServer)
│   ├── config.py       # pydantic-settings from env
│   ├── routers/        # one router per resource (see api-design skill)
│   ├── services/       # business logic — handlers stay thin
│   └── models/         # Pydantic I/O models
└── tests/              # mirrors app/ layout; httpx AsyncClient for endpoint tests
```

Gate commands (must pass before every PR — CI runs exactly these):

```bash
uv run ruff format --check . && uv run ruff check . && uv run mypy . && uv run pytest
```
