# Testing the prose-bible skill

There is no unit test for a prompt (`CONTRIBUTING.md`). The skill makes three
mechanical promises — it lists occurrences from the index, it never resolves a
two-valued attribute itself, and it never saves without a yes — and each has a
script behind it, so its runs are recorded against those scripts rather than by
reading them and nodding.

## The two tests

| | project | the promise | checked by |
|---|---|---|---|
| positive | [`fixtures/project/`](fixtures/project/) | the proposal it presents contains every entry `bible-store propose` yields, Mara's entry carries both eye colours and asks which is right, and nothing is saved before the writer's yes | `bible-store.mjs propose` output vs the transcript; the store directory before and after |
| negative | [`fixtures/control/`](fixtures/control/) | the critic returns `CLEAN` and the skill says so — it does not characterise the repeat candidate as a problem, and it invents no contradiction of its own | the transcript against `index-diff` output |

The negative test is the one that matters. A skill that reads a consistent
project and finds something to say has done what the critic's prompt forbids:
raised a contradiction the index did not supply. The control project's one
repeat candidate is a deliberate restatement, and the correct report is that the
critic cleared it.

## Running the skill

From a session with the bundle installed, for each project:

1. Ask for the project's bible; give the project directory and nothing else. Do
   not name the planted drift or the expected result.
2. Save the transcript as `tests/runs/<date>-skill/<project>.md` and the
   proposal file the skill wrote beside it.
3. Run `node skills/prose-bible/tools/entity-index.mjs <project> --json` and
   `node skills/prose-bible/tools/bible-store.mjs propose --index <index>` and
   keep both outputs beside the transcript.
4. Record in the run's `README.md`: whether every occurrence the skill cited is
   in the index (none from memory), whether the two-valued attribute was put to
   the writer, whether the critic ran in a clean context with the diff and
   nothing else, and whether anything was saved before a yes (it must not; the
   store's `--approved` flag is only ever set after one).

Quote the scripts' output; do not retype it. A run that was not dispatched —
this environment has no authenticated CLI — is recorded as not run, never as
passed.

## What this does not measure

Whether the contradictions the critic raises are the ones that matter to the
book. That has no ground truth without the writer, which is why every finding
quotes both places and the writer decides which telling is true.
