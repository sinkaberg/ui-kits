# Changelog

One line per tagged release, newest first.

## app

- **app/v1.0.0** — 2026-09-17 — Initial release of the app kit: stylesheet, fonts, style guide. App header, card (shared), definition grid, data table (shared) with a fixed-layout and numeric-column modifier, badge (shared) with seven result modifiers plus an action variant, collapsible details card, muted text, empty state. `tools/assemble.mjs` now builds both kits' bundles from one description of their parts.

## docs

- **docs/v1.1.0** — 2026-07-10 — Additive: `explainer` + `proposal` layouts, `.btn`/`.actions` button vocabulary, and the diagram recipe. The bundle is now generated from source parts (`brand/` + `docs/v1/parts/`) via `tools/assemble.mjs`; the published `sinkaberg-docs.css` is unchanged bar the additions.
- **docs/v1.0.0** — 2026-07-09 — Initial release of the docs kit: stylesheet, optional JS, fonts, six layouts, element galleries, style guide.
