#!/usr/bin/env node
/**
 * research-store — a project's dossier and claims ledger under the shared
 * writing-identity registry, plus the cached source texts they cite.
 *
 *   node research-store.mjs locate     [--identity ID]
 *   node research-store.mjs show       --project P --store dossier|ledger [--identity ID]
 *   node research-store.mjs list       --project P --store dossier|ledger [--identity ID]
 *   node research-store.mjs add-source --project P --intake FILE --expected-revision N [--approved] [--identity ID]
 *   node research-store.mjs save       --project P --store dossier|ledger --proposal FILE --expected-revision N [--approved] [--identity ID]
 *   node research-store.mjs undo       --project P --store dossier|ledger --expected-revision N [--approved] [--identity ID]
 *
 * Layout: <projects>/<identity>/<project>/research/{dossier,ledger}/ are two
 * revision stores (docs/registry-stores.md) and research/sources/<sha256>.txt
 * holds cached source text, written once per sha and never rewritten.
 * `add-source` is a `save` of the dossier that appends one source from a
 * source-intake proposal and writes its text; without --approved it prints
 * what it would write. Exit codes: 0 done; 1 error; 2 usage; 3 cannot persist.
 */
import { existsSync, mkdirSync, readFileSync, realpathSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { projectsDirectory, registryDirectory, selectedIdentity, sha256 } from "./lib/registry-reader.mjs";
import { listRevisions, readStore, saveStore, storePath, undoStore } from "./lib/revision-store.mjs";
import { DOSSIER_SCHEMA, LEDGER_SCHEMA, validateDossier, validateDossierBody, validateLedger, validateLedgerBody } from "./lib/research-schema.mjs";

export class StoreRefusal extends Error { constructor(message, code) { super(message); this.code = code; } }

const STORES = { dossier: { schema: DOSSIER_SCHEMA, validate: validateDossier, validateBody: validateDossierBody, empty: () => ({ sources: [], passages: [] }) }, ledger: { schema: LEDGER_SCHEMA, validate: validateLedger, validateBody: validateLedgerBody, empty: () => ({ claims: [] }) } };
const FLAGS = { locate: [], show: ["--project", "--store"], list: ["--project", "--store"], "add-source": ["--project", "--intake", "--expected-revision"], save: ["--project", "--store", "--proposal", "--expected-revision"], undo: ["--project", "--store", "--expected-revision"] };

export function parseStoreArgs(argv) {
  const [op, ...rest] = argv;
  if (!Object.hasOwn(FLAGS, op)) throw new StoreRefusal(`research-store: ${Object.keys(FLAGS).join(" | ")}`, 2);
  const flags = new Map(); let approved = false;
  for (let i = 0; i < rest.length; i += 1) {
    if (rest[i] === "--approved") { approved = true; continue; }
    if (!["--identity", "--registry", "--projects", ...FLAGS[op]].includes(rest[i]) || flags.has(rest[i]) || rest[i + 1] === undefined || rest[i + 1].startsWith("--")) throw new StoreRefusal(`research-store ${op}: unknown, duplicate or valueless flag ${rest[i]}`, 2);
    flags.set(rest[i], rest[i + 1]); i += 1;
  }
  for (const f of FLAGS[op]) if (!flags.has(f)) throw new StoreRefusal(`research-store ${op}: missing ${f}`, 2);
  if (flags.has("--store") && !Object.hasOwn(STORES, flags.get("--store"))) throw new StoreRefusal("research-store: --store must be dossier or ledger", 2);
  return { op, flags, approved };
}

export function resolveStore({ flags, env = process.env }) {
  const registry = flags.has("--registry") ? resolve(flags.get("--registry")) : registryDirectory(env);
  const projects = flags.has("--projects") ? resolve(flags.get("--projects")) : projectsDirectory(env, registry);
  const selection = selectedIdentity(registry, flags.get("--identity") ?? null);
  const base = { registry, projects_dir: projects, registry_state: selection.state };
  if (selection.state === "none") throw Object.assign(new StoreRefusal("No writing identity registry exists; keep the dossier and ledger task-local and say so", 3), base);
  if (selection.state === "ambiguous") throw Object.assign(new StoreRefusal(`Identities exist but none is selected (${selection.identities.join(", ")}); ask which one — never pick the first`, 3), { ...base, identities: selection.identities });
  const project = flags.get("--project") ?? null;
  const research = project ? storePath(projects, selection.id, project, "research") : null;
  return { ...base, identity: selection.id, registry_revision: selection.registry_revision, project, research, sources_dir: research ? join(research, "sources") : null, directory: (store) => join(research, store) };
}

const receiptOf = (result, extra) => ({ status: result.status, ...extra, ...(result.status === "saved" ? { revision: result.document.revision, receipt: result.receipt } : { proposal: result.proposal, receipt: result.receipt }) });

export function runStore(argv, env = process.env) {
  const { op, flags, approved } = parseStoreArgs(argv);
  if (op === "locate") {
    try { const r = resolveStore({ flags, env }); const { directory, ...rest } = r; return { status: "located", ...rest }; }
    catch (e) { if (e.code === 3) return { status: "cannot-persist", reason: e.message, registry: e.registry, projects_dir: e.projects_dir, registry_state: e.registry_state, identities: e.identities ?? [] }; throw e; }
  }
  const store = resolveStore({ flags, env });
  const receipt = { identity: store.identity, project: store.project, research: store.research, sources_dir: store.sources_dir };
  const kind = flags.get("--store") ?? "dossier";
  const S = STORES[kind];
  const dir = store.directory(kind);
  if (op === "show") {
    const doc = readStore(dir, S.schema, store.project);
    if (!doc) throw new StoreRefusal(`No ${kind} saved for project ${store.project}`, 1);
    const errors = S.validate(doc); if (errors.length) throw new StoreRefusal(`Stored ${kind} is invalid: ${errors.join("; ")}`, 1);
    return { status: "current", store: kind, ...receipt, [kind]: doc };
  }
  if (op === "list") return { status: "revisions", store: kind, ...receipt, revisions: listRevisions(dir) };
  const expectedRevision = Number(flags.get("--expected-revision"));
  if (op === "add-source") {
    const file = resolve(flags.get("--intake"));
    if (!existsSync(file)) throw new StoreRefusal(`Intake file not found: ${file}`, 1);
    const intake = JSON.parse(readFileSync(file, "utf8"));
    if (intake?.schema !== "source-intake/1" || typeof intake.text !== "string" || !intake.source) throw new StoreRefusal("Expected a source-intake/1 proposal", 1);
    if (sha256(intake.text) !== intake.source.sha256) throw new StoreRefusal("The intake's text does not match its sha256", 1);
    const current = readStore(dir, S.schema, store.project);
    const body = current ? { sources: current.sources, passages: current.passages } : S.empty();
    if (body.sources.some((s) => s.sha256 === intake.source.sha256)) throw new StoreRefusal(`This text is already in the dossier as ${body.sources.find((s) => s.sha256 === intake.source.sha256).id}`, 1);
    const id = `s${body.sources.length + 1}`;
    const next = { sources: [...body.sources, { ...intake.source, id }], passages: body.passages };
    const errors = validateDossierBody(next); if (errors.length) throw new StoreRefusal(`Resulting dossier is invalid: ${errors.join("; ")}`, 1);
    const result = saveStore(dir, { schema: S.schema, id: store.project, payload: next, expectedRevision, approved });
    if (result.status === "saved") {
      mkdirSync(store.sources_dir, { recursive: true });
      const path = join(store.sources_dir, intake.source.text_file);
      if (!existsSync(path)) writeFileSync(path, intake.text);
    }
    return receiptOf(result, { store: "dossier", source_id: id, ...receipt });
  }
  if (op === "save") {
    const file = resolve(flags.get("--proposal"));
    if (!existsSync(file)) throw new StoreRefusal(`Proposal file not found: ${file}`, 1);
    const body = JSON.parse(readFileSync(file, "utf8"));
    for (const key of ["schema", "id", "revision", "parent_digest"]) delete body[key];
    const errors = S.validateBody(body); if (errors.length) throw new StoreRefusal(`Proposal is not a valid ${kind}: ${errors.join("; ")}`, 1);
    if (kind === "ledger") {
      const dossier = readStore(store.directory("dossier"), DOSSIER_SCHEMA, store.project);
      const known = new Set((dossier?.sources ?? []).map((s) => s.id));
      const unknown = body.claims.filter((k) => !known.has(k.source)).map((k) => `${k.id}→${k.source}`);
      if (unknown.length) throw new StoreRefusal(`Ledger claims cite sources the dossier does not have: ${unknown.join(", ")}`, 1);
    }
    return receiptOf(saveStore(dir, { schema: S.schema, id: store.project, payload: body, expectedRevision, approved }), { store: kind, ...receipt });
  }
  return receiptOf(undoStore(dir, { schema: S.schema, id: store.project, expectedRevision, approved }), { store: kind, ...receipt });
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
