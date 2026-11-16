# AGENTS.md — sinkaberg/ui-kits

Instructions for any coding agent (Antigravity, Claude Code, Codex, …) working in or with this repo.

**This repo is public.** Everything committed here, including git history, is world-readable. See [CONTRIBUTING.md](CONTRIBUTING.md#this-repo-is-public).

## What this repo is

The source of truth for Sinkaberg's visual design material: tokens (`brand/colors_and_type.css`), shared components (`brand/components.css`), fonts (Sora + Inter, SIL OFL), logos and icons (`brand/assets/`), and the versioned kits built from them. Published via GitHub Pages:

| Kit | Hotlink | Style guide |
|---|---|---|
| docs | `https://sinkaberg.github.io/ui-kits/docs/v1/sinkaberg-docs.css` (+ optional `sinkaberg-docs.js`) | https://sinkaberg.github.io/ui-kits/docs/v1/style-guide.html |
| app | `https://sinkaberg.github.io/ui-kits/app/v1/sinkaberg-app.css` | https://sinkaberg.github.io/ui-kits/app/v1/style-guide.html |

Details: [README.md](README.md), [docs/v1/README.md](docs/v1/README.md), [app/v1/README.md](app/v1/README.md).

## Using the kit (in another repo)

- **Hotlink the versioned URL.** Do not copy the stylesheet into a repo and do not restyle from scratch. Vendoring is only for apps that must run without reaching the kit host — see the README.
- **Docs pages:** copy the closest layout from `docs/v1/layouts/`, keep its shell, replace the content, point the stylesheet at the published URL. Pick the layout by the reader's job: do → `guide` · look up → `reference` · understand → `concept` · respond to an incident → `runbook` · remember why → `decision-record` · catch up → `status-recap` · long-form read → `explainer` · decide → `proposal`.
- **Logo:** `<img class="logo">` pointing at `docs/v1/logos/sinkaberg-horizontal-white.svg` (navy hero) or `sinkaberg-horizontal.svg` (light hero). Never inline the SVG.
- **House rules:** salmon is scarce (one marked thing per view, never a background); callout/status colours carry meaning, pick by intent; tokens only (`var(--sp-5)`, `var(--salmon)`), no raw hex; pages work without JS and print cleanly.
- Full agent prompt for the docs kit: [docs/v1/prompts/using-the-docs-kit.md](docs/v1/prompts/using-the-docs-kit.md). Diagrams: [docs/v1/diagram-recipe.md](docs/v1/diagram-recipe.md).

**Copy and voice** rules are not in this repo; they live in the internal `sinkaberg/design-system` repo (`brand/voice.md`).

## Changing the kit (in this repo)

- Edit source parts only: `brand/*.css`, `docs/v1/parts/*`, `app/v1/parts/*`. The bundles `docs/v1/sinkaberg-docs.css` and `app/v1/sinkaberg-app.css` are generated — never hand-edit them.
- `brand/colors_and_type.css` is written by `/design-sync`; see ADR-0001 and CONTRIBUTING before touching it.
- Node ≥ 20. `npm run assemble` rebuilds bundles; `npm run check` must pass (assemble --check, token-only lint, tests).
- Within a major (`v1/`): compatible changes only. Breaking changes start a new major folder.
- Sample content in layouts and style guides must be fictional.

Process, releases and PR rules: [CONTRIBUTING.md](CONTRIBUTING.md). Decisions: [docs/adr/](docs/adr/).
