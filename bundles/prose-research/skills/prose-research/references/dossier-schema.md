# `research-dossier/1`

A project's sources and the passages worth quoting from them. The validator is
`tools/lib/research-schema.mjs`; this is the readable form.

## A proposal (what the skill writes after the writer confirms)

```json
{
  "sources": [
    { "id": "s1", "kind": "url", "locator": "https://example.org/parish-record",
      "retrieved_at": "2026-01-02T03:04:05.000Z",
      "sha256": "…64 hex…", "text_file": "…64 hex….txt", "title": "Parish record, 1851–1923" }
  ],
  "passages": [
    { "id": "p1", "source": "s1", "location": { "line": 2, "offset": 31 },
      "quote": "the wheel was cast in Sheffield and carried up the valley on two carts",
      "note": "the only account of the wheel's origin" }
  ]
}
```

The store adds the envelope (`schema`, `id` = project, `revision`,
`parent_digest`) on save. `add-source` appends one source from a
`source-intake/1` proposal and caches its text; `save` replaces the whole
body, so passages are edited by proposing the full list.

## Fields

| Field | Rule |
|---|---|
| `sources[].id` | `s1`, `s2`, … Stable across revisions; the ledger cites them. |
| `sources[].kind` | `url`, `file`, `pdf`, `notes`. |
| `sources[].locator` | The URL, or a `file://` URL for a file. Never a bare path. |
| `sources[].retrieved_at` | ISO instant of the fetch or read, or `null`. |
| `sources[].sha256` | Of the cached text. Pins what the source said then. |
| `sources[].text_file` | `<sha256>.txt` under the store's `research/sources/`. |
| `sources[].title` | A string or `null`. |
| `passages[].id` | `p1`, `p2`, … |
| `passages[].source` | A source id in this dossier. |
| `passages[].location` | `{ line, offset }` in the cached text, 1-based line. |
| `passages[].quote` | The passage's words, as the source has them. |
| `passages[].note` | Free text for the writer, or `null`. |

A source is what it said at `retrieved_at`. If a page changes, take it in
again: the new text has a new sha and a new id, and the old entry stays so old
quotes can still be checked.
