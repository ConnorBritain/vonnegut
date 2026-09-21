#!/usr/bin/env node
/**
 * outline-diff — compare two voice-outline/1 documents by node id.
 *
 *   node outline-diff.mjs <before.json> <after.json> [--json]
 *
 * BY ID, NEVER BY TEXT. A node that keeps its id and changes its text is
 * `reworded`; a node whose id disappears is `removed`, even if another node
 * appears with the same words — that is `added`. Guessing a mapping would let a
 * rewording look like a move and a move look like a deletion, and a differ
 * whose output cannot be checked is not a differ. Position is the node's index
 * among its siblings, so `moved` means "different place among the same
 * siblings" or "different parent" (`reparented`), never "the text moved".
 */
import { existsSync, readFileSync, realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { children, validateOutline, validateOutlineBody } from "./lib/outline-schema.mjs";

export const OUTLINE_DIFF_VERSION = "outline-diff/1";

function positions(body) {
  const map = new Map();
  const walk = (parent) => { children(body, parent).forEach((n, i) => { map.set(n.id, { parent, index: i }); walk(n.id); }); };
  walk(null);
  // Orphans (invalid parents) are still positioned so a diff over a slightly broken doc does not silently drop them.
  for (const n of body.nodes) if (!map.has(n.id)) map.set(n.id, { parent: n.parent, index: null });
  return map;
}

export function diffOutlines(before, after) {
  for (const [label, doc] of [["before", before], ["after", after]]) {
    const errors = (doc?.revision !== undefined ? validateOutline : validateOutlineBody)(doc);
    if (errors.length) throw new TypeError(`${label}: ${errors.join("; ")}`);
  }
  const A = new Map(before.nodes.map((n) => [n.id, n])), B = new Map(after.nodes.map((n) => [n.id, n]));
  const posA = positions(before), posB = positions(after);
  const out = { schema: OUTLINE_DIFF_VERSION, before: { revision: before.revision ?? null }, after: { revision: after.revision ?? null },
    mode_changed: before.mode !== after.mode ? { before: before.mode, after: after.mode } : null,
    title: before.title !== after.title ? { before: before.title, after: after.title } : null,
    thesis: before.thesis !== after.thesis ? { before: before.thesis, after: after.thesis } : null,
    added: [], removed: [], moved: [], reparented: [], reworded: [], kind_changed: [], evidence: [] };
  for (const id of B.keys()) if (!A.has(id)) out.added.push(id);
  for (const id of A.keys()) if (!B.has(id)) out.removed.push(id);
  for (const [id, a] of A) {
    const b = B.get(id);
    if (!b) continue;
    const pa = posA.get(id), pb = posB.get(id);
    if (pa.parent !== pb.parent) out.reparented.push({ id, from: pa.parent, to: pb.parent });
    else if (pa.index !== pb.index) out.moved.push({ id, from: pa.index + 1, to: pb.index + 1, parent: pa.parent });
    if (a.text !== b.text) out.reworded.push({ id, before: a.text, after: b.text });
    if (a.kind !== b.kind) out.kind_changed.push({ id, before: a.kind, after: b.kind });
    const ea = new Map((a.evidence ?? []).map((e) => [e.slot, e.filled_by])), eb = new Map((b.evidence ?? []).map((e) => [e.slot, e.filled_by]));
    for (const slot of new Set([...ea.keys(), ...eb.keys()])) {
      if (!ea.has(slot)) out.evidence.push({ id, slot, change: "slot-added", filled_by: eb.get(slot) });
      else if (!eb.has(slot)) out.evidence.push({ id, slot, change: "slot-removed", filled_by: ea.get(slot) });
      else if (ea.get(slot) !== eb.get(slot)) out.evidence.push({ id, slot, change: ea.get(slot) === null ? "filled" : eb.get(slot) === null ? "emptied" : "refilled", before: ea.get(slot), after: eb.get(slot) });
    }
  }
  out.unchanged = [...A.keys()].filter((id) => B.has(id) && !out.moved.some((m) => m.id === id) && !out.reparented.some((m) => m.id === id) && !out.reworded.some((m) => m.id === id) && !out.kind_changed.some((m) => m.id === id) && !out.evidence.some((m) => m.id === id)).length;
  out.summary = `${out.added.length} added, ${out.removed.length} removed, ${out.moved.length} moved, ${out.reparented.length} reparented, ${out.reworded.length} reworded, ${out.evidence.length} evidence changes, ${out.unchanged} unchanged`;
  return out;
}

export function renderDiff(d, before, after) {
  const text = (doc, id) => doc.nodes.find((n) => n.id === id)?.text ?? "?";
  const out = [`outline-diff — ${d.summary}`];
  if (d.mode_changed) out.push(`  mode: ${d.mode_changed.before} → ${d.mode_changed.after}`);
  if (d.title) out.push(`  title: "${d.title.before}" → "${d.title.after}"`);
  if (d.thesis) out.push(`  thesis: "${d.thesis.before}" → "${d.thesis.after}"`);
  for (const id of d.added) out.push(`  + ${id}  ${text(after, id)}`);
  for (const id of d.removed) out.push(`  - ${id}  ${text(before, id)}`);
  for (const m of d.moved) out.push(`  ↕ ${m.id}  position ${m.from} → ${m.to}  ${text(after, m.id)}`);
  for (const m of d.reparented) out.push(`  ↳ ${m.id}  under ${m.from ?? "root"} → ${m.to ?? "root"}`);
  for (const r of d.reworded) out.push(`  ~ ${r.id}  "${r.before}" → "${r.after}"`);
  for (const k of d.kind_changed) out.push(`  ≠ ${k.id}  ${k.before} → ${k.after}`);
  for (const e of d.evidence) out.push(`  e ${e.id}/${e.slot}  ${e.change}${e.after !== undefined ? `: ${e.before ?? "∅"} → ${e.after ?? "∅"}` : ""}`);
  out.push("  Nodes are matched by id only; a node that vanished is removed, never guessed to be a rewording.");
  return out.join("\n");
}

if (process.argv[1] && existsSync(process.argv[1]) && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const files = args.filter((a) => !a.startsWith("--"));
  const unknown = args.filter((a) => a.startsWith("--") && a !== "--json");
  if (files.length !== 2 || unknown.length) { console.error("Usage: node outline-diff.mjs <before.json> <after.json> [--json]"); process.exit(2); }
  for (const f of files) if (!existsSync(f)) { console.error(`outline-diff: not a file: ${f}`); process.exit(2); }
  try {
    const [before, after] = files.map((f) => JSON.parse(readFileSync(f, "utf8")));
    const d = diffOutlines(before, after);
    process.stdout.write(args.includes("--json") ? `${JSON.stringify(d, null, 2)}\n` : `${renderDiff(d, before, after)}\n`);
  } catch (e) { console.error(`outline-diff: ${e.message}`); process.exit(1); }
}
