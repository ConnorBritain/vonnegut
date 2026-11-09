# prose-outline — design

**Status: v0.1.1.** The planning record is
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

## The brainstorm is the outline's rules, moved upstream

A transcript is the writer's own words, so the brainstorm's one hard rule is
the research bundle's: a quote matches the text exactly, whitespace aside, at
the line it names. Case and punctuation are not "close enough" — the check
reports them as drift. Line numbers refer to the cleaned transcript, because
timestamps and cue numbers are scaffolding the writer never said, and that
cleaned text is what the brief store caches. Coverage is the second rule: every
topic segment is used, left out or listed as unused, so an angle cannot quietly
drop the part of the memo that did not fit. Fillers are counted and kept;
removing them would make quotes unmatchable and edit the writer's speech.

The brief is a new store beside `outlines`, not a field in it: it exists before
any outline, and several outlines can be proposed from one brief. Both stores
belong to this bundle, so the outline skill may read the brief; a store owned by
another bundle is never read directly.

## The interview is a fixed tree, not a conversation

A model choosing what to ask next asks different things in different sessions
and cannot say when it is finished. The interview's tree is data; brief-check
takes the first open, unconfirmed or stale decision whose dependencies are
settled, so the interview walks each branch in dependency order and resumes in
another session exactly where it stopped. Staleness is derived from each
answer's `at_revision` and the tree's transitive dependencies, never stored:
`decide` stamps the revision it writes, and a caller cannot choose the stamp.

The grill-me pattern's one amendment is that the writer's own material is
searched before the writer is asked. Every found answer still needs a yes,
so the source proposes and the writer decides. Sibling bundles' material comes
through their own read tools, so the interview works — with less help — when
they are absent, and no store is read by a bundle that does not own it.

## What would make this a bad bundle

- The scan grows a "score" or a verdict.
- The skill fills an empty evidence slot with something plausible.
- An outline is saved without the user having said yes.
- The differ starts matching by text.
- A copy of `text-index.mjs` drifts and the check does not notice.
- The brainstorm paraphrases inside a quote, supplies a thesis the material
  lacks, or drops a segment without saying so.
- The interview picks its own next question, records a recommendation as the
  writer's answer, or calls itself finished while the check says otherwise.
