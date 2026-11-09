# `edit-notes/1`

The editor's ledger for one draft: which reading units were read, and what
the writer decided about each note. It is task-local, beside `plan.json`, and
never a registry store. The validator and exporter is `tools/notes-check.mjs`.

```json
{
  "schema": "edit-notes/1",
  "draft_digest": "<sha256 of the draft the notes were made on>",
  "finished": false,
  "units": [ { "id": "ua1f2aac3", "status": "read", "skip_reason": null } ],
  "notes": [
    { "id": "N1", "unit": "ua1f2aac3", "source": "voice-critic",
      "line": 15, "quote": "we starve the part that decides it",
      "note": "what the critic found, in one line",
      "change": "replace 'starve' with 'neglect'",
      "status": "accepted", "writer_comment": null }
  ]
}
```

| Field | Rule |
|---|---|
| `units[].id` | A `section-split` unit id. These are derived from the unit's text, so they are stable while it is unchanged. |
| `units[].status` | `read`, or `skipped` with the writer's `skip_reason`. |
| `notes[].source` | Exactly one of: a critic (`voice-critic`, `structure-critic`, `fidelity-critic`, `medium-critic`, `continuity-critic`, `reader-critic:<persona>`), or `writer`. The session itself is never a source. |
| `notes[].quote` | The span the note rests on. It must be inside the unit the note is filed under. The quote is the anchor, and `line` is reported if it moved. |
| `notes[].status` | `proposed` → `accepted` / `declined` / `deferred`. Only the writer moves a note out of `proposed`. |
| `notes[].change` | Required when accepted: a short imperative the reviser can execute (PLAN-FORMAT). |
| `finished` | Set when the writer ends the pass. A finished ledger has every unit read or skipped, and no note still proposed. |

`notes-check --export` writes the accepted notes, and only those, as
[PLAN-FORMAT](../../../PLAN-FORMAT.md) entries:
- `id`: `eNN`;
- `source` and `location` carried over;
- `change`;
- `reason`: the note text.

These are appended to `plan.json` for the reviser.
