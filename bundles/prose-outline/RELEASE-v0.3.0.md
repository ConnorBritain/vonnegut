# prose-outline v0.3.0 release notes

v0.3.0 adds the interview. The `prose-interview` skill settles the decisions
that make a piece what it is:
- the angle, audience, purpose, form, length, shape and thesis;
- optionally, what must be in it, what stays out, earlier work to link to, and
  claims to check.

It asks one question at a time, with a recommended answer each, in the
"grill me" style, with one amendment: whatever the writer's own material
already answers is looked up and put to them to confirm, not asked fresh.
Roadmap item I ([`docs/roadmap/I-interview.md`](../../docs/roadmap/I-interview.md));
the end-to-end path is [`docs/workflow.md`](../../docs/workflow.md).

## Added

- `skills/prose-interview/` (kind planner):
  - takes the next question from `brief-check`, never its own choice;
  - looks for the answer in the transcript, the summary, the angles, this
    project's outline and any sibling read output the session supplies;
  - confirms a found answer before recording it; "your call" and "skip" are
    recorded explicitly;
  - stops only when `brief-check` says done.
- `tools/lib/decisions.mjs`: the decision tree as data, with validators. A
  found answer carries its quote; a link names its kind, ref and why.
- `tools/brief-check.mjs`:
  - the next question in dependency order;
  - transitive staleness: change the audience and the purpose, form, length,
    shape and thesis come back;
  - required skips that block;
  - transcript and summary evidence re-verified, where a drifted quote puts the
    decision back to the writer;
  - `done`.
- `brief-store decide`: merges an approved batch of answers and stamps each with
  the revision it writes, so staleness is computed and cannot be forged.
- `lib/quote.mjs`: one quote rule for angles-check and brief-check.
  decisions.mjs, brief-store.mjs and transcript-scan.mjs ship byte-identical in
  both skills, pinned by `tools/check-packaging.mjs`.

## Compatibility

`project-brief/1` is unchanged. Its `decisions` and `links` fields are now
validated by both skills' stores. The outline skill, `voice-outline/1`, the
brainstorm and its tools behave as in 0.2.0. The quote functions moved into a
shared module, and the results are identical.

## Evidence and limits

- `node bundles/prose-outline/tests/brainstorm-selftest.mjs` reports zero
  failed. Its fixtures are seven hand-built briefs:
  - empty;
  - partial;
  - audience changed;
  - drifted evidence;
  - an unconfirmed recommendation;
  - a blocking skip;
  - done.

  Each brief reproduces its expected brief-check output. The store tests show
  `decide` stamping and refusing what it should.
- The full mutation sweep is green, and covers this release and 0.2.0 in one
  run. Four mutations in the `brainstorm` suite are all caught:
  - an unconfirmed answer counted as settled;
  - staleness removed;
  - a found answer without evidence;
  - a question asked before its dependencies.
- **Measured on 2026-11-09:** 3 draws per script
  ([`tests/runs/2026-11-09-interview`](tests/runs/2026-11-09-interview/README.md),
  harness in [`tests/skill-harness.md`](tests/skill-harness.md)). The writer
  was simulated.
  - **Negative: met 3/3.** Every "your call" was saved as `recommended`, 6 of
    6. The skip was saved as null. Every saved revision reads `brief-check: not
    done … blocked by: length`, and no draw said done.
  - **Positive: not met as written, 0/3.** No draw opened with a confirmation.
    Confirmations of found answers came later: 4, 2 and 1 of the 7 required
    questions. The transcript evidence that was saved verifies exactly.
  - **5 of 6 draws** saved `source: "writer"` values with words the writer did
    not say, such as "Monday" and "(transcript lines 13–21)".
  - One draw put four optional decisions in one turn.
  - Follow-up. No prompt was edited in that run. The prompt is fixed in 0.4.1,
    [`RELEASE-v0.4.1.md`](RELEASE-v0.4.1.md); a re-run is owed.
- Known limits:
  - the tree suits non-fiction;
  - answers found in sources are only as good as what was supplied;
  - whether the questions were the right ones is not measured.
