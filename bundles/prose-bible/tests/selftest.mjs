#!/usr/bin/env node
/**
 * prose-bible selftest.
 *
 *   node bundles/prose-bible/tests/selftest.mjs
 *
 * Every case builds its scratch state under the OS temp directory and touches
 * nothing in the repo. No model is dispatched.
 */
import { cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const BUNDLE = resolve(HERE, "..");
const REPO = resolve(BUNDLE, "..", "..");
const SKILL = join(BUNDLE, "skills", "prose-bible");
const TOOLS = join(SKILL, "tools");
const OUTLINE_SKILL = join(REPO, "bundles", "prose-outline", "skills", "prose-outline");

let passed = 0, failed = 0, skipped = 0;
const failures = [], skips = [];
function check(name, condition, detail = "") {
  if (condition) { passed += 1; process.stdout.write(`  ok   ${name}\n`); }
  else { failed += 1; failures.push(`${name}${detail ? ` — ${detail}` : ""}`); process.stdout.write(`  FAIL ${name}${detail ? ` — ${detail}` : ""}\n`); }
}
const group = (title) => process.stdout.write(`\n${title}\n`);
const attempt = (fn) => { try { return fn() ?? {}; } catch (e) { return { crashed: e.message }; } };
async function sibling(relative, why) {
  const path = join(REPO, relative);
  if (!existsSync(path)) { skipped += 1; skips.push(`${relative} — ${why}`); process.stdout.write(`  SKIP ${relative} absent — ${why}\n`); return null; }
  return import(pathToFileURL(path).href);
}

/* ------------------------------------------------------------------ */
group("Packaging — four manifests, one agent, the shared libs byte-identical to prose-outline's");
{
  const manifests = [".claude-plugin", ".codex-plugin", ".cursor-plugin", ".plugin"].map((f) => JSON.parse(readFileSync(join(BUNDLE, f, "plugin.json"), "utf8")));
  check("all four manifests name prose-bible with one version", manifests.every((m) => m.name === "prose-bible") && new Set(manifests.map((m) => m.version)).size === 1);
  check("the Claude manifest lists the continuity critic and the file exists",
    manifests[0].agents?.includes("./agents/prose-continuity-critic.md") && existsSync(join(BUNDLE, "agents", "prose-continuity-critic.md")));
  for (const lib of ["text-index.mjs", "registry-reader.mjs", "revision-store.mjs"]) {
    const ours = join(TOOLS, "lib", lib), theirs = join(OUTLINE_SKILL, "tools", "lib", lib);
    if (!existsSync(theirs)) { skipped += 1; skips.push(`${lib} — prose-outline absent`); process.stdout.write(`  SKIP ${lib} parity — prose-outline absent\n`); continue; }
    check(`lib/${lib} is byte-identical to prose-outline's canonical copy`, readFileSync(ours).equals(readFileSync(theirs)));
  }
  const skill = readFileSync(join(SKILL, "SKILL.md"), "utf8");
  check("SKILL.md references tools by relative path and states the approval and from-the-index rules",
    !skill.includes("CLAUDE_PLUGIN_ROOT") && /node tools\/entity-index\.mjs/.test(skill) && /--approved/.test(skill) && /never from memory/i.test(skill));
  const meta = readFileSync(join(SKILL, "meta.yaml"), "utf8");
  check("meta.yaml declares kind investigator, surface skill and honest enforcement per harness",
    /kind: investigator/.test(meta) && ["claude-code", "cursor", "codex", "agents-md"].every((h) => new RegExp(`${h}:\\n\\s+enforcement: (enforced|partial|advisory)`).test(meta)));
  const agent = readFileSync(join(REPO, "primitives", "agents", "prose-continuity-critic", "agent.md"), "utf8");
  const rendered = readFileSync(join(BUNDLE, "agents", "prose-continuity-critic.md"), "utf8");
  const body = (t) => t.replace(/^---\n[\s\S]*?\n---\n/, "");
  check("prose-continuity-critic: rendered body is byte-identical to the primitive (AGENTS.md rule 1)", body(agent) === body(rendered));
  check("the critic's prompt states the two-location rule and silence on uncertainty",
    /cite nothing it did not supply/i.test(agent) && /when you cannot tell, say nothing/i.test(agent));
}

/* ------------------------------------------------------------------ */
group("text-index parity — prose-outline's cases through this copy");
{
  const fixtures = join(REPO, "bundles", "prose-outline", "tests", "fixtures", "text-index");
  if (!existsSync(join(fixtures, "cases.json"))) { skipped += 1; skips.push("text-index parity cases — prose-outline absent"); process.stdout.write("  SKIP parity cases — prose-outline absent\n"); }
  else {
    const m = await import(pathToFileURL(join(TOOLS, "lib", "text-index.mjs")).href);
    for (const c of JSON.parse(readFileSync(join(fixtures, "cases.json"), "utf8")).cases) {
      const source = readFileSync(join(fixtures, "cases", c.name), "utf8");
      const options = { markdown: c.markdown };
      const result = { case: c.name, module: m.TEXT_INDEX_VERSION, segment: m.segment(source, options), runs: m.capitalisedRuns(source, options), terms: m.definedTerms(source, options), numbers: m.numbersAndDates(source, options) };
      check(`${c.name}: this copy reproduces prose-outline's expected JSON`, `${JSON.stringify(result, null, 2)}\n` === readFileSync(join(fixtures, "expected", `${c.name}.json`), "utf8"));
    }
  }
}

/* ------------------------------------------------------------------ */
group("entity-index — the planted-drift project, and the consistent control");
const ei = await import(pathToFileURL(join(TOOLS, "entity-index.mjs")).href);
const id = await import(pathToFileURL(join(TOOLS, "index-diff.mjs")).href);
const FIX = join(HERE, "fixtures");
const driftIndex = ei.buildIndex(ei.collectFiles([join(FIX, "project")]));
const controlIndex = ei.buildIndex(ei.collectFiles([join(FIX, "control")]));
{
  const expected = join(FIX, "expected", "project.index.json");
  check("project: index matches expected/project.index.json", existsSync(expected) && readFileSync(expected, "utf8") === `${JSON.stringify(driftIndex, null, 2)}\n`,
    "rerun tests/bible-fixtures.mjs --update and review the diff");
  const mara = driftIndex.terms.find((t) => t.key === "mara");
  check("project: a sentence-initial name still indexes; Mara has three occurrences in three files", mara?.occurrences.length === 3 && mara.files.length === 3);
  check("project: Mara's eyes are stated twice with different values, each with file and line",
    mara?.attributes.length === 2 && mara.attributes.map((a) => a.value).sort().join() === "green,grey" && mara.attributes.every((a) => a.file && a.line));
  const road = driftIndex.terms.find((t) => t.key === "harrow road");
  check("project: 'Harrow road' is one term with definitions in two files", road?.definitions.length >= 2 && new Set(road.definitions.map((d) => d.file)).size === 2);
  check("project: pronouns never become terms", !driftIndex.terms.some((t) => ["he", "she", "her", "it"].includes(t.key)));
  check("project: dates carry a context word", driftIndex.dates.filter((d) => d.kind === "date").every((d) => d.context));
  check("project: the retold anecdote is a near repeat across two files", driftIndex.repeats.some((r) => r.kind === "near" && new Set(r.locations.map((l) => l.file)).size === 2));
  check("every location in the index points at what it claims to",
    driftIndex.terms.flatMap((t) => [...t.occurrences, ...t.definitions, ...t.attributes]).every((o) => {
      const text = readFileSync(join(FIX, "project", o.file), "utf8"); return o.sentence === null || text.includes(o.sentence.slice(0, 30)); }));
  check("indexing twice gives identical output", JSON.stringify(ei.buildIndex(ei.collectFiles([join(FIX, "project")]))) === JSON.stringify(driftIndex));
}

/* ------------------------------------------------------------------ */
group("index-diff — names the planted contradictions, and nothing on the control");
{
  const d = id.diffIndex(driftIndex);
  const expected = join(FIX, "expected", "project.diff.json");
  check("project: diff matches expected/project.diff.json", existsSync(expected) && readFileSync(expected, "utf8") === `${JSON.stringify(d, null, 2)}\n`,
    "rerun tests/bible-fixtures.mjs --update and review the diff");
  check("project: eye-colour drift is found with both locations", d.attribute_drift.some((a) => a.key === "mara" && a.attribute === "eyes" && a.a.file && a.b.file));
  check("project: the redefined road is found, coast versus quarry", d.redefined.some((r) => r.key === "harrow road" && /coast/.test(r.a.definition + r.b.definition) && /quarry/.test(r.a.definition + r.b.definition)));
  check("project: the date drift is found under the same context word", d.date_drift.some((x) => x.context === "flood" && x.a.text !== x.b.text));
  check("project: the retold anecdote is a repeat candidate", d.repeated.length >= 1);
  check("every candidate carries two locations", [...d.redefined, ...d.attribute_drift, ...d.date_drift].every((c) => c.a && c.b) && d.repeated.every((r) => r.locations.length >= 2));
  const c = id.diffIndex(controlIndex);
  check("control: no redefinition, no attribute drift, no date drift", c.redefined.length === 0 && c.attribute_drift.length === 0 && c.date_drift.length === 0, c.summary);
  check("control: the deliberately restated rule surfaces as a repeat CANDIDATE only — the critic's to clear", c.repeated.length >= 1);
  // The bible join: a bible that says grey against a text that says green.
  const bible = { schema: "voice-bible/1", id: "book", revision: 1, parent_digest: null, entries: [{ id: "b1", kind: "character", name: "Mara", key: "mara", attributes: { eyes: "grey" }, definition: null, first_seen: null, notes: "" }] };
  const withBible = id.diffIndex(driftIndex, bible);
  check("a bible attribute the text contradicts is drift with source bible", withBible.attribute_drift.some((a) => a.source === "bible" && a.b.value === "green"));
  let threw = null; try { id.diffIndex({ schema: "nope" }); } catch (e) { threw = e.message; }
  check("a non-index input is refused", /entity-index\/1/.test(threw ?? ""));
}

/* ------------------------------------------------------------------ */
group("voice-bible/1 and bible-store — schema, proposal, approval, undo, three registry states");
const bs = await import(pathToFileURL(join(TOOLS, "lib", "bible-schema.mjs")).href);
const store = await import(pathToFileURL(join(TOOLS, "bible-store.mjs")).href);
const tmp = mkdtempSync(join(tmpdir(), "prose-bible-selftest-"));
try {
  const proposal = bs.proposeEntries(driftIndex);
  check("proposeEntries yields valid entries with stable ids and index keys", bs.validateBibleBody(proposal).length === 0 && proposal.entries.every((e) => /^b\d+$/.test(e.id) && e.key === e.key.toLowerCase()));
  check("a proposed character with two stated eye colours is flagged for the writer, never resolved",
    proposal.entries.some((e) => e.key === "mara" && /confirm which is right/.test(e.notes)));
  const bad = (mutate, pattern, name) => { const b = JSON.parse(JSON.stringify(proposal)); mutate(b); check(name, bs.validateBibleBody(b).some((e) => pattern.test(e)), bs.validateBibleBody(b).join("; ")); };
  bad((b) => { b.entries[1].id = b.entries[0].id; }, /duplicate id/, "a duplicate entry id is refused");
  bad((b) => { b.entries[0].kind = "place"; }, /kind must be/, "an unknown kind is refused");
  bad((b) => { b.entries[0].key = "Mara"; }, /lower case/, "a mixed-case key is refused");
  bad((b) => { b.entries[0].attributes = { eyes: "" }; }, /non-empty strings/, "an empty attribute value is refused");
  const REG = join(REPO, "bundles", "prose-outline", "tests", "fixtures", "registry");
  if (!existsSync(REG)) { skipped += 1; skips.push("registry fixtures — prose-outline absent"); process.stdout.write("  SKIP registry states — prose-outline's fixtures absent\n"); }
  else {
    const env = { PROSE_PROJECTS_DIR: join(tmp, "projects") };
    const file = join(tmp, "proposal.json"); writeFileSync(file, JSON.stringify(proposal));
    const refusal = (argv) => { try { store.runStore(argv, env); return null; } catch (e) { return e; } };
    let r = refusal(["save", "--proposal", file, "--project", "book", "--expected-revision", "0", "--approved", "--registry", join(tmp, "none")]);
    check("no registry ⇒ cannot persist, exit 3, nothing on disk", r?.code === 3 && !existsSync(join(tmp, "projects")));
    r = refusal(["save", "--proposal", file, "--project", "book", "--expected-revision", "0", "--approved", "--registry", join(REG, "ambiguous")]);
    check("identities without a default ⇒ cannot persist, never picking the first", r?.code === 3 && r.identities?.join() === "personal,work");
    const sel = ["--registry", join(REG, "selected")];
    const dry = attempt(() => store.runStore(["save", "--proposal", file, "--project", "book", "--expected-revision", "0", ...sel], env));
    check("without --approved a proposal comes back and nothing is written", dry.status === "proposal" && !existsSync(join(tmp, "projects", "personal", "book", "bible", "current.json")));
    const saved = attempt(() => store.runStore(["save", "--proposal", file, "--project", "book", "--expected-revision", "0", "--approved", ...sel], env));
    check("approved ⇒ revision 1 under <projects>/<identity>/<project>/bible", saved.status === "saved" && saved.revision === 1 && existsSync(join(tmp, "projects", "personal", "book", "bible", "current.json")));
    const shown = attempt(() => store.runStore(["show", "--project", "book", ...sel], env));
    check("show returns a valid voice-bible/1 with the project as id", shown.bible?.schema === "voice-bible/1" && shown.bible?.id === "book" && bs.validateBible(shown.bible).length === 0);
    r = refusal(["save", "--proposal", file, "--project", "book", "--expected-revision", "0", "--approved", ...sel]);
    check("a stale expected revision is refused", /Stale revision/.test(r?.message ?? ""));
    attempt(() => store.runStore(["save", "--proposal", file, "--project", "book", "--expected-revision", "1", "--approved", ...sel], env));
    const undone = attempt(() => store.runStore(["undo", "--project", "book", "--expected-revision", "2", "--approved", ...sel], env));
    check("undo writes revision 3 restoring revision 1", undone.status === "saved" && undone.revision === 3);
    const proposed = attempt(() => store.runStore(["propose", "--index", join(tmp, "index.json")], env));
    writeFileSync(join(tmp, "index.json"), JSON.stringify(driftIndex));
    const proposed2 = attempt(() => store.runStore(["propose", "--index", join(tmp, "index.json")], env));
    check("propose reads an index and never touches the store", proposed.crashed && proposed2.status === "proposal" && proposed2.entries === proposal.entries.length);
  }
} finally { rmSync(tmp, { recursive: true, force: true }); }

/* ------------------------------------------------------------------ */
group("continuity fixtures — integrity, four-class geometry re-derived from the echo rule");
const ch = await import(pathToFileURL(join(HERE, "continuity-harness.mjs")).href);
{
  const manifest = ch.loadContinuityManifest();
  check("the manifest states the echo rule the harness implements", manifest.echo_rule === ch.ECHO_RULE.description);
  const classes = { A: 0, B: 0, C: 0, D: 0 };
  for (const f of manifest.fixtures) {
    const project = ch.projectDir(f);
    const { diff } = await ch.diffProject(project);
    const says = ch.diffSays(diff);
    check(`${f.name}: diff_says re-derived (${says})`, says === f.diff_says);
    const geometry = { A: ["CLEAN", "CLEAN"], B: ["REVISE", "CLEAN"], C: ["REVISE", "REVISE"], D: ["CLEAN", "REVISE"] }[f.class];
    check(`${f.name}: class ${f.class} matches diff_says/expect and kind matches expect`,
      geometry && geometry[0] === f.diff_says && geometry[1] === f.expect && (f.kind === "positive") === (f.expect === "REVISE") && f.name.startsWith(f.kind[0] + "-"));
    classes[f.class] += 1;
    const prose = readdirSync(project).filter((n) => /\.(md|txt)$/.test(n)).map((n) => readFileSync(join(project, n), "utf8")).join("\n");
    check(`${f.name}: the project's prose carries no verdict word or expectation key`, ch.leakCheck(f.name, prose) === null);
    check(`${f.name}: every candidate the critic will see carries two locations`,
      [...diff.redefined, ...diff.attribute_drift, ...diff.date_drift, ...diff.bible_conflicts].every((c) => (c.a?.file || c.a?.bible) && c.b?.file) && diff.repeated.every((r) => r.locations.length >= 2));
  }
  check("classes A, B and C each have at least two fixtures", classes.A >= 2 && classes.B >= 2 && classes.C >= 2, JSON.stringify(classes));
  check("class D is empty by construction and the manifest says so", classes.D === 0 && /EMPTY BY CONSTRUCTION/.test(manifest._comment.join(" ")));
}

/* ------------------------------------------------------------------ */
group("continuity harness — prepare stages leak-free prompts; a poisoned copy aborts; collect and check round-trip");
{
  const tmp = mkdtempSync(join(tmpdir(), "prose-bible-harness-"));
  try {
    const runDir = join(tmp, "run");
    const out = spawnSync(process.execPath, [join(HERE, "continuity-harness.mjs"), "prepare", runDir, "--draws", "1"], { encoding: "utf8" });
    const manifest = attempt(() => JSON.parse(readFileSync(join(runDir, "MANIFEST.json"), "utf8")));
    check("prepare writes a MANIFEST naming the critic, the agent sha and one case per fixture", out.status === 0 && manifest.critic === "continuity" && manifest.cases?.length === ch.loadContinuityManifest().fixtures.length && /^[0-9a-f]{64}$/.test(manifest.agent_sha256 ?? ""));
    const prompts = existsSync(join(runDir, "prompts")) ? readdirSync(join(runDir, "prompts")).filter((f) => /^case-\d+-d1\.md$/.test(f)) : [];
    check("one prompt per case, none naming a fixture, a class or a verdict", prompts.length === manifest.cases?.length && prompts.every((f) => { const t = readFileSync(join(runDir, "prompts", f), "utf8"); return !/n-two-notes|p-drift|diff_says|"class"/.test(t) && !/\b(?:CLEAN|REVISE)\b/.test(t.split("## index-diff output")[1] ?? ""); }));
    check("staged inputs are the diff (and bible where one exists), never the project files",
      manifest.cases?.every((c) => existsSync(join(runDir, "inputs", c.case, "diff.json")) && !readdirSync(join(runDir, "inputs", c.case)).some((f) => /\.md$/.test(f))) && manifest.cases?.some((c) => c.inputs.some((i) => i.as === "bible.json")));
    check("case ids do not follow kind order", manifest.cases?.some((c, i, all) => i > 0 && c.kind !== all[i - 1].kind));
    // A poisoned copy: a verdict word in a fixture sentence must abort prepare.
    const poisoned = join(tmp, "fixtures");
    cpSync(join(HERE, "fixtures"), poisoned, { recursive: true });
    // Poison a sentence that REACHES the diff (a definition), not one the index drops: the leak
    // check runs over what the critic will read, and a verdict word in prose the index never
    // quotes is not a leak.
    const ch3 = join(poisoned, "continuity", "n-alias-definitions", "chapter-03.md");
    writeFileSync(ch3, readFileSync(ch3, "utf8").replace("Ines is the miller's daughter", "Ines is the REVISE miller's daughter"));
    const bad = spawnSync(process.execPath, [join(HERE, "continuity-harness.mjs"), "prepare", join(tmp, "bad"), "--draws", "1", "--fixtures-dir", join(poisoned, "continuity"), "--only", "n-alias-definitions"], { encoding: "utf8" });
    check("a verdict word in a staged sentence aborts prepare with no MANIFEST", bad.status === 1 && /ABORTED/.test(bad.stderr) && !existsSync(join(tmp, "bad", "MANIFEST.json")));
    // collect: a synthetic transcript with no counts yields review.json and exit 1; with counts it wraps; check round-trips.
    const raw = join(runDir, "raw"); mkdirSync(raw, { recursive: true });
    writeFileSync(join(raw, "n-two-notes-d1.md"), "No candidates were supplied.\n\nAll four classes are clean.\n\nCLEAN\n");
    writeFileSync(join(raw, "p-drift-project-d1.md"), "- **CLASS**: attribute\n- **KEY**: mara\n- **A**: chapter-01.md:3 — \"Mara had grey eyes\"\n- **B**: chapter-02.md:3 — \"Mara had green eyes\"\n- **WHY THEY CANNOT BOTH HOLD**: one character, one pair of eyes.\n\nREVISE\n");
    const first = spawnSync(process.execPath, [join(HERE, "continuity-harness.mjs"), "collect", runDir], { encoding: "utf8" });
    const review = attempt(() => JSON.parse(readFileSync(join(runDir, "review.json"), "utf8")));
    check("collect without counts writes review.json with the finding quoted and refuses", first.status === 1 && review["p-drift-project-d1"]?._findings_to_review?.length === 1 && review["p-drift-project-d1"].uncited === null);
    for (const k of Object.keys(review)) if (!k.startsWith("_")) { review[k].uncited = 0; review[k].third_location = 0; }
    writeFileSync(join(runDir, "review.json"), JSON.stringify(review));
    const second = spawnSync(process.execPath, [join(HERE, "continuity-harness.mjs"), "collect", runDir], { encoding: "utf8" });
    check("collect with counts wraps both transcripts and prints the parrot beside the critic", second.status === 0 && existsSync(join(runDir, "p-drift-project-d1.md")) && /parrot\s+— negatives quiet 1\/1, positives caught 1\/1/.test(second.stdout) && /critic\s+— negatives quiet 1\/1, positives caught 1\/1/.test(second.stdout));
    const checked = spawnSync(process.execPath, [join(HERE, "continuity-harness.mjs"), "check", runDir], { encoding: "utf8" });
    check("check reproduces both wrappers byte-for-byte", checked.status === 0 && /byte-for-byte from the transcript body: 2 of 2/.test(checked.stdout));
    const wrapped = readFileSync(join(runDir, "p-drift-project-d1.md"), "utf8");
    writeFileSync(join(runDir, "p-drift-project-d1.md"), wrapped.replace("findings=1", "findings=2"));
    const tampered = spawnSync(process.execPath, [join(HERE, "continuity-harness.mjs"), "check", runDir], { encoding: "utf8" });
    check("a RESULT line whose findings count disagrees with the transcript is a DEFECT", tampered.status === 1 && /DEFECT — .*findings=2, transcript contains 1/.test(tampered.stdout));
  } finally { rmSync(tmp, { recursive: true, force: true }); }
}

process.stdout.write(`\n${"─".repeat(60)}\n`);
process.stdout.write(`${passed} passed, ${failed} failed${skipped ? `, ${skipped} skipped` : ""}\n`);
if (skipped) process.stdout.write(`\nSkipped (precondition absent):\n${skips.map((s) => `  - ${s}`).join("\n")}\n`);
if (failed) process.stdout.write(`\nFailures:\n${failures.map((f) => `  - ${f}`).join("\n")}\n`);
process.exit(failed ? 1 : 0);
