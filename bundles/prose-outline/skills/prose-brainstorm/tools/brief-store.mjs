#!/usr/bin/env node
/**
 * brief-store — a project's brief under the shared writing-identity registry,
 * plus the cached source texts it quotes.
 *
 *   node brief-store.mjs locate     [--identity ID]
 *   node brief-store.mjs show       --project P [--identity ID]
 *   node brief-store.mjs list       --project P [--identity ID]
 *   node brief-store.mjs add-source --project P --file F --kind transcript|summary|notes --expected-revision N [--approved] [--identity ID]
 *   node brief-store.mjs save       --project P --proposal FILE --expected-revision N [--approved] [--identity ID]
 *   node brief-store.mjs decide     --project P --answers FILE --expected-revision N [--approved] [--identity ID]
 *   node brief-store.mjs undo       --project P --expected-revision N [--approved] [--identity ID]
 *
 * Layout: <projects>/<identity>/<project>/brief/ is a revision store
 * (docs/registry-stores.md) and brief/sources/<sha256>.txt holds cached source
 * text, written once per sha and never rewritten. A transcript is cached as its
 * CLEANED text (transcript-scan's), because that is the text every quote and
 * line number refers to; a summary or notes file is cached as given.
 *
 * `add-source` is a save that appends one source; without --approved it prints
 * what it would write and writes nothing, the text cache included.
 *
 * `decide` merges interview answers ({ decisions: {id: record}, links: [...] })
 * into the current brief and stamps every answer with the revision being
 * written (`at_revision`), which is what lets brief-check compute staleness.
 * A caller cannot choose the stamp: any `at_revision` it sends is replaced.
 * Exit codes: 0 done; 1 error; 2 usage; 3 cannot persist in this registry state.
 */
import { existsSync, mkdirSync, readFileSync, realpathSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { projectsDirectory, registryDirectory, selectedIdentity, sha256 } from "./lib/registry-reader.mjs";
import { listRevisions, readStore, saveStore, storePath, undoStore } from "./lib/revision-store.mjs";
import { BRIEF_SCHEMA, SOURCE_KINDS, bodyOf, emptyBrief, validateBrief, validateBriefBody } from "./lib/brief-schema.mjs";
import { cleanTranscript, detectFormat } from "./transcript-scan.mjs";
import { words } from "./lib/text-index.mjs";
import { HOOKS } from "./lib/decisions.mjs";

export class StoreRefusal extends Error { constructor(message, code) { super(message); this.code = code; } }

const FLAGS = { locate: [], show: ["--project"], list: ["--project"], "add-source": ["--project", "--file", "--kind", "--expected-revision"], save: ["--project", "--proposal", "--expected-revision"], decide: ["--project", "--answers", "--expected-revision"], undo: ["--project", "--expected-revision"] };

export function parseStoreArgs(argv) {
  const [op, ...rest] = argv;
  if (!Object.hasOwn(FLAGS, op)) throw new StoreRefusal(`brief-store: ${Object.keys(FLAGS).join(" | ")}`, 2);
  const flags = new Map();
  let approved = false;
  for (let i = 0; i < rest.length; i += 1) {
    if (rest[i] === "--approved") { approved = true; continue; }
    if (!["--identity", "--registry", "--projects", ...FLAGS[op]].includes(rest[i]) || flags.has(rest[i]) || rest[i + 1] === undefined || rest[i + 1].startsWith("--")) {
      throw new StoreRefusal(`brief-store ${op}: unknown, duplicate or valueless flag ${rest[i]}`, 2);
    }
    flags.set(rest[i], rest[i + 1]); i += 1;
  }
  for (const f of FLAGS[op]) if (!flags.has(f)) throw new StoreRefusal(`brief-store ${op}: missing ${f}`, 2);
  if (flags.has("--kind") && !SOURCE_KINDS.includes(flags.get("--kind"))) throw new StoreRefusal(`brief-store: --kind must be ${SOURCE_KINDS.join(" | ")}`, 2);
  if (flags.has("--expected-revision") && !/^\d+$/.test(flags.get("--expected-revision"))) throw new StoreRefusal("brief-store: --expected-revision must be a whole number", 2);
  return { op, flags, approved };
}

/** Where this project's brief lives, or a refusal naming the registry state that stops it. */
export function resolveStore({ flags, env = process.env }) {
  const registry = flags.has("--registry") ? resolve(flags.get("--registry")) : registryDirectory(env);
  const projects = flags.has("--projects") ? resolve(flags.get("--projects")) : projectsDirectory(env, registry);
  const selection = selectedIdentity(registry, flags.get("--identity") ?? null);
  const base = { registry, projects_dir: projects, registry_state: selection.state };
  if (selection.state === "none") throw Object.assign(new StoreRefusal("No writing identity registry exists; keep the brief task-local and say so", 3), base);
  if (selection.state === "ambiguous") throw Object.assign(new StoreRefusal(`Identities exist but none is selected (${selection.identities.join(", ")}); ask which one — never pick the first`, 3), { ...base, identities: selection.identities });
  const project = flags.get("--project");
  const directory = project ? storePath(projects, selection.id, project, "brief") : null;
  return { ...base, identity: selection.id, registry_revision: selection.registry_revision, project, directory, sources_dir: directory ? join(directory, "sources") : null };
}

/** The text to cache for a source, and what the brief records about it. */
export function prepareSource(raw, kind) {
  if (!raw.trim()) throw new StoreRefusal("The source file is empty", 1);
  if (raw.includes("\u0000")) throw new StoreRefusal("The source file is binary; export it as text", 1);
  const format = kind === "transcript" ? detectFormat(raw) : null;
  const text = kind === "transcript" ? cleanTranscript(raw, format).clean : raw;
  const digest = sha256(text);
  return { text, source: { kind, digest, words: words(text).length, cached: `sources/${digest}.txt`, ...(format ? { format } : {}) } };
}

const receiptOf = (result, extra) => ({ status: result.status, ...extra, ...(result.status === "saved" ? { revision: result.document.revision, receipt: result.receipt } : { proposal: result.proposal, receipt: result.receipt }) });

export function runStore(argv, env = process.env) {
  const { op, flags, approved } = parseStoreArgs(argv);
  if (op === "locate") {
    try { return { status: "located", ...resolveStore({ flags, env }) }; }
    catch (e) { if (e.code === 3) return { status: "cannot-persist", reason: e.message, registry: e.registry, projects_dir: e.projects_dir, registry_state: e.registry_state, identities: e.identities ?? [] }; throw e; }
  }
  const store = resolveStore({ flags, env });
  const receipt = { identity: store.identity, project: store.project, directory: store.directory };
  if (op === "show") {
    const doc = readStore(store.directory, BRIEF_SCHEMA, store.project);
    if (!doc) throw new StoreRefusal(`No brief saved for project ${store.project}`, 1);
    const errors = validateBrief(doc, HOOKS); if (errors.length) throw new StoreRefusal(`Stored brief is invalid: ${errors.join("; ")}`, 1);
    return { status: "current", ...receipt, sources_dir: store.sources_dir, brief: doc };
  }
  if (op === "list") return { status: "revisions", ...receipt, revisions: listRevisions(store.directory) };
  const expectedRevision = Number(flags.get("--expected-revision"));
  if (op === "add-source") {
    const file = resolve(flags.get("--file"));
    if (!existsSync(file)) throw new StoreRefusal(`Source file not found: ${file}`, 1);
    const { text, source } = prepareSource(readFileSync(file, "utf8"), flags.get("--kind"));
    const current = readStore(store.directory, BRIEF_SCHEMA, store.project);
    const body = current ? bodyOf(current) : emptyBrief();
    if (body.sources.some((s) => s.digest === source.digest)) throw new StoreRefusal(`This text is already a source of the brief (${source.digest.slice(0, 12)}…)`, 1);
    const next = { ...body, sources: [...body.sources, source] };
    const errors = validateBriefBody(next, HOOKS); if (errors.length) throw new StoreRefusal(`Resulting brief is invalid: ${errors.join("; ")}`, 1);
    const result = saveStore(store.directory, { schema: BRIEF_SCHEMA, id: store.project, payload: next, expectedRevision, approved });
    if (result.status === "saved") {
      mkdirSync(store.sources_dir, { recursive: true });
      const path = join(store.directory, source.cached);
      if (!existsSync(path)) writeFileSync(path, text);
    }
    return receiptOf(result, { ...receipt, source });
  }
  if (op === "save") {
    const file = resolve(flags.get("--proposal"));
    if (!existsSync(file)) throw new StoreRefusal(`Proposal file not found: ${file}`, 1);
    let body;
    try { body = bodyOf(JSON.parse(readFileSync(file, "utf8"))); } catch (e) { throw new StoreRefusal(`Proposal is not JSON: ${e.message}`, 1); }
    const errors = validateBriefBody(body, HOOKS); if (errors.length) throw new StoreRefusal(`Proposal is not a valid brief: ${errors.join("; ")}`, 1);
    const missing = body.sources.filter((s) => !existsSync(join(store.directory, s.cached))).map((s) => s.cached);
    if (missing.length) throw new StoreRefusal(`The brief cites sources that are not cached; add them with add-source first: ${missing.join(", ")}`, 1);
    return receiptOf(saveStore(store.directory, { schema: BRIEF_SCHEMA, id: store.project, payload: body, expectedRevision, approved }), receipt);
  }
  if (op === "decide") {
    const file = resolve(flags.get("--answers"));
    if (!existsSync(file)) throw new StoreRefusal(`Answers file not found: ${file}`, 1);
    let answers;
    try { answers = JSON.parse(readFileSync(file, "utf8")); } catch (e) { throw new StoreRefusal(`Answers are not JSON: ${e.message}`, 1); }
    const extra = Object.keys(answers ?? {}).filter((k) => !["decisions", "links"].includes(k));
    if (!answers || typeof answers !== "object" || extra.length) throw new StoreRefusal(`Answers hold only decisions and links${extra.length ? `; unknown: ${extra.join(", ")}` : ""}`, 1);
    const current = readStore(store.directory, BRIEF_SCHEMA, store.project);
    if (!current) throw new StoreRefusal(`No brief saved for project ${store.project}; add a source first`, 1);
    const body = bodyOf(current);
    const stamp = expectedRevision + 1;
    const decisions = { ...body.decisions };
    for (const [id, rec] of Object.entries(answers.decisions ?? {})) decisions[id] = { ...rec, at_revision: stamp };
    const links = [...body.links];
    for (const l of answers.links ?? []) { const i = links.findIndex((x) => x.ref === l?.ref); if (i >= 0) links[i] = l; else links.push(l); }
    const next = { ...body, decisions, links };
    const errors = validateBriefBody(next, HOOKS); if (errors.length) throw new StoreRefusal(`These answers would make the brief invalid: ${errors.join("; ")}`, 1);
    return receiptOf(saveStore(store.directory, { schema: BRIEF_SCHEMA, id: store.project, payload: next, expectedRevision, approved }), { ...receipt, decided: Object.keys(answers.decisions ?? {}), at_revision: stamp });
  }
  return receiptOf(undoStore(store.directory, { schema: BRIEF_SCHEMA, id: store.project, expectedRevision, approved }), receipt);
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
