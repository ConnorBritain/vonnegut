/**
 * voice-bible/1 — the continuity bible the skill proposes, the store keeps and
 * the diff reads.
 *
 * An entry is one thing the project must keep straight: a character, a defined
 * term, an event, a recurring metaphor, a concept already said. Its `key` is the
 * index's key for the same thing (lower case, article dropped), which is how
 * `index-diff` joins the bible to the text. Attributes are plain strings so the
 * diff can compare them to what the text states.
 */
export const BIBLE_SCHEMA = "voice-bible/1";
export const ENTRY_KINDS = Object.freeze(["character", "term", "event", "metaphor", "concept"]);
const ID = /^b[1-9]\d*$/;
const nonempty = (s) => typeof s === "string" && s.trim().length > 0;

export function validateBibleBody(body) {
  const errors = [];
  if (!Array.isArray(body?.entries)) return ["entries must be an array"];
  const ids = new Set(), keys = new Set();
  for (const e of body.entries) {
    const where = `entry ${e?.id ?? "?"}`;
    if (!ID.test(e?.id ?? "")) { errors.push(`${where}: id must look like b1, b2, …`); continue; }
    if (ids.has(e.id)) errors.push(`${where}: duplicate id`);
    ids.add(e.id);
    if (!ENTRY_KINDS.includes(e.kind)) errors.push(`${where}: kind must be ${ENTRY_KINDS.join(" | ")}`);
    if (!nonempty(e.name)) errors.push(`${where}: name is required`);
    if (!nonempty(e.key) || e.key !== e.key.toLowerCase()) errors.push(`${where}: key is required and lower case (the index's key)`);
    if (keys.has(e.key)) errors.push(`${where}: duplicate key ${e.key}`);
    keys.add(e.key);
    if (e.attributes !== undefined && (!e.attributes || typeof e.attributes !== "object" || Array.isArray(e.attributes) || Object.values(e.attributes).some((v) => !nonempty(v)))) errors.push(`${where}: attributes is an object of non-empty strings`);
    if (e.definition !== undefined && e.definition !== null && !nonempty(e.definition)) errors.push(`${where}: definition is a non-empty string or null`);
    if (e.first_seen !== undefined && e.first_seen !== null && (!nonempty(e.first_seen?.file) || !Number.isInteger(e.first_seen?.line))) errors.push(`${where}: first_seen is {file, line} or null`);
    if (e.notes !== undefined && typeof e.notes !== "string") errors.push(`${where}: notes is a string`);
  }
  return errors;
}

export function validateBible(doc) {
  if (doc?.schema !== BIBLE_SCHEMA) return [`Expected schema ${BIBLE_SCHEMA}`];
  const errors = [];
  if (!nonempty(doc.id)) errors.push("Bible needs a project id");
  if (!Number.isInteger(doc.revision) || doc.revision < 1) errors.push("Revision must be an integer ≥ 1");
  if (doc.revision === 1 ? doc.parent_digest !== null : !/^[a-f0-9]{64}$/.test(doc.parent_digest ?? "")) errors.push("Invalid revision ancestry");
  return [...errors, ...validateBibleBody(doc)];
}

/** Propose entries from an entity index: one per term with a definition or attributes, or seen in two files. */
export function proposeEntries(index) {
  const entries = [];
  let n = 1;
  for (const t of index.terms) {
    const attrs = {};
    for (const a of t.attributes) if (!(a.attribute in attrs)) attrs[a.attribute] = a.value;
    const definition = t.definitions.find((d) => d.definition)?.definition ?? null;
    if (!definition && !Object.keys(attrs).length && t.files.length < 2) continue;
    const first = [...t.occurrences].sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line)[0];
    entries.push({
      id: `b${n++}`,
      kind: Object.keys(attrs).length ? "character" : definition ? "term" : "concept",
      name: t.surface_forms.find((s) => !/^(?:The|A|An) /.test(s)) ?? t.surface_forms[0],
      key: t.key,
      ...(Object.keys(attrs).length ? { attributes: attrs } : {}),
      definition,
      first_seen: first ? { file: first.file, line: first.line } : null,
      notes: `proposed from the index: ${t.occurrences.length} occurrence(s) in ${t.files.length} file(s)${t.attributes.length > 1 ? "; attributes vary — confirm which is right" : ""}`,
    });
  }
  return { entries };
}
