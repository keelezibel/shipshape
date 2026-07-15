---
name: code-smells
description: Code smell catalog with refactoring moves, used during self-review and PR review. Use when reviewing a diff, when the user asks to clean up or refactor code, or as part of the pr-review gate.
---

# code-smells

Run this checklist over every diff before PR. Report findings as: smell → location → suggested refactoring. Fix in the same PR only if trivial and in-scope; otherwise file a follow-up.

## Structure

- **Long function** (> ~40 lines or > 3 nesting levels) → Extract Function; use guard clauses/early returns to flatten.
- **Large class/module doing several jobs** → split by responsibility (SRP); a file needing "and" to describe it is two files.
- **Long parameter list** (> 3-4) → introduce a parameter object / options type.
- **Duplicated code** (same logic 3+ places) → extract shared helper. Twice is fine — don't abstract prematurely (rule of three).
- **Feature envy** (function mostly reads another module's data) → move it to that module.
- **Shotgun surgery** (one concept change touches many files) → the concept lacks a home; consolidate.

## Logic

- **Deep conditionals / flag arguments** → polymorphism, lookup tables, or split into two functions.
- **Primitive obsession** (raw strings for ids/status/money) → domain types, enums, discriminated unions.
- **Boolean blindness** (`doThing(true, false)`) → named options.
- **Null cascades** (`a?.b?.c?.d` everywhere) → fix the data shape at the boundary; validate once, trust after.
- **Temporal coupling** (must call `init()` before `run()`) → constructor/factory enforces order.

## Honesty

- **Misleading names** — name says what it does now, not historically. `getUser` must not create users.
- **Dead code / commented-out code** → delete; git remembers.
- **Lying comments** → update or remove; prefer making code self-explanatory over explaining bad code.
- **Swallowed errors** (`except: pass`, empty `catch`) → handle, propagate, or log with context — never silence.
- **Magic numbers/strings** → named constants with the unit in the name (`TIMEOUT_MS`).

## Agent-specific slop (check hardest)

- Defensive over-engineering: try/except around code that can't fail, abstractions with one implementation, config for things that never vary → delete.
- Copy-paste variance: near-identical blocks with subtle drift → unify and parametrize.
- Tests that assert nothing meaningful (snapshot everything, `assert result is not None`) → assert behavior.
- Weakened checks: `# type: ignore`, `eslint-disable`, broadened types added just to pass CI → treat as PR blockers per `pr-review`.
