/**
 * text-index — segmentation with locations, and the extractors two bundles share.
 *
 * CANONICAL COPY: bundles/prose-outline/skills/prose-outline/tools/lib/text-index.mjs
 * MIRROR:         bundles/prose-bible/skills/prose-bible/tools/lib/text-index.mjs
 *
 * The two files are byte-identical and tools/check-packaging.mjs fails when they
 * are not. A static import across the bundle boundary is not allowed here (see
 * bundles/prose-tell-scan/PROFILES.md, "The corpus has three readers"), and a
 * port that merely agrees on fixtures can drift where no fixture looks; a pinned
 * copy cannot drift at all. Edit the canonical file, then copy it.
 *
 * WHAT IT PROMISES. Every location is a 1-indexed `line` and a UTF-16 `offset`
 * into the ORIGINAL string. Masking replaces non-prose with spaces and never
 * changes length, so an offset computed on masked text points at the same place
 * in the file the user has open. That is the property the structure and
 * continuity critics depend on: a finding that names line 42 must be at line 42.
 *
 * WHAT IT DOES NOT PROMISE. English sentence boundaries are a heuristic; the
 * abbreviation list is finite; "defined term" is three surface patterns; a
 * capitalised run is not a named entity. Every consumer prints these as limits.
 */

export const TEXT_INDEX_VERSION = "text-index/1";

export const LIMITS = Object.freeze([
  "Sentence boundaries are an English heuristic with a finite abbreviation list.",
  "A capitalised run is a surface pattern, not a named entity; sentence-initial function words are excluded by a stoplist, nothing else is.",
  "Defined terms are matched by three surface patterns ('X is', 'X, the', 'called X').",
  "Dates are recognised in numeric and month-name forms only.",
  "Markdown structure recognised: ATX headings, fenced and inline code, links, frontmatter, list and quote markers, tables, thematic breaks.",
]);

/* ------------------------------------------------------------------ */
/* Masking                                                             */
/* ------------------------------------------------------------------ */

const blank = (m) => m.replace(/[^\n]/g, " ");

/**
 * Mask everything that is not prose, preserving length and newlines. Frontmatter
 * and fences go first so a stray backtick inside a fence cannot open a phantom
 * inline span. Returns counts of what was masked so a report can say so.
 */
export function maskNonProse(text, { markdown = true } = {}) {
  const masked = { frontmatter: 0, fenced: 0, inline: 0, urls: 0, comments: 0, html: 0 };
  let out = text;
  const apply = (re, key) => { out = out.replace(re, (m) => { masked[key] += 1; return blank(m); }); };
  out = out.replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/, (m) => { masked.frontmatter += 1; return blank(m); });
  if (markdown) {
    apply(/^([ \t]*)(```|~~~)[\s\S]*?\n[ \t]*\2[ \t]*$/gm, "fenced");
    apply(/^[ \t]*(```|~~~)[\s\S]*$/m, "fenced");
    apply(/<!--[\s\S]*?-->/g, "comments");
    apply(/`[^`\n]+`/g, "inline");
    // Link targets only; the visible link text is prose and the brackets are
    // masked as markers by the segmenter.
    apply(/(?<=\])\([^)\s]*(?:\s+"[^"]*")?\)/g, "urls");
    apply(/^\s*\[[^\]]+\]:\s*\S+.*$/gm, "urls");
    apply(/<\/?[A-Za-z][^>\n]*>/g, "html");
  }
  apply(/\b(?:https?|ftp):\/\/\S+/g, "urls");
  if (out.length !== text.length) throw new Error("masking changed document length — offsets would be wrong");
  return { text: out, masked };
}

/** UTF-16 offset → 1-indexed line, via a prefix table built once per document. */
export function lineIndex(text) {
  const starts = [0];
  for (let i = 0; i < text.length; i++) if (text[i] === "\n") starts.push(i + 1);
  return (offset) => {
    let lo = 0, hi = starts.length - 1;
    while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (starts[mid] <= offset) lo = mid; else hi = mid - 1; }
    return lo + 1;
  };
}

/* ------------------------------------------------------------------ */
/* Sentences, paragraphs, headings                                     */
/* ------------------------------------------------------------------ */

const ABBREVIATIONS = new Set([
  "mr", "mrs", "ms", "dr", "prof", "sr", "jr", "rev", "hon", "pres",
  "gen", "col", "lt", "sgt", "capt", "cmdr", "adm", "gov", "sen", "rep",
  "e.g", "i.e", "etc", "vs", "cf", "al", "approx", "fig",
  "vol", "pp", "eds", "trans", "ibid",
  "jan", "feb", "mar", "apr", "jun", "jul", "aug", "sep", "sept", "oct", "nov", "dec",
  "inc", "ltd", "corp", "dept", "univ", "assn",
  "u.s", "u.k", "u.n", "e.u", "a.m", "p.m", "b.c", "a.d",
]);

/**
 * Sentences of `text`, each with the offset of its first character. `base` is
 * added to every offset so a paragraph's sentences can be located in the whole
 * document. The rules match the tell-scan splitter: ellipses, decimals, initials
 * and abbreviations do not end a sentence; a following lowercase letter does not
 * either.
 */
export function sentences(text, base = 0) {
  const out = [];
  let start = 0;
  const push = (from, to) => {
    const raw = text.slice(from, to);
    const lead = raw.length - raw.trimStart().length;
    const trimmed = raw.trim();
    if (trimmed) out.push({ text: trimmed, offset: base + from + lead });
  };
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch !== "." && ch !== "!" && ch !== "?") continue;
    if (ch === "." && text.slice(i, i + 3) === "...") { i += 2; continue; }
    if (ch === "." && /\d/.test(text[i - 1] || "") && /\d/.test(text[i + 1] || "")) continue;
    let end = i;
    while (end + 1 < text.length && /[.!?]/.test(text[end + 1])) end += 1;
    while (end + 1 < text.length && /["'’”)\]]/.test(text[end + 1])) end += 1;
    const after = text.slice(end + 1);
    if (after && !/^\s/.test(after)) continue;
    if (ch === ".") {
      const word = (text.slice(start, i).match(/([A-Za-z][A-Za-z.]*)$/) || [])[1];
      if (word) {
        const key = word.toLowerCase().replace(/\.$/, "");
        if (ABBREVIATIONS.has(key) || /^[a-z]$/i.test(key)) continue;
      }
      if (/^\s+[a-z]/.test(after) && !/^\s*\n\s*\n/.test(after)) continue;
    }
    push(start, end + 1);
    start = end + 1;
    i = end;
  }
  push(start, text.length);
  return out;
}

const HEADING_LINE = /^[ \t]{0,3}(#{1,6})[ \t]+(.+?)[ \t]*#*[ \t]*$/;
const STRUCTURE_LINE = /^\s*(?:\|.*\|\s*|[-*_]\s*[-*_]\s*[-*_][-*_\s]*)$/;

/** Words, for density denominators. Apostrophes and hyphens stay inside a word. */
export function words(text) {
  return text.match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu) || [];
}

const collapse = (s) => s.replace(/\s+/g, " ").trim();

/**
 * Blank out Markdown markers inside a paragraph block — bullets, numbering,
 * quote markers, link brackets, emphasis — and whole structure lines (table
 * rows, thematic breaks), keeping length so offsets survive. The result is what
 * sentences are split on, so a sentence's offset is exact rather than searched.
 */
function maskMarkers(block, markdown) {
  if (!markdown) return block;
  return block.split("\n").map((l) => {
    if (STRUCTURE_LINE.test(l)) return blank(l);
    return l
      .replace(/^(\s*)(?:[-*+]|\d+[.)])(\s+)/, (m) => blank(m))
      .replace(/^(\s*)>\s?/, (m) => blank(m))
      .replace(/(?<!\\)[\[\]]/g, " ")
      .replace(/(?<![\p{L}\p{N}])[*_]{1,3}(?=\S)|(?<=\S)[*_]{1,3}(?![\p{L}\p{N}])/gu, (m) => blank(m));
  }).join("\n");
}

/**
 * Segment a document into headings and prose paragraphs with locations.
 *
 * A paragraph is a blank-line-delimited block that is not a heading, table row
 * or thematic break. List and quote markers are masked out of `text` (which is
 * whitespace-collapsed for display) but the paragraph's `offset` and `line`
 * point at its first prose character in the source. Each paragraph names the
 * heading that governs it (`heading`: index into `headings`, or null before the
 * first heading). Sentences carry exact document offsets.
 */
export function segment(source, { markdown = true } = {}) {
  const { text, masked } = maskNonProse(source, { markdown });
  const line = lineIndex(text);
  const headings = [];
  const paragraphs = [];
  const blocks = [];
  // Blank-line blocks, with offsets. A blank line may carry spaces, tabs or a
  // stray carriage return (CRLF files), and still separates paragraphs.
  const re = /[^\n]+(?:\n(?![ \t\r]*\n)[^\n]*)*/g;
  for (const m of text.matchAll(re)) {
    if (m[0].trim()) blocks.push({ text: m[0], offset: m.index });
  }
  for (const block of blocks) {
    const lines = block.text.split("\n");
    let cursor = block.offset;
    // A heading is a whole line; a block may hold a heading followed by prose lines.
    let paraStart = null, paraLines = [];
    const flush = () => {
      if (paraStart === null) return;
      const prose = maskMarkers(paraLines.join("\n"), markdown);
      const cleaned = collapse(prose);
      if (cleaned) {
        const lead = prose.length - prose.trimStart().length;
        const offset = paraStart + lead;
        paragraphs.push({
          index: paragraphs.length, offset, line: line(offset), text: cleaned,
          words: words(cleaned).length,
          heading: headings.length ? headings.length - 1 : null,
          sentences: sentences(prose, paraStart).map((s) => ({ text: collapse(s.text), offset: s.offset, line: line(s.offset) })),
        });
      }
      paraStart = null; paraLines = [];
    };
    for (const l of lines) {
      const h = markdown ? HEADING_LINE.exec(l) : null;
      if (h) {
        flush();
        headings.push({ index: headings.length, level: h[1].length, text: h[2].trim(), offset: cursor, line: line(cursor), parent: null });
      } else {
        if (paraStart === null) paraStart = cursor;
        paraLines.push(l);
      }
      cursor += l.length + 1;
    }
    flush();
  }
  // Parent links: nearest preceding heading of a smaller level.
  for (let i = 0; i < headings.length; i++) {
    for (let j = i - 1; j >= 0; j--) if (headings[j].level < headings[i].level) { headings[i].parent = j; break; }
  }
  return { schema: TEXT_INDEX_VERSION, headings, paragraphs, words: words(text).length, masked, limits: [...LIMITS] };
}

/* ------------------------------------------------------------------ */
/* Extractors                                                          */
/* ------------------------------------------------------------------ */

const STOP = new Set(("a an the and or but nor so yet for of in on at to by with from as if than then that this these those it its is are was were be been being " +
  "i you he she we they me him her us them my your his our their what which who whom whose when where why how all any both each few more most other some such " +
  "no not only own same too very can will just should now here there once during before after above below between into through during again further " +
  "one two three four five six seven eight nine ten first second last new old good great little long much many well also even still").split(/\s+/));

const CAP_WORD = String.raw`\p{Lu}[\p{L}\p{N}'’-]*`;
const LINK = String.raw`(?:of|the|de|van|von|and|for|du|da|del|la|le)`;
const RUN = new RegExp(String.raw`(?<![\p{L}\p{N}_])${CAP_WORD}(?:[ \t]+(?:${LINK}[ \t]+){0,2}${CAP_WORD})*(?![\p{L}\p{N}_])`, "gu");

const MONTHS = new Set(["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december",
  "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]);

/** Key for a run: lower case, leading article dropped, apostrophe suffix trimmed. */
export const runKey = (run) => run.toLowerCase().replace(/^(?:the|a|an)\s+/, "").replace(/['’]s$/, "").replace(/\s+/g, " ");

/**
 * Capitalised runs with locations. Single words are included — the continuity
 * index needs "Suvorin" — except stoplist words, honorifics and abbreviations
 * ("Dr", "Mr"), single initials ("J") and month or day names. That drops "The"
 * and "It" without pretending to know what a name is; a sentence-initial
 * "Perhaps" still comes through, flagged `sentenceInitial`, and the caller
 * decides whether a run appears often enough to matter.
 */
export function capitalisedRuns(source, { markdown = true } = {}) {
  const { text } = maskNonProse(source, { markdown });
  const line = lineIndex(text);
  const out = [];
  for (const m of text.matchAll(RUN)) {
    const run = m[0];
    const before = text.slice(Math.max(0, m.index - 12), m.index);
    const sentenceInitial = m.index === 0 || /(?:^|[.!?]["'’”)]*\s+|\n\s*|["“‘'(\[]\s*)$/.test(before) || /^\s*$/.test(before);
    const single = !/\s/.test(run);
    const lower = run.toLowerCase();
    if (single && (STOP.has(lower) || ABBREVIATIONS.has(lower) || MONTHS.has(lower) || /^\p{Lu}$/u.test(run))) continue;
    out.push({ text: run, key: runKey(run), offset: m.index, line: line(m.index), single, sentenceInitial });
  }
  return out;
}

const DEFINITION_PATTERNS = [
  // "A widget is a small part" / "The Cadence Rule is what ..."
  { pattern: new RegExp(String.raw`(?<![\p{L}\p{N}_])(?:[Aa]n?|[Tt]he)?\s*(${CAP_WORD}(?:[ \t]+${CAP_WORD}){0,3}|[a-z][\p{L}\p{N}'’-]+(?:[ \t]+[a-z][\p{L}\p{N}'’-]+){0,2})[ \t]+(?:is|are|was|were|means|refers to)[ \t]+(?:an?|the)[ \t]+([^.;:\n]{3,120})`, "gu"), kind: "is-a" },
  // "Vonnegut, the repository that ..."
  { pattern: new RegExp(String.raw`(?<![\p{L}\p{N}_])(${CAP_WORD}(?:[ \t]+${CAP_WORD}){0,3}),[ \t]+(?:the|a|an)[ \t]+([^.;:\n]{3,120})`, "gu"), kind: "appositive" },
  // "... called the Cadence Rule" / "known as X"
  { pattern: new RegExp(String.raw`(?:called|known as|termed|named)[ \t]+(?:the[ \t]+)?["“]?(${CAP_WORD}(?:[ \t]+${CAP_WORD}){0,3}|[a-z][\p{L}\p{N}'’-]+(?:[ \t]+[a-z][\p{L}\p{N}'’-]+){0,2})["”]?`, "gu"), kind: "called" },
];

/**
 * Defined terms: the three surface patterns above, each with the term, the
 * defining span (or null for "called X"), and a location. A term is normalised
 * to lower case for keys; the surface form is kept.
 */
export function definedTerms(source, { markdown = true } = {}) {
  const { text } = maskNonProse(source, { markdown });
  const line = lineIndex(text);
  const out = [];
  for (const { pattern, kind } of DEFINITION_PATTERNS) {
    for (const m of text.matchAll(pattern)) {
      const term = m[1].trim();
      if (!term || STOP.has(term.toLowerCase())) continue;
      const termOffset = m.index + m[0].indexOf(term);
      out.push({ term, key: runKey(term), kind, definition: m[2] ? m[2].trim() : null, offset: termOffset, line: line(termOffset) });
    }
  }
  return out.sort((a, b) => a.offset - b.offset);
}

const MONTH = String.raw`(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|June?|July?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)`;
const DATE = new RegExp(String.raw`\b(?:\d{4}-\d{2}-\d{2}|\d{1,2}(?:st|nd|rd|th)?[ \t]+${MONTH}(?:,?[ \t]+\d{4})?|${MONTH}[ \t]+\d{1,2}(?:st|nd|rd|th)?(?:,?[ \t]+\d{4})?|${MONTH}[ \t]+\d{4}|(?:1[5-9]|20)\d{2})\b`, "g");
const NUMBER = /(?<![\p{L}\p{N}])\d[\d,]*(?:\.\d+)?%?(?![\p{L}\p{N}])/gu;

/** Numbers and dates with locations. A four-digit year is a date, not a number. */
export function numbersAndDates(source, { markdown = true } = {}) {
  const { text } = maskNonProse(source, { markdown });
  const line = lineIndex(text);
  const out = [];
  const covered = [];
  for (const m of text.matchAll(DATE)) {
    out.push({ text: m[0], kind: "date", offset: m.index, line: line(m.index) });
    covered.push([m.index, m.index + m[0].length]);
  }
  for (const m of text.matchAll(NUMBER)) {
    if (covered.some(([s, e]) => m.index >= s && m.index < e)) continue;
    out.push({ text: m[0], kind: "number", offset: m.index, line: line(m.index) });
  }
  return out.sort((a, b) => a.offset - b.offset);
}

/* ------------------------------------------------------------------ */
/* Helpers consumers share                                             */
/* ------------------------------------------------------------------ */

/** Content words: lower-cased, stoplist removed, apostrophe-suffixes trimmed. */
export function contentWords(text) {
  return words(text).map((w) => w.toLowerCase().replace(/['’]s$/, "")).filter((w) => w.length > 2 && !STOP.has(w));
}

/** Jaccard overlap of content words, 0..1. Two empty sets overlap 0. */
export function overlap(a, b) {
  const A = new Set(contentWords(a)), B = new Set(contentWords(b));
  if (!A.size || !B.size) return 0;
  let common = 0;
  for (const w of A) if (B.has(w)) common += 1;
  return Math.round((common / (A.size + B.size - common)) * 1000) / 1000;
}

/** Locate an offset: line, and the sentence containing it, for citations. */
export function locate(source, offset, file = null, { markdown = true } = {}) {
  const seg = segment(source, { markdown });
  const line = lineIndex(source)(offset);
  let sentence = null;
  for (const p of seg.paragraphs) {
    for (let i = 0; i < p.sentences.length; i++) {
      const s = p.sentences[i], next = p.sentences[i + 1];
      if (offset >= s.offset && (!next || offset < next.offset)) { sentence = s.text; break; }
    }
    if (sentence) break;
  }
  return { file, line, offset, sentence };
}
