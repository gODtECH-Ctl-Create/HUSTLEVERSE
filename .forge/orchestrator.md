# HUSTLEVERSE Forge Orchestrator

This is the project's minimal orchestration layer.

It is intentionally smaller than the full gODtECH FORGE framework.

## Routing model

```text
Request
  │
  ├─ Product/game rules? -> game-design
  ├─ Player/NPC AI?      -> ai-gameplay
  ├─ State/persistence?  -> game-state
  ├─ Tests/security?     -> quality
  └─ Git/PR/repository?  -> quality + repository workflow
```

## Execution order

For material work:

1. Inspect repository and project context.
2. Select only the relevant skill(s).
3. Decide whether a new architecture decision is required.
4. Implement the smallest useful change.
5. Verify deterministic rules first.
6. Verify AI boundaries second.
7. Verify the interface and build.
8. Update context/docs when repository reality changes.

## Non-negotiable boundary

AI suggestions are not authoritative game actions.

Every AI-derived action must pass through a deterministic validator before changing state.

## Skill catalog

- `game-design` - gameplay loops, scenarios, balancing boundaries, Nigerian context.
- `ai-gameplay` - AI/NPC behavior and safe model integration.
- `game-state` - state models, commands, persistence, invariants.
- `quality` - verification, security, accessibility, and delivery checks.

Add another skill only when a recurring class of work cannot be handled cleanly by the existing skills.
