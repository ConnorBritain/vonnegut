# `claims-ledger/1`

Which propositions a project rests on, where each came from, and how sure the
writer is. The validator is `tools/lib/research-schema.mjs`; this is the
readable form.

## A proposal

```json
{
  "claims": [
    { "id": "k1", "claim": "The mill on the Harrow road was built in 1851 by the Teodor family.",
      "source": "s1", "location": { "line": 1, "offset": 0 },
      "quote": "The mill on the Harrow road was built in 1851 by the Teodor family",
      "confidence": "high", "confidence_by": "writer" }
  ]
}
```

The store adds the envelope on save and refuses a ledger whose `source` ids
are not in the project's dossier.

## Fields

| Field | Rule |
|---|---|
| `claims[].id` | `k1`, `k2`, … Stable across revisions; the sentence map and claim-audit cite them. |
| `claims[].claim` | The proposition, as a complete sentence. |
| `claims[].source` | A dossier source id. |
| `claims[].location` | `{ line, offset }` in that source's cached text. |
| `claims[].quote` | The source's exact words. `claims-check` matches them after whitespace normalisation and nothing else: a changed word, comma or case is `drifted`. |
| `claims[].confidence` | `high`, `medium`, `low` — **the writer's label**, asked for and never filled in by the skill. |
| `claims[].confidence_by` | Always `"writer"`. It is in the schema so no later reader can mistake the label for a measurement. |

## What the checks say about a claim

- `exact` — the source contains the quote. It said this. Whether it is true is
  not assessed here or anywhere in this bundle.
- `drifted` — the source says something else at the recorded location; both
  are shown.
- `absent` — the source text is not cached, or the recorded location does not
  exist.

## `sentence-map/1` (task-local, never stored)

The skill's own mapping of a draft's sentences to the ledger:

```json
{ "schema": "sentence-map/1",
  "sentences": [ { "id": "p1s1", "text": "…", "claim": true, "ledger": "k1" },
                 { "id": "p1s2", "text": "…", "claim": false, "ledger": null } ] }
```

`claims-check` reports a sentence marked `claim: true` with `ledger: null` as
`unledgered`, a sentence whose text is not in the draft as `not-in-draft`, and
a ledger id that does not exist as `unknown-ledger`. Which sentences are
claims is the map's judgement, shown to the writer, not measured.
