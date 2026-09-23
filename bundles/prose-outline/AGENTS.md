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

Clone the repo, or copy `skills/prose-outline/` anywhere. It is self-contained.

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

Do not draft prose from the outline here, and do not judge the argument — the
structure critic in prose-review owns that question.
```

## What degrades

| Property | Claude Code | Elsewhere |
|---|---|---|
| Scan and diff output | ✅ | ✅ identical — scripts |
| Store, approval gate, undo | ✅ | ✅ identical — files |
| Invoked automatically on the right request | ✅ skill dispatch | ❌ you ask, or the block reminds |
| Refusal to summarise structure by eye | prompt | prompt — the block above |
