/**
 * project-brief/1 — what a piece is going to be, before it has an outline.
 *
 * Written by the prose-brainstorm skill (sources, angles, the chosen angle) and
 * the prose-interview skill (decisions, links). Both skills ship a byte-identical
 * copy of this file, pinned by tools/check-packaging.mjs. The human-readable form
 * is references/brief-schema.md; the store contract is docs/registry-stores.md.
 *
 * Unknown keys are refused at every level: this schema is new, so nothing older
 * writes it, and a misspelt field would otherwise be silently dropped.
 */
export const BRIEF_SCHEMA = "project-brief/1";
export const SOURCE_KINDS = Object.freeze(["transcript", "summary", "notes"]);

const SHA = /^[a-f0-9]{64}$/;
const ANGLE_ID = /^a[1-9]\d*$/;
const SEGMENT_ID = /^s[1-9]\d*$/;
const SHAPE = /^[a-z][a-z0-9-]{0,63}$/;
const nonempty = (s) => typeof s === "string" && s.trim().length > 0;
const isObject = (v) => v !== null && typeof v === "object" && !Array.isArray(v);
const unknownKeys = (obj, allowed, where, errors) => { for (const k of Object.keys(obj)) if (!allowed.includes(k)) errors.push(`${where}: unknown field ${k}`); };

/** An empty brief: what the first add-source starts from. */
export const emptyBrief = () => ({ sources: [], angles: [], unused_segments: [], chosen_angle: null, decisions: {}, links: [] });

/**
 * Errors for the payload. `validateDecisions` and `validateLinks` are hooks the
 * interview supplies (lib/decisions.mjs), called with the field and the whole
 * body; without them the two fields must merely be an object and an array.
 */
export function validateBriefBody(body, { validateDecisions = null, validateLinks = null } = {}) {
  const errors = [];
  if (!isObject(body)) return ["brief must be an object"];
  unknownKeys(body, ["sources", "angles", "unused_segments", "chosen_angle", "decisions", "links"], "brief", errors);
  if (!Array.isArray(body.sources)) errors.push("sources must be an array");
  else {
    const digests = new Set();
    body.sources.forEach((s, i) => {
      const at = `sources[${i}]`;
      if (!isObject(s)) { errors.push(`${at} must be an object`); return; }
      unknownKeys(s, ["kind", "digest", "words", "cached", "format"], at, errors);
      if (!SOURCE_KINDS.includes(s.kind)) errors.push(`${at}.kind must be ${SOURCE_KINDS.join(" | ")}`);
      if (!SHA.test(s.digest ?? "")) errors.push(`${at}.digest must be a sha256`);
      else if (digests.has(s.digest)) errors.push(`${at}: the same text is already a source`);
      digests.add(s.digest);
      if (!Number.isInteger(s.words) || s.words < 0) errors.push(`${at}.words must be an integer ≥ 0`);
      if (s.cached !== `sources/${s.digest}.txt`) errors.push(`${at}.cached must be sources/<digest>.txt`);
      if (s.format !== undefined && !nonempty(s.format)) errors.push(`${at}.format, when present, names the transcript format`);
    });
  }
  const angleIds = new Set();
  if (!Array.isArray(body.angles)) errors.push("angles must be an array");
  else {
    body.angles.forEach((a, i) => {
      const at = `angles[${i}]`;
      if (!isObject(a)) { errors.push(`${at} must be an object`); return; }
      unknownKeys(a, ["id", "title", "thesis", "audience", "shape", "uses", "leaves_out", "open_questions"], at, errors);
      if (!ANGLE_ID.test(a.id ?? "")) errors.push(`${at}.id must look like a1, a2, …`);
      else if (angleIds.has(a.id)) errors.push(`${at}: duplicate id ${a.id}`);
      angleIds.add(a.id);
      if (!nonempty(a.title)) errors.push(`${at}.title is required`);
      if (!nonempty(a.audience)) errors.push(`${at}.audience is required`);
      if (!SHAPE.test(a.shape ?? "")) errors.push(`${at}.shape must be a lower-case token`);
      if (!Array.isArray(a.open_questions) || !a.open_questions.every(nonempty)) errors.push(`${at}.open_questions must be a list of questions (may be empty)`);
      // Thin material yields open questions, never an invented thesis.
      if (a.thesis === null) { if (!a.open_questions?.length) errors.push(`${at}: a null thesis needs at least one open question saying what is missing`); }
      else if (!nonempty(a.thesis)) errors.push(`${at}.thesis is a sentence, or null with open questions`);
      if (!Array.isArray(a.uses) || !a.uses.length) errors.push(`${at}.uses must quote at least one passage the angle rests on`);
      else a.uses.forEach((u, j) => {
        const uat = `${at}.uses[${j}]`;
        if (!isObject(u)) { errors.push(`${uat} must be an object`); return; }
        unknownKeys(u, ["segment", "line", "quote"], uat, errors);
        if (!(SEGMENT_ID.test(u.segment ?? "") || u.segment === "summary")) errors.push(`${uat}.segment must be a scan segment id (s1, …) or "summary"`);
        if (!Number.isInteger(u.line) || u.line < 1) errors.push(`${uat}.line must be an integer ≥ 1`);
        if (!nonempty(u.quote)) errors.push(`${uat}.quote is required`);
      });
      if (!Array.isArray(a.leaves_out) || !a.leaves_out.every((s) => SEGMENT_ID.test(s))) errors.push(`${at}.leaves_out must be a list of segment ids`);
    });
  }
  if (!Array.isArray(body.unused_segments) || !body.unused_segments.every((s) => SEGMENT_ID.test(s))) errors.push("unused_segments must be a list of segment ids");
  if (body.chosen_angle !== null && !angleIds.has(body.chosen_angle)) errors.push("chosen_angle must be null or the id of one of the angles");
  if (!isObject(body.decisions)) errors.push("decisions must be an object");
  else if (validateDecisions) errors.push(...validateDecisions(body.decisions, body));
  if (!Array.isArray(body.links)) errors.push("links must be an array");
  else if (validateLinks) errors.push(...validateLinks(body.links, body));
  return errors;
}

/** Envelope (docs/registry-stores.md) plus payload. */
export function validateBrief(doc, hooks) {
  const errors = [];
  if (doc?.schema !== BRIEF_SCHEMA) errors.push(`schema must be ${BRIEF_SCHEMA}`);
  if (!nonempty(doc?.id)) errors.push("id (the project) is required");
  if (!Number.isInteger(doc?.revision) || doc.revision < 1) errors.push("revision must be an integer ≥ 1");
  if (doc?.revision === 1 ? doc?.parent_digest !== null : !SHA.test(doc?.parent_digest ?? "")) errors.push("invalid revision ancestry");
  const body = { ...doc }; for (const k of ["schema", "id", "revision", "parent_digest"]) delete body[k];
  return [...errors, ...validateBriefBody(body, hooks)];
}

/** The payload of a stored document, without its envelope. */
export const bodyOf = (doc) => { const b = { ...doc }; for (const k of ["schema", "id", "revision", "parent_digest"]) delete b[k]; return b; };
