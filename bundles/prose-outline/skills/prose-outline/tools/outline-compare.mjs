#!/usr/bin/env node
/**
 * outline-compare — candidate outlines for one brief, side by side, as facts.
 *
 *   node outline-compare.mjs <a.json> <b.json> [c.json …] [--brief-json brief.json] [--shapes-dir DIR] [--json]
 *
 * Each candidate is checked against its own `shape` (from this skill's shapes/,
 * or --shapes-dir) and the brief, exactly as proposal-check does, and the
 * results are tabulated: shape and mode, nodes, words allocated against the
 * band, required parts present or missing, part shares outside the shape's
 * ranges (signals), must-include coverage, open questions, findings.
 *
 * No scores and no ordering beyond the input order: which shape suits the idea
 * is the writer's judgement, and this table is what they judge with.
 * Exit 0 when every candidate is clean, 1 when any has findings, 2 on usage.
 */
import { existsSync, readFileSync } from "node:fs";
import { basename, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { checkProposal } from "./proposal-check.mjs";
import { loadShapes, SHIPPED } from "./shape-check.mjs";

export const COMPARE_SCHEMA = "outline-compare/1";

export function compareCandidates(candidates, { briefDoc = null, shapes = loadShapes() } = {}) {
  const rows = candidates.map(({ name, body }) => {
    const shape = body?.shape ? shapes.get(body.shape) ?? null : null;
    const report = checkProposal(body, null, { shape, briefDoc });
    const findings = [...(report.errors ?? []).map((e) => `invalid: ${e}`), ...(report.findings ?? [])];
    if (body?.shape && !shape) findings.push(`no shape file named ${body.shape}`);
    if (!body?.shape) findings.push("the candidate names no shape");
    const required = shape ? shape.parts.filter((p) => p.required === "required").map((p) => p.part) : [];
    const nodes = Array.isArray(body?.nodes) ? body.nodes : [];
    const plan = report.plan ?? {};
    return {
      name, title: body?.title ?? null, shape: body?.shape ?? null, mode: body?.mode ?? null, nodes: nodes.length,
      length: plan.length ?? null, words_allocated: plan.words_allocated ?? null,
      within_band: plan.length && plan.words_allocated !== null ? plan.words_allocated >= plan.length.min && plan.words_allocated <= plan.length.max : null,
      required_parts: { present: required.filter((p) => nodes.some((n) => n.part === p)), missing: required.filter((p) => !nodes.some((n) => n.part === p)) },
      parts: plan.parts ?? {},
      must_include: plan.must_include ?? null,
      open_questions: nodes.filter((n) => n.kind === "open-question").length,
      signals: report.signals ?? [], findings, clean: findings.length === 0,
    };
  });
  const shapesUsed = rows.map((r) => r.shape).filter(Boolean);
  const notes = [];
  if (new Set(shapesUsed).size < shapesUsed.length) notes.push("two candidates share a shape; candidates are a choice only when their shapes differ");
  return { schema: COMPARE_SCHEMA, brief_length: briefDoc?.decisions?.length?.value ?? null, candidates: rows, notes };
}

export function renderMarkdown(result) {
  const cell = (v) => (v === null || v === undefined ? "—" : String(v));
  const lines = ["| | " + result.candidates.map((c) => c.name).join(" | ") + " |", "|---|" + result.candidates.map(() => "---").join("|") + "|"];
  const row = (label, fn) => lines.push(`| ${label} | ${result.candidates.map((c) => cell(fn(c))).join(" | ")} |`);
  row("shape", (c) => `${c.shape ?? "—"} (${c.mode ?? "?"})`);
  row("nodes", (c) => c.nodes);
  row("words allocated", (c) => (c.words_allocated === null ? null : `${c.words_allocated}${c.length ? ` of ${c.length.min}–${c.length.max}${c.within_band ? "" : " ✗"}` : ""}`));
  row("required parts missing", (c) => (c.required_parts.missing.length ? c.required_parts.missing.join(", ") : "none"));
  row("must-include covered", (c) => (c.must_include ? `${c.must_include.covered} of ${c.must_include.total}` : null));
  row("open questions", (c) => c.open_questions);
  row("share signals", (c) => c.signals.length);
  row("findings", (c) => (c.findings.length ? c.findings.join("; ") : "none"));
  return `${lines.join("\n")}\n${result.notes.map((n) => `\nNote: ${n}`).join("")}${result.notes.length ? "\n" : ""}`;
}

function main(argv) {
  const valued = ["--brief-json", "--shapes-dir"];
  const value = (f) => { const i = argv.indexOf(f); return i >= 0 ? argv[i + 1] : null; };
  const files = argv.filter((a, i) => !a.startsWith("--") && !valued.includes(argv[i - 1]));
  const unknown = argv.filter((a) => a.startsWith("--") && !["--json", ...valued].includes(a));
  if (files.length < 2 || unknown.length || valued.some((f) => argv.includes(f) && !value(f))) {
    console.error("Usage: node outline-compare.mjs <a.json> <b.json> [c.json …] [--brief-json brief.json] [--shapes-dir DIR] [--json]");
    return 2;
  }
  let briefDoc = value("--brief-json") ? JSON.parse(readFileSync(value("--brief-json"), "utf8")) : null;
  if (briefDoc?.status === "current" && briefDoc.brief) briefDoc = briefDoc.brief;
  const dir = value("--shapes-dir") ? resolve(value("--shapes-dir")) : SHIPPED;
  if (!existsSync(dir)) { console.error(`outline-compare: ${dir} does not exist`); return 2; }
  const result = compareCandidates(files.map((f) => ({ name: basename(f, ".json"), body: JSON.parse(readFileSync(f, "utf8")) })), { briefDoc, shapes: loadShapes(dir) });
  process.stdout.write(argv.includes("--json") ? `${JSON.stringify(result, null, 2)}\n` : renderMarkdown(result));
  return result.candidates.every((c) => c.clean) ? 0 : 1;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exit(main(process.argv.slice(2)));
