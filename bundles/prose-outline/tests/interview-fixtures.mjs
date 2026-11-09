#!/usr/bin/env node
/**
 * interview-fixtures — regenerate or compare brief-check's expected JSON.
 *
 *   node tests/interview-fixtures.mjs            # compare; exit 1 on any difference
 *   node tests/interview-fixtures.mjs --update   # rewrite expected/*.json
 *
 * Each brief is checked against the monologue's cleaned text, the text its
 * transcript-sourced evidence quotes. Expected files are output, reviewed in
 * the diff, never hand-edited.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
export const BRIEFS = join(HERE, "fixtures", "briefs-interview");
export const BRIEF_CHECK = join(HERE, "..", "skills", "prose-interview", "tools", "brief-check.mjs");
const SCAN = join(HERE, "..", "skills", "prose-brainstorm", "tools", "transcript-scan.mjs");
export const INTERVIEW_CASES = ["empty", "partial", "audience-changed", "transcript-drift", "recommendation-unconfirmed", "skipped-audience", "done"];

export async function monologueClean() {
  const { cleanTranscript } = await import(pathToFileURL(SCAN).href);
  return cleanTranscript(readFileSync(join(HERE, "fixtures", "transcripts", "monologue.txt"), "utf8")).clean;
}
export const loadBrief = (name) => JSON.parse(readFileSync(join(BRIEFS, `${name}.json`), "utf8"));
export async function checkCase(name) {
  const { checkBrief } = await import(pathToFileURL(BRIEF_CHECK).href);
  return checkBrief(loadBrief(name), { clean: await monologueClean() });
}
export const render = (result) => `${JSON.stringify(result, null, 2)}\n`;

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const update = process.argv.includes("--update");
  let differing = 0;
  for (const name of INTERVIEW_CASES) {
    const actual = render(await checkCase(name));
    const target = join(BRIEFS, "expected", `${name}.json`);
    if (update) { writeFileSync(target, actual); console.log(`  wrote ${name}.json`); continue; }
    if (existsSync(target) && readFileSync(target, "utf8") === actual) console.log(`  ok   ${name}`);
    else { differing += 1; console.log(`  DIFF ${name} — rerun with --update and review the diff`); }
  }
  process.exit(differing ? 1 : 0);
}
