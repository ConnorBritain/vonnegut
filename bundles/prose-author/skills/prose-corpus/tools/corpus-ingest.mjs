#!/usr/bin/env node
/**
 * corpus-ingest — write the SELECTED candidates into a human corpus, with the
 * provenance frontmatter prose-tell-scan reads, and report progress.
 *
 *   node corpus-ingest.mjs --manifest M.json --selection S.json --samples-dir DIR [--force] [--json]
 *   node corpus-ingest.mjs progress --samples-dir DIR [--json]
 *
 * The selection (`corpus-selection/1`) is the writer's: which ids, which
 * register, an optional group, and `attest: true` — literally true, set only
 * after the writer said, in their own words, that they wrote these unaided.
 * Anything else is refused and nothing is written. Candidates under 200 words
 * are refused (tell-scan's floor). An existing file is refused unless --force.
 * Exit 0 written or nothing to do; 1 an error; 2 usage; 3 refused selection.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, realpathSync, statSync, writeFileSync } from "node:fs";
import { basename, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { validateManifest } from "./lib/manifest.mjs";
import { CALIBRATION_FLOOR, MIN_WORDS, PROFILE_FLOOR, readProvenance, renderFrontmatter, slug, words } from "./lib/provenance.mjs";
import { REGISTERS } from "./lib/register-suggest.mjs";

export const SELECTION_SCHEMA = "corpus-selection/1";
const TOKEN = /^[a-z0-9][a-z0-9_-]{0,63}$/;

export class IngestRefusal extends Error { constructor(message, code = 3) { super(message); this.code = code; } }

export function validateSelection(s) {
  const errors = [];
  if (s?.schema !== SELECTION_SCHEMA) errors.push(`schema must be ${SELECTION_SCHEMA}`);
  if (!Array.isArray(s?.ids) || !s.ids.length) errors.push("ids must be a non-empty array — an empty selection ingests nothing");
  else if (s.ids.some((id) => typeof id !== "string")) errors.push("ids must be strings");
  if (!REGISTERS.includes(s?.register)) errors.push(`register must be one of ${REGISTERS.join(", ")}`);
  if (s?.group !== undefined && s.group !== null && !TOKEN.test(s.group)) errors.push("group must be a lower-case token or null");
  if (s?.form !== undefined && s.form !== null && !TOKEN.test(s.form)) errors.push("form must be a lower-case token or null");
  if (s?.attest !== true) errors.push("attest must be literally true — the writer's own confirmation that they wrote these unaided, given for this batch");
  if (typeof s?.source !== "string" || !s.source.trim()) errors.push("source must name where these came from, in the writer's words");
  return errors;
}

export function ingest({ manifest, selection, samplesDir, force = false, now = null }) {
  const me = validateManifest(manifest); if (me.length) throw new IngestRefusal(`manifest: ${me.join("; ")}`, 1);
  const se = validateSelection(selection); if (se.length) throw new IngestRefusal(`selection refused: ${se.join("; ")}`);
  const target = join(samplesDir, "corpus", "human", ...(selection.group ? [selection.group] : []));
  const byId = new Map(manifest.candidates.map((c) => [c.id, c]));
  const written = [], refused = [];
  const unknown = selection.ids.filter((id) => !byId.has(id));
  if (unknown.length) throw new IngestRefusal(`selection names ids not in the manifest: ${unknown.join(", ")}`);
  const importedBy = `prose-corpus/${manifest.importer}`;
  for (const id of selection.ids) {
    const c = byId.get(id);
    const count = words(c.text).length;
    if (count < MIN_WORDS) { refused.push({ id, why: `${count} words, needs ${MIN_WORDS}` }); continue; }
    const date = c.date ?? now;
    if (!date) { refused.push({ id, why: "no date in the export; pass one in the selection as dates[id]" }); continue; }
    const name = `${slug(c.title, id)}.md`;
    const out = join(target, name);
    if (existsSync(out) && !force) { refused.push({ id, why: `${name} already in this corpus (use --force)` }); continue; }
    const frontmatter = renderFrontmatter({ source: selection.source.trim(), date, ingested_from: c.path, imported_by: importedBy, profile: selection.register, form: selection.form ?? c.suggested?.form ?? null });
    mkdirSync(target, { recursive: true });
    writeFileSync(out, `${frontmatter}${c.text.trim()}\n`);
    written.push({ id, file: out, words: count, date });
  }
  return { status: written.length ? "written" : "nothing-written", target, written, refused, progress: progress(samplesDir) };
}

/** Progress toward both floors, re-derived from the files on disk, never from what was just written. */
export function progress(samplesDir) {
  const human = join(samplesDir, "corpus", "human");
  const files = [];
  if (existsSync(human)) {
    const walk = (dir, group) => { for (const e of readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      if (e.isDirectory()) { if (group === null && !e.name.startsWith(".")) walk(join(dir, e.name), e.name); continue; }
      if ([".md", ".markdown", ".txt", ".mdx"].includes(extname(e.name).toLowerCase())) files.push({ path: join(dir, e.name), group });
    } };
    walk(human, null);
  }
  const groups = new Map();
  let samples = 0, excluded = 0;
  for (const f of files) {
    const p = readProvenance(readFileSync(f.path, "utf8"));
    if (!p.ok) { excluded += 1; continue; }
    const count = words(p.body).length;
    if (count < MIN_WORDS) { excluded += 1; continue; }
    samples += 1;
    const key = `${p.profile ?? "unspecified"}/${p.form ?? "unspecified"}/${f.group ?? ""}`;
    if (!groups.has(key)) groups.set(key, { register: p.profile ?? null, form: p.form ?? null, group: f.group, pieces: 0, words: 0 });
    const g = groups.get(key); g.pieces += 1; g.words += count;
  }
  const rows = [...groups.values()].map((g) => ({ ...g, floor_pieces: PROFILE_FLOOR.pieces, floor_words: PROFILE_FLOOR.words, supported: g.pieces >= PROFILE_FLOOR.pieces && g.words >= PROFILE_FLOOR.words }))
    .sort((a, b) => `${a.register}/${a.form}/${a.group}`.localeCompare(`${b.register}/${b.form}/${b.group}`));
  const status = samples >= CALIBRATION_FLOOR.confident ? "confident" : samples >= CALIBRATION_FLOOR.thin ? "thin" : "below-floor";
  return { samples_dir: samplesDir, groups: rows, calibration: { human_samples: samples, excluded, ...CALIBRATION_FLOOR, status } };
}

export function renderResult(r) {
  const out = [];
  if (r.written) {
    out.push(`${r.status} → ${r.target}`);
    for (const w of r.written) out.push(`  added    ${basename(w.file)}  (${w.words} words, ${w.date})`);
    for (const x of r.refused) out.push(`  refused  ${x.id} — ${x.why}`);
  }
  const p = r.progress ?? r;
  out.push(`progress — ${p.samples_dir}`);
  for (const g of p.groups) out.push(`  ${g.register ?? "?"}/${g.form ?? "?"}${g.group ? ` [${g.group}]` : ""}: ${g.pieces} piece(s), ${g.words} words — profile floor ${g.floor_pieces} / ${g.floor_words}: ${g.supported ? "supported" : "limited evidence"}`);
  if (!p.groups.length) out.push("  no attested samples yet");
  out.push(`  calibration: ${p.calibration.human_samples} attested sample(s) (${p.calibration.excluded} excluded) — thin at ${p.calibration.thin}, confident at ${p.calibration.confident}: ${p.calibration.status}`);
  if (r.written?.length) out.push("  Corpus additions are worth their own commit. A sample that arrives as a side effect of some other session is exactly the one nobody checks.");
  return out.join("\n");
}

export function main(argv, { cwd = process.cwd() } = {}) {
  const flags = new Map(); const positional = [];
  const valued = ["--manifest", "--selection", "--samples-dir"];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--json" || a === "--force") flags.set(a, true);
    else if (valued.includes(a)) { if (argv[i + 1] === undefined || argv[i + 1].startsWith("--")) throw new IngestRefusal("usage", 2); flags.set(a, resolve(cwd, argv[++i])); }
    else if (a.startsWith("--")) throw new IngestRefusal("usage", 2);
    else positional.push(a);
  }
  const samplesDir = flags.get("--samples-dir");
  if (!samplesDir) throw new IngestRefusal("usage", 2);
  if (positional[0] === "progress") return progress(samplesDir);
  if (positional.length || !flags.get("--manifest") || !flags.get("--selection")) throw new IngestRefusal("usage", 2);
  if (!existsSync(samplesDir) || !statSync(samplesDir).isDirectory()) throw new IngestRefusal(`samples dir does not exist: ${samplesDir} (the identity's registered samples_dir; create it as part of setup, not here)`, 1);
  const manifest = JSON.parse(readFileSync(flags.get("--manifest"), "utf8"));
  const selection = JSON.parse(readFileSync(flags.get("--selection"), "utf8"));
  return ingest({ manifest, selection, samplesDir, force: flags.get("--force") === true });
}

const USAGE = "Usage: node corpus-ingest.mjs --manifest M --selection S --samples-dir DIR [--force] [--json]\n       node corpus-ingest.mjs progress --samples-dir DIR [--json]";

if (process.argv[1] && existsSync(process.argv[1]) && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const r = main(process.argv.slice(2));
    process.stdout.write(process.argv.includes("--json") ? `${JSON.stringify(r, null, 2)}\n` : `${renderResult(r)}\n`);
  } catch (e) {
    const code = e.code ?? 1;
    if (code === 2) process.stderr.write(`${USAGE}\n`);
    else process.stderr.write(`corpus-ingest: ${e.message}\n`);
    process.exit(code);
  }
}
