#!/usr/bin/env node
/**
 * prose-edit selftest — roadmap item L, the chief editor's reading pass.
 *
 *   node bundles/prose-review/tests/edit-selftest.mjs
 *
 * Units, the ledger's honesty, and the export to the reviser's plan. Touches
 * nothing in the repo; no model is dispatched. Also the `edit` suite of
 * bundles/prose-author/tests/mutations.mjs, so every check must survive a
 * removed guard without crashing.
 */
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const BUNDLE = resolve(HERE, "..");
const SKILL = join(BUNDLE, "skills", "prose-edit");
const TOOLS = join(SKILL, "tools");
const FIX = join(HERE, "fixtures", "edit");

let passed = 0, failed = 0;
const failures = [];
function check(name, condition, detail = "") {
  if (condition) { passed += 1; process.stdout.write(`  ok   ${name}\n`); }
  else { failed += 1; failures.push(`${name}${detail ? ` — ${detail}` : ""}`); process.stdout.write(`  FAIL ${name}${detail ? ` — ${detail}` : ""}\n`); }
}
const group = (title) => process.stdout.write(`\n${title}\n`);
const attempt = (fn) => { try { return fn() ?? {}; } catch (e) { return { crashed: e.message }; } };
const read = (n) => readFileSync(join(FIX, n), "utf8");
const ledger = (n) => JSON.parse(read(`ledger-${n}.json`));

const ss = await import(pathToFileURL(join(TOOLS, "section-split.mjs")).href);
const nc = await import(pathToFileURL(join(TOOLS, "notes-check.mjs")).href);
const sectioned = read("draft-sectioned.md"), plain = read("draft-plain.md");

group("section-split — reading units, with ids that survive edits elsewhere");
{
  const s = attempt(() => ss.splitDraft(sectioned));
  check("a sectioned draft splits at its headings: four units, in order, each naming its heading",
    s.units?.length === 4 && s.units.map((u) => u.heading).join("|") === "Feed the starter|The part nobody sees|A month on the starter|What to do on Monday" && s.units.every((u, i) => u.order === i + 1));
  check("units tile the draft without overlap, and ids are derived from the text", s.units?.every((u, i) => u.start_line <= u.end_line && (i === 0 || u.start_line > s.units[i - 1].end_line) && /^u[a-f0-9]{8}$/.test(u.id)));
  const p = attempt(() => ss.splitDraft(plain));
  check("a heading-free draft is windowed by four paragraphs: 9 paragraphs → 3 units", p.units?.length === 3 && p.window === 4 && p.units.every((u) => u.heading === null));
  const edited = sectioned.replace("that is when you know.", "that is when you know they will be good.");
  const e = attempt(() => ss.splitDraft(edited));
  check("an edit in the last section changes only that unit's id", e.units?.slice(0, 3).map((u) => u.id).join() === s.units?.slice(0, 3).map((u) => u.id).join() && e.units?.[3].id !== s.units?.[3].id);
  const preface = attempt(() => ss.splitDraft("An opening paragraph before any heading.\n\n# First\n\nBody.\n"));
  check("text before the first heading is a unit of its own", preface.units?.length === 2 && preface.units[0].heading === null);
}

group("notes-check — every note placed in its unit, every unit visited, nothing proposed at the end");
{
  const good = attempt(() => nc.checkNotes(ledger("good"), sectioned));
  check("the good ledger is clean: four notes located, all four units visited", good.ok === true && good.located?.length === 4 && good.unvisited?.length === 0);
  check("a note whose line moved is still placed by its quote, and the move is reported", good.located?.find((l) => l.note === "N1")?.line_moved_from === 13 && good.located.find((l) => l.note === "N1").line === 15);
  const outside = attempt(() => nc.checkNotes(ledger("outside-unit"), sectioned));
  check("a quote filed under the wrong unit is named — exactly that note, with where it really is", outside.ok === false && outside.problems?.length === 1 && outside.problems[0].note === "N1" && outside.problems[0].problem === "outside-unit" && outside.problems[0].found_line === 15);
  const skip = attempt(() => nc.checkNotes(ledger("skip-no-reason"), sectioned));
  check("a unit skipped without the writer's reason makes the ledger invalid", skip.valid === false && (skip.errors ?? []).some((e) => /needs the writer's reason/.test(e)));
  const left = attempt(() => nc.checkNotes(ledger("unfinished-business"), sectioned));
  check("a finished pass with a unit unvisited and a note still proposed names both", left.ok === false && left.finished_problems?.length === 2 && left.unvisited?.length === 1 && left.proposed?.join() === "N4");
  const bad = (patch, re) => { const l = ledger("good"); patch(l); return nc.ledgerErrors(l).some((e) => re.test(e)); };
  check("the session is never a source; an accepted note needs its change; unknown fields are refused",
    bad((l) => { l.notes[0].source = "session"; }, /must name one critic/) && bad((l) => { l.notes[0].change = null; }, /accepted note needs the change/) && bad((l) => { l.notes[0].score = 3; }, /unknown field score/));
  const changed = attempt(() => nc.checkNotes(ledger("good"), sectioned.replace("Give the new person a month on the slow part.", "Give the newcomer a month.")));
  check("when the draft changes mid-pass, the note whose quote is gone is named", changed.draft_changed === true && changed.problems?.some((p) => p.note === "N3"));
}

group("export — exactly the accepted notes, as PLAN-FORMAT entries, from a finished clean ledger");
{
  const l = ledger("good");
  const entries = attempt(() => nc.exportEntries(l, nc.checkNotes(l, sectioned)));
  check("two accepted notes → two entries, in note order, ids eNN", Array.isArray(entries) && entries.map((e) => e.id).join() === "e01,e03");
  check("declined and deferred notes never reach the plan", Array.isArray(entries) && !entries.some((e) => /'the jump is the point'|month is affordable/.test(JSON.stringify(e))) && entries.every((e) => ["voice-critic", "writer"].includes(e.source)));
  check("each entry carries source, location (current line + quote), change and reason — the reviser's contract",
    Array.isArray(entries) && entries.every((e) => Object.keys(e).join() === "id,source,location,change,reason" && e.location.quote && e.change) && entries[0].location.line === 15);
  const unfinished = { ...l, finished: false };
  check("an unfinished ledger is not exported", /finished ledger/.test(attempt(() => nc.exportEntries(unfinished, nc.checkNotes(unfinished, sectioned))).crashed ?? ""));
  const cli = (...a) => spawnSync(process.execPath, [join(TOOLS, "notes-check.mjs"), ...a], { encoding: "utf8" });
  check("CLI: exit 0 clean, 1 on a placed-wrong note, 2 on an invalid ledger or bad usage",
    cli(join(FIX, "ledger-good.json"), join(FIX, "draft-sectioned.md")).status === 0 && cli(join(FIX, "ledger-outside-unit.json"), join(FIX, "draft-sectioned.md")).status === 1
      && cli(join(FIX, "ledger-skip-no-reason.json"), join(FIX, "draft-sectioned.md")).status === 2 && cli().status === 2);
}

group("prose-edit skill — SKILL.md, meta.yaml, discovery");
{
  const text = readFileSync(join(SKILL, "SKILL.md"), "utf8");
  const meta = readFileSync(join(SKILL, "meta.yaml"), "utf8");
  check("SKILL.md has frontmatter with name and a trigger-first description", /^---\nname: prose-edit\ndescription: This skill should be used when/.test(text));
  check("SKILL.md calls its tools by relative path, never ${CLAUDE_PLUGIN_ROOT}", !text.includes("CLAUDE_PLUGIN_ROOT") && ["section-split", "notes-check"].every((t) => text.includes(`node tools/${t}.mjs`)));
  check("SKILL.md: the review runs first, the session adds no finding, no per-section critic by default",
    /review must already have run/.test(text) && /You add no finding of your own/.test(text) && /measured\s+bounds come from whole drafts/.test(text));
  check("meta.yaml: a read-only reviewer skill in prose-review", /^kind: reviewer$/m.test(meta) && /read_only: true/.test(meta) && /^bundle: prose-review$/m.test(meta));
  const cursor = JSON.parse(readFileSync(join(BUNDLE, ".cursor-plugin", "plugin.json"), "utf8"));
  const claude = JSON.parse(readFileSync(join(BUNDLE, ".claude-plugin", "plugin.json"), "utf8"));
  check("cursor discovers skills/; the Claude manifest declares no skills key (declaring one would replace discovery)", cursor.skills === "skills" && !("skills" in claude));
}

process.stdout.write(`\n${"─".repeat(60)}\n`);
process.stdout.write(`${passed} passed, ${failed} failed\n`);
if (failed) process.stdout.write(`\nFailures:\n${failures.map((f) => `  - ${f}`).join("\n")}\n`);
process.exit(failed ? 1 : 0);
