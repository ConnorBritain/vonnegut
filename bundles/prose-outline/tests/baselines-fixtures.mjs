#!/usr/bin/env node
/**
 * baselines-fixtures — regenerate or compare outline-compare's expected output.
 *
 *   node tests/baselines-fixtures.mjs            # compare; exit 1 on any difference
 *   node tests/baselines-fixtures.mjs --update   # rewrite expected-compare.{json,md}
 *
 * Expected files are output, reviewed in the diff, never hand-edited.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
export const CANDIDATES = join(HERE, "fixtures", "candidates");
export const CANDIDATE_NAMES = ["problem-solution", "narrative-arc-overshoot", "question-and-answer-uncovered"];
const COMPARE = join(HERE, "..", "skills", "prose-outline", "tools", "outline-compare.mjs");

export async function compareFixture() {
  const { compareCandidates, renderMarkdown } = await import(pathToFileURL(COMPARE).href);
  const briefDoc = JSON.parse(readFileSync(join(HERE, "fixtures", "briefs-interview", "done.json"), "utf8"));
  const result = compareCandidates(CANDIDATE_NAMES.map((name) => ({ name, body: JSON.parse(readFileSync(join(CANDIDATES, `${name}.json`), "utf8")) })), { briefDoc });
  return { json: `${JSON.stringify(result, null, 2)}\n`, md: renderMarkdown(result) };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const update = process.argv.includes("--update");
  const out = await compareFixture();
  let differing = 0;
  for (const [ext, text] of Object.entries(out)) {
    const target = join(CANDIDATES, `expected-compare.${ext}`);
    if (update) { writeFileSync(target, text); console.log(`  wrote expected-compare.${ext}`); continue; }
    if (existsSync(target) && readFileSync(target, "utf8") === text) console.log(`  ok   expected-compare.${ext}`);
    else { differing += 1; console.log(`  DIFF expected-compare.${ext} — rerun with --update and review the diff`); }
  }
  process.exit(differing ? 1 : 0);
}
