/**
 * revision-store — immutable revisions with an atomic pointer, a lock and undo.
 *
 * CANONICAL COPY: bundles/prose-outline/skills/prose-outline/tools/lib/revision-store.mjs
 * MIRRORS:        the same path under prose-bible and prose-research (byte-identical,
 *                 pinned by tools/check-packaging.mjs)
 *
 * The on-disk contract is docs/registry-stores.md, which is the preference
 * store's contract (prose-author, preference-store.mjs) generalised: a document
 * carries `schema`, `id`, `revision`, `parent_digest` and its payload; every
 * revision is written once under `revisions/NNNNNN-<sha256>.json`; `current.json`
 * is replaced atomically; one exclusive `.writer.lock`; undo is a new revision
 * that restores the parent. Digests use the same stable-JSON canonicalisation as
 * `preferences-v2.mjs`, and the selftest checks parity with it.
 *
 * NOTHING IS WRITTEN WITHOUT `approved: true`. The gate is a parameter, not a
 * prompt: the skill passes it only after the user has seen the proposal and said
 * yes. A call without it returns the proposal and touches no file.
 */
import { closeSync, existsSync, mkdirSync, openSync, readdirSync, readFileSync, renameSync, unlinkSync, writeFileSync } from "node:fs";
import { isAbsolute, join } from "node:path";
import { randomUUID } from "node:crypto";
import { sha256 } from "./registry-reader.mjs";

export const PROJECT_NAME = /^[a-zA-Z0-9][a-zA-Z0-9_-]{0,63}$/;
export const STORES = Object.freeze(["outlines", "bible", "research"]);

export const stableJSON = (v) => Array.isArray(v) ? `[${v.map(stableJSON).join(",")}]`
  : v && typeof v === "object" ? `{${Object.keys(v).sort().map((k) => `${JSON.stringify(k)}:${stableJSON(v[k])}`).join(",")}}` : JSON.stringify(v);
export const digest = (v) => sha256(stableJSON(v));

/** `<projects-dir>/<identity>/<project>/<store>`; every part validated. */
export function storePath(projectsDir, identity, project, store) {
  if (!isAbsolute(projectsDir)) throw new TypeError("Projects directory must be absolute");
  if (!PROJECT_NAME.test(identity ?? "")) throw new TypeError("Invalid identity id");
  if (!PROJECT_NAME.test(project ?? "")) throw new TypeError("Project names use 1–64 letters, digits, _ or -, starting with a letter or digit");
  if (!STORES.includes(store)) throw new TypeError(`Unknown store ${JSON.stringify(store)}; expected ${STORES.join(" | ")}`);
  return join(projectsDir, identity, project, store);
}

const revisionName = (doc) => `${String(doc.revision).padStart(6, "0")}-${digest(doc)}.json`;

/** Validate the envelope every document shares; the payload is the caller's business. */
export function validateEnvelope(doc, schema, id) {
  const errors = [];
  if (doc?.schema !== schema) errors.push(`Expected schema ${schema}`);
  if (doc?.id !== id) errors.push(`Expected id ${id}`);
  if (!Number.isInteger(doc?.revision) || doc.revision < 1) errors.push("Revision must be an integer ≥ 1");
  if (doc?.revision === 1 ? doc.parent_digest !== null : !/^[a-f0-9]{64}$/.test(doc?.parent_digest ?? "")) errors.push("Invalid revision ancestry");
  return errors;
}

export function readStore(directory, schema, id) {
  const pointerPath = join(directory, "current.json");
  if (!existsSync(pointerPath)) return null;
  const pointer = JSON.parse(readFileSync(pointerPath, "utf8"));
  if (!/^\d{6,}-[a-f0-9]{64}\.json$/.test(pointer.file ?? "")) throw new TypeError("Invalid store pointer");
  const doc = JSON.parse(readFileSync(join(directory, "revisions", pointer.file), "utf8"));
  const errors = validateEnvelope(doc, schema, id);
  if (errors.length) throw new TypeError(errors.join("; "));
  if (revisionName(doc) !== pointer.file) throw new TypeError("Store revision digest mismatch");
  return doc;
}

function withLock(directory, action) {
  mkdirSync(directory, { recursive: true, mode: 0o700 });
  const lock = join(directory, ".writer.lock");
  let fd;
  try { fd = openSync(lock, "wx", 0o600); }
  catch (e) { if (e.code === "EEXIST") throw new Error("Store has another or interrupted writer; inspect the lock before recovery"); throw e; }
  try { return action(); } finally { closeSync(fd); unlinkSync(lock); }
}

function persist(directory, doc) {
  mkdirSync(join(directory, "revisions"), { recursive: true, mode: 0o700 });
  const file = revisionName(doc), target = join(directory, "revisions", file);
  const bytes = `${JSON.stringify(doc, null, 2)}\n`;
  // An interrupted earlier save may already hold this exact immutable revision.
  if (existsSync(target)) { if (readFileSync(target, "utf8") !== bytes) throw new Error("Existing revision bytes diverge"); }
  else writeFileSync(target, bytes, { flag: "wx", mode: 0o600 });
  const temp = join(directory, `.pointer-${randomUUID()}.json`);
  try {
    writeFileSync(temp, `${JSON.stringify({ file })}\n`, { flag: "wx", mode: 0o600 });
    renameSync(temp, join(directory, "current.json"));
  } finally { if (existsSync(temp)) unlinkSync(temp); }
  return doc;
}

/**
 * Save `payload` as the next revision. `expectedRevision` is the revision the
 * caller read (0 for a store that does not exist yet); a stale caller is refused.
 * Without `approved` the would-be document is returned under `proposal` and
 * nothing is written.
 */
export function saveStore(directory, { schema, id, payload, expectedRevision, approved = false }) {
  if (!Number.isInteger(expectedRevision) || expectedRevision < 0) throw new TypeError("Expected revision required");
  if (!payload || typeof payload !== "object" || ["schema", "id", "revision", "parent_digest"].some((k) => k in payload)) throw new TypeError("Payload must be an object without envelope keys");
  const build = (current) => ({ schema, id, revision: (current?.revision ?? 0) + 1, parent_digest: current ? digest(current) : null, ...payload });
  if (!approved) {
    const current = readStore(directory, schema, id);
    if ((current?.revision ?? 0) !== expectedRevision) throw new Error("Stale revision; reread before changing this store");
    return { status: "proposal", proposal: build(current), receipt: "Nothing was saved; approval is required." };
  }
  return withLock(directory, () => {
    const current = readStore(directory, schema, id);
    if ((current?.revision ?? 0) !== expectedRevision) throw new Error("Stale revision; reread before changing this store");
    const next = build(current);
    const errors = validateEnvelope(next, schema, id);
    if (errors.length) throw new TypeError(errors.join("; "));
    persist(directory, next);
    return { status: "saved", document: next, receipt: { revision: next.revision, parent_digest: next.parent_digest, undo: `Undo restores revision ${next.revision - 1} as a new revision; history is preserved.` } };
  });
}

/** Restore the parent as a new revision. Refused at revision 1, when stale, or without approval. */
export function undoStore(directory, { schema, id, expectedRevision, approved = false }) {
  const current = readStore(directory, schema, id);
  if (!current) throw new Error("No store to undo");
  if (current.revision !== expectedRevision) throw new Error("Stale revision; reread before changing this store");
  if (current.revision === 1) throw new Error("No change to undo");
  const file = readdirSync(join(directory, "revisions")).find((f) => f.endsWith(`-${current.parent_digest}.json`));
  if (!file) throw new Error("Previous revision is missing; cannot invent undo history");
  const previous = JSON.parse(readFileSync(join(directory, "revisions", file), "utf8"));
  const restored = { ...previous, revision: current.revision + 1, parent_digest: digest(current) };
  if (!approved) return { status: "proposal", proposal: restored, receipt: "Nothing was restored; approval is required." };
  return withLock(directory, () => {
    const again = readStore(directory, schema, id);
    if (again.revision !== expectedRevision) throw new Error("Stale revision; reread before changing this store");
    persist(directory, restored);
    return { status: "saved", document: restored, receipt: { revision: restored.revision, restored_revision: previous.revision } };
  });
}

/** Every revision on disk, oldest first, for `list`. */
export function listRevisions(directory) {
  const dir = join(directory, "revisions");
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((f) => /^\d{6,}-[a-f0-9]{64}\.json$/.test(f)).sort().map((file) => {
    const doc = JSON.parse(readFileSync(join(dir, file), "utf8"));
    return { file, revision: doc.revision, parent_digest: doc.parent_digest };
  });
}
