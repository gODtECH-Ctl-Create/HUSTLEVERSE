# HUSTLEVERSE Architecture

## 1. Architectural goal

Build a simulation that feels unpredictable to the player while remaining deterministic and testable underneath.

The player should experience:

- changing circumstances;
- conversation;
- negotiation;
- resource pressure;
- meaningful trade-offs;
- consequences.

The engine should still be able to explain exactly why a state changed.

## 2. Logical layers

```text
Client
  │
  ├── player input
  ├── game UI
  └── AI conversation UI
  │
Application / Server
  │
  ├── session
  ├── AI gateway
  ├── action validation
  └── game commands
  │
Game Engine
  │
  ├── clock
  ├── economy
  ├── movement
  ├── relationships
  ├── inventory
  └── progression
  │
Persistence
  │
  ├── player profiles
  ├── saves
  ├── content
  ├── telemetry
  └── social state
```

The first prototype may collapse these layers into a single application. The boundaries should still exist conceptually so they can be separated later.

## 3. Deterministic game state

Authoritative state should be represented with explicit types.

Minimum future state:

```text
PlayerState
├── identity
├── location
├── money
├── energy
├── time
├── skills
├── reputation
├── relationships
└── inventory

WorldState
├── date/time
├── location state
├── active events
├── prices
├── transport conditions
└── available opportunities
```

A gameplay action should look conceptually like:

```text
GameCommand
  -> validate(command, state)
  -> resolve(command, state)
  -> StateDelta
  -> persist(delta)
  -> event/result
```

Keeping state changes as explicit deltas makes testing, replay, debugging, and future multiplayer safer.

## 4. AI boundary

AI belongs around the game engine, not inside authoritative rules.

Good AI responsibilities:

- natural-language conversation;
- NPC dialogue;
- scenario narration;
- translating player intent into a proposed game command;
- contextual hints;
- controlled personality.

Bad AI responsibilities:

- deciding the player's new balance directly;
- writing arbitrary database updates;
- granting unvalidated rewards;
- changing hidden rules;
- generating executable content.

Preferred flow:

```text
Player:
"Guy, I have 3000 naira and I need reach Victoria Island before 9."

        ↓

AI:
Interprets intent + available context

        ↓

Action Intent:
TRAVEL { destination: victoria_island, mode: ??? }

        ↓

Game Engine:
Checks money, time, transport, conditions

        ↓

State Delta:
time -X
money -Y
location -> destination

        ↓

Result:
"Your route worked, but traffic cost you 18 minutes."
```

## 5. Persistence

A relational database is the expected production choice.

Likely entities:

- users;
- player_profiles;
- game_sessions;
- player_state_snapshots;
- game_events;
- locations;
- items;
- scenarios;
- scenario_variants;
- non_player_characters;
- relationships;
- opportunities;
- transactions;
- telemetry_events.

Do not create all tables on day one.

For the first persisted slice, start with:

- users/auth;
- player_profiles;
- game_sessions;
- player_state_snapshots;
- scenarios.

## 6. Supabase/PostgreSQL role

Supabase is a candidate infrastructure layer, not the game engine.

Use it for:

- authentication;
- persistence;
- content management;
- APIs;
- row-level security;
- later realtime features;
- optional object storage.

Keep simulation calculations in application code so the game can be tested without a live database.

## 7. AI infrastructure

The production AI path should include:

- one server-side AI gateway;
- provider abstraction;
- request validation;
- contextual prompt assembly;
- output schema validation;
- rate limiting;
- usage logging;
- fallback behavior when AI is unavailable.

The game must remain playable when the AI provider fails.

AI should enhance interaction, not become a single point of failure for the core loop.

## 8. Multiplayer later

Multiplayer should be treated as a second architectural phase.

Do not design every prototype system around multiplayer.

When multiplayer arrives, authoritative game commands can move toward:

```text
Client
  -> command
Authoritative server
  -> validate
  -> resolve
  -> broadcast
  -> persist
```

Realtime synchronization can then be added without making AI responsible for conflict resolution.

## 9. Content system

Nigerian scenarios should become data rather than hard-coded UI strings.

A scenario can eventually contain:

```text
Scenario
├── trigger
├── location
├── preconditions
├── initial_state
├── actors
├── available_actions
├── consequences
├── dialogue_context
└── variants
```

This lets designers add situations without rewriting the engine.

## 10. Non-functional requirements

The system should eventually support:

- low-latency core interactions;
- graceful AI failure;
- secure secrets;
- abuse/rate-limit controls;
- auditable state changes;
- deterministic tests for economic rules;
- accessible UI;
- mobile-friendly interaction;
- observability for errors and AI costs.

## 11. Deferred decisions

Not yet locked:

- final client framework;
- 2D vs 3D presentation;
- exact AI provider;
- single-player vs multiplayer launch model;
- final city/world scope;
- monetization;
- production hosting topology.

These should be decided from the needs of the first playable slice, not from technology preference alone.
