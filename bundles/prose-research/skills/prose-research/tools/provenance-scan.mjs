#!/usr/bin/env node
/**
 * provenance-scan — for every quote atom `fidelity-scan` would extract from a
 * revision (and its original), whether the quote still matches the source the
 * ledger says it came from. Presence only, the way fidelity-scan is
 * authoritative on presence; the fidelity critic reads this and argues only
 * about consequence.
 *
 *   node provenance-scan.mjs --revision R.md [--original O.md] --ledger L.json --dossier D.json --sources-dir DIR [--json]
 *
 * The quote rule is fidelity-scan's, reproduced: three or more words inside
 * straight or paired curly quotes, a quote may cross a line break but not a
 * blank line, whitespace normalised. prose-review's tests pin the two rules
 * to each other on shared text; shipped code imports nothing across bundles.
 *
 *   exact       the atom appears verbatim in its ledger source's text
 *   drifted     the atom's ledger entry exists but the source does not say this
 *   absent      the ledger entry's source text is not cached, so presence
 *               cannot be determined
 *   unledgered  no ledger entry quotes this atom — its words share less than
 *               60% with every ledger quote — so provenance is unknown; not a
 *               finding about fidelity
 */
import { existsSync, readFileSync, realpathSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { normalise, validateDossier, validateLedger } from "./lib/research-schema.mjs";

export const PROVENANCE_SCHEMA = "provenance-scan/1";

const NO_BLANK_LINE = String.raw`\n(?![ \t]*\n)`;
const STRAIGHT_QUOTE = new RegExp(String.raw`"((?:[^"\n]|${NO_BLANK_LINE}){6,}?)"`, "g");
const CURLY_QUOTE = new RegExp(String.raw`“((?:[^”\n]|${NO_BLANK_LINE}){6,}?)”|‘((?:[^’\n]|${NO_BLANK_LINE}){6,}?)’`, "g");

export function stripFrontmatter(text) {
  if (!text.startsWith("---\n")) return text;
  const end = text.indexOf("\n---\n", 3);
  return end === -1 ? text : text.slice(end + 5);
}

/** Quote atoms, whitespace-normalised, three words or more, in order of appearance, de-duplicated. */
export function quoteAtoms(text) {
  const body = stripFrontmatter(text);
  const found = [];
  const record = (inner) => { const q = normalise(inner ?? ""); if (q.split(" ").length >= 3 && !found.includes(q)) found.push(q); };
  for (const m of body.matchAll(STRAIGHT_QUOTE)) record(m[1]);
  for (const m of body.matchAll(CURLY_QUOTE)) record(m[1] ?? m[2]);
  return found;
}

export const MATCH_SHARE = 0.6;
const bag = (s) => s.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ").split(/\s+/).filter(Boolean);
export function bestEntry(atom, claims) {
  const a = bag(atom);
  let best = null, bestShare = 0;
  for (const k of claims) {
    const q = new Set(bag(k.quote));
    const share = a.length ? a.filter((w) => q.has(w)).length / a.length : 0;
    if (share > bestShare) { best = k; bestShare = share; }
  }
  return bestShare >= MATCH_SHARE ? best : null;
}

const inText = (text, quote) => new RegExp(quote.split(" ").map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("\\s+")).test(text);

export function provenanceScan({ revision, original = null, ledger, dossier, sourcesDir }) {
  const le = validateLedger(ledger); if (le.length) throw new TypeError(`ledger: ${le.join("; ")}`);
  const de = validateDossier(dossier); if (de.length) throw new TypeError(`dossier: ${de.join("; ")}`);
  const rev = quoteAtoms(revision), orig = original === null ? [] : quoteAtoms(original);
  const atoms = [...new Set([...rev, ...orig])];
  const texts = new Map();
  const sourceText = (id) => { if (!texts.has(id)) { const s = dossier.sources.find((x) => x.id === id); const p = s ? join(sourcesDir, s.text_file) : null; texts.set(id, p && existsSync(p) ? readFileSync(p, "utf8") : null); } return texts.get(id); };
  const quotes = atoms.map((atom) => {
    const where = rev.includes(atom) && orig.includes(atom) ? "both" : rev.includes(atom) ? "revision" : "original";
    // The ledger entry that quotes this atom. Containment is not enough: the drift this scan
    // exists to expose is one changed word, after which neither string contains the other.
    // So the entry is the one whose quote shares the most words with the atom, at 60% or more.
    const entry = bestEntry(atom, ledger.claims);
    if (!entry) return { atom, in: where, ledger: null, source: null, status: "unledgered", source_span: null };
    const text = sourceText(entry.source);
    if (text === null) return { atom, in: where, ledger: entry.id, source: entry.source, status: "absent", source_span: null, why: "the source text is not cached; presence cannot be determined" };
    // Punctuation the writer closed the quote with ("…did." against a source's "…did,") is not drift.
    if (inText(text, atom.replace(/[.,;:!?]+$/, ""))) return { atom, in: where, ledger: entry.id, source: entry.source, status: "exact", source_span: normalise(entry.quote) };
    return { atom, in: where, ledger: entry.id, source: entry.source, status: "drifted", source_span: normalise(entry.quote), why: "the source does not contain this wording; the ledger's quote is shown" };
  });
  return {
    schema: PROVENANCE_SCHEMA,
    quotes,
    counts: Object.fromEntries(["exact", "drifted", "absent", "unledgered"].map((s) => [s, quotes.filter((q) => q.status === s).length])),
    limits: [
      "Presence only: an atom is exact when its words appear in the cached source text, drifted when its ledger source does not contain them, absent when that source is not cached, unledgered when no ledger quote shares 60% of its words. Truth is not assessed.",
      "The quote rule is fidelity-scan's: three or more words inside straight or paired curly quotes, never across a blank line.",
    ],
  };
}

export function renderProvenance(r) {
  const out = [`provenance-scan — ${r.counts.exact} exact, ${r.counts.drifted} drifted, ${r.counts.absent} absent, ${r.counts.unledgered} unledgered`];
  for (const q of r.quotes) out.push(`  ${q.status.padEnd(10)} [${q.in}] "${q.atom}"${q.ledger ? ` — ${q.ledger} (${q.source})` : ""}${q.status === "drifted" && q.source_span ? `\n             source: "${q.source_span}"` : ""}`);
  return out.join("\n");
}

const USAGE = "Usage: node provenance-scan.mjs --revision R.md [--original O.md] --ledger L.json --dossier D.json --sources-dir DIR [--json]";

if (process.argv[1] && existsSync(process.argv[1]) && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2); const flags = new Map();
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--json") flags.set("--json", true);
    else if (["--revision", "--original", "--ledger", "--dossier", "--sources-dir"].includes(args[i]) && args[i + 1] !== undefined && !args[i + 1].startsWith("--")) flags.set(args[i], resolve(args[++i]));
    else { process.stderr.write(`${USAGE}\n`); process.exit(2); }
  }
  if (!["--revision", "--ledger", "--dossier", "--sources-dir"].every((f) => flags.has(f))) { process.stderr.write(`${USAGE}\n`); process.exit(2); }
  try {
    const read = (f) => JSON.parse(readFileSync(f, "utf8"));
    const r = provenanceScan({ revision: readFileSync(flags.get("--revision"), "utf8"), original: flags.has("--original") ? readFileSync(flags.get("--original"), "utf8") : null, ledger: read(flags.get("--ledger")), dossier: read(flags.get("--dossier")), sourcesDir: flags.get("--sources-dir") });
    process.stdout.write(flags.get("--json") ? `${JSON.stringify(r, null, 2)}\n` : `${renderProvenance(r)}\n`);
  } catch (e) { process.stderr.write(`provenance-scan: ${e.message}\n`); process.exit(1); }
}
