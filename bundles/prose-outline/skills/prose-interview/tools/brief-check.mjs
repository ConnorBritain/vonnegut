#!/usr/bin/env node
/**
 * brief-check — where an interview stands: what to ask next, what is stale,
 * and whether it is finished.
 *
 *   node brief-check.mjs <brief.json> [--clean transcript.txt] [--summary summary.txt] [--json]
 *
 * <brief.json> is a project-brief/1 (brief-store show's `brief`, or a proposal).
 *
 *   next        the first decision, in tree order, that is open, unconfirmed or
 *               stale and whose dependencies are all settled — so the interview
 *               walks each branch in dependency order by computation, not taste
 *   stale       a decision set before something it depends on (transitively)
 *               last changed: change the audience and the length is stale
 *   blocked_by  required decisions the writer skipped that stop later questions
 *   evidence    transcript and summary quotes re-verified (lib/quote.mjs rules);
 *               without the text they are listed as unverified, never as passed
 *   done        no required decision open, skipped, unconfirmed or stale, and no
 *               evidence problem. Optional decisions never block it.
 *
 * Exit 0 when done, 1 when not (the JSON says why), 2 on usage or an invalid brief.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { DECISIONS, BY_ID, ancestors, HOOKS } from "./lib/decisions.mjs";
import { validateBrief, validateBriefBody, bodyOf } from "./lib/brief-schema.mjs";
import { quoteStatus } from "./lib/quote.mjs";

export const CHECK_SCHEMA = "brief-check/1";

/** Check a brief (document or body). Pure: texts are passed in. */
export function checkBrief(brief, { clean = null, summary = null } = {}) {
  const body = brief?.schema ? bodyOf(brief) : brief;
  const errors = brief?.schema ? validateBrief(brief, HOOKS) : validateBriefBody(body, HOOKS);
  if (errors.length) return { schema: CHECK_SCHEMA, valid: false, errors, done: false };
  const d = body.decisions;
  const present = (id) => Object.hasOwn(d, id);
  const skipped = (id) => present(id) && d[id].skipped !== undefined;
  const evidence_problems = [], evidence_unverified = [];
  for (const [id, rec] of Object.entries(d)) {
    if (!["transcript", "summary"].includes(rec.source)) continue;
    const text = rec.source === "transcript" ? clean : summary;
    if (text === null) { evidence_unverified.push({ decision: id, why: `no ${rec.source === "transcript" ? "--clean" : "--summary"} text given` }); continue; }
    const r = quoteStatus(text, rec.evidence.quote, rec.evidence.line);
    if (r.status !== "exact") evidence_problems.push({ decision: id, ...r });
  }
  const brokenEvidence = new Set(evidence_problems.map((p) => p.decision));
  const isStale = (id) => present(id) && ancestors(id).some((a) => present(a) && d[a].at_revision > d[id].at_revision);
  // A decision whose quoted evidence no longer matches its source is put to the writer again.
  const settled = (id) => present(id) && !skipped(id) && d[id].confirmed && !isStale(id) && !brokenEvidence.has(id);

  const open_required = [], open_optional = [], unconfirmed = [], stale = [], skippedList = [];
  for (const def of DECISIONS) {
    const id = def.id;
    if (!present(id)) { (def.required ? open_required : open_optional).push(id); continue; }
    if (skipped(id)) { skippedList.push(id); continue; }
    if (!d[id].confirmed) unconfirmed.push(id);
    if (isStale(id)) stale.push(id);
  }

  // A skipped required decision blocks everything that depends on it.
  const blocked_by = skippedList.filter((id) => BY_ID[id].required);
  const needsWork = (id) => !present(id) || (!skipped(id) && (!d[id].confirmed || isStale(id) || brokenEvidence.has(id)));
  const askable = (id) => BY_ID[id].depends.every(settled);
  const next = DECISIONS.find((def) => needsWork(def.id) && askable(def.id))?.id ?? null;

  const done = DECISIONS.filter((def) => def.required).every((def) => settled(def.id)) && evidence_problems.length === 0;
  return {
    schema: CHECK_SCHEMA, valid: true, next, asks: next ? BY_ID[next].asks : null,
    open_required, open_optional, unconfirmed, stale, skipped: skippedList, blocked_by,
    evidence_problems, evidence_unverified, done,
  };
}

function main(argv) {
  const flagValue = (f) => { const i = argv.indexOf(f); return i >= 0 ? argv[i + 1] : null; };
  const valued = new Set(["--clean", "--summary"]);
  const positional = argv.filter((a, i) => !a.startsWith("--") && !valued.has(argv[i - 1]));
  const unknown = argv.filter((a) => a.startsWith("--") && !["--json", ...valued].includes(a));
  if (positional.length !== 1 || unknown.length || [...valued].some((f) => argv.includes(f) && !flagValue(f))) {
    console.error("Usage: node brief-check.mjs <brief.json> [--clean transcript.txt] [--summary summary.txt] [--json]");
    return 2;
  }
  let brief;
  try { brief = JSON.parse(readFileSync(positional[0], "utf8")); } catch (e) { console.error(`brief-check: ${positional[0]} is not JSON: ${e.message}`); return 2; }
  if (brief?.status === "current" && brief.brief) brief = brief.brief; // brief-store show output, passed whole
  const result = checkBrief(brief, {
    clean: flagValue("--clean") ? readFileSync(flagValue("--clean"), "utf8") : null,
    summary: flagValue("--summary") ? readFileSync(flagValue("--summary"), "utf8") : null,
  });
  if (argv.includes("--json")) process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  else if (!result.valid) process.stdout.write(`brief-check: the brief is invalid\n${result.errors.map((e) => `  ${e}`).join("\n")}\n`);
  else {
    const lines = [`brief-check: ${result.done ? "done" : "not done"}${result.next ? ` — next: ${result.next} (${result.asks})` : ""}`];
    for (const [label, list] of [["open (required)", result.open_required], ["open (optional)", result.open_optional], ["unconfirmed", result.unconfirmed], ["stale", result.stale], ["skipped", result.skipped], ["blocked by", result.blocked_by]]) if (list.length) lines.push(`  ${label}: ${list.join(", ")}`);
    for (const p of result.evidence_problems) lines.push(`  evidence for ${p.decision}: ${p.status}${p.found_line ? ` (found at line ${p.found_line})` : ""}`);
    for (const u of result.evidence_unverified) lines.push(`  evidence for ${u.decision} unverified: ${u.why}`);
    process.stdout.write(`${lines.join("\n")}\n`);
  }
  if (!result.valid) return 2;
  return result.done ? 0 : 1;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exit(main(process.argv.slice(2)));
