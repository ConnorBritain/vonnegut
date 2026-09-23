# prose-bible v0.1.0 release notes

v0.1.0 is the first release of the continuity bundle: a deterministic
cross-file index of a project's names, defined terms, attributes, dates and
repeated passages, a diff that pairs what differs, a per-project bible under the
shared writing-identity registry with undo, and a read-only critic that reports
contradictions citing two locations or nothing. One skill, one agent.
Roadmap item C ([`docs/roadmap/C-prose-bible.md`](../../docs/roadmap/C-prose-bible.md)).

## What ships

- `prose-bible` skill: index first and never from memory; propose entries the
  writer confirms one by one; save only on a yes; hand candidates to the critic
  in a clean context and report what it cleared as cleared.
- `entity-index.mjs`: every name, defined term, attribute (over a fixed noun
  list), date and number, and every sentence of eight or more words that recurs
  across files, each with file, line, offset and sentence; repeats carry the
  sentence before and after each telling. Derived on demand, never stored, and
  its `limits` name what it cannot see.
- `index-diff.mjs`: the same key defined two ways, an attribute stated with two
  values, a date that moved under one context word, a passage retold, and a
  bible entry the text contradicts. Every candidate carries two locations.
  Candidates, not findings.
- `voice-bible/1` and `bible-store.mjs`: `propose`, `locate`, `show`, `list`,
  `save`, `undo` over `<projects>/<identity>/<project>/bible` per
  [`docs/registry-stores.md`](../../docs/registry-stores.md), the same contract
  as prose-outline's store. A proposed character stated with two eye colours is
  flagged for the writer, never resolved by the tool.
- `prose-continuity-critic`: four classes — definition, attribute, date, repeat
  — each finding quoting both locations from the candidate it came from, a
  third location from memory forbidden, uncertainty resolving to silence,
  verdict `CLEAN` / `REVISE`.
- `lib/text-index.mjs`, `lib/registry-reader.mjs`, `lib/revision-store.mjs`:
  byte-identical copies of prose-outline's canonical files, pinned by
  `tools/check-packaging.mjs` and by this bundle's selftest, so drift is
  impossible rather than detected late.

## Compatibility

Reads `voice-identity-registry/1` and never writes it. Requires nothing from
prose-outline at run time: the shared files are copies, not imports. Building
the index exposed three defects in the shared definition patterns, fixed in the
canonical copy and released as prose-outline 0.1.1 in the same commit
([`RELEASE-v0.1.1.md`](../prose-outline/RELEASE-v0.1.1.md)). Without a
registry the bible stays task-local and the skill says so; without a default
identity it asks.

## Evidence

- `node bundles/prose-bible/tests/selftest.mjs`: 85 checks, zero failed —
  packaging and the three shared-file pins; prose-outline's text-index parity
  cases through this copy; the planted-drift project (grey then green eyes, a
  road to the coast then the quarry, a flood of 1898 then 1889, an anecdote
  retold) indexed and diffed against generated expected JSON with every location
  verified against the source bytes; a consistent control whose one candidate is
  a deliberate restatement; the schema's refusals; the store's three registry
  states, approval gate, stale-revision refusal and undo round-trip; the
  critic's seven fixtures with every class re-derived from the harness's stated
  echo rule; and the harness itself — leak-free staging, a poisoned copy
  aborting before a MANIFEST exists, `collect` and `check` round-tripping
  synthetic transcripts byte for byte.
- Seven mutations under the `bible` suite of
  `bundles/prose-author/tests/mutations.mjs`, every one caught, including the
  one that edits a shared-file copy to prove the pin fires; the sweep's table is
  in `bundles/prose-author/tests/MUTATIONS.md`.
- `node tools/check.mjs`: all local commands green.

## Limits

**No model run has been dispatched.** The build environment had no
authenticated CLI. [`tests/critic-harness.md`](tests/critic-harness.md) and
[`tests/skill-harness.md`](tests/skill-harness.md) record how to run and check
one; until a run is recorded the critic's evidence is its fixture set and
harness, not a number, and an undispatched run is recorded as not run, never
as passed. Class D (diff quiet, critic flags) is empty by construction and the
fixture manifest says why. Pronouns are never resolved; attributes and
definitions are surface patterns; a contradiction stated in paraphrase with no
shared term is not a candidate. Nothing here fact-checks against the world,
judges the writing, or states who wrote a passage.
