# Parallel Worktree Execution and Independent Review

**Status:** Approved workflow design; implementation has not started.

This document extends the portfolio implementation plan with safe parallel
execution. It does not authorize creating the repository or worktrees until the
owner explicitly starts implementation.

## Operating Model

- Keep one protected integration branch, `main`.
- Give every atomic slice its own branch and author worktree.
- Start a branch from the latest merged SHA of every declared dependency. Do
  not use stacked feature branches.
- Give each branch a separate, clean reviewer worktree checked out at the exact
  head SHA, and retain the immutable base SHA for the reviewed diff.
- The reviewer is read-only: they do not edit, commit, push, or resolve the
  author's branch.
- Assign the reviewer independently. They must not be the author, a contributor
  to the branch, the integrator if the integrator changed the branch, an author
  of a concurrent conflicting slice, or the author of the immediately dependent
  next slice. Review prompts contain the task, requirements, base SHA, head SHA,
  verification output, and diff—not the author's conversation.
- Critical and Important findings block merge. The author fixes them, reruns
  the full task verification, and requests review again.
- Any rebase, conflict resolution, or new commit dismisses the prior approval.
- The integrator merges only the reviewed head SHA after required CI passes.
- Every task updates `readme.md` and affected documentation. Because this makes
  README a shared file, coding may occur in parallel but merges enter a
  serialized queue. Before its final review, each queued author rebases onto the
  latest integration SHA, reconciles README/doc changes, reruns verification,
  and obtains a new independent approval for the rebased head.
- Run `git status --short` before review and commit. Do not include unrelated
  files.

Suggested names:

```text
branch:    feature/tNN-short-name
author:    .worktrees/tNN-short-name
reviewer:  .worktrees/review-tNN-short-name
```

The integrator records unique numeric ports in a worktree registry before any
server starts; suffixes such as T9A never derive their own number. Reviewer
worktrees receive their own allocations when they run browser or Lighthouse
checks. For example:

```text
T9A author:   PLAYWRIGHT_PORT=3109, LHCI_PORT=3209
T9A reviewer: PLAYWRIGHT_PORT=4109, LHCI_PORT=4209
```

## Dependency Lanes

```text
T1 tested Next.js shell
├── T2 content domain ── T3 local content and media ──┬── homepage lane
└── T4 local typography and page tokens ──────────────┘

homepage:  T5 → T6 → T7 → T8 → T9A → T9B → T9C → T10 → T11 → T12
                                           └────→ T25A → T25B → T25C
                                                        └────→ T26A → T26B → T26C → T26D
project:   after T26D, T13 → T14 → T15 → T16 → T17 → T18 → T19
                              → T20 → T21 → T22 → T23 → T24

all functional lanes:
T27A → T27B → T28 → T30 → T29 → T31
```

T2 and T4 may be authored concurrently after T1, but they enter the README merge
queue one at a time and the second branch is rebased, verified, and reviewed
again. T3 follows merged T2. Once their common dependencies are merged, homepage
and discovery work may be authored concurrently when they do not touch the same
code files, while still using the serialized documentation merge queue. T13
begins only after T26D because both lanes modify `app/[slug]/page.tsx`. The
project lane is intentionally serial because its slices repeatedly touch the
content schema and renderer.

The cross-lane edges are explicit: `T9C → T25A`, `T25C → T26A`, and
`T26D → T13`. After T9C merges, T10–T12 may be authored in parallel with the
serial T25/T26 discovery chain because the former owns Archive/contact homepage
components while the latter owns discovery helpers and metadata routes. Any
unexpected overlap in `app/page.tsx`, `app/[slug]/page.tsx`, package files, or CI
adds a dependency edge and stops those branches from running concurrently.

Task 30 precedes Task 29 so performance corrections cannot invalidate approved
visual baselines.

## Atomic PR Boundaries

The numbered implementation plan remains the detailed source of tests and code.
The following bundled tasks are split into smaller PRs so every change remains
reviewable:

| PR | Responsibility | Focused files and red check | Verification |
| --- | --- | --- | --- |
| T9A | Generate the three valid route params | `app/[slug]/page.tsx`, `tests/unit/project-route.test.tsx`; params assertion | focused unit test, then `npm run verify` |
| T9B | Return not-found for an unknown slug | same route/unit test; missing-project assertion | focused unit test, then `npm run verify` |
| T9C | Navigate all three “See more” links | `tests/e2e/project-navigation.spec.ts`, homepage link code if required; three-link loop | focused Chromium E2E, then `npm run verify` |
| T25A | Apply page noindex while not ready | `lib/discovery.ts`, layouts/routes, `tests/unit/discovery.test.ts`; page robots table | focused unit test, then `npm run verify` |
| T25B | Disallow crawling while not ready | `app/robots.ts`, discovery helper/test; disallow assertion | focused unit test, then `npm run verify` |
| T25C | Return an empty sitemap while not ready | `app/sitemap.ts`, discovery helper/test, `docs/launch.md`; empty-list assertion | focused unit test, then `npm run verify` |
| T26A | Generate canonical and Open Graph data | discovery helper, layouts/routes/test; route metadata table | focused unit test, then `npm run verify` |
| T26B | Allow crawling only in ready production | `app/robots.ts`, helper/test; readiness matrix | focused unit test, then `npm run verify` |
| T26C | Populate the ready sitemap | `app/sitemap.ts`, helper/test; four-URL assertion | focused unit test, then `npm run verify` |
| T26D | Add manifest and finish metadata integration | `app/manifest.ts`, discovery integration/test, `docs/launch.md`; manifest/integration assertions | focused unit test, then `npm run verify` |
| T27A | Add accessibility checks and evidence | axe package/config/CI, accessibility E2E and doc; axe/keyboard checks | focused Chromium audit, then full gate |
| T27B | Enforce excluded dependencies/scripts | `tests/unit/scope-guard.test.ts`, CI/readme; package and script assertions | focused unit/E2E checks, then full gate |

If any other task grows beyond one observable behavior during implementation,
stop and split it before writing implementation code.

The split PRs are strictly serial within each group:
`T9A → T9B → T9C`, `T25A → T25B → T25C`,
`T26A → T26B → T26C → T26D`, and `T27A → T27B`.
Each row also updates `readme.md` as required and carries forward the detailed
interfaces and constraints from its parent task.

## Per-PR Protocol

1. The integrator confirms dependencies are merged and assigns one author.
2. The author creates the branch/worktree from the dependency SHA and writes the
   smallest failing test that demonstrates the behavior.
3. The author confirms the expected failure, implements the minimum change,
   refactors with tests green, updates documentation, and runs the task's full
   verification command.
4. The author records base SHA, head SHA, commands, results, and
   `git status --short`.
5. A different agent checks out those SHAs in a clean reviewer worktree and
   runs `npm ci`, confirms clean status, independently reruns the focused check
   and current full gate from the exact head, then reviews the requirements,
   diff, tests, documentation, accessibility, responsive impact, and regression
   risk. The reviewer records their own command output and confirms the worktree
   remains clean; author-supplied results are context, not proof.
6. The author addresses all blocking findings and repeats steps 3–5.
7. Required CI passes. The integrator verifies that approval still refers to
   the current head SHA, then merges.
8. Downstream authors refresh from the newly merged dependency. Parallel work
   never resolves conflicts by silently taking one side.

## CI and Merge Gates

CI exists in T1, before parallel feature work begins. Before the first PR, the
integrator records whether GitHub branch protection or the documented manual
merge gate is enforcing review. No PR merges without one of those recorded
modes.

The single full-gate command is `npm run verify`. Its definition evolves in the
same PR that introduces a suite:

- T1–T7: `npm test && npm run typecheck && npm run build`
- T8–T10: add Playwright E2E
- T11: add Playwright component tests
- T27A: add the Chromium axe audit
- T28: expand E2E to the full browser matrix
- T29: add approved Chromium visual regression
- T30: add production-build Lighthouse CI, run serially

The author, reviewer, and CI all run the same current `npm run verify`. Focused
commands demonstrate the task behavior but never replace the full gate. As the
suites are added, required checks therefore include:

- type checking
- unit tests
- component geometry tests
- production build
- Playwright browser matrix
- accessibility checks
- approved visual regression checks
- serialized Lighthouse CI

GitHub branch protection requires the `verify` check, verified signatures on
every commit entering `main`, resolution of every pull-request review
conversation before merge, the `CodeRabbit` review status, and enforcement for
administrators. The planned gate additionally calls for one approval from
someone other than the author and dismissal of stale approvals; those approval
settings are not currently enforced. If the repository/account cannot enforce a
planned setting, document the gap and apply the same rule manually; never claim
a protection is enabled when it is not.

## Evidence and Browser Claims

Automated Playwright runs prove the current installed Chromium, WebKit, and
Firefox engines plus mobile emulations. The specification retains previous
major desktop versions as a compatibility target, but those versions are only
reported as tested when exact-version evidence exists. Manual browser and
device evidence records date, version, route, result, and reviewer.

Tasks 27–31 are acceptance/release gates. Their checks are written before any
corrective change, but a passing first run is valid evidence; no artificial
red state is required.

## Recovery Rules

- Author resolves merge conflicts and reruns all checks.
- Rebase or conflict resolution always triggers fresh independent review.
- Flaky tests block merge until diagnosed; rerunning until green is not proof.
- A reviewer who contributed code to a branch is no longer independent; assign
  another reviewer.
- Never let two active branches mutate `package-lock.json` or the same
  route/component without an explicit dependency edge. README is the sole
  planned exception: parallel authors may edit it, but the serialized merge
  queue forces the queued author to reconcile it, rerun the full gate, and
  obtain fresh review after rebasing.
- After merge, remove worktrees only through the worktree-management workflow
  and only after confirming no uncommitted work remains.
