# prose-outline v0.1.0 release notes

v0.1.0 is the first release of the outline bundle: a brief becomes a checkable
outline, a draft is read back into the outline it implies, two revisions are
compared by node, and a project's outlines persist under the shared
writing-identity registry with undo. One skill, no agents, no model calls of its
own.

## What ships

- `prose-outline` skill with argument and beat-sheet modes. It proposes; the
  scripts count; nothing is saved without the user's approval.
- `voice-outline/1`: thesis (or `null` with open questions saying what is
  missing), claims with evidence slots, open questions; acts, beats and turns in
  beat-sheet mode. Node ids are stable across revisions.
- `outline-scan.mjs`: heading tree, section words and ratio to the median, two
  topic-sentence candidates per paragraph, claim-marker counts by word class,
  transition markers and lexical links at every paragraph boundary, and a
  `not-evaluated` refusal for a heading-free note. Every heuristic is named in
  `limits`.
- `outline-diff.mjs`: added, removed, moved, reparented, reworded, evidence
  changes — by id only, never by text.
- `outline-store.mjs`: `locate`, `show`, `list`, `save`, `undo` over
  `<projects>/<identity>/<project>/outlines` per
  [`docs/registry-stores.md`](../../docs/registry-stores.md). Three registry
  states are handled and said out loud; identities without a default are a
  question, never a guess.
- `proposal-check.mjs`: the skill's two promises, mechanically — a concrete
  brief yields a thesis and a slot on every claim; an underspecified brief
  yields open questions and no invented thesis.
- `lib/text-index.mjs`, the canonical segmentation core `prose-bible` will
  mirror byte for byte; `lib/registry-reader.mjs` and `lib/revision-store.mjs`,
  pinned to prose-author's reader and digest by parity fixtures.

## Compatibility

Reads `voice-identity-registry/1` and never writes it; an unknown registry
schema is refused by name. No prose-author, prose-review or prose-tell-scan
change is required. Without prose-author the registry may not exist and
outlines stay task-local; without prose-review the structure critic (roadmap
item B) does not run and the skill does not substitute its own critique.

## Evidence

- `node bundles/prose-outline/tests/selftest.mjs`: 137 checks, zero failed —
  three text-index parity cases with generated expected JSON and every location
  verified against the source bytes; cross-implementation agreement with
  tell-scan's splitter, visible-prose's exclusions and fidelity-scan's headings;
  seven outline-scan fixtures; the schema's refusals; the differ's
  identical-text trap; registry fixtures written by prose-author's own writer;
  store guards; the skill's promise checker in both directions.
- Thirteen mutations under the `outline` suite of
  `bundles/prose-author/tests/mutations.mjs`, every one caught; the sweep's
  table is in `bundles/prose-author/tests/MUTATIONS.md`.
- `node tools/check.mjs`: all local commands green, including the roadmap check
  that pins this version in `docs/roadmap/STATUS.md`.

## Limits

No model run of the skill was dispatched in this environment; the harness
([`tests/skill-harness.md`](tests/skill-harness.md)) records how to run and
check one, and an undispatched run is recorded as not run, never as passed.
Sentence boundaries, claim markers and topic-sentence candidates are English
heuristics. An outline is the writer's plan, not evidence about a draft's
quality, and nothing here states or implies who wrote anything. The store
coordinates local files; it is not multi-machine sync.
