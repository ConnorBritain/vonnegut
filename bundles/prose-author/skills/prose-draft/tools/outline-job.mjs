#!/usr/bin/env node
/**
 * outline-job — an approved outline (and its brief) → a prose-writing-job/1,
 * mechanically, so the runtime drafts the piece that was planned.
 *
 *   node outline-job.mjs --outline O.json [--brief B.json] --harness codex|claude
 *                        [--form F --purpose P] [--allow-open] [--out job.json]
 *
 * O.json is outline-store show's output (or its `outline`, or a bare body);
 * B.json is brief-store show's output (or its `brief`). The mapping is the
 * contract in docs/contracts/outline-handoff.md:
 *
 *   thesis (+ chosen angle title)        → brief
 *   confirmed audience / purpose / form  → context
 *   length band                          → a word-limit rule
 *   nodes in reading order (part, words) → ordered facts
 *   filled evidence                      → facts
 *   must-include / exclude               → semantic rules (reviewable, not enforced)
 *   open questions, a null thesis, or an unsettled required decision → refusal,
 *     unless --allow-open, which turns each open question into an explicit
 *     "leave this unresolved" semantic rule
 *
 * Nothing is invented: every fact and rule has a `from` pointer in
 * `job.handoff`, which the runtime ignores and a test reads. The job also
 * records `outline: { project, revision, digest, shape }` so the receipt can
 * name the plan the piece was written from.
 *
 * Exit 0 with the job; 1 refused (the reasons are listed); 2 usage.
 */
import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { bodyOf, briefState, outlineErrors, readingOrder } from "./lib/outline-handoff.mjs";
import { ruleErrors } from "./style-rules.mjs";

export class HandoffRefusal extends Error { constructor(reasons) { super(reasons.join("; ")); this.reasons = reasons; } }
const stable = (v) => Array.isArray(v) ? `[${v.map(stable).join(",")}]` : v && typeof v === "object" ? `{${Object.keys(v).sort().map((k) => `${JSON.stringify(k)}:${stable(v[k])}`).join(",")}}` : JSON.stringify(v);
const digest = (v) => createHash("sha256").update(stable(v), "utf8").digest("hex");
const unwrap = (doc, key) => (doc?.status === "current" && doc[key] ? doc[key] : doc);

/** Build the job. Pure. Throws HandoffRefusal with every reason at once. */
export function outlineJob(outlineDoc, briefDoc = null, { harness, form = null, purpose = null, allowOpen = false } = {}) {
  const outline = unwrap(outlineDoc, "outline");
  const brief = briefDoc ? unwrap(briefDoc, "brief") : null;
  const reasons = [];
  if (!["codex", "claude"].includes(harness)) reasons.push("choose the harness: codex or claude");
  const oErrors = outlineErrors(outline);
  if (oErrors.length) throw new HandoffRefusal([...reasons, ...oErrors.map((e) => `outline: ${e}`)]);
  const state = brief ? briefState(brief) : null;
  if (state && !state.valid) reasons.push(...state.errors.map((e) => `brief: ${e}`));
  if (state?.valid) for (const u of state.unsettled) reasons.push(`brief: decision ${u.decision} is ${u.why}; settle it in the interview first`);

  const nodes = readingOrder(outline);
  const questions = nodes.filter((n) => n.kind === "open-question");
  if (outline.thesis === null && !allowOpen) reasons.push("outline: the thesis is withheld; the piece has not settled what it argues");
  if (questions.length && !allowOpen) reasons.push(...questions.map((q) => `outline: open question ${q.id}: ${q.text}`));

  const d = state?.valid ? state.decisions : {};
  const ctxValue = (id) => (state?.valid && state.settled(id) ? d[id].value : null);
  const ctxForm = ctxValue("form")?.form ?? form;
  const ctxPurpose = ctxValue("purpose") ?? purpose;
  if (!ctxForm) reasons.push("no form: give a brief with a settled form, or --form");
  if (!ctxPurpose) reasons.push("no purpose: give a brief with a settled purpose, or --purpose");
  if (reasons.length) throw new HandoffRefusal(reasons);

  const facts = [], factsFrom = [], rules = [], rulesFrom = [], notes = [];
  const fact = (text, from) => { facts.push(text); factsFrom.push(from); };
  const rule = (r, from) => { rules.push(r); rulesFrom.push(from); };
  const top = nodes.filter((n) => n.parent === null && n.kind !== "open-question");
  const sectionOf = new Map(top.map((n, i) => [n.id, i + 1]));
  const sectionFor = (n) => { let p = n; const byId = new Map(outline.nodes.map((x) => [x.id, x])); while (p.parent !== null) p = byId.get(p.parent); return sectionOf.get(p.id); };
  for (const n of nodes) {
    if (n.kind === "open-question") continue;
    if (n.kind === "evidence-slot") { notes.push(`node ${n.id} is a standalone evidence slot ("${n.text}"); nothing fills it, so it is not a fact`); continue; }
    const k = sectionFor(n);
    const budget = [n.words ? `≈${n.words} words` : null, n.part ?? null].filter(Boolean).join(", ");
    fact(n.parent === null ? `Section ${k}${budget ? ` (${budget})` : ""}: ${n.text}` : `Section ${k}, within it${budget ? ` (${budget})` : ""}: ${n.text}`, n.id);
    for (const e of n.evidence ?? []) if (e.filled_by !== null) fact(`Evidence for section ${k}: ${e.filled_by}`, `${n.id}.${e.slot}`);
  }
  if (outline.length) rule({ id: "outline-length", kind: "word-limit", directive: `Between ${outline.length.min} and ${outline.length.max} words, the outline's band.`, minimum: outline.length.min, maximum: outline.length.max }, "length");
  else notes.push("the outline has no length band, so the job has no word-limit rule");
  (ctxValue("must_include") ?? []).forEach((item, i) => rule({ id: `must-include-${i + 1}`, kind: "semantic", directive: `Include: ${item}` }, `must_include.${i}`));
  (ctxValue("exclude") ?? []).forEach((item, i) => rule({ id: `exclude-${i + 1}`, kind: "semantic", directive: `Leave out: ${item}` }, `exclude.${i}`));
  if (allowOpen) questions.forEach((q) => rule({ id: `unresolved-${q.id}`, kind: "semantic", directive: `Leave this unresolved; do not assert an answer: ${q.text}` }, q.id));
  for (const r of rules) { const e = ruleErrors(r); if (e.length) throw new HandoffRefusal([`internal: rule ${r.id} is invalid: ${e.join("; ")}`]); }

  const angle = brief?.chosen_angle ? brief.angles?.find((a) => a.id === brief.chosen_angle) : null;
  const spine = outline.thesis ?? `${outline.title} (the thesis is left open)`;
  const body = bodyOf(outline);
  return {
    schema: "prose-writing-job/1", mode: "draft",
    brief: angle ? `${angle.title}: ${spine}` : spine,
    context: { form: ctxForm, purpose: ctxPurpose, register: null, audience: ctxValue("audience"), project: outline.id ?? brief?.id ?? null },
    facts, rules, examples: true, review: "standard", adapter: { harness },
    outline: { project: outline.id ?? null, revision: outline.revision ?? null, digest: digest(body), shape: outline.shape ?? null },
    handoff: { schema: "outline-handoff/1", facts_from: factsFrom, rules_from: rulesFrom, notes, brief_revision: brief?.revision ?? null },
  };
}

function main(argv) {
  const valued = ["--outline", "--brief", "--harness", "--form", "--purpose", "--out"];
  const value = (f) => { const i = argv.indexOf(f); return i >= 0 ? argv[i + 1] : null; };
  const unknown = argv.filter((a, i) => a.startsWith("--") && !["--allow-open", ...valued].includes(a));
  const stray = argv.filter((a, i) => !a.startsWith("--") && !valued.includes(argv[i - 1]));
  if (!value("--outline") || unknown.length || stray.length || valued.some((f) => argv.includes(f) && (!value(f) || value(f).startsWith("--")))) {
    console.error("Usage: node outline-job.mjs --outline O.json [--brief B.json] --harness codex|claude [--form F --purpose P] [--allow-open] [--out job.json]");
    return 2;
  }
  const read = (f) => { if (!existsSync(f)) throw new HandoffRefusal([`${f} not found`]); return JSON.parse(readFileSync(f, "utf8")); };
  try {
    const job = outlineJob(read(value("--outline")), value("--brief") ? read(value("--brief")) : null,
      { harness: value("--harness"), form: value("--form"), purpose: value("--purpose"), allowOpen: argv.includes("--allow-open") });
    const text = `${JSON.stringify(job, null, 2)}\n`;
    if (value("--out")) { writeFileSync(value("--out"), text); process.stdout.write(`${JSON.stringify({ status: "ready", job: value("--out"), facts: job.facts.length, rules: job.rules.length, notes: job.handoff.notes })}\n`); }
    else process.stdout.write(text);
    return 0;
  } catch (e) {
    if (!(e instanceof HandoffRefusal)) throw e;
    process.stdout.write(`${JSON.stringify({ status: "refused", reasons: e.reasons }, null, 2)}\n`);
    return 1;
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exit(main(process.argv.slice(2)));
