# J. Outline baselines

Status: **shipped** as prose-outline 0.4.0 (mirror of [`ROADMAP.md`](../ROADMAP.md);
deliverables in [`STATUS.md`](STATUS.md)). **Historical planning record.** The
durable rationale now lives in `bundles/prose-outline/DESIGN.md` and
`RELEASE-v0.4.0.md`. End-to-end context: [`docs/workflow.md`](../workflow.md).

## 1. Goal and non-goals

From one brief, propose two or three candidate outlines in **different shapes**.
Each candidate allocates the length band across its sections. A script
compares the candidates and checks each one: it fits the band, it has its
shape's required parts, and it covers every must-include item. The writer
picks one, and only that one is saved. Shapes are data files, so the writer's
favourite formats can be added without touching a prompt.

Non-goals:
- Ranking candidates. The comparison is a table of facts, and the writer chooses.
- Drafting, which is K.
- A shape grammar for fiction beyond the existing beat-sheet mode.

## 2. Where it lives

`bundles/prose-outline/`:

```
shapes/{argument-essay, narrative-arc, problem-solution,
        question-and-answer, numbered-lessons, letter}.md
skills/prose-outline/tools/
  shape-check.mjs           validates shape files
  outline-compare.mjs       candidate comparison table
  proposal-check.mjs        gains --shape, --brief-json, and budget checks
  lib/outline-schema.mjs    validates the new optional fields
skills/prose-outline/SKILL.md   gains candidate mode
```

## 3. Contracts

**Shape file** (`shapes/<name>.md`): frontmatter plus one paragraph on when the
shape works and how it fails.

```yaml
name: problem-solution
mode: argument            # argument | beat-sheet
parts:
  - { part: problem,  required: true,  share: [0.15, 0.30] }
  - { part: stakes,   required: true,  share: [0.05, 0.20] }
  - { part: solution, required: true,  share: [0.30, 0.55] }
  - { part: objection, required: false, share: [0.05, 0.20] }
  - { part: close,    required: true,  share: [0.05, 0.15] }
good_for: [newsletter, essay, linkedin-post]
length_hint: { min: 400, max: 2500 }
```

**`voice-outline/1` additions**, all optional and validated when present:

```json
{ "length": { "unit": "words", "min": 800, "max": 1100 },
  "shape": "problem-solution",
  "brief_ref": { "project": "…", "revision": 4, "digest": "<sha256>" },
  "nodes": [ { "id": "n1", "kind": "claim", "part": "problem", "words": 200, "covers": ["must_include.0"] } ] }
```

`outline-compare/1` lists, per candidate:
- shape and node count;
- words allocated against the band;
- required parts present or missing;
- part shares against the shape's ranges;
- must-include items covered or uncovered;
- open questions.

## 4. Deterministic tools

- **`shape-check.mjs [shapes-dir]`.** All keys present. `parts` is non-empty,
  with unique part names. Shares are within [0, 1], and the minimum shares of
  required parts sum to at most 1. `mode` is valid. The validator also
  refuses a prohibition list in the paragraph, using the same rule as
  `medium-profile/1`.
- **`proposal-check.mjs <proposal> [--shape shapes/x.md] [--brief-json brief.json]`.**
  In addition to today's checks:
  - every required part has at least one node;
  - parts appear in the shape's order;
  - node `words` sum to within the outline's `length` band;
  - each part's share is within its range, or reported as outside it, which
    is a signal and not a failure;
  - every `must_include` decision in the brief is referenced by some node's
    `covers`.
- **`outline-compare.mjs <a.json> <b.json> [c.json] --brief-json brief.json`.**
  Produces the table above as JSON and markdown. No scores and no ordering
  beyond input order.

## 5. Model surfaces

The `prose-outline` skill gains **candidate mode**:
- **When.** A brief exists with `shape` either open or confirmed but
  exploratory.
- **What.** Propose 2–3 outlines, each in a different shape whose
  `length_hint` overlaps the brief's band. Allocate `words` per node, mark
  `part` and `covers`, and carry open decisions as `open-question` nodes.
- **Then.** Run `proposal-check` on each and `outline-compare` across them,
  and show the table and the outlines.
- **Save.** Only the writer's pick is saved, through `outline-store.mjs
  save --approved`, with `brief_ref` set.

Tie-break: two candidates in the same shape are not a choice, so the skill
must vary the shape. If only one shape fits the band, it says so and offers
one candidate.

## 6. Registry state

The writer's pick is saved to `outlines/`. Candidates stay task-local. No new store.

## 7. Protocol

Steps: brief (I done, or the writer says "outline anyway"), then 2–3
candidates, then `proposal-check` × N, then `outline-compare`, then the
writer picks, then save, then K.

Without a brief, candidate mode falls back to today's single proposal from a
free-text brief, with the shape asked once.

## 8. Fixtures and harness

- Six shape files that validate, plus three invalid ones: a missing part
  name, minimum shares summing above 1, and a prohibition list in the
  paragraph.
- Candidate fixtures for one brief: a valid problem-solution candidate; a
  narrative-arc candidate whose budgets overshoot the band; a Q&A candidate
  that misses one must-include item.
- Expected `outline-compare` output.

Skill harness:
- **Positive:** a 900-word newsletter brief yields at least 2 candidates in
  different shapes, all passing `proposal-check`.
- **Negative:** a 250-word brief yields no candidate with more parts than the
  band supports, or the skill says only one shape fits.

Recorded as **not run** until dispatched.

Mutations:
- the budget-sum check removed;
- a required part allowed to be missing;
- an uncovered must-include item not reported;
- `shape-check` accepts minimum shares summing above 1.

## 9. Decisions

- **Stay on `voice-outline/1`, with additive optional fields.** Today's
  validator ignores unknown keys, so an installed 0.1.x reader keeps working
  on new outlines. New fields are validated when present, so typos inside them
  are caught. A `/2` cut would break `outline-diff` across revisions for no
  gain.
- **Shapes are data, like personas.** A new format is a file the writer can
  add. Shipped shapes live in the bundle. A personal shapes directory is
  passed with `--shapes-dir` for now. Persisting personal shapes in the
  registry is deferred until someone needs it.
- **Only the pick is saved.** Saving every candidate would turn a decision
  into clutter, and `outline-diff` already shows revisions of the one that matters.
- **No ranking.** Which shape suits the writer's idea is the writer's
  judgement. The table gives facts to judge with.

### Build-time decisions

- **Shapes live inside the skill** (`skills/prose-outline/shapes/`), not at the
  bundle root, so a loose install of the skill carries them.
- **The shape frontmatter is one line per part** (`name | required|optional |
  min-max`) rather than YAML maps, so a dependency-free parser reads it exactly.
- **Parts may repeat** (one node per question or lesson); a part's share is the
  sum of its nodes. **A budget under a budget is refused**, so nothing is counted twice.
- **A brief's length band must match the outline's** when both exist; the brief
  is where the writer settled it.

## 10. Deliverables

- J1 — six shape files + `shape-check.mjs` + invalid fixtures. Accept: the three invalid shapes are refused by name.
- J2 — schema additions (`length`, `shape`, `brief_ref`, node `part` / `words` / `covers`) validated when present; `proposal-check` gains shape, budget and coverage checks. Accept: the overshooting and the uncovering candidates are named.
- J3 — `outline-compare.mjs` + expected output; SKILL.md candidate mode; skill harness entry, recorded as not run until dispatched.
- J4 — mutations (four above); PROTOCOL/README/AGENTS/DESIGN; `references/outline-schema.md`.
- J5 — prose-outline minor bump, RELEASE notes, CHANGELOG, version pin, ROADMAP → shipped; `--mutations` green.

## 11. Known limits

- Share ranges are starting values, not measurements of good writing.
- Word budgets are plans. The draft's actual section lengths are what
  `outline-scan` and the structure critic see afterwards.
- Six shapes is a starting set.
