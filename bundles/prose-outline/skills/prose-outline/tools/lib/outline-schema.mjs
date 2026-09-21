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
 */
export const OUTLINE_SCHEMA = "voice-outline/1";
export const MODES = Object.freeze({
  argument: ["claim", "evidence-slot", "open-question"],
  "beat-sheet": ["act", "beat", "turn", "open-question"],
});
const ID = /^n[1-9]\d*$/;
const SLOT = /^e[1-9]\d*$/;
const DIGEST = /^[a-f0-9]{64}$/;
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
  if (!nonempty(body.thesis)) errors.push(body.mode === "argument" ? "thesis is required" : "thesis (the premise) is required");
  if (!Array.isArray(body.nodes)) return [...errors, "nodes must be an array"];
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
