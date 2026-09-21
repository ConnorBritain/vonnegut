#!/usr/bin/env node
/**
 * prose-outline selftest.
 *
 *   node bundles/prose-outline/tests/selftest.mjs
 *
 * Grows one deliverable at a time (docs/roadmap/A-prose-outline.md). Every
 * case builds its scratch state under the OS temp directory and touches
 * nothing in the repo. No model is dispatched.
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { FIXTURES, loadCases, runCase, render } from "./text-index-fixtures.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const BUNDLE = resolve(HERE, "..");
const REPO = resolve(BUNDLE, "..", "..");
const SKILL = join(BUNDLE, "skills", "prose-outline");
const TEXT_INDEX = join(SKILL, "tools", "lib", "text-index.mjs");
const ti = await import(pathToFileURL(TEXT_INDEX).href);

/** A sibling module, imported for TEST-TIME comparison only, or null with a printed SKIP. */
let skipped = 0;
const skips = [];
async function sibling(relative, why) {
  const path = join(REPO, relative);
  if (!existsSync(path)) { skipped += 1; skips.push(`${relative} — ${why}`); process.stdout.write(`  SKIP ${relative} absent — ${why}\n`); return null; }
  return import(pathToFileURL(path).href);
}

let passed = 0;
let failed = 0;
const failures = [];
function check(name, condition, detail = "") {
  if (condition) {
    passed += 1;
    process.stdout.write(`  ok   ${name}\n`);
  } else {
    failed += 1;
    failures.push(`${name}${detail ? ` — ${detail}` : ""}`);
    process.stdout.write(`  FAIL ${name}${detail ? ` — ${detail}` : ""}\n`);
  }
}
const group = (title) => process.stdout.write(`\n${title}\n`);

/* ------------------------------------------------------------------ */
group("Packaging — a skill-only bundle, four manifests that agree");
{
  const manifests = [".claude-plugin", ".codex-plugin", ".cursor-plugin", ".plugin"]
    .map((f) => JSON.parse(readFileSync(join(BUNDLE, f, "plugin.json"), "utf8")));
  check("all four manifests name prose-outline", manifests.every((m) => m.name === "prose-outline"));
  check("all four manifests carry one version", new Set(manifests.map((m) => m.version)).size === 1);
  check("no manifest declares agents — declaring replaces discovery, and this bundle ships none",
    manifests.every((m) => !("agents" in m)));
  check("the cursor manifest points skill discovery at skills/", manifests[2].skills === "skills");
  check("no description claims a verdict, a score or authorship",
    manifests.every((m) => !/detect|verdict|score|who wrote|authorship/i.test(m.description) || /never/.test(m.description)));
}

/* ------------------------------------------------------------------ */
group("Skill directory — present once A7 lands; until then, absent and said so");
{
  const skill = existsSync(join(SKILL, "SKILL.md"));
  process.stdout.write(`  note ${skill ? "SKILL.md present" : "SKILL.md not yet written (deliverable A7)"}\n`);
  if (skill) {
    const text = readFileSync(join(SKILL, "SKILL.md"), "utf8");
    check("SKILL.md references its tools by relative path, never ${CLAUDE_PLUGIN_ROOT}", !text.includes("CLAUDE_PLUGIN_ROOT"));
  }
}

/* ------------------------------------------------------------------ */
group("text-index — parity cases reproduce their expected JSON byte for byte");
const cases = loadCases();
const results = {};
for (const c of cases) {
  const result = await runCase(TEXT_INDEX, c);
  results[c.name] = { result, source: readFileSync(join(FIXTURES, "cases", c.name), "utf8"), markdown: c.markdown };
  const expectedPath = join(FIXTURES, "expected", `${c.name}.json`);
  check(`${c.name} matches expected/${c.name}.json`,
    existsSync(expectedPath) && readFileSync(expectedPath, "utf8") === render(result),
    "rerun tests/text-index-fixtures.mjs --update and review the diff");
  if (c.source) {
    // A corpus case the fixture author may edit is one they can tune until it passes.
    check(`${c.name} is a byte-identical copy of its corpus source`,
      readFileSync(join(FIXTURES, "cases", c.name)).equals(readFileSync(resolve(FIXTURES, c.source))));
  }
}

/* ------------------------------------------------------------------ */
group("text-index — every location points at what it claims to, in the ORIGINAL bytes");
for (const [name, { result, source }] of Object.entries(results)) {
  const line = ti.lineIndex(source);
  const bad = [];
  const at = (offset, text, what) => {
    const head = text.split(/\s+/)[0];
    if (!source.slice(offset, offset + head.length + 2).replace(/\s+/g, " ").startsWith(head)) bad.push(`${what} '${text.slice(0, 30)}' @${offset}`);
  };
  for (const h of result.segment.headings) { at(h.offset + source.slice(h.offset).indexOf(h.text), h.text, "heading"); if (line(h.offset) !== h.line) bad.push(`heading line ${h.line}`); }
  for (const p of result.segment.paragraphs) {
    at(p.offset, p.text, "paragraph");
    if (line(p.offset) !== p.line) bad.push(`paragraph line ${p.line}`);
    for (const s of p.sentences) { at(s.offset, s.text, "sentence"); if (line(s.offset) !== s.line) bad.push(`sentence line ${s.line}`); }
  }
  for (const r of result.runs) at(r.offset, r.text, "run");
  for (const t of result.terms) at(t.offset, t.term, "term");
  for (const n of result.numbers) at(n.offset, n.text, "number");
  check(`${name}: all offsets and lines verify against the source`, bad.length === 0, bad.slice(0, 5).join("; "));
}
{
  const { result, source } = results["rivers.md"];
  const seg = result.segment;
  check("rivers: three headings with levels 1, 2, 3 and the deeper heading parented to the h2",
    seg.headings.map((h) => h.level).join() === "1,2,3" && seg.headings[2].parent === 1 && seg.headings[1].parent === 0);
  check("rivers: frontmatter, fence, inline code and a link target are masked and counted",
    seg.masked.frontmatter === 1 && seg.masked.fenced === 1 && seg.masked.inline === 1 && seg.masked.urls === 1);
  check("rivers: the table row and the fence are not paragraphs; the blockquote is",
    seg.paragraphs.length === 5 && seg.paragraphs[3].text.startsWith("Quoted: the Danube again"));
  const first = seg.paragraphs[0].sentences.map((s) => s.text);
  check("rivers: 'Dr.' and 'e.g.' do not end sentences; a hard-wrapped paragraph yields three",
    first.length === 3 && first[1] === "Dr. Smith measured it in 1965.");
  const third = seg.paragraphs[2].sentences.map((s) => s.text);
  check("rivers: initials and an ellipsis do not end sentences; ? does",
    third.length === 3 && third[0].startsWith("Mr. J. R. Hartley") && third[2] === "Perhaps... perhaps not.");
  const runs = result.runs.map((r) => r.text);
  check("rivers: honorifics, initials and month names are not capitalised runs; names and places are",
    !runs.includes("Dr") && !runs.includes("J") && !runs.includes("March") && runs.includes("Vienna") && runs.includes("The Danube"));
  check("rivers: the three definition patterns each fire once",
    result.terms.map((t) => t.kind).sort().join() === "appositive,called,is-a");
  check("rivers: years and month-name dates are dates; 2,850 and 12% are numbers; ISO dates are dates",
    result.numbers.map((n) => `${n.kind}:${n.text}`).join("|") === "date:1965|number:2,850|date:3 March 2001|number:12%|date:2024-01-02");
  check("rivers: locate() returns the sentence containing an offset", ti.locate(source, source.indexOf("Vienna")).sentence.endsWith("past Vienna."));
}
{
  const { result, source } = results["letter.txt"];
  // The file is CRLF; a blank line there is "\r\n\r\n". Count the blocks the
  // source actually has, rather than asserting a number that would drift with the file.
  const blocks = source.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "").split(/\r?\n[ \t\r]*\r?\n/).filter((b) => b.trim()).length;
  check(`letter (CRLF): blank lines with carriage returns still separate paragraphs (${blocks} blocks)`,
    result.segment.paragraphs.length === blocks && blocks > 1, `got ${result.segment.paragraphs.length}`);
}

/* ------------------------------------------------------------------ */
group("text-index — agrees with the repo's other segmenters on shared text (cross-implementation)");
{
  // The fourth segmenter in this repo must not hand critics locations the others
  // would dispute. Each sibling is imported for comparison only; a static import
  // across bundles is forbidden in shipped code.
  const tell = await sibling("bundles/prose-tell-scan/skills/tell-scan/tools/lib/text.mjs", "tell-scan splitter comparison");
  const visible = await sibling("bundles/prose-author/skills/prose-draft/tools/visible-prose.mjs", "visible-prose exclusion comparison");
  const fidelity = await sibling("bundles/prose-review/tools/fidelity-scan.mjs", "heading extraction comparison");
  for (const [name, { result, source, markdown }] of Object.entries(results)) {
    const sentences = result.segment.paragraphs.flatMap((p) => p.sentences);
    if (tell) {
      const line = tell.lineIndex(source);
      check(`${name}: every sentence line agrees with tell-scan's lineIndex`, sentences.every((s) => line(s.offset) === s.line));
      // Same splitting RULES: tell-scan run over each of our paragraphs must cut
      // exactly where we did. (Over a whole document the two differ by design —
      // tell-scan joins unterminated lines across blank lines; this segments first.)
      const disagreements = result.segment.paragraphs.filter((p) => tell.sentences(p.text).length !== p.sentences.length);
      check(`${name}: tell-scan's splitter cuts every paragraph into the same number of sentences`,
        disagreements.length === 0, disagreements.slice(0, 3).map((p) => `line ${p.line}`).join(", "));
    }
    if (visible) {
      const v = visible.visibleProse(source, { format: markdown ? "markdown" : "plain" });
      const excluded = v.exclusions.filter((e) => ["metadata", "fenced-code", "inline-code", "link-target", "bare-url", "comment"].includes(e.kind));
      const inside = sentences.filter((s) => excluded.some((e) => s.offset >= e.start && s.offset < e.end));
      check(`${name}: no sentence starts inside a region visible-prose excludes`, inside.length === 0, inside.map((s) => s.text.slice(0, 30)).join("; "));
    }
    if (fidelity && markdown) {
      const theirs = fidelity.extractAtoms(source).filter((a) => a.kind === "heading").map((a) => a.source).sort();
      const ours = [...new Set(result.segment.headings.map((h) => h.text))].sort();
      check(`${name}: heading texts agree with fidelity-scan`, JSON.stringify(theirs) === JSON.stringify(ours), `${theirs} vs ${ours}`);
    }
  }
}

process.stdout.write(`\n${"─".repeat(60)}\n`);
process.stdout.write(`${passed} passed, ${failed} failed${skipped ? `, ${skipped} skipped` : ""}\n`);
if (skipped) process.stdout.write(`\nSkipped (precondition absent):\n${skips.map((s) => `  - ${s}`).join("\n")}\n`);
if (failed) process.stdout.write(`\nFailures:\n${failures.map((f) => `  - ${f}`).join("\n")}\n`);
process.exit(failed ? 1 : 0);
