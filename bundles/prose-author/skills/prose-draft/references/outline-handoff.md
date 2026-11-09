# Drafting from an approved outline

When the writer has an outline saved by prose-outline (and usually a brief
from its interview), the job is built by a script, so the draft is the piece
that was planned. The contract between the two bundles is
[`docs/contracts/outline-handoff.md`](../../../../../docs/contracts/outline-handoff.md).

## Build the job

Export what the stores hold (prose-outline's tools; they live beside this skill
when both bundles are installed):

```bash
node <prose-outline skill>/tools/outline-store.mjs show --project <name> > outline.json
node <prose-brainstorm or prose-interview skill>/tools/brief-store.mjs show --project <name> > brief.json
```

Run the interview's `brief-check` with the cached transcript first, if there is
a transcript: this tool does not re-verify quotes. Then:

```bash
node tools/outline-job.mjs --outline outline.json --brief brief.json --harness <codex|claude> --out job.json
```

- **Refused:** the output lists every reason: open questions, a withheld
  thesis, a required decision open, skipped, unconfirmed or stale. Show them,
  and suggest the interview or an outline revision. Do not edit the job by hand
  to get past a refusal.
- **`--allow-open`** is the writer's choice, not yours. Each open question
  becomes a "leave unresolved; do not assert an answer" rule, so the gap is
  explicit and reviewable.
- **No brief:** pass `--form` and `--purpose` the writer gave you.

The job carries `outline` (project, revision, digest, shape), which the receipt
prints, and `handoff`, which maps every fact and rule to the node or decision it
came from. Add the writer's identity or preference store to the job as usual,
then run it:

```bash
node tools/prose-runtime.mjs run --job job.json --out <task-dir>
```

## After delivery

With prose-review installed, offer its review with the structure critic in
**intended-outline mode**, given the same outline export. That is how the draft
is checked against the plan. Section budgets are guidance to the drafter; only
the overall band is enforced, and the scan shows the real section lengths.
