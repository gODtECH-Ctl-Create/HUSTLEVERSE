# Repository Operations

HUSTLEVERSE consumes the reusable **gODtECH RepoOps** GitHub Action.

This is different from gODtECH Steward:

- **RepoOps** handles repository collaboration operations such as issue claiming, contributor guidance, assignment lifecycle, and post-merge follow-up.
- **Steward** performs deterministic repository hygiene checks.

## Current setup

HUSTLEVERSE keeps only the repository-specific policy in:

- [.repoops.yml](../.repoops.yml)
- [.github/workflows/repoops.yml](../.github/workflows/repoops.yml)

The implementation stays in the shared repository:

gODtECH-Ctl-Create/RepoOps

The consumer repository therefore does not copy the RepoOps runtime.

## Reusable action

The current workflow consumes the stable major channel:

```yaml
- uses: gODtECH-Ctl-Create/RepoOps@v0
```

The shared project documents that `@v0` is a moving compatibility channel, while exact release tags can be pinned when tighter control is required.

## Contributor flow

```text
Issue marked ready
      ↓
Contributor comments /claim
      ↓
RepoOps validates the claim
      ↓
Assignment + in-progress state
      ↓
Contributor opens PR
      ↓
PR merges
      ↓
RepoOps handles linked-issue follow-up
```

This is useful for HUSTLEVERSE once contributors begin working on the game.

## Local policy

HUSTLEVERSE controls the behavior that is specific to this project through `.repoops.yml`.

The shared RepoOps repository controls the reusable runtime and receives improvements centrally.

## Version updates

When the shared RepoOps project publishes a compatible release, repositories using `@v0` automatically consume the current `v0` implementation when their workflow runs.

A repository using an exact version such as `@v0.3.0` remains pinned until its workflow is changed.

## Security

The workflow does not check out contributor-controlled pull request code before the reusable RepoOps action. The action receives only the permissions declared by the caller workflow.

## Relationship to Steward

Both layers can coexist:

```text
                 HUSTLEVERSE
                     │
        ┌────────────┴────────────┐
        ↓                         ↓
     RepoOps                   Steward
 collaboration              repository hygiene
        │                         │
 claim / unclaim             deterministic scan
 contributor guidance        repository checks
 issue lifecycle
        │                         │
        └────────────┬────────────┘
                     ↓
                 Pull Request
```

RepoOps should not make product decisions, and Steward should not modify game behavior.
