# prose-author v0.10.0 release notes

v0.10.0 drafts from an approved outline. A script, not a model, turns the
outline prose-outline saved, and the brief its interview settled, into a
`prose-writing-job/1`, so the runtime drafts the piece that was planned. Roadmap
item K ([`docs/roadmap/K-outline-handoff.md`](../../docs/roadmap/K-outline-handoff.md));
the contract between the two bundles is
[`docs/contracts/outline-handoff.md`](../../docs/contracts/outline-handoff.md).

## Added

- **`skills/prose-draft/tools/outline-job.mjs`** maps the outline and brief onto
  the job:
  - the length band becomes a `word-limit` rule;
  - sections, in reading order, become facts that carry their part and word
    budget;
  - filled evidence becomes facts;
  - the brief's confirmed audience, purpose and form become the context;
  - must-include and exclude items become semantic rules.

  `job.handoff` traces every fact and rule back to a node or decision.
- **Refusals:** open questions, a withheld thesis, and any required decision
  that is open, skipped, unconfirmed or stale each stop the job, by name.
  `--allow-open` carries open questions forward as explicit "leave unresolved"
  rules.
- **`lib/outline-handoff.mjs`** is a port of prose-outline's read side. A
  parity test pins it to prose-outline's own validators and to the interview's
  dependency table, and the test SKIPs when prose-outline is absent.
- **The receipt** names the outline: project, revision, shape and digest.
- **Docs:** `SKILL.md` adds the from-an-outline path,
  `references/outline-handoff.md` explains it, and PROTOCOL gains "Drafting from
  an outline (v0.10)", with the structure critic in intended-outline mode after
  delivery.

## Compatibility

Jobs without an outline, and their receipts, are unchanged. The runtime ignores
`handoff` and tolerates `outline`, as it tolerates other job keys.

## Evidence and limits

- `node bundles/prose-author/tests/selftest.mjs outline-handoff` reports zero
  failed.
  - Four expected jobs reproduce byte for byte.
  - Every fact and rule has a source, and every rule is one the runtime accepts.
  - The refusals name each open question and stale decision.
  - The port agrees with prose-outline across 50 outlines and planted defects,
    and across all seven interview briefs.
- The full mutation sweep is green. Four mutations are all caught: open
  questions dropped, the length band forgotten, a fact with no source, and an
  unconfirmed answer taken into the job.
- **No end-to-end runtime run from an outline has been dispatched**, so it is
  recorded as not run.
- Section budgets are guidance to the drafter. Only the overall band is enforced.
