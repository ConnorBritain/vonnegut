# I. Interview

Status: **planned** (mirror of [`ROADMAP.md`](../ROADMAP.md); deliverables in
[`STATUS.md`](STATUS.md)). End-to-end context: [`docs/workflow.md`](../workflow.md).

## 1. Goal and non-goals

Before outlining, settle the decisions that decide what the piece is. The
session interviews the writer one question at a time and offers a recommended
answer with each question. It walks a fixed decision tree so that dependent
choices are resolved in order. The pattern is "grill me": relentless,
one-by-one questioning until there is shared understanding, with a single
amendment. **Whatever the sources already answer is looked up there and put to
the writer to confirm, not asked fresh.**

Non-goals:
- Deciding for the writer.
- Researching facts. An assumption flagged "to investigate" goes to
  prose-research, not to the model's memory.
- Outlining, which is J.
- Persisting anything without a yes.

## 2. Where it lives

`bundles/prose-outline/skills/prose-interview/`:

```
SKILL.md  meta.yaml                         kind: planner, surface: skill
references/decisions.md                     the decision tree, human-readable
tools/
  brief-check.mjs
  lib/{decisions.mjs, brief-schema.mjs, registry-reader.mjs, revision-store.mjs}
```

`brief-schema.mjs` and the two registry libs are byte-identical copies, pinned
in `SHARED_FILES`. The interview writes through H's `brief-store.mjs`. The
skill's own tools include a byte-identical copy of it, so the skill survives a
plain copy.

## 3. Contracts

The decision tree, `lib/decisions.mjs`, ships as data:

| id | asks | depends on | required |
|---|---|---|---|
| `angle` | which angle, or a new one | — | yes |
| `audience` | who this is for, and what they already know | angle | yes |
| `purpose` | what the reader should think or do after | angle, audience | yes |
| `form` | newsletter, essay, post, talk… and the delivery medium | audience | yes |
| `length` | a band in words | form | yes |
| `shape` | which shape (J's shape names once J ships) | form, length | yes |
| `thesis` | the one sentence the piece argues, or the premise | angle, purpose | yes |
| `must_include` | stories, examples, facts that have to be in | thesis | no |
| `exclude` | what stays out | thesis | no |
| `links` | earlier pieces, outlines, bible entries, research claims to connect | thesis | no |
| `assumptions` | claims to check before drafting | thesis | no |

Each decision is recorded in `project-brief/1` → `decisions`:

```json
{ "<id>": { "value": "…", "source": "writer | transcript | summary | outlines | bible | research | corpus | recommended",
            "evidence": { "ref": "…", "line": 0, "quote": "…" },
            "confirmed": true, "stale": false, "at_revision": 3 } }
```

A value whose `source` is anything but `writer` must carry `evidence`
(`recommended` excepted) and is `confirmed: false` until the writer says yes.
`links[]` entries are `{ kind: outline | bible-entry | research-claim |
corpus-piece, ref, why }`.

`brief-check/1` output:

```json
{ "schema": "brief-check/1", "next": "<decision id> | null",
  "open_required": ["…"], "open_optional": ["…"],
  "unconfirmed": ["…"], "stale": ["…"],
  "evidence_problems": [ { "decision": "…", "status": "absent | drifted" } ],
  "done": false }
```

## 4. Deterministic tools

- **`brief-check.mjs <brief.json> [--clean transcript.txt] [--json]`.** Computes:
  - `next`: the first open, stale or unconfirmed decision, in table order,
    whose dependencies are all confirmed and not stale. This makes "walk each
    branch, resolving dependencies one by one" a computation, not a judgement.
  - `stale`: a decision whose `at_revision` is older than the revision at
    which any decision it depends on last changed. Changing `audience` marks
    `purpose`, `form`, `length` and the rest as stale.
  - `evidence_problems`: transcript and summary quotes re-verified with the
    same exactness rule as H's angles-check.
  - `done`: true only when no required decision is open, unconfirmed or stale.
    Optional decisions never block `done`.
- **`brief-store.mjs`**, from H, saves each confirmed answer batch with
  `--expected-revision`, so an interview resumed in another session cannot
  overwrite newer answers.

## 5. Model surfaces

`prose-interview` skill, `kind: planner`.

- **Framing.** You interview the writer until the piece's decisions are
  settled. The script decides which question comes next and when you are done.
- **Scope:**
  - the brief and the cleaned transcript;
  - the writer's summary;
  - the project's own `outlines/`;
  - for links, any sibling read output the session supplies: `bible-store.mjs
    show`, `research-store.mjs show`, and prose-author's corpus manifest.
  - Never a sibling store path directly.
- **Priority list:**
  1. Run `brief-check` and take its `next`.
  2. Before asking, look for the answer in the sources in scope. If found,
     present it with its quote and location and ask the writer to confirm,
     change or reject it.
  3. Otherwise ask one question, with your recommended answer and one line of
     why.
  4. Accept "your call" as the recommended answer with `source: recommended`,
     confirmed. Accept "skip" as open, with the writer's reason.
  5. Save each batch of confirmed answers only on approval.
  6. Repeat until `done`, or until the writer stops. Then report what
     `brief-check` still lists as open.
- **Tie-break.** Ask rather than assume. A recommendation is never recorded as
  the writer's answer without their yes.
- **Output contract.** The question asked, or the confirmation sought; the
  current `brief-check` summary; the store receipt or "not saved".

## 6. Registry state

The interview writes to H's `brief/` store only. It reads the project's own
`outlines/` store, which belongs to the same bundle. It never opens another
bundle's store.

## 7. Protocol

Steps: brief (from H, or a typed brief saved as a `notes` source), then
`brief-check`, then a source lookup or a question, then confirm, then save
(approved), and repeat.

- Without a brief from H, the interview starts from the writer's typed brief.
- Without prose-bible or prose-research installed, `links` and `assumptions`
  are asked plainly, and the skill says it has nothing to look them up in.
- When `done`, the skill names J as the next step and does not start it.

## 8. Fixtures and harness

`tests/fixtures/briefs-interview/`:
- empty decisions (`next = angle`);
- partly answered (`next` follows dependencies);
- an audience change after `length` was confirmed (`length`, `shape` and
  `thesis` stale);
- a transcript-sourced answer with a drifted quote;
- a recommended answer left unconfirmed (`done` false);
- all required decisions confirmed with optional ones open (`done` true).

Skill harness:
- **Positive:** with the H monologue, the first questions are confirmations
  of transcript-sourced answers, not fresh asks.
- **Negative:** the session never marks the interview done while
  `brief-check.done` is false, and never records a recommendation as
  `source: writer`.

Recorded as **not run** until dispatched.

Mutations:
- `brief-check` reports done with an unconfirmed required decision;
- stale propagation removed;
- a non-writer source accepted without evidence;
- `next` ignores dependency order.

## 9. Decisions

- **The tree is fixed data, not model-generated.** A model choosing what to
  ask next drifts between sessions and cannot say when it is finished. A fixed
  tree makes "are we done?" countable and resumable. The writer can still
  skip any question.
- **Answer from sources before asking.** This is the grill-me rule "if a
  question can be answered by exploring, explore instead", applied to the
  writer's own material. Every sourced answer still needs a yes, so the source
  proposes and the writer decides.
- **Links through sibling read tools, not sibling stores.** This keeps the
  rule that a consumer never reads another consumer's store. It also means the
  interview works, with less help, when those bundles are absent.
- **Same bundle and store as H.** An interview without a brief to fill has
  nothing to persist into.

## 10. Deliverables

- I1 — `lib/decisions.mjs` + `references/decisions.md` + `brief-check.mjs` + fixtures. Accept: `next`, `stale`, `done` and evidence re-verification match the hand-built expected outputs.
- I2 — `prose-interview` SKILL.md + meta.yaml; brief-store writes per batch with expected revision; skill harness entry, recorded as not run until dispatched.
- I3 — mutations (four above) in the `brainstorm` suite; PROTOCOL/README/AGENTS/DESIGN.
- I4 — prose-outline minor bump, RELEASE notes, CHANGELOG, version pin, ROADMAP → shipped; `--mutations` green.

## 11. Known limits

- The tree suits non-fiction pieces. Beat-sheet fiction needs a different tree,
  which is deferred.
- `source` lookups are only as good as what is supplied.
- Interview quality, meaning whether the questions were the right ones, is
  not measured. Only the bookkeeping is.
