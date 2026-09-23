# AGENTS.md snippet

Short form. The full instruction block, with the reasoning, is in
[`../AGENTS.md`](../AGENTS.md) — append that wholesale instead if you prefer.

Nothing measurable is lost porting this bundle: the scan, the diff and the
store are dependency-free scripts and plain files. What you lose is dispatch,
which is what this snippet replaces.

---

```markdown
## Prose outline

When asked to outline a piece, say what a draft argues, or compare outline
revisions: run the scan on any draft and read its JSON —

    node <path>/skills/prose-outline/tools/outline-scan.mjs <file> --json

— propose an outline with an evidence slot on every claim and an open question
for every unknown, show it, and save only when told to. Report the identity,
project and revision, or say the outline is task-local. Do not draft prose from
it here, and do not judge the argument.
```
