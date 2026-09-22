# Testing the continuity critic

`prose-continuity-critic` reads a deterministic artifact — `index-diff`'s
candidates — so it gets the discipline prose-review's fidelity and structure
critics get (`bundles/prose-review/tests/critic-harness.md`), in a bundle-local
harness: [`continuity-harness.mjs`](continuity-harness.mjs). Why local rather
than a `CRITICS.continuity` entry in prose-review's runner is recorded in
[`DESIGN.md`](../DESIGN.md).

## The echo rule

The diff prints no verdict, so the harness supplies the parrot: **any candidate
is a contradiction.** That is the loudest rule possible, and it is what
`index-diff` would say if it were allowed a verdict. `diffSays(diff)` applies it;
it is a parrot, not a finding, and nothing ships it. It exists so the echo
baseline can be reported beside the critic's score and the fixtures classified.

## The fixtures

[`fixtures/continuity/fixtures.json`](fixtures/continuity/fixtures.json) — seven
small projects. At `prepare` time the harness runs `entity-index` and
`index-diff` over each and stages **only the diff JSON** (and `bible.json` where
one exists). The critic never sees the project files, the manifest, or the
expected verdict.

| class | echo rule says | critic must say | what it tests |
|---|---|---|---|
| **A** | quiet | `CLEAN` | it does not manufacture findings from an empty diff |
| **B** | flags | `CLEAN` | it clears an over-flag — a refrain, a restatement, two true definitions — with a reason |
| **C** | flags | `REVISE` | it names *which* candidates cannot both hold, citing both locations |
| **D** | quiet | `REVISE` | **empty by construction** — see below |

Class D cannot exist for this critic. It receives candidates, not text, and its
prompt forbids citing anything the index did not supply; an empty diff leaves it
nothing to cite. What the index missed is an *Index gaps* note, never a finding.
The manifest states this so the absence reads as a decision, and `selftest.mjs`
requires classes A, B and C to hold at least two fixtures each and D to hold none.

**The negative test for this critic is class B.** `index-diff` alone would send
the writer after every refrain; a critic that agrees with the diff on those three
fixtures has added nothing. The parrot scores 0 of 3 on them by construction.

The two contract counts, filled by a person in `review.json` before `collect`
will wrap anything: `uncited` (a finding that does not quote both locations) and
`third_location` (a finding that cites a file:line the staged diff did not
supply). Either non-zero blocks the primitive regardless of score.

## Running one

```bash
node tests/continuity-harness.mjs prepare 2026-XX-XX-continuity          # 7 cases × 3 draws
#   dispatch one clean-context critic per prompts/case-NN-dK.md, save raw/<fixture>-dK.md
node tests/continuity-harness.mjs collect runs/2026-XX-XX-continuity     # review.json, then wrap + tally
node tests/continuity-harness.mjs check   runs/2026-XX-XX-continuity     # re-derive every wrapper
```

`collect` prints, beside the per-fixture verdicts:

```
    critic  — negatives quiet N/15, positives caught N/6
    parrot  — negatives quiet 6/15, positives caught 6/6   (any candidate is a contradiction)
    contract — uncited=N, third_location=N   (operator counts, carried through, not derived)
```

The parrot's negative score is fixed by the fixture set: quiet on the two
class-A projects, loud on the three class-B ones.

## Runs

**No continuity run has been dispatched yet.** The environment that built the
critic had no authenticated CLI. `prepare` was exercised end to end by
`selftest.mjs` (seven leak-free prompts, one staging a bible; a poisoned copy
aborts before a MANIFEST is written; `collect` and `check` round-trip synthetic
transcripts byte-for-byte). The first real run is the next session's job, and
until it is recorded here the critic's evidence is the fixture set and the
harness, not a number. An undispatched run is recorded as not run, never as
passed.

| run | draws | negative (A+B, n=5) | positive (C, n=2) | uncited | third_location |
|---|---|---|---|---|---|
| — | — | not run | not run | — | — |
