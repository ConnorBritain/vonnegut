#!/usr/bin/env node
/**
 * bible-store — a project's continuity bible under the shared writing-identity registry.
 *
 *   node bible-store.mjs locate  [--identity ID]
 *   node bible-store.mjs show    --project P [--identity ID]
 *   node bible-store.mjs list    --project P [--identity ID]
 *   node bible-store.mjs propose --index FILE [--project P] [--identity ID]
 *   node bible-store.mjs save    --proposal FILE --project P --expected-revision N [--approved] [--identity ID]
 *   node bible-store.mjs undo    --project P --expected-revision N [--approved] [--identity ID]
 *
 * Every command prints one JSON object. Exit codes: 0 done (a proposal without
 * --approved is done: it printed what it would write); 1 an error the caller must
 * act on; 2 usage; 3 cannot persist in this registry state. `propose` never
 * touches the store: it turns an entity index into candidate entries for the
 * writer to confirm, and the writer's yes is what turns those into a `save`.
 * Contract: docs/registry-stores.md.
 */
import { existsSync, readFileSync, realpathSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { projectsDirectory, registryDirectory, selectedIdentity } from "./lib/registry-reader.mjs";
import { listRevisions, readStore, saveStore, storePath, undoStore } from "./lib/revision-store.mjs";
import { BIBLE_SCHEMA, proposeEntries, validateBible, validateBibleBody } from "./lib/bible-schema.mjs";

export class StoreRefusal extends Error { constructor(message, code) { super(message); this.code = code; } }

const FLAGS = { locate: [], show: ["--project"], list: ["--project"], propose: ["--index"], save: ["--proposal", "--project", "--expected-revision"], undo: ["--project", "--expected-revision"] };

export function parseStoreArgs(argv) {
  const [op, ...rest] = argv;
  if (!Object.hasOwn(FLAGS, op)) throw new StoreRefusal(`bible-store: ${Object.keys(FLAGS).join(" | ")}`, 2);
  const flags = new Map();
  let approved = false;
  for (let i = 0; i < rest.length; i += 1) {
    if (rest[i] === "--approved") { approved = true; continue; }
    if (!["--identity", "--registry", "--projects", "--project", ...FLAGS[op]].includes(rest[i]) || flags.has(rest[i]) || rest[i + 1] === undefined || rest[i + 1].startsWith("--")) {
      throw new StoreRefusal(`bible-store ${op}: unknown, duplicate or valueless flag ${rest[i]}`, 2);
    }
    flags.set(rest[i], rest[i + 1]); i += 1;
  }
  for (const f of FLAGS[op]) if (!flags.has(f)) throw new StoreRefusal(`bible-store ${op}: missing ${f}`, 2);
  return { op, flags, approved };
}

export function resolveStore({ flags, env = process.env }) {
  const registry = flags.has("--registry") ? resolve(flags.get("--registry")) : registryDirectory(env);
  const projects = flags.has("--projects") ? resolve(flags.get("--projects")) : projectsDirectory(env, registry);
  const selection = selectedIdentity(registry, flags.get("--identity") ?? null);
  const base = { registry, projects_dir: projects, registry_state: selection.state };
  if (selection.state === "none") throw Object.assign(new StoreRefusal("No writing identity registry exists; keep the bible task-local and say so", 3), base);
  if (selection.state === "ambiguous") throw Object.assign(new StoreRefusal(`Identities exist but none is selected (${selection.identities.join(", ")}); ask which one — never pick the first`, 3), { ...base, identities: selection.identities });
  const project = flags.get("--project");
  return { ...base, identity: selection.id, registry_revision: selection.registry_revision, project, directory: project ? storePath(projects, selection.id, project, "bible") : null };
}

export function runStore(argv, env = process.env) {
  const { op, flags, approved } = parseStoreArgs(argv);
  if (op === "propose") {
    const file = resolve(flags.get("--index"));
    if (!existsSync(file)) throw new StoreRefusal(`Index file not found: ${file}`, 1);
    const index = JSON.parse(readFileSync(file, "utf8"));
    if (index?.schema !== "entity-index/1") throw new StoreRefusal("Expected an entity-index/1 document", 1);
    const proposal = proposeEntries(index);
    return { status: "proposal", project: flags.get("--project") ?? null, entries: proposal.entries.length, proposal, receipt: "Candidates from the index; nothing is saved until each is confirmed and save runs with --approved." };
  }
  if (op === "locate") {
    try { const r = resolveStore({ flags, env }); return { status: "located", ...r }; }
    catch (e) { if (e.code === 3) return { status: "cannot-persist", reason: e.message, registry: e.registry, projects_dir: e.projects_dir, registry_state: e.registry_state, identities: e.identities ?? [] }; throw e; }
  }
  const store = resolveStore({ flags, env });
  const S = { schema: BIBLE_SCHEMA, id: store.project };
  const receipt = { identity: store.identity, project: store.project, directory: store.directory };
  if (op === "show") {
    const doc = readStore(store.directory, S.schema, S.id);
    if (!doc) throw new StoreRefusal(`No bible saved for project ${store.project}`, 1);
    const errors = validateBible(doc); if (errors.length) throw new StoreRefusal(`Stored bible is invalid: ${errors.join("; ")}`, 1);
    return { status: "current", ...receipt, bible: doc };
  }
  if (op === "list") return { status: "revisions", ...receipt, revisions: listRevisions(store.directory) };
  const expectedRevision = Number(flags.get("--expected-revision"));
  if (op === "save") {
    const file = resolve(flags.get("--proposal"));
    if (!existsSync(file)) throw new StoreRefusal(`Proposal file not found: ${file}`, 1);
    const body = JSON.parse(readFileSync(file, "utf8"));
    for (const key of ["schema", "id", "revision", "parent_digest"]) delete body[key];
    const errors = validateBibleBody(body); if (errors.length) throw new StoreRefusal(`Proposal is not a valid bible: ${errors.join("; ")}`, 1);
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
    if (result.status === "cannot-persist") process.exit(3);
  } catch (e) {
    const code = e instanceof StoreRefusal ? e.code : 1;
    process.stdout.write(`${JSON.stringify({ status: code === 3 ? "cannot-persist" : code === 2 ? "usage" : "error", reason: e.message, ...(e.registry_state ? { registry_state: e.registry_state, identities: e.identities ?? [] } : {}) }, null, 2)}\n`);
    process.exit(code);
  }
}
