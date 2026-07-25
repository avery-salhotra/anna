# UX Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a responsive, image-led UX portfolio with one homepage and three root-level case studies, using replaceable local content and strict test-driven development.

**Architecture:** Next.js App Router pages consume a validated, CMS-neutral content model through a local content-source interface. Small server-rendered React components own semantic structure, CSS Modules own component layout, and global CSS owns tokens and responsive foundations. Vitest and React Testing Library drive component work; Playwright, axe, Lighthouse CI, and the production build verify routing, browsers, accessibility, visuals, and performance.

**Tech Stack:** Next.js App Router, React, TypeScript, Zod, CSS Modules, locally bundled Inter, Vitest, React Testing Library, jest-dom, axe-core, Playwright, Lighthouse CI, npm, Vercel Hobby.

## Global Constraints

- Use strict red–green–refactor TDD: write one focused failing test, confirm the expected failure, add minimum code, run the focused test, run the full suite, update documentation, then commit.
- Use root-level project routes `/project-one/`, `/project-two/`, and `/project-three/`.
- Configure `trailingSlash: true`; links, canonical URLs, sitemap entries, and
  tests use terminal slashes consistently.
- Use three featured projects; every visible `See more` link must resolve.
- Keep Archive absent when empty; when populated use three, two, and one columns at desktop, tablet, and mobile.
- Hide homepage featured-project media on mobile.
- Display Role and Results side by side on desktop; stack Role, Results, then opening media on mobile.
- Use image-only editorial media; do not add video or a motion library.
- Preserve native scrolling; `Up` scrolls smoothly unless reduced motion is requested.
- Use a CMS-neutral, JSON-serializable discriminated-union content model; do not store HTML, MDX, React values, functions, or CMS-vendor objects.
- Bundle Inter locally and store its license with the font file.
- Default `siteReady` to `false`; all preview deployments remain non-indexable.
- Target WCAG 2.2 Level AA.
- Target LCP ≤ 2.5 s, INP < 200 ms, and CLS < 0.1.
- Test Chromium, WebKit, and Firefox; manually inspect 1440×900, 768×1024, and 390×844.
- Do not enable analytics, advertising, cookie consent, or Vercel Speed Insights.
- Keep Vercel Hobby usage at $0 for this personal, non-commercial project.
- After every task, update `readme.md` and affected project documentation with only verified behavior.
- Before every commit, run the evolving `npm run verify` in Tasks 1–31. Fix
  every failure before committing.
- Every task branch starts from its latest merged dependency, uses an isolated
  author worktree and unique local ports, and is reviewed by a fresh agent that
  did not author the branch. A rebase or conflict-resolution commit invalidates
  approval and requires a fresh independent review.
- The author—not the integrator or reviewer—resolves branch conflicts, reconciles
  README/project documentation, reruns every required check, and obtains new
  approval before merge.
- Before requesting review and again before commit, run `git status --short` and
  confirm that every changed file belongs to the task. Reviewer approval applies
  only to the recorded base and head SHAs.
- Tasks 27–31 are acceptance and release gates rather than product-feature TDD
  slices. Write their checks before changing behavior, but do not manufacture a
  failing test when the existing implementation already satisfies the gate.
- Use the atomic PR boundaries, dependency lanes, reviewer assignment rules, and
  merge protocol in
  `docs/superpowers/plans/2026-07-24-parallel-worktree-execution.md`.
- `npm run verify` is the evolving full gate. The PR that introduces a new
  suite must add it to `verify` and CI, so authors and independent reviewers run
  unit, type, build, component, browser, accessibility, visual, and performance
  checks as those suites become available.

---

## File Structure

```text
app/
  [slug]/page.tsx              # statically generated root-level case study
  globals.css                  # reset, tokens, local font, shared responsive rules
  layout.tsx                   # root metadata and page shell
  manifest.ts                  # web-app manifest
  page.module.css              # homepage composition
  page.tsx                     # homepage route
  robots.ts                    # readiness-aware crawler policy
  sitemap.ts                   # readiness-aware route discovery
components/
  ArchiveGallery/
  CaseStudyRenderer/
  ContactLink/
  FeaturedProject/
  IntroStatement/
  ProjectFooter/
  ProjectMetadata/
  ProjectPage/
content/
  local-content.ts             # actual version-one content values
  schema.ts                    # Zod schemas and inferred domain types
  source.ts                    # PortfolioContentSource interface and queries
  validation.ts                # reserved slugs and cross-record validation
lib/
  discovery.ts                 # readiness and preview indexing rules
  image-style.ts               # focal-point style conversion
  site.ts                      # shared site constants
.github/
  workflows/ci.yml             # required pull-request unit/type/build checks
public/
  fonts/                       # Inter WOFF2 and license
  placeholders/                # original local SVG media
tests/
  fixtures/content.ts            # immutable valid component-test records
  setup.ts                     # jest-dom setup
  unit/                        # Vitest/RTL tests
  e2e/                         # Playwright route, responsive, and visual tests
docs/
  assets.md                    # asset provenance
  content-editing.md           # local content and future CMS contract
  launch.md                    # siteReady and Vercel launch procedure
lighthouserc.cjs               # repeatable performance assertions
playwright.config.ts
vitest.config.ts
```

### Task 1: Bootstrap the Tested Next.js Shell

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `next-env.d.ts`
- Create: `.nvmrc`
- Create: `.github/workflows/ci.yml`
- Create: `vitest.config.ts`
- Create: `tests/setup.ts`
- Create: `tests/unit/smoke.test.ts`
- Create: `app/layout.tsx`
- Create: `app/page.tsx`
- Create: `app/globals.css`
- Modify: `readme.md`

**Interfaces:**
- Consumes: none.
- Produces: npm scripts `dev`, `build`, `start`, `test`, `test:watch`,
  `typecheck`, `verify`, and a renderable App Router shell.

- [ ] **Step 1: Create dependency metadata and install the toolchain**

Run:

```bash
npm init -y
npm pkg set name="anna-ux-portfolio" private=true
npm pkg set engines.node=">=22 <23"
npm pkg set scripts.dev="next dev" scripts.build="next build" scripts.start="next start"
npm pkg set scripts.typecheck="tsc --noEmit" scripts.test="vitest run" scripts.test:watch="vitest"
npm pkg set scripts.verify="npm test && npm run typecheck && npm run build"
npm install --save-exact next@latest react@latest react-dom@latest zod@latest
npm install --save-dev --save-exact @testing-library/jest-dom@latest @testing-library/react@latest @testing-library/user-event@latest @types/node@latest @types/react@latest @types/react-dom@latest @vitejs/plugin-react@latest jsdom@latest typescript@latest vite@latest vitest@latest
```

These commands resolve current compatible releases once, write exact versions
to `package.json`, and commit `package-lock.json`. Create `.nvmrc` containing
`22`. All CI and reviewer installs use `npm ci`; no dependency specifier remains
`latest`.

Run: `git init` if `git rev-parse --is-inside-work-tree` does not return
`true`, then create the initial branch with `git branch -M main`.

- [ ] **Step 2: Write the failing smoke test**

```ts
// tests/unit/smoke.test.ts
import { describe, expect, it } from "vitest";
import { siteName } from "@/lib/site";

describe("test harness", () => {
  it("loads project modules through the @ alias", () => {
    expect(siteName).toBe("Portfolio");
  });
});
```

- [ ] **Step 3: Run the test and confirm the expected failure**

Run: `npm test -- tests/unit/smoke.test.ts`

Expected: FAIL because `@/lib/site` does not exist.

- [ ] **Step 4: Add the minimum shell and module**

```ts
// lib/site.ts
export const siteName = "Portfolio";
```

```tsx
// app/layout.tsx
import "./globals.css";
import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

```tsx
// app/page.tsx
export default function HomePage() {
  return <main>Portfolio</main>;
}
```

Configure `next.config.ts` with `trailingSlash: true`. Configure
`tsconfig.json` with `"strict": true`, `"baseUrl": "."`, and
`"paths": { "@/*": ["./*"] }`. Configure Vitest for `jsdom`, React, the same
alias, and `tests/setup.ts`; import `@testing-library/jest-dom/vitest` there.

Create `.github/workflows/ci.yml` on `pull_request` and pushes to `main` using
`actions/checkout`, `actions/setup-node` with Node 22 and npm cache, then
`npm ci`, `npm run typecheck`, `npm test`, and `npm run build`. Later tasks
extend this same required workflow as browser, accessibility, visual, and
performance gates become available.

- [ ] **Step 5: Verify the focused test and production build**

Run: `npm test -- tests/unit/smoke.test.ts`

Expected: PASS.

Run: `npm run typecheck && npm test && npm run build`

Expected: all tests pass and Next.js completes a production build.

- [ ] **Step 6: Document and commit**

Update `readme.md` with Node/npm prerequisites and the verified commands
`npm install`, `npm run dev`, `npm test`, and `npm run build`.

```bash
git add .nvmrc .github package.json package-lock.json tsconfig.json next.config.ts next-env.d.ts vitest.config.ts tests app lib readme.md
git commit -m "chore: bootstrap tested Next.js portfolio"
```

### Task 2: Define and Validate the Content Domain

**Files:**
- Create: `content/schema.ts`
- Create: `content/validation.ts`
- Create: `tests/fixtures/content.ts`
- Create: `tests/unit/content-validation.test.ts`
- Create: `docs/content-editing.md`
- Modify: `readme.md`

**Interfaces:**
- Consumes: Zod.
- Produces: `portfolioSchema`, `PortfolioContent`, `HomepageContent`, `Project`, `PortfolioImage`, `EditorialBlock`, `validatePortfolio(input): PortfolioContent`, and immutable `projectOneFixture`, `detailImageA`, `detailImageB`, `detailImageC`.

- [ ] **Step 1: Write failing schema tests**

```ts
// tests/unit/content-validation.test.ts
import { describe, expect, it } from "vitest";
import { validatePortfolio } from "@/content/validation";

const minimal = {
  siteReady: false,
  profile: { name: "Portfolio Owner", introduction: "Product designer.", email: "hello@example.com" },
  featuredProjectSlugs: ["project-one", "project-two", "project-three"],
  archive: [],
  projects: [
    {
      slug: "project-one",
      title: "Project One",
      summary: "A concise project summary.",
      introduction: "A longer project introduction.",
      roles: ["Research"],
      results: ["Clearer task completion"],
      openingMedia: { src: "/placeholders/one.svg", width: 1600, height: 1000, alt: "Abstract blue composition" },
      alignment: "media-left",
      blocks: []
    },
    {
      slug: "project-two",
      title: "Project Two",
      summary: "A concise project summary.",
      introduction: "A longer project introduction.",
      roles: ["Product design"],
      results: ["Simpler navigation"],
      openingMedia: { src: "/placeholders/two.svg", width: 1600, height: 1000, alt: "Abstract orange composition" },
      alignment: "media-right",
      blocks: []
    },
    {
      slug: "project-three",
      title: "Project Three",
      summary: "A concise project summary.",
      introduction: "A longer project introduction.",
      roles: ["Prototyping"],
      results: ["Faster validation"],
      openingMedia: { src: "/placeholders/three.svg", width: 1600, height: 1000, alt: "Abstract green composition" },
      alignment: "media-left",
      blocks: []
    }
  ]
};

describe("validatePortfolio", () => {
  it("accepts the three linked project records", () => {
    expect(validatePortfolio(minimal).projects).toHaveLength(3);
  });

  it("rejects a featured slug without a project", () => {
    expect(() =>
      validatePortfolio({ ...minimal, featuredProjectSlugs: ["missing"] })
    ).toThrow(/missing/i);
  });

  it("rejects duplicate and reserved slugs", () => {
    const duplicate = { ...minimal.projects[0], slug: "robots.txt" };
    expect(() => validatePortfolio({ ...minimal, projects: [duplicate, duplicate] }))
      .toThrow(/slug/i);
  });

  it("rejects focal coordinates outside zero through one", () => {
    const project = {
      ...minimal.projects[0],
      openingMedia: { ...minimal.projects[0].openingMedia, focalPoint: { x: 2, y: 0.5 } }
    };
    expect(() => validatePortfolio({ ...minimal, projects: [project, ...minimal.projects.slice(1)] }))
      .toThrow(/focal/i);
  });
});
```

- [ ] **Step 2: Run and confirm the missing-module failure**

Run: `npm test -- tests/unit/content-validation.test.ts`

Expected: FAIL because `content/validation.ts` does not exist.

- [ ] **Step 3: Implement the discriminated schema and cross-record validation**

Define `imageSchema`, typed rich-text nodes, and these block discriminants in
`content/schema.ts`:

```ts
type EditorialBlock =
  | { type: "statement"; text: string }
  | { type: "richText"; nodes: RichTextNode[] }
  | { type: "twoColumnProse"; left: RichTextNode[]; right: RichTextNode[] }
  | { type: "image"; image: PortfolioImage | null }
  | { type: "mediaGroup"; images: [PortfolioImage, PortfolioImage] | [PortfolioImage, PortfolioImage, PortfolioImage] }
  | { type: "textMediaSplit"; heading: string; nodes: RichTextNode[]; image: PortfolioImage; mediaSide: "left" | "right" };
```

Use `z.discriminatedUnion("type", ...)`, require positive intrinsic dimensions,
constrain focal points with `z.number().min(0).max(1)`, and use
`z.infer<typeof portfolioSchema>` for exported types. In `validatePortfolio`,
parse first, then reject duplicate slugs, `robots.txt`, `sitemap.xml`,
`manifest.webmanifest`, and featured slugs without records.

Define image presentation metadata as:

```ts
type ImagePresentation =
  | { mode: "natural" }
  | { mode: "crop"; aspectRatio: `${number}/${number}` };
```

Default omitted presentation to `{ mode: "natural" }`. Focal points affect only
`mode: "crop"` rendering. A single-image editorial block may contain
`image: null`; the renderer omits that entire optional block without spacing.

Create `tests/fixtures/content.ts` from the validated `minimal` data above and
export frozen `projectOneFixture`, plus three `PortfolioImage` values named
`detailImageA`, `detailImageB`, and `detailImageC`. Export
`HomepageContent` as:

```ts
export type HomepageContent = {
  profile: PortfolioContent["profile"];
  featuredProjects: Project[];
  archive: PortfolioImage[];
};
```

- [ ] **Step 4: Verify focused and full suites**

Run: `npm test -- tests/unit/content-validation.test.ts`

Expected: all four tests PASS.

Run: `npm test && npm run build`

Expected: all tests and build pass.

- [ ] **Step 5: Document and commit**

Document every content field, editorial discriminant, reserved slug, intrinsic
dimension, focal-point range, and the ban on raw HTML/MDX/React values in
`docs/content-editing.md`. Link it from `readme.md`.

```bash
git add content tests/unit/content-validation.test.ts docs/content-editing.md readme.md
git commit -m "feat: define validated portfolio content model"
```

### Task 3: Add the Local Content Source and Original Media

**Files:**
- Create: `content/local-content.ts`
- Create: `content/source.ts`
- Create: `public/placeholders/project-one.svg`
- Create: `public/placeholders/project-two.svg`
- Create: `public/placeholders/project-three.svg`
- Create: `public/placeholders/detail-a.svg`
- Create: `public/placeholders/detail-b.svg`
- Create: `public/placeholders/detail-c.svg`
- Create: `docs/assets.md`
- Create: `tests/unit/content-source.test.ts`
- Modify: `readme.md`

**Interfaces:**
- Consumes: `PortfolioContent`, `Project`, `validatePortfolio`.
- Produces: `PortfolioContentSource`, `localContentSource`, `getHomepage()`, `getProject(slug)`, `getProjectSlugs()`.

- [ ] **Step 1: Write the failing content-source test**

```ts
import { describe, expect, it } from "vitest";
import { localContentSource } from "@/content/source";

describe("localContentSource", () => {
  it("returns three featured projects in configured order", async () => {
    const home = await localContentSource.getHomepage();
    expect(home.featuredProjects.map((project) => project.slug)).toEqual([
      "project-one", "project-two", "project-three"
    ]);
    expect(home.archive).toEqual([]);
  });

  it("returns undefined for an unknown project", async () => {
    await expect(localContentSource.getProject("unknown")).resolves.toBeUndefined();
  });
});
```

- [ ] **Step 2: Run and confirm failure**

Run: `npm test -- tests/unit/content-source.test.ts`

Expected: FAIL because `localContentSource` does not exist.

- [ ] **Step 3: Create concrete content and source adapter**

Create six original SVG compositions with explicit `viewBox="0 0 1600 1000"`,
solid geometric shapes, and distinct blue, orange, and green palettes. Record
each as “Original repository-created placeholder; no external URL” in
`docs/assets.md`.

Create a fully valid `localContent` value with `siteReady: false`, the three
approved slugs, empty Archive, `hello@example.com`, and initially empty
editorial-block arrays. Each later editorial task adds one supported block to
`project-one`, so the canonical project reaches full coverage incrementally.
Implement:

```ts
export interface PortfolioContentSource {
  getHomepage(): Promise<HomepageContent>;
  getProject(slug: string): Promise<Project | undefined>;
  getProjectSlugs(): Promise<string[]>;
}
```

Validate once at module initialization and derive every query from the parsed
value. Do not export mutable content.

- [ ] **Step 4: Verify**

Run: `npm test -- tests/unit/content-source.test.ts`

Expected: both tests PASS.

Run: `npm test && npm run build`

Expected: all tests and build pass.

- [ ] **Step 5: Document and commit**

Update `readme.md` with the local-content path, the initial empty Archive, and
the replacement workflow.

```bash
git add content public/placeholders docs/assets.md tests/unit/content-source.test.ts readme.md
git commit -m "feat: add local portfolio content source"
```

### Task 4: Establish Local Typography and Page Tokens

**Files:**
- Create: `public/fonts/InterVariable.woff2`
- Create: `public/fonts/OFL.txt`
- Create: `tests/unit/root-layout.test.tsx`
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`
- Modify: `readme.md`

**Interfaces:**
- Consumes: App Router root layout.
- Produces: CSS tokens `--font-sans`, `--page-gutter`, `--display-size`, `--body-size`, `--section-space`.

- [ ] **Step 1: Write the failing typography and metadata test**

```ts
import { existsSync, readFileSync } from "node:fs";
import { metadata } from "@/app/layout";

it("provides deterministic root metadata", () => {
  expect(metadata.title).toBe("Portfolio");
  expect(metadata.description).toBe("Product design portfolio");
});

it("vendors Inter and its license and references the local file", () => {
  expect(existsSync("public/fonts/InterVariable.woff2")).toBe(true);
  expect(readFileSync("public/fonts/OFL.txt", "utf8")).toMatch(/SIL Open Font License/i);
  expect(readFileSync("app/globals.css", "utf8")).toContain("/fonts/InterVariable.woff2");
});
```

- [ ] **Step 2: Run and confirm failure**

Run: `npm test -- tests/unit/root-layout.test.tsx`

Expected: FAIL because metadata, the local font, and the stored license are
absent.

- [ ] **Step 3: Install, vendor, and implement**

Run: `npm install --save-dev --save-exact @fontsource-variable/inter@latest`

Copy `inter-latin-wght-normal.woff2` and the package license into
`public/fonts/InterVariable.woff2` and `public/fonts/OFL.txt`.

Add `@font-face` pointing to `/fonts/InterVariable.woff2`, a border-box reset,
white/black colors, body margin zero, antialiasing, visible `:focus-visible`,
and:

```css
:root {
  --font-sans: "Inter", Arial, sans-serif;
  --page-gutter: clamp(1.5rem, 6vw, 7.5rem);
  --display-size: clamp(4rem, 9vw, 9.5rem);
  --body-size: clamp(1.125rem, 1.6vw, 1.75rem);
  --section-space: clamp(8rem, 18vw, 20rem);
}
```

Export root metadata `{ title: "Portfolio", description: "Product design portfolio" }`.

- [ ] **Step 4: Verify, document, and commit**

Run: `npm test -- tests/unit/root-layout.test.tsx && npm test && npm run build`

Expected: all pass.

Document the font source and token ownership in `readme.md`.

```bash
git add app public/fonts tests/unit/root-layout.test.tsx package.json package-lock.json readme.md
git commit -m "feat: add deterministic portfolio typography"
```

### Task 5: Render the Homepage Introduction

**Files:**
- Create: `components/IntroStatement/IntroStatement.tsx`
- Create: `components/IntroStatement/IntroStatement.module.css`
- Create: `tests/unit/intro-statement.test.tsx`
- Modify: `app/page.tsx`
- Modify: `app/page.module.css`
- Modify: `readme.md`

**Interfaces:**
- Consumes: `profile.introduction: string`.
- Produces: `IntroStatement({ children }: { children: string })`.

- [ ] **Step 1: Write the failing semantic test**

```tsx
import { render, screen } from "@testing-library/react";
import { IntroStatement } from "@/components/IntroStatement/IntroStatement";

it("renders the positioning statement as the page heading", () => {
  render(<IntroStatement>Portfolio Owner is a product designer.</IntroStatement>);
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
    "Portfolio Owner is a product designer."
  );
});
```

- [ ] **Step 2: Confirm failure**

Run: `npm test -- tests/unit/intro-statement.test.tsx`

Expected: FAIL because the component does not exist.

- [ ] **Step 3: Implement the heading and homepage composition**

Render one `<h1>` with `font-size: var(--display-size)`,
`line-height: 0.92`, `letter-spacing: -0.055em`, maximum width `12ch`, and
`min-height: 92svh`. Fetch homepage content in `app/page.tsx` and pass the
profile introduction to the component.

- [ ] **Step 4: Verify, document, and commit**

Run: `npm test -- tests/unit/intro-statement.test.tsx && npm test && npm run build`

Expected: all pass.

Update the homepage structure section in `readme.md`.

```bash
git add app components/IntroStatement tests/unit/intro-statement.test.tsx readme.md
git commit -m "feat: render oversized homepage introduction"
```

### Task 6: Render One Desktop Featured Project

**Files:**
- Create: `components/FeaturedProject/FeaturedProject.tsx`
- Create: `components/FeaturedProject/FeaturedProject.module.css`
- Create: `tests/unit/featured-project.test.tsx`
- Modify: `app/page.tsx`
- Modify: `readme.md`

**Interfaces:**
- Consumes: `Project`.
- Produces: `FeaturedProject({ project }: { project: Project })`.

- [ ] **Step 1: Write the failing rendering test**

```tsx
render(<FeaturedProject project={projectOne} />);
expect(screen.getByRole("heading", { name: "Project One" })).toBeVisible();
expect(screen.getByText("A concise project summary.")).toBeVisible();
expect(screen.getByRole("img", { name: "Abstract blue composition" })).toBeVisible();
expect(screen.getByRole("link", { name: "See more" })).toHaveAttribute("href", "/project-one/");
```

Import `projectOneFixture as projectOne` from
`tests/fixtures/content.ts`.

- [ ] **Step 2: Confirm failure**

Run: `npm test -- tests/unit/featured-project.test.tsx`

Expected: FAIL because `FeaturedProject` does not exist.

- [ ] **Step 3: Implement the first desktop composition**

Use a semantic `<article>`, `next/image` with intrinsic dimensions and
responsive `sizes`, an `<h2>`, summary `<p>`, and a black pill `<Link>`.
Desktop grid columns are `minmax(0, 1.15fr) minmax(20rem, 0.85fr)`, with a
minimum block height of `80vh`.

- [ ] **Step 4: Verify, document, and commit**

Run: `npm test -- tests/unit/featured-project.test.tsx && npm test && npm run build`

Expected: all pass.

Update `readme.md` with the featured-project contract.

```bash
git add app/page.tsx components/FeaturedProject tests/unit/featured-project.test.tsx readme.md
git commit -m "feat: add desktop featured project"
```

### Task 7: Alternate Featured-Project Alignment

**Files:**
- Modify: `components/FeaturedProject/FeaturedProject.tsx`
- Modify: `components/FeaturedProject/FeaturedProject.module.css`
- Modify: `tests/unit/featured-project.test.tsx`
- Modify: `app/page.tsx`
- Modify: `readme.md`

**Interfaces:**
- Consumes: `project.alignment: "media-left" | "media-right"`.
- Produces: `data-alignment` and alignment-specific desktop grid placement.

- [ ] **Step 1: Add the failing alignment test**

```tsx
it("exposes content-owned desktop alignment", () => {
  const { rerender } = render(<FeaturedProject project={projectOne} />);
  expect(screen.getByRole("article")).toHaveAttribute("data-alignment", "media-left");
  rerender(<FeaturedProject project={{ ...projectOne, alignment: "media-right" }} />);
  expect(screen.getByRole("article")).toHaveAttribute("data-alignment", "media-right");
});
```

- [ ] **Step 2: Confirm and implement**

Run: `npm test -- tests/unit/featured-project.test.tsx`

Expected: FAIL because `data-alignment` is absent.

Add the attribute and CSS that places media in column two only for
`[data-alignment="media-right"]`. Render all three featured projects in content
order.

- [ ] **Step 3: Verify, document, and commit**

Run: `npm test -- tests/unit/featured-project.test.tsx && npm test && npm run build`

Expected: all pass.

Document alternating alignment in `readme.md`.

```bash
git add app/page.tsx components/FeaturedProject tests/unit/featured-project.test.tsx readme.md
git commit -m "feat: alternate featured project alignment"
```

### Task 8: Hide Featured Media on Mobile

**Files:**
- Modify: `components/FeaturedProject/FeaturedProject.tsx`
- Modify: `components/FeaturedProject/FeaturedProject.module.css`
- Modify: `tests/unit/featured-project.test.tsx`
- Create: `tests/e2e/homepage-mobile.spec.ts`
- Create: `playwright.config.ts`
- Modify: `.github/workflows/ci.yml`
- Modify: `package.json`
- Modify: `readme.md`

**Interfaces:**
- Consumes: `FeaturedProject`.
- Produces: `.media` hidden below the content-driven mobile breakpoint while text and link remain.

- [ ] **Step 1: Install Playwright and write the failing mobile test**

Run: `npm install --save-dev --save-exact @playwright/test@latest`
Run: `npx playwright install chromium`

Add scripts:

```json
{
  "test:e2e": "playwright test",
  "verify": "npm test && npm run build && npm run test:e2e"
}
```

Create `playwright.config.ts` with:

```ts
import { defineConfig, devices } from "@playwright/test";

const port = Number(process.env.PLAYWRIGHT_PORT ?? 3100);

export default defineConfig({
  testDir: "./tests/e2e",
  use: { baseURL: `http://127.0.0.1:${port}`, trace: "retain-on-failure" },
  webServer: {
    command: `npm run dev -- --hostname 127.0.0.1 --port ${port}`,
    url: `http://127.0.0.1:${port}`,
    reuseExistingServer: !process.env.CI
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }]
});
```

Extend CI with `npx playwright install --with-deps chromium` and
`npm run test:e2e`. Concurrent author worktrees receive distinct
`PLAYWRIGHT_PORT` values.

```ts
test("mobile homepage omits featured project media", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Project One" })).toBeVisible();
  await expect(page.getByRole("img", { name: "Abstract blue composition" })).toBeHidden();
});
```

- [ ] **Step 2: Confirm failure**

Run: `npx playwright test tests/e2e/homepage-mobile.spec.ts --project=chromium`

Expected: FAIL because the image is visible.

- [ ] **Step 3: Implement mobile art direction**

At `max-width: 47.99rem`, set `.media { display: none; }`, use one text column,
retain `clamp(5rem, 24vw, 10rem)` section spacing, and keep a minimum 44×44 CSS
pixel link target.

- [ ] **Step 4: Verify, document, and commit**

Run: `npx playwright test tests/e2e/homepage-mobile.spec.ts --project=chromium`

Expected: PASS.

Run: `npm test && npm run build`

Expected: all pass.

Document Playwright installation and browser setup in `readme.md`.

```bash
git add package.json package-lock.json playwright.config.ts tests/e2e components/FeaturedProject readme.md
git commit -m "feat: art direct featured projects for mobile"
```

### Task 9: Add Static Root-Level Project Routing

**Files:**
- Create: `app/[slug]/page.tsx`
- Create: `tests/unit/project-route.test.tsx`
- Create: `tests/e2e/project-navigation.spec.ts`
- Modify: `readme.md`

**Interfaces:**
- Consumes: `localContentSource.getProject()` and `.getProjectSlugs()`.
- Produces: `generateStaticParams()`, root-level project rendering, and 404 handling.

- [ ] **Step 1: Write the failing route tests**

```tsx
import { generateStaticParams } from "@/app/[slug]/page";

it("generates only known project slugs", async () => {
  await expect(generateStaticParams()).resolves.toEqual([
    { slug: "project-one" },
    { slug: "project-two" },
    { slug: "project-three" }
  ]);
});
```

```ts
for (const [name, slug] of [
  ["Project One", "project-one"],
  ["Project Two", "project-two"],
  ["Project Three", "project-three"]
] as const) {
test(`See more for ${name} reaches its root-level project`, async ({ page }) => {
  await page.goto("/");
  const project = page.getByRole("article").filter({ hasText: name });
  await project.getByRole("link", { name: "See more" }).click();
  await expect(page).toHaveURL(new RegExp(`/${slug}/$`));
});
}

test("unknown root slug returns 404", async ({ page }) => {
  const response = await page.goto("/unknown-project/");
  expect(response?.status()).toBe(404);
});
```

- [ ] **Step 2: Confirm failure**

Run: `npm test -- tests/unit/project-route.test.tsx`

Expected: FAIL because the dynamic route does not exist.

- [ ] **Step 3: Implement the route**

Export `dynamicParams = false`, map slugs in `generateStaticParams`, await
`params`, query the source, call `notFound()` when absent, and temporarily
render `<main><h1>{project.title}</h1></main>`.

- [ ] **Step 4: Verify, document, and commit**

Run: `npm test -- tests/unit/project-route.test.tsx && npm test && npm run build`

Run: `npx playwright test tests/e2e/project-navigation.spec.ts --project=chromium`

Expected: all pass; the build lists all three static project routes.

Document root-level routes and reserved slugs in `readme.md`.

```bash
git add app/[slug] tests/unit/project-route.test.tsx tests/e2e/project-navigation.spec.ts readme.md
git commit -m "feat: add root-level project routes"
```

### Task 10: Omit an Empty Archive

**Files:**
- Create: `components/ArchiveGallery/ArchiveGallery.tsx`
- Create: `tests/unit/archive-gallery.test.tsx`
- Modify: `app/page.tsx`
- Modify: `readme.md`

**Interfaces:**
- Consumes: `PortfolioImage[]`.
- Produces: `ArchiveGallery({ images }): JSX.Element | null`.

- [ ] **Step 1: Write the failing omission test**

```tsx
it("renders nothing for an empty Archive", () => {
  const { container } = render(<ArchiveGallery images={[]} />);
  expect(container).toBeEmptyDOMElement();
  expect(screen.queryByRole("heading", { name: "Archive" })).not.toBeInTheDocument();
});
```

- [ ] **Step 2: Confirm failure**

Run: `npm test -- tests/unit/archive-gallery.test.tsx`

Expected: FAIL because `ArchiveGallery` does not exist.

- [ ] **Step 3: Implement the empty state**

Return `null` when `images.length === 0`. Render it between featured projects
and contact in `app/page.tsx`.

- [ ] **Step 4: Verify, document, and commit**

Run: `npm test -- tests/unit/archive-gallery.test.tsx && npm test && npm run build`

Expected: all pass and the initial homepage has no Archive heading.

Update `readme.md` with the omission rule.

```bash
git add app/page.tsx components/ArchiveGallery tests/unit/archive-gallery.test.tsx readme.md
git commit -m "feat: omit empty Archive"
```

### Task 11: Render the Populated Archive Grid

**Files:**
- Create: `components/ArchiveGallery/ArchiveGallery.module.css`
- Modify: `components/ArchiveGallery/ArchiveGallery.tsx`
- Modify: `tests/unit/archive-gallery.test.tsx`
- Create: `tests/components/ArchiveGallery.spec.tsx`
- Create: `playwright-ct.config.ts`
- Modify: `.github/workflows/ci.yml`
- Modify: `package.json`
- Modify: `readme.md`

**Interfaces:**
- Consumes: ordered `PortfolioImage[]`.
- Produces: non-interactive natural-ratio gallery with 3/2/1 columns.

- [ ] **Step 1: Add the failing populated-state test**

```tsx
it("renders Archive images in source order without links", () => {
  render(<ArchiveGallery images={[imageOne, imageTwo, imageThree]} />);
  expect(screen.getByRole("heading", { name: "Archive" })).toBeVisible();
  expect(screen.getAllByRole("img").map((image) => image.getAttribute("alt")))
    .toEqual(["Blue study", "Orange study", "Green study"]);
  expect(screen.queryByRole("link")).not.toBeInTheDocument();
});
```

Add a failing CSS-contract test that reads
`components/ArchiveGallery/ArchiveGallery.module.css` and expects the base
three-column declaration, the `max-width: 63.99rem` two-column media query, the
`max-width: 47.99rem` one-column media query, and `height: auto`.

Install `@playwright/experimental-ct-react` at the exact same resolved version
as `@playwright/test`, configure `playwright-ct.config.ts`, and write a component
test that mounts three Archive images. At 1440, 768, and 390 widths, assert the
first-row image count is three, two, and one by comparing bounding-box `y`
coordinates; assert every rendered width/height ratio matches its intrinsic
ratio within 1%.

- [ ] **Step 2: Confirm failure**

Run: `npm test -- tests/unit/archive-gallery.test.tsx`

Run: `npx playwright test --config=playwright-ct.config.ts`

Expected: both suites FAIL because populated rendering and responsive grid CSS
are absent.

- [ ] **Step 3: Implement the gallery**

Render a `<section aria-labelledby="archive-title">`, one `<h2>`, and
`next/image` elements with intrinsic dimensions. CSS uses three columns above
64rem, two from 48rem through 63.99rem, and one below 48rem; set images to
`width: 100%; height: auto`.

Extend CI to install the Chromium browser and run the component-test config.

- [ ] **Step 4: Verify, document, and commit**

Run: `npm test -- tests/unit/archive-gallery.test.tsx`

Run: `npx playwright test --config=playwright-ct.config.ts`

Run: `npm test && npm run build`

Expected: all pass.

Document the Archive data shape and breakpoints in `readme.md`.

```bash
git add components/ArchiveGallery tests playwright-ct.config.ts .github/workflows/ci.yml package.json package-lock.json readme.md
git commit -m "feat: add responsive Archive gallery"
```

### Task 12: Add the Homepage Contact Link

**Files:**
- Create: `components/ContactLink/ContactLink.tsx`
- Create: `components/ContactLink/ContactLink.module.css`
- Create: `tests/unit/contact-link.test.tsx`
- Modify: `app/page.tsx`
- Modify: `readme.md`

**Interfaces:**
- Consumes: `email: string`.
- Produces: `ContactLink({ email })` with a `mailto:` target.

- [ ] **Step 1: Write the failing test**

```tsx
it("renders a touch-sized mail link", () => {
  render(<ContactLink email="hello@example.com" />);
  expect(screen.getByRole("link", { name: "hello@example.com" }))
    .toHaveAttribute("href", "mailto:hello@example.com");
});
```

- [ ] **Step 2: Confirm and implement**

Run: `npm test -- tests/unit/contact-link.test.tsx`

Expected: FAIL because the component does not exist.

Render an `<address>` containing the link. Style it with normal font style,
display inline-flex, minimum height 44px, large responsive type, and sufficient
closing whitespace.

- [ ] **Step 3: Verify, document, and commit**

Run: `npm test -- tests/unit/contact-link.test.tsx && npm test && npm run build`

Expected: all pass.

Document where to replace the email in `readme.md`.

```bash
git add app/page.tsx components/ContactLink tests/unit/contact-link.test.tsx readme.md
git commit -m "feat: add homepage contact link"
```

### Task 13: Render the Project Introduction

**Files:**
- Create: `components/ProjectPage/ProjectPage.tsx`
- Create: `components/ProjectPage/ProjectPage.module.css`
- Create: `tests/unit/project-page.test.tsx`
- Modify: `app/[slug]/page.tsx`
- Modify: `readme.md`

**Interfaces:**
- Consumes: `Project`.
- Produces: `ProjectPage({ project })` with one semantic introductory heading.

- [ ] **Step 1: Write the failing introduction test**

```tsx
it("opens with the project introduction and no repeated title", () => {
render(<ProjectPage project={projectOne} />);
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
    "A longer project introduction."
  );
  expect(screen.queryByRole("heading", { name: "Project One" })).not.toBeInTheDocument();
});
```

Import `projectOneFixture as projectOne` from
`tests/fixtures/content.ts`.

- [ ] **Step 2: Confirm and implement**

Run: `npm test -- tests/unit/project-page.test.tsx`

Expected: FAIL because `ProjectPage` does not exist.

Render the introduction as the only `<h1>`, with maximum width `24ch`,
display-size typography, top padding via `clamp(4rem, 10vw, 10rem)`, and
minimum opening height `70svh`.

- [ ] **Step 3: Verify, document, and commit**

Run: `npm test -- tests/unit/project-page.test.tsx && npm test && npm run build`

Expected: all pass.

Update project-page structure in `readme.md`.

```bash
git add app/[slug]/page.tsx components/ProjectPage tests/unit/project-page.test.tsx readme.md
git commit -m "feat: add project introduction"
```

### Task 14: Render Project Role Metadata

**Files:**
- Create: `components/ProjectMetadata/ProjectMetadata.tsx`
- Create: `components/ProjectMetadata/ProjectMetadata.module.css`
- Create: `tests/unit/project-metadata.test.tsx`
- Modify: `components/ProjectPage/ProjectPage.tsx`
- Modify: `readme.md`

**Interfaces:**
- Consumes: `roles: string[]`, later `results: string[]`.
- Produces: a labelled Role section.

- [ ] **Step 1: Write the failing Role test**

```tsx
it("renders Role items in source order", () => {
  render(<ProjectMetadata roles={["Research", "Prototyping"]} results={[]} />);
  const role = screen.getByRole("region", { name: "Role" });
  expect(within(role).getAllByRole("listitem").map((item) => item.textContent))
    .toEqual(["Research", "Prototyping"]);
});
```

- [ ] **Step 2: Confirm and implement**

Run: `npm test -- tests/unit/project-metadata.test.tsx`

Expected: FAIL because the component does not exist.

Render a labelled section with `<h2>Role</h2>` and a semantic list. Do not
render an empty Results region yet.

- [ ] **Step 3: Verify, document, and commit**

Run: `npm test -- tests/unit/project-metadata.test.tsx && npm test && npm run build`

Expected: all pass.

Document Role content in `readme.md`.

```bash
git add components/ProjectMetadata components/ProjectPage tests/unit/project-metadata.test.tsx readme.md
git commit -m "feat: add project Role metadata"
```

### Task 15: Add Results and Responsive Metadata Layout

**Files:**
- Modify: `components/ProjectMetadata/ProjectMetadata.tsx`
- Modify: `components/ProjectMetadata/ProjectMetadata.module.css`
- Modify: `tests/unit/project-metadata.test.tsx`
- Create: `tests/e2e/project-metadata-responsive.spec.ts`
- Modify: `readme.md`

**Interfaces:**
- Consumes: non-empty `roles` and `results`.
- Produces: Role then Results in DOM; two desktop columns and one mobile column.

- [ ] **Step 1: Add the failing order test**

```tsx
it("places Role before Results in document order", () => {
  render(<ProjectMetadata roles={["Research"]} results={["Higher completion"]} />);
  const regions = screen.getAllByRole("region");
  expect(regions.map((region) => region.getAttribute("aria-label")))
    .toEqual(["Role", "Results"]);
});
```

At the same time, write the Playwright geometry assertions that require
different horizontal positions at 1440×900 and matching horizontal positions
with increasing vertical coordinates at 390×844.

- [ ] **Step 2: Confirm and implement**

Run: `npm test -- tests/unit/project-metadata.test.tsx`

Run: `npx playwright test tests/e2e/project-metadata-responsive.spec.ts --project=chromium`

Expected: both suites FAIL because Results and its responsive layout are absent.

Render Results second. Use `grid-template-columns: repeat(2, minmax(0, 1fr))`
above 48rem and one column below it; never use CSS `order`.

- [ ] **Step 3: Verify responsive behavior**

Run: `npm test -- tests/unit/project-metadata.test.tsx`

Run: `npx playwright test tests/e2e/project-metadata-responsive.spec.ts --project=chromium`

Expected: all pass.

- [ ] **Step 4: Document and commit**

Update responsive metadata behavior in `readme.md`.

```bash
git add components/ProjectMetadata tests readme.md
git commit -m "feat: add responsive Results metadata"
```

### Task 16: Add Opening Project Media

**Files:**
- Create: `lib/image-style.ts`
- Create: `tests/unit/image-style.test.ts`
- Modify: `components/ProjectPage/ProjectPage.tsx`
- Modify: `components/ProjectPage/ProjectPage.module.css`
- Modify: `tests/unit/project-page.test.tsx`
- Modify: `readme.md`

**Interfaces:**
- Consumes: `PortfolioImage`.
- Produces: `getImageStyle(image): { objectFit?: "cover"; objectPosition?: string; aspectRatio?: string }` and opening media after metadata.

- [ ] **Step 1: Write failing focal-point and order tests**

```ts
it("converts normalized focal coordinates to percentages", () => {
  expect(getImageStyle({
    ...detailImageA,
    focalPoint: { x: 0.25, y: 0.75 },
    presentation: { mode: "crop", aspectRatio: "16/9" }
  })).toEqual({
    objectFit: "cover",
    objectPosition: "25% 75%",
    aspectRatio: "16/9"
  });
  expect(getImageStyle({
    ...detailImageA,
    focalPoint: { x: 0.25, y: 0.75 },
    presentation: { mode: "natural" }
  })).toEqual({});
});
```

```tsx
it("places opening media after Role and Results", () => {
render(<ProjectPage project={projectOne} />);
  const role = screen.getByRole("region", { name: "Role" });
  const results = screen.getByRole("region", { name: "Results" });
  const image = screen.getByRole("img", { name: "Abstract blue composition" });
  expect(role.compareDocumentPosition(results) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  expect(results.compareDocumentPosition(image) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
});
```

Import `projectOneFixture as projectOne` and the image fixtures from
`tests/fixtures/content.ts`.

- [ ] **Step 2: Confirm and implement**

Run: `npm test -- tests/unit/image-style.test.ts tests/unit/project-page.test.tsx`

Expected: FAIL because the helper and opening image are absent.

Implement the pure style helper and render `next/image` after metadata,
using intrinsic dimensions, `height: auto`, side margins, and no crop by
default.

- [ ] **Step 3: Verify, document, and commit**

Run: `npm test -- tests/unit/image-style.test.ts tests/unit/project-page.test.tsx`

Run: `npm test && npm run build`

Expected: all pass.

Document intrinsic dimensions and focal points in `readme.md`.

```bash
git add lib/image-style.ts components/ProjectPage tests readme.md
git commit -m "feat: add opening project media"
```

### Task 17: Add the Editorial Renderer and Statement Block

**Files:**
- Create: `components/CaseStudyRenderer/CaseStudyRenderer.tsx`
- Create: `components/CaseStudyRenderer/CaseStudyRenderer.module.css`
- Create: `tests/unit/case-study-renderer.test.tsx`
- Modify: `components/ProjectPage/ProjectPage.tsx`
- Modify: `content/local-content.ts`
- Modify: `tests/unit/content-source.test.ts`
- Modify: `readme.md`

**Interfaces:**
- Consumes: `EditorialBlock[]`.
- Produces: `CaseStudyRenderer({ blocks })` with exhaustive dispatch; initial support for `statement`.

- [ ] **Step 1: Write the failing statement test**

```tsx
it("renders a statement block", () => {
  render(<CaseStudyRenderer blocks={[
    { type: "statement", text: "Design should make the complex feel ordinary." }
  ]} />);
  expect(screen.getByText("Design should make the complex feel ordinary."))
    .toHaveAttribute("data-block", "statement");
});
```

- [ ] **Step 2: Confirm and implement**

Run: `npm test -- tests/unit/case-study-renderer.test.tsx`

Expected: FAIL because the renderer does not exist.

Implement ordered mapping with stable keys derived from array position and
block type. Render statements as large `<p data-block="statement">` text with
maximum width `28ch`, tight line-height, and responsive section spacing. Throw
an explicit `Unsupported editorial block: ${block.type}` error for a
discriminant not implemented in the current increment. Add the tested statement
block to `project-one` local content and assert its type in the content-source
test.

- [ ] **Step 3: Verify, document, and commit**

Run: `npm test -- tests/unit/case-study-renderer.test.tsx && npm test && npm run build`

Expected: all pass.

Add the statement block example to `docs/content-editing.md` and keep the
README link current.

```bash
git add components/CaseStudyRenderer components/ProjectPage content/local-content.ts tests/unit/case-study-renderer.test.tsx tests/unit/content-source.test.ts docs/content-editing.md readme.md
git commit -m "feat: add case study statement block"
```

### Task 18: Add Rich Text and List Nodes

**Files:**
- Create: `components/CaseStudyRenderer/RichText.tsx`
- Create: `components/CaseStudyRenderer/RichText.module.css`
- Modify: `components/CaseStudyRenderer/CaseStudyRenderer.tsx`
- Modify: `tests/unit/case-study-renderer.test.tsx`
- Modify: `content/local-content.ts`
- Modify: `tests/unit/content-source.test.ts`
- Modify: `docs/content-editing.md`
- Modify: `readme.md`

**Interfaces:**
- Consumes: `RichTextNode[]` containing paragraph, heading, orderedList, or unorderedList nodes.
- Produces: `RichText({ nodes })` and `richText` dispatch.

- [ ] **Step 1: Write the failing semantic-node test**

```tsx
it("renders typed rich text without HTML injection", () => {
  render(<CaseStudyRenderer blocks={[{
    type: "richText",
    nodes: [
      { type: "heading", level: 2, text: "The challenge" },
      { type: "paragraph", text: "A clear problem statement." },
      { type: "orderedList", items: ["Observe", "Prototype", "Validate"] }
    ]
  }]} />);
  expect(screen.getByRole("heading", { level: 2, name: "The challenge" })).toBeVisible();
  expect(screen.getAllByRole("listitem").map((item) => item.textContent))
    .toEqual(["Observe", "Prototype", "Validate"]);
});
```

- [ ] **Step 2: Confirm and implement**

Run: `npm test -- tests/unit/case-study-renderer.test.tsx`

Expected: FAIL because `richText` is not dispatched.

Implement explicit JSX for each node. Do not use `dangerouslySetInnerHTML`.
Limit prose to `65ch` and preserve source order. Add the tested rich-text block
to `project-one` and assert the canonical block-type sequence.

- [ ] **Step 3: Verify, document, and commit**

Run: `npm test -- tests/unit/case-study-renderer.test.tsx && npm test && npm run build`

Expected: all pass.

Add exact JSON examples for every rich-text node to `docs/content-editing.md`.

```bash
git add components/CaseStudyRenderer content/local-content.ts tests/unit/case-study-renderer.test.tsx tests/unit/content-source.test.ts docs/content-editing.md readme.md
git commit -m "feat: add typed rich text blocks"
```

### Task 19: Add Two-Column Prose

**Files:**
- Modify: `components/CaseStudyRenderer/CaseStudyRenderer.tsx`
- Modify: `components/CaseStudyRenderer/CaseStudyRenderer.module.css`
- Modify: `tests/unit/case-study-renderer.test.tsx`
- Create: `tests/e2e/two-column-prose.spec.ts`
- Modify: `content/local-content.ts`
- Modify: `tests/unit/content-source.test.ts`
- Modify: `docs/content-editing.md`
- Modify: `readme.md`

**Interfaces:**
- Consumes: `{ type: "twoColumnProse"; left; right }`.
- Produces: left-before-right DOM order, two desktop columns, one mobile column.

- [ ] **Step 1: Write the failing order test**

```tsx
it("keeps two-column prose in left then right document order", () => {
  render(<CaseStudyRenderer blocks={[{
    type: "twoColumnProse",
    left: [{ type: "paragraph", text: "Left narrative." }],
    right: [{ type: "paragraph", text: "Right narrative." }]
  }]} />);
  const paragraphs = screen.getAllByText(/narrative/);
  expect(paragraphs.map((node) => node.textContent))
    .toEqual(["Left narrative.", "Right narrative."]);
});
```

Also write the Playwright geometry assertions that require different desktop
`x` values and matching mobile `x` values with increasing `y`.

- [ ] **Step 2: Confirm and implement**

Run: `npm test -- tests/unit/case-study-renderer.test.tsx`

Run: `npx playwright test tests/e2e/two-column-prose.spec.ts --project=chromium`

Expected: both suites FAIL because `twoColumnProse` is not dispatched.

Render two child regions in source order. Use two equal columns above 48rem and
one below; do not use CSS order. Add the tested block to `project-one` and
extend the canonical block-type assertion.

- [ ] **Step 3: Verify viewport geometry**

Run: `npm test -- tests/unit/case-study-renderer.test.tsx`

Run: `npx playwright test tests/e2e/two-column-prose.spec.ts --project=chromium`

Expected: all pass.

- [ ] **Step 4: Document and commit**

Add the block example to `docs/content-editing.md`.

```bash
git add components/CaseStudyRenderer content/local-content.ts tests/unit/case-study-renderer.test.tsx tests/unit/content-source.test.ts tests/e2e/two-column-prose.spec.ts docs/content-editing.md readme.md
git commit -m "feat: add responsive two-column prose"
```

### Task 20: Add the Single-Image Editorial Block

**Files:**
- Modify: `components/CaseStudyRenderer/CaseStudyRenderer.tsx`
- Modify: `components/CaseStudyRenderer/CaseStudyRenderer.module.css`
- Modify: `tests/unit/case-study-renderer.test.tsx`
- Modify: `content/local-content.ts`
- Modify: `tests/unit/content-source.test.ts`
- Modify: `docs/content-editing.md`
- Modify: `readme.md`

**Interfaces:**
- Consumes: `{ type: "image"; image: PortfolioImage }`.
- Produces: intrinsic-ratio editorial image with optional focal-point style only when cropped presentation is explicit.

- [ ] **Step 1: Write the failing image test**

```tsx
it("renders a single editorial image with intrinsic metadata", () => {
  render(<CaseStudyRenderer blocks={[{ type: "image", image: detailImage }]} />);
  const image = screen.getByRole("img", { name: "Blue detail composition" });
  expect(image).toHaveAttribute("width", "1600");
  expect(image).toHaveAttribute("height", "1000");
});

it("omits an optional image block without residual markup", () => {
  const { container } = render(
    <CaseStudyRenderer blocks={[{ type: "image", image: null }]} />
  );
  expect(container).toBeEmptyDOMElement();
});
```

- [ ] **Step 2: Confirm and implement**

Run: `npm test -- tests/unit/case-study-renderer.test.tsx`

Expected: FAIL because `image` is not dispatched.

Render a `<figure data-block="image">` with `next/image`, intrinsic dimensions,
responsive `sizes`, `width: 100%`, `height: auto`, and visible side margins.
Return `null` before creating the figure when `image` is null. Apply
`getImageStyle` only for explicit cropped presentation. Add the tested block to
`project-one` and extend the block-type assertion.

- [ ] **Step 3: Verify, document, and commit**

Run: `npm test -- tests/unit/case-study-renderer.test.tsx && npm test && npm run build`

Expected: all pass.

Add the image example and alternative-text rules to `docs/content-editing.md`.

```bash
git add components/CaseStudyRenderer content/local-content.ts tests/unit/case-study-renderer.test.tsx tests/unit/content-source.test.ts docs/content-editing.md readme.md
git commit -m "feat: add single-image editorial block"
```

### Task 21: Add Two- and Three-Image Media Groups

**Files:**
- Modify: `components/CaseStudyRenderer/CaseStudyRenderer.tsx`
- Modify: `components/CaseStudyRenderer/CaseStudyRenderer.module.css`
- Modify: `tests/unit/case-study-renderer.test.tsx`
- Create: `tests/e2e/media-group-responsive.spec.ts`
- Modify: `content/local-content.ts`
- Modify: `tests/unit/content-source.test.ts`
- Modify: `docs/content-editing.md`
- Modify: `readme.md`

**Interfaces:**
- Consumes: `mediaGroup.images` tuple of exactly two or three images.
- Produces: source-ordered desktop group and mobile stack.

- [ ] **Step 1: Write the failing source-order test**

```tsx
it("renders a three-image group in source order", () => {
  render(<CaseStudyRenderer blocks={[{
    type: "mediaGroup",
    images: [detailImageA, detailImageB, detailImageC]
  }]} />);
  expect(screen.getAllByRole("img").map((image) => image.getAttribute("alt")))
    .toEqual(["Blue detail", "Orange detail", "Green detail"]);
});
```

Also write the Playwright geometry assertions that require three distinct
desktop `x` coordinates and one shared mobile `x` coordinate.

- [ ] **Step 2: Confirm and implement**

Run: `npm test -- tests/unit/case-study-renderer.test.tsx`

Run: `npx playwright test tests/e2e/media-group-responsive.spec.ts --project=chromium`

Expected: both suites FAIL because `mediaGroup` is not dispatched.

Render one figure per image. Desktop uses `repeat(var(--media-count),
minmax(0, 1fr))`; mobile uses one column. Preserve intrinsic ratios and source
order. Add the tested group to `project-one` and extend the block-type
assertion.

- [ ] **Step 3: Verify responsive geometry**

Run: `npm test -- tests/unit/case-study-renderer.test.tsx`

Run: `npx playwright test tests/e2e/media-group-responsive.spec.ts --project=chromium`

Expected: all pass.

- [ ] **Step 4: Document and commit**

Add two- and three-image JSON examples to `docs/content-editing.md`.

```bash
git add components/CaseStudyRenderer content/local-content.ts tests/unit/case-study-renderer.test.tsx tests/unit/content-source.test.ts tests/e2e/media-group-responsive.spec.ts docs/content-editing.md readme.md
git commit -m "feat: add responsive media groups"
```

### Task 22: Add the Asymmetrical Text-and-Media Split

**Files:**
- Modify: `components/CaseStudyRenderer/CaseStudyRenderer.tsx`
- Modify: `components/CaseStudyRenderer/CaseStudyRenderer.module.css`
- Modify: `tests/unit/case-study-renderer.test.tsx`
- Create: `tests/e2e/text-media-split.spec.ts`
- Modify: `content/local-content.ts`
- Modify: `tests/unit/content-source.test.ts`
- Modify: `docs/content-editing.md`
- Modify: `readme.md`

**Interfaces:**
- Consumes: `textMediaSplit` with heading, nodes, image, and `mediaSide`.
- Produces: content-owned desktop side; heading/text/image semantic order on mobile.

- [ ] **Step 1: Write the failing semantic-order test**

```tsx
it("renders split copy before media in document order", () => {
  render(<CaseStudyRenderer blocks={[{
    type: "textMediaSplit",
    heading: "What changed",
    nodes: [{ type: "paragraph", text: "The flow became easier to understand." }],
    image: detailImageA,
    mediaSide: "left"
  }]} />);
  const heading = screen.getByRole("heading", { name: "What changed" });
  const image = screen.getByRole("img", { name: "Blue detail" });
  expect(heading.compareDocumentPosition(image) & Node.DOCUMENT_POSITION_FOLLOWING)
    .toBeTruthy();
});
```

Also write the Playwright assertions requiring the left-side image to have a
smaller desktop `x` coordinate than copy and a greater mobile `y` coordinate.

- [ ] **Step 2: Confirm and implement**

Run: `npm test -- tests/unit/case-study-renderer.test.tsx`

Run: `npx playwright test tests/e2e/text-media-split.spec.ts --project=chromium`

Expected: both suites FAIL because `textMediaSplit` is not dispatched.

Keep copy before media in JSX. On desktop, place media left or right with named
grid areas; on mobile, use one column with copy then image regardless of
`mediaSide`. Add the tested split to `project-one`, assert that the canonical
block types are exactly `statement`, `richText`, `twoColumnProse`, `image`,
`mediaGroup`, and `textMediaSplit`, then replace the temporary unsupported-block
error with an exhaustive `never` guard.

- [ ] **Step 3: Verify visual side without changing DOM order**

Run: `npm test -- tests/unit/case-study-renderer.test.tsx`

Run: `npx playwright test tests/e2e/text-media-split.spec.ts --project=chromium`

Expected: all pass.

- [ ] **Step 4: Document and commit**

Add the split block example to `docs/content-editing.md`.

```bash
git add components/CaseStudyRenderer content/local-content.ts tests/unit/case-study-renderer.test.tsx tests/unit/content-source.test.ts tests/e2e/text-media-split.spec.ts docs/content-editing.md readme.md
git commit -m "feat: add asymmetrical text and media block"
```

### Task 23: Add Project Home Navigation

**Files:**
- Create: `components/ProjectFooter/ProjectFooter.tsx`
- Create: `components/ProjectFooter/ProjectFooter.module.css`
- Create: `tests/unit/project-footer.test.tsx`
- Modify: `components/ProjectPage/ProjectPage.tsx`
- Modify: `tests/e2e/project-navigation.spec.ts`
- Modify: `readme.md`

**Interfaces:**
- Consumes: no project data.
- Produces: footer `Home` link with `href="/#top"`.

- [ ] **Step 1: Write the failing Home test**

```tsx
it("links Home to the top of the homepage", () => {
  render(<ProjectFooter />);
  expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/#top");
});
```

- [ ] **Step 2: Confirm and implement**

Run: `npm test -- tests/unit/project-footer.test.tsx`

Expected: FAIL because `ProjectFooter` does not exist.

Add `id="top"` to the homepage main element. Render a project `<footer>` with
the Home link and spacious responsive layout. Do not add global navigation.

- [ ] **Step 3: Verify route and scroll destination**

Add Playwright coverage that starts on the homepage, scrolls down, enters
`/project-one/`, scrolls the project, clicks Home, expects `/#top`, and expects
`window.scrollY` to be zero. This proves the previous homepage position is not
restored by Home.

Run: `npm test -- tests/unit/project-footer.test.tsx`

Run: `npx playwright test tests/e2e/project-navigation.spec.ts --project=chromium`

Expected: all pass.

- [ ] **Step 4: Document and commit**

Document Home versus browser Back behavior in `readme.md`.

```bash
git add app/page.tsx components/ProjectFooter components/ProjectPage tests readme.md
git commit -m "feat: add project Home navigation"
```

### Task 24: Add Reduced-Motion-Aware Up Scrolling

**Files:**
- Modify: `components/ProjectFooter/ProjectFooter.tsx`
- Modify: `tests/unit/project-footer.test.tsx`
- Create: `tests/e2e/project-up.spec.ts`
- Modify: `readme.md`

**Interfaces:**
- Consumes: `window.matchMedia("(prefers-reduced-motion: reduce)")`.
- Produces: `Up` button calling `scrollTo({ top: 0, behavior })`.

- [ ] **Step 1: Write the failing unit tests**

```tsx
it("smoothly scrolls Up by default", async () => {
  vi.spyOn(window, "matchMedia").mockReturnValue({ matches: false } as MediaQueryList);
  const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => undefined);
  render(<ProjectFooter />);
  await userEvent.click(screen.getByRole("button", { name: "Up" }));
  expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
});

it("uses immediate scrolling for reduced motion", async () => {
  vi.spyOn(window, "matchMedia").mockReturnValue({ matches: true } as MediaQueryList);
  const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => undefined);
  render(<ProjectFooter />);
  await userEvent.click(screen.getByRole("button", { name: "Up" }));
  expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "auto" });
});
```

- [ ] **Step 2: Confirm and implement**

Run: `npm test -- tests/unit/project-footer.test.tsx`

Expected: FAIL because the Up button is absent.

Make only `ProjectFooter` a client component. Add a semantic button with the
media-query behavior above; do not intercept normal page scrolling.

- [ ] **Step 3: Verify in Chromium**

In Playwright, scroll to the footer, click Up, and poll until `scrollY === 0`;
repeat with reduced motion emulation.

Run: `npm test -- tests/unit/project-footer.test.tsx`

Run: `npx playwright test tests/e2e/project-up.spec.ts --project=chromium`

Expected: all pass.

Extend `tests/e2e/project-navigation.spec.ts` with a data-driven check that
`/project-one/`, `/project-two/`, and `/project-three/` each render Role,
Results, opening media, Home, and Up. Run that file before committing.

- [ ] **Step 4: Document and commit**

Document native scrolling and reduced-motion behavior in `readme.md`.

```bash
git add components/ProjectFooter tests readme.md
git commit -m "feat: add accessible Up scrolling"
```

### Task 25: Prevent Indexing While the Site Is Not Ready

**Files:**
- Create: `lib/discovery.ts`
- Create: `app/robots.ts`
- Create: `app/sitemap.ts`
- Create: `tests/unit/discovery.test.ts`
- Modify: `app/layout.tsx`
- Modify: `app/[slug]/page.tsx`
- Create: `docs/launch.md`
- Modify: `readme.md`

**Interfaces:**
- Consumes: `siteReady`, `VERCEL_ENV`.
- Produces: `isIndexable({ siteReady, vercelEnv })`,
  `buildRobotsMetadata(...)`, `buildPageRobotsMetadata(...)`, noindex metadata,
  disallowing robots, and an empty sitemap.

- [ ] **Step 1: Write failing readiness tests**

```ts
describe("isIndexable", () => {
  it("rejects incomplete production content", () => {
    expect(isIndexable({ siteReady: false, vercelEnv: "production" })).toBe(false);
  });

  it("rejects previews even when content is ready", () => {
    expect(isIndexable({ siteReady: true, vercelEnv: "preview" })).toBe(false);
  });
});
```

Also test `robots()` returns `{ rules: { userAgent: "*", disallow: "/" } }`
and `sitemap()` returns `[]` in the default local-content state. Use table tests
for all four `siteReady × VERCEL_ENV` combinations and assert homepage and
project page robots metadata are `noindex, nofollow` except ready production.

- [ ] **Step 2: Confirm and implement**

Run: `npm test -- tests/unit/discovery.test.ts`

Expected: FAIL because discovery helpers and metadata routes do not exist.

Implement pure `isIndexable`, `buildRobotsMetadata`, and
`buildPageRobotsMetadata` functions. Generate root and project robots metadata
from them. Keep `siteReady: false` in local content. Return the disallowing
robots policy and empty sitemap.

- [ ] **Step 3: Verify, document, and commit**

Run: `npm test -- tests/unit/discovery.test.ts && npm test && npm run build`

Expected: all pass; generated pages contain `noindex, nofollow`.

Write `docs/launch.md` with the exact default non-indexable behavior and link it
from `readme.md`.

```bash
git add lib/discovery.ts app/robots.ts app/sitemap.ts app/layout.tsx app/[slug]/page.tsx tests/unit/discovery.test.ts docs/launch.md readme.md
git commit -m "feat: keep incomplete portfolio out of search"
```

### Task 26: Enable Complete Discovery Metadata

**Files:**
- Modify: `lib/discovery.ts`
- Modify: `app/layout.tsx`
- Modify: `app/[slug]/page.tsx`
- Modify: `app/robots.ts`
- Modify: `app/sitemap.ts`
- Create: `app/manifest.ts`
- Modify: `tests/unit/discovery.test.ts`
- Modify: `docs/launch.md`
- Modify: `readme.md`

**Interfaces:**
- Consumes: indexable readiness plus `NEXT_PUBLIC_SITE_URL`.
- Produces: `buildRouteMetadata(...)`, canonical URLs, project metadata, Open
  Graph values, crawl-allowing robots, populated sitemap, manifest.

- [ ] **Step 1: Add failing ready-state tests**

```ts
it("allows only ready production deployments", () => {
  expect(isIndexable({ siteReady: true, vercelEnv: "production" })).toBe(true);
});

it("lists homepage and all projects when ready", async () => {
  const entries = await buildSitemap({
    indexable: true,
    siteUrl: "https://portfolio.example",
    slugs: ["project-one", "project-two", "project-three"]
  });
  expect(entries.map((entry) => entry.url)).toEqual([
    "https://portfolio.example/",
    "https://portfolio.example/project-one/",
    "https://portfolio.example/project-two/",
    "https://portfolio.example/project-three/"
  ]);
});

it.each([
  { route: "/", title: "Portfolio" },
  { route: "/project-one/", title: "Project One" }
])("builds ready production discovery metadata for $route", ({ route, title }) => {
  const metadata = buildRouteMetadata({
    indexable: true,
    siteUrl: "https://portfolio.example",
    route,
    title,
    description: "Product design portfolio",
    image: "/placeholders/project-one.svg"
  });
  expect(metadata.alternates?.canonical).toBe(`https://portfolio.example${route}`);
  expect(metadata.openGraph?.title).toBe(title);
  expect(metadata.robots).toEqual({ index: true, follow: true });
});
```

- [ ] **Step 2: Confirm and implement**

Run: `npm test -- tests/unit/discovery.test.ts`

Expected: FAIL because ready-state sitemap generation is absent.

Add pure `buildSitemap` and `buildRouteMetadata`. Use the latter from
`generateMetadata` for project title, description, canonical, and local Open
Graph image. Require an absolute
`NEXT_PUBLIC_SITE_URL` only when indexable. Allow crawling and list all routes
when ready. Add a minimal manifest with name, short name, `/`, white background,
and black theme.

- [ ] **Step 3: Verify, document, and commit**

Run: `npm test -- tests/unit/discovery.test.ts && npm test && npm run build`

Expected: all pass.

Document the exact launch changes: replace content and email, set the production
site URL, set `siteReady: true`, inspect metadata, deploy, then verify robots and
sitemap. State that previews remain noindex.

```bash
git add lib/discovery.ts app tests/unit/discovery.test.ts docs/launch.md readme.md
git commit -m "feat: add readiness-controlled discovery metadata"
```

### Task 27: Add Automated WCAG Checks

**Files:**
- Create: `tests/e2e/accessibility.spec.ts`
- Create: `tests/unit/scope-guard.test.ts`
- Create: `docs/accessibility.md`
- Modify: `.github/workflows/ci.yml`
- Modify: `package.json`
- Modify: `playwright.config.ts`
- Modify: `readme.md`

**Interfaces:**
- Consumes: rendered homepage and three project routes.
- Produces: axe WCAG 2.2 A/AA checks in Chromium plus keyboard focus assertions.

- [ ] **Step 1: Install axe and write the failing audit**

Run: `npm install --save-dev @axe-core/playwright`

```ts
for (const route of ["/", "/project-one/", "/project-two/", "/project-three/"]) {
  test(`${route} has no detectable WCAG A or AA violations`, async ({ page }) => {
    await page.goto(route);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
}
```

Add a scope guard:

```ts
it("ships without analytics, video, or motion dependencies", () => {
  const packageJson = JSON.parse(readFileSync("package.json", "utf8"));
  const names = Object.keys({
    ...packageJson.dependencies,
    ...packageJson.devDependencies
  });
  expect(names.some((name) => /analytics|framer-motion|video/i.test(name))).toBe(false);
});
```

Add an end-to-end assertion that no script URL contains `analytics`,
`speed-insights`, or `tracking`.

Extend CI so Chromium Playwright runs the axe and scope checks as required
statuses.

- [ ] **Step 2: Run and record genuine failures**

Run: `npx playwright test tests/e2e/accessibility.spec.ts --project=chromium`

Expected: the command produces a definitive WCAG report; any reported violation
makes the test fail and becomes the concrete fix checklist.

- [ ] **Step 3: Fix only reported violations**

Correct semantic structure, labels, contrast tokens, focus styles, or target
sizes in the owning components. Do not suppress axe rules. Add a keyboard test
that tabs through every visible `See more`, contact, Home, and Up control and
asserts a visible focus outline.

- [ ] **Step 4: Verify, document, and commit**

Run: `npx playwright test tests/e2e/accessibility.spec.ts --project=chromium`

Run: `npm test && npm run build`

Expected: all pass.

Create `docs/accessibility.md` with a manual WCAG review table containing
reviewer, date, browser/device, headings, keyboard, focus, alternative text,
200% zoom, reduced motion, touch targets, result, and blockers. Complete the
table during review and link it from `readme.md`.

```bash
git add package.json package-lock.json playwright.config.ts .github/workflows/ci.yml tests/e2e/accessibility.spec.ts tests/unit/scope-guard.test.ts docs/accessibility.md app components readme.md
git commit -m "test: enforce portfolio accessibility"
```

### Task 28: Run the Supported-Browser Matrix

**Files:**
- Modify: `playwright.config.ts`
- Create: `tests/e2e/browser-matrix.spec.ts`
- Create: `docs/browser-compatibility.md`
- Modify: `.github/workflows/ci.yml`
- Modify: `readme.md`

**Interfaces:**
- Consumes: all public routes and interactions.
- Produces: Chromium, WebKit, and Firefox projects plus mobile emulation checks.

- [ ] **Step 1: Add browser projects and a failing matrix assertion**

Configure desktop Chromium, WebKit, and Firefox at 1440×900, plus iPhone-sized
WebKit and Android-sized Chromium at 390×844.

Run: `npx playwright install chromium webkit firefox`

Extend CI with
`npx playwright install --with-deps chromium webkit firefox` before the full
Playwright matrix.

```ts
test("core routes and controls work in every configured browser", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.getByRole("link", { name: "See more" }).first().click();
  await expect(page).toHaveURL(/\/project-one\/$/);
  await expect(page.getByRole("link", { name: "Home" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Up" })).toBeVisible();
});
```

- [ ] **Step 2: Run the full matrix and capture failures**

Run: `npx playwright test tests/e2e/browser-matrix.spec.ts`

Expected: every configured engine runs the same acceptance test; any
configuration or compatibility defect appears as a failing project result.

- [ ] **Step 3: Correct compatibility defects**

Fix only demonstrated defects. Prefer standards-based CSS; add a targeted
fallback only when a supported engine requires it. Do not add user-agent
sniffing.

- [ ] **Step 4: Verify, document, and commit**

Run: `npx playwright test`

Run: `npm test && npm run build`

Expected: the full matrix, unit suite, and build pass.

Record Playwright/browser versions, date, routes, controls, result, and any
available real-device checks in `docs/browser-compatibility.md`; link it from
`readme.md`. Automation proves the current bundled Playwright engines. Previous
major desktop versions remain a compatibility target and must never be reported
as directly tested unless those exact versions were actually exercised.

```bash
git add playwright.config.ts tests/e2e/browser-matrix.spec.ts docs/browser-compatibility.md .github/workflows/ci.yml app components readme.md
git commit -m "test: verify supported browser matrix"
```

### Task 29: Calibrate and Approve Visual Baselines

**Files:**
- Create: `tests/e2e/visual.spec.ts`
- Create: `tests/e2e/visual.spec.ts-snapshots/`
- Create: `docs/visual-qa.md`
- Modify: `.github/workflows/ci.yml`
- Modify: component CSS modules and `app/globals.css` only as review requires
- Modify: `readme.md`

**Interfaces:**
- Consumes: the complete homepage and canonical `/project-one/`.
- Produces: approved screenshots at 1440×900, 768×1024, and 390×844.

**Execution dependency:** Run this task after Task 30 so performance changes
cannot invalidate already approved screenshots.

- [ ] **Step 1: Write screenshot tests before accepting images**

```ts
for (const viewport of [
  { name: "desktop", width: 1440, height: 900 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 390, height: 844 }
]) {
  test(`${viewport.name} compositions`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await expect(page).toHaveScreenshot(`home-${viewport.name}.png`, { fullPage: true });
    await page.goto("/project-one/");
    await expect(page).toHaveScreenshot(`project-one-${viewport.name}.png`, { fullPage: true });
  });
}
```

- [ ] **Step 2: Generate candidates and confirm the expected missing-snapshot failure**

Run: `npx playwright test tests/e2e/visual.spec.ts --project=chromium`

Expected: FAIL because no approved project baselines exist; Playwright writes
candidate images.

- [ ] **Step 3: Review against supplied reference screenshots**

Open each candidate at native scale. Record typography, wrapping, whitespace,
alignment, media proportions, and mobile sequencing in `docs/visual-qa.md`.
Adjust only CSS and presentation metadata, rerun screenshots, and present the
desktop and mobile candidates to the user. Pause until both are explicitly
approved; treat tablet as interpolation review.

- [ ] **Step 4: Accept only approved baselines**

Run: `npx playwright test tests/e2e/visual.spec.ts --project=chromium --update-snapshots`

Then run the same command without `--update-snapshots`.

Expected: PASS against the approved images.

- [ ] **Step 5: Verify, document, and commit**

Run: `npx playwright test && npm test && npm run build`

Expected: all pass.

Record approval date, viewport, browser version, and reviewed pages in
`docs/visual-qa.md`; link it from `readme.md`. Add the approved Chromium visual
suite to CI only after the baselines have received explicit user approval.

```bash
git add app components tests/e2e/visual.spec.ts tests/e2e/visual.spec.ts-snapshots docs/visual-qa.md .github/workflows/ci.yml readme.md
git commit -m "test: approve responsive visual baselines"
```

### Task 30: Enforce Performance Budgets

**Files:**
- Create: `lighthouserc.cjs`
- Modify: `package.json`
- Create: `docs/performance.md`
- Modify: `.github/workflows/ci.yml`
- Modify: image `sizes`, preload, or CSS only when measurements require
- Modify: `readme.md`

**Interfaces:**
- Consumes: production server at the worktree-specific `LHCI_PORT`.
- Produces: repeatable Lighthouse CI assertions for homepage and canonical case study.

- [ ] **Step 1: Install Lighthouse CI and add failing assertions**

Run: `npm install --save-dev --save-exact @lhci/cli@latest`

```js
// lighthouserc.cjs
const port = Number(process.env.LHCI_PORT ?? 3200);

module.exports = {
  ci: {
    collect: {
      startServerCommand: `npm run start -- --hostname 127.0.0.1 --port ${port}`,
      startServerReadyPattern: "Ready",
      url: [
        `http://127.0.0.1:${port}/`,
        `http://127.0.0.1:${port}/project-one/`
      ],
      numberOfRuns: 3,
      settings: { preset: "desktop" }
    },
    assert: {
      assertions: {
        "largest-contentful-paint": ["error", { maxNumericValue: 2500 }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.1 }],
        "total-blocking-time": ["error", { maxNumericValue: 200 }]
      }
    },
    upload: { target: "filesystem", outputDir: ".lighthouseci" }
  }
};
```

Each concurrent worktree receives a distinct `LHCI_PORT`. The pre-launch
responsiveness gate uses TBT ≤ 200 ms as a lab proxy; the INP < 200 ms target is
verified from field data after launch when Search Console has sufficient data.

- [ ] **Step 2: Build, measure, and retain the first failing report**

Run: `npm run build && npx lhci autorun`

Expected: Lighthouse writes three-run reports for both routes; any LCP, CLS, or
TBT threshold breach makes the command fail.

- [ ] **Step 3: Correct measured bottlenecks**

Use the report to set accurate `sizes`, reserve media dimensions, remove
render-blocking work, and preload only the local font and actual LCP image.
Do not weaken thresholds to obtain a pass.

- [ ] **Step 4: Verify, document, and commit**

Run: `npm run build && npx lhci autorun`

Run: `npm test && npx playwright test`

Expected: all pass across three Lighthouse runs and the existing suites.

Record median LCP, CLS, and TBT for both routes in `docs/performance.md`. Explain
that TBT is a lab responsiveness proxy and real INP is checked later through
Search Console without adding analytics. Add a serialized production-build LHCI
job to CI so it cannot contend with another server on the same port.

```bash
git add lighthouserc.cjs package.json package-lock.json .github/workflows/ci.yml app components docs/performance.md readme.md
git commit -m "test: enforce portfolio performance budgets"
```

### Task 31: Configure and Verify the Vercel Handoff

**Files:**
- Create: `.env.example`
- Create: `docs/deployment.md`
- Modify: `.gitignore`
- Modify: `docs/launch.md`
- Modify: `readme.md`

**Interfaces:**
- Consumes: GitHub repository, Vercel Hobby, `NEXT_PUBLIC_SITE_URL`, `VERCEL_ENV`.
- Produces: documented preview and production deployment workflow with no analytics.

- [ ] **Step 1: Write the deployment acceptance checklist before configuration**

```md
- Production branch is connected to the Vercel project.
- Pull requests receive preview URLs.
- Preview HTML contains `noindex, nofollow`.
- Production remains noindex while `siteReady` is false.
- `/`, all three project routes, `/robots.txt`, and `/sitemap.xml` respond.
- Vercel Web Analytics and Speed Insights are disabled.
- The project remains on Hobby with no paid add-ons.
```

Store this exact checklist in `docs/deployment.md`.

Also document the GitHub merge gate: author and approver must differ, stale
approvals are dismissed after new commits, required CI checks must pass, and
only the integrator merges the approved head SHA. If repository permissions do
not support branch protection, the integrator enforces the same checklist
manually and records that limitation truthfully.

- [ ] **Step 2: Verify the repository locally before external setup**

Run: `npm test && npx playwright test && npm run build && npx lhci autorun`

Expected: all commands pass.

- [ ] **Step 3: Configure environment documentation**

Add:

```dotenv
# .env.example
NEXT_PUBLIC_SITE_URL=https://portfolio.example
```

Document that the value is required only for a ready production launch, never
contains secrets, and must match the final custom domain. Add `.vercel` to
`.gitignore`.

- [ ] **Step 4: Connect GitHub and verify preview behavior**

With the user's authorization, import the repository into a personal Vercel
Hobby account, select the Next.js preset, keep Web Analytics and Speed Insights
disabled, and deploy the production branch. Open a non-production branch or
pull request, inspect its preview response, and confirm `noindex, nofollow`.

- [ ] **Step 5: Verify production behavior**

Open `/`, `/project-one/`, `/project-two/`, `/project-three/`, `/robots.txt`,
and `/sitemap.xml` on the Vercel production URL. With `siteReady: false`,
confirm every page is usable, robots disallows crawling, and the sitemap has no
portfolio entries.

- [ ] **Step 6: Document evidence and commit**

Record the Vercel project name, production URL, deployment date, tested routes,
Hobby-plan status, and analytics-disabled status in `docs/deployment.md`.
Complete `docs/launch.md` with the later `siteReady: true` checklist. Update
`readme.md` with links to both documents.

```bash
git add .env.example .gitignore docs/deployment.md docs/launch.md readme.md
git commit -m "docs: verify Vercel deployment workflow"
```

## Final Verification

- [ ] Run `npm test`.
- [ ] Run `npx playwright test`.
- [ ] Run `npm run build`.
- [ ] Run `npx lhci autorun`.
- [ ] Confirm `git status --short` contains only intentional changes.
- [ ] Re-read `docs/superpowers/specs/2026-07-24-ux-portfolio-design.md` and map every completion criterion to a passing test, manual review record, build output, or deployment check.
- [ ] Use the `verification-before-completion` skill before reporting implementation complete.
