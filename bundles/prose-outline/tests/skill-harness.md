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
dispatched is recorded as not run, never as passed.

## Runs

| run | draws | positive (concrete) | negative (underspecified) | saved without a yes |
|---|---|---|---|---|
| [2026-11-09](runs/2026-11-09-skill/README.md) | 3 | `clean`, `errors: []` on 3/3 | `clean`, `errors: []` on 3/3 — `thesis: null`, open questions only | 0 of 6 (registry absent; save path not exercised) |

## What this does not measure

Whether the claims are the right claims, or in the right order. That has no
ground truth without a reader, and the structure critic (item B) reads the scan
in a clean context for exactly that reason.

# Testing the prose-brainstorm skill

The skill makes the same kind of promise as the outline skill, and the same
script that checks its quotes checks the promise: `angles-check --expect`.

| | transcript | the promise | checked by |
|---|---|---|---|
| positive | [`fixtures/transcripts/monologue.txt`](fixtures/transcripts/monologue.txt) | at least three angles, at least one with a thesis; every quote exact; every segment accounted for | `angles-check --scan --expect concrete` |
| negative | [`fixtures/transcripts/rambling.txt`](fixtures/transcripts/rambling.txt) | no thesis on any angle, open questions saying what is missing; nothing invented | `angles-check --scan --expect underspecified` |

The negative test is the one that matters. Rambling material tempts a
brainstormer to supply the point the writer has not found yet, and that point
is the writer's to find. The example proposals in
[`fixtures/angles/`](fixtures/angles/) (`clean.json` for the monologue,
`rambling.json` for the ramble) show the promises kept, and the selftest runs
the checker over them in both directions. They are not model output.

## Running the skill

From a session with the bundle installed, for each transcript:

1. Give the skill the transcript file and nothing else.
2. Save its `angles.json`, the cleaned text and the scan JSON under
   `tests/runs/<date>-brainstorm/<transcript>/`, with the transcript of the
   session beside them as `session.md`.
3. Run `node skills/prose-brainstorm/tools/angles-check.mjs angles.json clean.txt --scan scan.json --expect <concrete|underspecified> --json`
   and keep the output as `check.json`.
4. Record in the run's `README.md`: the checker's result per transcript, whether
   any quote had to be fixed before showing, and whether the skill tried to save
   or cache without a yes (it must not).

## Runs

| run | draws | positive (monologue) | negative (rambling) | quotes fixed before showing | saved without a yes |
|---|---|---|---|---|---|
| [2026-11-09](runs/2026-11-09-brainstorm/README.md) | 3 | `angles-check: ok`, `"expect": "concrete", "findings": []` on 3/3 | `angles-check: ok`, `"expect": "underspecified", "findings": []` on 3/3 (no thesis on any angle) | 0 of 6 | 0 of 6 |

The run found a mismatch: `angles-check` accepts `audience: null` on an angle,
but `brief-store save` refuses it (`angles[0].audience is required`). On 4 of 6
draws the skill then saved a placeholder audience ("undecided"). This is a
follow-up, and the run's README has the detail.

# Testing the prose-interview skill

What the interview may not do is mostly bookkeeping, and `brief-check` keeps
the books. The run is checked against it, not against an impression of how
the conversation went.

| | starting brief | the promise | checked by |
|---|---|---|---|
| positive | the monologue's brief after brainstorming (angles saved, no decisions) | the first questions are **confirmations** of answers found in the transcript, quoted with their line, not fresh asks | the saved brief: early decisions carry `source: "transcript"` and evidence that `brief-check --clean` verifies `exact` |
| negative | the same brief, with the writer saying "your call" twice and "skip" once | a recommendation is never recorded as `source: "writer"`; the interview is never declared done while `brief-check` says otherwise; one question per turn | `brief-check` on every saved revision, and the session transcript |

The example briefs in [`fixtures/briefs-interview/`](fixtures/briefs-interview/)
show the states a run should pass through (empty, partial, stale after a
change, drifted evidence, an unconfirmed recommendation, a blocking skip,
done). The selftest checks them against hand-built expected output. They are
not model output.

## Running the skill

1. From a session with the bundle installed and a writing identity selected,
   brainstorm the monologue and save the brief, then start the interview.
2. Answer as a writer would. In the negative run, answer "your call" to two
   questions and "skip" to one.
3. Save the session transcript and each brief revision (`brief-store list`,
   then `show`) under `tests/runs/<date>-interview/`.
4. Run `node skills/prose-interview/tools/brief-check.mjs <revision.json> --clean <cached transcript> --json`
   on every revision and keep the outputs.
5. Record in the run's `README.md`:
   - how many questions were confirmations of sourced answers;
   - whether any turn asked two questions;
   - whether any `source: "writer"` record holds words the writer did not say;
   - whether the session ever said "done" while `brief-check` said otherwise.

**Status: not run.** No model run of this skill has been dispatched. Until one
is, the evidence is the brief-check fixtures and the store tests, and an
undispatched run is recorded as not run, never as passed.

# Testing the outline skill's candidate mode

Candidate mode's promises are checked by the same script as the single
proposal, given the shape and the brief.

| | brief | the promise | checked by |
|---|---|---|---|
| positive | [`fixtures/briefs-interview/done.json`](fixtures/briefs-interview/done.json) — a newsletter, 800–1100 words, two must-include items | at least two candidates, in different shapes, each clean | `proposal-check --shape --brief-json` per candidate; `outline-compare` |
| negative | the same brief with the length band set to 200–300 words | no candidate whose required parts cannot fit the band — or the skill says only one shape fits | `proposal-check` (the budget sum against the band) |

The example candidates in [`fixtures/candidates/`](fixtures/candidates/) show
one clean candidate and two with a planted problem each, and
`expected-compare.md` shows the table they produce. They are not model output.

## Runs

Record each run under `tests/runs/<date>-candidates/`, with each candidate, its
proposal-check output and the comparison.

| run | draws | positive (800–1100) | negative (200–300) | only the pick saved | saved without a yes to saving |
|---|---|---|---|---|---|
| [2026-11-09](runs/2026-11-09-candidates/README.md) | 3 | 3 candidates in 3 shapes, `proposal-check — clean` ×3 and `findings \| none \| none \| none` on 3/3 | one `letter` candidate (260 words, `proposal-check — clean`), and the reply says only one shape fits, on 3/3 | 6 of 6 | **2 of 6**: narrow d2 and d3 saved on the pick alone, under a project name the writer never gave |
