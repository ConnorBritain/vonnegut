#!/usr/bin/env node
/**
 * outline-store — per-project outlines under the shared writing-identity registry.
 *
 *   node outline-store.mjs locate [--identity ID]
 *   node outline-store.mjs show   --project P [--identity ID]
 *   node outline-store.mjs list   --project P [--identity ID]
 *   node outline-store.mjs save   --proposal FILE --project P --expected-revision N [--approved] [--identity ID]
 *   node outline-store.mjs undo   --project P --expected-revision N [--approved] [--identity ID]
 *
 * Every command prints one JSON object. Exit codes:
 *   0  done (a proposal without --approved is "done": it printed what it would write)
 *   1  an error the caller must act on (stale revision, invalid proposal, lock held)
 *   2  usage
 *   3  cannot persist in this registry state (none, or ambiguous with no --identity)
 *
 * The registry is read, never written. Which identity a store belongs to is the
 * registry's default or an explicit --identity; with identities and no default
 * the answer is a question for the user, never the first entry. Where stores
 * live and what a revision looks like: docs/registry-stores.md.
 */
import { existsSync, readFileSync, realpathSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { projectsDirectory, registryDirectory, selectedIdentity } from "./lib/registry-reader.mjs";
import { listRevisions, readStore, saveStore, storePath, undoStore } from "./lib/revision-store.mjs";
import { OUTLINE_SCHEMA, validateOutline, validateOutlineBody } from "./lib/outline-schema.mjs";

export class StoreRefusal extends Error { constructor(message, code) { super(message); this.code = code; } }

const FLAGS = { locate: [], show: ["--project"], list: ["--project"], save: ["--proposal", "--project", "--expected-revision"], undo: ["--project", "--expected-revision"] };

export function parseStoreArgs(argv) {
  const [op, ...rest] = argv;
  if (!Object.hasOwn(FLAGS, op)) throw new StoreRefusal(`outline-store: ${Object.keys(FLAGS).join(" | ")}`, 2);
  const flags = new Map();
  let approved = false;
  for (let i = 0; i < rest.length; i += 1) {
    if (rest[i] === "--approved") { approved = true; continue; }
    if (!["--identity", "--registry", "--projects", ...FLAGS[op]].includes(rest[i]) || flags.has(rest[i]) || rest[i + 1] === undefined || rest[i + 1].startsWith("--")) {
      throw new StoreRefusal(`outline-store ${op}: unknown, duplicate or valueless flag ${rest[i]}`, 2);
    }
    flags.set(rest[i], rest[i + 1]); i += 1;
  }
  for (const f of FLAGS[op]) if (!flags.has(f)) throw new StoreRefusal(`outline-store ${op}: missing ${f}`, 2);
  return { op, flags, approved };
}

/** Resolve where this project's outlines live, or refuse with the state that stops it. */
export function resolveStore({ flags, env = process.env }) {
  const registry = flags.has("--registry") ? resolve(flags.get("--registry")) : registryDirectory(env);
  const projects = flags.has("--projects") ? resolve(flags.get("--projects")) : projectsDirectory(env, registry);
  const selection = selectedIdentity(registry, flags.get("--identity") ?? null);
  const base = { registry, projects_dir: projects, registry_state: selection.state };
  if (selection.state === "none") throw Object.assign(new StoreRefusal("No writing identity registry exists; keep the outline task-local and say so", 3), base);
  if (selection.state === "ambiguous") throw Object.assign(new StoreRefusal(`Identities exist but none is selected (${selection.identities.join(", ")}); ask which one — never pick the first`, 3), { ...base, identities: selection.identities });
  const project = flags.get("--project");
  return { ...base, identity: selection.id, registry_revision: selection.registry_revision, project, directory: project ? storePath(projects, selection.id, project, "outlines") : null };
}

export function runStore(argv, env = process.env) {
  const { op, flags, approved } = parseStoreArgs(argv);
  if (op === "locate") {
    try { const r = resolveStore({ flags, env }); return { status: "located", ...r }; }
    catch (e) { if (e.code === 3) return { status: "cannot-persist", reason: e.message, registry: e.registry, projects_dir: e.projects_dir, registry_state: e.registry_state, identities: e.identities ?? [] }; throw e; }
  }
  const store = resolveStore({ flags, env });
  const S = { schema: OUTLINE_SCHEMA, id: store.project };
  const receipt = { identity: store.identity, project: store.project, directory: store.directory };
  if (op === "show") {
    const doc = readStore(store.directory, S.schema, S.id);
    if (!doc) throw new StoreRefusal(`No outline saved for project ${store.project}`, 1);
    const errors = validateOutline(doc); if (errors.length) throw new StoreRefusal(`Stored outline is invalid: ${errors.join("; ")}`, 1);
    return { status: "current", ...receipt, outline: doc };
  }
  if (op === "list") return { status: "revisions", ...receipt, revisions: listRevisions(store.directory) };
  const expectedRevision = Number(flags.get("--expected-revision"));
  if (op === "save") {
    const file = resolve(flags.get("--proposal"));
    if (!existsSync(file)) throw new StoreRefusal(`Proposal file not found: ${file}`, 1);
    const body = JSON.parse(readFileSync(file, "utf8"));
    for (const key of ["schema", "id", "revision", "parent_digest"]) delete body[key];
    const errors = validateOutlineBody(body); if (errors.length) throw new StoreRefusal(`Proposal is not a valid outline: ${errors.join("; ")}`, 1);
    const result = saveStore(store.directory, { ...S, payload: body, expectedRevision, approved });
    return { status: result.status, ...receipt, ...(result.status === "saved" ? { revision: result.document.revision, receipt: result.receipt } : { proposal: result.proposal, receipt: result.receipt }) };
  }
  const result = undoStore(store.directory, { ...S, expectedRevision, approved });
  return { status: result.status, ...receipt, ...(result.status === "saved" ? { revision: result.document.revision, receipt: result.receipt } : { proposal: result.proposal, receipt: result.receipt }) };
}

if (process.argv[1] && existsSync(process.argv[1]) && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const result = runStore(process.argv.slice(2));
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    // `locate` reports a cannot-persist state as data, but still exits 3 so a
    // caller that only reads the exit code cannot mistake it for a located store.
    if (result.status === "cannot-persist") process.exit(3);
  } catch (e) {
    const code = e instanceof StoreRefusal ? e.code : 1;
    process.stdout.write(`${JSON.stringify({ status: code === 3 ? "cannot-persist" : code === 2 ? "usage" : "error", reason: e.message, ...(e.registry_state ? { registry_state: e.registry_state, identities: e.identities ?? [] } : {}) }, null, 2)}\n`);
    process.exit(code);
  }
}
