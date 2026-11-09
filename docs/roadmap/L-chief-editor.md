# L. Chief-editor reading pass

Status: **planned** (mirror of [`ROADMAP.md`](../ROADMAP.md); deliverables in
[`STATUS.md`](STATUS.md)). End-to-end context: [`docs/workflow.md`](../workflow.md).

## 1. Goal and non-goals

Give the writer an editor's reading of a draft: section by section, with the
notes for each section beside it while they read. The writer accepts,
declines or defers each note, and adds their own. Accepted notes become the
reviser's plan. This is how the existing review protocol's results are
*read*. It is not a new critic.

Non-goals:
- A new reviewing agent, or an orchestrator.
- Critique produced by the session itself.
- Re-running critics per section by default.
- Rewriting prose. The reviser and the writer do that.

## 2. Where it lives

`bundles/prose-review/skills/prose-edit/`, the first skill in prose-review:

```
SKILL.md  meta.yaml                     kind: reviewer, surface: skill, read-only on the draft
references/edit-notes.md                edit-notes/1, human-readable
tools/
  section-split.mjs
  notes-check.mjs
```

Also changed:
- `bundles/prose-review/PROTOCOL.md`: step 3a, "read it with the editor pass".
- `README.md`, `AGENTS.md`, `DESIGN.md`.
- The Claude manifest needs nothing, because skills are auto-discovered.
- `tools/check-installation.mjs`: SKILLS.

## 3. Contracts

`section-split/1`: `{ draft_digest, units: [{ id: "u1", heading, start_line,
end_line, words, digest }] }`.
- Units come from headings, or, in a heading-free draft, from windows of
  about 4 paragraphs.
- A unit's id is stable while its digest is unchanged.

`edit-notes/1`, a task-local file beside `plan.json`:

```json
{ "schema": "edit-notes/1", "draft_digest": "<sha256>",
  "units": [ { "id": "u1", "status": "read | skipped", "skip_reason": null } ],
  "notes": [ { "id": "N1", "unit": "u1", "source": "voice-critic | structure-critic | fidelity-critic | reader-critic:<persona> | medium-critic | writer",
               "line": 12, "quote": "…", "note": "…",
               "status": "proposed | accepted | declined | deferred", "writer_comment": null } ] }
```

The export is accepted notes as [PLAN-FORMAT](../../bundles/prose-review/PLAN-FORMAT.md)
entries, with `source` carried over, appended to `plan.json` for the reviser.

## 4. Deterministic tools

- **`section-split.mjs <draft> [--json]`.** Builds the units above. The window
  size is a named constant.
- **`notes-check.mjs <edit-notes.json> <draft> [--export plan-entries.json]`.**
  Checks that:
  - every note's quote appears at its line, inside its unit;
  - every unit is `read` or `skipped` with a reason;
  - no `proposed` note remains when the pass is declared finished;
  - the export contains exactly the accepted notes.

  It exits 1 on any failure. When the draft's digest has changed since the
  notes were made, it re-locates quotes and reports which notes no longer match.

## 5. Model surfaces

`prose-edit` skill, `kind: reviewer`.

- **Framing.** You walk the writer through their draft like an editor
  reading over their shoulder. The critics have already read it. You show
  what they found, where it falls, and you keep the ledger.
- **Scope:**
  - the draft;
  - the consolidated review, i.e. the critics' transcripts after PROTOCOL.md
    step 3;
  - the `section-split` output;
  - the writer's reactions.
- **Priority list:**
  1. Confirm the review protocol has run. If not, run it first, as PROTOCOL.md says.
  2. Split the draft into units.
  3. For each unit in order, show the text and the notes located in it,
     ranked as consolidation ranked them, with disagreements kept visible.
  4. Record the writer's call on each note, and any note of their own.
  5. Run `notes-check`, then export the accepted notes to `plan.json`.
  6. Offer the reviser.
- **Tie-break.** The session adds no finding of its own. If the writer asks
  "what do you think?", the answer is the critics' findings or a pointer to
  the critic whose job it is.
- **Output contract.** The current unit and its notes; at the end, the
  `notes-check` result and the number of plan entries exported.

## 6. Registry state

None. Drafts, `plan.json` and `edit-notes/1` are task-local, as the review
protocol's files already are.

## 7. Protocol

PROTOCOL.md gains step 3a between consolidation and the author's edit:
consolidated review, then `section-split`, then the unit-by-unit reading with
the ledger, then `notes-check`, then the plan export, then step 4 (reviser)
as today. Skipping 3a leaves the protocol exactly as it is now.

## 8. Fixtures and harness

`tests/fixtures/edit/`:
- a sectioned draft and a heading-free draft (expected units);
- a notes ledger with one quote outside its unit;
- a ledger with a skipped unit that has no reason;
- a ledger with a declined note in the export.

Skill harness:
- **Positive:** a draft with planted voice and structure findings. Every
  consolidated finding appears in exactly one unit.
- **Negative:** a clean human essay with an all-CLEAN review. The pass
  surfaces no notes except the writer's, and the session offers no critique
  of its own.

Recorded as **not run** until dispatched.

Mutations:
- `notes-check` accepts a quote outside its unit;
- the export includes declined notes;
- a unit silently skipped;
- a finished pass with `proposed` notes left.

## 9. Decisions

- **A skill, not an agent.** The user asked for it this way, and the repo's
  rule is that consolidation is protocol, not an agent (`prose-review/DESIGN.md`,
  "Consolidation is protocol, not an agent"). An editor agent would be a
  second consolidator with its own opinions, which is exactly what that rule
  prevents.
- **Critics run once, on the whole draft.** Their false-positive bounds were
  measured on whole drafts. Dispatching them per section would change their
  input, void those numbers, and multiply cost by the number of sections. A
  "deep look" re-dispatch on one unit may be requested, and is reported as
  outside measured conditions. It is not part of the default pass.
- **The session adds no critique.** Same reason. Every note has exactly one
  critic, or the writer, as its source.
- **The ledger is task-local.** It belongs to one draft, as `plan.json` does.

### Build-time decisions

- **Unit ids are derived from the unit's text** (`u` + 8 hex of its sha256), so an
  edit elsewhere never renames a unit; `order` carries reading order.
- **An accepted note needs a `change`**, because the reviser executes changes,
  not findings; the note text becomes the plan entry's `reason`.
- **The line is not load-bearing**: a note is placed by its quote inside its
  unit, and a moved line is reported, as PLAN-FORMAT says.
- **The cursor manifest gains `"skills": "skills"`**; the Claude manifest keeps
  only its `agents` list, so skill discovery there is unchanged.

## 10. Deliverables

- L1 — `section-split.mjs` + fixtures. Accept: expected units for both drafts; ids stable under an edit elsewhere.
- L2 — `edit-notes/1` + `notes-check.mjs` + export + fixtures. Accept: names the out-of-unit quote, the unreasoned skip and the declined note in the export.
- L3 — `prose-edit` SKILL.md + meta.yaml; PROTOCOL.md step 3a; README/AGENTS/DESIGN; skill harness entry, recorded as not run until dispatched.
- L4 — mutations (four above).
- L5 — prose-review minor bump, RELEASE notes, CHANGELOG, version pin, ROADMAP → shipped; `--mutations` green.

## 11. Known limits

- Notes are located by quote. A finding that quotes nothing, which the
  critics' contracts forbid, cannot be placed.
- Heading-free drafts are windowed by paragraph count, not by meaning.
- The pass is as good as the critics behind it, and only their measured
  bounds are evidence.
