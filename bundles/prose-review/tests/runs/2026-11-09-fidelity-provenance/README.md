# 2026-11-09 — prose-fidelity-critic with the provenance block, k=3

Forty-eight verbatim critic reports: all 16 fixtures in
[`../../fixtures/fidelity/`](../../fixtures/fidelity/) × 3 draws. Three of them
(`n-anger-scripture-exact`, `p-anger-scripture-misquoted`,
`p-anger-seneca-misquoted`) carry a `provenance/` directory, so their prompts
include `provenance-scan`'s output beside `fidelity-scan`'s; the other thirteen
are the long-standing fixtures with no provenance block. This is the first run
against the prompt that reads the block (prose-review 0.5.0).

| | |
|---|---|
| date | 2026-11-09 |
| dispatch route | CLI — `run-harness.mjs dispatch <run> --only <case>`, one process per case, seven at a time from a session driver; each draw its own `claude -p` process (Claude Code 2.1.319) with the stock allowlist |
| serving model | `claude-opus-5-5`, as reported by the CLI's own `modelUsage` on a probe call from the same environment the same day; the transcripts themselves do not carry a model id |
| agent prompt | `primitives/agents/prose-fidelity-critic/agent.md`, sha256 `14fd00538976dddd8a7da167e0091b688f615135d41bf35221b575c7f2468ca8` (MANIFEST) |
| draws | 3 per case |
| re-sent failures | none |

```bash
node tests/run-harness.mjs check runs/2026-11-09-fidelity-provenance
node tests/verify-run.mjs        runs/2026-11-09-fidelity-provenance
```

## verify-run output

Quoted whole from [`verify-run.txt`](verify-run.txt):

```
    negative (faithful revisions, n=7):     2 MATERIAL-LOSS, 5 FAITHFUL
    positive (lossy revisions, n=9):        9 MATERIAL-LOSS, 0 FAITHFUL
    cases whose k=3 draws did not all agree:  1 of 16   (a split is a finding)
    findings not quoting both original and revision: 0   <- must be 0
    claims an atom is present that the scan flagged: 0   <- must be 0

    verdicts matching the fixture's expected verdict:  14 of 16
    losses the scan flagged and the critic cleared:    1
    losses the scan missed and the critic caught:      6
    verdicts identical to fidelity-scan's (echo rate): 9 of 16
```

## The provenance block, which is what this run was owed for

- `n-anger-scripture-exact` (block reports the quote `exact`): `FAITHFUL` on 3 of
  3 draws. The block raised no false positive.
- `p-anger-scripture-misquoted` and `p-anger-seneca-misquoted` (block reports
  `drifted`): `MATERIAL-LOSS` on 3 of 3 draws each, every finding quoting the
  ledgered source's wording beside the revision's. All six draws also noted
  that the original carries the same drift, so the revision passed it through
  rather than introducing it — the verdict is about the quote against its
  source, which is what the block asks.

RELEASE-v0.5.0 says the narrow extension is revisited "if that run shows the
block raising false positives on the existing fixtures". It did not: the one
provenance negative is quiet, and the thirteen older fixtures carry no block, so
the block cannot have caused their verdicts.

## The two negatives that read MATERIAL-LOSS

Neither carries a provenance block, and the S4 run's draws flagged both on 3 of
3 as well:

- `n-beauty-modernised` (class A), 3 of 3 draws: "virtue is best" → "virtue
  shows best" read as claim drift.
- `n-rossolimo-island-dropped` (class B — the scan flags "Island of Sahalin" and
  the fixture expects the critic to clear it), 3 of 3 draws: the critic agreed
  with the scan that the reader loses that Sahalin is an island. The fixture's
  note argues the opposite (Sahalin is still named, and Chekhov's own Tihonov
  letter writes "a journey to Sahalin"). This is a borderline resolved by the
  prompt's tie-break rule, the shape `critic-harness.md` warns a class-B fixture
  must avoid; it is reported, not corrected.

The split case is `n-tihonov-reordered`: one draw of three flagged "I only
remember" → "What I do remember" as a dropped qualification; the majority is
`FAITHFUL`.

No release note states a numeric false-positive default for this critic, so
there is no threshold to have met or missed. **Do not diff these numbers against
the S4 run's** (k=1, a different dispatcher and model, three fewer fixtures);
`critic-harness.md` says why.

## The two contract counts

Made by the session that ran the sweep, not by a person:

- **`uncited`** — every finding in all 27 positive transcripts and the 7
  negative transcripts that carry one was read: each gives an ORIGINAL and a
  REVISION span with line numbers and quoted text (or says the revision has no
  counterpart and names where it would sit). **0.**
- **`contradicts_scan`** — every *Scanner defects* section was read. None
  asserts that an atom the scan flagged is present. The disputes that do appear
  run the other way and are filed as tool notes: three draws report that the
  scan missed the two-word quote "Nunc dimittis" (and raise its loss as a
  finding, which is a class-D catch, not a contradiction); one notes the scan
  counts "1892" present because the dateline still carries it. **0.**

One format note: `p-anger-seneca-misquoted-d3` headed its single finding
`**dropped-fact**` instead of `**CLASS**: dropped-fact`, so its wrapper reads
`findings=0` on a `MATERIAL-LOSS` transcript. The verdict and both contract
counts are unaffected; the findings count is derived from the marker, and the
marker is missing.
