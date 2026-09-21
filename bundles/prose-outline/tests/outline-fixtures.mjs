#!/usr/bin/env node
/**
 * outline-fixtures — regenerate or compare outline-scan's expected JSON.
 *
 *   node tests/outline-fixtures.mjs            # compare; exit 1 on any difference
 *   node tests/outline-fixtures.mjs --update   # rewrite expected/*.json
 *
 * Expected files are output, reviewed in the diff, never hand-edited.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
export const OUTLINE_FIXTURES = join(HERE, "fixtures", "outline");
export const SCAN = join(HERE, "..", "skills", "prose-outline", "tools", "outline-scan.mjs");

export const loadOutlineCases = () => JSON.parse(readFileSync(join(OUTLINE_FIXTURES, "cases.json"), "utf8")).cases;

export async function scanCase(c) {
  const { scanOutline } = await import(pathToFileURL(SCAN).href);
  const file = join(OUTLINE_FIXTURES, "cases", c.name);
  return scanOutline(readFileSync(file, "utf8"), { file });
}

export const render = (result) => `${JSON.stringify(result, null, 2)}\n`;

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const update = process.argv.includes("--update");
  let differing = 0;
  for (const c of loadOutlineCases()) {
    const actual = render(await scanCase(c));
    const target = join(OUTLINE_FIXTURES, "expected", `${c.name}.json`);
    if (update) { writeFileSync(target, actual); console.log(`  wrote ${c.name}.json`); continue; }
    if (existsSync(target) && readFileSync(target, "utf8") === actual) console.log(`  ok   ${c.name}`);
    else { differing += 1; console.log(`  DIFF ${c.name} — rerun with --update and review the diff`); }
  }
  process.exit(differing ? 1 : 0);
}
