/* Kit integrity checks — dependency-free (node --test, Node ≥20 stdlib only).

   1. Each published kit bundle is in sync with its source parts (assemble is reproducible).
   2. The token consumers (components, docs layouts, app parts + style guide) carry no raw hex. */

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { KITS, assemble, bundlePath } from "../tools/assemble.mjs";
import { lintCss, defaultTargets } from "../tools/adherence-lint.mjs";

for (const kit of KITS) {
  test(`${kit.bundle} matches assemble() output (bundle not stale)`, () => {
    const committed = readFileSync(bundlePath(kit), "utf8");
    assert.equal(committed, assemble(kit), `${kit.bundle} is stale — run \`npm run assemble\``);
  });
}

test("components + layouts + app parts are token-only (no raw hex)", () => {
  const offenders = [];
  for (const file of defaultTargets()) {
    const violations = lintCss(readFileSync(file, "utf8"));
    if (violations.length) offenders.push(`${file}: ${violations.map((v) => v.value).join(", ")}`);
  }
  assert.equal(offenders.length, 0, `raw hex found:\n${offenders.join("\n")}`);
});
