# UX Portfolio

This context defines the shared product language for the code-first UX
portfolio.

## Language

**Visual baseline**:
An approved Playwright screenshot at a fixed viewport that becomes the
regression reference for later changes.
_Avoid_: Reference screenshot, golden image

**Featured project**:
A homepage project entry with a title, summary, desktop media, and a link to its
own case study.
_Avoid_: Project card, portfolio tile

**Archive image**:
A non-interactive image shown only in the homepage Archive gallery.
_Avoid_: Archived project, project thumbnail

**Archive**:
An optional homepage collection that is rendered only when at least one Archive
image exists.
_Avoid_: Past projects, project index

**Canonical case study**:
The project page used to exercise and verify every supported editorial block
type.
_Avoid_: Full project, primary template

**Case-study shell**:
The minimum complete project page: introduction, role, results, opening media,
and Home/Up footer.
_Avoid_: Empty project, stub page

**Project metadata**:
The Role and Results content shown side by side on desktop and stacked Role
before Results on mobile.
_Avoid_: Project details, project facts

**Project slug**:
The unique URL-safe identifier used for a root-level case-study route such as
`/sample-project/`.
_Avoid_: Project ID, project path

**Placeholder projects**:
The three initial case studies identified by `project-one`, `project-two`, and
`project-three` until the owner supplies final project names and slugs.
_Avoid_: Demo projects, sample pages

**Placeholder asset**:
A locally stored, replaceable image sourced under a license that permits its use
in the portfolio prototype.
_Avoid_: Reference asset, remote placeholder

**Media focal point**:
Optional normalized coordinates identifying the subject to preserve when an
explicitly cropped frame is used.
_Avoid_: Crop position, image alignment

**Editorial block**:
A typed, ordered unit of case-study content such as a statement, prose section,
media item, media group, or text-and-media composition.
_Avoid_: Content component, page section

**Content source**:
The provider of portfolio data before it is normalized into the internal
content model; local files are the version-one content source and a CMS may
replace them later.
_Avoid_: Backend, database

**Smooth scrolling**:
Native browser scrolling used by an in-page action such as `Up`, with an
immediate fallback when reduced motion is requested.
_Avoid_: Scroll hijacking, animated page navigation

**Deployment target**:
Vercel Hobby running the personal, non-commercial Next.js application, with
deployments connected to GitHub.
_Avoid_: Cloudflare adapter, static export, paid hosting

**Placeholder content**:
Structurally valid, clearly replaceable text and media used until the portfolio
owner supplies final content.
_Avoid_: Seed data, demo data, production data

**Site readiness**:
The explicit `siteReady` content setting that controls whether public
deployments may be indexed and advertised through discovery metadata.
_Avoid_: Publish status, deployment status

**Analytics**:
Intentionally absent from version one; the site sends no visitor events to an
analytics or advertising service.
_Avoid_: Telemetry, tracking, insights

**Supported browsers**:
The current and previous major desktop releases of Chrome, Safari, Firefox, and
Edge, plus current iOS Safari and Android Chrome.
_Avoid_: All browsers, evergreen browsers

**Performance target**:
The good Core Web Vitals thresholds: LCP at most 2.5 seconds, INP below 200
milliseconds, and CLS below 0.1.
_Avoid_: Fast, performant

**Accessibility target**:
WCAG 2.2 Level AA for version-one content, structure, navigation, focus,
contrast, alternative text, and pointer target sizing.
_Avoid_: Accessible, WCAG compliant

**Editorial whitespace**:
Deliberate responsive vertical space separating major story moments, including
large mobile intervals that scale with the viewport.
_Avoid_: Spacer block, empty section
