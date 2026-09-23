#!/usr/bin/env node
/**
 * continuity-harness — prepare, collect and check runs of prose-continuity-critic.
 *
 *   node tests/continuity-harness.mjs prepare <run-id> [--draws N] [--only a,b] [--fixtures-dir <dir>]
 *   node tests/continuity-harness.mjs collect <run-dir>
 *   node tests/continuity-harness.mjs check   <run-dir>
 *
 * The same discipline as prose-review's `run-harness.mjs`, in a bundle-local file:
 * the critic sees only staged copies (the diff JSON and, where one exists, the
 * bible), never the project files, the manifest or the expected verdict; case ids
 * are ordered by a hash of the fixture name; the runner never computes a headline
 * number — `collect` refuses until the operator has filled the contract counts,
 * then tallies what was filled and prints the echo baseline beside it.
 *
 * Why not a `CRITICS.continuity` entry in prose-review's harness: that would make
 * prose-review's tests depend on a sibling bundle in the wrong direction (a
 * consumer may import the producer it reads at test time; a producer never
 * imports its consumers), and it would leave prose-bible with a critic it could
 * not exercise when installed alone. The wrapper grammar (heading, `---` note
 * separator, RESULT line) is kept identical so a transcript from either harness
 * reads the same. Shipped code imports nothing across bundles; this file imports
 * only this bundle's tools.
 *
 * THE ECHO RULE. `diffSays(diff)` is the verdict a critic would return by
 * parroting index-diff: any candidate is a contradiction. It is not a finding and
 * the diff never prints it; it exists so the harness can report the parrot's score
 * next to the critic's and classify fixtures by whether the critic must agree or
 * disagree with the tool it reads.
 */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join, relative, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const TESTS = dirname(fileURLToPath(import.meta.url));
const BUNDLE = resolve(TESTS, "..");
const REPO = resolve(BUNDLE, "..", "..");
const TOOLS = join(BUNDLE, "skills", "prose-bible", "tools");
export const CONTINUITY_FIXTURES = join(TESTS, "fixtures", "continuity");
export const AGENT = "primitives/agents/prose-continuity-critic/agent.md";

export const SPEC = {
  vocabulary: ["CLEAN", "REVISE"],
  contract: ["uncited", "third_location"],
  finding: /\*\*CLASS\*\*/g,
  phrase: { negative: "consistent project", positive: "planted drift" },
};

export const ECHO_RULE = {
  description: "flagged when index-diff reports any candidate: redefined, attribute_drift, date_drift, repeated or bible_conflicts",
};

/** The parrot's verdict. Candidates in, one of two words out; never a finding. */
export function diffSays(diff) {
  const any = ["redefined", "attribute_drift", "date_drift", "repeated", "bible_conflicts"].some((k) => (diff[k] ?? []).length > 0);
  return any ? "REVISE" : "CLEAN";
}

export const loadContinuityManifest = (dir = CONTINUITY_FIXTURES) => JSON.parse(readFileSync(join(dir, "fixtures.json"), "utf8"));

/** A fixture's project directory: `project` in the manifest names a sibling under fixtures/; else the fixture's own dir. */
export function projectDir(f, dir = CONTINUITY_FIXTURES) {
  return f.project ? join(dir, "..", f.project) : join(dir, f.name);
}

export function continuityFixtures(opts = {}) {
  const dir = opts.fixturesDir ?? CONTINUITY_FIXTURES;
  return loadContinuityManifest(dir).fixtures.map((f) => ({ name: f.name, kind: f.kind, project: projectDir(f, dir) }));
}

/** Index and diff a fixture project. The critic receives the diff; the project never leaves this function. */
export async function diffProject(project) {
  const { buildIndex, collectFiles } = await import(pathToFileURL(join(TOOLS, "entity-index.mjs")).href);
  const { diffIndex } = await import(pathToFileURL(join(TOOLS, "index-diff.mjs")).href);
  const files = collectFiles([project]); // prose files only; bible.json is not a text extension
  const bible = existsSync(join(project, "bible.json")) ? JSON.parse(readFileSync(join(project, "bible.json"), "utf8")) : null;
  return { diff: diffIndex(buildIndex(files), bible), bible };
}

/** The task text: the diff JSON and the bible, if any. */
export function continuityTask(staged) {
  const bible = staged["bible.json"] ?? null;
  return [
    "You have the output of `index-diff` over a multi-file project" + (bible ? " and the project's bible." : ". No bible exists for this project."),
    "Report on the project's continuity, following your instructions exactly, including",
    "the output contract and the closing one-line verdict.",
    "",
    "## index-diff output",
    "",
    "```json",
    staged["diff.json"].trim(),
    "```",
    ...(bible ? ["", "## bible (voice-bible/1)", "", "```json", bible.trim(), "```"] : []),
    "",
    "The index is authoritative on locations. You are authoritative only on whether two of them can both hold.",
  ].join("\n");
}

const sha = (s) => createHash("sha256").update(s).digest("hex");

export function stripFrontmatter(text) {
  if (!text.startsWith("---\n")) return text;
  const end = text.indexOf("\n---\n", 3);
  return end === -1 ? text : text.slice(end + 5);
}

const LEAKS = [
  [/\b(?:CLEAN|REVISE)\b/, "names a verdict"],
  [/(?:^|[{,]\s*)"?(?:expect|expected|diff_says|verdict|class|outcome|kind)"?\s*:/im, "carries an expectation key"],
  [/^\s*fixture\s*:/im, "names the fixture it belongs to"],
];

export function leakCheck(name, text) {
  for (const [re, why] of LEAKS) {
    const m = text.match(re);
    if (m) return `${name} ${why} (${JSON.stringify(m[0])})`;
  }
  return null;
}

function buildPrompt({ caseId, agentPath, inputs, task }) {
  return [
    `# Critic run — ${caseId}`,
    "",
    "Your instructions are the file below, and they are the whole of your brief. If they",
    "were not supplied to you as a system prompt, read it first:",
    "",
    `    ${agentPath}`,
    "",
    task,
    "",
    "## Integrity constraints — these are the point of the harness, not boilerplate",
    "",
    "You may read exactly these files, and they are copies staged for this run:",
    "",
    ...inputs.map((i) => `    ${i}`),
    "",
    "You may not read, list, glob, grep or search anything else. In particular: no project",
    "files, no fixture manifest, no other case's directory, no previous run under `runs/`,",
    "and no test file. Do not try to work out which case this is.",
    "",
    "The expected result for this case exists in this repository. Reading it would void the",
    "run. If you find a verdict, an expectation or a class label inside the files above,",
    "STOP and report THAT instead of a verdict. It is a harness defect and it is worth more",
    "than the run.",
    "",
    "Locations you cite are the file and line fields of the candidates exactly as given above.",
    "",
    "Output your report and nothing else: no preamble, no summary of these instructions,",
    "and no commentary after the verdict line.",
  ].join("\n");
}

// ---------------------------------------------------------------------------
// prepare
// ---------------------------------------------------------------------------

export async function prepare(runId, opts = {}) {
  const draws = opts.draws ?? 3;
  const runDir = runId.includes("/") ? resolve(runId) : join(TESTS, "runs", runId);
  let fixtures = continuityFixtures(opts);
  if (opts.only) fixtures = fixtures.filter((f) => opts.only.includes(f.name));
  if (!fixtures.length) die("no fixtures selected");
  const ordered = [...fixtures].sort((a, b) => (sha(a.name) < sha(b.name) ? -1 : 1));

  const agentBody = stripFrontmatter(readFileSync(join(REPO, AGENT), "utf8"));
  mkdirSync(join(runDir, "prompts"), { recursive: true });
  writeFileSync(join(runDir, "prompts", "agent-prompt.md"), agentBody);

  const entries = [];
  const leaks = [];
  for (const [i, f] of ordered.entries()) {
    const caseId = `case-${String(i + 1).padStart(2, "0")}`;
    const caseDir = join(runDir, "inputs", caseId);
    const { diff, bible } = await diffProject(f.project);
    const staged = { "diff.json": `${JSON.stringify(diff, null, 1)}\n` };
    if (bible) staged["bible.json"] = `${JSON.stringify(bible, null, 1)}\n`;
    const files = [];
    mkdirSync(caseDir, { recursive: true });
    for (const [as, text] of Object.entries(staged)) {
      // A staged JSON legitimately carries `kind` keys (repeat kind, entry kind); the
      // leak check is run over the prose the critic will quote — every sentence,
      // definition and value — not over the JSON skeleton.
      const prose = as === "diff.json" ? proseOf(diff) : bible.entries.map((e) => [e.name, e.definition, e.notes, ...Object.values(e.attributes ?? {})].join("\n")).join("\n");
      const leak = leakCheck(`${f.name}/${as}`, prose);
      if (leak) leaks.push(leak);
      writeFileSync(join(caseDir, as), text);
      files.push({ as, sha256: sha(text) });
    }
    const prompt = buildPrompt({
      caseId,
      agentPath: relative(REPO, join(runDir, "prompts", "agent-prompt.md")),
      inputs: Object.keys(staged).map((as) => relative(REPO, join(caseDir, as))),
      task: continuityTask(staged),
    });
    for (let d = 1; d <= draws; d += 1) writeFileSync(join(runDir, "prompts", `${caseId}-d${d}.md`), `${prompt}\n`);
    entries.push({ case: caseId, fixture: f.name, kind: f.kind, project: relative(REPO, f.project), inputs: files, diff_says: diffSays(diff) });
  }

  if (leaks.length) {
    process.stderr.write("\n  prepare ABORTED — the answer is visible to the critic:\n\n");
    for (const l of leaks) process.stderr.write(`    ${l}\n`);
    process.stderr.write("\n  Fix the fixture, not this check.\n\n");
    process.exit(1);
  }

  const manifest = {
    critic: "continuity",
    run_id: basename(runDir),
    prepared: new Date().toISOString().slice(0, 10),
    draws,
    agent_prompt: AGENT,
    agent_sha256: sha(agentBody),
    echo_rule: ECHO_RULE.description,
    cases: entries,
  };
  writeFileSync(join(runDir, "MANIFEST.json"), `${JSON.stringify(manifest, null, 2)}\n`);
  writeFileSync(join(runDir, "prompts", "DISPATCH.md"), dispatchDoc(manifest, runDir));
  process.stdout.write(`\n  ${relative(REPO, runDir)} — ${entries.length} case(s) × ${draws} draw(s) = ${entries.length * draws} prompt(s)\n\n`);
  process.stdout.write(`    critic prompt: ${AGENT} (sha256 ${manifest.agent_sha256.slice(0, 12)})\n`);
  process.stdout.write(`    prompts:       ${relative(REPO, join(runDir, "prompts"))}/case-NN-d{1..${draws}}.md\n`);
  process.stdout.write(`    inputs staged: diff.json (and bible.json where one exists); no project files, no fixture names\n`);
  if (draws === 1) process.stdout.write(`\n    NOTE: --draws 1 — a single-draw run; the tally labels it so.\n`);
  process.stdout.write(`\n  Next: dispatch one clean-context critic per prompt — see ${relative(REPO, join(runDir, "prompts", "DISPATCH.md"))}\n\n`);
  return runDir;
}

/** Every string the critic could quote from a diff. */
function proseOf(diff) {
  const out = [];
  const loc = (l) => { if (!l) return; for (const k of ["sentence", "text", "before", "after", "definition", "value", "notes"]) if (typeof l[k] === "string") out.push(l[k]); };
  for (const c of [...(diff.redefined ?? []), ...(diff.attribute_drift ?? []), ...(diff.date_drift ?? []), ...(diff.bible_conflicts ?? [])]) { loc(c.a); loc(c.b); if (typeof c.bible === "string") out.push(c.bible); }
  for (const r of diff.repeated ?? []) for (const l of r.locations) loc(l);
  return out.join("\n");
}

function dispatchDoc(manifest, runDir) {
  const prompts = relative(REPO, join(runDir, "prompts"));
  return [
    `# Dispatch — ${manifest.run_id}`,
    "",
    `${manifest.cases.length} case(s) × ${manifest.draws} draw(s). One clean-context critic per prompt file;`,
    "the critic's system prompt is `prompts/agent-prompt.md` and its user message is the prompt file.",
    "Save each transcript verbatim as `raw/<fixture>-d<K>.md` (the fixture name is in MANIFEST.json,",
    "which the critic never sees), then run `collect`.",
    "",
    ...manifest.cases.flatMap((c) => Array.from({ length: manifest.draws }, (_, i) => `- ${prompts}/${c.case}-d${i + 1}.md → raw/${c.fixture}-d${i + 1}.md`)),
    "",
    "No run has been dispatched by this repository's tooling; dispatch is the session's act.",
    "",
  ].join("\n");
}

// ---------------------------------------------------------------------------
// wrapper grammar (identical to prose-review's) and collect / check
// ---------------------------------------------------------------------------

const HEAD = /^#\s+(Negative|Positive)\s+\(([^)]+)\)\s+—\s+(\S+)\s+·\s+(.+)$/;
const RESULT = /^RESULT:\s*([A-Z][A-Z-]*)\s*\|\s*(.+)$/;

export function deriveVerdict(body, vocabulary = SPEC.vocabulary) {
  const lines = body.split("\n");
  for (let i = lines.length - 1; i >= 0; i--) {
    const bare = lines[i].replace(/\*/g, "").replace(/\.$/, "").trim();
    const m = bare.match(/^(?:verdict\s*:\s*)?(.+)$/i);
    if (m && vocabulary.includes(m[1].toUpperCase())) return m[1].toUpperCase();
  }
  return null;
}

export const deriveFindings = (body) => (body.match(SPEC.finding) ?? []).length;

export function parseWrapped(text, file) {
  const nl = text.indexOf("\n");
  const head = text.slice(0, nl).match(HEAD);
  if (!head) return { error: `${file}: first line is not a harness heading` };
  const [, kindWord, phrase, short, tail] = head;
  const verdict = SPEC.vocabulary.find((v) => tail.startsWith(v));
  if (!verdict) return { error: `${file}: heading names no known verdict (${JSON.stringify(tail)})` };
  const annotation = tail.slice(verdict.length);
  let rest = text.slice(nl + 1).replace(/^\n/, "");
  let note = "";
  const upTo = rest.split("\n");
  const sep = upTo.findIndex((l) => l.trim() === "---");
  const firstHeading = upTo.findIndex((l) => /^#{1,6}\s/.test(l));
  if (sep !== -1 && (firstHeading === -1 || sep < firstHeading)) {
    note = upTo.slice(0, sep).join("\n").trim();
    rest = upTo.slice(sep + 1).join("\n").replace(/^\n+/, "");
  }
  const lines = rest.split("\n");
  const ri = lines.map((l) => RESULT.test(l)).lastIndexOf(true);
  if (ri === -1) return { error: `${file}: no RESULT line` };
  const fields = {};
  for (const part of lines[ri].match(RESULT)[2].split("|")) {
    const m = part.trim().match(/^([a-z_]+)=(\d+)$/);
    if (m) fields[m[1]] = Number(m[2]);
  }
  const body = lines.slice(0, ri).join("\n").replace(/\s+$/, "");
  return { kind: kindWord.toLowerCase(), phrase, short, verdict, annotation, note, body, fields, resultVerdict: lines[ri].match(RESULT)[1] };
}

export function emitWrapped({ kind, phrase, short, verdict, annotation = "", note = "", body, findings, counts }) {
  const head = `# ${kind[0].toUpperCase()}${kind.slice(1)} (${phrase}) — ${short} · ${verdict}${annotation}`;
  const result = [`RESULT: ${verdict}`, `findings=${findings}`, ...SPEC.contract.map((k) => `${k}=${counts[k]}`)].join(" | ");
  return `${head}\n\n${note ? `${note}\n\n---\n\n` : ""}${body.replace(/\s+$/, "")}\n\n${result}\n`;
}

function quoteFindings(body) {
  const out = [];
  const lines = body.split("\n");
  for (let i = 0; i < lines.length; i++) {
    if (!/^\s*[-*]?\s*\*\*CLASS\*\*/.test(lines[i])) continue;
    out.push(lines.slice(i, i + 5).map((l) => l.trim()).filter(Boolean).join(" / ").slice(0, 400));
  }
  return out;
}

export function collect(runDir) {
  const rawDir = join(runDir, "raw");
  if (!existsSync(rawDir)) die(`collect: ${relative(REPO, rawDir)} does not exist — nothing to collect`);
  const files = readdirSync(rawDir).filter((f) => f.endsWith(".md")).sort();
  if (!files.length) die(`collect: no transcripts in ${relative(REPO, rawDir)}`);
  const manifest = existsSync(join(runDir, "MANIFEST.json")) ? JSON.parse(readFileSync(join(runDir, "MANIFEST.json"), "utf8")) : null;
  if (manifest && sha(stripFrontmatter(readFileSync(join(REPO, manifest.agent_prompt), "utf8"))) !== manifest.agent_sha256) {
    process.stdout.write(`\n  NOTE: ${manifest.agent_prompt} has changed since this run was prepared.\n  These transcripts are evidence about the prompt as of ${manifest.prepared}, not about the current one.\n`);
  }
  const parsed = [];
  for (const f of files) {
    const name = f.replace(/\.md$/, "");
    const drawMatch = name.match(/^(.+)-d(\d+)$/);
    const fixture = drawMatch ? drawMatch[1] : name;
    const body = readFileSync(join(rawDir, f), "utf8").replace(/\s+$/, "");
    const verdict = deriveVerdict(body);
    if (!verdict) die(`collect: ${f} has no closing verdict line — the critic did not finish its contract`);
    const kind = fixture.startsWith("p-") ? "positive" : "negative";
    const declared = manifest?.cases.find((c) => c.fixture === fixture)?.kind;
    if (declared && declared !== kind) die(`collect: ${f} is a ${declared} fixture but its filename says ${kind}`);
    parsed.push({ name, fixture, verdict, body, kind, findings: deriveFindings(body) });
  }
  const reviewPath = join(runDir, "review.json");
  const review = existsSync(reviewPath) ? JSON.parse(readFileSync(reviewPath, "utf8")) : {};
  const pending = parsed.filter((p) => SPEC.contract.some((k) => typeof review[p.name]?.[k] !== "number"));
  if (pending.length) {
    for (const p of parsed) {
      const prior = review[p.name] ?? {};
      review[p.name] = { note: prior.note ?? "", annotation: prior.annotation ?? "", ...Object.fromEntries(SPEC.contract.map((k) => [k, prior[k] ?? null])), _verdict: p.verdict, _findings_to_review: quoteFindings(p.body) };
    }
    review._how = [
      "One entry per transcript. `note` and `annotation` are the operator's; both may stay empty.",
      "`uncited` counts findings that do not quote BOTH locations; `third_location` counts findings",
      "that cite a file:line the staged diff did not supply. Both are counts of what the quoted findings",
      "DO, read against inputs/<case>/diff.json — not of what the critic says it did. collect refuses",
      "to run until they are numbers.",
    ];
    writeFileSync(reviewPath, `${JSON.stringify(review, null, 2)}\n`);
    process.stdout.write(`\n  ${pending.length} of ${parsed.length} transcript(s) have no contract counts yet.\n\n    Wrote ${relative(REPO, reviewPath)} with every finding quoted for review.\n    Fill the nulls, then run collect again.\n\n`);
    process.exit(1);
  }
  for (const p of parsed) {
    const r = review[p.name];
    writeFileSync(join(runDir, `${p.name}.md`), emitWrapped({ kind: p.kind, phrase: SPEC.phrase[p.kind], short: p.name.replace(/^[np]-/, ""), verdict: p.verdict, annotation: r.annotation ?? "", note: r.note ?? "", body: p.body, findings: p.findings, counts: r }));
  }
  process.stdout.write(`\n  ${parsed.length} transcript(s) wrapped in ${relative(REPO, runDir)}\n`);
  tally(runDir);
}

/** The count, kept apart from the wrapping so it reads only published transcripts. */
export function tally(runDir) {
  const manifest = existsSync(join(runDir, "MANIFEST.json")) ? JSON.parse(readFileSync(join(runDir, "MANIFEST.json"), "utf8")) : null;
  const files = readdirSync(runDir).filter((f) => f.endsWith(".md") && f.toLowerCase() !== "readme.md").sort();
  const runs = files.map((f) => ({ file: f, ...parseWrapped(readFileSync(join(runDir, f), "utf8"), f) })).filter((p) => !p.error);
  const byFixture = new Map();
  for (const r of runs) {
    const fixture = r.file.replace(/\.md$/, "").replace(/-d\d+$/, "");
    if (!byFixture.has(fixture)) byFixture.set(fixture, []);
    byFixture.get(fixture).push(r);
  }
  const single = (manifest?.draws ?? 1) === 1;
  const line = (s) => process.stdout.write(`${s}\n`);
  line("");
  line(`  ${relative(REPO, runDir)} — ${runs.length} transcript(s), ${byFixture.size} fixture(s)${single ? " · single draw (unreliable on borderlines)" : ""}`);
  line("");
  let critic = { negative: [0, 0], positive: [0, 0] }, parrot = { negative: [0, 0], positive: [0, 0] };
  const contract = Object.fromEntries(SPEC.contract.map((k) => [k, 0]));
  for (const [fixture, draws] of byFixture) {
    const kind = draws[0].kind;
    const want = kind === "positive" ? "REVISE" : "CLEAN";
    const agree = draws.filter((d) => d.verdict === want).length;
    critic[kind][0] += agree; critic[kind][1] += draws.length;
    for (const d of draws) for (const k of SPEC.contract) contract[k] += d.fields[k] ?? 0;
    const echo = manifest?.cases.find((c) => c.fixture === fixture)?.diff_says ?? null;
    if (echo) { parrot[kind][0] += (echo === want ? 1 : 0) * draws.length; parrot[kind][1] += draws.length; }
    line(`    ${fixture.padEnd(24)} ${kind.padEnd(8)} critic ${agree}/${draws.length} ${want}${echo ? `   parrot says ${echo}` : ""}`);
  }
  line("");
  line(`    critic  — negatives quiet ${critic.negative[0]}/${critic.negative[1]}, positives caught ${critic.positive[0]}/${critic.positive[1]}`);
  if (manifest) line(`    parrot  — negatives quiet ${parrot.negative[0]}/${parrot.negative[1]}, positives caught ${parrot.positive[0]}/${parrot.positive[1]}   (${manifest.echo_rule})`);
  line(`    contract — ${SPEC.contract.map((k) => `${k}=${contract[k]}`).join(", ")}   (operator counts, carried through, not derived)`);
  line("");
  line("    Single draws are observations, not rates. A negative that reads REVISE is the finding to read first.");
  line("");
}

export function check(runDir) {
  const files = readdirSync(runDir).filter((f) => f.endsWith(".md") && f.toLowerCase() !== "readme.md").sort();
  if (!files.length) die(`check: no transcripts in ${relative(REPO, runDir)}`);
  const problems = [], deviations = [];
  let exact = 0;
  for (const f of files) {
    const original = readFileSync(join(runDir, f), "utf8");
    const p = parseWrapped(original, f);
    if (p.error) { problems.push(p.error); continue; }
    const name = f.replace(/\.md$/, "");
    const kindFromName = name.startsWith("p-") ? "positive" : "negative";
    if (p.kind !== kindFromName) problems.push(`${f}: heading says ${p.kind}, filename says ${kindFromName}`);
    if (p.phrase !== SPEC.phrase[p.kind]) problems.push(`${f}: heading phrase "${p.phrase}" is not this critic's "${SPEC.phrase[p.kind]}"`);
    if (p.short !== name.replace(/^[np]-/, "")) problems.push(`${f}: heading names ${p.short}, file names ${name}`);
    if (p.resultVerdict !== p.verdict) problems.push(`${f}: RESULT says ${p.resultVerdict}, heading says ${p.verdict}`);
    const fromBody = deriveVerdict(p.body);
    if (fromBody !== p.verdict) problems.push(`${f}: transcript ends in ${fromBody}, wrapper says ${p.verdict}`);
    const findings = deriveFindings(p.body);
    if (findings !== p.fields.findings) problems.push(`${f}: RESULT says findings=${p.fields.findings}, transcript contains ${findings}`);
    const rebuilt = emitWrapped({ ...p, findings, counts: p.fields });
    if (rebuilt === original) exact += 1; else deviations.push(`${f}: differs from the emitter's output`);
  }
  process.stdout.write(`\n  ${relative(REPO, runDir)} — ${files.length} transcripts\n\n    reproduced byte-for-byte from the transcript body: ${exact} of ${files.length}\n`);
  for (const d of deviations) process.stdout.write(`    hand-wrapping deviation — ${d}\n`);
  for (const p of problems) process.stdout.write(`    DEFECT — ${p}\n`);
  process.stdout.write("\n");
  return problems.length + deviations.length;
}

function die(msg) { process.stderr.write(`continuity-harness: ${msg}\n`); process.exit(2); }

const USAGE = `continuity-harness: usage:
  node tests/continuity-harness.mjs prepare <run-id> [--draws N] [--only a,b] [--fixtures-dir <dir>]
  node tests/continuity-harness.mjs collect <run-dir>
  node tests/continuity-harness.mjs check   <run-dir>
`;

async function main(argv) {
  const flags = {}, positional = [];
  for (let i = 0; i < argv.length; i++) {
    if (!argv[i].startsWith("--")) { positional.push(argv[i]); continue; }
    const [k, inline] = argv[i].slice(2).split("=");
    flags[k] = inline ?? argv[++i];
  }
  const draws = Number.parseInt(flags.draws ?? "3", 10);
  if (!Number.isInteger(draws) || draws < 1) die(`--draws must be a positive integer, got ${JSON.stringify(flags.draws)}`);
  const opts = { only: flags.only?.split(","), fixturesDir: flags["fixtures-dir"] ? resolve(flags["fixtures-dir"]) : undefined, draws };
  const [cmd, a] = positional;
  const dir = (d) => { if (!d) die(USAGE); const full = existsSync(d) ? resolve(d) : join(TESTS, d); if (!existsSync(full)) die(`no such run directory: ${d}`); return full; };
  if (cmd === "prepare") { if (!a) die(USAGE); await prepare(a, opts); }
  else if (cmd === "collect") collect(dir(a));
  else if (cmd === "check") process.exit(check(dir(a)) ? 1 : 0);
  else die(USAGE);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main(process.argv.slice(2));
