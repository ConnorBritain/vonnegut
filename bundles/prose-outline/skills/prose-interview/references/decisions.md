# The interview's decision tree

The interview settles these decisions, in this order, one question at a time.
The tree is data (`tools/lib/decisions.mjs`); `tools/brief-check.mjs` computes
which question comes next, which answers are stale, and whether the interview
is done. A model choosing what to ask next drifts between sessions and cannot
say when it is finished; a fixed tree can.

| id | asks | depends on | required | value |
|---|---|---|---|---|
| `angle` | which angle, or a new one | — | yes | an angle id from the brief (`a2`) or a new angle's title |
| `audience` | who this is for, and what they already know | angle | yes | a sentence |
| `purpose` | what the reader should think or do after | angle, audience | yes | a sentence |
| `form` | the form, and how it is delivered | audience | yes | `{ "form": "newsletter", "medium": "web" \| "tts" \| "print" }` |
| `length` | a band in words | form | yes | `{ "unit": "words", "min": 800, "max": 1100 }` |
| `shape` | the piece's shape | form, length | yes | a lower-case token (a shape name once outline shapes ship) |
| `thesis` | the one sentence it argues, or its premise | angle, purpose | yes | a sentence |
| `must_include` | stories, examples, facts that have to be in | thesis | no | a list |
| `exclude` | what stays out | thesis | no | a list |
| `links` | earlier work to connect to | thesis | no | a list of refs, each described in the brief's `links` |
| `assumptions` | claims to check before drafting | thesis | no | a list |

## A recorded decision

```json
"audience": {
  "value": "Team leads who reward visible output over slow groundwork.",
  "source": "transcript",
  "evidence": { "ref": "transcript", "line": 11, "quote": "So the bread part is really about patience with the slow invisible part of the work" },
  "confirmed": true,
  "at_revision": 2
}
```

- `source` is who supplied the answer: `writer`, or where it was found —
  `transcript`, `summary`, `outlines`, `bible`, `research`, `corpus` — or
  `recommended` when the writer said "your call" to the interview's recommendation.
- A found answer carries `evidence` (a quote, and for transcript or summary
  its cleaned-text line), and is `confirmed: false` until the writer says yes.
  brief-check re-verifies transcript and summary quotes; a quote that no longer
  matches puts the decision back to the writer.
- "Skip" is recorded as `value: null` with the writer's reason in `skipped`.
  A skipped required decision blocks the questions that depend on it.
- `at_revision` is the brief revision the answer was given or last confirmed
  at. When an answer changes, everything downstream of it, transitively, is
  stale until confirmed again: change the audience and the purpose, form,
  length, shape and thesis come back. Staleness is computed, never stored.

## Links

`links` entries describe the connection: `{ "kind": "outline" | "bible-entry" |
"research-claim" | "corpus-piece", "ref": "…", "why": "…" }`. They come from
read output the session supplies — `outline-store show` for this project,
`bible-store show`, `research-store show`, prose-author's corpus manifest —
never from another bundle's store opened directly.
