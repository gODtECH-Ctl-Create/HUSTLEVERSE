# HUSTLEVERSE

> **A Nigerian life. An unpredictable day. Your choices.**

HUSTLEVERSE is an AI-native life and hustle simulation built around everyday Nigerian situations.

You start with limited resources and a simple goal: make progress.

Then life starts happening.

Transport changes. A client calls. Data finishes. Power goes out. An unexpected opportunity appears. Someone needs money. A deal can be negotiated. A shortcut can save time and create a new problem.

The game is designed around the idea that AI should be part of the experience itself, not a chatbot sitting beside the game.

The first deterministic game engine is now implemented. The current slice can simulate leaving home, reaching the bus stop, negotiating or paying transport to work, and completing a work shift without a database or model provider.

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

## Game engine

The engine follows a strict command pipeline:

```text
PlayerState + WorldState
        ↓
      Command
        ↓
   Preconditions
        ↓
   Deterministic rule
        ↓
    State Delta
        ↓
     Game Event
```

The first slice includes:

- money in naira;
- time from 7:00 AM through the playable day;
- energy;
- home, bus stop, and work locations;
- transport pricing and a negotiation floor;
- a deterministic work reward;
- explicit failure results when a command is invalid, unaffordable, too tiring, or outside the playable day.

Run the current engine checks locally with `npm install`, `npm run check`, and `npm test`.

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
| Repository automation | gODtECH RepoOps + Steward |

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

HUSTLEVERSE consumes the shared **gODtECH RepoOps** GitHub Action.

Repository-specific policy lives in [.repoops.yml](.repoops.yml), while the reusable implementation lives in [gODtECH-Ctl-Create/RepoOps](https://github.com/gODtECH-Ctl-Create/RepoOps).

The current workflow consumes the moving compatible major channel:

```yaml
- uses: gODtECH-Ctl-Create/RepoOps@v0
```

So the RepoOps runtime is not copied into HUSTLEVERSE. Compatible shared releases are picked up when the workflow runs.

HUSTLEVERSE also runs **gODtECH Steward** for deterministic repository hygiene.

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

**Stage:** first playable engine prototype

The repository now contains the deterministic simulation core for the first playable day. The user interface, persistence, and AI layer remain intentionally deferred until the game loop is exercised through real gameplay.

---

### gODtECH FORGE

This project uses a small, project-local operating layer inspired by gODtECH FORGE. It does not bundle the full framework. The project keeps only the context, decisions, orchestration, and skills needed by HUSTLEVERSE.
