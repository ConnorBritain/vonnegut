/**
 * outline-handoff — the subset of voice-outline/1 and project-brief/1 that
 * prose-author reads to draft from an approved outline.
 *
 * The contract is docs/contracts/outline-handoff.md. Both schemas belong to
 * prose-outline, and a bundle may not import another bundle's code, so this is
 * a PORT of the read side only — node shape, plan fields, the decision tree's
 * dependencies and staleness — pinned to prose-outline's own validators by a
 * parity test (tests/suite-outline-handoff.mjs) that imports them at test time
 * and SKIPs when the sibling is absent.
 *
 * What the port does NOT do: verify a brief's transcript quotes (that needs the
 * cached transcript, and is brief-check's job) or write anything.
 */
export const OUTLINE_SCHEMA = "voice-outline/1";
export const BRIEF_SCHEMA = "project-brief/1";
export const MODES = Object.freeze({ argument: ["claim", "evidence-slot", "open-question"], "beat-sheet": ["act", "beat", "turn", "open-question"] });
/** The interview's tree: id → dependencies, and which are required. Mirrors prose-outline's lib/decisions.mjs. */
export const DECISION_DEPENDS = Object.freeze({
  angle: [], audience: ["angle"], purpose: ["angle", "audience"], form: ["audience"], length: ["form"], shape: ["form", "length"],
  thesis: ["angle", "purpose"], must_include: ["thesis"], exclude: ["thesis"], links: ["thesis"], assumptions: ["thesis"],
});
export const REQUIRED = Object.freeze(["angle", "audience", "purpose", "form", "length", "shape", "thesis"]);

const ID = /^n[1-9]\d*$/;
const SLOT = /^e[1-9]\d*$/;
const DIGEST = /^[a-f0-9]{64}$/;
const TOKEN = /^[a-z][a-z0-9-]{0,63}$/;
const COVER = /^[a-z][a-z_]*(?:\.\d+)?$/;
const PROJECT = /^[a-zA-Z0-9][a-zA-Z0-9_-]{0,63}$/;
const nonempty = (s) => typeof s === "string" && s.trim().length > 0;
const isObject = (v) => v !== null && typeof v === "object" && !Array.isArray(v);

/** Errors in an outline body (or a stored document; the envelope is checked when present). */
export function outlineErrors(doc) {
  const errors = [];
  if (doc?.schema !== undefined) {
    if (doc.schema !== OUTLINE_SCHEMA) return [`Expected schema ${OUTLINE_SCHEMA}`];
    if (!nonempty(doc.id)) errors.push("Outline needs a project id");
    if (!Number.isInteger(doc.revision) || doc.revision < 1) errors.push("Revision must be an integer ≥ 1");
    if (doc.revision === 1 ? doc.parent_digest !== null : !DIGEST.test(doc.parent_digest ?? "")) errors.push("Invalid revision ancestry");
  }
  if (!Object.hasOwn(MODES, doc?.mode)) return [...errors, `mode must be ${Object.keys(MODES).join(" | ")}`];
  if (!nonempty(doc.title)) errors.push("title is required");
  if (!Array.isArray(doc.nodes)) return [...errors, "nodes must be an array"];
  const kinds = MODES[doc.mode];
  const openQuestions = doc.nodes.filter((n) => n?.kind === "open-question").length;
  if (doc.thesis === null) { if (!openQuestions) errors.push("a null thesis needs an open question"); }
  else if (!nonempty(doc.thesis)) errors.push("thesis is required (or null with open questions)");
  const ids = new Set();
  const byId = new Map(doc.nodes.map((n) => [n?.id, n]));
  for (const n of doc.nodes) {
    const where = `node ${n?.id ?? "?"}`;
    if (!ID.test(n?.id ?? "")) { errors.push(`${where}: bad id`); continue; }
    if (ids.has(n.id)) errors.push(`${where}: duplicate id`);
    ids.add(n.id);
    if (!kinds.includes(n.kind)) errors.push(`${where}: bad kind`);
    if (!nonempty(n.text)) errors.push(`${where}: text is required`);
    if (!Number.isInteger(n.order) || n.order < 1) errors.push(`${where}: bad order`);
    if (n.parent !== null && !ID.test(n.parent ?? "")) errors.push(`${where}: bad parent`);
    if (n.kind === "claim") {
      if (!Array.isArray(n.evidence)) errors.push(`${where}: a claim carries an evidence array`);
      else {
        const slots = new Set();
        for (const e of n.evidence) {
          if (!SLOT.test(e?.slot ?? "")) errors.push(`${where}: bad evidence slot`);
          if (slots.has(e?.slot)) errors.push(`${where}: duplicate evidence slot`);
          slots.add(e?.slot);
          if (e?.filled_by !== null && !nonempty(e?.filled_by)) errors.push(`${where}: filled_by is null or a pointer`);
        }
      }
    } else if (n.evidence !== undefined) errors.push(`${where}: only a claim carries evidence`);
    if (n.part !== undefined && (!TOKEN.test(n.part ?? "") || doc.shape === undefined)) errors.push(`${where}: a part needs a token and an outline shape`);
    if (n.words !== undefined) {
      if (!Number.isInteger(n.words) || n.words < 1) errors.push(`${where}: words is an integer ≥ 1`);
      for (let p = byId.get(n.parent), hops = 0; p && hops < 1000; p = byId.get(p.parent), hops += 1) if (p.words !== undefined) { errors.push(`${where}: a budget under a budget`); break; }
    }
    if (n.covers !== undefined && (!Array.isArray(n.covers) || !n.covers.every((c) => COVER.test(c ?? "")))) errors.push(`${where}: bad covers`);
  }
  for (const n of doc.nodes) if (n?.parent && !ids.has(n.parent)) errors.push(`node ${n.id}: missing parent`);
  for (const n of doc.nodes) if (n?.parent && n.parent === n.id) errors.push(`node ${n.id}: parents itself`);
  if (doc.source !== undefined) {
    if (!isObject(doc.source)) errors.push("source must be an object");
    else for (const k of ["brief_digest", "draft_digest"]) if (doc.source[k] !== null && doc.source[k] !== undefined && !DIGEST.test(doc.source[k])) errors.push(`source.${k} must be a sha256 or null`);
  }
  if (doc.length !== undefined) {
    const l = doc.length;
    if (!isObject(l) || l.unit !== "words" || !Number.isInteger(l.min) || !Number.isInteger(l.max) || l.min < 1 || l.min > l.max || Object.keys(l).some((k) => !["unit", "min", "max"].includes(k))) errors.push("bad length band");
  }
  if (doc.shape !== undefined && !TOKEN.test(doc.shape ?? "")) errors.push("bad shape");
  if (doc.brief_ref !== undefined) {
    const b = doc.brief_ref;
    if (!isObject(b) || !PROJECT.test(b.project ?? "") || !Number.isInteger(b.revision) || b.revision < 1 || !DIGEST.test(b.digest ?? "") || Object.keys(b).some((k) => !["project", "revision", "digest"].includes(k))) errors.push("bad brief_ref");
  }
  return errors;
}

/** Nodes in reading order: depth-first, siblings by order then id. */
export function readingOrder(doc) {
  const kids = (parent) => doc.nodes.filter((n) => n.parent === parent).sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
  const out = [];
  const visit = (parent) => { for (const n of kids(parent)) { out.push(n); visit(n.id); } };
  visit(null);
  return out;
}

const ancestors = (id) => { const out = new Set(); const v = (d) => { for (const p of DECISION_DEPENDS[d] ?? []) if (!out.has(p)) { out.add(p); v(p); } }; v(id); return [...out]; };

/**
 * Which required decisions are not settled, and why: open, skipped, unconfirmed
 * or stale (an answer set before something it depends on last changed). This
 * is brief-check's rule without the evidence re-verification.
 */
export function briefState(brief) {
  const d = brief?.decisions;
  if (!isObject(d)) return { valid: false, errors: ["brief has no decisions object"] };
  const unsettled = [];
  const isStale = (id) => ancestors(id).some((a) => d[a] && d[id] && d[a].at_revision > d[id].at_revision);
  for (const id of REQUIRED) {
    if (!d[id]) unsettled.push({ decision: id, why: "open" });
    else if (d[id].skipped !== undefined) unsettled.push({ decision: id, why: "skipped" });
    else if (d[id].confirmed !== true) unsettled.push({ decision: id, why: "unconfirmed" });
    else if (isStale(id)) unsettled.push({ decision: id, why: "stale" });
  }
  const settled = (id) => d[id] && d[id].skipped === undefined && d[id].confirmed === true && !isStale(id);
  return { valid: true, unsettled, settled, decisions: d };
}

export const bodyOf = (doc) => { const b = { ...doc }; for (const k of ["schema", "id", "revision", "parent_digest"]) delete b[k]; return b; };
