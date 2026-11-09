---
name: prose-outline
description: This skill should be used when the user asks to outline a piece from a brief, topic or notes, to compare two or three candidate outlines in different shapes for a project brief, to see what a draft actually argues section by section, to beat-sheet a chapter or story, to compare an outline with an earlier revision, or to save or restore a project's outline. It proposes outlines and runs a deterministic structure scan; it does not draft prose (prose-draft does), and it does not judge whether the argument is good (prose-structure-critic in prose-review does). Nothing is saved without the user's approval.
---

# Prose outline

You turn a brief into a checkable outline and describe what a draft currently
argues. The scripts under `tools/` count; you propose. Read
[references/outline-schema.md](references/outline-schema.md) before proposing.
All paths are relative to this skill's directory, and the commands are agent
internals, never homework for the user.

## Choose the mode

- **Argument** (essays, posts, reports, talks): thesis, ordered claims, an
  evidence slot on every claim, open questions for what the brief leaves out.
- **Beat-sheet** (fiction, narrative non-fiction): premise, acts, beats and
  turns, open questions for what the brief leaves out.

Ask one short question only when the mode is genuinely unchoosable. A brief
that says "chapter", "scene" or "story" is beat-sheet; almost everything else
is argument.

## Read the draft before describing it

When a draft exists, run the scan and read its JSON rather than describing the
structure from impression:

```bash
node tools/outline-scan.mjs <draft> --json
```

Use `headings`, `sections[].words` and `ratio_to_median`, each paragraph's two
topic-sentence candidates, its `claim_markers`, and `transitions.unmarked`. If
`status` is `not-evaluated`, say so and why; do not fill the gap by eye. Counts
are not findings: a short section is a count, and whether it costs the argument
is the structure critic's question, not yours.

## Propose, do not resolve

Write the proposal as a `voice-outline/1` body to a task-local file and show it
whole. Then check it:

```bash
node tools/proposal-check.mjs <proposal.json> --brief <brief.md>
```

- Every claim carries an evidence slot (`filled_by: null` when the brief gives
  nothing to fill it). Never fill a slot with something plausible.
- **An underspecified brief yields open questions, not an invented thesis.**
  Set `thesis` to `null` and say in open-question nodes what is missing. The
  checker refuses a null thesis with no open questions, and a concrete brief
  with a withheld one.
- Node ids are `n1, n2, …` and stay stable across revisions; the differ keys on
  them. Reuse ids when revising; never renumber.

## Candidate mode — two or three shapes, one choice

When the project has a brief (`prose-brainstorm` and `prose-interview` write
one; `node ../prose-brainstorm/tools/brief-store.mjs show --project <name>`, or
the same tool in either skill) and the writer wants to see options, propose
**two or three** outlines in **different shapes** instead of one. A shape is a
data file under `shapes/` (argument essay, narrative arc, problem–solution,
Q&A, numbered lessons, letter); `node tools/shape-check.mjs` lists and
validates them, and a personal shapes directory is checked the same way.

- Pick shapes whose `length_hint` overlaps the brief's length band and whose
  `good_for` fits its form. Two candidates in the same shape are not a choice;
  if only one shape fits, say so and offer one.
- Each candidate carries `shape`, the brief's `length` band, `brief_ref`, and
  on every top-level node a `part` (one of the shape's parts) and a `words`
  budget. Mark `covers` with the brief decisions a node carries
  (`must_include.0`, …). Open decisions become `open-question` nodes.
- Check each, then compare them, and show the table with the outlines:

```bash
node tools/proposal-check.mjs <candidate.json> --shape shapes/<shape>.md --brief-json <brief.json>
node tools/outline-compare.mjs <a.json> <b.json> [c.json] --brief-json <brief.json>
```

Fix every finding before showing a candidate. A part outside its share range is
a signal, not a finding: say it, do not force the budget into the range. The
table has no scores and no winner; the writer chooses. Save only the one they
pick, below. The others stay task-local.

**A pick is not a yes to saving.** When the writer picks a candidate, show it
and ask whether to save it; run the save only on that yes, in a later turn.
Save under the brief's project name. If there is no brief or no project name,
ask the writer for one. Never make one up from the outline's title.

## Save only on approval

Locate the store first and say what it found:

```bash
node tools/outline-store.mjs locate
```

| Registry state | What you do |
|---|---|
| `none` | The outline stays task-local. Say so. Do not create a registry. |
| `ambiguous` | Ask which identity. Never pick the first. Pass `--identity` once answered. |
| `located` | Show the proposal; on the user's yes, save. |

```bash
node tools/outline-store.mjs save --proposal <proposal.json> --project <name> --expected-revision <N> --approved
```

Without `--approved` the command prints what it would write and writes nothing.
`--expected-revision` is the revision `show` reported (0 for a new project); a
stale value is refused, so reread rather than retry. Report the identity,
project and revision from the receipt, and that `undo` restores the previous
revision as a new one. Never save as a side effect of drafting or scanning.

## Diff, do not paraphrase

For a later revision, show what the differ found:

```bash
node tools/outline-diff.mjs <before.json> <after.json>
```

Added, removed, moved, reworded and evidence changes are reported by node id. A
node whose id vanished is *removed*, even if similar words appear elsewhere; do
not smooth that into "reworded".

## Limits

Sentence boundaries, claim markers and topic-sentence candidates are heuristics
and the scan names them as such. An outline is the writer's plan, not evidence
about the draft's quality. Never state or imply who wrote a draft, and never
draft prose from the outline here — hand that to `prose-draft`.
