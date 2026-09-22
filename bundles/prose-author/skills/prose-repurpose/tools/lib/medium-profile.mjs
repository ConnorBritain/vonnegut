/**
 * medium-profile — the `medium-profile/1` contract (docs/contracts/medium-profile.md),
 * validated on load with unknown fields refused by name.
 *
 * FORM is what is being written (newsletter, linkedin-post, thread, talk-abstract)
 * and scopes preferences on the existing `forms` axis. MEDIUM is how it is
 * delivered (web, tts, print), the vocabulary PROFILES.md reserves for
 * `profile.json → medium`, and the medium critic's spawn condition. One word,
 * one meaning, in both bundles that read this file.
 */
import { createHash } from "node:crypto";

export const PROFILE_SCHEMA = "medium-profile/1";
export const MEDIA = ["web", "tts", "print"];
export const FORM = /^[a-z0-9][a-z0-9-]{0,63}$/;
export const LENGTH_UNITS = ["words", "characters"];

/** Mechanical rule types repurpose-check.mjs evaluates on the final bytes. Anything else is refused. */
export const RULE_TYPES = {
  max_words: ["max"],
  min_words: ["min"],
  max_characters: ["max"],
  max_segments: ["max"],
  max_segment_characters: ["max"],
  no_urls_in_segment: ["segment"],
  no_headings: [],
  max_hashtags: ["max"],
  single_paragraph: [],
  ends_with_question: [],
};

const isObj = (v) => v && typeof v === "object" && !Array.isArray(v);
const int = (v) => Number.isInteger(v) && v >= 0;

export function validateProfile(p) {
  const errors = [];
  if (!isObj(p)) return ["profile must be an object"];
  const allowed = ["schema", "form", "medium", "length", "segments", "structure", "constraints", "delivery_notes", "checked"];
  for (const k of Object.keys(p)) if (!allowed.includes(k)) errors.push(`unknown field ${k}`);
  for (const k of ["schema", "form", "medium", "length", "structure", "constraints", "delivery_notes", "checked"]) if (!(k in p)) errors.push(`missing ${k}`);
  if (p.schema !== PROFILE_SCHEMA) errors.push(`schema must be ${PROFILE_SCHEMA}`);
  if (!FORM.test(p.form ?? "")) errors.push("form must be a lower-case token");
  if (!MEDIA.includes(p.medium)) errors.push(`medium must be one of ${MEDIA.join(", ")}`);
  if (!isObj(p.length) || !LENGTH_UNITS.includes(p.length.unit) || !int(p.length.min) || !int(p.length.max) || p.length.min > p.length.max) errors.push("length must be { unit: words|characters, min ≤ max }");
  else for (const k of Object.keys(p.length)) if (!["unit", "min", "max"].includes(k)) errors.push(`length: unknown field ${k}`);
  if (p.segments !== undefined && p.segments !== null) {
    if (!isObj(p.segments) || !int(p.segments.max_count) || !int(p.segments.max_characters) || typeof p.segments.separator !== "string" || !p.segments.separator) errors.push("segments must be { max_count, max_characters, separator }");
    else for (const k of Object.keys(p.segments)) if (!["max_count", "max_characters", "separator"].includes(k)) errors.push(`segments: unknown field ${k}`);
  }
  if (!Array.isArray(p.structure) || !p.structure.length || !p.structure.every((s) => typeof s === "string" && /^[a-z][a-z-]*$/.test(s))) errors.push("structure must be a non-empty list of lower-case part names");
  if (!Array.isArray(p.constraints)) errors.push("constraints must be an array");
  else {
    const ids = new Set();
    p.constraints.forEach((c, i) => {
      const at = `constraints[${i}]`;
      if (!isObj(c)) { errors.push(`${at} must be an object`); return; }
      for (const k of Object.keys(c)) if (!["id", "kind", "rule", "note"].includes(k)) errors.push(`${at}: unknown field ${k}`);
      if (!/^[a-z0-9][a-z0-9-]*$/.test(c.id ?? "")) errors.push(`${at}.id must be a lower-case token`);
      if (ids.has(c.id)) errors.push(`${at}: duplicate id ${c.id}`); ids.add(c.id);
      if (!["mechanical", "semantic"].includes(c.kind)) errors.push(`${at}.kind must be mechanical or semantic`);
      if (c.kind === "mechanical") {
        if (!isObj(c.rule) || !Object.hasOwn(RULE_TYPES, c.rule.type)) errors.push(`${at}.rule.type must be one of ${Object.keys(RULE_TYPES).join(", ")}`);
        else {
          const params = RULE_TYPES[c.rule.type];
          for (const k of Object.keys(c.rule)) if (k !== "type" && !params.includes(k)) errors.push(`${at}.rule: unknown parameter ${k} for ${c.rule.type}`);
          for (const k of params) if (!int(c.rule[k]) || (k !== "segment" && c.rule[k] === 0 && !/^min/.test(c.rule.type))) errors.push(`${at}.rule.${k} must be a positive integer`);
        }
      } else if (c.kind === "semantic") {
        if (c.rule !== undefined && c.rule !== null && !(isObj(c.rule) && typeof c.rule.text === "string" && c.rule.text.trim())) errors.push(`${at}.rule for a semantic constraint is { text } or omitted`);
        if (typeof c.note !== "string" || !c.note.trim()) errors.push(`${at}.note must say what the critic reviews`);
      }
    });
  }
  if (typeof p.delivery_notes !== "string" || !p.delivery_notes.trim()) errors.push("delivery_notes must be prose the critic reads");
  if (typeof p.delivery_notes === "string" && /\b(never|do not|don't|avoid)\b[^.]*\b(word|phrase|say)/i.test(p.delivery_notes)) errors.push("delivery_notes must not carry a prohibition list; that is a catalog by another name");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(p.checked ?? "")) errors.push("checked must be the ISO date the platform limits were last confirmed");
  return errors;
}

export function loadProfile(text) {
  let p;
  try { p = JSON.parse(text); } catch (e) { throw new TypeError(`profile is not JSON: ${e.message}`); }
  const errors = validateProfile(p);
  if (errors.length) throw new TypeError(`profile refused: ${errors.join("; ")}`);
  return { profile: p, digest: createHash("sha256").update(text, "utf8").digest("hex") };
}

/** The profile's structure and mechanical constraints as plain facts for a drafting job. */
export function profileFacts(p) {
  const facts = [
    `Form: ${p.form}. Delivered as ${p.medium}.`,
    `Length: ${p.length.min}–${p.length.max} ${p.length.unit}.`,
    `Structure, in order: ${p.structure.join(", ")}.`,
  ];
  if (p.segments) facts.push(`At most ${p.segments.max_count} segments of at most ${p.segments.max_characters} characters each, separated by ${JSON.stringify(p.segments.separator)}.`);
  for (const c of p.constraints) facts.push(c.kind === "mechanical" ? `Constraint ${c.id}: ${describeRule(c.rule)}.` : `Constraint ${c.id} (reviewed, not enforced): ${c.rule?.text ?? c.note}`);
  return facts;
}

export function describeRule(r) {
  switch (r.type) {
    case "max_words": return `at most ${r.max} words`;
    case "min_words": return `at least ${r.min} words`;
    case "max_characters": return `at most ${r.max} characters`;
    case "max_segments": return `at most ${r.max} segments`;
    case "max_segment_characters": return `no segment over ${r.max} characters`;
    case "no_urls_in_segment": return `no URL in segment ${r.segment}`;
    case "no_headings": return "no markdown headings";
    case "max_hashtags": return `at most ${r.max} hashtags`;
    case "single_paragraph": return "one paragraph, no blank lines";
    case "ends_with_question": return "ends with a question";
    default: return r.type;
  }
}
