#!/usr/bin/env node
/**
 * transcript-fixtures — regenerate or compare transcript-scan's expected JSON.
 *
 *   node tests/transcript-fixtures.mjs            # compare; exit 1 on any difference
 *   node tests/transcript-fixtures.mjs --update   # rewrite expected/*.json
 *
 * Expected files are output, reviewed in the diff, never hand-edited.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
export const TRANSCRIPTS = join(HERE, "fixtures", "transcripts");
export const TRANSCRIPT_SCAN = join(HERE, "..", "skills", "prose-brainstorm", "tools", "transcript-scan.mjs");
/** name, the format detection must report, and whether it is measured. */
export const TRANSCRIPT_CASES = [
  { name: "monologue.txt", format: "plain", status: "measured" },
  { name: "call.srt", format: "srt", status: "measured" },
  { name: "talk.vtt", format: "vtt", status: "measured" },
  { name: "interview.txt", format: "speaker-labelled", status: "measured" },
  { name: "otter.txt", format: "speaker-labelled", status: "measured" },
  { name: "fragment.txt", format: "plain", status: "not-evaluated" },
];

export async function scanCase(c) {
  const { scanTranscript } = await import(pathToFileURL(TRANSCRIPT_SCAN).href);
  return scanTranscript(readFileSync(join(TRANSCRIPTS, c.name), "utf8"));
}
export const render = (result) => `${JSON.stringify(result, null, 2)}\n`;

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const update = process.argv.includes("--update");
  let differing = 0;
  for (const c of TRANSCRIPT_CASES) {
    const actual = render(await scanCase(c));
    const target = join(TRANSCRIPTS, "expected", `${c.name}.json`);
    if (update) { writeFileSync(target, actual); console.log(`  wrote ${c.name}.json`); continue; }
    if (existsSync(target) && readFileSync(target, "utf8") === actual) console.log(`  ok   ${c.name}`);
    else { differing += 1; console.log(`  DIFF ${c.name} — rerun with --update and review the diff`); }
  }
  process.exit(differing ? 1 : 0);
}
