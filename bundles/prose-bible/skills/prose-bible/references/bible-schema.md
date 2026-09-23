# `voice-bible/1`

The continuity bible the skill proposes, the store keeps and `index-diff`
reads. The validator is `tools/lib/bible-schema.mjs`; this is the readable form.

## A proposal (what the skill writes after the writer confirms)

```json
{
  "entries": [
    { "id": "b1", "kind": "character", "name": "Mara", "key": "mara",
      "attributes": { "eyes": "grey", "habit": "counts doors when anxious" },
      "definition": null,
      "first_seen": { "file": "chapter-01.md", "line": 3 },
      "notes": "eye colour matters in chapter nine — do not change" },
    { "id": "b2", "kind": "term", "name": "Book of Hours", "key": "book of hours",
      "definition": "Teodor's name for the flour ledger; a joke about the monastery",
      "first_seen": { "file": "chapter-01.md", "line": 5 }, "notes": "" }
  ]
}
```

The store adds the envelope (`schema`, `id` = project, `revision`,
`parent_digest`) on save.

## Fields

| Field | Rule |
|---|---|
| `entries[].id` | `b1`, `b2`, … Unique and **stable across revisions**; reuse when revising. |
| `entries[].kind` | `character`, `term`, `event`, `metaphor`, `concept`. |
| `entries[].name` | The surface form the writer uses. |
| `entries[].key` | The index's key for the same thing: lower case, leading article dropped. This is how `index-diff` joins the bible to the text; unique per bible. |
| `entries[].attributes` | Optional. Plain strings by attribute name (`eyes`, `hair`, `age`, …). `index-diff` compares them to what the text states, so write the value the way the text does. |
| `entries[].definition` | Optional, or `null`. Compared to the text's definitions by content-word overlap. |
| `entries[].first_seen` | Optional `{ file, line }` or `null`; where the writer first established it. |
| `entries[].notes` | Free text for the writer; never read by the diff. |

## What `index-diff --bible` does with it

- An entry's `definition` that barely overlaps a definition the text gives for
  the same key is a `bible_conflicts` candidate.
- An entry's attribute the text states with a different value is an
  `attribute_drift` candidate with `source: "bible"`.
- Entries with no matching key in the index are left alone: a bible can hold
  what the text has not yet said.

Candidates, not findings: the continuity critic decides which contradict, and
the writer decides which telling is true.
