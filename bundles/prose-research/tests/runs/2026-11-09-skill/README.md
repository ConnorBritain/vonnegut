# 2026-11-09 — prose-research skill, positive and negative

The first model run of the skill, made per [`../../skill-harness.md`](../../skill-harness.md).

| | |
|---|---|
| date | 2026-11-09 |
| dispatch route | `claude -p` (Claude Code 2.1.319) with `--plugin-dir bundles/prose-research`, one fresh process per (test, draw), driven from a session |
| requests | positive: `/prose-research:prose-research Check ./draft.md against the sources in ./sources and the claims ledger in ./ledger.json.` — negative: `/prose-research:prose-research Which claims in ./draft.md need a source? The claims ledger is ./ledger.json.` |
| working directory | a scratch directory outside this checkout. Positive: `sources/` (the two fixture sources), `ledger.json`, `draft.md` (frontmatter stripped). Negative: `ledger.json` and `no-claims.md` staged as `draft.md`, so the file name did not give the answer away |
| serving model | `claude-opus-5-5`, as reported in each process's `init` event (`*.tools.txt`, first line) |
| tools allowed | `Bash(node:*)`, Read, Write, Edit, Glob, Grep, Agent/Task; no web |
| draws | 3 per test |
| re-sent failures | none |

## Files

Per test and draw `K`: `<test>-dK.md` is the skill's final reply, verbatim;
`<test>-dK.tools.txt` lists its tool calls (scratch paths shortened to
`<task>`); `<test>-dK.map.json` is the sentence map it wrote, where it wrote
one; `<test>-dK.check.json` is `claims-check` over that map, made by the session
after the run, against the harness's own fixture dossier and ledger
(`tests/research-fixtures.mjs`: `buildFixtureDossier`, `loadLedger`, offline).

## Positive — met on 3 of 3, with two notes

`claims-check` over each draw's own map, from `positive-dK.check.json`
(identical on all three):

```
quotes   k1:exact, k2:exact, k3:drifted, k4:drifted, k5:absent, k6:exact
links    s1:not-evaluated, s2:ok, s3:dead
coverage p2s3:unledgered, p4s1:unledgered
```

Those are the rows the harness expects. Against the recorded questions:

- **Every row reported is in the check's output: yes, 3 of 3**, with two
  differences that follow from what the skill was given. The harness hands it
  no dossier, so no draw could see a source `s3`; each reported k5 as citing a
  source that does not exist (and found its words in `valley-guide.html`),
  where the fixture dossier makes `s3` a dead link. And each draw also reported
  that the draft itself quotes "three carts" where the source and k2 say "two
  carts" — not a `claims-check` row, labelled in every draw as the skill's own
  reading of the draft against the source, not as the tool's.
- **Any sentence saying a claim is true or false: none.** Every draw said the
  opposite in so many words ("None of this says whether a claim is true").
- **Confidence asked rather than filled: yes.** No draw proposed a ledger entry
  with a confidence; d1 asked for the writer's confidence for any new entry.
- **Saved before a yes: no.** No draw called `research-store.mjs save` or
  `add-source`; the registry state was `none`, so the save path was not
  exercised.

**Harness note:** `tests/fixtures/ledger/ledger.json` is a bare `{ claims }`
body. `claims-check` refuses it without the `claims-ledger/1` header that
`research-fixtures.mjs`'s `loadLedger` adds, so every positive draw had to wrap
a copy before the check would run (each said so, and left the original
unchanged — verified by `cmp`).

## Negative — the behaviour met on 3 of 3; the check could not be produced

Every draw classified both sentences of the walk as non-claims, reported an
empty coverage list, invented no ledger entry, and noted k4 (the guide's
wet-weather advice) as a near-match it deliberately did not map. That is the
promise the negative test exists for.

What did not happen is the harness's mechanical check, `claims-check` over the
skill's own map returning `coverage: []`:

- **d1** wrote no map file and did not run the check;
- **d2** wrote a map but its `claims-check` call was blocked;
- **d3** ran `claims-check`, which rejected the bare ledger (the note above).

Both d1's and d2's blocks came from **this run's dispatch, not the skill**: the
allowlist was `Bash(node:*)`, which denies a compound shell command (`cd …;
mkdir …; node …`), and the plugin directory was not passed with `--add-dir`, so
listing the skill's `tools/` was refused as outside the working directory. The
denials are in each process's result record. Every draw, positive included,
hit some of them; the positive draws worked around them, the negative ones
mostly stopped. The two maps that
exist (`negative-d2.map.json`, `negative-d3.map.json`) mark both sentences
`claim: false`, but they are not valid `sentence-map/1` (no `schema` key, no
sentence ids), so `claims-check` refuses them too (`negative-dK.check.json`
records the error). The negative's verdict here rests on reading the
transcripts and maps, not on the check.

These readings were made by the session that ran the skill, not by a person.

## Follow-up

- Re-run the negative with an allowlist that permits the skill's compound
  commands, so the coverage check is produced rather than read.
- Ship the fixture ledger with its `claims-ledger/1` header, or say in
  `skill-harness.md` that the skill must wrap it — the positive draws spent
  steps working around it.
- Maps written by the negative draws were not schema-valid; `SKILL.md` names
  the map but not its schema.
