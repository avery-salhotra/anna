# UX Portfolio Design Specification

## Objective

Build a code-first UX portfolio inspired by the layout, typography, responsive
behavior, and editorial rhythm of `karoliskosas.com`. The portfolio will use
original content and media. Version one may use placeholder content while
preserving the final content structure.

The implementation must be responsive and developed as small, independently
testable features using strict test-driven development.

## Scope

Version one contains two route types:

- `/`: a long-form homepage with an introduction, featured projects, an
  optional Archive gallery, and a contact email.
- `/[slug]`: statically generated, root-level project case studies assembled
  from reusable editorial blocks, such as `/sample-project/`.

There is no About page, conventional header, global navigation menu, Writing
section, Talks section, analytics, advertising tracker, cookie banner, or
consent-management dependency.

## Visual Direction

The portfolio uses:

- A white background and black, neutral sans-serif typography.
- Oversized editorial statements with tight line-height and letter spacing.
- Generous whitespace as a primary compositional element.
- Alternating asymmetrical desktop project layouts.
- Restrained controls, including compact black pill buttons.
- Project imagery as the primary source of color and visual character.
- No decorative UI chrome unrelated to the work.

Inter is the version-one typeface. It is bundled as a local webfont under its
open license. Production and test rendering must not depend on operating-system
font availability or a runtime font CDN. The font license is stored with the
bundled font files.

Exact typography, spacing, image proportions, and breakpoints will be calibrated
against the supplied desktop and mobile screenshots during implementation.

### Visual Fidelity Approval

Visual fidelity is established through manual side-by-side review against the
supplied reference screenshots at these fixed viewports:

- Desktop: 1440 × 900.
- Tablet: 768 × 1024.
- Mobile: 390 × 844.

Desktop and mobile must receive explicit manual approval. Tablet is verified as
a responsive interpolation because no tablet reference was supplied. Once a
viewport is approved, its Playwright screenshot becomes the project's visual
baseline for automated regression testing. Automated pixel comparison against
the original portfolio is not used because the sites contain different text and
media.

## Homepage

The homepage is a single long-form index page with five required sections and
one optional section in this order:

1. Large introduction.
2. Featured project A.
3. Featured project B.
4. Featured project C.
5. Archive gallery, when at least one Archive image exists.
6. Contact email.

The content model may support additional featured projects without changing the
page architecture. When the Archive is empty, its heading and gallery are
absent and the contact email follows the featured projects directly.

Version one contains three featured projects, and every featured project has a
valid placeholder project route from the moment its `See more` link becomes
visible. Their initial content-owned slugs are `project-one`, `project-two`, and
`project-three`, producing `/project-one/`, `/project-two/`, and
`/project-three/`. They may be renamed later by changing content rather than
page components.

### Introduction

The introduction is a large personal positioning statement that occupies most
of the opening viewport. It remains display-sized on mobile with tighter line
wrapping.

### Featured Projects

Each featured project contains:

- Title.
- Concise summary.
- Desktop presentation media.
- A `See more` link to its dedicated project route.
- An alignment value used to alternate the desktop composition.

Desktop layouts alternate between media-left/text-right and
text-left/media-right. Mobile layouts hide featured-project media and present a
consistent typography-led sequence containing only the title, summary, and
button.

### Archive

The Archive is an optional responsive image gallery of supplementary portfolio
work. Its initial collection is empty because no archive work has been
provided, so it is omitted from the initial homepage. When later populated, it:

- Uses three columns at wide desktop, two at tablet, and one on mobile.
- Preserves each image's natural aspect ratio without forced square cropping.
- Keeps consistent gutters and stable content-source order.
- Does not link its images or show visible captions.
- Does not provide a filter, modal, or lightbox.

### Contact

A prominent email link closes the homepage and uses a `mailto:` destination.
It must have a sufficiently large touch target on mobile.

## Project Pages

Each project uses a dedicated static route. Selecting `See more` performs normal
route navigation; project pages do not open as overlays.

A project begins with:

1. A large introductory statement describing the project and contribution.
2. Role and results metadata.
3. Opening project media.
4. An ordered sequence of editorial story blocks.
5. A footer containing `Home` and `Up`.

There is no global header or repeated project title above the introduction.

### Role and Results

Role and results appear as two columns on desktop. On mobile they become two
separate full-width sections with deliberate vertical separation in the order
Role, then Results, followed by the opening project media. CSS must not create a
visual order that differs from the document order.

### Editorial Blocks

Project stories are assembled from an ordered, typed block collection. Version
one supports:

- Large statement.
- Rich text with optional ordered or unordered lists.
- Two-column prose.
- Single image.
- Two- or three-item media group.
- Asymmetrical text-and-media split.

Desktop blocks may use multi-column editorial compositions. Mobile layouts
convert those blocks into a deliberate single-column reading sequence. Media
retains visible side margins rather than becoming universally edge-to-edge.
Large vertical intervals between major story moments are part of the mobile
composition. They use responsive `clamp()` values and content-aware minimum
spacing rather than fixed empty elements or fixed full-screen heights.

The first project is the canonical case study and includes every supported
editorial block type. The second and third projects initially use the
case-study shell: introduction, role, results, opening media, and footer. Their
additional editorial blocks are added incrementally when real content becomes
available.

Video is outside version-one scope. It will be introduced as a new editorial
block only when an actual case study requires it.

### Project Footer

`Home` navigates to `/` and lands at the top of the homepage; it does not
restore a previous homepage scroll position. The browser's Back control remains
responsible for history-based scroll restoration. `Up` scrolls smoothly to the
top of the current page using native browser behavior. Reduced-motion
preferences disable smooth scrolling. Normal touch, wheel, keyboard, and
scrollbar movement remains native and is never intercepted or transformed.

## Responsive Model

The site uses one shared content model with explicit desktop and mobile
presentations. The mobile experience is not a generic collapse of the desktop
grid.

Responsive rules include:

- Display typography remains large at narrow widths.
- Homepage featured-project media is hidden on mobile.
- Alternating desktop project layouts become consistent mobile text sequences.
- Desktop metadata and prose columns become ordered mobile sections.
- Case-study media maintains intentional margins and spacing.
- Archive images reflow into a narrow responsive gallery.
- Deliberate mobile editorial whitespace scales across viewport heights without
  producing overflow or empty spacer elements.

Tablet behavior interpolates between desktop and mobile without introducing a
third content model. Breakpoints are chosen from observed layout needs rather
than device brand names.

### Browser Support

Version one supports the current and previous major desktop releases of Chrome,
Safari, Firefox, and Edge, plus the current releases of iOS Safari and Android
Chrome. Progressive enhancement is acceptable only when core content,
navigation, and scrolling remain usable in every supported browser.

The automated release matrix verifies the current browser engines bundled with
the pinned Playwright version. Previous major desktop releases remain a
compatibility target based on standards-first implementation and are recorded
as directly tested only when those exact versions are available. Manual
evidence must state the actual browser and device versions; absence of a
previous-version device must be documented rather than disguised as a pass.

### Performance

Version one targets Google's “good” Core Web Vitals thresholds:

- Largest Contentful Paint (LCP) at or below 2.5 seconds.
- Interaction to Next Paint (INP) below 200 milliseconds.
- Cumulative Layout Shift (CLS) below 0.1.

Repeatable lab checks run against the production build before launch. Because
version one contains no analytics, field performance is not collected by the
application. After `siteReady` is enabled and sufficient traffic exists, the
owner may verify field results through Search Console.

## Technical Architecture

Use:

- Next.js App Router.
- TypeScript.
- CSS Modules for component and page styles.
- Global CSS for typography, spacing, breakpoints, resets, and design tokens.
- A locally bundled webfont for deterministic cross-platform typography.
- `next/image` for responsive image delivery.
- Native CSS transitions by default.
- Native browser smooth scrolling for in-page actions.
- No motion library or scroll-hijacking dependency in version one.
- Vercel Hobby with GitHub-connected production and preview deployments.

The site is statically generated wherever possible.

### Deployment and Cost

Vercel Hobby is the version-one deployment target because this is a personal,
non-commercial project. Its native Next.js runtime provides the most direct
path to image optimization, preview deployments, and future CMS preview and
revalidation behavior.

The deployment must remain within Vercel's free Hobby limits. GitHub pushes to
the production branch trigger production deployment; other branches produce
preview deployments. Domain registration is an external ownership cost and is
not included in the zero-recurring-hosting requirement.

Hosting portability is preserved by keeping portfolio content vendor-neutral
and avoiding Vercel-specific application data. A future change to commercial
use requires reassessing the hosting plan because Vercel Hobby permits only
personal, non-commercial use.

Vercel Web Analytics and Speed Insights are not enabled in version one. No
visitor events are sent to third-party analytics or advertising services.

### Route Structure

- `app/page.tsx`: homepage route.
- `app/[slug]/page.tsx`: root-level project route.
- `generateStaticParams`: generates known project routes.
- `notFound()`: handles unknown project slugs.

Project slugs must not collide with reserved top-level application routes.
Version one has no additional top-level page routes, but content validation
enforces a reserved-slug list so future routes can be introduced safely.

### Content Architecture

Typed local content contains:

- Profile introduction and contact email.
- Featured project metadata.
- Archive media.
- Project introduction, role, results, and ordered editorial blocks.

All version-one content may remain placeholder content, including the profile
name, introduction, project copy, results, and contact email. Placeholder
content must satisfy the same schema and accessibility rules as final content.
Content completeness is not a build or deployment gate; the owner will replace
placeholders through the local content source before a public launch.

### Site Readiness and Discovery

A required boolean `siteReady` setting separates technical deployment from
public launch:

- `false` is the default while placeholder content remains. Every route emits
  `noindex, nofollow`; the generated robots policy disallows crawling; and the
  public sitemap contains no portfolio routes.
- `true` enables indexable canonical metadata, the public sitemap, and
  page-specific social sharing metadata for the homepage and each project.

Changing `siteReady` does not alter page content or route availability. Preview
deployments remain non-indexable regardless of the setting. Tests cover both
states, and the README documents the launch procedure.

Editorial content uses a CMS-neutral, JSON-serializable TypeScript schema built
from discriminated unions. Paragraphs, headings, and lists are explicit typed
nodes. Raw HTML, MDX, React elements, functions, and vendor-specific CMS objects
are not valid content values.

Presentation consumes content through a small interface. A future CMS adapter
must normalize its provider-specific response into this internal content model
without changing page components. The CMS itself is outside version-one scope.

### Media Model

Every image entry contains a local source, intrinsic width and height,
alternative text, and optional presentation metadata. It may also contain
optional normalized focal-point coordinates.

Images display at their natural aspect ratio by default. Only a component with
an explicitly designed cropped frame may apply `object-fit: cover`, and it uses
the optional focal point to preserve the subject. Layout decisions otherwise
belong to components and CSS rather than arbitrary per-entry positioning.

### Placeholder Media

Version-one placeholder assets may be sourced from the internet only when their
license permits use in the portfolio prototype. Assets are downloaded into
`public/placeholders/`; runtime pages never depend on random or hotlinked image
services. `docs/assets.md` records each asset's original URL, creator when
available, license, and download date. Assets from the reference portfolio are
not copied. No real project imagery is required for version one: neutral
placeholder images exercise intrinsic sizing, optional focal points, and
responsive layouts until the owner replaces them.

### Component Boundaries

- `Homepage`: composes homepage sections.
- `IntroStatement`: renders the homepage introduction.
- `FeaturedProject`: renders one responsive featured project.
- `ArchiveGallery`: renders non-interactive archive media.
- `ContactLink`: renders the closing email link.
- `ProjectPage`: composes a project case study.
- `ProjectMetadata`: renders roles and results.
- `CaseStudyRenderer`: dispatches typed blocks.
- Editorial block components: render one supported block type each.
- `ProjectFooter`: renders `Home` and `Up`.

Components accept typed inputs and do not read unrelated global content.

## Data Flow

1. A route requests homepage or project content from the local content source.
2. The content source returns typed data.
3. The route passes that data to page-level components.
4. Page-level components pass focused subsets to section components.
5. `CaseStudyRenderer` selects a block component from each block's discriminant.
6. Components render semantic HTML and responsive media.

The future CMS changes step two only.

## Failure and Accessibility Behavior

- Unknown project slugs render a proper 404 page.
- Invalid content fails tests and the production build.
- Version one targets WCAG 2.2 Level AA.
- Meaningful images require alternative text.
- Decorative images use empty alternative text.
- Uncropped images preserve their intrinsic aspect ratios; intentionally cropped
  frames honor configured focal points.
- Optional missing media removes its block without leaving broken spacing.
- Keyboard users can activate every link.
- Focus indicators remain visible.
- Smooth scrolling and CSS motion respect `prefers-reduced-motion`.
- Text and interactive controls meet WCAG AA contrast expectations.
- Heading structure remains semantic even when display sizes change.
- Interactive controls meet WCAG 2.2 pointer target requirements.

## Test-Driven Development Contract

Every feature is implemented as a separate observable behavior:

1. Define one behavior and its acceptance criterion.
2. Write a focused failing test.
3. Run the test and confirm it fails for the expected reason.
4. Add the minimum implementation required to satisfy it.
5. Run the focused test until it passes.
6. Run the complete test suite.
7. For visual work, verify approved desktop and mobile viewports with
   Playwright screenshots.
8. Refactor only while tests remain green.
9. Update the README and relevant documentation.
10. Begin the next feature only after verification succeeds.

The implementation must not combine unrelated features into one development
slice.

### Test Layers

- Vitest: content utilities, route helpers, and content validation.
- React Testing Library: component behavior, semantics, accessibility, and
  responsive visibility classes where appropriate.
- Automated accessibility checks: detectable WCAG violations in rendered
  routes.
- Playwright: route navigation, `Home`, `Up`, mobile/desktop behavior, and
  approved visual-regression baselines. Cross-browser end-to-end tests run in
  Chromium, WebKit, and Firefox.
- Next.js production build: static generation and integration verification.
- Performance checks: repeatable lab measurements against the production build
  for LCP, INP proxies, and CLS.

Visual baselines are accepted only after manual comparison at the fixed
viewports defined under Visual Fidelity Approval.

## Initial Increment Sequence

Implementation planning should decompose the work into small slices, beginning
with:

1. Tooling and a single passing test-runner smoke test.
2. Global page shell and typography tokens.
3. Homepage introduction.
4. One desktop featured project.
5. Alternating desktop featured-project alignment.
6. Mobile featured-project media removal.
7. `See more` navigation to one project route.
8. Empty-Archive omission.
9. Populated Archive gallery.
10. Contact link.
11. Project introduction.
12. Project role metadata.
13. Project results metadata.
14. Opening project media.
15. One editorial block type at a time.
16. Project `Home` navigation.
17. Project `Up` behavior.
18. Non-indexable `siteReady: false` behavior.
19. Indexable `siteReady: true` behavior.
20. Responsive and visual-regression coverage.

Each increment must be split further if its first test cannot describe one
focused observable behavior.

## Version-One Completion Criteria

Version one is complete when:

- The homepage and `/project-one/`, `/project-two/`, and `/project-three/`
  render successfully.
- Every visible `See more` link reaches its corresponding project route.
- The canonical case study exercises every supported editorial block.
- The two secondary routes render the complete case-study shell.
- The approved desktop and mobile compositions match their visual baselines.
- Featured-project images are absent from the mobile homepage.
- Project metadata is side by side on desktop and follows Role → Results →
  opening media on mobile.
- Mobile case studies retain the approved spacious editorial rhythm at the
  fixed visual-review viewport and remain usable at other supported phone
  sizes.
- An empty Archive is absent from the homepage.
- A populated Archive uses the specified three-, two-, and one-column layouts,
  preserves natural image ratios, and remains non-interactive.
- `See more`, `Home`, `Up`, and contact links behave as specified.
- Unknown projects return a 404.
- Automated tests and the Next.js production build pass.
- GitHub-connected Vercel preview and production deployments are configured
  within the free Hobby plan.
- Structurally valid placeholder content may remain until the owner supplies
  final content.
- `siteReady: false` prevents indexing, while `siteReady: true` exposes
  canonical metadata, social metadata, robots access, and sitemap entries.
- Preview deployments remain non-indexable in both readiness states.
- No analytics, advertising, consent, or cookie-management script is present.
- Cross-browser end-to-end tests pass in Chromium, WebKit, and Firefox, with
  manual responsive checks in current iOS Safari and Android Chrome before
  public launch.
- Production-build lab checks meet the specified Core Web Vitals targets, with
  field verification deferred until sufficient post-launch data exists.
- Automated accessibility checks pass, and manual keyboard, focus, heading,
  alternative-text, and touch-target review finds no WCAG 2.2 AA blocker.
- The README documents setup, testing, content editing, and project structure.
- Every internet-sourced placeholder asset has a provenance entry in
  `docs/assets.md`.
