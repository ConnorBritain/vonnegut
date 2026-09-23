# prose-research v0.1.0 release notes

v0.1.0 is the first release of the provenance bundle: sources taken in and
pinned by sha256, a dossier of quotable passages with locations, a claims ledger
whose confidence is the writer's own label, and three deterministic checks —
every ledger quote against its source, every link, every draft sentence that
makes a claim no entry backs. One skill, no agents of its own; it extends the
fidelity critic in `prose-review` and the claim auditor in `prose-author`.
Roadmap item E ([`docs/roadmap/E-prose-research.md`](../../docs/roadmap/E-prose-research.md)).

## What ships

- `prose-research` skill: intake → dossier → ledger → sentence map →
  claims-check → provenance-scan for revisions; saves only on a yes; never
  says a claim is true, never fills in confidence, never ranks sources.
- `source-intake.mjs`: a URL through Node's built-in `fetch` (`file://` reads a
  file, which is how the fixtures stand in for the network), a file, or a PDF
  through `pdftotext` — otherwise refused with "supply a text export". Text,
  sha256, retrieval instant; a proposal, never a store write.
- `research-dossier/1`, `claims-ledger/1` (`confidence_by: "writer"` is in the
  schema so nothing downstream can read the label as a measurement) and the
  task-local `sentence-map/1`, with readable references beside the validator.
- `claims-check.mjs`: quotes exact / drifted / absent after whitespace
  normalisation and nothing else — a changed word, comma or case is drift and
  both wordings are shown; links ok / dead / not-evaluated, and offline is
  never ok; coverage from the model's sentence map, with sentences not in the
  draft and ledger ids that do not exist reported by name.
- `provenance-scan.mjs`: for every quote atom `fidelity-scan` would extract,
  exact / drifted / absent / unledgered against its ledger source. The quote
  rule is fidelity-scan's, reproduced and pinned by a parity test at test time.
- `research-store.mjs`: `add-source`, `save`, `undo` for the dossier and the
  ledger under `<project>/research/`, source text cached by sha and never
  rewritten, a ledger refused when it cites a source the dossier lacks, the
  three registry states said out loud, approval-gated throughout.
- `lib/registry-reader.mjs` and `lib/revision-store.mjs` (prose-outline's) and
  `lib/html-text.mjs` (prose-author's) as byte-identical copies pinned by
  `tools/check-packaging.mjs`.

## Compatibility

Reads `voice-identity-registry/1` and never writes it. Requires nothing from
another bundle at run time. `prose-review` 0.5.0's fidelity critic reads the
provenance block this bundle produces and is byte-identical in behaviour
without it; `prose-author` 0.8.0's claim auditor accepts a provenance packet
and is unchanged without one. Without a registry the dossier and ledger are
task-local and the skill says so.

## Evidence

- `node bundles/prose-research/tests/selftest.mjs`: 45 checks, zero failed —
  packaging and the three shared-file pins; every schema refusal; intake of a
  file and of a `file://` URL with HTML converted; the PDF refusal; the fixture
  dossier derived from the fixture sources and the check and scan output
  generated, never hand-edited; a changed word and a changed case drifted, an
  uncached source absent, a quote found on another line exact and saying
  where; a file locator that exists ok and one that does not dead, an http
  source not-evaluated offline; two unledgered sentences and nothing else, a
  sentence not in the draft and an unknown ledger id reported; a draft with
  no claims yielding an empty coverage list (the negative test); quote-rule
  parity with prose-review's fidelity-scan on three texts; the store's three
  registry states, approval gate, duplicate-source refusal, dossier-source
  check, stale-revision refusal and undo round-trip.
- Six mutations under the `research` suite of
  `bundles/prose-author/tests/mutations.mjs`, every one caught; the sweep's
  table is in `bundles/prose-author/tests/MUTATIONS.md`.
- `node tools/check.mjs`: all local commands green.

## Limits

**No model run of the skill was dispatched.** The build environment had no
authenticated CLI. [`tests/skill-harness.md`](tests/skill-harness.md) records
how to run and check the positive and negative test, and an undispatched run
is recorded as not run, never as passed. A ledger entry proves a source said
something, not that it is true. HTML becomes text heuristically; paywalled or
dynamic pages fetch as their shell; a link status is a status code; PDF text
is `pdftotext`'s or the writer's export. The sentence map is a model's mapping,
shown to the writer, not trusted. Nothing here states or implies who wrote
anything.
