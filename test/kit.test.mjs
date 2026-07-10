/* Kit integrity checks — dependency-free (node --test, Node ≥20 stdlib only).

   1. The published bundle is in sync with its source parts (assemble is reproducible).
   2. The token consumers (components + layouts) carry no raw hex — tokens only. */

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { assemble, BUNDLE } from "../tools/assemble.mjs";
import { lintCss, defaultTargets } from "../tools/adherence-lint.mjs";

test("docs/v1/sinkaberg-docs.css matches assemble() output (bundle not stale)", () => {
  const committed = readFileSync(BUNDLE, "utf8");
  assert.equal(committed, assemble(), "bundle is stale — run `npm run assemble`");
});

test("components + layouts are token-only (no raw hex)", () => {
  const offenders = [];
  for (const file of defaultTargets()) {
    const violations = lintCss(readFileSync(file, "utf8"));
    if (violations.length) offenders.push(`${file}: ${violations.map((v) => v.value).join(", ")}`);
  }
  assert.equal(offenders.length, 0, `raw hex found:\n${offenders.join("\n")}`);
});
