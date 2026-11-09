#!/usr/bin/env node
/**
 * notes-check — keep the editor's ledger honest, and export what was accepted.
 *
 *   node notes-check.mjs <edit-notes.json> <draft> [--export plan-entries.json] [--json]
 *
 * edit-notes/1 (references/edit-notes.md) records, per reading unit, whether it
 * was read or skipped (with a reason), and per note its source, the quote it
 * rests on, and the writer's call: proposed, accepted, declined or deferred.
 *
 * Checks:
 *   - the ledger is well formed; unknown fields are refused
 *   - every note's quote is in the draft, inside the unit it is filed under
 *     (whitespace the only normalisation); the line is reported if it moved,
 *     because the quote is the anchor (PLAN-FORMAT.md)
 *   - a finished pass has every unit read or skipped with a reason, and no
 *     note still proposed
 *   - if the draft changed since the notes were made, which notes still locate
 *
 * --export writes exactly the accepted notes as PLAN-FORMAT entries, and only
 * from a finished, clean ledger.
 * Exit 0 when the ledger is clean; 1 otherwise; 2 on usage.
 */
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { splitDraft } from "./section-split.mjs";

export const NOTES_SCHEMA = "edit-notes/1";
export const STATUSES = Object.freeze(["proposed", "accepted", "declined", "deferred"]);
const SOURCE = /^(?:(?:voice|structure|fidelity|medium|continuity)-critic|reader-critic:[a-z0-9-]+|writer)$/;
const nonempty = (s) => typeof s === "string" && s.trim().length > 0;
const isObject = (v) => v !== null && typeof v === "object" && !Array.isArray(v);
const sha256 = (s) => createHash("sha256").update(s, "utf8").digest("hex");

export function ledgerErrors(ledger) {
  const errors = [];
  if (!isObject(ledger) || ledger.schema !== NOTES_SCHEMA) return [`expected ${NOTES_SCHEMA}`];
  for (const k of Object.keys(ledger)) if (!["schema", "draft_digest", "finished", "units", "notes"].includes(k)) errors.push(`unknown field ${k}`);
  if (!/^[a-f0-9]{64}$/.test(ledger.draft_digest ?? "")) errors.push("draft_digest must be the sha256 of the draft the notes were made on");
  if (typeof ledger.finished !== "boolean") errors.push("finished must be true or false");
  if (!Array.isArray(ledger.units)) errors.push("units must be an array");
  else ledger.units.forEach((u, i) => {
    const at = `units[${i}]`;
    if (!isObject(u)) { errors.push(`${at} must be an object`); return; }
    for (const k of Object.keys(u)) if (!["id", "status", "skip_reason"].includes(k)) errors.push(`${at}: unknown field ${k}`);
    if (!nonempty(u.id)) errors.push(`${at}.id is required`);
    if (!["read", "skipped"].includes(u.status)) errors.push(`${at}.status must be read or skipped`);
    if (u.status === "skipped" && !nonempty(u.skip_reason)) errors.push(`${at}: a skipped unit needs the writer's reason`);
    if (u.status === "read" && u.skip_reason !== undefined && u.skip_reason !== null) errors.push(`${at}: a read unit has no skip reason`);
  });
  if (!Array.isArray(ledger.notes)) errors.push("notes must be an array");
  else {
    const ids = new Set();
    ledger.notes.forEach((n, i) => {
      const at = `notes[${i}]`;
      if (!isObject(n)) { errors.push(`${at} must be an object`); return; }
      for (const k of Object.keys(n)) if (!["id", "unit", "source", "line", "quote", "note", "change", "status", "writer_comment"].includes(k)) errors.push(`${at}: unknown field ${k}`);
      if (!/^N[1-9]\d*$/.test(n.id ?? "")) errors.push(`${at}.id must look like N1, N2, …`);
      else if (ids.has(n.id)) errors.push(`${at}: duplicate id ${n.id}`);
      ids.add(n.id);
      if (!nonempty(n.unit)) errors.push(`${at}.unit is required`);
      if (!SOURCE.test(n.source ?? "")) errors.push(`${at}.source must name one critic (voice-critic, reader-critic:<persona>, …) or the writer`);
      if (!Number.isInteger(n.line) || n.line < 1) errors.push(`${at}.line must be an integer ≥ 1`);
      if (!nonempty(n.quote)) errors.push(`${at}.quote is required: a note that quotes nothing cannot be placed`);
      if (!nonempty(n.note)) errors.push(`${at}.note says what was found`);
      if (!STATUSES.includes(n.status)) errors.push(`${at}.status must be ${STATUSES.join(" | ")}`);
      if (n.status === "accepted" && !nonempty(n.change)) errors.push(`${at}: an accepted note needs the change to make, in the writer's terms`);
      if (n.change !== undefined && n.change !== null && !nonempty(n.change)) errors.push(`${at}.change is null or a short imperative`);
    });
  }
  return errors;
}

const normalise = (s) => s.replace(/\s+/g, " ").trim();

/** Where a quote starts in `text`, by 1-based line, or null; whitespace is the only normalisation. */
function locateQuote(text, quote, fromLine, toLine) {
  const lines = text.replace(/\r\n?/g, "\n").split("\n");
  const q = normalise(quote);
  for (let l = fromLine; l <= toLine; l++) {
    const rest = normalise(lines.slice(l - 1, toLine).join(" "));
    const lineText = normalise(lines[l - 1] ?? "");
    if (!lineText) continue;
    // The quote starts on line l if it begins within that line's text and matches onward.
    const at = rest.indexOf(q);
    if (at >= 0 && at < lineText.length) return l;
  }
  return null;
}

export function checkNotes(ledger, draft) {
  const errors = ledgerErrors(ledger);
  if (errors.length) return { schema: "notes-check/1", valid: false, errors, ok: false };
  const split = splitDraft(draft);
  const units = new Map(split.units.map((u) => [u.id, u]));
  const located = [], problems = [];
  for (const n of ledger.notes) {
    const unit = units.get(n.unit);
    if (!unit) { problems.push({ note: n.id, problem: "unit-missing", detail: `no unit ${n.unit} in this draft` }); continue; }
    const line = locateQuote(draft, n.quote, unit.start_line, unit.end_line);
    if (line === null) {
      const elsewhere = locateQuote(draft, n.quote, 1, draft.split("\n").length);
      problems.push({ note: n.id, problem: elsewhere === null ? "quote-not-found" : "outside-unit", ...(elsewhere !== null ? { found_line: elsewhere } : {}) });
      continue;
    }
    located.push({ note: n.id, line, ...(line !== n.line ? { line_moved_from: n.line } : {}) });
  }
  const filed = new Map(ledger.units.map((u) => [u.id, u]));
  const unvisited = split.units.filter((u) => !filed.has(u.id)).map((u) => u.id);
  const proposed = ledger.notes.filter((n) => n.status === "proposed").map((n) => n.id);
  const finishedProblems = ledger.finished ? [...unvisited.map((u) => `unit ${u} was neither read nor skipped`), ...proposed.map((n) => `note ${n} is still proposed`)] : [];
  return {
    schema: "notes-check/1", valid: true, draft_changed: ledger.draft_digest !== sha256(draft), units: split.units.length,
    located, problems, unvisited, proposed, finished: ledger.finished, finished_problems: finishedProblems,
    counts: Object.fromEntries(["accepted", "declined", "deferred", "proposed"].map((s) => [s, ledger.notes.filter((n) => n.status === s).length])),
    ok: problems.length === 0 && finishedProblems.length === 0,
  };
}

/** The accepted notes as PLAN-FORMAT entries, in note order. */
export function exportEntries(ledger, result) {
  if (!result.ok || !ledger.finished) throw new Error("export needs a finished ledger that checks clean");
  const lineOf = new Map(result.located.map((l) => [l.note, l.line]));
  return ledger.notes.filter((n) => n.status === "accepted").map((n) => ({
    id: `e${n.id.slice(1).padStart(2, "0")}`, source: n.source, location: { line: lineOf.get(n.id) ?? n.line, quote: n.quote },
    change: n.change, reason: n.note,
  }));
}

function main(argv) {
  const exportIndex = argv.indexOf("--export");
  const exportFile = exportIndex >= 0 ? argv[exportIndex + 1] : null;
  const files = argv.filter((a, i) => !a.startsWith("--") && !(exportIndex >= 0 && i === exportIndex + 1));
  if (files.length !== 2 || argv.some((a) => a.startsWith("--") && !["--json", "--export"].includes(a)) || (exportIndex >= 0 && !exportFile)) {
    console.error("Usage: node notes-check.mjs <edit-notes.json> <draft> [--export plan-entries.json] [--json]");
    return 2;
  }
  let ledger;
  try { ledger = JSON.parse(readFileSync(files[0], "utf8")); } catch (e) { console.error(`notes-check: ${e.message}`); return 2; }
  const result = checkNotes(ledger, readFileSync(files[1], "utf8"));
  if (exportFile) {
    try { const entries = exportEntries(ledger, result); writeFileSync(exportFile, `${JSON.stringify(entries, null, 2)}\n`); result.exported = entries.length; }
    catch (e) { result.export_refused = e.message; }
  }
  if (argv.includes("--json")) process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  else if (!result.valid) process.stdout.write(`notes-check: the ledger is invalid\n${result.errors.map((e) => `  ${e}`).join("\n")}\n`);
  else {
    const lines = [`notes-check: ${result.ok ? "clean" : "problems found"} — ${Object.entries(result.counts).map(([k, v]) => `${v} ${k}`).join(", ")}${result.draft_changed ? " (the draft changed since these notes)" : ""}`];
    for (const p of result.problems) lines.push(`  ${p.note}: ${p.problem}${p.found_line ? ` (found at line ${p.found_line})` : ""}${p.detail ? ` — ${p.detail}` : ""}`);
    for (const f of result.finished_problems) lines.push(`  ${f}`);
    if (result.exported !== undefined) lines.push(`  exported ${result.exported} plan entries`);
    if (result.export_refused) lines.push(`  export refused: ${result.export_refused}`);
    process.stdout.write(`${lines.join("\n")}\n`);
  }
  if (!result.valid) return 2;
  return result.ok && !result.export_refused ? 0 : 1;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exit(main(process.argv.slice(2)));
