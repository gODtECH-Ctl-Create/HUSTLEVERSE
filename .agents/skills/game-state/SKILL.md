# Skill: Game State

## Purpose

Keep HUSTLEVERSE simulation state explicit, testable, and reproducible.

## Rules

- Use explicit commands and results for state changes.
- Keep money and resource calculations deterministic.
- Never rely on model output for balances or arithmetic.
- Prefer immutable-style state transitions or explicit state deltas.
- Validate preconditions before applying a command.
- Make important events observable and replayable.
- Persist snapshots only after the local game model is correct.
- Keep the database out of pure game-rule functions where possible.

## Minimum concepts

```text
State -> Command -> Validation -> Resolution -> Delta -> Event
```

A change to authoritative state should have a reason that can be traced to a validated command.
