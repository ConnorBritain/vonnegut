# The continuity protocol

How this bundle is meant to be run. Prose, not code; the main session executes
it, and there is no orchestrator.

```
  1  index        entity-index over the project's files            (deterministic)
  2  diff         index-diff over the index, plus the bible if one exists
  3  propose      bible entries from the index; the writer confirms each
  4  save         bible-store … --approved → identity / project / revision receipt
  5  critic       prose-continuity-critic, clean context, reads the diff and the bible
  6  the writer decides
```

## Step 1–2 — index first, and never from memory

The index is the evidence. A model asked to list every place a character's eyes
are described finds the ones it remembers; the index finds the ones on disk,
with the line. It is recomputed every run and never stored, so it cannot go
stale.

## Step 3–4 — propose, confirm, save on a yes

Entries are proposed from the index and confirmed one at a time. Nothing is
saved without the user's yes, and then only through the store's `--approved`
flag. Three registry states, all said out loud, as in
[`docs/registry-stores.md`](../../docs/registry-stores.md): no registry ⇒ the
bible stays task-local; identities without a default ⇒ ask, never pick the
first; a default ⇒ save and report identity, project, revision and undo.

## Step 5 — the critic reads candidates, not files

`index-diff` raises candidates: the same key with two definitions, an attribute
stated two ways, a passage repeated across files. The critic decides which are
contradictions. It runs in a clean context — a critic that helped write the
chapters remembers what it meant — and every finding cites both locations the
index supplied. When it cannot tell, it says nothing: a wrong "you contradicted
yourself" sends the writer hunting through their own book.

## What this session must never do

- List names, dates or definitions from memory instead of the index.
- Save a bible entry as a side effect of indexing or reviewing.
- Present a contradiction the critic did not cite in two places.
- State or imply who wrote a passage.

## Degradation

Without `prose-outline` nothing changes: the shared modules are bundled.
Without `prose-author` the registry may not exist; the bible is task-local and
the skill says so. Without `prose-review` nothing changes; the critic ships here.
