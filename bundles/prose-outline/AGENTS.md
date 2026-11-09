# Prose outline

Portable form of the [`prose-outline`](README.md) bundle, for harnesses with no
skill registry.

> **Read this first — little degrades.** The scan and the diff are
> dependency-free Node scripts, so their output is identical on every harness.
> The store is plain files under the identity registry. What you lose is
> dispatch: nothing invokes the skill on its own, and nothing stops a model
> from summarising structure by eye instead of running the scan. The
> instruction block below exists for that second case.

## Setup

Clone the repo, or copy any of `skills/prose-outline/`, `skills/prose-brainstorm/`
or `skills/prose-interview/` anywhere. Each is self-contained.

```bash
node <path>/skills/prose-outline/tools/outline-scan.mjs draft.md --json
```

## Instruction block

Paste into your project `AGENTS.md`.

```markdown
## Prose outline

When asked to outline a piece, to say what a draft argues, or to compare an
outline with an earlier one:

1. For a draft, run the scan and read its JSON rather than describing the
   structure from impression:
       node <path>/skills/prose-outline/tools/outline-scan.mjs <file> --json
   If `status` is `not-evaluated`, say so and why; do not fill the gap by eye.
2. Propose an outline as `voice-outline/1`: every claim carries an evidence
   slot; every unknown is an open question. An underspecified brief yields more
   open questions, not an invented thesis.
3. Show the proposal. Save only when the user says yes, through
       node <path>/skills/prose-outline/tools/outline-store.mjs save ... --approved
   and report the identity, project and revision it was saved under. If no
   writing identity is selected, say the outline is task-local and stop there.
4. For a second revision, show `outline-diff` output, not a prose paraphrase.
5. Given a project brief and a request for options, propose two or three
   candidates in DIFFERENT shapes (skills/prose-outline/shapes/), each with a
   part and a word budget on every top-level node, check each with
       node <path>/skills/prose-outline/tools/proposal-check.mjs c.json --shape <shape.md> --brief-json brief.json
   and show `outline-compare` across them. No scores; the writer picks; save only the pick.

Do not draft prose from the outline here, and do not judge the argument — the
structure critic in prose-review owns that question.

## Prose brainstorm

When handed a voice-memo transcript or rough spoken notes and asked what they
could become:

1. Clean and scan it; every line number afterwards refers to the cleaned text:
       node <path>/skills/prose-brainstorm/tools/transcript-scan.mjs <file> --json --clean-out clean.txt
2. Propose 3–5 angles that differ in thesis or audience. Each quotes the
   passages it rests on, word for word, by cleaned-text line. Thin material
   gets a null thesis and open questions, never an invented one. Every segment
   is used, left out, or listed as unused.
3. Check before showing, and fix every quote that is not `exact`:
       node <path>/skills/prose-brainstorm/tools/angles-check.mjs angles.json clean.txt --scan scan.json
4. Save only on a yes, through brief-store.mjs add-source / save --approved.
   Do not choose the angle and do not start the outline.

## Prose interview

When asked to be interviewed about a piece before outlining it:

1. Each turn, take the next question from the script, never your own choice:
       node <path>/skills/prose-interview/tools/brief-check.mjs brief.json --clean <transcript> --json
2. Before asking, look the answer up in the writer's own material. If found,
   quote it with its line and ask them to confirm; otherwise ask ONE question
   with your recommended answer.
3. Record each approved batch with
       node <path>/skills/prose-interview/tools/brief-store.mjs decide --project P --answers a.json --expected-revision N --approved
4. Stop when brief-check says done (or the writer stops). Then name the outline
   as the next step; do not start it.
```

## What degrades

| Property | Claude Code | Elsewhere |
|---|---|---|
| Scan and diff output | ✅ | ✅ identical — scripts |
| Store, approval gate, undo | ✅ | ✅ identical — files |
| Invoked automatically on the right request | ✅ skill dispatch | ❌ you ask, or the block reminds |
| Refusal to summarise structure by eye | prompt | prompt — the block above |
