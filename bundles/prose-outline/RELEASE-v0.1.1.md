# prose-outline v0.1.1 release notes

A patch release: the canonical `lib/text-index.mjs` gains three fixes to its
definition patterns, found while `prose-bible` built its entity index over the
same module. No other file in the bundle changes. Roadmap item C, build-time
decisions ([`docs/roadmap/C-prose-bible.md`](../../docs/roadmap/C-prose-bible.md) §9).

## Changed

- A proper name followed by one lower-case noun is a defined term in the is-a
  pattern ("the Harrow road is the old road to the coast" now defines "Harrow
  road", not "Harrow"). The tail is allowed only there; in an appositive it
  swallowed the verb ("Halvard tried, the year the bridge went").
- A definition stops at a comma as well as at a sentence end. "The belief that
  some people were born to rule, and others to be ruled over, and that…" is now
  one clause, which is what a definition is.
- A function word at either edge of a lower-case term is trimmed ("that
  conservatism" is "conservatism"; "snapshot of" is "snapshot"), and a heading
  marker counts as a sentence start, so a capitalised word that only ever opens
  a heading is not indexed as a name.

The three text-index parity cases and the outline-scan fixtures were regenerated
with `--update` and reviewed in the diff: the changes are all in `terms`, and
every one reads as an improvement or a wash.

## Compatibility

`voice-outline/1`, the scan, the diff, the store and the skill are unchanged.
`prose-bible` ships this file byte for byte; `tools/check-packaging.mjs` now
pins the pair.

## Evidence

`node bundles/prose-outline/tests/selftest.mjs`: 137 checks, zero failed, on the
regenerated fixtures. The thirteen `outline` mutations still catch.
