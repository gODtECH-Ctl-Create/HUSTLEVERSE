# Repository Operations

HUSTLEVERSE is intended to become a contributor-friendly project, so repository operations are part of the design from the beginning.

## Current layer

The repository starts with gODtECH Steward for deterministic repository hygiene on pushes and pull requests.

This provides a small, low-risk baseline while the application is still empty.

## Later Repo Ops layer

When the application has stable:

- dependency installation;
- lint/test/build commands;
- release/version metadata;
- ownership rules;
- contributor checks;

HUSTLEVERSE can be connected to the shared Repo Ops automation.

The expected model is:

```text
Contributor PR
   ↓
CI + Steward
   ↓
Project validation
   ↓
Repo Ops policy checks
   ↓
Review
   ↓
Merge
```

Repo Ops should automate repeatable repository work, not make product decisions.

## Important separation

Game logic and repository automation are independent.

A repository automation failure must not change player data or game state.

## Version updates

The previously discussed reusable automatic-version workflow should be attached only after the repository has a real package/release contract. Doing it now would create versioning policy before there is anything meaningful to version.

## Contributor growth

As external contributors arrive, add:

- contribution labels;
- issue templates;
- pull request template;
- CODEOWNERS where ownership becomes clear;
- required status checks;
- release automation;
- dependency and security update policy.

Keep the contributor surface simple until the community actually needs more structure.
