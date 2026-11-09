#!/usr/bin/env node
/**
 * prose-outline baselines selftest — roadmap item J.
 *
 *   node bundles/prose-outline/tests/baselines-selftest.mjs
 *
 * Grows one deliverable at a time (docs/roadmap/J-outline-baselines.md). Every
 * case builds its scratch state under the OS temp directory and touches nothing
 * in the repo. No model is dispatched. Also the `baselines` suite of
 * bundles/prose-author/tests/mutations.mjs, so every check must survive a
 * removed guard without crashing.
 */
import { mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const BUNDLE = resolve(HERE, "..");
const SKILL = join(BUNDLE, "skills", "prose-outline");
const TOOLS = join(SKILL, "tools");

let passed = 0;
let failed = 0;
const failures = [];
function check(name, condition, detail = "") {
  if (condition) { passed += 1; process.stdout.write(`  ok   ${name}\n`); }
  else { failed += 1; failures.push(`${name}${detail ? ` — ${detail}` : ""}`); process.stdout.write(`  FAIL ${name}${detail ? ` — ${detail}` : ""}\n`); }
}
const group = (title) => process.stdout.write(`\n${title}\n`);
const attempt = (fn) => { try { return fn() ?? {}; } catch (e) { return { crashed: e.message }; } };
const tmp = mkdtempSync(join(tmpdir(), "prose-baselines-"));

try {
  /* ---------------------------------------------------------------- */
  group("shapes — the six shipped shapes validate, and malformed ones are refused by name");
  {
    const sc = await import(pathToFileURL(join(TOOLS, "shape-check.mjs")).href);
    const shp = await import(pathToFileURL(join(TOOLS, "lib", "shape.mjs")).href);
    const shipped = attempt(() => sc.checkShapes(sc.shapeFiles()));
    const names = ["argument-essay", "letter", "narrative-arc", "numbered-lessons", "problem-solution", "question-and-answer"];
    check("exactly the six shipped shapes, each valid", Array.isArray(shipped) && shipped.length === 6 && shipped.every((r) => r.ok) && shipped.map((r) => r.name).join() === names.join(),
      JSON.stringify(shipped?.filter?.((r) => !r.ok)));
    const shapes = attempt(() => sc.loadShapes());
    check("narrative-arc is the one beat-sheet shape; the rest argue", shapes.get?.("narrative-arc")?.mode === "beat-sheet" && [...(shapes.values?.() ?? [])].filter((s) => s.mode === "argument").length === 5);
    check("every shipped shape's required minimums fit in the piece and its maximums can fill it",
      [...(shapes.values?.() ?? [])].every((s) => s.parts.filter((p) => p.required === "required").reduce((a, p) => a + p.share[0], 0) <= 1 && s.parts.reduce((a, p) => a + p.share[1], 0) >= 1));
    const INVALID = join(HERE, "fixtures", "shapes-invalid");
    const bad = attempt(() => sc.checkShapes(sc.shapeFiles(INVALID)));
    const why = (file) => (Array.isArray(bad) ? bad.find((r) => r.file === file)?.errors ?? [] : []).join(" ");
    check("a part with no name is refused", /part name is a lower-case token/.test(why("missing-name.md")));
    check("required minimum shares above the whole piece are refused", /more than the whole piece/.test(why("overfull.md")));
    check("a prohibition list in the paragraph is refused — shapes carry no catalog", /prohibition list/.test(why("catalog.md")));
    check("the parser reports unreadable input instead of throwing",
      ["", "no frontmatter", "---\nname: x\n---\n", "---\n  - stray | required | 0.1-0.2\n---\nP"].every((t) => { const r = attempt(() => shp.loadShape(t)); return !r.crashed && Array.isArray(r.errors) && r.errors.length > 0; }));
    check("a file whose name disagrees with its `name:` is refused", (shp.loadShape(readFileSync(join(SKILL, "shapes", "letter.md"), "utf8"), "memo").errors ?? []).some((e) => /does not match the file name/.test(e)));
    const cli = (...a) => spawnSync(process.execPath, [join(TOOLS, "shape-check.mjs"), ...a], { encoding: "utf8" });
    check("CLI: exit 0 on the shipped shapes, 1 on the invalid set, 2 on a missing path or unknown flag",
      cli().status === 0 && cli(INVALID).status === 1 && cli(join(tmp, "nowhere")).status === 2 && cli("--bogus").status === 2);
    check("the shapes ship inside the skill, so a loose install of the skill carries them", readdirSync(join(SKILL, "shapes")).filter((f) => f.endsWith(".md")).length === 6);
  }

  /* ---------------------------------------------------------------- */
  group("voice-outline/1 plan fields — validated when present, ignored by nothing that predates them");
  {
    const os = await import(pathToFileURL(join(TOOLS, "lib", "outline-schema.mjs")).href);
    const old = JSON.parse(readFileSync(join(HERE, "fixtures", "outline", "outlines", "post-v1.json"), "utf8"));
    check("an outline from before item J still validates unchanged", os.validateOutline(old).length === 0);
    const cand = JSON.parse(readFileSync(join(HERE, "fixtures", "candidates", "problem-solution.json"), "utf8"));
    check("a candidate carrying length, shape, parts, budgets and covers validates", os.validateOutlineBody(cand).length === 0, os.validateOutlineBody(cand).join("; "));
    const errs = (patch) => os.validateOutlineBody({ ...cand, ...patch });
    const nodes = (fn) => cand.nodes.map((n, i) => fn({ ...n }, i));
    check("a malformed length band is refused", errs({ length: { unit: "words", min: 900, max: 800 } }).some((e) => /length must be/.test(e)) && errs({ length: { unit: "chars", min: 1, max: 9 } }).length > 0);
    check("a part on an outline with no shape is refused", errs({ shape: undefined }).some((e) => /needs a shape/.test(e)));
    check("a word budget under another budget is refused — it would be counted twice",
      errs({ nodes: [...cand.nodes, { id: "n9", kind: "open-question", parent: "n3", order: 1, text: "How long is a month?", words: 50 }] }).some((e) => /under n3/.test(e)));
    check("covers must name brief decisions; brief_ref must be complete",
      errs({ nodes: nodes((n, i) => (i === 0 ? { ...n, covers: ["Must Include"] } : n)) }).some((e) => /covers lists/.test(e)) && errs({ brief_ref: { project: "bread", revision: 2 } }).some((e) => /brief_ref/.test(e)));
    check("reading order is depth-first by sibling order", os.readingOrder({ nodes: [{ id: "n2", parent: null, order: 2 }, { id: "n3", parent: "n1", order: 1 }, { id: "n1", parent: null, order: 1 }] }).map((n) => n.id).join() === "n1,n3,n2");
  }

  /* ---------------------------------------------------------------- */
  group("proposal-check — shape parts and order, budgets against the band, must-include coverage");
  {
    const pc = await import(pathToFileURL(join(TOOLS, "proposal-check.mjs")).href);
    const sc = await import(pathToFileURL(join(TOOLS, "shape-check.mjs")).href);
    const shapes = attempt(() => sc.loadShapes());
    const brief = JSON.parse(readFileSync(join(HERE, "fixtures", "briefs-interview", "done.json"), "utf8"));
    const load = (n) => JSON.parse(readFileSync(join(HERE, "fixtures", "candidates", `${n}.json`), "utf8"));
    const run = (body, shapeName, briefDoc = brief) => attempt(() => pc.checkProposal(body, null, { shape: shapes.get?.(shapeName) ?? null, briefDoc }));
    const ps = run(load("problem-solution"), "problem-solution");
    check("the problem-solution candidate is clean: every required part, in order, 930 words in 800–1100, both must-includes covered",
      ps.status === "clean" && ps.plan?.words_allocated === 930 && ps.plan?.must_include?.covered === 2, JSON.stringify(ps.findings));
    const na = run(load("narrative-arc-overshoot"), "narrative-arc");
    check("the narrative-arc candidate is named for overshooting the band — and only that", na.status === "findings" && na.findings?.length === 1 && /sum to 1400, outside the length band 800–1100/.test(na.findings[0]));
    const qa = run(load("question-and-answer-uncovered"), "question-and-answer");
    check("the Q&A candidate is named for the must-include it leaves out — and only that", qa.findings?.length === 1 && /must_include\.1 \(the eleven years of notebooks\)/.test(qa.findings[0]));
    const base = load("problem-solution");
    const without = { ...base, nodes: base.nodes.filter((n) => n.part !== "stakes").map((n) => (n.part === "solution" ? { ...n, words: 500 } : n)) };
    check("a required part with no node is a finding", (run(without, "problem-solution").findings ?? []).some((f) => /required parts with no node: stakes/.test(f)));
    const swapped = { ...base, nodes: base.nodes.map((n) => (n.id === "n1" ? { ...n, order: 3 } : n.id === "n3" ? { ...n, order: 1 } : n)) };
    check("parts out of the shape's order are a finding", (run(swapped, "problem-solution").findings ?? []).some((f) => /out of the shape's order/.test(f)));
    check("a part the shape does not have, and a mode the shape does not share, are findings",
      (run({ ...base, nodes: base.nodes.map((n) => (n.id === "n4" ? { ...n, part: "rebuttal" } : n)) }, "problem-solution").findings ?? []).some((f) => /does not have: rebuttal/.test(f))
        && (run(load("narrative-arc-overshoot"), "problem-solution").findings ?? []).some((f) => /beat-sheet mode|argument shape/.test(f)));
    const lopsided = { ...base, nodes: base.nodes.map((n) => (n.part === "problem" ? { ...n, words: 400 } : n.part === "solution" ? { ...n, words: 280 } : n)) };
    const lop = run(lopsided, "problem-solution");
    check("a part outside its share range is a signal, not a finding — the ranges are starting values", lop.status === "clean" && (lop.signals ?? []).some((g) => /part problem takes/.test(g)));
    check("a band that differs from the brief's, or budgets with no band, are findings",
      (run({ ...base, length: { unit: "words", min: 800, max: 1200 } }, "problem-solution").findings ?? []).some((f) => /not the brief's/.test(f))
        && (run({ ...base, length: undefined }, "problem-solution", null).findings ?? []).some((f) => /no length band/.test(f)));
    const CLI = join(TOOLS, "proposal-check.mjs");
    const cli = (n, sh) => spawnSync(process.execPath, [CLI, join(HERE, "fixtures", "candidates", `${n}.json`), "--shape", join(SKILL, "shapes", `${sh}.md`), "--brief-json", join(HERE, "fixtures", "briefs-interview", "done.json")], { encoding: "utf8" });
    check("CLI: exit 0 on the clean candidate, 1 on each planted problem, 2 on an invalid shape file",
      cli("problem-solution", "problem-solution").status === 0 && cli("narrative-arc-overshoot", "narrative-arc").status === 1 && cli("question-and-answer-uncovered", "question-and-answer").status === 1
        && spawnSync(process.execPath, [CLI, join(HERE, "fixtures", "candidates", "problem-solution.json"), "--shape", join(HERE, "fixtures", "shapes-invalid", "overfull.md")], { encoding: "utf8" }).status === 2);
  }

  /* ---------------------------------------------------------------- */
  group("outline-compare — facts side by side, no scores, and the skill's candidate mode");
  {
    const { compareFixture, CANDIDATES } = await import(pathToFileURL(join(HERE, "baselines-fixtures.mjs")).href);
    const out = await (async () => { try { return await compareFixture(); } catch (e) { return { crashed: e.message }; } })();
    check("the three candidates reproduce the expected comparison, JSON and markdown, byte for byte",
      !out.crashed && readFileSync(join(CANDIDATES, "expected-compare.json"), "utf8") === out.json && readFileSync(join(CANDIDATES, "expected-compare.md"), "utf8") === out.md, "rerun tests/baselines-fixtures.mjs --update and review the diff");
    const result = out.json ? JSON.parse(out.json) : { candidates: [] };
    const by = Object.fromEntries(result.candidates.map((c) => [c.name, c]));
    check("the overshooting candidate is outside the band; the uncovering one covers 1 of 2; the clean one is clean",
      by["narrative-arc-overshoot"]?.within_band === false && by["question-and-answer-uncovered"]?.must_include?.covered === 1 && by["problem-solution"]?.clean === true);
    check("no score, rank or winner anywhere in the comparison", !/score|rank|best|winner|recommend/i.test(out.json ?? ""));
    const oc = await import(pathToFileURL(join(TOOLS, "outline-compare.mjs")).href);
    const same = attempt(() => oc.compareCandidates([{ name: "a", body: JSON.parse(readFileSync(join(CANDIDATES, "problem-solution.json"), "utf8")) }, { name: "b", body: JSON.parse(readFileSync(join(CANDIDATES, "problem-solution.json"), "utf8")) }]));
    check("two candidates in one shape are noted: they are not a choice", (same.notes ?? []).some((n) => /share a shape/.test(n)));
    const text = readFileSync(join(SKILL, "SKILL.md"), "utf8");
    check("SKILL.md describes candidate mode: different shapes, check and compare before showing, save only the pick",
      /Candidate mode/.test(text) && /different shapes/.test(text) && text.includes("node tools/outline-compare.mjs") && text.includes("node tools/shape-check.mjs") && /Save only the one they\s+pick/.test(text));
    const cli = spawnSync(process.execPath, [join(TOOLS, "outline-compare.mjs"), join(CANDIDATES, "problem-solution.json")], { encoding: "utf8" });
    check("CLI: a single candidate is not a comparison (exit 2)", cli.status === 2);
  }
} finally {
  rmSync(tmp, { recursive: true, force: true });
}

process.stdout.write(`\n${"─".repeat(60)}\n`);
process.stdout.write(`${passed} passed, ${failed} failed\n`);
if (failed) process.stdout.write(`\nFailures:\n${failures.map((f) => `  - ${f}`).join("\n")}\n`);
process.exit(failed ? 1 : 0);
