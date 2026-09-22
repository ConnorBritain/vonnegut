# prose-continuity-critic

Read-only critic that answers one question: **does this project contradict
itself?** Judged from `index-diff`'s candidates — a term defined two ways, an
attribute that drifted, a date that moved, an anecdote retold — and the
project's bible, citing two locations for every finding or saying nothing.

Output contract: `CLEAN` / `REVISE`. Bundle: `prose-bible`.

Not whether a claim is true (`prose-research`, roadmap item E). Not whether
one revision kept its facts (`prose-fidelity-critic`). Not voice, structure or
quality.

## Why this exists

A continuity error is the loss that survives every other review. Each chapter
is fine on its own; the eyes that were grey in chapter two are green in
chapter nine, the flood happened in 1898 and then in 1889, and the anecdote
about the bees is told twice as if for the first time. The writer cannot see
it because they know what they meant. A critic reading one file cannot see it
because it is not in the file.

## Why a separate agent

**Because the index can only raise candidates.** `entity-index.mjs` finds
every name, definition, attribute, date and repeated passage with the line it
sits on, and `index-diff.mjs` pairs the ones that differ. That is the countable
half, and it is done by scripts. Whether "grey" then "green" is a contradiction,
a flashback, a different Mara or a lie a character tells is the critic's
question, and it is answered in a clean context — a critic that wrote chapter
two remembers why the eyes changed.

**It may cite nothing the index did not supply.** A finding names the two
locations from the candidate it came from; a third location from memory is an
invented contradiction, and an invented contradiction is worse than a missed
one. Disputes with the tool go under *Index gaps*, as a note about the tool.

## What it does

| # | Looks for | The rule |
|---|---|---|
| 1 | A definition that changed | Both readings cannot hold of one thing. "The ledger" and "the Book of Hours" for one object can. |
| 2 | An attribute that drifted | Grey then green, with nothing between that explains it. A bible attribute the text contradicts counts. |
| 3 | A date or number that moved | 1898 then 1889 under the same context word. |
| 4 | An anecdote retold | Only when both tellings read as new information. A refrain is not a finding. |

## The error preference

Uncertainty resolves to **silence**, for the voice critic's reason: no ground
truth. A wrong "you contradicted yourself" sends the writer through their own
book for a mistake that is not there and teaches them to flatten every
deliberate variation. The critic ships on the negative test — quiet over a
consistent project — and the planted-drift fixtures are its only positive
claim. The README does not say more than that.

## When to run it

After `entity-index` and `index-diff` have run over the project (the skill's
protocol does this), in a clean context, with the diff JSON and the bible if
one exists. Without an index it has nothing to read and says so.

## Reading the output

`REVISE` says two places cannot both be true of the story the project tells,
not that the writing is bad. Every finding quotes both locations; the writer
decides which telling is true, and the critic proposes no fix.

The harness, the echo rule and the four-class fixture table are in
`bundles/prose-bible/tests/critic-harness.md`.

## Known limits

**It inherits the index's blind spots.** Pronouns are never resolved, so
"her eyes were green" attaches to nobody; attributes are two surface patterns
over a fixed noun list; definitions are three patterns and can misattribute a
clause ("the Harrow road was the first building she had ever loved" reads as a
definition of the road); a contradiction stated entirely in paraphrase with no
shared term is not a candidate at all. The index says each of these in its
`limits`, and the critic's *Index gaps* section is where it reports what it
saw the index miss.

**It has no ground truth.** The planted-drift fixtures are synthetic; nobody's
real book has been through it, and the leave-one-out negative is a small
consistent project, not a novel.

**Its verdicts are model judgements and single draws are observations, not
rates.**

## Install

```bash
./install.sh prose-continuity-critic      # → ~/.claude/agents/
```

Or install the whole bundle: `/plugin install prose-bible@vonnegut`.
