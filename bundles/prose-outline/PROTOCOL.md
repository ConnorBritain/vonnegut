# The outline protocol

How this bundle is meant to be run. Prose, not code — the main session executes
this; there is no orchestrator.

```
  0  brainstorm    a transcript or notes → angles → a project brief      (optional; below)
  ½  interview     settle the brief's decisions, one question at a time  (optional; below)
  1  brief         the user's request or the saved brief, plus any existing draft
  2  scan          outline-scan on the draft, if there is one    (deterministic)
  3  propose       voice-outline/1: thesis · claims · evidence slots · open questions
                   (beat-sheet mode: premise · acts · beats · turns)
  4  approve       the user reads it; nothing is saved until they say so
  5  save          outline-store … --approved → identity / project / revision receipt
  6  diff          on a later revision, outline-diff old new; show the JSON's findings
```

## Step 0 — brainstorm, when the material is spoken

```
  0a  scan       transcript-scan → cleaned text with stable lines      (deterministic)
  0b  propose    3–5 angles, each quoting the passages it rests on
  0c  check      angles-check: quotes verbatim at their line, every segment accounted for
  0d  approve    the writer reads the angles; nothing is saved until they say so
  0e  save       brief-store add-source (the cleaned transcript), then save --approved
```

Every line number refers to the cleaned text. A quote is the writer's exact
words; `drifted` means the session changed them and must fix it before showing.
Thin material yields angles with a null thesis and open questions. The skill
never chooses the angle and never starts the outline itself: it names the next
step — the interview, or step 1.

## Step ½ — interview, to settle what the piece is

```
  ½a  check      brief-check → next question, stale answers, done        (deterministic)
  ½b  look up    the transcript, summary, angles, this project's outline, sibling read output
  ½c  ask        one question with a recommended answer — or confirm a found one
  ½d  approve    the writer answers; brief-store decide --approved stamps the batch
```

The tree is fixed (`references/decisions.md`); brief-check walks it in
dependency order and marks downstream answers stale when an upstream one
changes. A found answer carries its quote and stays unconfirmed until the
writer's yes; "your call" is recorded as the recommendation, never as the
writer's words. The interview is done when brief-check says so, not before.
Sibling material (the bible, the research ledger, the corpus) arrives as read
output the session supplies; the skill never opens another bundle's store.

## Step 2 — scan first, and read the JSON

The scan is cheap and its fields are evidence a model would otherwise estimate:
section lengths, marker counts, where transitions are and are not. A model asked
whether a section is short answers from impression; the scan answers from
words. If the scan returns `status: not-evaluated` (no headings, fewer than
three paragraphs), say so — do not describe a structure the tool declined to
measure.

## Step 3 — propose, do not resolve

The skill is a planner. An underspecified brief yields open questions; a claim
with no evidence gets an empty slot, not an invented citation. The proposal is
written to a task-local file and shown whole.

## Step 4–5 — approval is the gate

Saving needs the user's yes. The store's `--approved` flag is set only then.
Three registry states, all handled and all said out loud:

| Registry | What happens |
|---|---|
| none | The outline stays task-local. Say so. |
| identities, no default | Ask which identity. Never pick the first. |
| default selected | Save; report identity, project, revision, and how to undo. |

## Step 6 — the diff is the report

Two revisions are compared by node id. Show what the differ found — added,
removed, moved, reworded — rather than a paraphrase of it. A node whose id is
missing is *removed*, never guessed to be a rewording.

## What this session must never do

- Quote the writer in words they did not use, or choose their angle for them.
- Record a recommendation as the writer's answer, or declare an interview done
  while brief-check says it is not.
- Draft prose from the outline here. That is `prose-draft`'s job, with its own
  checks.
- Judge the argument. `prose-structure-critic` reads this scan in a clean
  context; the session that wrote the outline is not that context.
- Save as a side effect. No "I went ahead and stored it".
- State or imply anything about who wrote a draft.

## Degradation

Without `prose-author` the registry may not exist: outlines are task-local and
the skill says so. Without `prose-review` the structure critic does not run,
and the skill does not substitute its own critique.
