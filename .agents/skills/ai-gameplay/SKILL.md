# Skill: AI Gameplay

## Purpose

Use AI to make HUSTLEVERSE conversations and non-player characters feel alive without letting the model control the game economy.

## Rules

- Keep API keys and provider credentials server-side.
- Send only the game context needed for the current interaction.
- Prefer structured output over free-form state mutations.
- Treat model output as untrusted.
- Validate every proposed action with the game engine.
- Never let model output grant money, items, progression, or permissions directly.
- Provide a deterministic fallback when the model is unavailable.
- Log enough information to debug AI behavior without storing unnecessary private player content.

## Preferred contract

```text
player_input
  -> AI interpretation
  -> proposed action intent
  -> schema validation
  -> game-rule validation
  -> deterministic state change
```

The AI can decide what an NPC might say. The engine decides what actually happens.
