# prose-review v0.5.0 release notes

v0.5.0 gives `prose-fidelity-critic` an optional provenance block, deliberately
narrow. When the session supplies `provenance-scan` output (from
`prose-research`), a quote atom the scan marks `drifted` — a quotation the
revision carries that its ledger source does not say — is an item-1 finding
even when `fidelity-scan` is quiet. Nothing else changes: without the block the
prompt's behaviour is identical, and with it the critic still refuses to judge
truth, source reliability or claim support. Roadmap item E
([`docs/roadmap/E-prose-research.md`](../../docs/roadmap/E-prose-research.md)).

## Changed

- `prose-fidelity-critic` (primitive + byte-identical bundle copy): item 1
  names the drifted quote atom; a new "Provenance, when it is supplied"
  section says what the block is authoritative on and that it changes one
  thing only; "What is NOT a finding" names truth and source reliability.
  `meta.yaml` records the optional tool and the refusal.
- Harness: a fidelity fixture may carry a `provenance/` directory (ledger,
  dossier, cached source text). `prepare fidelity` runs prose-research's
  `provenance-scan` over it at test time — a producer imported the way the
  structure critic's harness imports `outline-scan` — and stages only the scan
  output as `provenance.json`; the task text carries it as a block. Without
  prose-research the fixture cannot be staged and `prepare` says so.
- Three new fidelity fixtures on Bacon's *Of Anger* (the original is the
  corpus file's exact bytes): two class-D provenance cases where the quotation
  is preserved between drafts, so the scan is quiet, and only the writer's own
  ledger source disagreeing exposes the loss; one class-A case where the
  source agrees. `selftest.mjs` re-derives `provenance_says` for each. No
  class-B provenance fixture exists, and the manifest says why: a revision
  that corrects a misquotation to the source changes what the original said,
  which is arguable, and a class-B fixture must be unarguable.

## Compatibility

The voice, structure and continuity critics, the reviser and every published
run are unchanged; the historical runs still re-check byte for byte, and their
`MANIFEST.json` pins the prompt they were run against. The prompt's sha has
changed, so `collect` on a run prepared before this release prints its usual
note that the transcripts are evidence about the earlier prompt.

## Evidence and limits

- `node bundles/prose-review/tests/selftest.mjs`: zero failed, three
  provenance fixtures re-derived (scan FAITHFUL on all three; provenance
  drifted, drifted, exact); `run-harness-test.mjs` and `revise-harness-test.mjs`
  green; the four historical runs re-check.
- **No fidelity run with a provenance block has been dispatched.** The build
  environment had no authenticated CLI. The first run is the next session's
  job; until it is recorded, the block's evidence is the fixture set, and an
  undispatched run is recorded as not run, never as passed. The narrow
  extension is revisited if that run shows the block raising false positives
  on the existing fixtures.
