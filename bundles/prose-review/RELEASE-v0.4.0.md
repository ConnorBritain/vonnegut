# prose-review v0.4.0 release notes

v0.4.0 adds a third read-only critic, `prose-structure-critic`, to the step-2
fan-out. It answers one question — does this draft's structure carry its
argument — against `prose-outline`'s deterministic scan and, when the writer
has one, the outline they intended. Roadmap item B
([`docs/roadmap/B-prose-structure-critic.md`](../../docs/roadmap/B-prose-structure-critic.md)).

## Added

- `prose-structure-critic` (primitive + byte-identical bundle copy), verdict
  `CLEAN` / `REVISE`, findings of four classes — unsupported claim, order,
  transition, imbalance — each with a quoted span, the scan field or outline
  node it rests on, and a `PLAN-ENTRY` in PLAN-FORMAT shape for the
  consolidating session. It never re-counts what the scan counted.
- Two tie-breaks in one prompt, stated on the critic's first line: with an
  intended outline, support and order are checkable and uncertainty resolves to
  `REVISE`; without one, only transitions and balance are assessed and
  uncertainty resolves to silence. Both are recorded in `meta.yaml`.
- Harness support: `run-harness.mjs prepare structure` stages 21 cases (nine
  synthetic drafts with intended outlines where the case is about support or
  order, twelve named leave-one-out human essays), `verify-run.mjs` prints the
  echo baseline from the harness's stated echo rule, and `selftest.mjs`
  re-derives every fixture's class and requires at least two per class.
- `PROTOCOL.md` step 1 names the second scan and step 2 the fan-out rule;
  `AGENTS.md` carries the portable instruction block; `DESIGN.md`'s table
  records that *order* and *weakest section* moved here from the unshipped
  adversarial reader and *claims without support* from the unshipped
  substance critic.

## Compatibility

The voice and fidelity critics, the reviser and every published run are
unchanged; the four historical runs still re-check byte for byte. The structure
critic shares the voice critic's verdict words, so run directories now name
their critic in `MANIFEST.json` and both runners read it. It needs
`prose-outline` for the scan; without it the protocol says structure was not
reviewed and nothing is estimated by eye.

## Evidence and limits

- `node bundles/prose-review/tests/selftest.mjs`: 361 checks, zero failed,
  structure class distribution A=2 B=3 C=2 D=2; `run-harness-test.mjs` and
  `revise-harness-test.mjs` green; `prepare structure` exercised end to end
  (21 leak-free prompts, 4 in intended-outline mode).
- **First structure run, 2026-11-09** (`tests/runs/2026-11-09-structure`,
  21 cases × 3 draws through `run-harness.mjs dispatch`, recorded after this
  release). `verify-run.mjs` prints, quoted:

  ```
      negative (sound structure, n=17):     0 REVISE, 17 CLEAN
      positive (planted gap, n=4):         4 REVISE, 0 CLEAN
      cases whose k=3 draws did not all agree:  0 of 21   (a split is a finding)
      findings without a quoted span and a scan/outline reference: 0   <- must be 0
      any claim about machine authorship: 0        <- must be 0

      verdicts matching the expected verdict:                    21 of 21
      counts the scan flagged and the critic cleared:            15
      gaps the scan could not see and the critic caught:         2
      verdicts identical to the echo rule's (echo rate):         4 of 21
  ```

  The leave-one-out negative is 0 `REVISE` of 12, inside the "≤ 2 of 12"
  default; that remains a default, not a derived threshold. One model, one
  day; the contract counts were made by the session, not a person.
- The leave-one-out negative measures structure a human writer found
  acceptable, not whether the critic finds the right gaps; the class-D
  positives are synthetic. Order has no ground truth without an outline, and
  the draft-only mode's silence is the honest answer to that.
