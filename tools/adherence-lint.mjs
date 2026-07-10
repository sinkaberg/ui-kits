/* Adherence lint — the component layer and page layouts may reference brand colour
   only through design-system tokens (var(--token)), never a raw hex.

   Scope note: this lints the token *consumers* — brand/components.css and the page
   layouts under docs/v1/layouts/. It deliberately does NOT lint the token-definition
   file (brand/colors_and_type.css, where hex literals define the tokens) nor the
   generated bundle (docs/v1/sinkaberg-docs.css, which inlines those definitions and
   the style-guide's code-syntax swatches).

   Library:  import { lintCss } from "./adherence-lint.mjs"
   CLI:      node tools/adherence-lint.mjs [files...]
             (defaults to brand/components.css + docs/v1/layouts/**; exits 1 on any violation) */

import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

// A raw hex colour: a `#` followed by 3+ hex digits. The `(?<!&)` skips HTML numeric
// character references (`&#169;`, `&#x2014;`), and matching 3-or-more (not 3–8) means an
// over-long typo'd hex is still caught rather than silently passing the `\b` check.
const HEX = /(?<!&)#[0-9a-fA-F]{3,}\b/g;
const CSS_COMMENT = /\/\*[\s\S]*?\*\//g;
const HTML_COMMENT = /<!--[\s\S]*?-->/g;

/** Strip comments — a hex mentioned in a comment never renders, so it is not a violation.
   Replace with same-length blanks to preserve offsets for line/column reporting. */
function stripComments(text) {
  const blank = (m) => m.replace(/[^\n]/g, " ");
  return text.replace(CSS_COMMENT, blank).replace(HTML_COMMENT, blank);
}

/** Lint CSS/HTML text. Returns an array of { value, line, column, message }. */
export function lintCss(text) {
  const violations = [];
  const scannable = stripComments(text);
  let m;
  while ((m = HEX.exec(scannable)) !== null) {
    const before = scannable.slice(0, m.index);
    const line = before.split("\n").length;
    const column = m.index - before.lastIndexOf("\n");
    violations.push({
      value: m[0],
      line,
      column,
      message: "Raw hex colour — use a design-system colour token via var().",
    });
  }
  return violations;
}

/** Recursively collect files under dir whose name ends with one of exts. */
function walk(dir, exts) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return []; // dir does not exist
  }
  return entries.flatMap((e) => {
    const full = join(dir, e.name);
    if (e.isDirectory()) return walk(full, exts);
    return exts.some((ext) => e.name.endsWith(ext)) ? [full] : [];
  });
}

/** Default targets, resolved relative to the repo root. */
export function defaultTargets() {
  return [join(ROOT, "brand/components.css"), ...walk(join(ROOT, "docs/v1/layouts"), [".html"])];
}

function resolveTargets(args) {
  if (args.length > 0) return args;
  return defaultTargets();
}

function runCli(args) {
  const files = resolveTargets(args);
  let total = 0;
  for (const file of files) {
    let text;
    try {
      text = readFileSync(file, "utf8");
    } catch {
      continue; // a glob that matched nothing, or a missing optional target
    }
    for (const v of lintCss(text)) {
      total += 1;
      console.log(`${file}:${v.line}:${v.column}  ${v.message} (${v.value})`);
    }
  }
  if (total > 0) {
    console.log(`\nadherence-lint: ${total} violation(s) across ${files.length} file(s).`);
    process.exitCode = 1;
  } else {
    console.log(`adherence-lint: clean (${files.length} file(s) checked).`);
  }
}

// Run as a CLI only when invoked directly, not when imported.
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  runCli(process.argv.slice(2));
}
