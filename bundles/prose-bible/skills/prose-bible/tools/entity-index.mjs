#!/usr/bin/env node
/**
 * entity-index — a cross-file index of what a project keeps saying. Deterministic.
 *
 *   node entity-index.mjs <dir | file...> [--json] [--min N]
 *
 * WHAT IT INDEXES, every entry with file, line, offset and the sentence around it:
 *   terms       capitalised runs seen at least --min times (default 2) across the
 *               project, and every defined term ("X is a …", "X, the …",
 *               "called X") however rare; each with its surface forms, its
 *               occurrences, its definitions, and the attributes the text states
 *               ("Mara's eyes were grey", "Teodor had grey eyes")
 *   dates       numbers and dates
 *   repeats     sentences of eight words or more that recur across files, exactly
 *               or near-exactly (content-word overlap ≥ 0.6)
 *
 * WHAT IT DOES NOT DO. It does not decide that two definitions conflict, that an
 * attribute drifted, or that a repeat is a retold anecdote rather than a refrain.
 * `index-diff` raises those as candidates and `prose-continuity-critic` judges
 * them in a clean context. The index is recomputed every run and never stored:
 * a stale index reports a contradiction the writer already fixed.
 */
import { existsSync, readFileSync, readdirSync, realpathSync, statSync } from "node:fs";
import { extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { LIMITS as TEXT_LIMITS, capitalisedRuns, contentWords, definedTerms, lineIndex, numbersAndDates, overlap, runKey, segment } from "./lib/text-index.mjs";

export const ENTITY_INDEX_VERSION = "entity-index/1";
const TEXT_EXT = new Set([".md", ".markdown", ".txt"]);
const REPEAT_MIN_WORDS = 8;
const REPEAT_OVERLAP = 0.6;
const MAX_REPEAT_PAIRS = 250000;

const LIMITS = Object.freeze([
  "A term is a capitalised run seen at least --min times, or a defined term; a single word seen only at sentence starts is not a term; pronouns are never resolved, so 'her eyes were green' attaches to nobody.",
  "Attributes are two surface patterns — <Name>'s <noun> is/was/are/were <value>, and <Name> had <adjective> <noun> — over a fixed list of attribute nouns (eyes, hair, voice, age, name, …).",
  "A date's context is the content word before it ('flood of 1898' → flood); dates sharing a context with different values are candidates.",
  `Repeats are sentences of ${REPEAT_MIN_WORDS}+ words recurring across files, exact or with content-word overlap ≥ ${REPEAT_OVERLAP}, each with the sentence before and after; comparison is capped at ${MAX_REPEAT_PAIRS} pairs.`,
  "Files indexed: .md, .markdown, .txt; dotfiles and node_modules are skipped.",
  ...TEXT_LIMITS,
]);

const NAME = String.raw`\p{Lu}[\p{L}\p{N}'’-]*(?:[ \t]+\p{Lu}[\p{L}\p{N}'’-]*){0,3}`;
const PRONOUNS = new Set(["he", "she", "they", "it", "we", "i", "you", "his", "her", "their", "its", "who", "one", "everyone", "someone", "nobody"]);
export const ATTRIBUTE_NOUNS = new Set(["eye", "eyes", "hair", "skin", "voice", "hand", "hands", "face", "nose", "mouth", "beard", "moustache", "height", "build", "age", "name", "surname", "nickname", "accent", "coat", "dress", "hat", "boots", "car", "house", "horse", "dog", "cat", "wife", "husband", "brother", "sister", "mother", "father", "son", "daughter", "title", "rank", "job", "trade", "home", "birthday", "colour", "color", "scar", "limp", "temper", "handwriting"]);
const ATTRIBUTE_PATTERNS = [
  { re: new RegExp(String.raw`(?<![\p{L}\p{N}_])(${NAME})['’]s[ \t]+([a-z][a-z-]*)[ \t]+(?:is|was|are|were)[ \t]+([^.,;:\n]{1,60})`, "gu"), shape: "possessive" },
  { re: new RegExp(String.raw`(?<![\p{L}\p{N}_])(${NAME})[ \t]+had[ \t]+([a-z][a-z-]*)[ \t]+([a-z][a-z-]*)(?![\p{L}\p{N}])`, "gu"), shape: "had", swap: true },
];

/** Every text file under the arguments, as {file, text}; `file` is relative to the common root. */
export function collectFiles(args) {
  const files = [];
  const roots = args.map((a) => resolve(a));
  const walk = (path) => {
    const s = statSync(path);
    if (s.isDirectory()) {
      for (const entry of readdirSync(path, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
        if (entry.name.startsWith(".") || entry.name === "node_modules") continue;
        walk(join(path, entry.name));
      }
    } else if (TEXT_EXT.has(extname(path).toLowerCase())) files.push(path);
  };
  for (const r of roots) { if (!existsSync(r)) throw new Error(`not found: ${r}`); walk(r); }
  const base = roots.length === 1 && statSync(roots[0]).isDirectory() ? roots[0] : process.cwd();
  return files.map((f) => ({ file: relative(base, f) || f, text: readFileSync(f, "utf8") }));
}

function sentenceAt(seg, offset) {
  for (const p of seg.paragraphs) for (let i = 0; i < p.sentences.length; i++) {
    const s = p.sentences[i], next = p.sentences[i + 1];
    if (offset >= s.offset && (!next || offset < next.offset)) return s.text;
  }
  return null;
}

/** Build the index over {file, text} pairs. */
export function buildIndex(docs, { min = 2 } = {}) {
  const terms = new Map();
  const term = (key) => { if (!terms.has(key)) terms.set(key, { key, surface_forms: new Set(), kind: "name", occurrences: [], definitions: [], attributes: [] }); return terms.get(key); };
  const dates = [];
  const sentences = [];
  for (const { file, text } of docs) {
    const markdown = extname(file).toLowerCase() !== ".txt";
    const seg = segment(text, { markdown });
    const line = lineIndex(text);
    const cite = (offset) => ({ file, line: line(offset), offset, sentence: sentenceAt(seg, offset) });
    for (const r of capitalisedRuns(text, { markdown })) {
      const t = term(r.key); t.surface_forms.add(r.text); t.occurrences.push({ ...cite(r.offset), sentence_initial: r.single && r.sentenceInitial });
    }
    for (const d of definedTerms(text, { markdown })) {
      const t = term(d.key); t.kind = "term"; t.surface_forms.add(d.term);
      t.definitions.push({ ...cite(d.offset), pattern: d.kind, definition: d.definition });
      if (!t.occurrences.some((o) => o.file === file && o.offset === d.offset)) t.occurrences.push(cite(d.offset));
    }
    const masked = text; // attribute patterns run on the raw text; offsets are exact
    for (const { re, shape, swap } of ATTRIBUTE_PATTERNS) {
      for (const m of masked.matchAll(re)) {
        const key = runKey(m[1]);
        const attribute = swap ? m[3] : m[2], value = (swap ? m[2] : m[3]).trim().toLowerCase();
        if (PRONOUNS.has(key) || !ATTRIBUTE_NOUNS.has(attribute)) continue;
        const t = term(key); t.surface_forms.add(m[1]);
        t.attributes.push({ ...cite(m.index), attribute, value, shape });
      }
    }
    for (const n of numbersAndDates(text, { markdown })) {
      const before = contentWords(text.slice(Math.max(0, n.offset - 40), n.offset));
      dates.push({ ...n, ...cite(n.offset), context: before.length ? before[before.length - 1] : null });
    }
    // A repeat carries the sentence before and after each telling: whether the second
    // telling is a refrain or a retelling is decided by what surrounds it, and the critic
    // sees candidates, not files.
    const flat = seg.paragraphs.flatMap((p) => p.sentences);
    flat.forEach((s, i) => {
      const words = contentWords(s.text);
      if (words.length >= REPEAT_MIN_WORDS - 2 && s.text.split(/\s+/).length >= REPEAT_MIN_WORDS) {
        sentences.push({ file, line: s.line, offset: s.offset, text: s.text, before: flat[i - 1]?.text ?? null, after: flat[i + 1]?.text ?? null, key: words.join(" ") });
      }
    });
  }
  // Drop rare names and words seen only at sentence starts ("Perhaps"); keep anything defined or attributed.
  const kept = [...terms.values()].filter((t) => t.definitions.length || t.attributes.length
      || (t.occurrences.length >= min && t.occurrences.some((o) => !o.sentence_initial)))
    .map((t) => ({ ...t, surface_forms: [...t.surface_forms].sort(), files: [...new Set(t.occurrences.map((o) => o.file))].sort() }))
    .sort((a, b) => a.key.localeCompare(b.key));
  // Repeats: exact keys first, then near matches across files.
  const repeats = [];
  const byKey = new Map();
  for (const s of sentences) { if (!byKey.has(s.key)) byKey.set(s.key, []); byKey.get(s.key).push(s); }
  const seen = new Set();
  for (const group of byKey.values()) {
    const files = new Set(group.map((s) => s.file));
    if (files.size < 2) continue;
    repeats.push({ kind: "exact", similarity: 1, locations: group.map(({ key, ...rest }) => rest) });
    for (const s of group) seen.add(`${s.file}:${s.offset}`);
  }
  let pairs = 0;
  const candidates = sentences.filter((s) => !seen.has(`${s.file}:${s.offset}`));
  for (let i = 0; i < candidates.length; i++) for (let j = i + 1; j < candidates.length; j++) {
    if (candidates[i].file === candidates[j].file) continue;
    if (++pairs > MAX_REPEAT_PAIRS) break;
    const sim = overlap(candidates[i].text, candidates[j].text);
    if (sim >= REPEAT_OVERLAP) {
      const { key: _a, ...a } = candidates[i]; const { key: _b, ...b } = candidates[j];
      repeats.push({ kind: "near", similarity: sim, locations: [a, b] });
    }
  }
  return {
    schema: ENTITY_INDEX_VERSION, files: docs.map((d) => d.file), min_occurrences: min,
    terms: kept, dates, repeats: repeats.sort((a, b) => b.similarity - a.similarity),
    limits: [...LIMITS, ...(pairs > MAX_REPEAT_PAIRS ? [`Repeat comparison hit the ${MAX_REPEAT_PAIRS}-pair cap; some near-repeats may be missing.`] : [])],
  };
}

export function renderIndex(index) {
  const out = [`entity-index — ${index.files.length} file(s), ${index.terms.length} terms, ${index.dates.length} numbers/dates, ${index.repeats.length} repeated passages`];
  for (const t of index.terms) {
    out.push(`  ${t.kind === "term" ? "term" : "name"}  ${t.surface_forms.join(" / ")}  ×${t.occurrences.length} in ${t.files.length} file(s)`);
    for (const d of t.definitions) out.push(`        = ${d.definition ?? "(named)"}  [${d.file}:${d.line}]`);
    for (const a of t.attributes) out.push(`        ${a.attribute}: ${a.value}  [${a.file}:${a.line}]`);
  }
  if (index.repeats.length) { out.push("  repeated across files:"); for (const r of index.repeats) out.push(`    ${r.kind} ${r.similarity}  ${r.locations.map((l) => `${l.file}:${l.line}`).join(" ↔ ")}`); }
  out.push("  Candidates, not findings. Whether any of this contradicts is the continuity critic's question.");
  return out.join("\n");
}

if (process.argv[1] && existsSync(process.argv[1]) && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const paths = [];
  let json = false, min = 2;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--json") json = true;
    else if (args[i] === "--min") { min = Number(args[++i]); if (!Number.isInteger(min) || min < 1) { console.error("--min needs a positive integer"); process.exit(2); } }
    else if (args[i].startsWith("--")) { console.error(`Usage: node entity-index.mjs <dir | file...> [--json] [--min N]`); process.exit(2); }
    else paths.push(args[i]);
  }
  if (!paths.length) { console.error("Usage: node entity-index.mjs <dir | file...> [--json] [--min N]"); process.exit(2); }
  try {
    const index = buildIndex(collectFiles(paths), { min });
    process.stdout.write(json ? `${JSON.stringify(index, null, 2)}\n` : `${renderIndex(index)}\n`);
  } catch (e) { console.error(`entity-index: ${e.message}`); process.exit(1); }
}
