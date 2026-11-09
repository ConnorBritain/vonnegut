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
import { BRIEFS, BRIEF_CHECK, INTERVIEW_CASES, checkCase, loadBrief, monologueClean } from "./interview-fixtures.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const BUNDLE = resolve(HERE, "..");
const BRAINSTORM = join(BUNDLE, "skills", "prose-brainstorm");
const INTERVIEW = join(BUNDLE, "skills", "prose-interview");

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
  check("a null audience with an open question validates; without one it is refused, and a placeholder is the writer's problem to avoid, not the schema's",
    errs(brief({ angles: [angle({ audience: null, open_questions: ["Who is this for?"] })] })).length === 0
      && errs(brief({ angles: [angle({ audience: null })] })).some((e) => /null audience needs/.test(e)));
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

  /* ---------------------------------------------------------------- */
  group("angles-check — quotes are the writer's exact words, and nothing they said is dropped");
  {
  const ac = await import(pathToFileURL(join(BRAINSTORM, "tools", "angles-check.mjs")).href);
  const ANGLES = join(HERE, "fixtures", "angles");
  const monoText = cleanOf("monologue.txt");
  const monoScan = ts.scanTranscript(read("monologue.txt"));
  const run = (name, opts = {}) => { try { return ac.checkAngles(JSON.parse(readFileSync(join(ANGLES, `${name}.json`), "utf8")), monoText, { scan: monoScan, ...opts }); } catch (e) { return { crashed: e.message, quotes: [], coverage: {} }; } };
  const bad = (r) => r.quotes.filter((q) => q.status !== "exact");
  const clean = run("clean");
  check("the clean proposal passes: every quote exact and inside its segment, all six segments accounted for",
    clean.ok === true && clean.quotes.length === 6 && clean.quotes.every((q) => q.status === "exact" && q.segment_ok === true) && clean.coverage.unaccounted_segments?.length === 0);
  const drifted = run("drifted");
  check("a quote with one comma moved is drifted — the planted one, and only that one", drifted.ok === false && bad(drifted).length === 1 && bad(drifted)[0].status === "drifted" && bad(drifted)[0].line === 5);
  const misplaced = run("misplaced");
  check("the right words cited at the wrong line are misplaced, with the line they are really on", bad(misplaced).length === 1 && bad(misplaced)[0].status === "misplaced" && bad(misplaced)[0].found_line === 9);
  const absent = run("absent");
  check("an invented sentence is absent", bad(absent).length === 1 && bad(absent)[0].status === "absent" && absent.ok === false);
  const unaccounted = run("unaccounted");
  check("a segment no angle uses or leaves out is named — exactly the planted one", unaccounted.ok === false && unaccounted.coverage.unaccounted_segments?.join() === "s6" && bad(unaccounted).length === 0);
  check("case alone is drift, never exact: the writer's words are never close enough",
    ac.quoteStatus("The starter is the whole bakery.", "the starter is the whole bakery.", 1).status === "drifted" && ac.quoteStatus("one  two\nthree", "one two three", 1).status === "exact");
  const noScan = run("clean", { scan: null });
  check("without a scan, coverage is not-evaluated and the check does not pass", noScan.coverage.status === "not-evaluated" && noScan.ok === false);
  const summaryAngle = { angles: [{ id: "a1", uses: [{ segment: "summary", line: 1, quote: "Bread is patience." }] }], unused_segments: [] };
  check("a summary quote is checked against the summary, and is not-evaluated without one",
    ac.checkAngles(summaryAngle, monoText, { summary: "Bread is patience.\n" }).quotes[0].status === "exact" && ac.checkAngles(summaryAngle, monoText).quotes[0].status === "not-evaluated");
  const ACLI = join(BRAINSTORM, "tools", "angles-check.mjs");
  const clean_txt = join(tmp, "mono-clean.txt"), scan_json = join(tmp, "mono-scan.json");
  writeFileSync(clean_txt, monoText); writeFileSync(scan_json, JSON.stringify(monoScan));
  const acli = (name, ...a) => spawnSync(process.execPath, [ACLI, join(ANGLES, `${name}.json`), clean_txt, "--scan", scan_json, ...a], { encoding: "utf8" });
  check("CLI: exit 0 on the clean proposal, 1 on each planted problem, 2 on bad usage",
    acli("clean").status === 0 && ["drifted", "misplaced", "absent", "unaccounted"].every((n) => acli(n).status === 1) && spawnSync(process.execPath, [ACLI], { encoding: "utf8" }).status === 2);
  }

  /* ---------------------------------------------------------------- */
  group("prose-brainstorm skill — SKILL.md, meta.yaml, and the two promises, mechanically");
  {
    const text = readFileSync(join(BRAINSTORM, "SKILL.md"), "utf8");
    const meta = readFileSync(join(BRAINSTORM, "meta.yaml"), "utf8");
    check("SKILL.md has frontmatter with name and a trigger-first description", /^---\nname: prose-brainstorm\ndescription: This skill should be used when/.test(text));
    check("SKILL.md calls its tools by relative path, never ${CLAUDE_PLUGIN_ROOT}", !text.includes("CLAUDE_PLUGIN_ROOT") && ["transcript-scan", "angles-check", "brief-store"].every((t) => text.includes(`node tools/${t}.mjs`)));
    check("SKILL.md says to check before showing, save only on approval, and never invent a thesis",
      /Check before showing/.test(text) && /--approved/.test(text) && /not an invented thesis/.test(text) && /Never pick the first/.test(text));
    check("meta.yaml: a planner skill in prose-outline that writes only the brief store", /^kind: planner$/m.test(meta) && /^surface: skill$/m.test(meta) && /writes: project-brief-store/.test(meta) && /^bundle: prose-outline$/m.test(meta));
    const ac = await import(pathToFileURL(join(BRAINSTORM, "tools", "angles-check.mjs")).href);
    const ANGLES = join(HERE, "fixtures", "angles");
    const load = (n) => JSON.parse(readFileSync(join(ANGLES, `${n}.json`), "utf8"));
    const monoScan = ts.scanTranscript(read("monologue.txt")), ramScan = ts.scanTranscript(read("rambling.txt"));
    const expectOn = (n, clean, scan, expect) => { try { return ac.checkAngles(load(n), clean, { scan, expect }); } catch (e) { return { crashed: e.message }; } };
    const pos = expectOn("clean", cleanOf("monologue.txt"), monoScan, "concrete");
    const neg = expectOn("rambling", cleanOf("rambling.txt"), ramScan, "underspecified");
    check("positive: the monologue example keeps the concrete promise and passes", pos.ok === true && pos.expectation?.findings.length === 0);
    check("negative: the rambling example keeps the underspecified promise and passes", neg.ok === true && neg.expectation?.findings.length === 0);
    const inverted = expectOn("clean", cleanOf("monologue.txt"), monoScan, "underspecified");
    check("the checker refuses theses on thin material — run the concrete example as if it were thin", inverted.ok === false && /invented thesis/.test(inverted.expectation?.findings.join(" ") ?? ""));
    const thin = expectOn("rambling", cleanOf("rambling.txt"), ramScan, "concrete");
    check("and refuses too few angles with no thesis on concrete material", thin.ok === false && thin.expectation?.findings.length === 2);
  }

  /* ---------------------------------------------------------------- */
  group("decisions — the tree is data, and a recorded answer says where it came from");
  {
    const dc = await import(pathToFileURL(join(INTERVIEW, "tools", "lib", "decisions.mjs")).href);
    const ids = dc.DECISIONS.map((d) => d.id);
    check("every dependency precedes its decision in the tree, so tree order is dependency order",
      dc.DECISIONS.every((d, i) => d.depends.every((dep) => ids.indexOf(dep) >= 0 && ids.indexOf(dep) < i)));
    check("ancestors are transitive: the length depends on the audience through the form", dc.ancestors("length").includes("audience") && dc.ancestors("thesis").includes("audience"));
    const body = loadBrief("done");
    const v = (decisions, links = body.links) => dc.validateDecisions(decisions, { ...body, links });
    check("the fixture briefs' decisions all validate", INTERVIEW_CASES.every((n) => dc.validateDecisions(loadBrief(n).decisions, loadBrief(n)).length === 0));
    check("a found answer without evidence is refused; a writer's answer with evidence is refused",
      v({ audience: { value: "x", source: "bible", confirmed: false, at_revision: 1 } }).some((e) => /evidence must be/.test(e))
        && v({ audience: { value: "x", source: "writer", confirmed: true, at_revision: 1, evidence: { ref: "r", quote: "q" } } }).some((e) => /needs none/.test(e)));
    check("a transcript quote must name its line", v({ audience: { value: "x", source: "transcript", confirmed: false, at_revision: 1, evidence: { ref: "transcript", quote: "q" } } }).some((e) => /line is required/.test(e)));
    check("a decision outside the tree, an angle the brief lacks, and a skip with a value are refused",
      v({ tone: { value: "x", source: "writer", confirmed: true, at_revision: 1 } }).some((e) => /not a decision/.test(e))
        && v({ angle: { value: "a9", source: "writer", confirmed: true, at_revision: 1 } }).some((e) => /does not have/.test(e))
        && v({ audience: { value: "x", skipped: "later", source: "writer", confirmed: true, at_revision: 1 } }).some((e) => /value null/.test(e)));
    check("form and length are structured, and a links answer must cite listed links",
      v({ form: { value: "newsletter", source: "writer", confirmed: true, at_revision: 1 } }).length > 0
        && v({ length: { value: { unit: "words", min: 900, max: 800 }, source: "writer", confirmed: true, at_revision: 1 } }).length > 0
        && v({ links: { value: ["outline:other"], source: "writer", confirmed: true, at_revision: 1 } }, []).some((e) => /does not list/.test(e))
        && v({ links: { value: ["outline:other"], source: "writer", confirmed: true, at_revision: 1 } }, [{ kind: "outline", ref: "outline:other", why: "same story" }]).length === 0);
    check("links entries need a kind, a ref and a why", dc.validateLinks([{ kind: "tweet", ref: "x" }]).length === 2);
  }

  /* ---------------------------------------------------------------- */
  group("brief-check — next, stale and done are computed, and match the hand-built cases");
  {
    for (const name of INTERVIEW_CASES) {
      const result = await attemptAsync(() => checkCase(name));
      const expected = join(BRIEFS, "expected", `${name}.json`);
      check(`${name}: reproduces its expected JSON byte for byte`, existsSync(expected) && !result.crashed && readFileSync(expected, "utf8") === render(result), "rerun tests/interview-fixtures.mjs --update and review the diff");
    }
    const c = {};
    for (const name of INTERVIEW_CASES) c[name] = await attemptAsync(() => checkCase(name));
    check("an empty brief asks for the angle first", c.empty.next === "angle" && c.empty.done === false && c.empty.open_required?.length === 7);
    check("with angle and audience settled, the next question is the purpose (tree order, dependencies met)", c.partial.next === "purpose");
    check("changing the audience after the rest was settled makes purpose, form, length, shape and thesis stale — transitively",
      c["audience-changed"].stale?.join() === "purpose,form,length,shape,thesis" && c["audience-changed"].next === "purpose" && c["audience-changed"].done === false);
    check("a transcript quote that drifted puts that decision back to the writer, and the interview is not done",
      c["transcript-drift"].evidence_problems?.[0]?.decision === "audience" && c["transcript-drift"].evidence_problems[0].status === "drifted" && c["transcript-drift"].next === "audience" && c["transcript-drift"].done === false);
    check("a recommendation the writer has not confirmed blocks done", c["recommendation-unconfirmed"].unconfirmed?.join() === "thesis" && c["recommendation-unconfirmed"].next === "thesis" && c["recommendation-unconfirmed"].done === false);
    check("a skipped required decision blocks the questions downstream of it, and done", c["skipped-audience"].blocked_by?.join() === "audience" && c["skipped-audience"].next === null && c["skipped-audience"].done === false);
    check("every required decision settled is done, while optional ones stay open and are still offered",
      c.done.done === true && c.done.open_optional?.length === 3 && c.done.next === "exclude" && c.done.evidence_problems?.length === 0);
    const { checkBrief } = await import(pathToFileURL(BRIEF_CHECK).href);
    const noText = checkBrief(loadBrief("done"));
    check("without the transcript text, its quotes are unverified — listed, never counted as passed", noText.evidence_unverified?.length === 1 && noText.evidence_problems?.length === 0);
    const invalid = checkBrief({ ...loadBrief("done"), decisions: { tone: {} } });
    check("an invalid brief is reported invalid, never done", invalid.valid === false && invalid.done === false);
    const BCLI = join(INTERVIEW, "tools", "brief-check.mjs");
    const cleanFile = join(tmp, "interview-clean.txt"); writeFileSync(cleanFile, await monologueClean());
    const bc = (name, ...a) => spawnSync(process.execPath, [BCLI, join(BRIEFS, `${name}.json`), "--clean", cleanFile, ...a], { encoding: "utf8" });
    const invalidFile = join(tmp, "invalid-brief.json"); writeFileSync(invalidFile, JSON.stringify({ ...loadBrief("done"), decisions: { tone: {} } }));
    check("CLI: exit 0 when done, 1 when not, 2 on an invalid brief or bad usage",
      bc("done").status === 0 && bc("partial").status === 1 && spawnSync(process.execPath, [BCLI, invalidFile], { encoding: "utf8" }).status === 2 && spawnSync(process.execPath, [BCLI], { encoding: "utf8" }).status === 2);
  }

  /* ---------------------------------------------------------------- */
  group("brief-store decide — answers are stamped with the revision that records them, on approval");
  {
    const { runStore } = await import(pathToFileURL(join(INTERVIEW, "tools", "brief-store.mjs")).href);
    const { checkBrief } = await import(pathToFileURL(BRIEF_CHECK).href);
    const REG = join(HERE, "fixtures", "registry");
    const env = { PROSE_PROJECTS_DIR: join(tmp, "interview-projects") };
    const sel = ["--registry", join(REG, "selected")];
    const run = (argv) => { try { return runStore(argv, env); } catch (e) { return { crashed: e.message }; } };
    const answers = (obj) => { const f = join(tmp, `answers-${Math.random().toString(36).slice(2)}.json`); writeFileSync(f, JSON.stringify(obj)); return f; };
    const typed = join(tmp, "typed-brief.md"); writeFileSync(typed, "A post about why our weekly meeting should only exist when there is a decision to make.\n");
    const noBrief = run(["decide", "--project", "meet", "--answers", answers({ decisions: {} }), "--expected-revision", "0", "--approved", ...sel]);
    check("decide with no brief is refused — add a source first", /add a source first/.test(noBrief.crashed ?? ""));
    check("a typed brief starts the project as a notes source (revision 1)", run(["add-source", "--project", "meet", "--file", typed, "--kind", "notes", "--expected-revision", "0", "--approved", ...sel]).revision === 1);
    const first = answers({ decisions: {
      angle: { value: "Meetings only for decisions", source: "writer", confirmed: true },
      audience: { value: "Engineering managers", source: "writer", confirmed: true, at_revision: 99 },
      purpose: { value: "Cancel status meetings", source: "writer", confirmed: true },
      form: { value: { form: "newsletter", medium: "web" }, source: "writer", confirmed: true } } });
    const dry = run(["decide", "--project", "meet", "--answers", first, "--expected-revision", "1", ...sel]);
    check("decide without --approved proposes and writes nothing", dry.status === "proposal" && run(["list", "--project", "meet", ...sel]).revisions?.length === 1);
    const d2 = run(["decide", "--project", "meet", "--answers", first, "--expected-revision", "1", "--approved", ...sel]);
    const b2 = run(["show", "--project", "meet", ...sel]).brief;
    check("approved: every answer is stamped with the revision written (2), and a caller's own stamp is replaced",
      d2.status === "saved" && d2.revision === 2 && Object.values(b2?.decisions ?? {}).every((r) => r.at_revision === 2) && b2?.decisions?.audience?.at_revision === 2);
    const d3 = run(["decide", "--project", "meet", "--answers", answers({ decisions: { audience: { value: "Founders", source: "writer", confirmed: true } } }), "--expected-revision", "2", "--approved", ...sel]);
    const b3 = run(["show", "--project", "meet", ...sel]).brief;
    const c3 = (() => { try { return checkBrief(b3 ?? {}); } catch (e) { return { crashed: e.message }; } })();
    check("changing one answer later re-stamps only it, and brief-check sees what depends on it as stale",
      d3.revision === 3 && b3?.decisions?.angle?.at_revision === 2 && b3?.decisions?.audience?.at_revision === 3 && c3.stale?.join() === "purpose,form" && c3.next === "purpose");
    const stale = run(["decide", "--project", "meet", "--answers", first, "--expected-revision", "2", "--approved", ...sel]);
    check("a stale expected revision is refused", /Stale revision/.test(stale.crashed ?? ""));
    const unsourced = run(["decide", "--project", "meet", "--answers", answers({ decisions: { thesis: { value: "x", source: "bible", confirmed: false } } }), "--expected-revision", "3", "--approved", ...sel]);
    check("an answer found in a source but carrying no evidence is refused before anything is written",
      /invalid/.test(unsourced.crashed ?? "") && run(["list", "--project", "meet", ...sel]).revisions?.length === 3);
    const extra = run(["decide", "--project", "meet", "--answers", answers({ decisions: {}, notes: "x" }), "--expected-revision", "3", "--approved", ...sel]);
    check("answers holding anything but decisions and links are refused", /unknown: notes/.test(extra.crashed ?? ""));
    const linked = run(["decide", "--project", "meet", "--answers", answers({ links: [{ kind: "outline", ref: "outline:standups", why: "the same argument for daily standups" }],
      decisions: { links: { value: ["outline:standups"], source: "writer", confirmed: true } } }), "--expected-revision", "3", "--approved", ...sel]);
    check("links are recorded with the decision that cites them", linked.revision === 4 && run(["show", "--project", "meet", ...sel]).brief?.links?.[0]?.ref === "outline:standups");
    const { runStore: brainstormStore } = await import(pathToFileURL(join(BRAINSTORM, "tools", "brief-store.mjs")).href);
    let threw = null; try { brainstormStore(["decide", "--project", "meet", "--answers", answers({ decisions: { tone: { value: "x", source: "writer", confirmed: true } } }), "--expected-revision", "4", "--approved", ...sel], env); } catch (e) { threw = e.message; }
    check("the brainstorm's copy of the store validates decisions too — one store, one rule", /not a decision in the tree/.test(threw ?? ""));
  }

  /* ---------------------------------------------------------------- */
  group("prose-interview skill — SKILL.md, meta.yaml, the rules that a script cannot keep");
  {
    const text = readFileSync(join(INTERVIEW, "SKILL.md"), "utf8");
    const meta = readFileSync(join(INTERVIEW, "meta.yaml"), "utf8");
    check("SKILL.md has frontmatter with name and a trigger-first description", /^---\nname: prose-interview\ndescription: This skill should be used when/.test(text));
    check("SKILL.md calls its tools by relative path, never ${CLAUDE_PLUGIN_ROOT}", !text.includes("CLAUDE_PLUGIN_ROOT") && ["brief-check", "brief-store"].every((t) => text.includes(`node tools/${t}.mjs`)));
    check("SKILL.md: one question at a time, look it up before asking, done only when brief-check says so, save with --approved",
      /One question at a time/.test(text) && /Look for the answer in the writer's own material/.test(text) && /done: true/.test(text) && /--approved/.test(text) && /Never open another bundle's store yourself/.test(text));
    check("meta.yaml: a planner skill in prose-outline that writes only the brief store", /^kind: planner$/m.test(meta) && /writes: project-brief-store/.test(meta) && /^bundle: prose-outline$/m.test(meta));
    check("SKILL.md (after the 2026-11-09 run): look up on every turn, confirm found answers, record the writer verbatim, one decision per turn optional ones included",
      /on every turn, for every\s+decision/.test(text) && /chosen_angle` is the answer to `angle`/.test(text) && /recorded as they said them/.test(text) && /verbatim/.test(text) && /optional decisions included/.test(text));
  }
} finally {
  rmSync(tmp, { recursive: true, force: true });
}

process.stdout.write(`\n${"─".repeat(60)}\n`);
process.stdout.write(`${passed} passed, ${failed} failed\n`);
if (failed) process.stdout.write(`\nFailures:\n${failures.map((f) => `  - ${f}`).join("\n")}\n`);
process.exit(failed ? 1 : 0);
