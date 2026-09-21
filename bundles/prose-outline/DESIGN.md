# prose-outline — design

**Status: v0.1.0.** The planning record is
[`docs/roadmap/A-prose-outline.md`](../../docs/roadmap/A-prose-outline.md).

## The split

Everything countable about a draft's structure is counted by
`outline-scan.mjs`: heading tree, section words and their ratio to the median,
two topic-sentence *candidates* per paragraph, claim-marker counts by word
class, transition markers at paragraph boundaries. Everything that needs a
judgement — does this order carry the argument, does this short section matter
— belongs to `prose-structure-critic` in `prose-review`, which reads the scan
and never re-counts.

Two topic-sentence candidates rather than one is deliberate. The first sentence
is the positional guess; the sentence with the highest overlap with the section
heading is the lexical guess. Picking one would be a judgement the script
cannot defend, so both are reported and labelled heuristic in `limits`.

## One store shape, one diff

Argument mode and beat-sheet mode are a node vocabulary (`claim`,
`evidence-slot`, `open-question` versus `act`, `beat`, `turn`), not two
schemas. One store, one differ, one set of guards.

Node ids are stable across revisions and the differ keys on them. Matching by
text would let a rewording look like a move and a move look like a deletion,
and a differ that guesses a mapping is a differ whose output cannot be checked.

## Where outlines live, and why not in the registry file

Per [`docs/registry-stores.md`](../../docs/registry-stores.md):
`<registry>/projects/<identity>/<project>/outlines/`, with the preference
store's revision shape. The registry file itself is not extended, because the
installed `voice-identity-registry/1` reader rejects unknown fields and unknown
schema strings — a 0.6.0 runtime would refuse a registry a newer one wrote.
This bundle reads the registry through its own fifteen-line reader, pinned to
prose-author's by a parity fixture, because a static import across bundles is
not allowed.

## The shared core

`lib/text-index.mjs` is canonical here and copied byte-for-byte into
`prose-bible`. The packaging check pins the pair the way it pins prompt bodies:
drift is impossible rather than merely detected. It is also the repo's fourth
segmenter, so a cross-implementation fixture asserts its line numbers agree
with `fidelity-scan.mjs` and `visible-prose.mjs` on shared text — critics must
never receive locations from tools that disagree.

## What would make this a bad bundle

- The scan grows a "score" or a verdict.
- The skill fills an empty evidence slot with something plausible.
- An outline is saved without the user having said yes.
- The differ starts matching by text.
- A copy of `text-index.mjs` drifts and the check does not notice.
