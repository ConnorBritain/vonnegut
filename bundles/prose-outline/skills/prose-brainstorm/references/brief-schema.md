# `project-brief/1`

What a piece is going to be, before it has an outline. One brief per project,
stored under the writing identity at `<projects-dir>/<identity>/<project>/brief/`
([store contract](../../../../../docs/registry-stores.md)). Two skills write it:
`prose-brainstorm` (sources, angles, the chosen angle) and `prose-interview`
(decisions, links). The validator is `tools/lib/brief-schema.mjs`. Unknown
fields are refused at every level.

```json
{
  "schema": "project-brief/1", "id": "<project>", "revision": 2, "parent_digest": "<sha256>",
  "sources": [
    { "kind": "transcript", "digest": "<sha256 of the cached text>", "words": 962,
      "cached": "sources/<digest>.txt", "format": "plain" }
  ],
  "angles": [
    { "id": "a1", "title": "The starter is the bakery",
      "thesis": "The slow invisible part of the work decides the result.",
      "audience": "team leads who reward visible output",
      "shape": "narrative-arc",
      "uses": [ { "segment": "s1", "line": 5, "quote": "the starter is the whole bakery" } ],
      "leaves_out": ["s3", "s4"],
      "open_questions": [] }
  ],
  "unused_segments": [],
  "chosen_angle": "a1",
  "decisions": {},
  "links": []
}
```

| Field | Meaning |
|---|---|
| `sources[]` | Every text the brief may quote. A transcript is cached as its **cleaned** text (transcript-scan's), because every line number refers to that; `format` records what it was cleaned from. A summary or notes file is cached as given. One text is one source. |
| `angles[]` | Pieces the material could become. `thesis` is a sentence, or `null` with at least one open question; never invented. `audience` follows the same rule: when the material names no reader, `null` and an open question, never a placeholder such as "undecided". `uses` quotes the passages the angle rests on, by scan segment and cleaned-text line (`segment: "summary"` for the writer's summary). `leaves_out` lists segments the angle deliberately drops. `shape` is a free lower-case token until outline shapes ship, then a shape name. |
| `unused_segments` | Segments no angle uses or leaves out. With `uses` and `leaves_out`, every segment is accounted for; `angles-check.mjs` enforces that. |
| `chosen_angle` | Set only when the writer chooses. |
| `decisions`, `links` | Filled by the interview. |
