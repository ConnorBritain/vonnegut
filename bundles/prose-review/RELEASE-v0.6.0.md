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
- **No medium run has been dispatched.** The environment had no CLI; the first
  run is the next session's job, and until it is recorded the critic's evidence
  is its fixture set and harness, not a number. Delivery judgements have no
  ground truth, and the critic ships on the negative test.
