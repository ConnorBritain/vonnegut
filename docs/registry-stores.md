# Project-scoped stores under the identity registry

The contract for persistent, per-project writing state — outlines, a continuity
bible, a research dossier — that lives beside the shared writing-identity
registry. It is kind-agnostic and read by more than one bundle
(`prose-outline`, `prose-bible`, `prose-research`), which is why it is here and
not inside any of them. Each consumer carries its own implementation; a parity
test over shared fixtures keeps them honest, because a static import across a
bundle boundary is forbidden (see
[`PROFILES.md`](../bundles/prose-tell-scan/PROFILES.md), "The corpus has three
readers").

## Where a store lives

```
<projects-dir>/<identity-id>/<project>/<store>/
    current.json                 {"file": "<revision file>"} — atomic pointer
    revisions/NNNNNN-<sha256>.json   immutable, never rewritten
    .writer.lock                 present only while one writer holds it
```

- `<projects-dir>` is `PROSE_PROJECTS_DIR` when set (must be absolute),
  otherwise `<registry>/projects`, where `<registry>` is `PROSE_IDENTITY_DIR`
  or `~/.config/prose-author/identities`. This mirrors `PROSE_PREFERENCES_DIR`
  and `PROSE_HISTORY_DIR`.
- `<identity-id>` is the registry's selected default identity, or an
  explicitly named one. It is read, never written, through the documented
  `voice-identity-registry/1` shape: `current.json` → `revisions/<file>`, digest
  verified against the file name. No consumer adds keys to the registry.
- `<project>` is the user's project name and must match the token rule history
  uses: 1–64 characters, letters, digits, `_` or `-`, starting with a letter or
  digit. It is stored readable, not hashed: unlike numerical history, these
  stores hold the writer's own prose, so a hash would hide nothing, and a
  readable path is what "back up the registry together with its referenced
  stores" needs.
- `<store>` is one of `outlines`, `bible`, `research`. A consumer never reads
  another consumer's store.

## Three registry states, all handled

| Registry | Behaviour |
|---|---|
| none exists | Nothing is persisted. The skill produces task-local output only and says so. |
| identities exist, no default selected | Ask which identity, or accept an explicit one. Never pick the first. |
| default selected | Use it. Say which identity and project the store belongs to in every receipt. |

## Revision contract

Same as `voice-preferences/2`'s store (`preference-store.mjs`):

- Every document carries `schema`, `id` (the project), `revision` (integer ≥ 1),
  `parent_digest` (`null` at revision 1, else the sha256 of the canonical JSON
  of the previous revision) and its payload.
- A write takes the exclusive lock (`wx` create of `.writer.lock`), reads the
  current revision, requires the caller's `expected_revision` to equal it, writes
  the new revision file with `wx`, then atomically renames a temporary pointer
  over `current.json`. A stale caller is refused with "reread before changing".
- An existing revision file with identical bytes is accepted (an interrupted
  earlier save); different bytes under the same name are an error.
- **Undo** writes a new revision whose payload is the parent's; history is never
  erased. Undo at revision 1 is refused.
- A lock left behind is reported, not removed; recovery is explicit.
- Digests use the same stable-JSON canonicalisation as `preferences-v2.mjs`
  (`stableJSON`), so the parity test can compare digests across implementations.

## Approval gate

A store is written only with an explicit approval flag in the call
(`--approved`), which the skill sets only after the user has seen the proposal
and said yes. Without it the tool prints the proposal and exits without
touching disk. Proposals themselves are task-local files. Nothing is persisted
as a side effect of drafting, scanning, or reviewing.

## What is never written here

- Corpus text, preferences, or numerical history — those keep their own stores.
- Anything derived on demand: an entity index, an outline scan, a claims check.
  Derived artefacts are recomputed; storing them would let them go stale silently.
- Registry entries. `project_store` is reserved as the name of a future
  `voice-identity-registry/2` pointer key so that relocation can be added without
  renaming; nothing writes it today.

## Degradation

- `prose-author` absent ⇒ the registry may still exist; the reader needs no
  runtime. If the registry directory is unreadable or its schema is not
  `voice-identity-registry/1`, refuse with the schema name; never migrate.
- A consumer bundle absent ⇒ its store simply is not read. No consumer infers
  another's content.
