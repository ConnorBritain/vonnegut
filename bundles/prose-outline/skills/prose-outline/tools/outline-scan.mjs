#!/usr/bin/env node
/**
 * outline-scan — read a draft back into the outline it implies. Deterministic.
 *
 *   node outline-scan.mjs <file> [--json] [--plain]
 *
 * WHAT IT COUNTS, and nothing else:
 *   headings      the ATX heading tree, with levels, lines and parents
 *   sections      one per heading (plus a preamble before the first), with word
 *                 counts and each section's ratio to the median section length
 *   paragraphs    per paragraph: two topic-sentence CANDIDATES (the first
 *                 sentence, and the sentence overlapping the section heading
 *                 most), claim-marker counts by word class, and how the
 *                 paragraph connects to the one before it (a transition marker,
 *                 a demonstrative, or lexical overlap)
 *   balance       median section length and the extreme ratios
 *   transitions   how many paragraph boundaries carry no marker and no overlap
 *
 * WHAT IT DOES NOT DO. It does not decide whether a section is too short,
 * whether a claim is unsupported, or whether the order is wrong. Those are
 * judgements; prose-structure-critic makes them in a clean context, reading
 * this JSON. It never re-counts what is counted here, and this never pretends a
 * count is a finding. Every heuristic is named in `limits`.
 *
 * `status: "not-evaluated"` is returned, with the reason, for a document with
 * no headings and fewer than three paragraphs. There is no structure to read.
 */
import { existsSync, readFileSync, realpathSync } from "node:fs";
import { basename, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { LIMITS as TEXT_LIMITS, contentWords, numbersAndDates, overlap, segment } from "./lib/text-index.mjs";

export const OUTLINE_SCAN_VERSION = "outline-scan/1";

/** Word classes counted as claim markers. Counts, not findings; the list is the limit. */
export const CLAIM_MARKERS = Object.freeze({
  assertive: ["must", "should", "cannot", "can't", "clearly", "obviously", "certainly", "undeniably", "always", "never", "proves", "prove", "shows", "show", "demonstrates", "means", "implies", "fails", "wrong", "true", "false", "necessarily", "inevitably"],
  connective: ["therefore", "because", "thus", "hence", "since", "consequently", "so", "as a result", "it follows", "which means", "that is why", "for this reason"],
  citation: ["according to", "reported", "reports", "found that", "study", "studies", "survey", "data", "evidence", "source", "cited", "quoted", "wrote", "writes", "said"],
});

/** Markers a paragraph may open with, grouped by what they signal. */
export const TRANSITION_MARKERS = Object.freeze({
  contrast: ["however", "but", "yet", "still", "nevertheless", "nonetheless", "in contrast", "on the other hand", "conversely", "even so", "instead"],
  addition: ["moreover", "furthermore", "also", "besides", "in addition", "what is more", "and"],
  sequence: ["first", "firstly", "second", "secondly", "third", "finally", "then", "next", "lastly", "meanwhile", "afterwards", "later", "now"],
  consequence: ["so", "therefore", "thus", "hence", "as a result", "consequently", "that is why"],
  example: ["for example", "for instance", "consider", "take", "suppose", "imagine"],
  demonstrative: ["this", "that", "these", "those", "such", "here"],
});

const LIMITS = Object.freeze([
  "Topic-sentence candidates are positional (first sentence) and lexical (highest heading overlap); neither is a semantic judgement.",
  "Claim markers are counts of listed word classes, not a claim detector; the lists are in the tool and are the whole definition.",
  "A transition is a listed opening marker, a demonstrative, or content-word overlap ≥ 0.08 with the previous paragraph; absence of all three is reported, not judged.",
  "Sections are ATX headings; a document with other structure reads as one preamble section.",
  ...TEXT_LIMITS,
]);

const LEXICAL_LINK = 0.08;
const round = (n) => Math.round(n * 1000) / 1000;

function countPhrases(text, phrases) {
  const lower = ` ${text.toLowerCase().replace(/[^\p{L}\p{N}'’\s-]/gu, " ").replace(/\s+/g, " ")} `;
  let n = 0;
  for (const phrase of phrases) {
    const needle = ` ${phrase} `;
    let i = lower.indexOf(needle);
    while (i !== -1) { n += 1; i = lower.indexOf(needle, i + needle.length); }
  }
  return n;
}

function openingMarker(text) {
  const head = text.toLowerCase().replace(/^[^\p{L}]+/u, "");
  for (const [kind, phrases] of Object.entries(TRANSITION_MARKERS)) {
    for (const phrase of phrases) {
      if (head.startsWith(`${phrase} `) || head.startsWith(`${phrase},`)) return { kind, marker: phrase };
    }
  }
  return null;
}

function citationPatterns(text) {
  return (text.match(/\[\d+\]|\(\p{Lu}[\p{L}'’-]+(?: et al\.?)?,? \d{4}[a-z]?\)|\b(?:pp?\.|p\.)\s?\d+/gu) || []).length;
}

/** Scan a document. `markdown` defaults from the file extension when a name is given. */
export function scanOutline(source, { file = null, markdown = null } = {}) {
  const md = markdown ?? !(file && extname(file).toLowerCase() === ".txt");
  const seg = segment(source, { markdown: md });
  const paragraphCount = seg.paragraphs.length;
  const base = { schema: OUTLINE_SCAN_VERSION, file: file ? basename(file) : null, markdown: md, words: seg.words };
  if (!seg.headings.length && paragraphCount < 3) {
    return { ...base, status: "not-evaluated", reason: `no headings and ${paragraphCount} paragraph(s): there is no structure to read`, headings: [], sections: [], balance: null, transitions: null, limits: [...LIMITS] };
  }
  const headings = seg.headings.map((h) => ({ index: h.index, level: h.level, text: h.text, line: h.line, parent: h.parent }));
  // Sections: a preamble (heading null) plus one per heading, in document order.
  const sections = [];
  const sectionFor = new Map();
  if (seg.paragraphs.some((p) => p.heading === null)) sections.push({ heading: null, title: "(preamble)", level: 0, paragraphs: [] });
  for (const h of headings) sections.push({ heading: h.index, title: h.text, level: h.level, paragraphs: [] });
  for (const s of sections) sectionFor.set(s.heading, s);
  let previous = null;
  for (const p of seg.paragraphs) {
    const section = sectionFor.get(p.heading);
    const headingText = section.heading === null ? "" : section.title;
    const first = p.sentences[0]?.text ?? p.text;
    let best = null, bestScore = 0;
    for (const s of p.sentences) {
      const score = headingText ? overlap(s.text, headingText) : 0;
      if (score > bestScore) { best = s.text; bestScore = score; }
    }
    const marker = previous ? openingMarker(p.text) : null;
    const lexical = previous ? overlap(previous.text, p.text) : null;
    const numeric = numbersAndDates(p.text, { markdown: false }).length;
    const markers = {
      assertive: countPhrases(p.text, CLAIM_MARKERS.assertive),
      connective: countPhrases(p.text, CLAIM_MARKERS.connective),
      numeric,
      citation: countPhrases(p.text, CLAIM_MARKERS.citation) + citationPatterns(p.text),
    };
    markers.total = markers.assertive + markers.connective + markers.numeric + markers.citation;
    markers.per_100_words = p.words ? round(markers.total * 100 / p.words) : 0;
    section.paragraphs.push({
      line: p.line, words: p.words, sentences: p.sentences.length,
      first_sentence: first,
      heading_overlap_sentence: best, heading_overlap: round(bestScore),
      claim_markers: markers,
      transition_in: previous === null ? null : {
        marker: marker?.marker ?? null, kind: marker?.kind ?? null, lexical_overlap: round(lexical),
        linked: Boolean(marker) || lexical >= LEXICAL_LINK,
        same_section: previous.heading === p.heading,
      },
    });
    previous = p;
  }
  for (const s of sections) {
    s.words = s.paragraphs.reduce((n, p) => n + p.words, 0);
    s.paragraph_count = s.paragraphs.length;
    s.start_line = s.heading === null ? (s.paragraphs[0]?.line ?? null) : headings[s.heading].line;
    s.end_line = s.paragraphs.length ? s.paragraphs[s.paragraphs.length - 1].line : s.start_line;
    s.claim_markers = s.paragraphs.reduce((n, p) => n + p.claim_markers.total, 0);
    s.claim_markers_per_100_words = s.words ? round(s.claim_markers * 100 / s.words) : 0;
  }
  const lengths = sections.filter((s) => s.paragraph_count).map((s) => s.words).sort((a, b) => a - b);
  const median = lengths.length ? (lengths.length % 2 ? lengths[(lengths.length - 1) / 2] : (lengths[lengths.length / 2 - 1] + lengths[lengths.length / 2]) / 2) : 0;
  for (const s of sections) s.ratio_to_median = median ? round(s.words / median) : null;
  const ratios = sections.filter((s) => s.paragraph_count).map((s) => s.ratio_to_median);
  const boundaries = seg.paragraphs.slice(1).map((p, i) => ({ p, previous: seg.paragraphs[i] }));
  const unmarked = [];
  for (const s of sections) for (const p of s.paragraphs) if (p.transition_in && !p.transition_in.linked) unmarked.push({ line: p.line, section: s.title, same_section: p.transition_in.same_section });
  return {
    ...base, status: "measured", headings, sections,
    balance: { sections: lengths.length, median_words: median, max_ratio: ratios.length ? Math.max(...ratios) : null, min_ratio: ratios.length ? Math.min(...ratios) : null },
    transitions: { boundaries: boundaries.length, marked: boundaries.length - unmarked.length, unmarked },
    limits: [...LIMITS],
  };
}

export function renderReport(scan) {
  const out = [`outline-scan ${scan.file ?? "(stdin)"} — ${scan.status}`];
  if (scan.status !== "measured") { out.push(`  ${scan.reason}`); return out.join("\n"); }
  out.push(`  ${scan.words} words · ${scan.headings.length} headings · ${scan.sections.length} sections · median section ${scan.balance.median_words} words`);
  out.push("", "  Sections (words, ratio to median, claim markers per 100 words)");
  for (const s of scan.sections) out.push(`    ${"#".repeat(s.level) || "·"} ${s.title}  ${s.words}w  ×${s.ratio_to_median ?? "-"}  ${s.claim_markers_per_100_words}/100  (lines ${s.start_line}–${s.end_line})`);
  out.push("", `  Paragraph boundaries: ${scan.transitions.boundaries}, ${scan.transitions.unmarked.length} with no marker and no lexical link`);
  for (const u of scan.transitions.unmarked) out.push(`    line ${u.line}  in "${u.section}"${u.same_section ? "" : " (section boundary)"}`);
  out.push("", "  Counts, not findings. Whether any of this costs the argument is the structure critic's question.");
  out.push("  Limits:"); for (const l of scan.limits) out.push(`    - ${l}`);
  return out.join("\n");
}

if (process.argv[1] && existsSync(process.argv[1]) && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const file = args.find((a) => !a.startsWith("--"));
  const unknown = args.filter((a) => a.startsWith("--") && !["--json", "--plain", "--markdown"].includes(a));
  if (!file || unknown.length) { console.error("Usage: node outline-scan.mjs <file> [--json] [--plain|--markdown]"); process.exit(2); }
  if (!existsSync(file)) { console.error(`outline-scan: not a file: ${file}`); process.exit(2); }
  const markdown = args.includes("--plain") ? false : args.includes("--markdown") ? true : null;
  const scan = scanOutline(readFileSync(file, "utf8"), { file, markdown });
  process.stdout.write(args.includes("--json") ? `${JSON.stringify(scan, null, 2)}\n` : `${renderReport(scan)}\n`);
}
