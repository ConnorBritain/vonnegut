# prose-review v0.7.0 release notes

v0.7.0 ships `prose-reader-critic`: one clean-context reviewer prompt that
reads a draft as one named reader — described in a persona file the session
pastes beside the draft — and reports where that reader stops, then makes one
forced choice. Four personas ship as data files, including the adversarial
reader `DESIGN.md` has described since v0.1. Roadmap item G
([`docs/roadmap/G-reader-personas.md`](../../docs/roadmap/G-reader-personas.md)).

## Added

- `prose-reader-critic` (primitive + byte-identical bundle copy), verdict
  `CLEAN` / `REVISE`. Findings quote the sentence and say, as that reader, why;
  a `FORCED CHOICE` is always present and is never by itself a `REVISE`; the
  `reads_for` items that produced nothing are listed. Uncertainty resolves to
  silence: there is no ground truth for "this reader would stop here".
- `personas/skeptical-cto.md`, `first-time-reader.md`, `acquisitions-editor.md`,
  `adversarial-reader.md` — frontmatter `name`, `reads_for`, `never`,
  `forced_choice`, and a paragraph. A persona is an input, never a template:
  the prompt embeds none, so the byte-identical rule holds and a new reader is
  a file, not a primitive.
- `tools/persona-check.mjs`: validates a persona (all four keys, non-empty
  lists, the two refusals every reader shares — judging prose quality and
  guessing who wrote it — no verdict word) and a transcript's shape (cited
  stops, forced choice, bare verdict, no authorship claim), so the harness's
  contract counts are derived rather than typed.
- Harness: `run-harness.mjs prepare reader [--personas a,b]` stages every
  persona × the twelve leave-one-out argumentative essays, negatives only —
  there is no material where a reader's stop is known by construction;
  `verify-run.mjs` carries `missing_forced_choice` as a third contract count.
- `DESIGN.md`: the adversarial reader's row becomes a persona file; the forced
  choice moves to the reader critic. `PROTOCOL.md` step 2: personas are
  conditional spawns the author names, never by default.

## Compatibility

Every other critic, the reviser and every published run are unchanged; the
historical runs still re-check byte for byte. Legacy runs without a MANIFEST
still resolve to the voice or fidelity critic by verdict word; the reader,
medium and structure critics are named by their MANIFEST.

## Evidence and limits

- `node bundles/prose-review/tests/selftest.mjs`: zero failed — the four
  personas validate; six persona refusals; the transcript checker derives every
  contract count in both directions; the fixture enumeration; `prepare reader`
  exercised end to end (12 leak-free prompts per persona, the persona staged
  raw beside a frontmatter-stripped draft).
- Two mutations in the `review` suite (a persona allowed to omit the shared
  refusals; a forced choice alone allowed as a `REVISE`), both caught; the
  sweep's table is in `bundles/prose-author/tests/MUTATIONS.md`.
- **First reader run, 2026-11-09** (`tests/runs/2026-11-09-reader`, 4 personas
  × 12 essays × 3 draws through `run-harness.mjs dispatch`, recorded after this
  release). `verify-run.mjs` over the whole run, quoted:

  ```
      negative (reader finishes, n=48):    16 REVISE, 32 CLEAN
      positive (reader stops, n=0):       0 REVISE, 0 CLEAN
      cases whose k=3 draws did not all agree:  6 of 48   (a split is a finding)
      stops without a quoted sentence: 0          <- must be 0
      any claim about machine authorship: 0        <- must be 0
      transcripts without a FORCED CHOICE: 0       <- must be 0
  ```

  Per persona (the same tool over each persona's transcripts, quoted in the
  run's `verify-run-by-persona.txt`): `skeptical-cto` 1 `REVISE` of 12, within
  the 0–2 default; `acquisitions-editor` 3 of 12 and `first-time-reader` 3 of
  12, **exceeding the default**; `adversarial-reader` 9 of 12, **exceeding the
  default** into the band `critic-harness.md` calls broken. No persona was
  tuned in response; that, or a per-persona default, is follow-up. The
  contract counts were made by the session, not a person.
  A persona is a description, not a person; the bound is measured on essays,
  not on the writer's genre; four personas is a starting set.
