# 0001: Keep the first release deterministic-first

## Status

Accepted

## Decision

HUSTLEVERSE will separate the deterministic game engine from the AI interaction layer.

The game engine owns authoritative state and rules such as money, time, inventory, movement, rewards, progression, and resource changes.

AI may interpret player input, generate dialogue, role-play non-player characters, and propose constrained action intents. AI output must pass schema and game-rule validation before it can affect authoritative state.

## Why

This allows HUSTLEVERSE to feel dynamic without making outcomes arbitrary or impossible to test.

It also creates a clean path from a local prototype to persistent multiplayer later.

## Consequences

- Game rules can be unit tested without a model provider.
- AI providers can change without rewriting the simulation.
- AI outages should degrade conversation quality, not corrupt game state.
- Future multiplayer synchronization can operate on validated commands and state deltas.
