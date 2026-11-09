#!/usr/bin/env node
/**
 * angles-check — are an angle proposal's quotes real, and is every part of the
 * transcript accounted for?
 *
 *   node angles-check.mjs <angles.json> <clean.txt> [--scan scan.json] [--summary summary.txt] [--json]
 *
 * <angles.json> is a project-brief/1 (stored or proposed) or any object with
 * `angles` and `unused_segments`. <clean.txt> is the CLEANED transcript
 * (transcript-scan --clean-out, or the brief's cached source), the text every
 * line number refers to.
 *
 * Quotes: whitespace is the only normalisation, the same rule as prose-research's
 * claims-check, because a writer's words are never "close enough".
 *   exact      the quote starts on the line it names
 *   misplaced  the exact words are in the text, starting on a different line
 *   drifted    the words match only if case and punctuation are ignored
 *   absent     not in the text in any form
 * A quote whose segment is "summary" is checked against --summary; without it
 * the quote is not-evaluated.
 *
 * Coverage (needs --scan): every scan segment must appear in some angle's
 * `uses`, in some angle's `leaves_out`, or in `unused_segments`.
 *
 * Exit 0 when every quote is exact and coverage is complete; 1 otherwise; 2 usage.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const CHECK_SCHEMA = "angles-check/1";

/** Whitespace collapsed, with the 1-based line each kept character came from. */
export function normalisedWithLines(text) {
  let out = "";
  const lines = [];
  let line = 1, pendingSpace = false;
  for (const ch of text) {
    if (/\s/.test(ch)) { if (ch === "\n") line += 1; if (out.length) pendingSpace = true; continue; }
    if (pendingSpace) { out += " "; lines.push(line); pendingSpace = false; }
    out += ch; lines.push(line);
  }
  return { text: out, lines };
}
export const normalise = (s) => s.replace(/\s+/g, " ").trim();
const loose = (s) => s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").replace(/\s+/g, " ").trim();

/** Every start index of `needle` in `hay`. */
function indexesOf(hay, needle) {
  const out = [];
  if (!needle) return out;
  for (let i = hay.indexOf(needle); i >= 0; i = hay.indexOf(needle, i + 1)) out.push(i);
  return out;
}

/** The status of one quote against one text. */
export function quoteStatus(source, quote, line) {
  const { text, lines } = normalisedWithLines(source);
  const q = normalise(quote);
  const starts = indexesOf(text, q).map((i) => lines[i]);
  if (starts.includes(line)) return { status: "exact" };
  if (starts.length) return { status: "misplaced", found_line: starts[0] };
  const ql = loose(quote);
  if (ql && loose(source).includes(ql)) {
    // Report where: the first source line whose loose form contains the quote's first loose words.
    const head = ql.split(" ").slice(0, 3).join(" ");
    const found = source.split("\n").findIndex((l) => loose(l).includes(head));
    return { status: "drifted", ...(found >= 0 ? { found_line: found + 1 } : {}) };
  }
  return { status: "absent" };
}

/** Check a proposal. Pure: texts are passed in. */
export function checkAngles(proposal, clean, { scan = null, summary = null } = {}) {
  const angles = Array.isArray(proposal?.angles) ? proposal.angles : [];
  const segments = new Map((scan?.segments ?? []).map((s) => [s.id, s]));
  const quotes = [];
  for (const a of angles) {
    for (const u of Array.isArray(a?.uses) ? a.uses : []) {
      const entry = { angle: a.id, segment: u.segment, line: u.line, quote: u.quote };
      if (u.segment === "summary") {
        quotes.push(summary === null ? { ...entry, status: "not-evaluated", why: "no --summary given" } : { ...entry, ...quoteStatus(summary, u.quote ?? "", u.line) });
        continue;
      }
      const status = quoteStatus(clean, u.quote ?? "", u.line);
      const seg = segments.get(u.segment);
      const segment_ok = scan ? Boolean(seg && u.line >= seg.start_line && u.line <= seg.end_line) : null;
      quotes.push({ ...entry, ...status, segment_ok });
    }
  }
  let coverage;
  if (!scan) coverage = { status: "not-evaluated", why: "no --scan given" };
  else {
    const accounted = new Set([
      ...angles.flatMap((a) => (a?.uses ?? []).map((u) => u.segment)),
      ...angles.flatMap((a) => a?.leaves_out ?? []),
      ...(proposal?.unused_segments ?? []),
    ]);
    accounted.delete("summary");
    coverage = {
      status: "evaluated",
      unaccounted_segments: [...segments.keys()].filter((id) => !accounted.has(id)),
      unknown_segments: [...accounted].filter((id) => !segments.has(id)).sort(),
    };
  }
  const ok = quotes.length > 0 && quotes.every((q) => q.status === "exact" && q.segment_ok !== false)
    && coverage.status === "evaluated" && !coverage.unaccounted_segments.length && !coverage.unknown_segments.length;
  return { schema: CHECK_SCHEMA, quotes, coverage, ok };
}

function main(argv) {
  const flagValue = (f) => { const i = argv.indexOf(f); return i >= 0 ? argv[i + 1] : null; };
  const valued = new Set(["--scan", "--summary"]);
  const positional = argv.filter((a, i) => !a.startsWith("--") && !valued.has(argv[i - 1]));
  const unknown = argv.filter((a) => a.startsWith("--") && !["--json", ...valued].includes(a));
  if (positional.length !== 2 || unknown.length || [...valued].some((f) => argv.includes(f) && !flagValue(f))) {
    console.error("Usage: node angles-check.mjs <angles.json> <clean.txt> [--scan scan.json] [--summary summary.txt] [--json]");
    return 2;
  }
  let proposal;
  try { proposal = JSON.parse(readFileSync(positional[0], "utf8")); } catch (e) { console.error(`angles-check: ${positional[0]} is not JSON: ${e.message}`); return 2; }
  const scanFile = flagValue("--scan"), summaryFile = flagValue("--summary");
  const result = checkAngles(proposal, readFileSync(positional[1], "utf8"), {
    scan: scanFile ? JSON.parse(readFileSync(scanFile, "utf8")) : null,
    summary: summaryFile ? readFileSync(summaryFile, "utf8") : null,
  });
  if (argv.includes("--json")) process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  else {
    const lines = [`angles-check: ${result.ok ? "ok" : "problems found"}`];
    for (const q of result.quotes) if (q.status !== "exact" || q.segment_ok === false) lines.push(`  ${q.angle} line ${q.line}: ${q.status}${q.found_line ? ` (found at line ${q.found_line})` : ""}${q.segment_ok === false ? `, not inside segment ${q.segment}` : ""} — "${q.quote}"`);
    if (result.coverage.status !== "evaluated") lines.push(`  coverage not evaluated: ${result.coverage.why}`);
    else {
      if (result.coverage.unaccounted_segments.length) lines.push(`  unaccounted segments: ${result.coverage.unaccounted_segments.join(", ")}`);
      if (result.coverage.unknown_segments.length) lines.push(`  segments the scan does not have: ${result.coverage.unknown_segments.join(", ")}`);
    }
    process.stdout.write(`${lines.join("\n")}\n`);
  }
  return result.ok ? 0 : 1;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exit(main(process.argv.slice(2)));
