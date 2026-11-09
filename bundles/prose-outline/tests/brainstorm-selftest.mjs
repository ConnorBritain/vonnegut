#!/usr/bin/env node
/**
 * prose-outline brainstorm and interview selftest — roadmap items H and I.
 *
 *   node bundles/prose-outline/tests/brainstorm-selftest.mjs
 *
 * Grows one deliverable at a time (docs/roadmap/H-transcript-brainstorm.md,
 * docs/roadmap/I-interview.md). Every case builds its scratch state under the
 * OS temp directory and touches nothing in the repo. No model is dispatched.
 * Also the `brainstorm` suite of bundles/prose-author/tests/mutations.mjs, so
 * every check must survive a removed guard without crashing.
 */
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";
import { TRANSCRIPTS, TRANSCRIPT_CASES, TRANSCRIPT_SCAN, scanCase, render } from "./transcript-fixtures.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const BUNDLE = resolve(HERE, "..");
const BRAINSTORM = join(BUNDLE, "skills", "prose-brainstorm");

let passed = 0;
let failed = 0;
const failures = [];
function check(name, condition, detail = "") {
  if (condition) { passed += 1; process.stdout.write(`  ok   ${name}\n`); }
  else { failed += 1; failures.push(`${name}${detail ? ` — ${detail}` : ""}`); process.stdout.write(`  FAIL ${name}${detail ? ` — ${detail}` : ""}\n`); }
}
const group = (title) => process.stdout.write(`\n${title}\n`);
/** Run a call that a REMOVED guard could turn into a throw; a mutation must fail a check, never crash the suite. */
const attemptAsync = async (fn) => { try { return (await fn()) ?? {}; } catch (e) { return { crashed: e.message }; } };
const tmp = mkdtempSync(join(tmpdir(), "prose-brainstorm-"));

try {
  const ts = await import(pathToFileURL(TRANSCRIPT_SCAN).href);
  const read = (name) => readFileSync(join(TRANSCRIPTS, name), "utf8");

  /* ---------------------------------------------------------------- */
  group("transcript-scan — fixtures reproduce, formats are detected, short material is not-evaluated");
  for (const c of TRANSCRIPT_CASES) {
    const result = await attemptAsync(() => scanCase(c));
    const expected = join(TRANSCRIPTS, "expected", `${c.name}.json`);
    check(`${c.name}: reproduces its expected JSON byte for byte`, existsSync(expected) && !result.crashed && readFileSync(expected, "utf8") === render(result),
      "rerun tests/transcript-fixtures.mjs --update and review the diff");
    check(`${c.name}: detected as ${c.format}, ${c.status}`, result.format === c.format && result.status === c.status, `${result.format}/${result.status}`);
  }
  const fragment = ts.scanTranscript(read("fragment.txt"));
  check("a fragment under 150 words is not-evaluated, says why, and proposes no segments", fragment.status === "not-evaluated" && /150/.test(fragment.reason ?? "") && fragment.segments.length === 0);

  /* ---------------------------------------------------------------- */
  group("transcript-scan — cleaning removes only scaffolding, never the speaker's words");
  const cleanOf = (name) => { const raw = read(name); return ts.cleanTranscript(raw, ts.detectFormat(raw)).clean; };
  const srt = cleanOf("call.srt"), vtt = cleanOf("talk.vtt"), interview = cleanOf("interview.txt"), otter = cleanOf("otter.txt");
  check("no timecode, cue number, WEBVTT header, NOTE block or voice tag survives cleaning",
    ![srt, vtt].some((t) => /-->|^\d+$|WEBVTT|^NOTE|<v |^Kind:|^intro-1$/m.test(t)));
  const cueLines = read("call.srt").split("\n").filter((l) => l.trim() && !/^\d+$/.test(l.trim()) && !/-->/.test(l));
  check("every SRT cue's text survives as its own cleaned line, word for word", cueLines.every((l) => srt.split("\n").includes(l.trim())), `${cueLines.length} cues`);
  check("speaker labels and Otter header lines are removed, the sentences after them kept",
    !/^(Maya|Dev):/m.test(interview) && !/^(Connor|Priya)\s+\d/m.test(otter) && interview.includes("So tell me where the idea for the cooperative came from.") && otter.includes("Three lines, what we decided, who owns it, when we check again."));
  const mono = ts.scanTranscript(read("monologue.txt"));
  check("fillers are counted AND kept: the cleaned monologue still says every 'um' the source does",
    mono.fillers.um === (read("monologue.txt").match(/\bum\b/gi) || []).length && (cleanOf("monologue.txt").match(/\bum\b/gi) || []).length === mono.fillers.um && mono.fillers.um > 0);
  const interviewScan = ts.scanTranscript(read("interview.txt"));
  check("turns alternate by speaker, consecutive lines by one speaker are one turn", interviewScan.turns.length === 12 && interviewScan.turns[0].speaker === "Maya" && interviewScan.turns[1].speaker === "Dev");

  /* ---------------------------------------------------------------- */
  group("transcript-scan — every location points at the cleaned text");
  const monoClean = cleanOf("monologue.txt").split("\n");
  check("every question is on the line it names", mono.questions.length > 0 && mono.questions.every((q) => monoClean[q.line - 1]?.includes(q.text.slice(0, 20))));
  check("segments tile the transcript in order, inside the cleaned line count",
    mono.segments.length > 1 && mono.segments.every((s, i) => s.start_line >= 1 && s.end_line <= mono.clean.lines && s.start_line <= s.end_line && (i === 0 || s.start_line >= mono.segments[i - 1].end_line)));
  const near = (line) => mono.segments.some((s) => Math.abs(s.start_line - line) <= 2);
  check("a segment starts within two lines of each planted topic change (meetings at 13, newsletter at 23)", near(13) && near(23), mono.segments.map((s) => s.start_line).join(","));
  const terms = new Map(mono.recurring_terms.map((t) => [t.term.toLowerCase(), t]));
  check("a word repeated across a topic is a recurring term, with every line it appears on", (terms.get("starter")?.count ?? 0) >= 3 && terms.get("starter").lines.every((l) => monoClean[l - 1]?.toLowerCase().includes("starter")));
  check("a word that only ever opens a sentence ('Okay', 'So') is not a term", !terms.has("okay") && !terms.has("so"));

  /* ---------------------------------------------------------------- */
  group("transcript-scan CLI — refusals and the cleaned-text file");
  const cli = (...a) => spawnSync(process.execPath, [TRANSCRIPT_SCAN, ...a], { encoding: "utf8" });
  writeFileSync(join(tmp, "empty.txt"), "\n\n");
  writeFileSync(join(tmp, "binary.txt"), Buffer.from([0x52, 0x49, 0x46, 0x46, 0x00, 0x01, 0x02]));
  check("an empty file and a binary file are refused (exit 1); bad usage exits 2",
    cli(join(tmp, "empty.txt")).status === 1 && cli(join(tmp, "binary.txt")).status === 1 && cli().status === 2 && cli(join(TRANSCRIPTS, "call.srt"), "--bogus").status === 2);
  const out = join(tmp, "clean.txt");
  const run = cli(join(TRANSCRIPTS, "talk.vtt"), "--json", "--clean-out", out);
  const parsed = run.status === 0 ? JSON.parse(run.stdout) : {};
  const { createHash } = await import("node:crypto");
  check("--clean-out writes exactly the text whose digest and line count the JSON reports",
    existsSync(out) && createHash("sha256").update(readFileSync(out, "utf8")).digest("hex") === parsed.clean?.digest && readFileSync(out, "utf8").split("\n").length - 1 === parsed.clean?.lines);
} finally {
  rmSync(tmp, { recursive: true, force: true });
}

process.stdout.write(`\n${"─".repeat(60)}\n`);
process.stdout.write(`${passed} passed, ${failed} failed\n`);
if (failed) process.stdout.write(`\nFailures:\n${failures.map((f) => `  - ${f}`).join("\n")}\n`);
process.exit(failed ? 1 : 0);
