# Sinkaberg UI Kits

Public home of Sinkaberg's UI kits **and the single source of truth for all
design material** — brand foundations (tokens, components, fonts, logos), plus
the self-contained, versioned kits that other repos and documents reference
directly. The private [`sinkaberg/design-system`](https://github.com/sinkaberg/design-system)
plugin is a thin consumer: it holds only the Claude skills that make these kits
easy to use, and hotlinks the published CSS below.

Served via GitHub Pages: **https://sinkaberg.github.io/ui-kits/**

## Kits

| Kit | Current | What it's for |
|---|---|---|
| [docs](docs/v1/) | [v1](https://sinkaberg.github.io/ui-kits/docs/v1/style-guide.html) | Branded HTML documentation living in git repos — stylesheet, layouts, live style guide |
| [app](app/v1/) | [v1](https://sinkaberg.github.io/ui-kits/app/v1/style-guide.html) | Plain CSS for server-rendered app pages — header, card, data table, result badges, definition grid, collapsible details, empty state |

More kits (slides, dashboard, …) land here as they get an offline-render story.

## How consumption works

**Hotlink the versioned URL.** A document or app page links the published
stylesheet directly:

```html
<link rel="stylesheet" href="https://sinkaberg.github.io/ui-kits/docs/v1/sinkaberg-docs.css">
<link rel="stylesheet" href="https://sinkaberg.github.io/ui-kits/app/v1/sinkaberg-app.css">
```

- Each kit's `…/v1/` is a **compatibility contract**: within a major, only
  compatible fixes and additions — every page linking `v1` picks them up and
  nothing breaks.
- A breaking change ships as a new major folder (`docs/v2/`, `app/v2/`) next
  to the frozen `v1/`. Old pages keep rendering exactly as written.
- Releases are tagged `docs/v1.x.y` / `app/v1.x.y` with a one-line entry in
  [CHANGELOG.md](CHANGELOG.md), so you can diff what changed between releases.
- Each kit-major folder is fully self-contained (fonts included) — copying
  that one folder gives you a complete working local copy.

**Vendoring, for apps that must not depend on the kit host at runtime**
(e.g. a container image built once and run without egress): copy the kit's
stylesheet and `fonts/` into the app's own static assets at image build time,
and link the local path instead of the hosted URL. Re-run the copy on each
dependency bump to pick up compatible `v1` fixes.

**Fallback:** keep a clone of this repo as a sibling folder to your projects.
If GitHub is down or you're offline, search/replace
`https://sinkaberg.github.io/ui-kits/` with the local path.

## Repository layout

```
ui-kits/
├── brand/                       brand foundations (the design source of truth)
│   ├── colors_and_type.css        tokens + .t-* type scale  ← /design-sync writes this
│   ├── components.css             shared component vocabulary
│   └── assets/logos|icons|imagery
├── docs/v1/                      the docs kit (published, hotlinkable)
│   ├── sinkaberg-docs.css         GENERATED bundle — do not hand-edit
│   ├── sinkaberg-docs.js, fonts/, layouts/, elements/, style-guide.html, index.html
│   ├── diagram-recipe.md
│   └── parts/                     kit-specific source layers: fonts.css, elements.css, page.css
├── app/v1/                       the app kit (published, hotlinkable)
│   ├── sinkaberg-app.css          GENERATED bundle — do not hand-edit
│   ├── fonts/, style-guide.html
│   └── parts/                     kit-specific source layers: fonts.css, elements.css, page.css
├── tools/assemble.mjs           regenerates both bundles from brand/ + each kit's parts/
├── tools/adherence-lint.mjs     token-only gate (components + docs layouts + app parts/html)
├── docs/adr/                    design decisions of record
└── package.json                 assemble / lint / test (dev-only; consumers never build)
```

## Contributing a change

Edits happen here (this repo is the source of truth for all kit code and brand
material). Edit the **source parts** — `brand/colors_and_type.css`,
`brand/components.css`, `docs/v1/parts/*`, `app/v1/parts/*` — then regenerate
the published bundles:

```bash
npm run assemble     # rebuild docs/v1/sinkaberg-docs.css and app/v1/sinkaberg-app.css from the source parts
npm run check        # assemble --check + adherence lint + node:test, both kits
```

Each bundle is generated, never hand-edited; `npm run check` fails if either is
stale or if a component/layout/app-part carries a raw hex. Consumers never run
this — they only hotlink the built bundle (dev-only step, same as the render
harness).

Within a major version: compatible changes only — additive classes, bug fixes,
token tweaks that don't change meaning. Anything that renames/removes a class or
changes semantics starts a new major folder. Tag the release and add a changelog
line.
