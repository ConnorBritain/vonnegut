# H. Transcript intake and brainstorm

Status: **planned** (mirror of [`ROADMAP.md`](../ROADMAP.md); deliverables in
[`STATUS.md`](STATUS.md)). End-to-end context: [`docs/workflow.md`](../workflow.md).

## 1. Goal and non-goals

Turn a voice-memo transcript, plus an optional summary the writer wrote, into
three to five candidate **angles**. Each angle is a piece the material could
become. Every angle rests on quoted transcript passages that a script verifies.
Every part of the transcript is either used by some angle or listed as unused.
The result lives in a per-project **brief** that the interview (I) and the
outline (J) build on.

Non-goals:
- Transcribing audio. The writer brings text from whatever tool they use.
- Choosing the angle for the writer.
- Outlining. That is J.
- Inventing material the transcript does not contain.
- Cleaning up the writer's speech for publication.

## 2. Where it lives

`bundles/prose-outline/`, which gains a second skill:

```
bundles/prose-outline/skills/prose-brainstorm/
├── SKILL.md  meta.yaml                     kind: planner, surface: skill
├── references/brief-schema.md              project-brief/1, human-readable
└── tools/
    ├── transcript-scan.mjs
    ├── angles-check.mjs
    ├── brief-store.mjs
    └── lib/{brief-schema.mjs, text-index.mjs, registry-reader.mjs, revision-store.mjs}
```

The three shared `lib/` files are byte-identical copies of the prose-outline
skill's, added to the `SHARED_FILES` list in `tools/check-packaging.mjs`. A
skill must survive a plain copy into `~/.claude/skills/`, so it carries its own
copies rather than importing from a sibling skill.

Existing files that change:
- `docs/registry-stores.md`: the `<store>` enum gains `brief`.
- `bundles/prose-outline/{README,PROTOCOL,AGENTS,DESIGN}.md`.
- `tools/check-installation.mjs`: SKILLS.
- `install.sh` and `install.ps1`: help text.
- Mutations in `bundles/prose-author/tests/mutations.mjs`, a new `brainstorm` suite.

## 3. Contracts

`transcript-scan/1` (output of `transcript-scan.mjs --json`):

```json
{ "schema": "transcript-scan/1", "source_digest": "<sha256 of input bytes>",
  "format": "plain | srt | vtt | speaker-labelled", "words": 0,
  "clean": { "digest": "<sha256 of cleaned text>", "lines": 0 },
  "turns": [ { "speaker": "S1", "line": 1, "words": 0 } ],
  "segments": [ { "id": "s1", "start_line": 1, "end_line": 40, "words": 0, "top_terms": ["…"] } ],
  "recurring_terms": [ { "term": "…", "count": 0, "lines": [1, 9] } ],
  "questions": [ { "line": 12, "text": "…" } ],
  "fillers": { "um": 0, "uh": 0, "you know": 0, "like": 0, "i mean": 0 },
  "limits": ["…"], "status": "measured | not-evaluated" }
```

Line numbers refer to the **cleaned** text, which the tool also writes with
`--clean-out FILE`. Timestamps, cue numbers and speaker labels are removed;
everything else, fillers included, is kept, because a quote must match what
the writer said.

`project-brief/1` (brief store payload; the envelope is per `registry-stores.md`):

```json
{ "schema": "project-brief/1", "id": "<project>", "revision": 1, "parent_digest": null,
  "sources": [ { "kind": "transcript | summary | notes", "digest": "<sha256>", "words": 0, "cached": "sources/<sha256>.txt" } ],
  "angles": [ { "id": "a1", "title": "…", "thesis": "… | null", "audience": "…",
                "shape": "<free token; a shape name once J ships>",
                "uses": [ { "segment": "s3", "line": 41, "quote": "…" } ],
                "leaves_out": ["s7"], "open_questions": ["…"] } ],
  "unused_segments": ["s9"],
  "chosen_angle": "a2 | null",
  "decisions": {},
  "links": [] }
```

`decisions` and `links` are empty here, and I fills them. A transcript summary
is cited as `{ "segment": "summary", "line": n, "quote": "…" }` and is never
confused with something the writer said aloud.

`angles-check/1`: `{ quotes: [{angle, line, status: exact | misplaced | drifted | absent, found_line?, segment_ok}],
coverage: { unaccounted_segments: [ids] }, ok: bool }`.

Verdicts: none.

## 4. Deterministic tools

- **`transcript-scan.mjs <file> [--json] [--clean-out FILE]`.** Detects SRT
  (cue index plus `-->` line), WebVTT (`WEBVTT` header), speaker-labelled
  (`Name:` at line start on at least a third of non-empty lines, labels up to
  40 characters) or plain text.
  - **Segments** are topic-shift boundaries. A TextTiling-style lexical
    cohesion dip is computed over fixed sentence windows of `text-index`
    sentences. The window size and the dip threshold ship as constants, and
    `limits` names them as heuristic.
  - **Recurring terms** are `text-index` capitalised runs, plus
    lower-case content words seen at least 3 times outside a stop list.
  - **Questions** are sentences ending in `?`.
  - **Refusals:** an empty file; fewer than 150 words (`not-evaluated`, with
    the reason); a binary file.
- **`angles-check.mjs <angles.json> <clean.txt> [--scan scan.json]`.**
  - Every `uses[].quote` must appear whitespace-normalised at its line, and
    case and punctuation count. The rule is the same as `claims-check`'s, so a
    writer's words are never "close enough".
  - Every scan segment must appear in some angle's `uses`, in `leaves_out`
    or in `unused_segments`.
  - Exit 1 on any `drifted` or `absent` quote, or on any unaccounted segment.
- **`brief-store.mjs <op>`.** Supports `locate`, `show`, `add-source --file F
  --kind K`, `save --proposal F --project P --expected-revision N --approved`,
  `undo` and `list`. Its semantics are those of `outline-store.mjs`. Sources
  are cached under `brief/sources/<sha256>.txt`, as `research-store` does.
  Without `--approved` it prints the plan and writes nothing.

## 5. Model surfaces

`prose-brainstorm` skill, `kind: planner`.

- **Framing.** You find the pieces this material could become. The script
  counts and checks quotes. You propose.
- **Scope.** The cleaned transcript, the scan JSON and the writer's summary if
  given. Never the corpus, never a catalog.
- **Priority list:**
  1. Run `transcript-scan` and read the JSON.
  2. Propose 3–5 angles that differ in thesis or audience, not only in title.
  3. Every angle quotes the passages it would use, by line.
  4. Account for every segment: used, left out, or listed as unused.
  5. Run `angles-check` and fix any drifted quote before showing anything.
  6. Show the angles with the check's result.
  7. Save the brief only on approval. Record `chosen_angle` only when the
     writer chooses.
- **Tie-break.** Thin material yields fewer angles with open questions. It
  never yields an invented thesis.
- **Output contract.** The angles file path, the angles-check result, and
  either the store receipt or the sentence "not saved".

## 6. Registry state

`<projects-dir>/<identity>/<project>/brief/`, a new store name in
[`docs/registry-stores.md`](../registry-stores.md) with the same three
registry states, the approval gate and undo. The cached transcript is the
writer's own material, kept outside plugin installs. Scan output is derived
and never stored.

## 7. Protocol

The steps are: transcript, then scan, then angles, then angles-check, then
show, then approval, then save the brief, then I or J.

- Without a registry, the brief is task-local and the skill says so.
- Without J's shapes, `shape` is free text.
- The skill never starts the interview by itself. It ends by naming the next
  step.

## 8. Fixtures and harness

`tests/fixtures/transcripts/` holds:
- a plain monologue (about 1,000 words, three topics), an Otter-style export;
- an SRT export;
- a WebVTT export;
- a two-speaker labelled interview;
- a fragment under 150 words, the refusal case;
- a transcript with a planted near-quote, one comma changed.

Each has an expected scan JSON and a hand-built angles file. The angles-check
fixtures are one clean file, one drifted, one absent and one with an
unaccounted segment.

Skill harness (`tests/skill-harness.md` addition):
- **Positive:** the monologue gives at least 3 angles, and angles-check passes.
- **Negative:** a rambling transcript with no claim yields open questions,
  `thesis: null` on every angle and no invented facts. Recorded as **not run**
  until dispatched.

Mutations:
- angles-check accepts a case-changed quote;
- coverage ignores an unaccounted segment;
- brief-store writes without `--approved`;
- transcript-scan keeps SRT cue numbers in the cleaned text.

## 9. Decisions

- **Bundle: prose-outline, not a new bundle.** By the sizing test, nobody
  wants brainstorming without outlining, since a brief exists to become an
  outline. A separate bundle would also need its own copies of the registry
  reader and revision store, for no install-time benefit.
- **New `brief` store, not a field in `outlines/`.** The brief exists before
  any outline, and several outline candidates are proposed from one brief. A
  consumer never reads another consumer's store, and both `brief` and
  `outlines` belong to prose-outline, so the outline skill may read the brief.
  The contract doc records that within-bundle reads are allowed.
- **Transcript text is cached in the brief store.** Later stages must quote
  it, and the research store is another consumer's. The alternative,
  `prose-research --kind notes`, still works when the writer wants the
  transcript as a citable source as well. The two are independent.
- **Fillers are counted and kept.** Removing them would make quotes unmatchable
  and would edit the writer's words. The count is reported so the writer can
  see how talky the material is. It is never a quality judgement.
- **Speaker diarisation is not attempted.** A transcript without labels is
  treated as one speaker. That is a known limit.

## 10. Deliverables

- H1 — `transcript-scan.mjs` + transcript fixtures + expected JSON. Accept: all formats detected; the fragment under 150 words is `not-evaluated`; cleaned-text line numbers stable.
- H2 — `project-brief/1` schema + `brief-store.mjs` + `registry-stores.md` gains `brief`; shared-lib copies pinned. Accept: approval gate, stale-revision refusal, undo round-trip, source cache by sha.
- H3 — `angles-check.mjs` + fixtures. Accept: names exactly the planted drifted quote and the unaccounted segment.
- H4 — `prose-brainstorm` SKILL.md + meta.yaml + skill harness entry (positive and negative), recorded as not run until dispatched.
- H5 — mutations (four above) in a `brainstorm` suite; PROTOCOL/README/AGENTS/DESIGN.
- H6 — prose-outline minor bump, RELEASE notes, CHANGELOG, version pin, ROADMAP → shipped; `--mutations` green.

## 11. Known limits

- English sentence segmentation, and a topic-shift heuristic that can split
  one long thought or merge two short ones.
- No speaker diarisation.
- Fillers are counted from a fixed list.
- Angle quality is not measured. The check proves the quotes are real and the
  material is accounted for, not that the angles are good.
