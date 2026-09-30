# Skill: Quality

## Purpose

Protect the playable game, AI boundary, and contributor workflow.

## Checks

Run the checks that exist for the current codebase:

- lint;
- type checking;
- tests;
- build;
- security checks;
- accessibility checks for UI;
- visual checks for UI changes.

## Game-specific checks

Test at least:

- money cannot become invalid through normal commands;
- invalid actions do not mutate state;
- AI output cannot bypass command validation;
- AI failure does not destroy the player's session;
- repeated commands do not accidentally duplicate irreversible rewards.

## Contributor checks

- keep changes focused;
- update documentation when architecture changes;
- avoid secrets;
- link material work to an issue;
- use pull requests for shared development.

Do not report a check as passing unless it was actually run.
