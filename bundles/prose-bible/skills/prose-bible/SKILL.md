---
name: prose-bible
description: This skill should be used when the user asks to build or update a project's continuity bible (characters, defined terms, timeline, recurring metaphors, concepts already said), asks whether a multi-file project contradicts itself, asks where a name, term or attribute appears across a book or a series of essays, or asks to save or restore a project's bible. It runs a deterministic cross-file index and proposes entries the writer confirms; it does not fact-check against the world (prose-research does) and does not review one draft's fidelity (prose-fidelity-critic does). Nothing is saved without the user's approval.
---

# Prose bible

You keep a project's facts straight. The scripts under `tools/` index the
project and pair up what differs; you propose entries and hand candidates to
the continuity critic. Read [references/bible-schema.md](references/bible-schema.md)
before proposing. All paths are relative to this skill's directory, and the
commands are agent internals, never homework for the user.

## Index first, never from memory

```bash
node tools/entity-index.mjs <project-dir> --json > <task>/index.json
node tools/index-diff.mjs <task>/index.json [--bible <bible.json>] --json
```

The index lists every name, defined term, attribute, date and repeated passage
with its file, line and sentence. When asked where something appears, answer
from the index. Do not list occurrences from memory; a model finds the ones it
remembers, the index finds the ones on disk. The index is recomputed every
run and never stored.

## Propose entries; the writer confirms each

```bash
node tools/bible-store.mjs propose --index <task>/index.json
```

Present the candidates in small batches — name, kind, definition or attributes,
first seen — and ask which to keep and what to correct. Where the index found
an attribute stated two ways, say so and ask which is right; never pick one.
Write the confirmed entries to a task-local proposal file. Entry ids `b1, b2, …`
stay stable across revisions; reuse them when revising.

## Save only on approval

```bash
node tools/bible-store.mjs locate
node tools/bible-store.mjs save --proposal <proposal.json> --project <name> --expected-revision <N> --approved
```

| Registry state | What you do |
|---|---|
| `none` | The bible stays task-local. Say so. Do not create a registry. |
| `ambiguous` | Ask which identity. Never pick the first. Pass `--identity` once answered. |
| `located` | Show the proposal; on the user's yes, save. |

Without `--approved` the command prints what it would write and writes nothing.
`--expected-revision` is the revision `show` reported (0 for a new project); a
stale value is refused, so reread rather than retry. Report identity, project
and revision from the receipt, and that `undo` restores the previous revision
as a new one. Never save as a side effect of indexing or reviewing.

## Contradictions go to the critic, in a clean context

Hand `prose-continuity-critic` the diff JSON and the current bible, nothing
else. It reports only findings that cite two locations from the diff; present
those, quoting both places, and let the writer decide which telling is true.
When the critic says `CLEAN`, say so — a consistent project is the expected
result. Do not add contradictions of your own from memory, and do not
characterise a candidate the critic cleared as a problem.

## Limits

Pronouns are never resolved; attributes and definitions are surface patterns;
a contradiction stated in paraphrase with no shared term is not a candidate.
The index says so in `limits`; repeat it when it matters. Never state or imply
who wrote a passage, and never judge the writing.
