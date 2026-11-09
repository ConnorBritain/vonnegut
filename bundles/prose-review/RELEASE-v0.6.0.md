# prose-review v0.6.0 release notes

v0.6.0 ships `prose-medium-critic`, designed in `DESIGN.md` since v0.1 and held
until it had something deterministic to read. It answers one question — does
this piece survive the medium it will be delivered in — against a
`medium-profile/1` and the output of `repurpose-check`, both supplied by the
session as blocks. Roadmap item F
([`docs/roadmap/F-prose-repurpose.md`](../../docs/roadmap/F-prose-repurpose.md)).

## Added

- `prose-medium-critic` (primitive + byte-identical bundle copy), verdict
  `CLEAN` / `REVISE`, findings of three classes — breaks-in-medium,
  cuts-a-sentence, constraint-unmet — each with a quoted span and the profile
  constraint or `delivery_notes` it rests on. It may not re-count anything the
  check counted; a failed mechanical constraint is the writer's, not a finding;
  uncertainty resolves to silence.
- Harness: `run-harness.mjs prepare medium` stages the piece and its profile,
  computes `repurpose-check` at prepare time through prose-author's tool (a
  producer imported at test time) and embeds it in the task; `verify-run.mjs`
  prints the echo baseline from the harness's stated echo rule ("any failed
  mechanical constraint"); `medium-harness.mjs` holds the rule, the fixture set
  and the task text once.
- Six synthetic fixtures in the four-class discipline (A 2, B 1, C 1, D 2) and
  six leave-one-out Doctorow posts under the newsletter profile, every one over
  the word band so the parrot scores 0 of 6 on the negatives and the critic
  must stay quiet where the count is loud; `selftest.mjs` re-derives every
  class.
- `DESIGN.md` open question 5 answered: a bundle member, because nobody wants
  it without the other critics and it receives the profile rather than reading
  another bundle's install. `PROTOCOL.md` step 2 says when it spawns.

## Compatibility

Every other critic, the reviser and every published run are unchanged; the
historical runs still re-check byte for byte. The critic needs a profile and a
check output from `prose-author`'s `prose-repurpose` skill; without them it does
not spawn and the report says so.

## Evidence and limits

- `node bundles/prose-review/tests/selftest.mjs`: zero failed; medium fixtures
  re-derived; `run-harness-test.mjs` and `revise-harness-test.mjs` green;
  `prepare medium` exercised end to end (12 leak-free prompts).
- **First medium run, 2026-11-09** (`tests/runs/2026-11-09-medium`, 12 cases ×
  3 draws through `run-harness.mjs dispatch`, recorded after this release).
  `verify-run.mjs` prints, quoted:

  ```
      negative (survives delivery, n=9):   8 REVISE, 1 CLEAN
      positive (breaks in the medium, n=3): 3 REVISE, 0 CLEAN
      cases whose k=3 draws did not all agree:  1 of 12   (a split is a finding)
      findings without a quoted span: 0             <- must be 0
      any claim about machine authorship: 0        <- must be 0
          counts the check failed and the critic cleared:           0
          delivery problems the check could not see and the critic caught: 3
          verdicts identical to the echo rule's (echo rate):         9 of 12
  ```

  **The negative test this critic ships on was not met**: quiet on 1 of 9
  negatives. All six leave-one-out newsletters also fail `repurpose-check`'s
  `length-band`, so they are not the compliant posts the test assumes, and both
  thread negatives carry a segment ("The first three are bad…") that every draw
  flagged as not standing alone. No prompt was tuned in response; fixing the
  fixtures or the prompt, and re-running, is follow-up. Delivery judgements have
  no ground truth. The run also fixed `verify-run.mjs`'s medium echo block,
  which always printed 0 for cleared and caught.
