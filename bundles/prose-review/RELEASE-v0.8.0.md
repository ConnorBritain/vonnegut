# prose-review v0.8.0 release notes

v0.8.0 adds the chief editor's reading pass. The `prose-edit` skill walks the
writer through a reviewed draft section by section, with the consolidated notes
for each section beside it. The writer accepts, declines or defers each note,
and adds their own. Exactly the accepted notes become the reviser's plan.
Roadmap item L ([`docs/roadmap/L-chief-editor.md`](../../docs/roadmap/L-chief-editor.md));
PROTOCOL step 3a.

## Added

- **`skills/prose-edit/`** (kind reviewer, read-only on the draft) is the
  bundle's first skill. The cursor manifest now discovers `skills/`.
- **`tools/section-split.mjs`** splits a draft into reading units: by heading,
  or by four-paragraph window when there are no headings. Unit ids are derived
  from each unit's text, so an edit elsewhere never renames a unit.
- **`tools/notes-check.mjs`** checks the `edit-notes/1` ledger:
  - every note is placed by its quote inside its own unit;
  - every unit is read, or skipped with a reason;
  - no note is still proposed when the pass is finished;
  - the session is never a source.

  Its export holds exactly the accepted notes, as PLAN-FORMAT entries.
- **PROTOCOL step 3a**, plus README, AGENTS and DESIGN updates. The editor's
  pass is consolidation applied to reading, not a new agent.

## Compatibility

The critics, the reviser and every published run are unchanged. Skipping step
3a leaves the protocol as it was.

## Evidence and limits

- `node bundles/prose-review/tests/edit-selftest.mjs` reports zero failed.
  - The units are right for a sectioned draft and for a heading-free one.
  - Ids stay stable under an edit elsewhere.
  - The four ledgers each name exactly their planted problem.
  - The export carries only accepted notes, and in the reviser's shape.
- The full mutation sweep is green. Four mutations in the new `edit` suite are
  all caught: a note placed anywhere, declined notes exported, an unread unit
  ignored, and a finished pass with notes still proposed.
- **No model run of the skill has been dispatched**, so it is recorded as not
  run. "Adds no finding of its own" is a prompt rule, partly backed by the
  ledger refusing any source but a critic or the writer.
- The pass is only as good as the critics behind it, and only their measured
  bounds are evidence.
