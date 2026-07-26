# Anna

This repository contains Anna's code-first UX portfolio, built with the
Next.js App Router.

## Prerequisites and local development

- Node.js 22 (the repository's `.nvmrc` selects the required major version)
- npm

Install dependencies and run the app locally:

```sh
npm install
npm run dev
```

Run the current checks:

```sh
npm test
npm run build
npm run verify
npm run check:dependabot
```

The project-root `@/*` import alias uses the `paths` mapping in
`tsconfig.json`, without the obsolete `baseUrl` option. TypeScript is pinned
to 6.0.3: Next.js 16.2.11's build-time package check does not recognize the
TypeScript 7 package layout. Dependabot groups available `next` and
`typescript` updates into one weekly pull request; CI runs the same `npm run
verify` gate used locally, which determines whether that proposed pair is
compatible. Node runtime types are pinned to the Node 22 line
(`@types/node@22.20.1`) to match local development, CI, and deployment. CI
tests the proposed Next.js/TypeScript pair; Dependabot separately ignores only
semver-major `@types/node` updates, keeping type definitions on the deployed
Node major while allowing Node 22 patch and minor updates. `npm run
check:dependabot` validates that guard with the declared Node YAML parser, and
the shared `npm run verify` gate runs that check in CI.

## Portfolio project

The approved design for the code-first UX portfolio is documented in
[`docs/superpowers/specs/2026-07-24-ux-portfolio-design.md`](docs/superpowers/specs/2026-07-24-ux-portfolio-design.md).
Requirements validation and implementation planning are complete. The tested
Next.js foundation is in place; later tasks add the portfolio's content and
interface.
The plan has also received independent architecture and parallel-execution
reviews. Their remediations are incorporated into the roadmap.
Project case studies will use root-level URLs such as `/sample-project/`.
Version-one editorial media is image-only; video support is deferred until a
real case study requires it.
Scrolling remains native and responsive; in-page `Up` actions scroll smoothly
unless the visitor requests reduced motion. Version one uses no motion library
or scroll hijacking.
The deployment target is Vercel Hobby, connected to GitHub for preview and
production builds. This personal, non-commercial project must remain within the
free Hobby limits; domain registration is a separate external cost. All
portfolio data may remain structurally valid placeholder content until the
owner is ready to replace it.
The content setting `siteReady` defaults to `false`, keeping placeholder and
preview deployments out of search results. The documented launch step will
enable indexing, sitemap entries, and social metadata after final content is
ready.
Case-study metadata is displayed as Role and Results columns on desktop and
stacks as Role, Results, then opening media on mobile.
Version one includes no analytics, advertising trackers, consent manager, or
cookie banner.
Supported browsers are the current and previous major desktop releases of
Chrome, Safari, Firefox, and Edge, plus current iOS Safari and Android Chrome.
Version one targets good Core Web Vitals: LCP at or below 2.5 seconds, INP below
200 milliseconds, and CLS below 0.1.
The accessibility target is WCAG 2.2 Level AA, verified through automated checks
and manual keyboard, focus, structure, alternative-text, and touch-target
review.
Mobile case studies intentionally preserve the reference's spacious editorial
rhythm using responsive layout spacing rather than fixed empty elements.
Real project images are not required yet. Licensed local placeholders exercise
the responsive media model, including intrinsic dimensions and optional focal
points, and can later be replaced through content data.
The initial Archive collection is empty and therefore absent from the homepage;
its gallery appears only after the owner adds Archive images.
The three initial case-study routes are `/project-one/`, `/project-two/`, and
`/project-three/`; their slugs are content-owned placeholders.
The implementation roadmap is documented in
[`docs/superpowers/plans/2026-07-24-ux-portfolio-implementation.md`](docs/superpowers/plans/2026-07-24-ux-portfolio-implementation.md).
The dependency-safe worktree, atomic-PR, CI, and independent-review protocol is
documented in
[`docs/superpowers/plans/2026-07-24-parallel-worktree-execution.md`](docs/superpowers/plans/2026-07-24-parallel-worktree-execution.md).
The bootstrap work is isolated on a task branch; subsequent implementation
tasks continue to use isolated worktrees and atomic branches.

### Profile content contract

The first content-domain slice defines a strict `Profile` contract with required
`name`, `introduction`, and syntactically valid `email` strings. Validation
trims surrounding whitespace while preserving meaningful internal content.
Profile text has no maximum length yet.

TODO: define evidence-based profile content-length limits when the authoring
experience, storage constraints, or abuse-prevention requirements are known.
When database- or storage-backed authoring is introduced, add contact-email
ownership verification using a random, expiring, single-use code sent to the
inbox before publication.

## Local workflow skills

### Engineering apprenticeship

The repository automatically applies the local `engineering-apprenticeship`
skill to software planning, design, implementation, modification, debugging,
review, testing, and verification work. No keyword or explicit invocation is
required. The tracked activation policy and its limited exceptions are defined
in `AGENTS.md`.

The skill progressively transfers responsibility through four stages: Guided
Reviewer, Assisted Designer, Technical Owner, and Senior Reviewer. Work moves
through four human checkpoints: frame one independently testable behavior,
inspect its failing test, review the minimal verified implementation, and
perform an independent verification. The human remains the final technical
owner.

The reusable skill is stored locally at
`.agents/skills/engineering-apprenticeship/SKILL.md`. The `.agents` directory
is intentionally ignored, so the skill is not included in commits or GitHub. A
fresh clone receives the tracked `AGENTS.md` policy and this documentation, but
not the ignored skill itself; install or recreate the skill locally before
performing software work in that clone.

### Other local skills

The following skills are installed in the local workspace and are not vendored
in this repository:

- `find-skills`: discovers agent skills for specialized tasks and provides
  guidance for evaluating and installing them.
- `brainstorming`: turns an idea into a reviewed design or specification before
  implementation.
- `writing-plans`: decomposes an approved design into small, testable
  implementation tasks.
- `executing-plans`: implements written plans with review and progress
  checkpoints.
- `test-driven-development`: guides implementation with a red-green-refactor
  testing cycle.
- `systematic-debugging`: uses evidence and root-cause analysis to diagnose
  failures.
- `verification-before-completion`: requires fresh verification before work is
  reported complete.
- `finishing-a-development-branch`: guides final validation, integration, and
  branch cleanup decisions.
- `subagent-driven-development`: executes a plan with a fresh implementer and
  task-scoped review gate for every task.
- `using-git-worktrees`: creates or verifies an isolated implementation
  workspace before plan execution.
- `requesting-code-review`: supplies the final whole-branch review workflow.
- `grill-with-docs`: stress-tests plans and specifications against concrete
  scenarios, terminology, and architectural boundaries.
- `grilling`: drives the detailed questioning loop used during specification
  validation.
- `domain-modeling`: sharpens shared terminology and records durable domain or
  architectural decisions when warranted.

`find-skills` was installed locally from
[`vercel-labs/skills`](https://github.com/vercel-labs/skills) and is tracked in
the local, ignored `skills-lock.json`. The SDLC workflow skills were installed
locally from [`obra/superpowers`](https://github.com/obra/superpowers). The
specification-validation skills were installed locally from
[`mattpocock/skills`](https://github.com/mattpocock/skills). Local skill files
under `.agents/skills` and the incomplete lock file are intentionally excluded
from GitHub pending a complete licensing and reproducibility review.

## SDLC workflow

Use the skills in this general sequence:

1. Explore the problem and approve a design with `brainstorming`.
2. Stress-test the written design with `grill-with-docs`.
3. Produce an implementation roadmap with `writing-plans`.
4. Implement it with `executing-plans` and `test-driven-development`.
5. For parallel execution, isolate each atomic PR in an author worktree and
   require review by a different agent in a clean reviewer worktree.
6. Investigate failures with `systematic-debugging`.
7. Validate the completed work with `verification-before-completion`.
8. Integrate or close the work with `finishing-a-development-branch`.

## Maintenance

In a workspace where the CLI-managed skills have been installed, update them
with:

```sh
npx skills update
```

The `obra/superpowers` skills were installed directly from their GitHub source.
Reinstall them from that source when intentionally upgrading the workflow, and
review upstream changes before use.
