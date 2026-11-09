# 2026-11-09 — prose-medium-critic, first run, k=3

Thirty-six verbatim critic reports: the 12 cases in
[`../../fixtures/medium/`](../../fixtures/medium/) (six synthetic thread and
LinkedIn-post fixtures, six leave-one-out Pluralistic posts staged as
newsletters) × 3 draws.

| | |
|---|---|
| date | 2026-11-09 |
| dispatch route | CLI — `run-harness.mjs dispatch <run> --only <case>`, one process per case, seven at a time from a session driver; each draw its own `claude -p` process (Claude Code 2.1.319) with the stock allowlist |
| serving model | `claude-opus-5-5`, as reported by the CLI's own `modelUsage` on a probe call from the same environment the same day; the transcripts themselves do not carry a model id |
| agent prompt | `primitives/agents/prose-medium-critic/agent.md`, sha256 `c2720ccc976e61b492dfa6738bd8226a3db66b30067a392aa3601234ff1d5661` (MANIFEST) |
| draws | 3 per case |
| re-sent failures | none |

```bash
node tests/run-harness.mjs check runs/2026-11-09-medium
node tests/verify-run.mjs        runs/2026-11-09-medium
```

## verify-run output

Quoted whole from [`verify-run.txt`](verify-run.txt), produced after the
`verify-run.mjs` fix described below:

```
    negative (survives delivery, n=9):   8 REVISE, 1 CLEAN
    positive (breaks in the medium, n=3): 3 REVISE, 0 CLEAN
    cases whose k=3 draws did not all agree:  1 of 12   (a split is a finding)
    findings without a quoted span: 0             <- must be 0
    any claim about machine authorship: 0        <- must be 0
        counts the check failed and the critic cleared:           0
        delivery problems the check could not see and the critic caught: 3
        verdicts identical to the echo rule's (echo rate):         9 of 12
```

## The negative test failed, and that is the result

The critic's README says it "ships on the negative test — quiet on compliant
human posts". **It was quiet on 1 of 9 negatives.** No release note states a
numeric default for this critic, but by the measure its own README names, the
negative test is not met. Per case (check = the echo rule over
`repurpose-check`):

| case | check | critic draws |
|---|---|---|
| `n-post-hook-carries` (A) | quiet | CLEAN, CLEAN, CLEAN |
| `n-thread-clean` (A) | quiet | REVISE ×3 |
| `n-thread-long-but-whole` (B) | fails `segment-limit` | REVISE ×3 |
| six `n-loo-*` newsletters | each fails `length-band` | REVISE ×3 on five; `go-meta-meta` REVISE, CLEAN, REVISE |
| `p-thread-long-and-cut` (C) | fails `segment-limit` | REVISE ×3 |
| `p-thread-cut-sentence` (D) | quiet | REVISE ×3 |
| `p-post-hook-buried` (D) | quiet | REVISE ×3 |

What the findings are, read from the transcripts:

- **The two thread negatives**: every draw flags the same segment, "The first
  three are bad and you throw them away", under `each-segment-stands` — three
  of what is named nowhere in the thread. That reads as a real defect in the
  synthetic fixture text (it also appears in `p-thread-long-and-cut`, where one
  draw flags it too). The fixture is reported, not corrected, for the reason
  `critic-harness.md` gives about corrections after a run.
- **The six newsletters**: each draw raises `hook-present` (the post opens on
  "Today's links" and a contents list; the essay starts at line 21) and most
  raise `one-close` (the essay ends, then a hundred-plus lines of link lists end
  on a colophon fragment). Several add `delivery_notes` findings: "(permalink)"
  as dead text, an empty "Today's top sources:" label, and flag emoji stripped
  from the text that the post then refers to. **And every one of the six fails
  the mechanical `length-band` check**, so these are not compliant posts by the
  harness's own tool. The critic did not restate the length failure — its
  findings are semantic and delivery constraints, as the prompt requires — but
  the premise that the leave-one-out posts are a clean negative does not hold
  for the newsletter profile.

**Follow-up, done afterwards (fixtures only):** the leave-one-out set is now
the essay extracted from each issue (`fixtures/medium/loo/`), and the thread
segments are rewritten to stand alone; each corrected fixture carries
`corrected_after_run: "2026-11-09-medium"`, which `verify-run.mjs` prints for
this run. This run's own inputs, under `inputs/`, are unchanged and it is still
scored on them. A repeat on the corrected fixtures is owed.

**As this run left it:** no agent prompt was edited. Whether
the fix is in the fixtures (a leave-one-out set that passes the mechanical
check, and thread text whose segments stand alone) or in the prompt is a
decision for the next session, and either way the run has to be repeated.

## The two contract counts

Made by the session that ran the sweep, not by a person. All 36 transcripts were
read in full.

- **`uncited`** — every finding names a location (line or segment) and quotes
  the span it is about. **0.**
- **`authorship_claims`** — no transcript says anything about who or what wrote
  a piece. **0.**

Format notes: `n-loo-2026-08-04-technology-freedom-cooperative-d2` heads its
second finding `**CONSTRAINT-UNMET**:` instead of `**CLASS**:`, so its wrapper
reads `findings=3` for four findings; `n-loo-2026-07-13-go-meta-meta-d2` and
`n-post-hook-carries-d3` are the single word `CLEAN`, which the contract allows
but which says nothing about what was checked. One draw filed a check defect:
`repurpose-check`'s `mechanical` array carries the semantic constraints
`hook-present` and `one-close`.

## A harness defect this run found

`verify-run.mjs`'s medium block compared verdicts to `critic.flag` and
`critic.clean` where `critic` is the profile's name, a string, so both lines it
derives from them were always 0; it also counted draws (`26 of 36`) where the
structure and fidelity blocks count case majorities. Fixed in the same commit:
the cleared/caught lines now compute, and the echo rate is by case (`9 of 12`).
No transcript or contract count changed.
