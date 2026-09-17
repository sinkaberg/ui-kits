# Sinkaberg App Kit — v1

Plain CSS for a server-rendered app page (Jinja, ERB, or similar) — an app header, a card, a data table, result badges, a definition grid, a collapsible details block, and an empty-state line. No JavaScript, no build step.

Live style guide: https://sinkaberg.github.io/ui-kits/app/v1/style-guide.html

## What's here

```
app/v1/
├── sinkaberg-app.css   ← the one stylesheet every page links (tokens → components → app elements)
├── fonts/              ← Sora + Inter variable fonts, served next to the CSS (SIL OFL 1.1, see OFL-*.txt)
└── style-guide.html    ← every block, live, with fictional sample content
```

## Using the kit from another app

Pages hotlink the published stylesheet — no per-repo copy:

```html
<link rel="stylesheet" href="https://sinkaberg.github.io/ui-kits/app/v1/sinkaberg-app.css">
```

The fonts load automatically relative to the CSS. The `v1` in the URL is the compatibility contract: this folder only ever receives compatible fixes and additions, so pages linking `v1` keep working and pick up improvements. A breaking change ships as a new `v2/` folder alongside — existing pages are never restyled out from under you.

**Vendoring, for apps that must not depend on the kit host at runtime** (e.g. a container image built once and run without egress): copy `sinkaberg-app.css` and `fonts/` into the app's static assets at image build time, and link the local path instead of the hosted URL. Re-run the copy on each dependency bump to pick up compatible `v1` fixes. This is how `sinkaberg/ctrl` consumes the kit (issue [#153](https://github.com/sinkaberg/ctrl/issues/153)).

**Offline / outage fallback:** keep a local clone of `sinkaberg/ui-kits` as a sibling folder to your projects. Search/replace `https://sinkaberg.github.io/ui-kits/` → your local path and every page renders from disk.

## Blocks and classes

| Block | Class(es) |
|---|---|
| App header | `.app-header` · `.app-header__name` · `.app-header__user` |
| Card | `.card` (shared, from `brand/components.css`) |
| Definition grid | `.dl` (on a `<dl>`; `dd.num` for a tabular-numeral value) |
| Data table | `.table` (shared) · `.table--fixed` · `th.num` / `td.num` |
| Badge | `.badge` (shared) · `.badge--pass` · `.badge--fail` · `.badge--skipped` · `.badge--unmapped` · `.badge--warning` · `.badge--high-priority-warning` · `.badge--error` · `.badge--action` |
| Collapsible details | `details.card` (native `<details>`/`<summary>`, no JS) |
| Muted text | `.muted` |
| Empty state | `.empty` |

`.badge--warning` and `.badge--unmapped` render identically (both amber) — this mirrors the two states carrying the same meaning in the first consumer.

## House rules

Same as the docs kit: salmon is scarce, colour carries meaning (pick a badge modifier by result, not mood), tokens only (`var(--sp-5)`, `var(--danger)` — no raw hex or magic pixels), and every page must work with no JS.
