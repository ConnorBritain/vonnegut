# Testing the prose-research skill

There is no unit test for a prompt (`CONTRIBUTING.md`). The skill makes three
mechanical promises — it runs the checks rather than asserting, it never fills
in confidence, and it never saves without a yes — and each has a script behind
it, so its runs are recorded against those scripts rather than by reading them
and nodding.

## The two tests

| | inputs | the promise | checked by |
|---|---|---|---|
| positive | [`fixtures/sources/`](fixtures/sources/), [`fixtures/ledger/ledger.json`](fixtures/ledger/ledger.json), [`fixtures/drafts/draft.md`](fixtures/drafts/draft.md) | the report quotes `claims-check`'s rows (k3 and k4 drifted with both wordings, k5 absent, s3 dead, two unledgered sentences) and says nothing about whether any claim is true; every claim's confidence in the proposed ledger was asked of the writer; nothing is saved before a yes | the transcript against `claims-check --json`; the store directory before and after |
| negative | [`fixtures/drafts/no-claims.md`](fixtures/drafts/no-claims.md) | the sentence map marks no sentence as a claim, coverage is empty, and the skill invents no ledger entry to fill it | `claims-check` over the skill's own map: `coverage: []` |

The negative test is the one that matters. A skill that reads a walk in the
rain and finds a claim to ledger has done the thing the bundle exists to
prevent: manufactured provenance where there is nothing to prove.

## Running the skill

From a session with the bundle installed:

1. Positive: give the skill the two sources, the ledger and the draft; ask it
   to check the draft. Do not name the planted drifts. Save the transcript as
   `tests/runs/<date>-skill/positive.md`, the sentence map it wrote beside it,
   and `claims-check --json` over that map as `positive.check.json`.
2. Negative: give it `no-claims.md` and the same ledger; ask which claims need
   a source. Save the transcript and its map as `negative.*`.
3. Record in the run's `README.md`: whether every row the skill reported is in
   the check's output (none from memory), whether any sentence says a claim is
   true or false (it must not), whether confidence was asked rather than
   filled, and whether anything was saved before a yes.

Quote the scripts' output; do not retype it. A run that was not dispatched —
this environment has no authenticated CLI — is recorded as not run, never as
passed.

## What this does not measure

Whether the sentence map is right about which sentences are claims. That is a
judgement, shown to the writer beside the check; `claim-audit` in prose-author
makes the same judgement independently at draft time, and the two are meant to
disagree sometimes.
