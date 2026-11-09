#!/usr/bin/env node
/**
 * outline-handoff-fixtures — regenerate or compare outline-job's expected jobs.
 *
 *   node tests/outline-handoff-fixtures.mjs            # compare; exit 1 on any difference
 *   node tests/outline-handoff-fixtures.mjs --update   # rewrite expected/*.json
 *
 * The fixtures are copies of prose-outline's (an approved candidate and the
 * interview's briefs) so this bundle's tests run without the sibling. Expected
 * files are output, reviewed in the diff, never hand-edited.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
export const HANDOFF = join(HERE, "fixtures", "outline-handoff");
export const OUTLINE_JOB = join(HERE, "..", "skills", "prose-draft", "tools", "outline-job.mjs");
export const HANDOFF_CASES = [
  { name: "approved", outline: "outline.json", brief: "brief.json", opts: { harness: "claude" } },
  { name: "allow-open", outline: "outline-open.json", brief: "brief.json", opts: { harness: "claude", allowOpen: true } },
  { name: "no-length", outline: "outline-no-length.json", brief: "brief.json", opts: { harness: "codex" } },
  { name: "no-brief", outline: "outline.json", brief: null, opts: { harness: "codex", form: "essay", purpose: "Argue for protecting slow work." } },
];
export const load = (name) => JSON.parse(readFileSync(join(HANDOFF, name), "utf8"));
export async function jobFor(c) {
  const { outlineJob } = await import(pathToFileURL(OUTLINE_JOB).href);
  return outlineJob(load(c.outline), c.brief ? load(c.brief) : null, c.opts);
}
export const render = (job) => `${JSON.stringify(job, null, 2)}\n`;

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const update = process.argv.includes("--update");
  let differing = 0;
  for (const c of HANDOFF_CASES) {
    const actual = render(await jobFor(c));
    const target = join(HANDOFF, "expected", `${c.name}.json`);
    if (update) { writeFileSync(target, actual); console.log(`  wrote ${c.name}.json`); continue; }
    if (existsSync(target) && readFileSync(target, "utf8") === actual) console.log(`  ok   ${c.name}`);
    else { differing += 1; console.log(`  DIFF ${c.name} — rerun with --update and review the diff`); }
  }
  process.exit(differing ? 1 : 0);
}
