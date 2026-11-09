# prose-author v0.10.1 release notes

A patch release. The first end-to-end run of drafting from an outline
(2026-11-09) found two problems, and this release fixes both.

## Fixed

- **`outline-job` refuses an outline that contradicts the brief.** If the
  outline's `shape` or its length band differs from the one the brief settled,
  the job is refused and the refusal names both values. Before this release, a
  contradicting outline was drafted from without comment, though every draw of
  the run noticed the mismatch on its own.
- **The handoff fixture agrees with itself.** In `brief.json`, the `shape`
  decision is now `problem-solution`, matching `outline.json`.
  `brief-other-shape.json` keeps the contradiction to test the refusal.

## Compatibility

Jobs from an outline and a brief that agree are byte-identical to 0.10.0's.
Jobs without a brief are unchanged.

## Evidence

- `node tools/check.mjs` passes, and the full mutation sweep is green.
- One new mutation is caught: a shape mismatch ignored.
- The expected jobs did not change. The 2026-11-09 run measured 0.10.0, and its
  results stand, because the job never carried the shape.
