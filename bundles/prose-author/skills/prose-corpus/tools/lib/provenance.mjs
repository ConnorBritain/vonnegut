/**
 * provenance — the corpus file contract, reproduced rather than imported.
 *
 * `prose-tell-scan`'s `ingest.mjs` writes the frontmatter and its `calibrate.mjs`
 * `readProvenance` reads it (PROFILES.md "Provenance"). This module writes the
 * same bytes plus two fields the reader ignores (`profile`, which tell-scan's
 * profile resolver does read, and `imported_by`). The parity test in
 * `tests/suite-corpus-ingestion.mjs` runs tell-scan's own reader over what this
 * writes, so the port cannot drift silently. Shipped code never imports across
 * a bundle boundary.
 */
export const MIN_WORDS = 200;             // tell-scan ingest.mjs MIN_WORDS, and calibrate's MIN_SAMPLE_WORDS
export const PROFILE_FLOOR = { pieces: 5, words: 1000 };   // prose-author profile-v3 PROFILE_FLOOR
export const CALIBRATION_FLOOR = { thin: 5, confident: 10 }; // tell-scan evaluate CORPUS_THIN / CORPUS_MINIMUM

/** tell-scan's word rule (lib/text.mjs `words`), reproduced. */
export const words = (text) => text.match(/\b[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*\b/gu) || [];

export function stripFrontmatter(text) {
  const m = text.match(/^---\n[\s\S]*?\n---\n?/);
  return m ? text.slice(m[0].length) : text;
}

const yamlString = (s) => (/^[\w./ -]*$/.test(s) && !/^\s|\s$/.test(s) && s !== "" ? s : JSON.stringify(s));

export function renderFrontmatter({ source, date, ingested_from, imported_by, profile, form }) {
  if (!source || !date || !ingested_from || !imported_by) throw new TypeError("frontmatter needs source, date, ingested_from and imported_by");
  return `---\n`
    + `source: ${yamlString(source)}\n`
    + `date: ${date}\n`
    + `human_authored: true\n`
    + `ingested_from: ${yamlString(ingested_from)}\n`
    + (profile ? `profile: ${profile}\n` : "")
    + (form ? `form: ${form}\n` : "")
    + `imported_by: ${imported_by}\n`
    + `---\n\n`;
}

/** The same strictness as tell-scan's reader: no frontmatter, no attestation, no source or date ⇒ not a sample. */
export function readProvenance(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---(?:\n|$)/);
  if (!m) return { ok: false, reason: "no frontmatter block" };
  const field = (name) => { const hit = m[1].match(new RegExp(`^\\s*${name}\\s*:\\s*(.+?)\\s*$`, "m")); return hit ? hit[1].replace(/^["']|["']$/g, "") : null; };
  const attested = field("human_authored");
  if (attested === null) return { ok: false, reason: "no human_authored field" };
  if (!/^(true|yes)$/i.test(attested)) return { ok: false, reason: `human_authored is "${attested}"` };
  const source = field("source"); if (!source) return { ok: false, reason: "no source field" };
  const date = field("date"); if (!date) return { ok: false, reason: "no date field" };
  return { ok: true, source, date, profile: field("profile"), form: field("form"), imported_by: field("imported_by"), body: text.slice(m[0].length) };
}

/** A file name from a title: ascii, lower, hyphenated, bounded. */
export function slug(title, fallback = "untitled") {
  const s = (title ?? "").normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60).replace(/-+$/, "");
  return s || fallback;
}

/** The ISO date of a Date or a date-ish string, else null. Never today's date: an unknown date is unknown. */
export function isoDate(value) {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
}
