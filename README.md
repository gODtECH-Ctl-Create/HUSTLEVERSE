# HUSTLEVERSE

> **A Nigerian life. An unpredictable day. Your choices.**

HUSTLEVERSE is an AI-native life and hustle simulation built around everyday Nigerian situations.

You start with limited resources and a simple goal: make progress.

Then life starts happening.

Transport changes. A client calls. Data finishes. Power goes out. An unexpected opportunity appears. Someone needs money. A deal can be negotiated. A shortcut can save time and create a new problem.

The game is designed around the idea that AI should be part of the experience itself, not a chatbot sitting beside the game.

## Core loop

```text
Situation
   ↓
Think
   ↓
Ask / Talk / Negotiate
   ↓
Choose an action
   ↓
Game engine resolves it
   ↓
Money • Time • Energy • Reputation • Relationships change
   ↓
New situation
```

The long-term direction is a persistent, social simulation where players can build careers, businesses, relationships, teams, and reputations.

## First playable slice

The initial build should stay deliberately small:

- one playable character;
- one city/world slice;
- one in-game day;
- a limited starting budget;
- deterministic movement, money, time, and resource rules;
- a small set of Nigerian scenarios;
- an AI companion for reasoning and conversation;
- a small number of adaptive non-player characters.

The goal is to prove that the loop is fun before adding multiplayer or a large world.

## What makes it different

HUSTLEVERSE is not just a Nigerian-themed game.

The Nigerian context affects the mechanics.

Transport, bargaining, family expectations, electricity, data, work culture, side hustles, opportunities, delays, social networks, and everyday trade-offs can all become systems the player has to navigate.

## AI philosophy

AI is used for interaction, interpretation, and dynamic conversation.

Authoritative game rules remain deterministic.

```text
AI
 ├─ conversation
 ├─ NPC role-play
 ├─ player assistance
 └─ scenario interpretation

Game Engine
 ├─ money
 ├─ time
 ├─ energy
 ├─ inventory
 ├─ progression
 └─ validated outcomes
```

This boundary keeps the game predictable enough to be fair while still allowing conversations and situations to feel alive.

## Planned technology direction

The exact application stack is intentionally not locked yet.

The expected production architecture will likely need:

| Area | Requirement |
| --- | --- |
| Client | Web/mobile-friendly game interface |
| Game engine | Deterministic simulation and action validation |
| Database | Persistent player, world, progression, and content data |
| Authentication | Accounts and sessions |
| AI service | Server-side model gateway for dialogue and NPC behavior |
| Storage | Optional media/assets storage |
| Observability | Errors, gameplay events, AI usage, and abuse monitoring |
| Repository automation | Contributor checks, repository hygiene, and later shared Repo Ops |

### Database

A database is not necessary to prove the first local prototype.

It becomes necessary as soon as HUSTLEVERSE needs accounts, saved games, persistent progression, analytics, shared content, leaderboards, or multiplayer.

Supabase/PostgreSQL is a strong candidate because it can cover authentication, relational persistence, APIs, and later realtime features without forcing the game engine itself to depend on the database for every calculation.

### AI

Model credentials must remain server-side.

The client should call an application endpoint or server action, which then applies the appropriate game context and validates any requested gameplay action.

### Security

Player-visible text, AI output, scenario input, and future user-generated content must be treated as untrusted input.

Do not allow arbitrary AI output to execute code, issue database mutations, grant rewards, or change authoritative state.

## Repository operations

HUSTLEVERSE is being prepared for contributor-driven development.

The initial repository automation uses gODtECH Steward for deterministic repository hygiene. A future shared Repo Ops workflow can be added when the application has stable build/test/version contracts.

See [docs/REPO-OPS.md](docs/REPO-OPS.md).

## Project operating layer

- [AGENTS.md](AGENTS.md) - agent and contributor execution contract
- [AGENT.md](AGENT.md) - compact compatibility pointer
- [.forge/context/project.yaml](.forge/context/project.yaml) - product context
- [.forge/docs/ARCHITECTURE.md](.forge/docs/ARCHITECTURE.md) - architecture direction
- [.forge/orchestrator.md](.forge/orchestrator.md) - minimal Forge-style orchestration
- [.agents/skills/](.agents/skills/) - focused project skills
- [CONTRIBUTING.md](CONTRIBUTING.md) - contribution workflow

## Status

**Stage:** concept and foundation

The repository intentionally starts almost empty. Product rules and architecture are being established before feature code so future contributors can build against a shared model.

---

### gODtECH FORGE

This project uses a small, project-local operating layer inspired by gODtECH FORGE. It does not bundle the full framework. The project keeps only the context, decisions, orchestration, and skills needed by HUSTLEVERSE.
