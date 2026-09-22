#!/usr/bin/env node
/**
 * index-diff — candidates for contradiction, from an entity index and optionally
 * the project's bible. Deterministic.
 *
 *   node index-diff.mjs <index.json> [--bible <bible.json>] [--json]
 *
 * Three candidate kinds, each carrying BOTH locations so the critic can cite them:
 *   redefined        the same key defined twice with definitions that barely overlap
 *   attribute_drift  the same key's attribute stated with two different values
 *                    (across the text, or between the bible and the text)
 *   repeated         a passage recurring across files
 * plus bible_conflicts: a bible definition the text's definitions do not resemble.
 *
 * Every entry here is a CANDIDATE. A flashback, a nickname, a lying character or
 * a deliberate redefinition all look like drift to a diff; deciding is the
 * critic's job, in a clean context, and it may cite only what appears here.
 */
import { existsSync, readFileSync, realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { overlap } from "./lib/text-index.mjs";

export const INDEX_DIFF_VERSION = "index-diff/1";
const DEFINITION_OVERLAP = 0.5;

const norm = (v) => v.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ").trim();

export function diffIndex(index, bible = null) {
  if (index?.schema !== "entity-index/1") throw new TypeError("Expected an entity-index/1 document");
  const out = { schema: INDEX_DIFF_VERSION, redefined: [], attribute_drift: [], repeated: [], bible_conflicts: [], limits: [
    `Two definitions are 'different' when their content-word overlap is below ${DEFINITION_OVERLAP}; a paraphrase can pass as the same and a different emphasis as different.`,
    "Attribute values are compared after lower-casing and stripping punctuation; 'grey' and 'gray' are different values.",
    "Every entry is a candidate; a flashback, a nickname or a lie looks the same as drift here.",
  ] };
  for (const t of index.terms) {
    const defs = t.definitions.filter((d) => d.definition);
    for (let i = 0; i < defs.length; i++) for (let j = i + 1; j < defs.length; j++) {
      const sim = overlap(defs[i].definition, defs[j].definition);
      if (sim < DEFINITION_OVERLAP) out.redefined.push({ key: t.key, surface_forms: t.surface_forms, similarity: sim, a: defs[i], b: defs[j] });
    }
    const byAttribute = new Map();
    for (const a of t.attributes) { if (!byAttribute.has(a.attribute)) byAttribute.set(a.attribute, []); byAttribute.get(a.attribute).push(a); }
    for (const [attribute, statements] of byAttribute) {
      for (let i = 0; i < statements.length; i++) for (let j = i + 1; j < statements.length; j++) {
        if (norm(statements[i].value) !== norm(statements[j].value)) out.attribute_drift.push({ key: t.key, surface_forms: t.surface_forms, attribute, a: statements[i], b: statements[j], source: "text" });
      }
    }
  }
  for (const r of index.repeats) out.repeated.push(r);
  // Dates sharing a context word with different values: "flood of 1898" / "flood of 1889".
  const byContext = new Map();
  for (const d of index.dates.filter((d) => d.kind === "date" && d.context)) { if (!byContext.has(d.context)) byContext.set(d.context, []); byContext.get(d.context).push(d); }
  out.date_drift = [];
  for (const [context, ds] of byContext) for (let i = 0; i < ds.length; i++) for (let j = i + 1; j < ds.length; j++) {
    if (ds[i].text !== ds[j].text) out.date_drift.push({ context, a: ds[i], b: ds[j] });
  }
  if (bible) {
    if (bible.schema !== "voice-bible/1") throw new TypeError("Expected a voice-bible/1 document");
    const byKey = new Map(index.terms.map((t) => [t.key, t]));
    for (const e of bible.entries) {
      const t = byKey.get(e.key);
      if (!t) continue;
      if (e.definition) for (const d of t.definitions.filter((d) => d.definition)) {
        const sim = overlap(e.definition, d.definition);
        if (sim < DEFINITION_OVERLAP) out.bible_conflicts.push({ key: e.key, entry: e.id, kind: "definition", similarity: sim, bible: e.definition, text: d });
      }
      for (const [attribute, value] of Object.entries(e.attributes ?? {})) {
        for (const a of t.attributes.filter((a) => a.attribute === attribute)) {
          if (norm(a.value) !== norm(String(value))) out.attribute_drift.push({ key: e.key, surface_forms: t.surface_forms, attribute, a: { bible: e.id, name: e.name, value: String(value), first_seen: e.first_seen ?? null, notes: e.notes ?? "" }, b: a, source: "bible" });
        }
      }
    }
  }
  out.summary = `${out.redefined.length} redefined, ${out.attribute_drift.length} attribute drift, ${out.date_drift.length} date drift, ${out.repeated.length} repeated, ${out.bible_conflicts.length} bible conflicts`;
  return out;
}

export function renderDiff(d) {
  const loc = (x) => x.bible ? `bible ${x.bible}` : `${x.file}:${x.line}`;
  const out = [`index-diff — ${d.summary}`];
  for (const r of d.redefined) out.push(`  redefined  ${r.surface_forms.join("/")}  "${r.a.definition}" [${loc(r.a)}]  vs  "${r.b.definition}" [${loc(r.b)}]`);
  for (const a of d.attribute_drift) out.push(`  drift      ${a.surface_forms.join("/")} ${a.attribute}: ${a.a.value} [${loc(a.a)}]  vs  ${a.b.value} [${loc(a.b)}]`);
  for (const x of d.date_drift) out.push(`  date       ${x.context}: ${x.a.text} [${loc(x.a)}]  vs  ${x.b.text} [${loc(x.b)}]`);
  for (const r of d.repeated) out.push(`  repeated   ${r.kind} ${r.similarity}  ${r.locations.map(loc).join(" ↔ ")}`);
  for (const c of d.bible_conflicts) out.push(`  bible      ${c.key} ${c.kind}: "${c.bible}" [bible ${c.entry}]  vs  "${c.text.definition}" [${loc(c.text)}]`);
  out.push("  Candidates, each with two locations. The continuity critic decides which contradict; it may cite nothing that is not here.");
  return out.join("\n");
}

if (process.argv[1] && existsSync(process.argv[1]) && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const files = args.filter((a, i) => !a.startsWith("--") && args[i - 1] !== "--bible");
  const bibleIndex = args.indexOf("--bible");
  const unknown = args.filter((a) => a.startsWith("--") && !["--json", "--bible"].includes(a));
  if (files.length !== 1 || unknown.length || (bibleIndex >= 0 && !args[bibleIndex + 1])) { console.error("Usage: node index-diff.mjs <index.json> [--bible <bible.json>] [--json]"); process.exit(2); }
  try {
    const index = JSON.parse(readFileSync(files[0], "utf8"));
    const bible = bibleIndex >= 0 ? JSON.parse(readFileSync(args[bibleIndex + 1], "utf8")) : null;
    const d = diffIndex(index, bible);
    process.stdout.write(args.includes("--json") ? `${JSON.stringify(d, null, 2)}\n` : `${renderDiff(d)}\n`);
  } catch (e) { console.error(`index-diff: ${e.message}`); process.exit(1); }
}
