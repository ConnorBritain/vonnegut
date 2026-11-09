#!/usr/bin/env node
/**
 * proposal-check — is this outline proposal a valid voice-outline/1 body, and
 * does it keep the skill's promises about briefs?
 *
 *   node proposal-check.mjs <proposal.json> [--brief <brief.md>] [--shape <shapes/x.md>] [--brief-json <brief.json>] [--json]
 *
 * The skill's two tests are mechanical where they can be:
 *   positive   a concrete brief → every claim carries at least one evidence slot
 *   negative   an underspecified brief → open questions, and no invented thesis
 * A brief declares which it is in frontmatter (`expect: concrete | underspecified`);
 * with no brief, only the schema is checked. What the checker cannot decide —
 * whether the claims are the right claims — is the reader's, and it says so.
 *
 * Plan checks (roadmap item J), each a finding when broken:
 *   --shape       every required part has a node; parts appear in the shape's
 *                 order; no node names a part the shape lacks; the mode agrees
 *   budget        node word budgets sum to within the outline's length band
 *   --brief-json  every must-include item in the brief is covered by a node,
 *                 and the outline's length band is the brief's
 * A part's share outside the shape's range is a SIGNAL, reported but never a
 * finding: share ranges are starting values, not measurements.
 */
import { existsSync, readFileSync, realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { readingOrder, validateOutlineBody } from "./lib/outline-schema.mjs";
import { loadShape } from "./lib/shape.mjs";

export function checkProposal(body, brief = null, { shape = null, briefDoc = null } = {}) {
  const report = { schema: "proposal-check/1", errors: validateOutlineBody(body), expectation: null, findings: [], limits: ["Whether these are the right claims, in the right order, is not checked here."] };
  if (report.errors.length) return { ...report, status: "invalid" };
  const claims = body.nodes.filter((n) => n.kind === "claim");
  const questions = body.nodes.filter((n) => n.kind === "open-question");
  report.counts = { nodes: body.nodes.length, claims: claims.length, open_questions: questions.length, empty_slots: claims.reduce((n, c) => n + c.evidence.filter((e) => e.filled_by === null).length, 0) };
  if (brief) {
    const expect = /^expect:\s*(concrete|underspecified)\s*$/m.exec(brief.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? "")?.[1] ?? null;
    report.expectation = expect;
    if (expect === "concrete") {
      if (body.thesis === null) report.findings.push("a concrete brief should yield a thesis, not a withheld one");
      const bare = claims.filter((c) => !c.evidence.length);
      if (bare.length) report.findings.push(`${bare.length} claim(s) carry no evidence slot: ${bare.map((c) => c.id).join(", ")}`);
    } else if (expect === "underspecified") {
      if (body.thesis !== null) report.findings.push("an underspecified brief must not yield an invented thesis (thesis should be null)");
      if (!questions.length) report.findings.push("an underspecified brief must yield at least one open question");
    } else report.findings.push("brief has no `expect: concrete | underspecified` frontmatter; expectation not checked");
  }
  report.findings.push(...planFindings(body, { shape, briefDoc, report }));
  return { ...report, status: report.findings.length ? "findings" : "clean" };
}

/** The item-J checks. Fills report.plan and report.signals; returns findings. */
export function planFindings(body, { shape = null, briefDoc = null, report = {} } = {}) {
  const findings = [];
  const signals = [];
  const ordered = readingOrder(body);
  const budgeted = ordered.filter((n) => n.words !== undefined);
  const total = budgeted.reduce((a, n) => a + n.words, 0);
  const plan = { shape: body.shape ?? null, length: body.length ?? null, words_allocated: budgeted.length ? total : null, parts: {} };
  if (body.length && !budgeted.length) findings.push("the outline has a length band but no node carries a word budget");
  if (budgeted.length && !body.length) findings.push("nodes carry word budgets but the outline has no length band to hold them to");
  if (body.length && budgeted.length && (total < body.length.min || total > body.length.max)) findings.push(`word budgets sum to ${total}, outside the length band ${body.length.min}–${body.length.max}`);
  if (shape) {
    if (body.shape !== undefined && body.shape !== shape.name) findings.push(`the outline says shape ${body.shape} but was checked against ${shape.name}`);
    if (body.mode !== shape.mode) findings.push(`shape ${shape.name} is a ${shape.mode} shape; the outline is in ${body.mode} mode`);
    const names = shape.parts.map((p) => p.part);
    const unknown = [...new Set(ordered.filter((n) => n.part !== undefined && !names.includes(n.part)).map((n) => n.part))];
    if (unknown.length) findings.push(`nodes name parts shape ${shape.name} does not have: ${unknown.join(", ")}`);
    const missing = shape.parts.filter((p) => p.required === "required" && !ordered.some((n) => n.part === p.part)).map((p) => p.part);
    if (missing.length) findings.push(`required parts with no node: ${missing.join(", ")}`);
    // Order: the sequence of parts as they first appear must follow the shape.
    const seen = [];
    for (const n of ordered) if (n.part !== undefined && names.includes(n.part) && seen[seen.length - 1] !== n.part) seen.push(n.part);
    const outOfOrder = seen.find((part, i) => i > 0 && names.indexOf(part) < names.indexOf(seen[i - 1]));
    if (outOfOrder) findings.push(`parts out of the shape's order: ${seen.join(" → ")}`);
    if (total > 0) for (const p of shape.parts) {
      const words = budgeted.filter((n) => n.part === p.part).reduce((a, n) => a + n.words, 0);
      const share = Math.round((words / total) * 1000) / 1000;
      plan.parts[p.part] = { words, share, range: p.share };
      if (words && (share < p.share[0] || share > p.share[1])) signals.push(`part ${p.part} takes ${share} of the budget; the shape's range is ${p.share[0]}–${p.share[1]}`);
    }
  }
  if (briefDoc) {
    const decisions = briefDoc.decisions ?? {};
    const must = decisions.must_include?.value ?? [];
    const covered = new Set(ordered.flatMap((n) => n.covers ?? []));
    const uncovered = must.map((item, i) => ({ item, key: `must_include.${i}` })).filter((m) => !covered.has(m.key));
    if (uncovered.length) findings.push(`must-include items no node covers: ${uncovered.map((u) => `${u.key} (${u.item})`).join("; ")}`);
    const unknownCovers = [...covered].filter((c) => { const [id, i] = c.split("."); const v = decisions[id]?.value; return !(i === undefined ? id in decisions : Array.isArray(v) && Number(i) < v.length); });
    if (unknownCovers.length) findings.push(`nodes cover brief decisions the brief does not have: ${unknownCovers.join(", ")}`);
    const bl = decisions.length?.value;
    if (bl && body.length && (bl.min !== body.length.min || bl.max !== body.length.max)) findings.push(`the outline's length band ${body.length.min}–${body.length.max} is not the brief's ${bl.min}–${bl.max}`);
    if (bl && !body.length) findings.push(`the brief settles a length band (${bl.min}–${bl.max}); the outline does not carry it`);
    plan.must_include = { total: must.length, covered: must.length - uncovered.length };
  }
  report.plan = plan;
  report.signals = signals;
  return findings;
}

if (process.argv[1] && existsSync(process.argv[1]) && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const valued = ["--brief", "--shape", "--brief-json"];
  const value = (f) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : null; };
  const files = args.filter((a, i) => !a.startsWith("--") && !valued.includes(args[i - 1]));
  const unknown = args.filter((a) => a.startsWith("--") && !["--json", ...valued].includes(a));
  if (files.length !== 1 || unknown.length || valued.some((f) => args.includes(f) && (!value(f) || value(f).startsWith("--")))) { console.error("Usage: node proposal-check.mjs <proposal.json> [--brief <brief.md>] [--shape <shapes/x.md>] [--brief-json <brief.json>] [--json]"); process.exit(2); }
  const brief = value("--brief") ? readFileSync(value("--brief"), "utf8") : null;
  let shape = null;
  if (value("--shape")) {
    const loaded = loadShape(readFileSync(value("--shape"), "utf8"));
    if (loaded.errors) { console.error(`proposal-check: the shape file is invalid: ${loaded.errors.join("; ")}`); process.exit(2); }
    shape = loaded.shape;
  }
  let briefDoc = value("--brief-json") ? JSON.parse(readFileSync(value("--brief-json"), "utf8")) : null;
  if (briefDoc?.status === "current" && briefDoc.brief) briefDoc = briefDoc.brief; // brief-store show output, passed whole
  const report = checkProposal(JSON.parse(readFileSync(files[0], "utf8")), brief, { shape, briefDoc });
  if (args.includes("--json")) process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  else {
    console.log(`proposal-check — ${report.status}${report.expectation ? ` (brief: ${report.expectation})` : ""}`);
    for (const e of report.errors) console.log(`  invalid: ${e}`);
    for (const f of report.findings) console.log(`  finding: ${f}`);
    for (const g of report.signals ?? []) console.log(`  signal: ${g}`);
    if (report.counts) console.log(`  ${report.counts.claims} claims, ${report.counts.open_questions} open questions, ${report.counts.empty_slots} empty evidence slots`);
    for (const l of report.limits) console.log(`  limit: ${l}`);
  }
  // Anything but clean exits 1: a finding is a broken promise, not a note.
  process.exit(report.status === "clean" ? 0 : 1);
}
