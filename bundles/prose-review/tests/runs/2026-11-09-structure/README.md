# 2026-11-09 — prose-structure-critic, first run, k=3

Sixty-three verbatim critic reports: the 21 fixtures in
[`../../fixtures/structure/`](../../fixtures/structure/) (nine synthetic drafts,
twelve leave-one-out essays) × 3 draws. The protocol is the third one in
[`../../critic-harness.md`](../../critic-harness.md).

| | |
|---|---|
| date | 2026-11-09 |
| dispatch route | CLI — `run-harness.mjs dispatch <run> --only <case>`, one process per case, seven cases at a time from a session driver; each draw is its own `claude -p` process (Claude Code 2.1.319) with the stock allowlist (Read inside the case's `inputs/` and the agent prompt; Bash, Grep, Glob, Task, Edit, Write, web all denied) |
| serving model | `claude-opus-5-5`, as reported by the CLI's own `modelUsage` on a probe call from the same environment the same day; the transcripts themselves do not carry a model id |
| agent prompt | `primitives/agents/prose-structure-critic/agent.md`, sha256 `d8131ee9df0357cb4199ede647e224a53872d39576e0f774cf3cbfd15c43b5be` (MANIFEST) |
| draws | 3 per case, each a fresh process |
| re-sent failures | none. Case 01 was dispatched once as a CLI probe before the sweep; those three transcripts were deleted and case 01 re-dispatched with the rest, so every transcript here comes from the sweep |

Re-derive every figure:

```bash
node tests/run-harness.mjs check runs/2026-11-09-structure
node tests/verify-run.mjs        runs/2026-11-09-structure
```

## verify-run output

Quoted whole from [`verify-run.txt`](verify-run.txt):

```
    negative (sound structure, n=17):     0 REVISE, 17 CLEAN
    positive (planted gap, n=4):         4 REVISE, 0 CLEAN
    cases whose k=3 draws did not all agree:  0 of 21   (a split is a finding)
    findings without a quoted span and a scan/outline reference: 0   <- must be 0
    any claim about machine authorship: 0        <- must be 0

    verdicts matching the expected verdict:                    21 of 21
    counts the scan flagged and the critic cleared:            15
    gaps the scan could not see and the critic caught:         2
    verdicts identical to the echo rule's (echo rate):         4 of 21
```

**Against the stated default.** The twelve leave-one-out essays are 12 of the
17 negatives; all 36 of their draws returned `CLEAN`, so the leave-one-out
negative is **0 `REVISE` of 12**, inside the "≤ 2 `REVISE` of 12" default
(`docs/roadmap/B-prose-structure-critic.md`). That default is still a default:
one run on one model does not derive a threshold. The other five negatives are
the synthetic class A/B fixtures (a flat technical piece, a marked post, scene
breaks, a second-reason essay, a listicle), also `CLEAN` on every draw.

**What the echo block says.** The echo rule flags every leave-one-out essay
(human essays have unmarked boundaries) and the three class-B fixtures; the
critic cleared all fifteen. It caught both class-D gaps the counts cannot see
(`p-essay-unsupported`, `p-post-reordered`). 4 of 21 verdicts match the
parrot: the two class-C fixtures and the two class-A fixtures.

**What it does not say.** The positives are four synthetic fixtures this repo
wrote; 12 of 12 positive draws returned `REVISE`, which shows the critic finds
gaps that were planted for it, not that it finds the gaps that matter in
someone's draft.

## The two contract counts

Made by the session that ran the sweep, not by a person:

- **`uncited`** — every finding in the twelve positive transcripts (19 findings)
  was read in full: each quotes a span with a line number and names the scan
  field or outline node it rests on. Mode was checked on all 63: the four
  intended-outline cases (essay-orphan-claim, essay-unsupported,
  post-reordered, essay-second-reason) open in intended-outline mode, the other
  seventeen in draft-only mode, so no transcript is in the wrong mode. **0.**
- **`authorship_claims`** — the twelve positive transcripts were read in full.
  The 51 negative transcripts carry no findings; each was checked by its mode
  line and a search for wording about who or what wrote the draft
  (`wrote|writer|author|human|person|model|generat|machine|written|AI`). Every
  hit referred to the draft's own content ("the 'AI is changing everything'
  claim", "a plan written in a document") or to the scan, not to its
  authorship. **0.**

## Scanner defects the critics filed

Recorded here rather than fixed, because they are `outline-scan`'s
(`prose-outline`) and this session's scope is the run:

- a line made only of dots (`.....`, Chesterton's scene breaks) is counted as a
  zero-word paragraph, doubling the unmarked boundaries around it;
- `claim_markers.citation` fires on quotation marks, dialogue and proper nouns
  where nothing is cited;
- an ordinal opener that is not the first word ("There is a second reason") is
  not treated as an enumerative marker.

## A harness defect this run found

`verify-run.mjs`'s structure block resolved the repository root four
directories above the run instead of five, so it crashed (`ENOENT …
bundles/bundles/prose-tell-scan/…`) on the first leave-one-out case. No
structure run had existed to reach it. Fixed in the same commit; the fix
changes no count, only where the leave-one-out draft is read from.
