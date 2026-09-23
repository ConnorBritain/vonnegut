# Testing the prose-outline skill

There is no unit test for a prompt (`CONTRIBUTING.md`). What there is here: the
two promises the skill makes about briefs are mechanical, so a script checks
them, and the skill's runs are recorded against that script rather than by
reading them and nodding.

## The two tests

| | brief | the promise | checked by |
|---|---|---|---|
| positive | [`fixtures/briefs/concrete.md`](fixtures/briefs/concrete.md) | a thesis, and an evidence slot on every claim | `proposal-check --brief` |
| negative | [`fixtures/briefs/underspecified.md`](fixtures/briefs/underspecified.md) | `thesis: null` and open questions naming what is missing — no invented thesis | `proposal-check --brief` |

The negative test is the one that matters. A planner that fills an
underspecified brief with a plausible thesis has done the writer's thinking for
them, badly, and the schema now refuses that shape outright: a null thesis with
no open question is invalid, and the checker flags a thesis on an
underspecified brief.

The example proposals beside each brief (`*.proposal.json`) are what a keeping
of the promise looks like; the selftest runs the checker over them so the
checker itself is proved to pass and to fail. They are not model output.

## Running the skill

From a session with the bundle installed, for each brief:

1. Give the skill the brief text and nothing else. Do not name the expected
   shape; the brief's `expect:` frontmatter is for the checker, so strip the
   frontmatter before pasting.
2. Save the proposal it writes under `tests/runs/<date>-skill/<brief>.proposal.json`
   and the transcript beside it as `<brief>.md`.
3. Run `node skills/prose-outline/tools/proposal-check.mjs <proposal> --brief <brief> --json`
   and keep the output as `<brief>.check.json`.
4. Record in the run's `README.md`: draws, checker status per brief, and
   whether the skill tried to save without a yes (it must not; the store's
   `--approved` flag is only ever set after one).

Quote the checker's output in the PR; do not retype it. A run that was not
dispatched — this environment has no authenticated CLI — is recorded as not
run, never as passed.

## What this does not measure

Whether the claims are the right claims, or in the right order. That has no
ground truth without a reader, and the structure critic (item B) reads the scan
in a clean context for exactly that reason.
