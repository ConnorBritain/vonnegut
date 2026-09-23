# AGENTS.md snippet

Short form. The full instruction block, with the reasoning, is in
[`../AGENTS.md`](../AGENTS.md) — append that wholesale instead if you prefer.

The index, diff and store port intact; the critic loses read-only and clean
context outside Claude Code, so run it as a fresh process.

---

```markdown
## Prose continuity

When asked to build a project's bible or whether it contradicts itself: run
the index and the diff —

    node <path>/skills/prose-bible/tools/entity-index.mjs <project-dir> --json
    node <path>/skills/prose-bible/tools/index-diff.mjs <index.json> --bible <bible.json>

— propose entries from the index and confirm each; save only when told to.
Hand the diff and the bible to prose-continuity-critic in a fresh process.
Report only findings that cite two locations the index supplied. Never state
or imply who wrote a passage.
```
