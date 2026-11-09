# 2026-11-09 — prose-reader-critic, all four personas, first run, k=3

One hundred and forty-four verbatim critic reports: the four shipped personas
(`acquisitions-editor`, `adversarial-reader`, `first-time-reader`,
`skeptical-cto`) × the twelve leave-one-out argumentative essays the structure
fixtures name (Bacon, Chesterton, Doctorow) × 3 draws. Every case is a
negative: no material exists where "this reader would stop here" is known by
construction, so there are no positives (roadmap G §8).

| | |
|---|---|
| date | 2026-11-09 |
| dispatch route | CLI — `run-harness.mjs dispatch <run> --only <case>`, one process per case, six at a time from a session driver; each draw its own `claude -p` process (Claude Code 2.1.319) with the stock allowlist |
| serving model | `claude-opus-5-5`, as reported by the CLI's own `modelUsage` on a probe call from the same environment the same day; the transcripts themselves do not carry a model id |
| agent prompt | `primitives/agents/prose-reader-critic/agent.md`, sha256 `b903080f9e4c36182bff562059a349d01b57e0fb279fdafc8673936b44ec0acc` (MANIFEST); the persona is staged raw beside a frontmatter-stripped draft |
| draws | 3 per case |
| re-sent failures | none |

```bash
node tests/run-harness.mjs check runs/2026-11-09-reader
node tests/verify-run.mjs        runs/2026-11-09-reader
```

## verify-run output

Whole run, quoted from [`verify-run.txt`](verify-run.txt):

```
    negative (reader finishes, n=48):    16 REVISE, 32 CLEAN
    positive (reader stops, n=0):       0 REVISE, 0 CLEAN
    cases whose k=3 draws did not all agree:  6 of 48   (a split is a finding)
    stops without a quoted sentence: 0          <- must be 0
    any claim about machine authorship: 0        <- must be 0
    transcripts without a FORCED CHOICE: 0       <- must be 0
```

Per persona, quoted from [`verify-run-by-persona.txt`](verify-run-by-persona.txt)
(the same tool over each persona's 36 transcripts):

```
== acquisitions-editor
    negative (reader finishes, n=12):    3 REVISE, 9 CLEAN
    cases whose k=3 draws did not all agree:  0 of 12   (a split is a finding)
== adversarial-reader
    negative (reader finishes, n=12):    9 REVISE, 3 CLEAN
    cases whose k=3 draws did not all agree:  1 of 12   (a split is a finding)
== first-time-reader
    negative (reader finishes, n=12):    3 REVISE, 9 CLEAN
    cases whose k=3 draws did not all agree:  3 of 12   (a split is a finding)
== skeptical-cto
    negative (reader finishes, n=12):    1 REVISE, 11 CLEAN
    cases whose k=3 draws did not all agree:  2 of 12   (a split is a finding)
```

## Against the stated default

The default is `critic-harness.md`'s leave-one-out bands, which roadmap G says
the reader critic reports against: 0–2 `REVISE` of 12 acceptable, 3–5 "too
eager", 6+ "broken". They are guesses, labelled as such. Measured once, on
majority verdicts:

| persona | REVISE of 12 | band |
|---|---|---|
| `skeptical-cto` | 1 | within the default |
| `acquisitions-editor` | 3 | **exceeds the default** (3–5) |
| `first-time-reader` | 3 | **exceeds the default** (3–5) |
| `adversarial-reader` | 9 | **exceeds the default** (6+) |

Read what the stops are before reading those as a verdict on the personas:

- **`adversarial-reader`** stops on argumentative moves an adversary would
  attack: Bacon's battle examples carried to "the principal point of greatness
  in any state", "certain it is" over counsel, a myth read as proof;
  Chesterton's argument conceded by the opponent; Doctorow's anonymised
  anecdotes generalised to "corporate AI". These essays argue, and the persona
  exists to find the weakest link. A 0–2 band calibrated for a voice critic on
  encyclopedia articles may simply be the wrong bound for this persona on
  polemic; that is a question about the default, not something this run
  settles.
- **`first-time-reader`** stops almost entirely on untranslated Latin in Bacon
  ("multis utile bellum", "participes curarum") — a real obstacle for that
  reader, and a property of the corpus's era.
- **`acquisitions-editor`** stops where a piece changes subject (two Doctorow
  posts, one Chesterton).
- **`skeptical-cto`** stops once, on an unsourced scale claim in a Doctorow post.

**Follow-up, not done in this session:** no persona or agent prompt was edited.
Whether to tighten the personas, or to set per-persona defaults, is the next
session's call, and either change invalidates these numbers.

## The three contract counts

Made by the session that ran the sweep, not by a person.

`tools/persona-check.mjs transcript` was run over all 144 as a first pass. It
flagged 30 transcripts; each was then read. Every flag was a format miss in the
checker rather than a contract breach, so the counts below differ from what the
checker alone would give:

- **`missing_forced_choice`** — the checker flagged 16 transcripts. All 16 carry
  a forced choice with a quoted sentence and a line number, written as
  `FORCED CHOICE:` without bold markers, which the checker's regex requires.
  **0.**
- **`uncited`** — the checker flagged 14 transcripts (22 stops). Every flagged
  stop gives a line range (`lines 58–61`) and a quotation; the checker matches
  `line N` but not `lines N–M`. The other 114 transcripts pass the checker's
  line-and-quote test. **0.**
- **`authorship_claims`** — a search over all 144 for wording about who or what
  wrote a piece (`wrote|written|writer|author|human|generat|machine|model|AI|LLM`)
  returned only references to the essays' content (Doctorow's posts are about
  AI) or to "the author" as the essay's writer. None states or implies how a
  piece was produced. The checker agrees. **0.**

Both checker misses are recorded here for `persona-check.mjs`; it was not
changed in this session.
