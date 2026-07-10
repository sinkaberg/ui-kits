# ADR-0001 — Code blocks use a system mono stack; doc density tightens from existing tokens

Date: 2026-06-18
Status: Accepted

## Context

Slice 2 (issue #3) completes `components.css` and must resolve the two open token items from the
design spec (§11):

1. **Mono font.** The canonical `--font-mono` token is `"Inter", ui-monospace, monospace` — i.e.
   Inter, a proportional UI face, leads the stack. Inter reads poorly for code (no fixed advance,
   ambiguous `il1|`/`O0`).
2. **Type scale.** The canonical scale is marketing-site sized (h1 64px, display 88px). Documents
   are denser and need smaller headings, but the brand is canonical in Claude Design and the
   mirror (`brand/colors_and_type.css`) must never be hand-edited (the `/design-sync` pull would
   overwrite local changes; the adherence rule forbids touching the mirror).

## Decision

**1 · Code blocks use a system mono stack, not `--font-mono`.**
`.code`, `pre`, `code`, `kbd`, `samp` are set to
`ui-monospace, SFMono-Regular, Menlo, Consolas, monospace` directly in `components.css`. This adds
no dependency and renders code legibly on every OS.

> **Flagged upstream.** `--font-mono` should be fixed in the canonical Claude Design project to a
> real monospace stack so it can be used directly. Until that lands, `components.css` carries the
> stack inline and does **not** reference `--font-mono`. This ADR is the flag; revisit when the
> next `/design-sync` pull brings a corrected token down.

**2 · Doc density tightens from the same tokens via a `.doc` context — no new tokens.**
Rather than add doc-scale tokens (which would mean editing the synced mirror), `components.css`
defines a `.doc` context that steps the marketing headings **one notch down the existing
`--fs-*` scale**:

| In `.doc` | `.t-h1` | `.t-h2` | `.t-h3` | `.t-h4` | `.t-h5` |
|---|---|---|---|---|---|
| renders at | `--fs-h2` | `--fs-h3` | `--fs-h4` | `--fs-h5` | `--fs-h6` |

`.doc` goes on the main reading container. Heroes/banners sit outside it and keep the full display
scale. No raw values, no new tokens, the canonical `.t-*` classes are reused (not redefined).

## Consequences

- No new runtime dependency and no edit to the brand mirror; the adherence lint stays green.
- Code is legible everywhere; the cost is a known divergence between `--font-mono` and what code
  blocks actually use, tracked here until the upstream token is fixed.
- Document authors get denser headings by adding `.doc` to the reading container; marketing-scale
  output is still available by omitting it.
