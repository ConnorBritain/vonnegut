# prose-outline v0.4.0 release notes

v0.4.0 adds outline baselines. From one project brief, the outline skill
proposes two or three candidate outlines in different shapes. Each candidate
splits the brief's length band across its sections. A script checks every
candidate and tabulates them side by side, and the writer picks one. Only the
pick is saved. Roadmap item J
([`docs/roadmap/J-outline-baselines.md`](../../docs/roadmap/J-outline-baselines.md)).

## Added

- **Shapes** live in `skills/prose-outline/shapes/` as data files: argument
  essay, narrative arc, problem–solution, Q&A, numbered lessons and letter. Each
  lists ordered parts, marks which are required, gives each part a share range,
  and adds a paragraph on when the shape works and how it fails.
  `tools/shape-check.mjs` validates them, shipped or personal.
- **Optional `voice-outline/1` fields**, validated when present and ignored by
  older readers, so the schema id is unchanged: `length`, `shape`, `brief_ref`,
  and per node `part`, `words` and `covers`.
- **`proposal-check`** gains three checks:
  - `--shape`: every required part is present, in the shape's order, with no
    unknown part and the right mode.
  - Budgets: the word budgets sum to within the length band.
  - `--brief-json`: every must-include item is covered, and the band is the
    brief's.

  A part outside its share range is a signal, never a finding.
- **`tools/outline-compare.mjs`** tabulates the candidates as facts. It gives no
  score and no ordering.
- **Candidate mode** is described in `SKILL.md`.

## Compatibility

Every outline written before this release validates unchanged, and the store
and the differ are unchanged.

## Evidence and limits

- `node bundles/prose-outline/tests/baselines-selftest.mjs` reports zero failed.
  - The six shapes validate, and three malformed shapes are each refused by name.
  - Over one brief there are three candidates: a clean problem–solution, a
    narrative arc whose budgets sum to 1,400 words against an 800–1,100 band,
    and a Q&A that leaves one must-include item uncovered. Each problem is named,
    and the comparison reproduces byte for byte.
- The full mutation sweep is green. Four mutations in the new `baselines` suite
  are all caught: the budget check removed, a missing required part accepted, an
  uncovered must-include item ignored, and overfilled shares accepted.
- **Candidate mode measured on 2026-11-09:** 3 draws per brief
  ([`tests/runs/2026-11-09-candidates`](tests/runs/2026-11-09-candidates/README.md),
  harness in [`tests/skill-harness.md`](tests/skill-harness.md)).
  - Positive: three candidates in three shapes, each `proposal-check — clean`,
    with `outline-compare` showing `findings | none | none | none`. Met 3/3.
  - Negative (200–300 words): one `letter` candidate, clean at 260 words, and
    the reply says only one shape fits. Met 3/3.
  - Only the picked candidate was saved, 6 of 6. But **2 of 6 draws saved on
    the writer's pick alone, without a yes to saving**, under an invented
    project name. Follow-up: fixed in 0.4.1 ([`RELEASE-v0.4.1.md`](RELEASE-v0.4.1.md)),
    and a re-run is owed.
- Share ranges are starting values, not measurements. Word budgets are plans.
  Six shapes is a starting set.
