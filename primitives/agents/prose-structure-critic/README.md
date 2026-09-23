# prose-structure-critic

Read-only critic that answers one question: **does this draft's structure carry
its argument?** Judged against `outline-scan`'s counts and, when one exists, the
outline the writer intended.

Output contract: `CLEAN` / `REVISE`. Bundle: `prose-review`.

Not whether it sounds like the author (`prose-voice-critic`). Not whether a
revision kept what it had to (`prose-fidelity-critic`). Not where a particular
reader stops (`prose-reader-critic`). Not whether the claims are true.

## Why this exists

A draft can be checked against many things, but not, until `prose-outline`
landed, against what it was *meant to argue*. The losses that survive review
are structural and quiet: a claim the outline meant to support arrives as a
flat assertion; the section that establishes a premise lands after the section
that needs it; two ideas sit side by side with no sentence carrying the reader
between them; the load-bearing section is the shortest. None of these looks
wrong at the sentence level, and a writer who has just written the piece cannot
see them, because they know what they meant.

## Why a separate agent

**It must not be the session that wrote the draft or the outline.** A critic
that proposed the outline reads its own intent into the prose. This is the
bundle's context-isolation rule applied to intent rather than to voice.

**It splits with a script, not within itself.**
[`outline-scan.mjs`](../../../bundles/prose-outline/skills/prose-outline/tools/outline-scan.mjs)
counts headings, section lengths, ratios, topic-sentence candidates, claim
markers and unmarked boundaries. The critic decides what the counts cost. A
model asked whether a section is short answers from impression; the scan
answers from words, so the critic is forbidden to re-count and files disputes
under *Scanner defects*.

## What it does

| # | Looks for | The rule |
|---|---|---|
| 1 | Unsupported claims | *Intended-outline mode only.* A claim with an empty slot stated as settled, or a topic sentence nothing following supports. Cite the node id and the line. |
| 2 | Order | *Intended-outline mode only.* A section that depends on one the outline places first but the draft places after. Cite both locations. |
| 3 | Missing transitions | An unmarked boundary where the topic changes and nothing carries the reader across. A deliberate cut is not a finding. |
| 4 | Imbalance | Only where the ratio is extreme *and* the short section carries a load-bearing claim. A flat reference doc is correctly flat. |

Every finding carries a `PLAN-ENTRY` in
[PLAN-FORMAT](../../../bundles/prose-review/PLAN-FORMAT.md) shape so the
consolidating session can paste it into `plan.json`. The entry says what to
do, never how the new text should read.

## Two modes, two error preferences

Whether a claim is supported or a section out of order has a referent only
when the writer supplied an outline. With one, a wrong finding costs a glance
at the outline and a missed one ships: uncertainty resolves to `REVISE`, as it
does for the fidelity critic. Without one, "your argument is out of order" on
the critic's own authority teaches a writer to write to a template: classes 1
and 2 are not assessed, and uncertainty resolves to silence, as it does for the
voice critic. The prompt states the mode in its first line. Both rules are
recorded in `meta.yaml`, because a prompt holding two tie-breaks looks like a
mistake to anyone tidying it.

## When to run it

In the parallel critic fan-out (`PROTOCOL.md` step 2), after `outline-scan` has
run, on drafts that are arguments. Skip notes, replies and reference material,
and say so. Hand it the scan JSON, the draft, and the intended outline if there
is one; it degrades to draft-only mode without the outline and says so.

## Reading the output

`REVISE` says the structure has a gap the critic can point at, not that the
piece is bad. Findings quote a span and name the scan field or outline node
they rest on; one that does not is a guess and the prompt drops it. The list of
clean classes is not filler: in draft-only mode it is where the critic says
what it could not assess.

## Known limits

**Order has no ground truth without an outline**, and the draft-only mode is
the honest answer to that: it stays quiet where it cannot point at an intent.

**The leave-one-out negative measures register, not argument.** The human
essays it is run over were not written from outlines, so the negative test
bounds false positives on structure that human writers found acceptable; it
does not show the critic finds the right gaps.

**Imbalance is a ratio the scan reports; the critic must not treat it as a
judgement.** The fixture set contains a flat reference document precisely so a
critic that flags flatness fails.

**Its findings are model judgements about consequence.** The counts are
reproducible; the reading of them is not, and single-draw numbers are
observations, not rates.

## Install

```bash
./install.sh prose-structure-critic       # → ~/.claude/agents/
```

Or install the whole bundle: `/plugin install prose-review@vonnegut`. It needs
`prose-outline` installed for the scan; without it the protocol says structure
was not reviewed.
