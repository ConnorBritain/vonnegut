# prose-outline v0.4.1 release notes

A patch release. The first harness run of the brainstorm, the interview and
candidate mode (2026-11-09) found three problems, and this release fixes them.
Two of the fixes change skill prompts that the run measured as written, so a
re-run of the interview and candidate mode is owed.

## Fixed

- **prose-interview** (`SKILL.md`): the run met its positive test 0 of 3 times,
  and in 5 of 6 draws it saved words the writer did not say.
  - The lookup in the writer's material now happens on every turn, for every
    decision, starting with the brief's `chosen_angle`.
  - Any required decision whose answer is in the material is put as a
    confirmation, quoted with its location.
  - A `source: "writer"` value is the writer's reply verbatim. Locating detail
    goes in `evidence`, never in `value`.
  - Optional decisions are asked one per turn too.
  - The skill harness's positive promise is reworded to match: confirmations
    for every decision the material answers, not "the first questions".
- **Candidate mode** (`prose-outline/SKILL.md`): in 2 of 6 draws the skill
  saved on a pick without asking.
  - A pick is not a yes to saving. The save happens only after a yes, in a
    later turn.
  - It saves under the brief's project name, or one the writer gives. It never
    makes one up from the outline's title.
- **`project-brief/1`**: the store refused a blank `audience` that the check
  accepted, and 4 of 6 brainstorm draws saved a placeholder instead.
  - `audience` may now be `null` when the angle carries an open question, the
    same rule as `thesis`.
  - The brainstorm skill says to use `null` rather than a placeholder.
  - The fix is in both byte-identical copies of `brief-schema.mjs`.

## Compatibility

Every brief that validated before still validates. A null audience was refused
before and is accepted now. The tools' behaviour is otherwise unchanged.

## Evidence

- `node tools/check.mjs` passes, and the full mutation sweep is green.
- One new mutation is caught: a null audience accepted with no open question.
- The selftests pin the new prompt rules, so dropping one fails a check.
- **The prompt fixes are unmeasured.** The 2026-11-09 runs measured 0.4.0, and
  their READMEs say so. Re-running the interview and candidate-mode harnesses
  is owed.
