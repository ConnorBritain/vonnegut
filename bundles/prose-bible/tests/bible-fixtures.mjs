#!/usr/bin/env node
/**
 * bible-fixtures — regenerate or compare entity-index and index-diff expected JSON.
 *
 *   node tests/bible-fixtures.mjs            # compare; exit 1 on any difference
 *   node tests/bible-fixtures.mjs --update   # rewrite expected/*.json
 *
 * Expected files are output, reviewed in the diff, never hand-edited. Two
 * fixture projects: `project` (three files with planted drift — an eye colour,
 * a redefined road, a moved flood year, a retold anecdote) and `control`
 * (three consistent essays whose one deliberate restatement is a repeat
 * candidate and nothing more).
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
export const FIXTURES = join(HERE, "fixtures");
const TOOLS = join(HERE, "..", "skills", "prose-bible", "tools");

export const PROJECTS = ["project", "control"];

export async function indexProject(name) {
  const { buildIndex, collectFiles } = await import(pathToFileURL(join(TOOLS, "entity-index.mjs")).href);
  return buildIndex(collectFiles([join(FIXTURES, name)]));
}

export async function diffProject(index) {
  const { diffIndex } = await import(pathToFileURL(join(TOOLS, "index-diff.mjs")).href);
  return diffIndex(index);
}

export const render = (result) => `${JSON.stringify(result, null, 2)}\n`;

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const update = process.argv.includes("--update");
  let differing = 0;
  const compare = (name, actual) => {
    const target = join(FIXTURES, "expected", `${name}.json`);
    if (update) { writeFileSync(target, actual); console.log(`  wrote ${name}.json`); return; }
    if (existsSync(target) && readFileSync(target, "utf8") === actual) console.log(`  ok   ${name}`);
    else { differing += 1; console.log(`  DIFF ${name} — rerun with --update and review the diff`); }
  };
  for (const name of PROJECTS) {
    const index = await indexProject(name);
    compare(`${name}.index`, render(index));
    compare(`${name}.diff`, render(await diffProject(index)));
  }
  process.exit(differing ? 1 : 0);
}
