# Contributing to sinkaberg/ui-kits

## This repo is public

Anyone can read this repo, **including its full git history**.

- Demo and sample content (layouts, style guides, element galleries, tests) must be **synthetic and fictional**. The existing samples use a fictional sensor-telemetry narrative; follow that pattern.
- Never commit real company data, real names, real figures, internal hostnames or URLs, or credentials.
- A mistake cannot be fixed by a follow-up commit: the earlier commit stays readable. Check the diff before you push.
- Copy/voice rules are internal and live in `sinkaberg/design-system` (`brand/voice.md`); do not copy them here.

## Local setup

Requires Node ≥ 20 (CI uses Node 24). There are no npm dependencies to install.

```bash
git clone git@github.com:sinkaberg/ui-kits.git
npm run check      # assemble --check + token-only lint + node:test, both kits
```

To preview, open the HTML files directly in a browser; layouts inside this repo use relative paths so the kit previews itself.

## Making a change

1. Branch from `main` and open a PR. `.github/CODEOWNERS` requests review from `@sinkaberg/code-approvers`.
2. Edit **source parts** only — `brand/components.css`, `docs/v1/parts/*`, `app/v1/parts/*` — then `npm run assemble` to regenerate `docs/v1/sinkaberg-docs.css` and `app/v1/sinkaberg-app.css`. Never hand-edit those bundles.
3. `npm run check` must pass. CI (`.github/workflows/ci.yml`, check name `ci`) runs the same command on every PR.
4. Within a major (`v1/`) only compatible changes: additive classes, bug fixes, token tweaks that keep their meaning. Renaming/removing a class or changing semantics starts a new major folder (`v2/`) next to the frozen `v1/`.

### Tokens and `/design-sync`

What the repo states today:

- `brand/colors_and_type.css` is a mirror "written by `/design-sync`" (README, `tools/assemble.mjs`).
- ADR-0001: the brand is canonical in a **Claude Design project**; the mirror must never be hand-edited because the next `/design-sync` pull would overwrite local changes. Brand imagery is mirrored the same way (`brand/assets/imagery/README.md`).
- The README's "Contributing a change" section lists `brand/colors_and_type.css` among editable source parts, which conflicts with ADR-0001. Until that is resolved, treat the token file as not hand-editable and raise token changes as an issue.

> **Open question:** where the Claude Design project lives and who can run `/design-sync` is not yet documented — ask Torkil.

## Releases

- Merging to `main` deploys the whole repo to GitHub Pages (`.github/workflows/pages.yml`). Every page linking `…/v1/` picks up the change immediately.
- A kit release gets a one-line entry in [CHANGELOG.md](CHANGELOG.md) and a tag `docs/v1.x.y` or `app/v1.x.y`.

## Pull request checklist

See [.github/pull_request_template.md](.github/pull_request_template.md).
