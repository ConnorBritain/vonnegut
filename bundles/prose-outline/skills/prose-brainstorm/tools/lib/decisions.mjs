/**
 * decisions — the interview's decision tree, as data.
 *
 * A fixed tree, not a model's improvisation: which question comes next and
 * whether the interview is finished are computed from it (brief-check.mjs), so
 * an interview is resumable in another session and "are we done?" is a count.
 * The human-readable form is references/decisions.md.
 */
export const DECISIONS = Object.freeze([
  { id: "angle", asks: "Which angle is this piece — one of the brainstormed ones, or a new one?", depends: [], required: true, value: "angle" },
  { id: "audience", asks: "Who is this for, and what do they already know?", depends: ["angle"], required: true, value: "text" },
  { id: "purpose", asks: "What should the reader think or do after reading it?", depends: ["angle", "audience"], required: true, value: "text" },
  { id: "form", asks: "What form is it — newsletter, essay, post, talk — and how is it delivered?", depends: ["audience"], required: true, value: "form" },
  { id: "length", asks: "How long, as a band in words?", depends: ["form"], required: true, value: "length" },
  { id: "shape", asks: "What shape should it take?", depends: ["form", "length"], required: true, value: "token" },
  { id: "thesis", asks: "In one sentence, what does the piece argue (or, for a story, what is its premise)?", depends: ["angle", "purpose"], required: true, value: "text" },
  { id: "must_include", asks: "What has to be in it — stories, examples, facts?", depends: ["thesis"], required: false, value: "list" },
  { id: "exclude", asks: "What stays out?", depends: ["thesis"], required: false, value: "list" },
  { id: "links", asks: "Which earlier pieces, outlines, bible entries or research claims should it connect to?", depends: ["thesis"], required: false, value: "links" },
  { id: "assumptions", asks: "Which claims should be checked before drafting?", depends: ["thesis"], required: false, value: "list" },
]);
export const BY_ID = Object.freeze(Object.fromEntries(DECISIONS.map((d) => [d.id, d])));
export const SOURCES = Object.freeze(["writer", "transcript", "summary", "outlines", "bible", "research", "corpus", "recommended"]);
export const MEDIA = Object.freeze(["web", "tts", "print"]);
export const LINK_KINDS = Object.freeze(["outline", "bible-entry", "research-claim", "corpus-piece"]);

const TOKEN = /^[a-z][a-z0-9-]{0,63}$/;
const ANGLE_ID = /^a[1-9]\d*$/;
const nonempty = (s) => typeof s === "string" && s.trim().length > 0;
const isObject = (v) => v !== null && typeof v === "object" && !Array.isArray(v);

/** Every ancestor of a decision, transitively. */
export function ancestors(id) {
  const out = new Set();
  const visit = (d) => { for (const dep of BY_ID[d].depends) if (!out.has(dep)) { out.add(dep); visit(dep); } };
  visit(id);
  return [...out];
}

function valueErrors(def, value, body, at) {
  switch (def.value) {
    case "angle":
      if (!nonempty(value)) return [`${at}.value is an angle id or a new angle's title`];
      if (ANGLE_ID.test(value) && !(body?.angles ?? []).some((a) => a.id === value)) return [`${at}.value names angle ${value}, which the brief does not have`];
      return [];
    case "text": return nonempty(value) ? [] : [`${at}.value must be a sentence`];
    case "token": return TOKEN.test(value ?? "") ? [] : [`${at}.value must be a lower-case token`];
    case "form":
      return isObject(value) && TOKEN.test(value.form ?? "") && MEDIA.includes(value.medium) && Object.keys(value).every((k) => ["form", "medium"].includes(k))
        ? [] : [`${at}.value must be { form: <token>, medium: ${MEDIA.join(" | ")} }`];
    case "length":
      return isObject(value) && value.unit === "words" && Number.isInteger(value.min) && Number.isInteger(value.max) && value.min >= 1 && value.min <= value.max
        && Object.keys(value).every((k) => ["unit", "min", "max"].includes(k))
        ? [] : [`${at}.value must be { unit: "words", min, max } with 1 ≤ min ≤ max`];
    case "list": return Array.isArray(value) && value.every(nonempty) ? [] : [`${at}.value must be a list of non-empty strings (may be empty)`];
    case "links": {
      if (!Array.isArray(value) || !value.every(nonempty)) return [`${at}.value must be a list of link refs`];
      const known = new Set((body?.links ?? []).map((l) => l.ref));
      const missing = value.filter((r) => !known.has(r));
      return missing.length ? [`${at}.value cites links the brief does not list: ${missing.join(", ")}`] : [];
    }
    default: return [`${at}: unknown value kind ${def.value}`];
  }
}

/**
 * Errors in a brief's `decisions`. A record is
 *   { value, source, evidence?, confirmed, at_revision, skipped? }
 * A skipped decision has value null and the writer's reason in `skipped`.
 * A value whose source is not the writer must carry evidence (a recommendation
 * excepted), and stays unconfirmed until the writer says yes.
 */
export function validateDecisions(decisions, body = null) {
  const errors = [];
  for (const [id, rec] of Object.entries(decisions ?? {})) {
    const at = `decisions.${id}`;
    const def = BY_ID[id];
    if (!def) { errors.push(`${at}: not a decision in the tree`); continue; }
    if (!isObject(rec)) { errors.push(`${at} must be an object`); continue; }
    for (const k of Object.keys(rec)) if (!["value", "source", "evidence", "confirmed", "at_revision", "skipped"].includes(k)) errors.push(`${at}: unknown field ${k}`);
    if (!SOURCES.includes(rec.source)) errors.push(`${at}.source must be ${SOURCES.join(" | ")}`);
    if (typeof rec.confirmed !== "boolean") errors.push(`${at}.confirmed must be true or false`);
    if (!Number.isInteger(rec.at_revision) || rec.at_revision < 1) errors.push(`${at}.at_revision must be the brief revision it was set at`);
    if (rec.skipped !== undefined) {
      if (!nonempty(rec.skipped)) errors.push(`${at}.skipped holds the writer's reason`);
      if (rec.value !== null) errors.push(`${at}: a skipped decision has value null`);
      if (rec.source !== "writer") errors.push(`${at}: only the writer skips a question`);
    } else errors.push(...valueErrors(def, rec.value, body, at));
    const needsEvidence = !["writer", "recommended"].includes(rec.source);
    if (needsEvidence) {
      const e = rec.evidence;
      if (!isObject(e) || !nonempty(e.ref) || !nonempty(e.quote) || (e.line !== undefined && (!Number.isInteger(e.line) || e.line < 1))) errors.push(`${at}.evidence must be { ref, quote, line? } when the source is ${rec.source}`);
      else for (const k of Object.keys(e)) if (!["ref", "quote", "line"].includes(k)) errors.push(`${at}.evidence: unknown field ${k}`);
      if (["transcript", "summary"].includes(rec.source) && !Number.isInteger(e?.line)) errors.push(`${at}.evidence.line is required for a ${rec.source} quote`);
    } else if (rec.evidence !== undefined) errors.push(`${at}: evidence is for sourced answers; the writer's own answer needs none`);
  }
  return errors;
}

/** Errors in a brief's `links`. */
export function validateLinks(links) {
  const errors = [];
  const refs = new Set();
  (links ?? []).forEach((l, i) => {
    const at = `links[${i}]`;
    if (!isObject(l)) { errors.push(`${at} must be an object`); return; }
    for (const k of Object.keys(l)) if (!["kind", "ref", "why"].includes(k)) errors.push(`${at}: unknown field ${k}`);
    if (!LINK_KINDS.includes(l.kind)) errors.push(`${at}.kind must be ${LINK_KINDS.join(" | ")}`);
    if (!nonempty(l.ref)) errors.push(`${at}.ref is required`);
    else if (refs.has(l.ref)) errors.push(`${at}: duplicate ref ${l.ref}`);
    refs.add(l.ref);
    if (!nonempty(l.why)) errors.push(`${at}.why says what the connection is`);
  });
  return errors;
}

export const HOOKS = Object.freeze({ validateDecisions, validateLinks });
