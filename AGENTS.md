# HUSTLEVERSE Agent Contract

HUSTLEVERSE is an AI-native Nigerian life and hustle simulation. Agents working in this repository must protect the game concept, keep the simulation deterministic where it should be deterministic, and avoid adding complexity before the playable core exists.

## First principles

- Understand the player outcome before changing code.
- Inspect the repository and relevant project context before implementation.
- Prefer the smallest robust solution that proves the game loop.
- Separate deterministic game rules from AI-generated conversation and flavor.
- Never let an AI response directly mutate authoritative game state without validated game actions.
- Treat money, inventory, progression, identity, and rewards as server-authoritative once persistence exists.
- Avoid invented production claims, APIs, assets, providers, or gameplay systems.
- Keep Nigerian cultural details authentic, respectful, and understandable without requiring slang knowledge.
- Challenge scope that does not improve the current playable slice.

## Project operating layer

The repository uses a small Forge-inspired operating layer:

- `.forge/context/` stores verified product and architecture context.
- `.forge/decisions/` stores material architectural decisions.
- `.forge/docs/` stores durable project guidance.
- `.agents/skills/` stores focused agent skills.
- `.forge/orchestrator.md` defines how those skills are selected.

Read only the relevant material for the task. Do not recreate the entire FORGE framework inside this project.

## AI and game-state rules

The AI layer may:
- generate dialogue and scenario text;
- help the player reason about a situation;
- role-play non-player characters;
- propose possible actions through a constrained interface.

The AI layer must not:
- invent balances that bypass game rules;
- write directly to authoritative player state;
- reveal hidden scenario state;
- expose secrets or model credentials;
- become a substitute for deterministic game logic.

A preferred flow is:

Player input -> AI interpretation -> validated action intent -> game engine -> state change -> event/result.

## Before implementation

1. Read `.forge/context/project.yaml`.
2. Read `.forge/docs/ARCHITECTURE.md` for system work.
3. Read the relevant skill in `.agents/skills/`.
4. Inspect the current repository structure and dependencies.
5. Check existing decisions before introducing a new architectural pattern.
6. Create or update a decision record when a choice materially affects persistence, AI, multiplayer, security, or contributor workflow.

## Git and contributor workflow

- Use a dedicated branch for meaningful work.
- Keep pull requests focused.
- Do not force-push shared branches.
- Do not commit secrets, local environment files, generated credentials, or player data.
- Run the repository checks that exist before opening a pull request.
- Use issue-linked work for material feature changes.
- Do not describe planned features as shipped features.

## Verification

As the project gains code, evaluate the applicable checks:

- lint
- type checking
- unit tests
- production build
- game-state invariants
- AI boundary/security checks
- accessibility for user-facing interfaces
- responsive behavior for web interfaces
- visual verification for interface changes

If a check cannot run, record the reason rather than implying it passed.

## Communication

Report:
- what changed;
- what was verified;
- what remains uncertain;
- important trade-offs;
- blockers or intentionally deferred work.

Be direct. HUSTLEVERSE should become a better game, not merely a larger codebase.


## gODtECH Cockpit State Synchronization

This repository participates in the gODtECH Cockpit project graph.

After meaningful development work, reconcile the repository with `.godtech/project.yml`. Update its state, priority, current focus, next step, blockers, status note, and last-worked date only when the evidence supports a change.

Do not fabricate progress. Do not replace this repository's existing Forge/project state model; `.godtech/project.yml` is the compact Cockpit-facing snapshot.
