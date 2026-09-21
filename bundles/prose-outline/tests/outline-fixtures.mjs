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

export const DIFF = join(HERE, "..", "skills", "prose-outline", "tools", "outline-diff.mjs");
export const DIFF_PAIRS = [{ name: "post-v1-v2", before: "post-v1.json", after: "post-v2.json" }];
export const loadOutline = (name) => JSON.parse(readFileSync(join(OUTLINE_FIXTURES, "outlines", name), "utf8"));
export async function diffPair(pair) {
  const { diffOutlines } = await import(pathToFileURL(DIFF).href);
  return diffOutlines(loadOutline(pair.before), loadOutline(pair.after));
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const update = process.argv.includes("--update");
  let differing = 0;
  const compare = (name, actual) => {
    const target = join(OUTLINE_FIXTURES, "expected", `${name}.json`);
    if (update) { writeFileSync(target, actual); console.log(`  wrote ${name}.json`); return; }
    if (existsSync(target) && readFileSync(target, "utf8") === actual) console.log(`  ok   ${name}`);
    else { differing += 1; console.log(`  DIFF ${name} — rerun with --update and review the diff`); }
  };
  for (const c of loadOutlineCases()) compare(c.name, render(await scanCase(c)));
  for (const p of DIFF_PAIRS) compare(`diff-${p.name}`, render(await diffPair(p)));
  process.exit(differing ? 1 : 0);
}
