/**
 * voice-outline/1 — the outline document the skill proposes, the store keeps
 * and the differ compares.
 *
 * Two modes share one schema. `argument` nodes are claims (each with evidence
 * slots), evidence-slots standing alone, and open questions; `beat-sheet` nodes
 * are acts, beats and turns, plus open questions. The vocabulary is the only
 * thing that differs, so there is one store, one differ and one set of guards.
 *
 * Node ids are stable across revisions and the differ keys on them. A node is
 * never matched by its text.
 *
 * Optional fields (roadmap item J), validated when present and ignored by
 * readers that predate them, so the schema id stays voice-outline/1:
 *   length     { unit: "words", min, max } — the band the piece is planned to
 *   shape      the shape name (shapes/<name>.md)
 *   brief_ref  { project, revision, digest } — the brief the outline came from
 *   nodes[].part    which of the shape's parts a node belongs to
 *   nodes[].words   the node's word budget; no node with a budget sits under another
 *   nodes[].covers  brief decisions the node carries, e.g. "must_include.0"
 * Any other unknown key is still ignored, as it always was.
 */
export const OUTLINE_SCHEMA = "voice-outline/1";
export const MODES = Object.freeze({
  argument: ["claim", "evidence-slot", "open-question"],
  "beat-sheet": ["act", "beat", "turn", "open-question"],
});
const ID = /^n[1-9]\d*$/;
const SLOT = /^e[1-9]\d*$/;
const DIGEST = /^[a-f0-9]{64}$/;
const TOKEN = /^[a-z][a-z0-9-]{0,63}$/;
const COVER = /^[a-z][a-z_]*(?:\.\d+)?$/;
const PROJECT = /^[a-zA-Z0-9][a-zA-Z0-9_-]{0,63}$/;
const isObject = (v) => v !== null && typeof v === "object" && !Array.isArray(v);
const nonempty = (s) => typeof s === "string" && s.trim().length > 0;

/** Errors for a full document (envelope included). Empty array means valid. */
export function validateOutline(doc) {
  const errors = [];
  if (doc?.schema !== OUTLINE_SCHEMA) return [`Expected schema ${OUTLINE_SCHEMA}`];
  if (!nonempty(doc.id)) errors.push("Outline needs a project id");
  if (!Number.isInteger(doc.revision) || doc.revision < 1) errors.push("Revision must be an integer ≥ 1");
  if (doc.revision === 1 ? doc.parent_digest !== null : !DIGEST.test(doc.parent_digest ?? "")) errors.push("Invalid revision ancestry");
  errors.push(...validateOutlineBody(doc));
  return errors;
}

/** Errors for the body alone — what the skill proposes before the store adds an envelope. */
export function validateOutlineBody(body) {
  const errors = [];
  if (!Object.hasOwn(MODES, body?.mode)) return [`mode must be ${Object.keys(MODES).join(" | ")}`];
  const kinds = MODES[body.mode];
  if (!nonempty(body.title)) errors.push("title is required");
  if (!Array.isArray(body.nodes)) return [...errors, "nodes must be an array"];
  // A thesis may be withheld — but only when the outline says why, with at
  // least one open question. An underspecified brief yields questions, not an
  // invented thesis; a proposal with neither is not an outline.
  const openQuestions = body.nodes.filter((n) => n?.kind === "open-question").length;
  if (body.thesis === null) { if (!openQuestions) errors.push("thesis may be null only when at least one open-question node says what is missing"); }
  else if (!nonempty(body.thesis)) errors.push(body.mode === "argument" ? "thesis is required (or null with open questions)" : "thesis (the premise) is required (or null with open questions)");
  const ids = new Set();
  for (const n of body.nodes) {
    const where = `node ${n?.id ?? "?"}`;
    if (!ID.test(n?.id ?? "")) { errors.push(`${where}: id must look like n1, n2, …`); continue; }
    if (ids.has(n.id)) errors.push(`${where}: duplicate id`);
    ids.add(n.id);
    if (!kinds.includes(n.kind)) errors.push(`${where}: kind must be ${kinds.join(" | ")} in ${body.mode} mode`);
    if (!nonempty(n.text)) errors.push(`${where}: text is required`);
    if (!Number.isInteger(n.order) || n.order < 1) errors.push(`${where}: order must be an integer ≥ 1`);
    if (n.parent !== null && !ID.test(n.parent ?? "")) errors.push(`${where}: parent must be null or a node id`);
    if (n.kind === "claim") {
      if (!Array.isArray(n.evidence)) errors.push(`${where}: a claim carries an evidence array (may be empty)`);
      else {
        const slots = new Set();
        for (const e of n.evidence) {
          if (!SLOT.test(e?.slot ?? "")) errors.push(`${where}: evidence slot ids look like e1, e2, …`);
          if (slots.has(e?.slot)) errors.push(`${where}: duplicate evidence slot ${e.slot}`);
          slots.add(e?.slot);
          if (e?.filled_by !== null && !nonempty(e?.filled_by)) errors.push(`${where}: filled_by is null or a non-empty pointer`);
        }
      }
    } else if (n.evidence !== undefined) errors.push(`${where}: only a claim carries evidence`);
  }
  for (const n of body.nodes) if (n?.parent && !ids.has(n.parent)) errors.push(`node ${n.id}: parent ${n.parent} does not exist`);
  errors.push(...validatePlanFields(body));
  for (const n of body.nodes) if (n?.parent === n?.id) errors.push(`node ${n.id}: a node cannot parent itself`);
  const src = body.source;
  if (src !== undefined) {
    if (!src || typeof src !== "object") errors.push("source must be an object");
    else for (const key of ["brief_digest", "draft_digest"]) if (src[key] !== null && src[key] !== undefined && !DIGEST.test(src[key])) errors.push(`source.${key} must be a sha256 or null`);
  }
  return errors;
}

/** Children of `parent` in order. */
export const children = (body, parent) => body.nodes.filter((n) => n.parent === parent).sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));

/** The optional planning fields (item J): length, shape, brief_ref, and per-node part, words, covers. */
export function validatePlanFields(body) {
  const errors = [];
  if (body.length !== undefined) {
    const l = body.length;
    if (!isObject(l) || l.unit !== "words" || !Number.isInteger(l.min) || !Number.isInteger(l.max) || l.min < 1 || l.min > l.max || Object.keys(l).some((k) => !["unit", "min", "max"].includes(k))) errors.push('length must be { unit: "words", min, max } with 1 ≤ min ≤ max');
  }
  if (body.shape !== undefined && !TOKEN.test(body.shape ?? "")) errors.push("shape must be a shape name (a lower-case token)");
  if (body.brief_ref !== undefined) {
    const b = body.brief_ref;
    if (!isObject(b) || !PROJECT.test(b.project ?? "") || !Number.isInteger(b.revision) || b.revision < 1 || !DIGEST.test(b.digest ?? "") || Object.keys(b).some((k) => !["project", "revision", "digest"].includes(k))) errors.push("brief_ref must be { project, revision, digest }");
  }
  const byId = new Map((body.nodes ?? []).map((n) => [n?.id, n]));
  for (const n of body.nodes ?? []) {
    const where = `node ${n?.id ?? "?"}`;
    if (n?.part !== undefined) {
      if (!TOKEN.test(n.part ?? "")) errors.push(`${where}: part must be a lower-case token`);
      if (body.shape === undefined) errors.push(`${where}: a part names one of the shape's parts, so the outline needs a shape`);
    }
    if (n?.words !== undefined) {
      if (!Number.isInteger(n.words) || n.words < 1) errors.push(`${where}: words is a budget, an integer ≥ 1`);
      // A budget under another budget would be counted twice.
      for (let p = byId.get(n.parent), hops = 0; p && hops < 1000; p = byId.get(p.parent), hops += 1) {
        if (p.words !== undefined) { errors.push(`${where}: has a word budget under ${p.id}, which has one too`); break; }
      }
    }
    if (n?.covers !== undefined && (!Array.isArray(n.covers) || !n.covers.every((c) => COVER.test(c ?? "")))) errors.push(`${where}: covers lists brief decisions, e.g. "must_include.0"`);
  }
  return errors;
}

/** Nodes in reading order: depth-first, siblings by order. */
export function readingOrder(body) {
  const out = [];
  const visit = (parent) => { for (const n of children(body, parent)) { out.push(n); visit(n.id); } };
  visit(null);
  return out;
}
