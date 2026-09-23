# Prose bible

Portable form of the [`prose-bible`](README.md) bundle, for harnesses with no
skill or agent registry.

> **Read this first.** The index, the diff and the store are dependency-free
> scripts and plain files, so they are identical on every harness. The critic
> is a prompt, and its two load-bearing guarantees — read-only and a clean
> context — are requests elsewhere. `docs/portability.md` grades that
> degradation as **severe**: a critic that helped write the chapters will
> remember what it meant. Run it as a fresh process over the index diff and the
> bible, and run the index yourself first so it cannot skip the counting.

## Setup

Copy `skills/prose-bible/` anywhere; it is self-contained.

```bash
node <path>/skills/prose-bible/tools/entity-index.mjs <project-dir> --json
node <path>/skills/prose-bible/tools/index-diff.mjs <index.json> [--bible <bible.json>]
```

## Instruction block

Paste into your project `AGENTS.md`.

```markdown
## Prose continuity

When asked to build or update a project's bible, or whether a project
contradicts itself:

1. Run the index over the project's files and the diff over the index. Read
   the JSON. Do not list names, dates or definitions from memory.
2. Propose bible entries from the index and confirm each with the writer.
   Save only when told to, through the store's --approved flag, and report the
   identity, project and revision. If no writing identity is selected, say the
   bible is task-local.
3. For contradictions, hand the index diff and the bible to
   prose-continuity-critic in a fresh context. Every finding cites two
   locations the index supplied; one that does not is a guess — drop it.
   When you cannot tell whether two passages conflict, say nothing.
4. Never state or imply who wrote a passage.
```

## What degrades

| Property | Claude Code | Elsewhere |
|---|---|---|
| Index, diff, store | ✅ | ✅ identical — scripts and files |
| Critic read-only | ✅ tool allowlist | ❌ a request |
| Critic clean context | ✅ subagent | ⚠️ only if you run it as a fresh process |
| Two-location rule | prompt | prompt — survives intact, and is the rule to keep |
