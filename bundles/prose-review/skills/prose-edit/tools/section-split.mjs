#!/usr/bin/env node
/**
 * section-split — a draft as reading units, for the editor's pass.
 *
 *   node section-split.mjs <draft> [--json]
 *
 * With headings, every heading starts a unit (text before the first heading is
 * a unit of its own). Without them, units are windows of WINDOW paragraphs.
 * A unit's id is derived from its text — `u` + the first 8 hex of its sha256 —
 * so it stays the same while the unit is unchanged, whatever happens elsewhere
 * in the draft; `order` gives the reading order. Identical units get `-2`, `-3`.
 *
 * Exit 0; 1 on an empty draft; 2 on usage.
 */
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { segment, words } from "./lib/text-index.mjs";

export const SPLIT_SCHEMA = "section-split/1";
/** Paragraphs per unit in a heading-free draft: a screenful, not a meaning. */
export const WINDOW = 4;
const sha256 = (s) => createHash("sha256").update(s, "utf8").digest("hex");

export function splitDraft(text) {
  const lines = text.replace(/\r\n?/g, "\n").split("\n");
  const seg = segment(text);
  const starts = [];
  if (seg.headings.length) {
    const firstHeading = seg.headings[0].line;
    if (seg.paragraphs.some((p) => p.line < firstHeading)) starts.push({ line: seg.paragraphs.find((p) => p.line < firstHeading).line, heading: null });
    for (const h of seg.headings) starts.push({ line: h.line, heading: h.text });
  } else {
    for (let i = 0; i < seg.paragraphs.length; i += WINDOW) starts.push({ line: seg.paragraphs[i].line, heading: null });
  }
  const seen = new Map();
  return {
    schema: SPLIT_SCHEMA, draft_digest: sha256(text), window: seg.headings.length ? null : WINDOW,
    units: starts.map((s, i) => {
      let end = (starts[i + 1]?.line ?? lines.length + 1) - 1;
      while (end > s.line && !lines[end - 1].trim()) end -= 1;
      const body = lines.slice(s.line - 1, end).join("\n");
      const digest = sha256(body);
      const base = `u${digest.slice(0, 8)}`;
      const n = (seen.get(base) ?? 0) + 1; seen.set(base, n);
      return { id: n === 1 ? base : `${base}-${n}`, order: i + 1, heading: s.heading, start_line: s.line, end_line: end, words: words(body.replace(/^#{1,6}\s.*$/m, "")).length, digest };
    }),
  };
}

function main(argv) {
  const files = argv.filter((a) => !a.startsWith("--"));
  if (files.length !== 1 || argv.some((a) => a.startsWith("--") && a !== "--json")) { console.error("Usage: node section-split.mjs <draft> [--json]"); return 2; }
  const text = readFileSync(files[0], "utf8");
  if (!text.trim()) { console.error("section-split: the draft is empty"); return 1; }
  const r = splitDraft(text);
  if (argv.includes("--json")) process.stdout.write(`${JSON.stringify(r, null, 2)}\n`);
  else process.stdout.write(`${r.units.map((u) => `  ${u.order}. ${u.id}  lines ${u.start_line}–${u.end_line}  ${u.words} words${u.heading ? `  ${u.heading}` : ""}`).join("\n")}\n`);
  return 0;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exit(main(process.argv.slice(2)));
