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
- **First fidelity run with the provenance block, 2026-11-09**
  (`tests/runs/2026-11-09-fidelity-provenance`, all 16 fixtures × 3 draws
  through `run-harness.mjs dispatch`, recorded after this release).
  `verify-run.mjs` prints, quoted:

  ```
      negative (faithful revisions, n=7):     2 MATERIAL-LOSS, 5 FAITHFUL
      positive (lossy revisions, n=9):        9 MATERIAL-LOSS, 0 FAITHFUL
      cases whose k=3 draws did not all agree:  1 of 16   (a split is a finding)
      findings not quoting both original and revision: 0   <- must be 0
      claims an atom is present that the scan flagged: 0   <- must be 0

      verdicts matching the fixture's expected verdict:  14 of 16
      losses the scan flagged and the critic cleared:    1
      losses the scan missed and the critic caught:      6
      verdicts identical to fidelity-scan's (echo rate): 9 of 16
  ```

  The three provenance fixtures went as specified on every draw: the `exact`
  negative `FAITHFUL` 3 of 3, both `drifted` positives `MATERIAL-LOSS` 3 of 3.
  The two negatives that read `MATERIAL-LOSS` (`n-beauty-modernised`,
  `n-rossolimo-island-dropped`) carry no provenance block and were flagged on
  every S4 draw too. So the run does **not** show the block raising false
  positives on the existing fixtures, and the narrow extension stands. The
  contract counts were made by the session, not a person.
