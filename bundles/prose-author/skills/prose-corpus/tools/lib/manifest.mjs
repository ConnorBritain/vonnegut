/**
 * manifest — what every importer emits: `corpus-candidates/1`.
 *
 * An importer reads a folder and proposes. It never writes into a corpus,
 * never decides what a human wrote, and never selects. Each candidate carries
 * the text it would ingest, so `corpus-ingest.mjs` needs no importer and an
 * mbox message — which is not a file — ingests like anything else.
 */
import { existsSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { suggestRegister } from "./register-suggest.mjs";
import { words } from "./provenance.mjs";

export const MANIFEST_SCHEMA = "corpus-candidates/1";

export function candidate({ n, title, date, text, path, importer }) {
  const count = words(text).length;
  return {
    id: `c${String(n).padStart(3, "0")}`,
    title: title ?? null,
    date: date ?? null,
    words: count,
    suggested: suggestRegister({ importer, text, title, words: count }),
    path,
    text,
  };
}

export function manifest({ importer, source_root, candidates, refused, limits = [] }) {
  return {
    schema: MANIFEST_SCHEMA,
    importer,
    source_root,
    candidates,
    refused,
    limits: [
      "Word counts use prose-tell-scan's word rule; dates come from export metadata and are null when absent, never today's.",
      "Register and form are heuristic suggestions with a stated reason; the writer overrides them.",
      "Nothing here says a human wrote a piece. Attestation is the writer's, given per batch at ingest.",
      ...limits,
    ],
  };
}

export function validateManifest(m) {
  const errors = [];
  if (m?.schema !== MANIFEST_SCHEMA) errors.push(`schema must be ${MANIFEST_SCHEMA}`);
  if (!Array.isArray(m?.candidates)) errors.push("candidates must be an array");
  else {
    const ids = new Set();
    m.candidates.forEach((c, i) => {
      if (!/^c\d{3,}$/.test(c?.id ?? "")) errors.push(`candidate ${i}: id must be cNNN`);
      if (ids.has(c?.id)) errors.push(`candidate ${i}: duplicate id ${c.id}`); ids.add(c?.id);
      if (typeof c?.text !== "string") errors.push(`candidate ${c?.id ?? i}: text must be a string`);
      if (!Number.isInteger(c?.words)) errors.push(`candidate ${c?.id ?? i}: words must be an integer`);
    });
  }
  if (!Array.isArray(m?.refused)) errors.push("refused must be an array");
  return errors;
}

/** Shared CLI: `node import-x.mjs <root> [--json] [flags]`. */
export function runImporter({ name, usage, run, argv = process.argv.slice(2), flagsWithValue = [] }) {
  const flags = new Map();
  const positional = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--json") flags.set("--json", true);
    else if (flagsWithValue.includes(a)) { if (argv[i + 1] === undefined || argv[i + 1].startsWith("--")) { process.stderr.write(`${usage}\n`); process.exit(2); } flags.set(a, argv[++i]); }
    else if (a.startsWith("--")) { process.stderr.write(`${usage}\n`); process.exit(2); }
    else positional.push(a);
  }
  if (positional.length !== 1) { process.stderr.write(`${usage}\n`); process.exit(2); }
  const root = resolve(positional[0]);
  if (!existsSync(root)) { process.stderr.write(`${name}: not found: ${root}\n`); process.exit(1); }
  let result;
  try { result = run(root, flags, statSync(root)); }
  catch (e) { process.stderr.write(`${name}: ${e.message}\n`); process.exit(1); }
  if (flags.get("--json")) process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  else process.stdout.write(`${renderManifest(result)}\n`);
}

export function renderManifest(m) {
  const out = [`${m.importer} — ${m.candidates.length} candidate(s), ${m.refused.length} refused, from ${m.source_root}`];
  for (const c of m.candidates) out.push(`  ${c.id}  ${String(c.words).padStart(6)} words  ${c.date ?? "no date   "}  ${c.suggested.register}/${c.suggested.form}  ${c.title ?? "(untitled)"}\n         ${c.suggested.why}`);
  for (const r of m.refused) out.push(`  refused  ${r.path} — ${r.why}`);
  out.push("  Candidates only. Selection, register and attestation are the writer's; run corpus-ingest with a selection file.");
  return out.join("\n");
}
