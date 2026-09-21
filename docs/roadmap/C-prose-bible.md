# C. prose-bible

Status: **planned** (mirror of [`ROADMAP.md`](../ROADMAP.md); deliverables in
[`STATUS.md`](STATUS.md)). Planning material: on ship, rationale moves to
`bundles/prose-bible/README.md` and `DESIGN.md`.

## 1. Goal and non-goals

A per-project continuity store — characters, defined terms, timeline, recurring
metaphors, already-said concepts — a cross-file index with locations, and a
critic that flags contradictions it can cite in two places.

Non-goals: fact-checking against the world (E), voice, structure, style.

## 2. Where it lives

```
bundles/prose-bible/
├── four manifests · README.md · AGENTS.md · PROTOCOL.md · DESIGN.md · RELEASE-v0.1.0.md · wiring/
├── agents/prose-continuity-critic.md            rendered from primitives/
├── skills/prose-bible/
│   ├── SKILL.md  meta.yaml  references/bible-schema.md
│   └── tools/
│       ├── lib/text-index.mjs        byte-identical to prose-outline's (pinned)
│       ├── lib/registry-reader.mjs   byte-identical (pinned)
│       ├── lib/revision-store.mjs    byte-identical (pinned)
│       ├── entity-index.mjs
│       ├── index-diff.mjs
│       └── bible-store.mjs
└── tests/selftest.mjs · fixtures/{project,text-index → ../../prose-outline parity cases}
primitives/agents/prose-continuity-critic/{agent.md, meta.yaml, README.md}
```

Existing files: marketplace, `check-packaging.mjs` (shared-file pairs list:
the three `lib/` files across `prose-outline` ↔ `prose-bible`), `check.mjs`,
`install-prose-codex.mjs` (`PLUGINS`, `AGENTS`), install scripts help, README,
CHANGELOG, STATUS.md version pin.

## 3. Contracts

`voice-bible/1`:

```json
{ "schema": "voice-bible/1", "id": "<project>", "revision": 1, "parent_digest": null,
  "entries": [ { "id": "b1", "kind": "character | term | event | metaphor | concept",
    "name": "…", "attributes": { "eyes": "grey" }, "definition": "…",
    "first_seen": { "file": "…", "line": 0 }, "notes": "…" } ] }
```

`entity-index/1` (derived, never stored): `{ terms: [{ key, surface_forms,
kind, occurrences: [{file, line, offset, sentence}], definitions: [{file, line,
text}] }], numbers_dates: [...], repeated_passages: [{ files, lines, text, similarity }],
limits: [...] }`.

`index-diff/1`: `{ redefined: [{key, a, b}], attribute_drift: [{key, attribute,
a, b}], repeated: [{a, b, similarity}] }` where every `a`/`b` carries a location.

Critic verdict: `CLEAN` / `REVISE`. Refuses any finding without two cited
locations.

## 4. Deterministic tools

- **`entity-index.mjs <dir|files…> [--json]`** — walks Markdown/text files,
  masks non-prose, extracts capitalised runs and single-word names appearing
  ≥ 2 times across the project, defined terms by three patterns ("X is …",
  "X, the …", "called X"), numbers and dates; repeated passages by shingled
  sentence overlap ≥ 0.8 (threshold in `limits`).
- **`index-diff.mjs <index.json> [--bible bible.json]`** — the same key with two
  definitions; an attribute stated two ways (bible attribute vs text, or text vs
  text); passages repeated across files.
- **`bible-store.mjs`** — same ops and approval gate as A's store.

## 5. Model surfaces

- `prose-bible` skill (`kind: investigator`): runs the index, proposes bible
  entries the writer confirms one by one, saves on approval, and presents
  index-diff output as leads.
- `prose-continuity-critic` (`kind: reviewer`, clean context): receives
  index-diff JSON and the bible; for each candidate contradiction decides
  whether the two cited passages really conflict (a nickname is not a
  redefinition; a flashback is not attribute drift). Every finding quotes both
  locations. Uncertainty → silence: a wrong "you contradicted yourself" costs
  the writer a hunt through their own book. Never guesses a location the index
  did not supply.

## 6. Registry state

`<projects-dir>/<identity>/<project>/bible/` per
[`docs/registry-stores.md`](../registry-stores.md). Index is recomputed each
run and never persisted.

## 7. Protocol

index → diff → (critic, clean context, parallel with others) → session presents
findings; bible edits only on approval. Without A installed nothing changes
(the shared libs are bundled). Without prose-review nothing changes either; the
critic ships here.

## 8. Fixtures and harness

- `tests/fixtures/project/` — three files with planted drift: a character's eye
  colour changes between chapters, a term redefined, an anecdote retold in two
  essays; plus a consistent control project. Expected index and diff JSON.
- Parity: `tests/fixtures/text-index/` cases must produce identical output from
  both bundles' `text-index.mjs`; `check-packaging.mjs` also asserts the bytes
  match. A mutation edits one copy; the packaging check must fail.
- Critic fixtures in four classes vs index-diff (diff flags a nickname / critic
  clears; diff clean / critic catches drift stated in prose the index missed,
  etc.), each ≥ 2, echo baseline reported. Harness: reuse
  `prose-review/tests/run-harness.mjs` machinery via a `CRITICS.continuity`
  entry with `--fixtures-dir` pointing here, or a thin bundle-local
  `tests/harness.mjs` staging prompts the same way — decide at C5 and record.
- Negative: consistent control project → `CLEAN`; contract counts 0.

## 9. Decisions

- **Critic lives beside the index**, like `prose-pattern-critic` beside the
  catalog; it is useless without the index and the index needs no other bundle.
- **Index never stored**: a stale index would report a contradiction the writer
  already fixed.
- **Shared libs are byte-identical copies** pinned by the packaging check; see A.
- **Repeated-passage threshold** is a `limits` entry, not a claim of precision.

## 10. Deliverables

- C1 — scaffold + shared-file pairs in `check-packaging.mjs` + selftest wired. Accept: packaging green with two new bundles.
- C2 — `entity-index.mjs` + fixture project + expected JSON.
- C3 — `index-diff.mjs`: names the three planted contradictions and nothing else on the control.
- C4 — `voice-bible/1` + `bible-store.mjs` + mutations, including the shared-copy break.
- C5 — critic primitive + bundle copy + four-class fixtures + harness + recorded runs.
- C6 — SKILL.md + meta.yaml + confirm flow + negative test.
- C7 — release: RELEASE-v0.1.0.md, CHANGELOG, README, version pin, ROADMAP → shipped; `--mutations` green.

## 11. Known limits

Names below two occurrences are invisible; definitions are pattern-matched;
similarity is lexical; the critic cannot see a contradiction stated entirely in
paraphrase with no shared term.
