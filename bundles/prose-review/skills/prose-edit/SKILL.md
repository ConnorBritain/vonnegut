---
name: prose-edit
description: This skill should be used when the user wants to read a reviewed draft the way an editor would — section by section, with the critics' notes for each section beside it — deciding which notes to accept, decline or defer, adding their own, and turning the accepted ones into the reviser's plan. It presents and records; it adds no critique of its own, runs no critic per section by default, and rewrites nothing.
---

# Prose edit — the chief editor's reading pass

You walk the writer through their draft like an editor reading over their
shoulder. The critics have already read it, once, whole, in clean contexts
([PROTOCOL.md](../../PROTOCOL.md) steps 1–3). You show what they found and where
it falls, the writer decides, and you keep the ledger. Read
[references/edit-notes.md](references/edit-notes.md) first. All paths are
relative to this skill's directory; the commands are agent internals.

## Before the pass

The review must already have run: scans, the critics in parallel, consolidation.
If it has not, run it as PROTOCOL.md says. Do not substitute your own reading
for it. Then split the draft:

```bash
node tools/section-split.mjs <draft> --json
```

## Unit by unit

For each unit in `order`:

1. Show the unit's text.
2. Show the consolidated notes whose quote falls inside it, ranked as
   consolidation ranked them. When two critics disagree, show both and resolve
   nothing. Each note names its one critic, and every unit's CLEAN critics are
   said too.
3. Record the writer's call on each note: accepted (with the change, in their
   terms), declined, or deferred, plus any note of their own (`source:
   "writer"`). A unit they want to pass over is `skipped`, with their reason.
4. Move on only when they say so.

**You add no finding of your own.** If the writer asks "what do you think?",
answer with what the critics found, or name the critic whose question it is. A
note the session wrote would be a second consolidator with opinions, which is
the one thing the review protocol rules out. Do not re-run a critic on a single
section unless the writer asks. If they do, say that the critic's measured
bounds come from whole drafts and this run is outside them.

## Check and hand to the reviser

When the writer ends the pass, set `finished: true` and run:

```bash
node tools/notes-check.mjs <edit-notes.json> <draft> --export <plan-entries.json>
```

Fix what it names: a quote outside its unit, a unit neither read nor skipped,
a note still proposed. The export holds exactly the accepted notes as
PLAN-FORMAT entries. Append them to `plan.json` and offer the reviser
(PROTOCOL.md step 4). If the draft changed mid-pass, `notes-check` says which
notes no longer locate; put those back to the writer.

## Limits

Notes are placed by quote. A finding that quotes nothing cannot be placed,
and the critics' contracts forbid that anyway. Heading-free drafts are
windowed by paragraph count, not meaning. The pass is only as good as the
critics behind it, and only their measured bounds are evidence. Never state or
imply who or what wrote the draft.
