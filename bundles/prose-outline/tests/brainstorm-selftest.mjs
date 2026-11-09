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

  /* ---------------------------------------------------------------- */
  group("project-brief/1 — the schema refuses what later stages could not trust");
  const bs = await import(pathToFileURL(join(BRAINSTORM, "tools", "lib", "brief-schema.mjs")).href);
  const sha = "a".repeat(64);
  const angle = (over = {}) => ({ id: "a1", title: "The starter is the bakery", thesis: "The invisible slow part decides the result.", audience: "team leads",
    shape: "narrative-arc", uses: [{ segment: "s1", line: 3, quote: "the starter is the whole bakery" }], leaves_out: ["s3"], open_questions: [], ...over });
  const brief = (over = {}) => ({ ...bs.emptyBrief(), sources: [{ kind: "transcript", digest: sha, words: 962, cached: `sources/${sha}.txt`, format: "plain" }], angles: [angle()], ...over });
  const errs = (b) => bs.validateBriefBody(b);
  check("a well-formed brief validates, and so does an empty one", errs(brief()).length === 0 && errs(bs.emptyBrief()).length === 0, errs(brief()).join("; "));
  check("a null thesis with no open question is refused — thin material yields questions, not silence", errs(brief({ angles: [angle({ thesis: null })] })).some((e) => /null thesis/.test(e))
    && errs(brief({ angles: [angle({ thesis: null, open_questions: ["What is the claim?"] })] })).length === 0);
  check("an angle that quotes nothing is refused", errs(brief({ angles: [angle({ uses: [] })] })).some((e) => /quote at least one passage/.test(e)));
  check("unknown fields are refused at every level", errs({ ...brief(), extra: 1 }).some((e) => /unknown field extra/.test(e))
    && errs(brief({ angles: [angle({ score: 9 })] })).some((e) => /unknown field score/.test(e)));
  check("chosen_angle must name an existing angle; duplicate angle ids are refused",
    errs(brief({ chosen_angle: "a7" })).some((e) => /chosen_angle/.test(e)) && errs(brief({ angles: [angle(), angle()] })).some((e) => /duplicate id/.test(e)) && errs(brief({ chosen_angle: "a1" })).length === 0);
  check("a source's cache path must be its own digest, and one text is one source",
    errs(brief({ sources: [{ kind: "notes", digest: sha, words: 1, cached: "sources/other.txt" }] })).some((e) => /cached/.test(e))
      && errs(brief({ sources: [{ kind: "notes", digest: sha, words: 1, cached: `sources/${sha}.txt` }, { kind: "summary", digest: sha, words: 1, cached: `sources/${sha}.txt` }] })).some((e) => /already a source/.test(e)));

  /* ---------------------------------------------------------------- */
  group("brief-store — three registry states, approval for the cache too, stale refusal, undo");
  const { runStore, StoreRefusal } = await import(pathToFileURL(join(BRAINSTORM, "tools", "brief-store.mjs")).href);
  const REG = join(HERE, "fixtures", "registry");
  const projects = join(tmp, "projects");
  const env = { PROSE_PROJECTS_DIR: projects };
  const regSel = ["--registry", join(REG, "selected")];
  const refusal = (argv) => { try { runStore(argv, env); return null; } catch (e) { return e; } };
  const monoFile = join(TRANSCRIPTS, "monologue.txt");
  let r = refusal(["add-source", "--project", "bread", "--file", monoFile, "--kind", "transcript", "--expected-revision", "0", "--approved", "--registry", join(tmp, "no-registry")]);
  check("no registry ⇒ cannot persist (exit 3), nothing written", r instanceof StoreRefusal && r.code === 3 && /task-local/.test(r.message) && !existsSync(projects));
  r = refusal(["add-source", "--project", "bread", "--file", monoFile, "--kind", "transcript", "--expected-revision", "0", "--approved", "--registry", join(REG, "ambiguous")]);
  check("identities without a default ⇒ cannot persist, never the first identity", r instanceof StoreRefusal && r.code === 3 && /never pick the first/.test(r.message) && !existsSync(projects));
  const dry = (() => { try { return runStore(["add-source", "--project", "bread", "--file", monoFile, "--kind", "transcript", "--expected-revision", "0", ...regSel], env); } catch (e) { return { crashed: e.message }; } })();
  check("add-source without --approved proposes and writes nothing — not the revision, not the cached text",
    dry.status === "proposal" && !existsSync(join(projects, "personal", "bread", "brief")));
  const added = (() => { try { return runStore(["add-source", "--project", "bread", "--file", monoFile, "--kind", "transcript", "--expected-revision", "0", "--approved", ...regSel], env); } catch (e) { return { crashed: e.message }; } })();
  const cached = added.source ? join(projects, "personal", "bread", "brief", added.source.cached) : "";
  check("approved: revision 1 holds the source, and the CLEANED transcript is cached under its digest",
    added.status === "saved" && added.revision === 1 && existsSync(cached) && readFileSync(cached, "utf8") === cleanOf("monologue.txt") && added.source.format === "plain");
  r = refusal(["add-source", "--project", "bread", "--file", monoFile, "--kind", "transcript", "--expected-revision", "1", "--approved", ...regSel]);
  check("the same transcript twice is refused", /already a source/.test(r?.message ?? ""));
  r = refusal(["add-source", "--project", "bread", "--file", join(TRANSCRIPTS, "fragment.txt"), "--kind", "summary", "--expected-revision", "0", "--approved", ...regSel]);
  check("a stale expected revision is refused", /Stale revision/.test(r?.message ?? ""));
  const shown = runStore(["show", "--project", "bread", ...regSel], env);
  const proposal = join(tmp, "angles.json");
  writeFileSync(proposal, JSON.stringify({ ...shown.brief, angles: [angle()], chosen_angle: "a1" }));
  const saved = (() => { try { return runStore(["save", "--project", "bread", "--proposal", proposal, "--expected-revision", "1", "--approved", ...regSel], env); } catch (e) { return { crashed: e.message }; } })();
  check("a proposal carrying the stored envelope saves as revision 2 (envelope keys stripped, not trusted)", saved.status === "saved" && saved.revision === 2);
  writeFileSync(proposal, JSON.stringify({ ...shown.brief, sources: [...shown.brief.sources, { kind: "notes", digest: "b".repeat(64), words: 3, cached: `sources/${"b".repeat(64)}.txt` }] }));
  r = refusal(["save", "--project", "bread", "--proposal", proposal, "--expected-revision", "2", "--approved", ...regSel]);
  check("a brief citing a source that was never cached is refused", /not cached/.test(r?.message ?? ""));
  writeFileSync(proposal, JSON.stringify({ ...shown.brief, angles: [angle({ thesis: null })] }));
  r = refusal(["save", "--project", "bread", "--proposal", proposal, "--expected-revision", "2", "--approved", ...regSel]);
  check("an invalid brief is refused before anything is written", /not a valid brief/.test(r?.message ?? "") && runStore(["list", "--project", "bread", ...regSel], env).revisions.length === 2);
  const undone = (() => { try { return runStore(["undo", "--project", "bread", "--expected-revision", "2", "--approved", ...regSel], env); } catch (e) { return { crashed: e.message }; } })();
  check("undo writes revision 3 restoring revision 1's brief (no angles)", undone.status === "saved" && undone.revision === 3 && runStore(["show", "--project", "bread", ...regSel], env).brief.angles.length === 0);
  const BCLI = join(BRAINSTORM, "tools", "brief-store.mjs");
  const bcli = (...a) => spawnSync(process.execPath, [BCLI, ...a], { encoding: "utf8", env: { ...process.env, ...env } });
  check("CLI: a bad --kind and a missing flag exit 2; a missing registry exits 3",
    bcli("add-source", "--project", "x", "--file", monoFile, "--kind", "memo", "--expected-revision", "0").status === 2
      && bcli("save", "--project", "x").status === 2 && bcli("locate", "--registry", join(tmp, "nowhere")).status === 3);
} finally {
  rmSync(tmp, { recursive: true, force: true });
}

process.stdout.write(`\n${"─".repeat(60)}\n`);
process.stdout.write(`${passed} passed, ${failed} failed\n`);
if (failed) process.stdout.write(`\nFailures:\n${failures.map((f) => `  - ${f}`).join("\n")}\n`);
process.exit(failed ? 1 : 0);
