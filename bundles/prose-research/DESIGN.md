# prose-research — design

**Status: v0.1.0.** The planning record is
[`docs/roadmap/E-prose-research.md`](../../docs/roadmap/E-prose-research.md).

## The split

Everything a script can decide about provenance is decided by one:
`source-intake.mjs` pins what a source said (text, sha256, instant);
`claims-check.mjs` compares every ledger quote to its source after whitespace
normalisation and nothing else, asks every URL for a status, and lists the
claim sentences the map leaves unbacked; `provenance-scan.mjs` does the same
comparison for the quote atoms `fidelity-scan` would extract. What needs a
judgement — which sentences are claims, which passages are worth keeping, how
sure the writer is — is proposed by the skill and decided by the writer.

## No fuzzy matching

A quote that matches after "minor" normalisation is the case the check exists
to catch: the word that changed between the notes and the fourth draft. So
`normalise` collapses whitespace and stops. A mutation that widens it (case,
punctuation) is caught by a fixture whose only drift is a capital letter.

## Confidence is a label

`confidence` is asked of the writer and stored beside `confidence_by: "writer"`.
The field is redundant with the rule and is there so the rule survives the
prose: a later reader of the ledger — a tool, a critic, a session that never
read this file — cannot mistake `high` for something measured.

## Not-evaluated is never ok

A link check that cannot reach the network says so. The mutation that turns
`not-evaluated` into `ok` is the one that would let a report say every link is
live from an aeroplane.

## Extend the fidelity critic narrowly, rather than add a provenance critic

The objection considered: fidelity's remit is before/after preservation with
ground truth by construction, and provenance is a different question. The
answer: a quote that no longer matches its source *is* fidelity's item-1 atom
class, and `provenance-scan` supplies presence exactly as `fidelity-scan` does.
So the critic gains an optional block that affects only that class, refuses
anything beyond quotes, and behaves byte-identically without the block. A
separate critic would have claimed the same finding twice (exclusivity,
`prose-review/DESIGN.md`). Revisit if the harness shows the block raising false
positives on the existing fixtures.

## Shared code, pinned

`lib/registry-reader.mjs` and `lib/revision-store.mjs` are byte-identical copies
of prose-outline's; `lib/html-text.mjs` is a byte-identical copy of
prose-author's corpus importer's. `tools/check-packaging.mjs` pins all three,
and this bundle's selftest checks them again so a loose-file install can prove
it too. Shipped code imports nothing across a bundle boundary.

## What would make this a bad bundle

A `truth` field. A source score. A fuzzy match "for convenience". A confidence
the skill filled in. A link marked ok because the check could not run. Any of
these turns a provenance record into an authority, and the writer stops
checking.
