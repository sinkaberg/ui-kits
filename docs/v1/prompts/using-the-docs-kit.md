# Prompt — using the Sinkaberg documentation kit

Sinkaberg has a documentation UI kit (published at `sinkaberg/ui-kits` under `docs/v1/`; live at https://sinkaberg.github.io/ui-kits/docs/v1/) for branded HTML documentation living in git repos. Use it whenever you produce documentation for Sinkaberg — do not restyle from scratch.

Structure: one shared stylesheet `sinkaberg-docs.css` (design tokens → components → doc elements; self-hosted Sora/Inter fonts), one optional `sinkaberg-docs.js` (TOC scrollspy, tabs, index search/filter — every page must still work without it), and six page layouts in `layouts/`. Pick by the reader's job:

- **do** something → `guide`
- **look up** a fact → `reference`
- **understand** an idea → `concept`
- **respond** to an incident → `runbook`
- **remember why** → `decision-record`
- **catch up** on a period → `status-recap`

To write a new document: copy the closest layout, keep its shell (hero → sticky `.toc` + `main.doc`), replace the content, link the stylesheet by its versioned public URL (`https://sinkaberg.github.io/ui-kits/docs/v1/sinkaberg-docs.css`), and add an entry to the repo's `index.html` (title, one-line description, tags, owner, status chip, updated date, under the right type group).

Consumption model: hotlink-by-default — documents reference the versioned Pages URL directly; never vendor per-repo copies. `docs/v1/` only ever receives compatible updates; breaking changes ship as `docs/v2/` alongside a frozen `v1/`. Keep a local clone of `sinkaberg/ui-kits` as a sibling folder for offline/outage fallback (search/replace the URL → local path).

Available elements are cataloged in `style-guide.html` with live galleries in `elements/`: type scale, eyebrows, pull quotes, footnotes, kbd; five semantic callouts, pills/tags/badges, status chips, stat blocks; data/spec/do-don't tables, definition lists, glossary; plain/annotated/diff code blocks, repo trees; steps, pipelines, tabs, timelines, cards, and an SVG diagram vocabulary (`.dg-*`).

House rules: salmon is scarce (one marked thing per view, never a background); callout/status colours carry meaning — pick by intent; tokens only (`var(--sp-5)`, `var(--salmon)` — no raw hex); prose measure ~68ch; everything must degrade without JS and print cleanly.
