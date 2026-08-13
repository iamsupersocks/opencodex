# Maintainers

This document lists the people responsible for maintaining opencodex and defines the project's
review and merge policy.

## Current maintainers

| GitHub account | Project role | Responsibilities |
| --- | --- | --- |
| [@iamsupersocks](https://github.com/iamsupersocks) | Project owner | Project direction, releases, repository administration, and final governance decisions |

The table describes project responsibilities. Actual repository permissions remain controlled
through GitHub repository settings.

`dev` is the only integration line.

## Review and merge policy

- Pull requests target `dev`. It is the only integration line, and promotion to
  `main` happens only from `dev`. The target-branch check accepts `dev` alone.
- The **`enforce-target`** CI check rejects pull requests whose head
  ancestry sits on the **`main`** tip while far behind **`dev`**, and rejects
  empty, thin, or malformed descriptions; PRs whose title or description
  mentions `gui` must include a screenshot of the UI change in the description.
  Contributor PRs (authors without repository push permission) open in draft
  and stay there until a four-box review-readiness checklist in the
  description is complete: local CI green, branch on the latest `dev` commit,
  all correct Codex and CodeRabbit findings fixed, and the ready-for-review
  confirmation. When all four boxes are ticked the gate marks the PR ready and
  notifies the maintainer listed in `MAINTAINERS.md` (excluding the author).
  Completion is bound to the exact commit the PR head pointed at: if new
  commits are pushed afterwards, the gate moves the PR back to draft, resets
  the checklist and the notification, and asks the author to test and tick the
  boxes again against the latest code.
  Before a completion is accepted, the gate verifies the checklist claims
  it can check itself: the branch must be on the latest `dev` commit or at
  most 10 commits behind it, and Codex/CodeRabbit findings must be resolved.
  The local-CI box is an author attestation only — fork contributors cannot
  start repository CI; a maintainer has to — so the gate never disproves it;
  a new push still resets every box. A disproved claim unticks the matching
  box and keeps the PR a draft.
  Authors with repository push permission skip the ancestry heuristic only.
  As with the approval requirement above, this is enforced by convention until
  branch protection is configured.
- A pull request requires approval from the maintainer and successful required CI checks
  before merge.
- Authors do not approve their own pull requests.
- Authentication, credential handling, GitHub Actions, release automation, dependency installation,
  and other security-boundary changes require explicit security review.
- A new or promoted provider preset is a credential-destination change. Before merge it needs the
  primary-source evidence listed under [Adding a provider to the
  catalog](https://opencodex.me/contributing/#evidence-required-for-a-canonical-preset): documented
  OpenAI-compatible endpoints (including authenticated `GET /v1/models` when the entry declares
  `liveModels`), terms of service and operating legal entity, resale or routing authorization for
  aggregators, a named maintenance owner, and a citable verification date. Contributor affiliation
  with the service is disclosed, not disqualifying, and it does not lower the evidence bar. When the
  evidence is incomplete, prefer an inert `src/providers/free-directory.ts` reference row over a
  canonical registry entry.
- Security-sensitive and release-related changes should be reviewed carefully, with security-boundary
  changes receiving explicit review per the security-review rule above.
- Direct pushes are reserved for maintainer-owned integration work, urgent repairs, or incident
  recovery. The same CI and documentation requirements still apply.
- Promotion from `dev` to `main` and npm releases is maintainer-controlled.

## Maintainer changes

Adding or removing a maintainer requires:

1. agreement from the project owner, and
2. updates to this file and [`.github/CODEOWNERS`](./.github/CODEOWNERS).

## Security reports

Private vulnerability reports are handled by the maintainer according to
[`SECURITY.md`](./SECURITY.md). Do not disclose secrets or exploit details in a public issue.
