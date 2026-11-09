#!/usr/bin/env node
/**
 * angles-check — are an angle proposal's quotes real, and is every part of the
 * transcript accounted for?
 *
 *   node angles-check.mjs <angles.json> <clean.txt> [--scan scan.json] [--summary summary.txt] [--expect concrete|underspecified] [--json]
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
 * Expectation (the skill's two promises, for its harness): `concrete` material
 * yields at least three angles, at least one with a thesis; `underspecified`
 * material yields no thesis at all — every angle null, with open questions.
 *
 * Exit 0 when every quote is exact, coverage is complete and any expectation
 * holds; 1 otherwise; 2 usage.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const CHECK_SCHEMA = "angles-check/1";

export { normalise, normalisedWithLines, quoteStatus } from "./lib/quote.mjs";
import { quoteStatus } from "./lib/quote.mjs";


/** Check a proposal. Pure: texts are passed in. */
export const EXPECTATIONS = Object.freeze(["concrete", "underspecified"]);

export function checkAngles(proposal, clean, { scan = null, summary = null, expect = null } = {}) {
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
  let expectation = null;
  if (expect) {
    const findings = [];
    if (expect === "concrete") {
      if (angles.length < 3) findings.push(`concrete material should yield at least three angles; got ${angles.length}`);
      if (!angles.some((a) => typeof a?.thesis === "string" && a.thesis.trim())) findings.push("concrete material should yield at least one angle with a thesis");
    } else if (expect === "underspecified") {
      const invented = angles.filter((a) => a?.thesis !== null).map((a) => a?.id);
      if (invented.length) findings.push(`thin material must not yield an invented thesis (thesis should be null): ${invented.join(", ")}`);
      const silent = angles.filter((a) => !(a?.open_questions?.length)).map((a) => a?.id);
      if (silent.length) findings.push(`every angle on thin material says what is missing in open questions: ${silent.join(", ")}`);
    } else findings.push(`unknown expectation ${expect}`);
    expectation = { expect, findings };
  }
  const ok = quotes.length > 0 && !(expectation?.findings.length) && quotes.every((q) => q.status === "exact" && q.segment_ok !== false)
    && coverage.status === "evaluated" && !coverage.unaccounted_segments.length && !coverage.unknown_segments.length;
  return { schema: CHECK_SCHEMA, quotes, coverage, ...(expectation ? { expectation } : {}), ok };
}

function main(argv) {
  const flagValue = (f) => { const i = argv.indexOf(f); return i >= 0 ? argv[i + 1] : null; };
  const valued = new Set(["--scan", "--summary", "--expect"]);
  const positional = argv.filter((a, i) => !a.startsWith("--") && !valued.has(argv[i - 1]));
  const unknown = argv.filter((a) => a.startsWith("--") && !["--json", ...valued].includes(a));
  if (positional.length !== 2 || unknown.length || [...valued].some((f) => argv.includes(f) && !flagValue(f))) {
    console.error("Usage: node angles-check.mjs <angles.json> <clean.txt> [--scan scan.json] [--summary summary.txt] [--expect concrete|underspecified] [--json]");
    return 2;
  }
  let proposal;
  try { proposal = JSON.parse(readFileSync(positional[0], "utf8")); } catch (e) { console.error(`angles-check: ${positional[0]} is not JSON: ${e.message}`); return 2; }
  const scanFile = flagValue("--scan"), summaryFile = flagValue("--summary"), expect = flagValue("--expect");
  if (expect && !EXPECTATIONS.includes(expect)) { console.error("angles-check: --expect must be concrete or underspecified"); return 2; }
  const result = checkAngles(proposal, readFileSync(positional[1], "utf8"), {
    scan: scanFile ? JSON.parse(readFileSync(scanFile, "utf8")) : null,
    summary: summaryFile ? readFileSync(summaryFile, "utf8") : null,
    expect,
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
    for (const f of result.expectation?.findings ?? []) lines.push(`  ${f}`);
    process.stdout.write(`${lines.join("\n")}\n`);
  }
  return result.ok ? 0 : 1;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exit(main(process.argv.slice(2)));
