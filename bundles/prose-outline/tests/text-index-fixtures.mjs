#!/usr/bin/env node
/**
 * text-index-fixtures — regenerate or compare the parity cases' expected JSON.
 *
 *   node tests/text-index-fixtures.mjs            # compare; exit 1 on any difference
 *   node tests/text-index-fixtures.mjs --update   # rewrite expected/*.json from the module
 *
 * The expected files are OUTPUT, never hand-edited: review the diff `--update`
 * produces, then commit it. prose-bible runs the same cases through its copy of
 * the module via its own selftest; the packaging check pins the two copies
 * byte-for-byte, so the parity test is the belt to that brace.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
export const FIXTURES = join(HERE, "fixtures", "text-index");

export function loadCases() {
  return JSON.parse(readFileSync(join(FIXTURES, "cases.json"), "utf8")).cases;
}

export async function runCase(modulePath, c) {
  const m = await import(pathToFileURL(modulePath).href);
  const source = readFileSync(join(FIXTURES, "cases", c.name), "utf8");
  const options = { markdown: c.markdown };
  return {
    case: c.name,
    module: m.TEXT_INDEX_VERSION,
    segment: m.segment(source, options),
    runs: m.capitalisedRuns(source, options),
    terms: m.definedTerms(source, options),
    numbers: m.numbersAndDates(source, options),
  };
}

export const render = (result) => `${JSON.stringify(result, null, 2)}\n`;

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const update = process.argv.includes("--update");
  const modulePath = join(HERE, "..", "skills", "prose-outline", "tools", "lib", "text-index.mjs");
  let differing = 0;
  for (const c of loadCases()) {
    const actual = render(await runCase(modulePath, c));
    const target = join(FIXTURES, "expected", `${c.name}.json`);
    if (update) { writeFileSync(target, actual); console.log(`  wrote ${c.name}.json`); continue; }
    const expected = existsSync(target) ? readFileSync(target, "utf8") : null;
    if (expected === actual) console.log(`  ok   ${c.name}`);
    else { differing += 1; console.log(`  DIFF ${c.name} — rerun with --update and review the diff`); }
  }
  process.exit(differing ? 1 : 0);
}
