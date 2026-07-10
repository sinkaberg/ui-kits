# ADR-0002 — Playwright render harness: the repo's first dev dependency

Date: 2026-06-19
Status: Accepted

## Context

The suite to date (`node:test`) checks tokens, structure, self-containment, and version sync — but
**never renders the page**. Every layout/contrast/font bug in the v0.3.0 examples (no base body
font, navy-on-navy pill, low-contrast inline code, a hero that is not full-bleed) shipped
invisibly because nothing put the HTML in a browser. Issue #12 closes that gap with a real-browser
render harness; it is a prerequisite for the #11 design-QA fixes, which use the harness to verify
the corrected layout and to commit screenshot baselines.

Two constraints shape the decision:

1. **The plugin must stay dependency-free for *consumers*.** An agent invoking the
   `sinkaberg-design` / `sinkaberg-docs` skills only ever copies `SKILL.md` + `brand/` +
   `components.css` + `templates/`. Plugin install copies files and never runs `npm install`, so a
   consumer never sees `node_modules`, a lockfile, or browser binaries. The PRD rule is "no
   *runtime* dependencies".
2. **Offline fonts.** Examples pull Sora + Inter from Google Fonts; offline they fall back to
   system fonts. The harness must be deterministic without network access.

## Decision

**1 · Add `@playwright/test` as the first dev dependency — dev/test-only, never runtime.**
Pinned to `1.60.0` (the latest stable older than the `minimumReleaseAge=7d` window at the time).
This introduces `node_modules`, `package-lock.json`, and chromium browser binaries (hundreds of MB,
cached outside the repo under the user's Playwright cache). None of it ships in the plugin, so the
emitted output and the consume path stay dependency-free.

**2 · Two lanes, kept strictly separate.**

| Lane | Who | Touches | Self-check |
|---|---|---|---|
| **Consuming** | an agent emitting on-brand HTML | `SKILL.md` + `brand/` + `components.css` + `templates/` | dependency-free adherence lint + "opens from disk" — **never Playwright** |
| **Contributing** | changing the system, running the gate | Node + Playwright (dev-only) | `npm run check` (no browser) **plus** `npm run test:render` |

`npm run check` (lint + `node:test`) must run and pass **without Playwright installed**. To keep
`node --test` from importing `@playwright/test` (which throws outside its own runner and would break
`npm test` for anyone without it), the render specs live **outside node:test discovery**: a separate
`test-visual/` directory **and** a non-`.test.mjs` extension (`render.spec.mjs`). `npm run
test:render` runs Playwright; `npm run check:all` runs both.

**3 · Computed-style assertions now; screenshots later.**
The harness ships **offline-safe computed-style assertions** (resolved `font-family`, colours, WCAG
contrast ratios, and `getBoundingClientRect` geometry). These read what the browser computed, never
whether a webfont loaded, so they are deterministic offline. They are deliberately **red against the
current unfixed examples** — they document the bugs #11 must clear and prove the harness bites.

**Golden screenshot baselines are deferred to the #11 fix PR.** Capturing them now would bless the
buggy v0.3.0 layout. They are reserved for layout regressions, live committed under `test-visual/`
(not gitignored), and land once the layout is correct. The config carries a `maxDiffPixelRatio`
threshold ready for them, and the spec has a clearly-marked placeholder where they go.

**4 · No CI workflow yet — a deliberate follow-up.**
Browser tests in CI need the chromium binaries provisioned, and a workspace convention restricts
adding new GitHub Actions workflows without confirmation. That convention targets a different
class of automation and likely does not bar a JS test workflow, but #12 says confirm first. CI for the browser tests is therefore
left as a deliberate follow-up, to be added only after explicit confirmation.

## Consequences

- First external dependency lands, but only in the contributing lane; runtime output and the
  consume path stay dependency-free. The lockfile is committed; browser binaries are not (cached
  outside the repo; documented via `npx playwright install chromium`).
- `npm run check` stays the browserless gate and still passes (112 `node:test` cases); the render
  spec is invisible to `node --test`.
- The render assertions are red today by design; #11 turns them green and adds the screenshot
  baselines. Until then, `npm run test:render` documents the open layout/contrast/font bugs.
- Contributors must run `npm install` then `npx playwright install chromium` once before
  `npm run test:render`; this is documented in the README.
