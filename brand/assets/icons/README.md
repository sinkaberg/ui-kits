# Brand icons

13 bespoke Sinkaberg line icons, each in 4 colour variants — 52 SVGs total.
This folder is now the canonical source (imported from the design agency's
original delivery, renamed from Norwegian to English).

## Structure

One folder per colour variant, same 13 filenames in each:

```
icons/
  blue-deep/     #1F295C  (--blue-deep, primary variant)
  blue-bright/   #3E7DEE  (--blue-bright)
  salmon/        #F06848  (--salmon / --coral)
  white/         #FFFFFF  (--white, for use on dark backgrounds)
```

Colour tokens are defined in `brand/colors_and_type.css`.

## Icons

| File | Original (Norwegian) | Depicts |
|---|---|---|
| `aquaculture.svg` | Havbruk | Sea pens / aquaculture |
| `communication.svg` | Kommunikasjon | Communication |
| `fish.svg` | Fisker | Fish (plural — not "fisherman") |
| `fish-welfare.svg` | Fiskevelferd | Fish welfare |
| `goal.svg` | Mål | Target / goal |
| `graph.svg` | Graf | Graph / statistics |
| `infinity.svg` | Evighet | Infinity / eternity |
| `innovation.svg` | Innovasjon | Innovation |
| `salmon-factory.svg` | Laksefabrikk | Salmon processing plant |
| `service-boat.svg` | Servicebåt | Service boat |
| `smolt.svg` | Settefisk | Smolt / juvenile fish |
| `technology.svg` | Teknologi | Technology |
| `wellboat.svg` | Brønnebåt | Wellboat |

## Format

- `viewBox="0 0 100 100"`, filled paths (no strokes), single colour per file.
- The four variants are identical geometry — only the fill differs. To recolour,
  copy any variant and change the single `fill` value in the `<style>` block.
- Never hand-edit paths; the geometry is canonical from the agency delivery.

## Notes from import (2026-07-10)

- Source dump used Norwegian names (`Ikon_<Navn>-<farge>.svg`) in a flat
  `Ikoner SVG/` folder.
- `Ikon_Kommunikasjon-mørkblå copy.svg` was mislabelled — its fill was
  `#F06848`, so it was the missing salmon communication variant and was
  renamed accordingly. All 13 × 4 sets are complete.
