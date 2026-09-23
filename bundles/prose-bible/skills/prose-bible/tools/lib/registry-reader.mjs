/**
 * registry-reader — read-only access to the shared writing-identity registry.
 *
 * CANONICAL COPY: bundles/prose-outline/skills/prose-outline/tools/lib/registry-reader.mjs
 * MIRRORS:        the same path under prose-bible and prose-research (byte-identical,
 *                 pinned by tools/check-packaging.mjs)
 *
 * The registry is written only by prose-author (`identity-store.mjs`). This
 * module reads the documented `voice-identity-registry/1` shape and nothing
 * else: `current.json` names a revision file, the file name carries the
 * revision number and the sha256 of its bytes, and the bytes must reproduce
 * that digest. It never writes, never migrates, and never adds a key. A parity
 * fixture in the bundle's selftest compares its answers with prose-author's own
 * reader on registries prose-author's own writer produced.
 *
 * Three states, all returned rather than thrown, because each is a different
 * conversation with the user (see docs/registry-stores.md):
 *   none       no registry exists → outlines stay task-local
 *   ambiguous  identities exist, no default, none named → ask; never pick the first
 *   selected   a default or an explicitly named identity → use it
 */
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { isAbsolute, join } from "node:path";

export const REGISTRY_SCHEMA = "voice-identity-registry/1";
export const sha256 = (text) => createHash("sha256").update(text, "utf8").digest("hex");
const ID = /^[a-zA-Z0-9][a-zA-Z0-9_-]{0,63}$/;

/** `PROSE_IDENTITY_DIR` or `~/.config/prose-author/identities`, as prose-author resolves it. */
export function registryDirectory(env = process.env, home = homedir()) {
  const path = env.PROSE_IDENTITY_DIR || join(home, ".config", "prose-author", "identities");
  if (!isAbsolute(path)) throw new TypeError("PROSE_IDENTITY_DIR must be absolute");
  return path;
}

/** `PROSE_PROJECTS_DIR` or `<registry>/projects`; project stores live under it. */
export function projectsDirectory(env = process.env, registry = registryDirectory(env)) {
  const path = env.PROSE_PROJECTS_DIR || join(registry, "projects");
  if (!isAbsolute(path)) throw new TypeError("PROSE_PROJECTS_DIR must be absolute");
  return path;
}

/** The registry state, or null when no registry exists. Malformed registries throw with the reason. */
export function readRegistry(directory = registryDirectory()) {
  const pointerPath = join(directory, "current.json");
  if (!existsSync(pointerPath)) return null;
  const pointer = JSON.parse(readFileSync(pointerPath, "utf8"));
  if (!/^\d+-[a-f0-9]{64}\.json$/.test(pointer.file ?? "")) throw new TypeError("Invalid registry pointer");
  const bytes = readFileSync(join(directory, "revisions", pointer.file), "utf8");
  const state = JSON.parse(bytes);
  if (state?.schema !== REGISTRY_SCHEMA) throw new TypeError(`Unsupported identity registry version ${JSON.stringify(state?.schema)}; this reader knows ${REGISTRY_SCHEMA} and never migrates`);
  if (!Number.isSafeInteger(state.revision) || state.revision < 0 || !Array.isArray(state.identities)) throw new TypeError("Malformed identity registry");
  if (`${state.revision}-${sha256(bytes)}.json` !== pointer.file) throw new TypeError("Registry digest mismatch");
  for (const entry of state.identities) if (!entry || !ID.test(entry.id ?? "") || entry.id === "none") throw new TypeError("Invalid identity entry");
  if (state.default_identity !== null && !state.identities.some((e) => e.id === state.default_identity)) throw new TypeError("Dangling default identity");
  return state;
}

/**
 * Which identity a project store belongs to.
 *   { state: "none" }
 *   { state: "ambiguous", identities: [ids] }
 *   { state: "selected", id, entry, registry_revision, explicit }
 * An explicitly named identity that does not exist throws — that is a typo, not a state.
 */
export function selectedIdentity(directory = registryDirectory(), explicit = null) {
  const state = readRegistry(directory);
  if (!state) return { state: "none" };
  const id = explicit ?? state.default_identity;
  if (id === null) {
    return state.identities.length ? { state: "ambiguous", identities: state.identities.map((e) => e.id) } : { state: "none" };
  }
  const entry = state.identities.find((e) => e.id === id);
  if (!entry) throw new TypeError(`Unknown writing identity: ${id}`);
  return { state: "selected", id, entry, registry_revision: state.revision, explicit: explicit !== null };
}
