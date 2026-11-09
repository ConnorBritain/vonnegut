---
name: prose-interview
description: This skill should be used when the user wants to be interviewed or "grilled" about a piece before outlining it — to settle its angle, audience, purpose, form, length, shape and thesis, what must be in it, what stays out, what earlier work it connects to, and which claims need checking — one question at a time with a recommended answer each, or to resume such an interview. It looks answers up in the writer's own material before asking, records every answer in the project brief on approval, and a script decides what to ask next and when it is finished. It does not outline (prose-outline does), research (prose-research does) or draft.
---

# Prose interview

You interview the writer until the decisions that make a piece what it is are
settled. You ask; the writer decides; `tools/brief-check.mjs` decides which
question comes next and whether you are done. Read
[references/decisions.md](references/decisions.md) first. All paths are
relative to this skill's directory, and the commands are agent internals,
never homework for the user.

## Start from the brief

```bash
node tools/brief-store.mjs locate
node tools/brief-store.mjs show --project <name>
```

If there is no brief, start one from what the writer typed: save their text as
a `notes` source (`add-source --kind notes`, on approval), or keep everything
task-local when no identity is selected and say so. If they hand you a
transcript instead, the brainstorm skill is the better first step; offer it.

## One question at a time

```bash
node tools/brief-check.mjs <brief.json> --clean <cached transcript> [--summary <cached summary>]
```

Take its `next`. Then, before asking anything — on every turn, for every
decision, not only the first:

1. **Look for the answer in the writer's own material.** Start with the brief
   itself: a `chosen_angle` is the answer to `angle`, and an angle's audience,
   thesis or shape may answer those decisions. The cleaned transcript
   and summary cached under the brief, the brief's angles, this project's
   outline (`outline-store show`), and — when the session supplies their read
   output — the continuity bible, the research ledger, or prose-author's corpus
   manifest. Never open another bundle's store yourself.
2. **Found it:** put it as a confirmation, not an open question: quote it with
   its location and ask the writer to confirm, change or reject it. Any
   required decision whose answer is in the material is asked this way. Record `source` as where it came from, with `evidence`;
   it stays `confirmed: false` until they say yes.
3. **Not found:** ask the one question, give your recommended answer, and one
   line of why. Then stop and wait.
4. **"Your call"** records your recommendation with `source: "recommended"`,
   confirmed. **"Skip"** records `value: null` and their reason in `skipped`.

**The writer's words are recorded as they said them.** A `source: "writer"`
value is the writer's reply, verbatim, trimmed of nothing but surrounding
whitespace: do not add a day, a qualifier, a tidier phrasing or a pointer such
as "(transcript lines 13–21)". Where an answer came from goes in `evidence`,
and only for found answers. If their reply needs tightening, offer the tighter
wording as a recommendation and record it only if they say yes to it.

Never ask two questions in one turn — optional decisions included, one at a
time, even when the writer seems ready to answer several — never record a recommendation as the
writer's own answer, and never mark the interview done yourself: it is done
when `brief-check` says `done: true`. If `next` is null and it is not done, a
skipped required question is blocking (`blocked_by`); say which, and ask
whether to answer it now.

When `stale` is non-empty, an earlier answer changed and these depend on it.
Put each back to the writer with its old value as your recommendation.
`assumptions` the writer wants checked go to `prose-research`; do not check
them from memory.

## Save each batch on approval

Write the answers to a task-local file and record them:

```json
{ "decisions": { "audience": { "value": "…", "source": "writer", "confirmed": true } },
  "links": [ { "kind": "outline", "ref": "outline:spring-essay", "why": "same bakery story, told for founders" } ] }
```

```bash
node tools/brief-store.mjs decide --project <name> --answers <answers.json> --expected-revision <N> --approved
```

`decide` merges the answers into the current brief and stamps each with the
revision it writes, which is what makes staleness computable. Without
`--approved` it prints what it would write and writes nothing. A stale
`--expected-revision` is refused: reread with `show` rather than retry. Report
the revision from the receipt.

## Then stop

When `brief-check` says done — or the writer stops — report what is still open,
and name the next step: the outline (`prose-outline`). Do not start it.

## Limits

The tree suits non-fiction; beat-sheet fiction needs a different one. Answers
found in sources are only as good as what was supplied. Whether the questions
were the right ones is not measured; the bookkeeping is. Never state or imply
who or what wrote any of the writer's material.
