# `voice-outline/1`

The outline the skill proposes, the store keeps and the differ compares. The
validator is `tools/lib/outline-schema.mjs`; this is the readable form.

## A proposal (what the skill writes)

```json
{
  "mode": "argument",
  "title": "Why the roadmap must be a file",
  "thesis": "A plan that is not a file under version control is not a plan.",
  "nodes": [
    { "id": "n1", "kind": "claim", "parent": null, "order": 1,
      "text": "A plan lives where the work lives, or it is not read.",
      "evidence": [ { "slot": "e1", "filled_by": "three retrospectives: checked-in plans survived" } ] },
    { "id": "n2", "kind": "claim", "parent": null, "order": 2,
      "text": "A plan and a codebase drift the moment either moves.",
      "evidence": [ { "slot": "e1", "filled_by": null } ] },
    { "id": "n3", "kind": "open-question", "parent": "n2", "order": 1,
      "text": "Which check catches the drift — a script, or a reviewer?" }
  ],
  "source": { "brief_digest": null, "draft_digest": null }
}
```

The store adds the envelope (`schema`, `id` = project, `revision`,
`parent_digest`) on save. A proposal file may carry those keys; they are
dropped and replaced.

## Fields

| Field | Rule |
|---|---|
| `mode` | `argument` or `beat-sheet`. One schema, two node vocabularies. |
| `title` | Required. |
| `thesis` | Required — **or `null`**, and then at least one `open-question` node must say what is missing. In beat-sheet mode this is the premise. |
| `nodes[].id` | `n1`, `n2`, … Unique. **Stable across revisions**: the differ keys on ids and never matches by text. Reuse ids when revising; never renumber. |
| `nodes[].kind` | argument: `claim`, `evidence-slot`, `open-question`. beat-sheet: `act`, `beat`, `turn`, `open-question`. |
| `nodes[].text` | Required. |
| `nodes[].parent` | `null` or an existing id. |
| `nodes[].order` | Integer ≥ 1; position among siblings. |
| `nodes[].evidence` | Claims only. An array of `{ slot: "e1", filled_by: "<pointer>" \| null }`. May be empty, but a concrete brief should give every claim at least one slot. `filled_by` is a pointer in the writer's words; item E may later point it at a research-ledger id. |
| `source` | Optional. `brief_digest` / `draft_digest`: sha256 of the inputs the proposal was made from, or null. |

## What the differ reports

`added`, `removed`, `moved` (position among the same siblings), `reparented`,
`reworded`, `kind_changed`, `evidence` (`slot-added`, `slot-removed`, `filled`,
`emptied`, `refilled`), and `unchanged`. A node whose id disappears is
`removed`; a new id is `added`, even with identical words.

## What the checker enforces

`tools/proposal-check.mjs <proposal> --brief <brief>` validates the body and,
when the brief's frontmatter carries `expect: concrete`, requires a thesis and
a slot on every claim; with `expect: underspecified`, requires a null thesis and
at least one open question. Whether the claims are the right claims is not
checked anywhere; that is the reader's.
