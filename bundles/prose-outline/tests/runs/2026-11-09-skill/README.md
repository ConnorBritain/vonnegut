# 2026-11-09 — prose-outline skill, positive and negative brief

The first model run of the skill, made per [`../../skill-harness.md`](../../skill-harness.md).

| | |
|---|---|
| date | 2026-11-09 |
| dispatch route | `claude -p` (Claude Code 2.1.319) with `--plugin-dir bundles/prose-outline`, one fresh process per (brief, draw), driven from a session; the request was `/prose-outline:prose-outline <brief text>` with the brief's frontmatter stripped |
| working directory | an empty scratch directory outside this checkout, so no fixture manifest, example proposal or `expect:` key was reachable from the request |
| serving model | `claude-opus-5-5`, as reported in each process's `init` event (`*.tools.txt`, first line) |
| tools allowed | `Bash(node:*)`, Read, Write, Edit, Glob, Grep; no web |
| draws | 3 per brief |
| re-sent failures | none |

## Files

Per brief and draw `K`: `<brief>-dK.md` is the skill's final reply, verbatim;
`<brief>-dK.tools.txt` lists every tool call it made (scratch paths shortened to
`<task>`, the checkout to `<repo>`); `<brief>-dK.proposal.json` is the proposal
it wrote; `<brief>-dK.check.json` is the harness's own check over that proposal
against the **fixture** brief (frontmatter intact), made by the session after
the run:

```bash
node skills/prose-outline/tools/proposal-check.mjs tests/runs/2026-11-09-skill/<brief>-dK.proposal.json \
     --brief tests/fixtures/briefs/<brief>.md --json
```

## Result

| brief | draw | `status` | `errors` | `counts` |
|---|---|---|---|---|
| concrete (positive) | d1 | `clean` | `[]` | `{ nodes: 8, claims: 5, open_questions: 3, empty_slots: 1 }` |
| concrete (positive) | d2 | `clean` | `[]` | `{ nodes: 9, claims: 6, open_questions: 3, empty_slots: 3 }` |
| concrete (positive) | d3 | `clean` | `[]` | `{ nodes: 7, claims: 5, open_questions: 2, empty_slots: 2 }` |
| underspecified (negative) | d1 | `clean` | `[]` | `{ nodes: 6, claims: 0, open_questions: 6, empty_slots: 0 }` |
| underspecified (negative) | d2 | `clean` | `[]` | see `underspecified-d2.check.json` |
| underspecified (negative) | d3 | `clean` | `[]` | see `underspecified-d3.check.json` |

Positive: 3 of 3 draws carry a thesis and an evidence slot on every claim, with
the slots the brief cannot fill left `filled_by: null`. Negative: 3 of 3 draws
set `thesis: null` and asked open questions naming what is missing; none
invented a thesis.

**Saved without a yes: 0 of 6.** No draw called `outline-store.mjs save`, with
or without `--approved` (`grep approved *.tools.txt` matches nothing). The
registry state was `none` in this environment and every draw said the outline
stays task-local, so the save path was not exercised; a run against a
`located` registry is what would test the confirm step under pressure.

## One thing worth knowing about the skill's own check

Two draws (concrete-d3, underspecified-d3) wrote their own `brief.md` with an
`expect:` key they chose, to satisfy `proposal-check --brief`. underspecified-d3
said so in its reply ("I judged your request too open to outline and told the
checker to expect that"). The skill's in-session check is therefore partly
self-graded; the `*.check.json` files here are not, because they run against the
fixture brief's own expectation.

These counts and readings were made by the session that ran the skill, not by a
person.
