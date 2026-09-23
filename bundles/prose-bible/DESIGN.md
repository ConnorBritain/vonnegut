# prose-bible — design

**Status: v0.1.0.** The planning record is
[`docs/roadmap/C-prose-bible.md`](../../docs/roadmap/C-prose-bible.md).

## The split

`entity-index.mjs` finds every candidate the way a script can: capitalised
runs and single names seen at least twice across the project, defined terms by
three surface patterns, dates and numbers, passages that repeat, each with its
file, line and offset. `index-diff.mjs` turns the index into candidates — the
same key with two definitions, an attribute stated two ways, a passage retold.
`prose-continuity-critic` decides, in a clean context, which candidates are
contradictions, and it may cite only what the index supplied.

The index is derived and never stored. A stored index reports a contradiction
the writer fixed an hour ago, and nothing in its output says so.

## Uncertainty resolves to silence

A contradiction has no ground truth the way a dropped date does: a flashback,
a nickname, a character who lies, a term the writer redefined on purpose all
look like contradictions to a diff. A wrong finding sends the writer through
their own book looking for a mistake that is not there, and it teaches them to
flatten anything that varies. So the critic stays quiet when it cannot tell,
and it ships on the negative test — quiet over a consistent project — with the
planted-drift positives as the only positive claim.

## Two locations or nothing

Every finding quotes two places, both from the index. The rule is the whole
mechanism: a critic that can name one place and infer the other is a critic
that can invent the second, and an invented contradiction is worse than a
missed one.

## Shared code, pinned

`lib/text-index.mjs`, `lib/registry-reader.mjs` and `lib/revision-store.mjs`
are byte-identical copies of `prose-outline`'s. The packaging check pins the
pairs the way it pins prompt bodies; a mutation that breaks one copy exists to
prove the pin fires.

## What would make this a bad bundle

- The index is cached and read back stale.
- A finding cites one location and the critic's memory of another.
- The critic starts judging whether a redefinition was a good idea.
- A bible entry is saved because the index suggested it.
- A `lib/` copy drifts and the check does not notice.

## The critic's harness is bundle-local

`tests/continuity-harness.mjs` stages, collects and checks runs of the
continuity critic with the same discipline and the same wrapper grammar as
prose-review's `run-harness.mjs`, but it is its own file. A `CRITICS.continuity`
entry in prose-review's harness was the alternative, and it was rejected for
direction: a consumer may import the producer it reads at test time (the
structure critic's harness imports `outline-scan`), but a producer's tests must
not know its consumers, and prose-review does not read anything of ours. It
would also have left this bundle with a critic it could not exercise when
installed alone. The cost is a second copy of the wrapper grammar; a transcript
from either harness reads identically, and both `check` commands re-derive the
same fields.

The echo rule for this critic is the loudest one possible — any candidate at
all is a contradiction — because that is what index-diff would say if it were
allowed a verdict. Class D (diff quiet, critic flags) is empty by construction:
the critic receives no text beyond the candidates and may cite nothing the
index did not supply, so an empty diff leaves it nothing to cite. The fixture
manifest says so, so the absence reads as a decision.
