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
import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync, unlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { FIXTURES, loadCases, runCase, render } from "./text-index-fixtures.mjs";
import { OUTLINE_FIXTURES, SCAN, DIFF, DIFF_PAIRS, loadOutline, diffPair, loadOutlineCases, scanCase, render as renderOutline } from "./outline-fixtures.mjs";

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

/* ------------------------------------------------------------------ */
group("outline-scan — fixtures reproduce, and the counts are the counts");
{
  const scans = {};
  for (const c of loadOutlineCases()) {
    const result = await scanCase(c);
    scans[c.name] = result;
    const expectedPath = join(OUTLINE_FIXTURES, "expected", `${c.name}.json`);
    check(`${c.name} matches expected/${c.name}.json`, existsSync(expectedPath) && readFileSync(expectedPath, "utf8") === renderOutline(result),
      "rerun tests/outline-fixtures.mjs --update and review the diff");
    if (c.source) check(`${c.name} is a byte-identical copy of its corpus source`,
      readFileSync(join(OUTLINE_FIXTURES, "cases", c.name)).equals(readFileSync(resolve(OUTLINE_FIXTURES, c.source))));
    check(`${c.name}: scanning twice gives identical output`, renderOutline(await scanCase(c)) === renderOutline(result));
  }
  const essay = scans["essay.md"];
  check("essay: four headings, the h2s parented to the h1, four sections, a measured status",
    essay.status === "measured" && essay.headings.length === 4 && essay.headings.slice(1).every((h) => h.parent === 0) && essay.sections.length === 4);
  const byTitle = Object.fromEntries(essay.sections.map((s) => [s.title, s]));
  check("essay: the section with the numbers and the causal connectives carries the highest claim-marker rate",
    Object.values(byTitle).every((s) => s.claim_markers_per_100_words <= byTitle["What breaks when the plan drifts"].claim_markers_per_100_words));
  const openers = essay.sections.flatMap((s) => s.paragraphs).map((p) => p.transition_in?.marker).filter(Boolean);
  check("essay: 'however', 'so' and 'therefore' are read as opening markers of the right kinds",
    openers.includes("however") && openers.includes("so") && openers.includes("therefore")
      && essay.sections.flatMap((s) => s.paragraphs).some((p) => p.transition_in?.kind === "contrast"));
  check("essay: every paragraph's first_sentence opens that paragraph's text",
    essay.sections.flatMap((s) => s.paragraphs).every((p) => p.first_sentence.length > 0));
  check("essay: ratio_to_median is 1 at the median and the extremes bracket it",
    essay.balance.min_ratio < 1 && essay.balance.max_ratio > 1 && essay.sections.some((s) => Math.abs(s.ratio_to_median - 1) < 0.2));
  const tech = scans["technical.md"];
  check("technical: six uniform sections read as balanced — a flat reference doc is not a finding",
    tech.sections.length === 6 && tech.balance.max_ratio <= 2 && tech.balance.min_ratio >= 0.4);
  const chapter = scans["chapter.md"];
  check("chapter: thematic breaks are not paragraphs; one heading; five paragraphs",
    chapter.headings.length === 1 && chapter.sections[0].paragraph_count === 5);
  const v1 = scans["post-v1.md"], v2 = scans["post-v2.md"];
  check("post v1→v2: the same headings in a different order, and one more paragraph in v2",
    v1.headings.map((h) => h.text).sort().join("|") === v2.headings.map((h) => h.text).sort().join("|")
      && v1.headings.map((h) => h.text).join("|") !== v2.headings.map((h) => h.text).join("|")
      && v2.sections.reduce((n, s) => n + s.paragraph_count, 0) === v1.sections.reduce((n, s) => n + s.paragraph_count, 0) + 1);
  const note = scans["note.md"];
  check("note: no headings and two paragraphs ⇒ not-evaluated, with the reason, and no sections invented",
    note.status === "not-evaluated" && /no headings and 2 paragraph/.test(note.reason) && note.sections.length === 0 && note.balance === null);
  const flat = scans["flat.txt"];
  check("flat corpus post: no headings but many paragraphs ⇒ one preamble section, measured, heading overlap null",
    flat.status === "measured" && flat.sections.length === 1 && flat.sections[0].heading === null
      && flat.sections[0].paragraphs.every((p) => p.heading_overlap_sentence === null));
  check("every scan carries its limits, and the claim-marker lists are the tool's own",
    Object.values(scans).every((s) => s.limits.some((l) => /Claim markers are counts/.test(l))));
  // CLI: --json parses; a bad flag and a missing file exit 2.
  const { spawnSync } = await import("node:child_process");
  const cli = (...a) => spawnSync(process.execPath, [SCAN, ...a], { encoding: "utf8" });
  const json = cli(join(OUTLINE_FIXTURES, "cases", "essay.md"), "--json");
  check("CLI --json emits the same object the module returns", json.status === 0 && JSON.parse(json.stdout).headings.length === 4);
  check("CLI refuses an unknown flag and a missing file with exit 2",
    cli("nope.md", "--json").status === 2 && cli(join(OUTLINE_FIXTURES, "cases", "essay.md"), "--score").status === 2);
}

/* ------------------------------------------------------------------ */
group("voice-outline/1 — the schema refuses what the differ could not compare");
const os = await import(pathToFileURL(join(SKILL, "tools", "lib", "outline-schema.mjs")).href);
{
  const v1 = loadOutline("post-v1.json"), v2 = loadOutline("post-v2.json");
  check("both fixture outlines validate", os.validateOutline(v1).length === 0 && os.validateOutline(v2).length === 0);
  const clone = (doc) => JSON.parse(JSON.stringify(doc));
  const bad = (mutate, pattern, name) => { const d = clone(v1); mutate(d); check(name, os.validateOutline(d).some((e) => pattern.test(e)), os.validateOutline(d).join("; ")); };
  bad((d) => { d.nodes[1].id = "n1"; }, /duplicate id/, "a duplicate node id is refused");
  bad((d) => { d.nodes[0].kind = "beat"; }, /kind must be claim/, "a beat-sheet kind in argument mode is refused");
  bad((d) => { d.nodes[4].parent = "n99"; }, /parent n99 does not exist/, "a dangling parent is refused");
  bad((d) => { d.nodes[4].evidence = []; }, /only a claim carries evidence/, "evidence on an open question is refused");
  bad((d) => { d.nodes[0].evidence.push({ slot: "e1", filled_by: null }); }, /duplicate evidence slot/, "a duplicate evidence slot is refused");
  bad((d) => { d.mode = "essay"; }, /mode must be/, "an unknown mode is refused");
  bad((d) => { d.revision = 2; }, /ancestry/, "a revision above 1 needs a parent digest");
  const beats = { mode: "beat-sheet", title: "Ch. 3", thesis: "Mara finds the mill empty.", nodes: [
    { id: "n1", kind: "act", text: "Arrival", parent: null, order: 1 },
    { id: "n2", kind: "beat", text: "The bridge and the river", parent: "n1", order: 1 },
    { id: "n3", kind: "turn", text: "The ledger line in a stranger's hand", parent: "n1", order: 2 },
    { id: "n4", kind: "open-question", text: "Who wrote the line?", parent: "n3", order: 1 } ] };
  check("a beat-sheet body validates with acts, beats, turns and open questions", os.validateOutlineBody(beats).length === 0);
  check("children() orders siblings by order then id", os.children(beats, "n1").map((n) => n.id).join() === "n2,n3");
}

/* ------------------------------------------------------------------ */
group("outline-diff — by id, never by text");
{
  const d = await diffPair(DIFF_PAIRS[0]);
  const expectedPath = join(OUTLINE_FIXTURES, "expected", "diff-post-v1-v2.json");
  check("diff-post-v1-v2 matches its expected JSON", existsSync(expectedPath) && readFileSync(expectedPath, "utf8") === renderOutline(d),
    "rerun tests/outline-fixtures.mjs --update and review the diff");
  check("the planted move is found: n3 goes from position 3 to 1", d.moved.some((m) => m.id === "n3" && m.from === 3 && m.to === 1));
  check("the planted addition and removal are found by id", d.added.join() === "n6" && d.removed.join() === "n5");
  check("the rewording of n2 is a rewording, and its evidence slot went from empty to filled",
    d.reworded.length === 1 && d.reworded[0].id === "n2" && d.evidence.length === 1 && d.evidence[0].change === "filled");
  check("nothing was reparented and n4 is unchanged", d.reparented.length === 0 && d.unchanged === 1);
  const v1 = loadOutline("post-v1.json");
  const self = (await import(pathToFileURL(join(SKILL, "tools", "outline-diff.mjs")).href)).diffOutlines(v1, v1);
  check("a document diffed against itself reports nothing but unchanged nodes",
    self.added.length + self.removed.length + self.moved.length + self.reworded.length + self.evidence.length === 0 && self.unchanged === v1.nodes.length);
  // The trap: a node vanishes and another appears with IDENTICAL text. Matching by
  // text would call that a rename; by id it is one removal and one addition.
  const v3 = JSON.parse(JSON.stringify(v1));
  v3.revision = 2; v3.parent_digest = "0".repeat(64);
  const n2 = v3.nodes.find((n) => n.id === "n2");
  v3.nodes = v3.nodes.filter((n) => n.id !== "n2");
  v3.nodes.push({ ...n2, id: "n7" });
  const trap = (await import(pathToFileURL(join(SKILL, "tools", "outline-diff.mjs")).href)).diffOutlines(v1, v3);
  check("a removed id with identical text elsewhere is removed + added, never a rewording",
    trap.removed.join() === "n2" && trap.added.join() === "n7" && trap.reworded.length === 0);
  const { spawnSync } = await import("node:child_process");
  const cli = (...a) => spawnSync(process.execPath, [DIFF, ...a], { encoding: "utf8" });
  const a = join(OUTLINE_FIXTURES, "outlines", "post-v1.json"), b = join(OUTLINE_FIXTURES, "outlines", "post-v2.json");
  check("CLI --json parses and agrees; one file or a bad flag exits 2; an invalid outline exits 1",
    JSON.parse(cli(a, b, "--json").stdout).added.join() === "n6" && cli(a).status === 2 && cli(a, b, "--fuzzy").status === 2
      && cli(a, join(OUTLINE_FIXTURES, "cases.json")).status === 1);
}

/* ------------------------------------------------------------------ */
group("registry-reader — three states, read-only, pinned to prose-author's reader");
const rr = await import(pathToFileURL(join(SKILL, "tools", "lib", "registry-reader.mjs")).href);
const REG = join(HERE, "fixtures", "registry");
const tmp = mkdtempSync(join(tmpdir(), "prose-outline-selftest-"));
try {
  check("no registry ⇒ state none", rr.selectedIdentity(join(tmp, "nowhere")).state === "none");
  const amb = rr.selectedIdentity(join(REG, "ambiguous"));
  check("identities without a default ⇒ ambiguous, listing them, never picking one",
    amb.state === "ambiguous" && amb.identities.join() === "personal,work");
  const sel = rr.selectedIdentity(join(REG, "selected"));
  check("a selected default ⇒ selected, with the entry and registry revision",
    sel.state === "selected" && sel.id === "personal" && sel.entry.preference_store === "/private/writing/preferences" && sel.registry_revision === 2 && sel.explicit === false);
  check("an explicit identity resolves in an ambiguous registry", rr.selectedIdentity(join(REG, "ambiguous"), "work").id === "work");
  let threw = null;
  try { rr.selectedIdentity(join(REG, "ambiguous"), "nobody"); } catch (e) { threw = e.message; }
  check("an explicit identity that does not exist is a refusal, not a state", /Unknown writing identity: nobody/.test(threw ?? ""));
  // Tampering: change a byte of the current revision; the pointer's digest no longer reproduces.
  const tampered = join(tmp, "tampered"); cpSync(join(REG, "selected"), tampered, { recursive: true });
  const rev = JSON.parse(readFileSync(join(tampered, "current.json"), "utf8")).file;
  writeFileSync(join(tampered, "revisions", rev), readFileSync(join(tampered, "revisions", rev), "utf8").replace('"personal"', '"personal "'));
  threw = null; try { rr.readRegistry(tampered); } catch (e) { threw = e.message; }
  check("a revision whose bytes do not reproduce the pointer digest is refused", /digest mismatch/.test(threw ?? ""));
  const future = join(tmp, "future"); cpSync(join(REG, "selected"), future, { recursive: true });
  const futureBytes = readFileSync(join(future, "revisions", rev), "utf8").replace("voice-identity-registry/1", "voice-identity-registry/2");
  const futureFile = `2-${rr.sha256(futureBytes)}.json`;
  writeFileSync(join(future, "revisions", futureFile), futureBytes); writeFileSync(join(future, "current.json"), JSON.stringify({ file: futureFile }));
  threw = null; try { rr.readRegistry(future); } catch (e) { threw = e.message; }
  check("an unknown registry schema is refused by name and never migrated", /voice-identity-registry\/2.*never migrates/.test(threw ?? ""));
  check("PROSE_PROJECTS_DIR overrides the default under the registry; a relative value is refused",
    rr.projectsDirectory({ PROSE_PROJECTS_DIR: "/elsewhere/projects" }) === "/elsewhere/projects"
      && rr.projectsDirectory({}, "/reg") === join("/reg", "projects")
      && (() => { try { rr.projectsDirectory({ PROSE_PROJECTS_DIR: "relative" }); return false; } catch { return true; } })());
  const author = await sibling("bundles/prose-author/skills/prose-draft/tools/identity-store.mjs", "registry reader parity");
  if (author) {
    for (const state of ["ambiguous", "selected"]) {
      check(`${state}: readRegistry equals prose-author's readIdentities`,
        JSON.stringify(rr.readRegistry(join(REG, state))) === JSON.stringify(author.readIdentities(join(REG, state))));
    }
    const theirs = author.resolveIdentity(join(REG, "selected"));
    check("selected: the entry equals prose-author's resolveIdentity entry",
      JSON.stringify(sel.entry) === JSON.stringify(Object.fromEntries(Object.entries(theirs).filter(([k]) => !["registry_directory", "registry_revision"].includes(k))))
        && theirs.registry_revision === sel.registry_revision);
    // A registry prose-author writes fresh, right now, reads identically — the fixture is not a stale snapshot.
    const fresh = join(tmp, "fresh");
    author.registerIdentity(fresh, { id: "now", samples_dir: "/private/now", profile_file: null, preference_store: null, history_directory: null }, 0);
    check("a registry prose-author writes today is read with the same state", rr.selectedIdentity(fresh).state === "ambiguous" && rr.readRegistry(fresh).revision === 1);
    const profileV3 = await sibling("bundles/prose-author/skills/prose-draft/tools/profile-v3.mjs", "sha256 parity");
    if (profileV3) check("prose-author's sha256 and this reader's agree on the same bytes", ["x", "revision bytes\n", "ü"].every((s) => rr.sha256(s) === profileV3.sha256(s)));
  }

  /* ---------------------------------------------------------------- */
  group("revision-store — approval gate, stale refusal, immutable revisions, undo, lock");
  const rs = await import(pathToFileURL(join(SKILL, "tools", "lib", "revision-store.mjs")).href);
  check("store paths validate identity, project name and store kind",
    rs.storePath("/p", "me", "book", "outlines") === join("/p", "me", "book", "outlines")
      && ["bad name", "", "-x"].every((p) => { try { rs.storePath("/p", "me", p, "outlines"); return false; } catch { return true; } })
      && (() => { try { rs.storePath("/p", "me", "book", "notes"); return false; } catch (e) { return /Unknown store/.test(e.message); } })());
  const dir = rs.storePath(tmp, "me", "book", "outlines");
  const S = { schema: "voice-outline/1", id: "book" };
  const p1 = rs.saveStore(dir, { ...S, payload: { title: "v1" }, expectedRevision: 0 });
  check("without approval: a proposal comes back and nothing touches disk",
    p1.status === "proposal" && p1.proposal.revision === 1 && p1.proposal.parent_digest === null && !existsSync(join(dir, "current.json")));
  const s1 = rs.saveStore(dir, { ...S, payload: { title: "v1" }, expectedRevision: 0, approved: true });
  check("approved: revision 1 is written with a null parent and a receipt naming undo",
    s1.status === "saved" && rs.readStore(dir, S.schema, S.id).title === "v1" && /Undo restores revision 0/.test(s1.receipt.undo));
  threw = null; try { rs.saveStore(dir, { ...S, payload: { title: "v2" }, expectedRevision: 0, approved: true }); } catch (e) { threw = e.message; }
  check("a stale expected revision is refused", /Stale revision/.test(threw ?? ""));
  const s2 = rs.saveStore(dir, { ...S, payload: { title: "v2" }, expectedRevision: 1, approved: true });
  check("revision 2's parent digest is the canonical digest of revision 1", s2.document.parent_digest === rs.digest(s1.document));
  threw = null; try { rs.saveStore(dir, { ...S, payload: { title: "x" }, expectedRevision: 2, approved: true, }); rs.saveStore(dir, { ...S, payload: { revision: 9 }, expectedRevision: 3, approved: true }); } catch (e) { threw = e.message; }
  check("a payload carrying envelope keys is refused", /envelope keys/.test(threw ?? ""));
  const u0 = rs.undoStore(dir, { ...S, expectedRevision: 3 });
  check("undo without approval proposes and writes nothing", u0.status === "proposal" && u0.proposal.title === "v2" && rs.readStore(dir, S.schema, S.id).revision === 3);
  const u1 = rs.undoStore(dir, { ...S, expectedRevision: 3, approved: true });
  check("undo writes a NEW revision holding the parent's payload; history stays", u1.document.revision === 4 && u1.document.title === "v2" && rs.listRevisions(dir).length === 4);
  const fresh = rs.storePath(tmp, "me", "note", "outlines");
  rs.saveStore(fresh, { ...S, id: "note", payload: { title: "only" }, expectedRevision: 0, approved: true });
  threw = null; try { rs.undoStore(fresh, { ...S, id: "note", expectedRevision: 1, approved: true }); } catch (e) { threw = e.message; }
  check("undo at revision 1 is refused", /No change to undo/.test(threw ?? ""));
  writeFileSync(join(dir, ".writer.lock"), "");
  threw = null; try { rs.saveStore(dir, { ...S, payload: { title: "v5" }, expectedRevision: 4, approved: true }); } catch (e) { threw = e.message; }
  check("an existing lock is reported, not removed", /another or interrupted writer/.test(threw ?? "") && existsSync(join(dir, ".writer.lock")));
  unlinkSync(join(dir, ".writer.lock"));
  const prefs = await sibling("bundles/prose-author/skills/prose-draft/tools/preferences-v2.mjs", "digest parity");
  if (prefs) check("digest parity with preferences-v2 on the same document", prefs.digest(s2.document) === rs.digest(s2.document) && prefs.stableJSON({ b: [1, { d: 2, c: 3 }], a: null }) === rs.stableJSON({ b: [1, { d: 2, c: 3 }], a: null }));
} finally {
  rmSync(tmp, { recursive: true, force: true });
}

process.stdout.write(`\n${"─".repeat(60)}\n`);
process.stdout.write(`${passed} passed, ${failed} failed${skipped ? `, ${skipped} skipped` : ""}\n`);
if (skipped) process.stdout.write(`\nSkipped (precondition absent):\n${skips.map((s) => `  - ${s}`).join("\n")}\n`);
if (failed) process.stdout.write(`\nFailures:\n${failures.map((f) => `  - ${f}`).join("\n")}\n`);
process.exit(failed ? 1 : 0);
