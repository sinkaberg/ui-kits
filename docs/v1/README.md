# Sinkaberg Docs Kit — v1

Branded HTML documentation for a git repository — one shared stylesheet, one optional script, six page layouts, and a live style guide.

Live style guide: https://sinkaberg.github.io/ui-kits/docs/v1/style-guide.html

## What's here

```
docs/v1/
├── sinkaberg-docs.css        ← the one stylesheet every page links (tokens → components → elements)
├── sinkaberg-docs.js         ← optional: TOC scrollspy, tabs, index search/filter (all degrade without it)
├── fonts/                    ← Sora + Inter variable fonts, served next to the CSS
├── index.html                ← repo table of contents — grouped by type, searchable, filterable
├── style-guide.html          ← element catalog: what each element is, when to use it, its class
├── architecture-explainer.html ← the original long-form doc, re-based onto the shared CSS
├── elements/                 ← live galleries with copy-pasteable markup
│   ├── typography.html       ← type scale, eyebrow, highlight, pull quote, kbd, footnotes
│   ├── callouts.html         ← 5 callouts, pills/tags/badges, status chips, stats
│   ├── tables.html           ← data table, spec table, do/don't, definition list, glossary
│   ├── code.html             ← code block, annotated code, diff lines, repo tree
│   └── flow.html             ← steps, pipeline, tabs, timeline, cards, diagram vocabulary
├── diagram-recipe.md         ← how to hand-author on-brand inline-SVG diagrams (.dg-* vocab ships in the kit)
└── layouts/                  ← starting points — copy one, replace the content
    ├── guide.html            ← how-to walkthrough (prereqs, steps, verify)
    ├── reference.html        ← dense spec (tables, contract fields, failure modes)
    ├── concept.html          ← short explainer built around one diagram
    ├── runbook.html          ← operational procedure (warnings, checklist, rollback)
    ├── decision-record.html  ← ADR (record, context, decision, options, consequences)
    ├── status-recap.html     ← recurring management recap (TL;DR, happened, decisions, risks, next)
    ├── explainer.html        ← long-form, navigable read (sticky numbered TOC + scrollspy, sections, steps)
    └── proposal.html         ← one-pager / proposal (navy hero, card grid, stats, modal, one-page print)
```

## Using the kit from another repo

Documents hotlink the published stylesheet and script — no per-repo copies:

```html
<link rel="stylesheet" href="https://sinkaberg.github.io/ui-kits/docs/v1/sinkaberg-docs.css">
…
<script src="https://sinkaberg.github.io/ui-kits/docs/v1/sinkaberg-docs.js" defer></script>
```

The fonts load automatically relative to the CSS. The `v1` in the URL is the
compatibility contract: this folder only ever receives compatible fixes and
additions, so pages linking `v1` keep working and pick up improvements. A
breaking change ships as a new `v2/` folder alongside — existing docs are
never restyled out from under you.

**Offline / outage fallback:** keep a local clone of `sinkaberg/ui-kits` as a
sibling folder to your projects. Search/replace
`https://sinkaberg.github.io/ui-kits/` → your local path and every page renders
from disk.

## Writing a new document

1. Copy the layout closest to your intent from `layouts/`.
2. Keep the shell (hero → `.wrap.layout` → sticky `.toc` + `main.doc`); replace the content.
3. Point the stylesheet link at the published URL above (layouts inside this repo use relative paths so the kit can preview itself).
4. Add an entry to your repo's `index.html` — title, one-line description, tags, owner, status chip, date.

Pick the layout by the reader's job: **do** something → guide · **look up** a fact → reference · **understand** an idea → concept · **respond** to an incident → runbook · **remember why** → decision record · **catch up** on a period → status recap · **read a long-form piece** → explainer · **decide on a proposal** → proposal.

## House rules

- Salmon is scarce — one marked thing per view, never a background.
- Callout and status colours carry meaning; pick by intent, not mood.
- Tokens only: `var(--sp-5)`, `var(--salmon)` — no raw hex or magic pixels in a page.
- Every page must work with no JS and print cleanly (the stylesheet handles both).

## Single-file documents

If you truly need a single-file document (email attachment, paste into a wiki),
inline the stylesheet into a `<style>` tag — the layers are commented so it
lifts cleanly.
