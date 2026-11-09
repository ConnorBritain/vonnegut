#!/usr/bin/env node
/**
 * transcript-scan — clean a voice-memo transcript without losing line numbers,
 * and count what is countable in it.
 *
 *   node transcript-scan.mjs <file> [--json] [--clean-out FILE]
 *
 * Formats: SRT, WebVTT, speaker-labelled ("Name: text", or an Otter-style
 * "Name  0:03" header line), or plain text. Timestamps, cue numbers and speaker
 * labels are removed; every word the speaker said is kept, fillers included,
 * because a quote has to match what was said. Line numbers in the output refer
 * to the CLEANED text, which --clean-out writes.
 *
 * Exit codes: 0 measured or not-evaluated (the JSON says which and why),
 *             1 refused (empty or binary input), 2 usage.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { capitalisedRuns, contentWords, lineIndex, segment, words } from "./lib/text-index.mjs";

export const SCAN_SCHEMA = "transcript-scan/1";
/** Below this many words there is not enough material to segment or propose from. */
export const MIN_WORDS = 150;
/** TextTiling window: sentences on each side of a candidate boundary. */
export const WINDOW = 6;
/** No segment shorter than this many sentences; a dip inside it is noise. */
export const MIN_SEGMENT = 8;
export const FILLERS = Object.freeze(["um", "uh", "you know", "like", "i mean"]);
/** Words of spoken rhythm that carry no topic; kept out of top terms and recurring terms, never out of the text. */
export const SPEECH_STOP = Object.freeze(new Set(("about actually back basically down get got gonna have honestly just kind know like maybe mean okay "
  + "pretty probably really could did does would right said say says sort stuff thing things think thought want yeah yes").split(" ")));
export const LIMITS = Object.freeze([
  "Topic segments are a heuristic: a lexical-cohesion dip (TextTiling) over windows of 6 sentences, cut at mean − sd/2 of the depth scores, no segment under 8 sentences. It can split one long thought or merge two short ones.",
  "Sentence boundaries are the shared English splitter; unpunctuated speech-to-text output yields long 'sentences' and fewer segments.",
  "Speakers are taken from labels only; an unlabelled transcript is one speaker (S1). No diarisation is attempted.",
  "Fillers are counted from a fixed list; 'like' is counted wherever it appears, including as a verb.",
  "Recurring terms are capitalised runs seen twice or more plus lower-case content words seen three times or more; neither is a judgement of importance.",
]);

const sha256 = (s) => createHash("sha256").update(s, "utf8").digest("hex");
const TIMECODE = /^\s*(\d{1,2}:)?\d{1,2}:\d{2}([.,]\d{1,3})?\s*-->\s*(\d{1,2}:)?\d{1,2}:\d{2}([.,]\d{1,3})?.*$/;
const INLINE_TIME = /[\[(]\s*(?:\d{1,2}:)?\d{1,2}:\d{2}(?:[.,]\d{1,3})?\s*[\])]\s*/g;
const LEAD_TIME = /^\s*(?:\d{1,2}:)?\d{1,2}:\d{2}(?:[.,]\d{1,3})?\s+(?=\S)/;
const LABEL = /^\s*([A-Z][\w .'’-]{0,39}?)\s*(?:\(\s*(?:\d{1,2}:)?\d{1,2}:\d{2}\s*\))?:\s+(?=\S)/;
const HEADER_LINE = /^\s*([A-Z][\w .'’-]{0,39}?)\s{2,}(?:\d{1,2}:)?\d{1,2}:\d{2}\s*$/;

/** Which format this is; the first rule that matches wins. */
export function detectFormat(text) {
  const lines = text.split("\n");
  const nonEmpty = lines.filter((l) => l.trim());
  if (/^﻿?WEBVTT/.test(nonEmpty[0] ?? "")) return "vtt";
  for (let i = 0; i + 1 < lines.length; i++) if (/^\s*\d+\s*$/.test(lines[i]) && TIMECODE.test(lines[i + 1])) return "srt";
  // An Otter-style header ("Name  0:03" alone on a line) is unambiguous; two of them settle it.
  // Inline "Name: text" labels must cover a third of the lines, so a stray "Note: …" does not.
  if (nonEmpty.filter((l) => HEADER_LINE.test(l)).length >= 2) return "speaker-labelled";
  const labelled = nonEmpty.filter((l) => LABEL.test(l)).length;
  if (nonEmpty.length && labelled * 3 >= nonEmpty.length) return "speaker-labelled";
  return "plain";
}

/**
 * Cleaned text plus turns. Each turn is a run of lines by one speaker; turns
 * are separated by one blank line. Subtitle cues become one line each, so a
 * quote can still be located by line.
 */
export function cleanTranscript(text, format = detectFormat(text)) {
  const lines = text.replace(/\r\n?/g, "\n").replace(/^﻿/, "").split("\n");
  const turns = [];
  let current = null;
  const push = (speaker, line) => {
    const t = line.replace(INLINE_TIME, "").replace(/<[^>]+>/g, "").replace(/[ \t]+/g, " ").trim();
    if (!t) return;
    if (!current || current.speaker !== speaker) { current = { speaker, lines: [] }; turns.push(current); }
    current.lines.push(t);
  };
  if (format === "vtt" || format === "srt") {
    let inHeader = format === "vtt", inNote = false;
    for (let i = 0; i < lines.length; i++) {
      const l = lines[i];
      if (inHeader) { if (!l.trim()) inHeader = false; continue; }
      if (/^NOTE(\s|$)/.test(l)) { inNote = true; continue; }
      if (inNote) { if (!l.trim()) inNote = false; continue; }
      if (!l.trim() || TIMECODE.test(l)) continue;
      if (TIMECODE.test(lines[i + 1] ?? "")) continue; // cue identifier or SRT index
      const voice = /^<v(?:\.[^ >]*)?\s+([^>]+)>/.exec(l);
      const label = !voice && LABEL.exec(l);
      const speaker = voice ? voice[1].trim() : label ? label[1].trim() : current?.speaker ?? "S1";
      push(speaker, label ? l.slice(label[0].length) : l);
    }
  } else if (format === "speaker-labelled") {
    let speaker = "S1";
    for (const l of lines) {
      const header = HEADER_LINE.exec(l);
      if (header) { speaker = header[1].trim(); continue; }
      const label = LABEL.exec(l);
      if (label) { speaker = label[1].trim(); push(speaker, l.slice(label[0].length)); }
      else push(speaker, l.replace(LEAD_TIME, ""));
    }
  } else {
    for (const l of lines) {
      // A blank line ends a paragraph; the next line starts a new block by the same speaker.
      if (!l.trim()) { if (current?.lines.length) { current = { speaker: "S1", lines: [] }; turns.push(current); } continue; }
      push("S1", l.replace(LEAD_TIME, ""));
    }
  }
  const kept = turns.filter((t) => t.lines.length);
  const out = [];
  const meta = [];
  let line = 1;
  for (const t of kept) {
    if (out.length) { out.push(""); line += 1; }
    meta.push({ speaker: t.speaker, line, words: words(t.lines.join(" ")).length });
    out.push(...t.lines);
    line += t.lines.length;
  }
  // Consecutive paragraphs by the same speaker are one turn.
  const merged = [];
  for (const m of meta) {
    const prev = merged[merged.length - 1];
    if (prev && prev.speaker === m.speaker) prev.words += m.words; else merged.push({ ...m });
  }
  return { clean: out.length ? `${out.join("\n")}\n` : "", turns: merged };
}

const bag = (sentences) => {
  const m = new Map();
  for (const s of sentences) for (const w of contentWords(s.text)) if (!FILLERS.includes(w) && !SPEECH_STOP.has(w)) m.set(w, (m.get(w) ?? 0) + 1);
  return m;
};
const cosine = (a, b) => {
  let dot = 0, na = 0, nb = 0;
  for (const [k, v] of a) { na += v * v; if (b.has(k)) dot += v * b.get(k); }
  for (const v of b.values()) nb += v * v;
  return na && nb ? dot / Math.sqrt(na * nb) : 0;
};
const round = (x) => Math.round(x * 1000) / 1000;

/** Indexes of sentences that start a new segment (0 always), by TextTiling depth. */
export function topicBoundaries(sentences) {
  const n = sentences.length;
  if (n < 2 * WINDOW + 1) return [0];
  const gaps = [];
  for (let i = WINDOW; i <= n - WINDOW; i++) gaps.push({ at: i, score: cosine(bag(sentences.slice(i - WINDOW, i)), bag(sentences.slice(i, i + WINDOW))) });
  for (let g = 0; g < gaps.length; g++) {
    let left = gaps[g].score, right = gaps[g].score;
    for (let j = g - 1; j >= 0 && gaps[j].score >= left; j--) left = gaps[j].score;
    for (let j = g + 1; j < gaps.length && gaps[j].score >= right; j++) right = gaps[j].score;
    gaps[g].depth = (left - gaps[g].score) + (right - gaps[g].score);
  }
  const depths = gaps.map((g) => g.depth);
  const mean = depths.reduce((a, b) => a + b, 0) / depths.length;
  const sd = Math.sqrt(depths.reduce((a, b) => a + (b - mean) ** 2, 0) / depths.length);
  const cutoff = mean - sd / 2;
  const candidates = gaps.filter((g) => g.depth > 0 && g.depth > cutoff).sort((a, b) => b.depth - a.depth || a.at - b.at);
  const chosen = [0];
  for (const c of candidates) {
    if (chosen.every((b) => Math.abs(b - c.at) >= MIN_SEGMENT) && n - c.at >= MIN_SEGMENT) chosen.push(c.at);
  }
  return chosen.sort((a, b) => a - b);
}

/** Scan a transcript's text. Pure: no file system. */
export function scanTranscript(raw) {
  const format = detectFormat(raw);
  const { clean, turns } = cleanTranscript(raw, format);
  const base = {
    schema: SCAN_SCHEMA, source_digest: sha256(raw), format, words: words(clean).length,
    clean: { digest: sha256(clean), lines: clean ? clean.split("\n").length - 1 : 0 },
  };
  if (base.words < MIN_WORDS) {
    return { ...base, turns, segments: [], recurring_terms: [], questions: [], fillers: countFillers(clean), limits: [...LIMITS], status: "not-evaluated", reason: `${base.words} words; at least ${MIN_WORDS} are needed to segment or propose from` };
  }
  const seg = segment(clean, { markdown: false });
  const line = lineIndex(clean);
  const sentences = seg.paragraphs.flatMap((p) => p.sentences);
  const starts = topicBoundaries(sentences);
  const endLine = (s) => line(Math.max(s.offset, s.offset + s.text.length - 1));
  const segments = starts.map((start, k) => {
    const stop = k + 1 < starts.length ? starts[k + 1] : sentences.length;
    const span = sentences.slice(start, stop);
    const counts = bag(span);
    const top = [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 5).map(([w]) => w);
    return { id: `s${k + 1}`, start_line: span[0].line, end_line: endLine(span[span.length - 1]), sentences: span.length, words: span.reduce((a, s) => a + words(s.text).length, 0), top_terms: top };
  });
  return {
    ...base, turns, segments, recurring_terms: recurringTerms(clean), questions: sentences.filter((s) => /\?["'’”)]*$/.test(s.text)).map((s) => ({ line: s.line, text: s.text })),
    fillers: countFillers(clean), limits: [...LIMITS], status: "measured",
  };
}

export function countFillers(clean) {
  const lower = clean.toLowerCase();
  return Object.fromEntries(FILLERS.map((f) => [f, (lower.match(new RegExp(String.raw`(?<![\p{L}\p{N}'’])${f.replace(" ", String.raw`\s+`)}(?![\p{L}\p{N}'’])`, "gu")) || []).length]));
}

/** Capitalised runs seen twice or more, plus lower-case content words seen three times or more; top 25 by count. */
export function recurringTerms(clean) {
  const line = lineIndex(clean);
  const terms = new Map();
  const add = (key, text, ln) => { const t = terms.get(key) ?? { term: text, count: 0, lines: new Set() }; t.count += 1; t.lines.add(ln); terms.set(key, t); };
  const caps = capitalisedRuns(clean, { markdown: false });
  const capKeys = new Map();
  for (const r of caps) capKeys.set(r.key, (capKeys.get(r.key) ?? 0) + 1);
  // A single word that only ever starts a sentence ("So", "Anyway") is speech rhythm, not a term.
  const onlyInitial = (key) => caps.every((x) => x.key !== key || x.sentenceInitial);
  for (const r of caps) if (capKeys.get(r.key) >= 2 && !(r.single && onlyInitial(r.key))) add(`cap:${r.key}`, r.text, r.line);
  const re = /[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu;
  const lowerCounts = new Map();
  for (const m of clean.matchAll(re)) {
    const w = m[0];
    if (w !== w.toLowerCase() || FILLERS.includes(w)) continue;
    const [cw] = contentWords(w);
    if (!cw || capKeys.has(cw) || SPEECH_STOP.has(cw)) continue;
    lowerCounts.set(cw, [...(lowerCounts.get(cw) ?? []), line(m.index)]);
  }
  for (const [w, lines] of lowerCounts) if (lines.length >= 3) for (const ln of lines) add(`low:${w}`, w, ln);
  return [...terms.values()].map((t) => ({ term: t.term, count: t.count, lines: [...t.lines].sort((a, b) => a - b) }))
    .sort((a, b) => b.count - a.count || a.term.localeCompare(b.term)).slice(0, 25);
}

function main(argv) {
  const args = [...argv];
  const json = args.includes("--json");
  const outIndex = args.indexOf("--clean-out");
  const cleanOut = outIndex >= 0 ? args[outIndex + 1] : null;
  const positional = args.filter((a, i) => !a.startsWith("--") && (outIndex < 0 || i !== outIndex + 1));
  const unknown = args.filter((a) => a.startsWith("--") && !["--json", "--clean-out"].includes(a));
  if (positional.length !== 1 || unknown.length || (outIndex >= 0 && !cleanOut)) { console.error("Usage: node transcript-scan.mjs <file> [--json] [--clean-out FILE]"); return 2; }
  const bytes = readFileSync(positional[0]);
  if (!bytes.length || !bytes.toString("utf8").trim()) { console.error("transcript-scan: refused — the file is empty"); return 1; }
  if (bytes.includes(0)) { console.error("transcript-scan: refused — the file is binary; export the transcript as text"); return 1; }
  const raw = bytes.toString("utf8");
  const result = scanTranscript(raw);
  if (cleanOut) writeFileSync(cleanOut, cleanTranscript(raw, result.format).clean);
  if (json) { process.stdout.write(`${JSON.stringify(result, null, 2)}\n`); return 0; }
  const lines = [`${result.format} transcript, ${result.words} words, ${result.turns.length} turn(s) — ${result.status}${result.reason ? ` (${result.reason})` : ""}`];
  for (const s of result.segments) lines.push(`  ${s.id}  lines ${s.start_line}–${s.end_line}  ${s.words} words  ${s.top_terms.join(", ")}`);
  if (result.questions.length) lines.push(`  questions asked: ${result.questions.length}`);
  lines.push(`  fillers: ${Object.entries(result.fillers).map(([k, v]) => `${k} ${v}`).join(", ")}`);
  process.stdout.write(`${lines.join("\n")}\n`);
  return 0;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exit(main(process.argv.slice(2)));
