/**
 * research-schema — validators for `research-dossier/1`, `claims-ledger/1` and
 * the task-local `sentence-map/1`. Readable forms in ../references/.
 *
 * The one rule that matters: `confidence` is the writer's label and the schema
 * carries `confidence_by: "writer"` so nothing downstream can read it as a
 * measurement. A ledger entry proves a source said something, not that it is
 * true.
 */
export const DOSSIER_SCHEMA = "research-dossier/1";
export const LEDGER_SCHEMA = "claims-ledger/1";
export const SENTENCE_MAP_SCHEMA = "sentence-map/1";
export const SOURCE_KINDS = ["url", "file", "pdf", "notes"];
export const CONFIDENCE = ["high", "medium", "low"];

const isObj = (v) => v && typeof v === "object" && !Array.isArray(v);
const str = (v) => typeof v === "string" && v.trim().length > 0;
const location = (l) => isObj(l) && Number.isInteger(l.line) && l.line >= 1 && Number.isInteger(l.offset) && l.offset >= 0;

export function validateDossierBody(body) {
  const errors = [];
  if (!isObj(body)) return ["dossier must be an object"];
  if (!Array.isArray(body.sources)) errors.push("sources must be an array");
  if (!Array.isArray(body.passages)) errors.push("passages must be an array");
  const sourceIds = new Set();
  for (const [i, s] of (body.sources ?? []).entries()) {
    const at = `sources[${i}]`;
    if (!/^s\d+$/.test(s?.id ?? "")) errors.push(`${at}.id must be sN`);
    if (sourceIds.has(s?.id)) errors.push(`${at}: duplicate id ${s.id}`); sourceIds.add(s?.id);
    if (!SOURCE_KINDS.includes(s?.kind)) errors.push(`${at}.kind must be one of ${SOURCE_KINDS.join(", ")}`);
    if (!str(s?.locator)) errors.push(`${at}.locator must name the URL, path or note`);
    if (s?.retrieved_at !== null && !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/.test(s?.retrieved_at ?? "")) errors.push(`${at}.retrieved_at must be an ISO instant or null`);
    if (!/^[a-f0-9]{64}$/.test(s?.sha256 ?? "")) errors.push(`${at}.sha256 must be the text's sha256`);
    if (!/^[a-f0-9]{64}\.txt$/.test(s?.text_file ?? "")) errors.push(`${at}.text_file must be <sha256>.txt under the store's sources/`);
    if (s?.text_file && s?.sha256 && s.text_file !== `${s.sha256}.txt`) errors.push(`${at}.text_file must match sha256`);
    if (s?.title !== null && !str(s?.title)) errors.push(`${at}.title must be a string or null`);
  }
  const passageIds = new Set();
  for (const [i, p] of (body.passages ?? []).entries()) {
    const at = `passages[${i}]`;
    if (!/^p\d+$/.test(p?.id ?? "")) errors.push(`${at}.id must be pN`);
    if (passageIds.has(p?.id)) errors.push(`${at}: duplicate id ${p.id}`); passageIds.add(p?.id);
    if (!sourceIds.has(p?.source)) errors.push(`${at}.source must name a source in this dossier`);
    if (!location(p?.location)) errors.push(`${at}.location must be {line ≥ 1, offset ≥ 0}`);
    if (!str(p?.quote)) errors.push(`${at}.quote must be the passage's text`);
    if (p?.note !== undefined && p.note !== null && typeof p.note !== "string") errors.push(`${at}.note must be a string or null`);
  }
  return errors;
}

export function validateLedgerBody(body) {
  const errors = [];
  if (!isObj(body)) return ["ledger must be an object"];
  if (!Array.isArray(body.claims)) return ["claims must be an array"];
  const ids = new Set();
  for (const [i, k] of body.claims.entries()) {
    const at = `claims[${i}]`;
    if (!/^k\d+$/.test(k?.id ?? "")) errors.push(`${at}.id must be kN`);
    if (ids.has(k?.id)) errors.push(`${at}: duplicate id ${k.id}`); ids.add(k?.id);
    if (!str(k?.claim)) errors.push(`${at}.claim must be a proposition`);
    if (!/^s\d+$/.test(k?.source ?? "")) errors.push(`${at}.source must name a dossier source (sN)`);
    if (!location(k?.location)) errors.push(`${at}.location must be {line ≥ 1, offset ≥ 0}`);
    if (!str(k?.quote)) errors.push(`${at}.quote must be the source's words`);
    if (!CONFIDENCE.includes(k?.confidence)) errors.push(`${at}.confidence must be high, medium or low`);
    if (k?.confidence_by !== "writer") errors.push(`${at}.confidence_by must be "writer" — confidence is a label, never a measurement`);
  }
  return errors;
}

const envelope = (doc, schema) => {
  const errors = [];
  if (doc?.schema !== schema) errors.push(`schema must be ${schema}`);
  if (!str(doc?.id)) errors.push("id must be the project name");
  if (!Number.isInteger(doc?.revision) || doc.revision < 1) errors.push("revision must be a positive integer");
  if (doc?.parent_digest !== null && !/^[a-f0-9]{64}$/.test(doc?.parent_digest ?? "")) errors.push("parent_digest must be a sha256 or null");
  return errors;
};
export const validateDossier = (doc) => [...envelope(doc, DOSSIER_SCHEMA), ...validateDossierBody(doc)];
export const validateLedger = (doc) => [...envelope(doc, LEDGER_SCHEMA), ...validateLedgerBody(doc)];

/** The model's mapping of draft sentences to ledger entries — shown, checked, never trusted. */
export function validateSentenceMap(map) {
  const errors = [];
  if (map?.schema !== SENTENCE_MAP_SCHEMA) errors.push(`schema must be ${SENTENCE_MAP_SCHEMA}`);
  if (!Array.isArray(map?.sentences)) return [...errors, "sentences must be an array"];
  const ids = new Set();
  for (const [i, s] of map.sentences.entries()) {
    const at = `sentences[${i}]`;
    if (!str(s?.id)) errors.push(`${at}.id required`);
    if (ids.has(s?.id)) errors.push(`${at}: duplicate id ${s.id}`); ids.add(s?.id);
    if (!str(s?.text)) errors.push(`${at}.text must be the draft sentence`);
    if (typeof s?.claim !== "boolean") errors.push(`${at}.claim must be true or false`);
    if (s?.ledger !== null && !/^k\d+$/.test(s?.ledger ?? "")) errors.push(`${at}.ledger must be a ledger id or null`);
    if (s?.claim === false && s?.ledger) errors.push(`${at}: a sentence that is not a claim cannot cite the ledger`);
  }
  return errors;
}

/** Whitespace normalisation, and nothing else: a changed word or a changed comma is drift. */
export const normalise = (s) => s.replace(/\s+/g, " ").trim();
