# Diagram-oppskrift — håndtegnet inline-SVG på merkevaren

EYEBROW: SINKABERG DESIGNSYSTEM

Denne oppskriften viser hvordan vi tegner enkle, presise diagrammer – flytskjemaer,
arkitektur, prosesskart – som **håndskrevet inline-SVG**, kun bygget på merkevarens tokens.
Ingen Mermaid, ingen byggesteg, ingen kjøretidsavhengighet: et `<svg>`-element limt rett inn
i en selvstendig HTML-side. Det er det samme prinsippet som resten av systemet – ett sett
tokens, samme navy, blå og laks overalt, slik at et diagram aldri driver av merkevaren.

> Regelen er enkel: **all diagramfarge går gjennom `var(--token)`, aldri en rå hex.** SVG
> styles med CSS-klasser som peker på de samme tokenene som resten av kittet. Da følger
> diagrammet merkevaren automatisk, akkurat som heroen og kortene.

> **`.dg-*`-vokabularet ligger i kittet.** En side som hotlinker `sinkaberg-docs.css`
> har allerede alle klassene under – du skriver bare SVG-markupen. CSS-en under vises for
> referanse (og for en enkeltstående side som inliner stilarket).

---

## Slik fungerer det

Et diagram er ett `<svg viewBox="0 0 W H">` med:

1. en `<defs>`-blokk som definerer pilspisser (`<marker>`),
2. **noder** – avrundede `<rect>` med navy ramme og lys flate,
3. **forbindelser** – `<line>`/`<path>` med pilspiss i enden,
4. **etiketter** – `<text>` i Sora/Inter,
5. en **tegnforklaring** (legend) som forklarer fargesemantikken.

Alt stylet med klasser i et lite `.dg-*`-vokabular som ligger i kittet (`sinkaberg-docs.css`).
Hver verdi peker på et token.

### 1 · Diagram-CSS (ligger i kittet — vist for referanse)

```css
/* Diagram-vokabular — kun var(--token), aldri rå hex.
   .dg-* ligger i kittet; en side som hotlinker sinkaberg-docs.css har dem allerede. */

/* Lerretet */
.dg { width: 100%; height: auto; font-family: var(--font-body); }

/* Node — avrundet rektangel: navy ramme, lys isflate, rolig skygge via stroke */
.dg-node {
  fill: var(--bg-1);
  stroke: var(--navy);
  stroke-width: 1.5;
}
.dg-node--ice   { fill: var(--ice); }            /* sekundær / hvilende node */
.dg-node--navy  { fill: var(--navy); stroke: var(--navy); }  /* framhevet, mørk node */
.dg-node--success { stroke: var(--success); }    /* status: klart / validert */
.dg-node--warning { stroke: var(--warning); }    /* status: pass på */

/* Connector / edge — tynn navy strek med pilspiss i enden */
.dg-edge {
  fill: none;
  stroke: var(--navy);
  stroke-width: 1.5;
  marker-end: url(#dg-arrow);
}
.dg-edge--dashed { stroke-dasharray: 4 4; }      /* valgfri / betinget vei */
.dg-edge--emphasis { stroke: var(--salmon); marker-end: url(#dg-arrow-salmon); }  /* laks: det ene kritiske leddet */

/* Label — Sora for titler i noden, Inter for kantetiketter.
   <text> arver ikke color; vi setter fill direkte med token. */
.dg-label {
  fill: var(--fg-1);
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 15px;
}
.dg-label--edge { fill: var(--fg-3); font-family: var(--font-body); font-weight: 400; font-size: 13px; }
.dg-label--on-navy { fill: var(--on-navy-1); }   /* tekst oppå en navy node */

/* Pilspisser — fyll arves av <marker>-pathen (se <defs> nedenfor) */
.dg-arrowhead { fill: var(--navy); }             /* standard navy pilspiss */
.dg-arrowhead--salmon { fill: var(--salmon); }   /* laks-pilspiss for .dg-edge--emphasis */

/* Legend — tegnforklaring */
.dg-legend { display: flex; flex-wrap: wrap; gap: var(--sp-4); margin-top: var(--sp-4); }
.dg-legend > span { display: inline-flex; align-items: center; gap: var(--sp-2); font-size: var(--fs-body-s); color: var(--fg-2); }
.dg-legend i { width: var(--sp-4); height: var(--sp-4); border-radius: var(--r-xs); display: inline-block; }
/* Swatches mirror the real node fills — define one per node type the diagram uses. */
.dg-swatch--node    { background: var(--bg-1); border: 1.5px solid var(--navy); }
.dg-swatch--ice     { background: var(--ice); border: 1.5px solid var(--navy); }
.dg-swatch--navy    { background: var(--navy); border: 1.5px solid var(--navy); }
.dg-swatch--success { background: var(--bg-1); border: 1.5px solid var(--success); }
.dg-swatch--warning { background: var(--bg-1); border: 1.5px solid var(--warning); }
.dg-swatch--emphasis{ background: var(--bg-1); border: 1.5px solid var(--salmon); }
```

### 2 · Pilspiss / marker `<defs>`

Definer pilspissene **én gang** i `<defs>`, og pek på dem med `marker-end` (eller
`marker-start`) på hver forbindelse. Den navy pilspissen arver navy fra `.dg-arrowhead`; den
framhevede streken (`.dg-edge--emphasis`) bruker en egen laks-pilspiss (`#dg-arrow-salmon`)
som arver laks fra `.dg-arrowhead--salmon`, så pilspissen følger streken sin farge.

```html
<svg class="dg" viewBox="0 0 640 200" role="img" aria-label="Eksempeldiagram">
  <defs>
    <!-- Standard navy pilspiss: tegnes én gang, gjenbrukes av alle .dg-edge -->
    <marker id="dg-arrow" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path class="dg-arrowhead" d="M0,0 L10,5 L0,10 z" />
    </marker>
    <!-- Laks-pilspiss: brukes av .dg-edge--emphasis (det ene framhevede leddet) -->
    <marker id="dg-arrow-salmon" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path class="dg-arrowhead--salmon" d="M0,0 L10,5 L0,10 z" />
    </marker>
  </defs>
  <!-- … noder, forbindelser og etiketter … -->
</svg>
```

### 3 · Node

En node er en avrundet `<rect>` med en `<text>`-etikett oppå. Hold radius på linje med
`--r-md` (12 px) og bruk `.dg-label` for tittelen.

```html
<g>
  <rect class="dg-node" x="20" y="60" width="160" height="64" rx="12" />
  <text class="dg-label" x="100" y="96" text-anchor="middle">Smolt</text>
</g>
```

For en mørk, framhevet node: `class="dg-node dg-node--navy"` og
`class="dg-label dg-label--on-navy"` på teksten.

### 4 · Connector / forbindelse

En `<line>` eller `<path>` med `.dg-edge`. Pilspissen kommer fra `marker-end`. En valgfri vei
markeres med `.dg-edge--dashed`; det ene framhevede leddet med `.dg-edge--emphasis` (laks
strek + laks-pilspiss).

```html
<line class="dg-edge" x1="180" y1="92" x2="220" y2="92" />
<line class="dg-edge dg-edge--emphasis" x1="360" y1="92" x2="404" y2="92" />
<path class="dg-edge dg-edge--dashed" d="M400,92 C440,92 440,150 480,150" />
```

### 5 · Label / etikett

Nodetitler bruker `.dg-label` (Sora). Etiketter **på** en forbindelse bruker
`.dg-label--edge` (Inter, dempet) – kort og presist, sentrert over streken.

```html
<text class="dg-label--edge" x="200" y="84" text-anchor="middle">overfører</text>
```

### 6 · Fargesemantikk (colour semantics)

Fargene bærer mening – og laks er fortsatt **den ene aksenten**, brukt sparsomt på det ene
som skal framheves, aldri som en stor flate.

| Rolle | Token | Klasse | Når |
| --- | --- | --- | --- |
| Node, ramme og strek | `var(--navy)` | `.dg-node`, `.dg-edge` | Standard – det rolige grunnfjellet |
| Sekundær / hvilende node | `var(--ice)` | `.dg-node--ice` | Støtteboks, kontekst |
| Framhevet, mørk node | `var(--navy)` | `.dg-node--navy` | Det ene kritiske leddet som en fylt boks |
| Emphasis-strek / det kritiske leddet | `var(--salmon)` | `.dg-edge--emphasis` | Den ene framhevede forbindelsen (laks strek + laks-pilspiss) |
| Status: klart | `var(--success)` | `.dg-node--success` | Ferdig, validert, grønt lys |
| Status: pass på | `var(--warning)` | `.dg-node--warning` | Venter, krever oppmerksomhet |

> Laks signaliserer endringskraft – ett framhevet ledd, ikke ti. Holder vi den scarce, leser
> diagrammet rolig og selvsikkert, helt i tråd med den blå arketypen.

### 7 · Legend / tegnforklaring

Legg en kort tegnforklaring under diagrammet så fargesemantikken er selvforklarende. Den
bruker de samme tokenene som strekene – ett system. Speil swatchene mot de faktiske
node-fyllene i diagrammet (én swatch per node-type), ikke generiske ruter – se
`examples/diagram-sample.html`.

```html
<div class="dg-legend" aria-hidden="true">
  <span><i class="dg-swatch--success"></i> Klart / validert node</span>
  <span><i class="dg-swatch--ice"></i> Sekundær node</span>
  <span><i class="dg-swatch--navy"></i> Framhevet / kritisk ledd</span>
  <span><i class="dg-swatch--warning"></i> Pass på</span>
</div>
```

---

## Tilgjengelighet

- Gi `<svg>` `role="img"` og en `aria-label` som oppsummerer diagrammet i én setning.
- Tegnforklaringen er synlig tekst; selve fargefletten (`<i>`) er `aria-hidden`.
- Tekst i SVG er ekte `<text>`, ikke kurver – den leses og søkes som tekst.

## Sjekkliste

- [ ] Pilspisser (`#dg-arrow` + `#dg-arrow-salmon`) definert i `<defs>` og pekt på med `marker-end`.
- [ ] Noder er `.dg-node` (avrundet `<rect>`, navy ramme); status via `.dg-node--success` / `.dg-node--warning`.
- [ ] Forbindelser er `.dg-edge`; valgfrie veier `.dg-edge--dashed`; det kritiske leddet `.dg-edge--emphasis`.
- [ ] Etiketter er `.dg-label` / `.dg-label--edge`.
- [ ] Fargesemantikken følger tabellen; laks brukt sparsomt.
- [ ] Tegnforklaring til stede.
- [ ] Ingen rå hex – alt går gjennom `var(--token)`. Kjør `node tools/adherence-lint.mjs`.

Et komplett, selvstendig eksempel som følger denne oppskriften ligger i
`examples/diagram-sample.html`.
