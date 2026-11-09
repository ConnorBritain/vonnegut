# 2026-11-09 — prose-continuity-critic, first run, k=3

Twenty-one verbatim critic reports: the seven fixtures in
[`../../fixtures/continuity/`](../../fixtures/continuity/) × 3 draws. The protocol
is [`../../critic-harness.md`](../../critic-harness.md).

| | |
|---|---|
| date | 2026-11-09 |
| dispatch route | CLI. `continuity-harness.mjs` has no `dispatch` subcommand, so a session driver ran, per (case, draw), the same `claude -p` invocation prose-review's `run-harness.mjs dispatch` uses: `--system-prompt-file prompts/agent-prompt.md`, the case prompt on stdin, `--add-dir inputs/<case>`, Read allowed only inside that directory and on the agent prompt, Bash/Grep/Glob/Task/Edit/Write/web denied. One fresh process per (case, draw); no process saw a second case or draw, the MANIFEST, or a fixture name. Replies saved verbatim to `raw/<fixture>-dK.md` (Claude Code 2.1.319) |
| serving model | `claude-opus-5-5`, as reported by the CLI's own `modelUsage` on a probe call from the same environment the same day; the transcripts themselves do not carry a model id |
| agent prompt | `primitives/agents/prose-continuity-critic/agent.md`, sha256 `be86f1d878edd5477aa9cb09a9b2b810e254511f60476121fe5853366f9777cf` (MANIFEST) |
| draws | 3 per case |
| re-sent failures | none |

Re-derive every wrapper and the tally:

```bash
node tests/continuity-harness.mjs check   runs/2026-11-09-continuity
node tests/continuity-harness.mjs collect runs/2026-11-09-continuity
```

## collect output

The bible harness has no `verify-run.mjs`; `collect` prints the tally. Quoted from
[`collect.txt`](collect.txt):

```
    n-alias-definitions      negative critic 3/3 CLEAN   parrot says REVISE
    n-refrain                negative critic 3/3 CLEAN   parrot says REVISE
    n-restated-rule          negative critic 3/3 CLEAN   parrot says REVISE
    n-separate-topics        negative critic 3/3 CLEAN   parrot says CLEAN
    n-two-notes              negative critic 3/3 CLEAN   parrot says CLEAN
    p-bible-conflict         positive critic 3/3 REVISE   parrot says REVISE
    p-drift-project          positive critic 3/3 REVISE   parrot says REVISE

    critic  — negatives quiet 15/15, positives caught 6/6
    parrot  — negatives quiet 6/15, positives caught 6/6   (flagged when index-diff reports any candidate: redefined, attribute_drift, date_drift, repeated or bible_conflicts)
    contract — uncited=0, third_location=0   (operator counts, carried through, not derived)
```

Negatives 0 `REVISE` of 5 fixtures (15 of 15 draws quiet); positives 2 of 2
(6 of 6 draws). No release note states a numeric default for this critic; the
harness names class B as the negative that matters, and the critic cleared all
three class-B over-flags (a refrain, a restated rule, two true definitions) on
every draw, where the parrot flags all three. As a verdict-level echo rate:
4 of 7 fixtures' majority verdicts equal the parrot's (both class A, both class
C). There are no class-D fixtures, by construction.

## The two contract counts

Made by the session that ran the sweep, not by a person. All 21 transcripts were
read in full.

- **`uncited`** — the six positive transcripts carry one finding each, the
  attribute contradiction; every one quotes both locations (`chapter-01.md:3` /
  `chapter-02.md:3` for Mara; bible entry `b1` / `chapter-05.md:3` for Dorota).
  The fifteen negatives carry no finding. **0.**
- **`third_location`** — every `file:line` a finding cites was checked against
  the locations present in that case's staged `diff.json` (case-01:
  `chapter-05.md:3`; case-02: `chapter-01.md:3`, `chapter-01.md:7`,
  `chapter-02.md:3`, `chapter-02.md:5`, `chapter-02.md:7`, `notes.md:5`). None
  cites anything else. **0.**

## Index gaps the critics filed

Reported under *Index gaps*, never as findings, which is the behaviour the
contract protects. Recorded here for `entity-index` / `index-diff`, not fixed:

- in the drift project, the `redefined` candidates at `notes.md:5` and the
  `date_drift` candidate at `chapter-02.md:5` carry a sentence that does not
  contain the extracted value (the offsets look out of step), so all three draws
  set them aside as uncheckable;
- the `is-a` pattern attaches "first building she had ever loved" (the mill) to
  "Harrow road" — a limit the critic's README already names;
- a bible-sourced drift candidate arrives with `bible_conflicts` empty (one
  draw);
- a repeat embedded inside a longer sentence is shown only as context, not as a
  repeat location (two draws).
