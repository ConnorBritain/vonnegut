# A. prose-outline

Status: **in-progress** (mirror of [`ROADMAP.md`](../ROADMAP.md); deliverables in
[`STATUS.md`](STATUS.md)). Planning material: when this ships, the durable
rationale moves to `bundles/prose-outline/README.md` and `DESIGN.md`, and this
file becomes the record of how it was planned.

## 1. Goal and non-goals

Turn a brief into an outline (thesis, ordered claims, evidence slots, open
questions; acts/beats/turns in beat-sheet mode), read a draft back into the
outline it implies, diff two outline revisions, and keep outlines per project
with undo.

Non-goals: drafting prose from the outline (that is `prose-draft`), judging
whether the argument is good (that is B), scoring anything.

## 2. Where it lives

New bundle `bundles/prose-outline/`, skill-only:

```
bundles/prose-outline/
├── .claude-plugin/ .codex-plugin/ .cursor-plugin/ .plugin/   plugin.json ×4 (shapes copied from prose-tell-scan)
├── README.md  AGENTS.md  PROTOCOL.md  DESIGN.md  RELEASE-v0.1.0.md
├── wiring/claude-md.md  wiring/agents-md.md
├── skills/prose-outline/
│   ├── SKILL.md  meta.yaml
│   ├── references/outline-schema.md      voice-outline/1, human-readable
│   └── tools/
│       ├── lib/text-index.mjs            CANONICAL copy (C carries a byte-identical one)
│       ├── lib/registry-reader.mjs       read-only voice-identity-registry/1 reader
│       ├── lib/revision-store.mjs        docs/registry-stores.md implementation
│       ├── outline-scan.mjs
│       ├── outline-diff.mjs
│       └── outline-store.mjs
└── tests/
    ├── selftest.mjs
    └── fixtures/{outline,text-index,registry}/
```

Existing files that change: `.claude-plugin/marketplace.json` (entry),
`tools/check-packaging.mjs` (shared-file pair list gains the three `lib/`
files once C exists; bundle list is read from STATUS.md), `tools/check.mjs`
(selftest entry), `install-prose-codex.mjs` (`PLUGINS`), `install.sh` /
`install.ps1` (help text only; skills are auto-discovered), `README.md` bundle
table and install lines, `CHANGELOG.md`, `docs/roadmap/STATUS.md` version pin.

## 3. Contracts

`voice-outline/1`:

```json
{
  "schema": "voice-outline/1",
  "id": "<project>",
  "revision": 1,
  "parent_digest": null,
  "mode": "argument | beat-sheet",
  "title": "…",
  "thesis": "…",                       // argument mode; "premise" in beat-sheet mode
  "nodes": [
    { "id": "n1", "kind": "claim | evidence-slot | open-question | act | beat | turn",
      "text": "…", "parent": null, "order": 1,
      "evidence": [ { "slot": "e1", "filled_by": null } ] }
  ],
  "source": { "brief_digest": "<sha256 or null>", "draft_digest": "<sha256 or null>" }
}
```

Node ids are stable across revisions (the diff keys on them). `evidence[].filled_by`
is a free text pointer the writer sets; E may later point it at a ledger id.

`outline-scan --json` output: `{ schema: "outline-scan/1", file, headings: [{level, text, line}],
sections: [{heading_id, start_line, end_line, words, ratio_to_median, paragraphs: [{line, first_sentence,
heading_overlap_sentence, claim_markers: {assertive, connective, numeric, citation}, transition_in: "<marker|null>"}]}],
balance: {median_words, max_ratio, min_ratio}, limits: [...], status: "measured | not-evaluated" }`.

`outline-diff` output: `{ schema: "outline-diff/1", added: [ids], removed: [ids],
moved: [{id, from, to}], reworded: [{id, before, after}] }`.

Verdicts: none. These are measurements and proposals.

## 4. Deterministic tools

- **`lib/text-index.mjs`** — `segment(text, {markdown})` → paragraphs, sentences,
  headings, each with `{line, offset, text}`; `capitalisedRuns`, `definedTerms`,
  `numbersAndDates`. Masks code, links and frontmatter the way tell-scan's
  `lib/text.mjs` does, reimplemented (no import). English sentence boundary
  heuristic, stated in `limits`.
- **`outline-scan.mjs <file> [--json]`** — fields above. Refuses (status
  `not-evaluated`, exit 0 with a reason) when the document has no headings and
  fewer than three paragraphs. Claim markers are counts of listed word classes;
  the list ships in the tool and is named in `limits` as heuristic.
- **`outline-diff.mjs <a.json> <b.json>`** — by node id. Reworded = same id,
  different text. Never guesses a mapping for a missing id.
- **`outline-store.mjs <op>`** — `locate`, `show`, `save --proposal FILE
  --project P --expected-revision N --approved`, `undo --project P
  --expected-revision N --approved`, `list`. Without `--approved` prints what it
  would do and exits 0 without writing.
- **`lib/registry-reader.mjs`** — `readRegistry(dir)`, `selectedIdentity(dir,
  explicit?)` returning the three-state result (`none | ambiguous | {id}`).
- **`lib/revision-store.mjs`** — `read`, `save`, `undo` per
  [`docs/registry-stores.md`](../registry-stores.md).

## 5. Model surfaces

`prose-outline` skill, `kind: planner`, `surface: skill`.

- Framing: you turn a brief into a checkable outline and describe what a draft
  currently argues; the scripts count, you propose.
- Scope: brief text, optional draft, optional current outline; never the corpus,
  never the tell catalog.
- Priority list: (1) resolve mode from the request (argument / beat-sheet), ask
  once if unclear; (2) run outline-scan on any supplied draft and read the JSON;
  (3) propose the outline with every claim carrying an evidence slot and every
  unknown as an open question — an underspecified brief yields more open
  questions, not an invented thesis; (4) show the proposal; (5) save only when
  the user approves, through `outline-store.mjs … --approved`, and report the
  identity/project/revision receipt; (6) for a second revision, show
  `outline-diff` output, not a prose summary of it.
- Output contract: the proposal file path, the diff when relevant, the store
  receipt or the sentence "not saved".
- Terse.

Tie-break: a planner surfaces ambiguity rather than resolving it.

## 6. Registry state

`<projects-dir>/<identity>/<project>/outlines/`, per
[`docs/registry-stores.md`](../registry-stores.md). Three registry states are
refusals with named reasons in `outline-store.mjs`. Nothing else is written.

## 7. Protocol

PROTOCOL.md: brief → (draft? → scan) → proposal → approval → save → diff on
revisions. Degrades without prose-author: the registry may not exist; then
outlines are task-local and the skill says so. Without prose-review: B does not
run; the skill never substitutes its own structural critique for it.

## 8. Fixtures and harness

- `tests/fixtures/outline/`: `essay.md`, `technical.md`, `chapter.md`,
  `post-v1.md`, `post-v2.md` (same post with two sections swapped and one
  paragraph added), `note.md` (heading-free), each with `expected.json`.
  Drafts are drawn from the licensed corpora under
  `bundles/prose-tell-scan/tests/corpus/` (byte-identical copies, enforced), so
  nobody can tune a fixture until it passes.
- `tests/fixtures/text-index/`: shared parity cases (C reads the same
  directory by relative path from its own bundle; the packaging check keeps the
  two module copies identical).
- Cross-implementation location fixture: line numbers for the same text from
  `text-index`, `fidelity-scan.mjs` and `visible-prose.mjs` must agree
  (pattern: `bundles/prose-author/tests/suite-cross-count.mjs`).
- `tests/fixtures/registry/`: a synthetic `voice-identity-registry/1` in each
  of the three states.
- Skill negative test: an underspecified brief; the proposal must contain open
  questions and no thesis. Positive: a concrete brief; every claim has a slot.
  Both recorded in the PR.
- Mutations: stale-revision guard, approval gate, heading-free refusal,
  id-stable diff (a mutation that matches by text must fail). Registered in
  `bundles/prose-author/tests/mutations.mjs` (repo-relative paths, sandbox
  copies the whole tree) unless its `--update` table coupling makes a
  bundle-local runner cleaner — decide at A6 and record here.

## 9. Decisions

- **Stores by convention under the registry, not registry keys.** See
  [`docs/registry-stores.md`](../registry-stores.md). `identity-store.mjs`
  rejects unknown entry fields and unknown schema strings, so a 0.6.0 runtime
  would refuse a registry a newer runtime extended; a `/2` cut is deferred and
  `project_store` reserved.
- **Own registry reader, no import.** ~15 lines, pinned by a parity fixture.
- **Canonical `text-index` here.** A ships first; C copies. Byte-identical pin
  is stronger than a port-with-parity because drift becomes impossible rather
  than detected.
- **Topic sentence is two candidates, not one.** First sentence and highest
  heading-overlap sentence are both reported; choosing one would be a judgement
  the script cannot defend.
- **Beat-sheet mode is a node vocabulary, not a second schema.** One store, one
  diff.

## 10. Deliverables

- A1 — bundle scaffold; selftest wired into `tools/check.mjs`. Accept: packaging check green with the new bundle listed in STATUS.md; `./install.sh prose-outline` copies the skill.
- A2 — `lib/text-index.mjs` + parity fixtures + cross-implementation location fixture. Accept: expected JSON reproduced; line numbers agree across the three segmenters on shared text.
- A3 — `lib/registry-reader.mjs` + parity fixture; `lib/revision-store.mjs`. Accept: three registry states; digest mismatch refused; parity with prose-author's reader on the synthetic registries.
- A4 — `outline-scan.mjs` + five fixtures + heading-free case. Accept: expected JSON byte-equal; `not-evaluated` on `note.md`.
- A5 — `voice-outline/1` + `outline-diff.mjs`. Accept: the planted moves and the added node, nothing else.
- A6 — `outline-store.mjs` + mutations. Accept: stale refused, undo round-trips, no write without `--approved`; every mutation caught.
- A7 — SKILL.md + meta.yaml + beat-sheet mode + recorded skill tests.
- A8 — release: RELEASE-v0.1.0.md, CHANGELOG, README, version pin, ROADMAP → shipped; `--mutations` green.

## 11. Known limits

English sentence heuristics; claim markers are a word-class count, not a claim
detector; topic-sentence candidates are positional, not semantic; no
multi-machine sync; an outline is the writer's plan, not evidence about the
draft's quality.
