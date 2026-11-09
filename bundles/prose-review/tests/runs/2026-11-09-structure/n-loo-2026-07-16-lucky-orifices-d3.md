# Negative (structure holds) — loo-2026-07-16-lucky-orifices-d3 · CLEAN

Mode: draft-only. No intended outline was supplied, so I made only transition and imbalance findings.

No findings.

**Missing transitions: clean.** The scan lists 72 unmarked boundaries. Most need no transition:
- **Lines 3–17 and 129–253:** these are a table of contents, link lists, appearance and book listings, and the colophon. They are list items and section breaks.
- **Lines 19, 129, 141, 165, 191, 213, 237, 247:** these are the "(permalink)" section titles, which are deliberate cuts.
- **Lines 31, 41, 123:** these are block quotes, each introduced by the line before it ending in a colon.

In the essay itself (lines 21–127), each remaining unmarked boundary has something that carries the reader across:
- **Repeated subject:** Thiel is the subject of every paragraph from line 109 to line 121.
- **Pronoun chain:** "They" runs through lines 83–91, and line 39 opens with "They're right".
- **Restating the previous point:** line 45 draws the policy lesson from the Apple example, and line 81 names all four doctrines from lines 55–77.
- **Multi-word or late-placed markers the scanner misses:** see *Scanner defects*.

Line 47 ("Anyone who believes in markets must also tacitly believe…") turns sharply from policy design to the believers' contradiction. Line 51 picks it up with "understand this". I can't tell whether the turn is a gap or a deliberate pivot, and in this mode an unclear case is not raised.

**Imbalance: clean.** The scan found one section (ratio 1.0, `balance.sections: 1`), so there is nothing to compare.

**Unsupported claims and order: not assessed.** There is no intended outline to check them against.

**Harness check:** draft.md contains no verdict, expectation, class label, provenance label or `expect:` key.

*Scanner defects*
- **Multi-word openers count as unmarked.** The scan reports line 33 "In other words:", line 105 "Reflecting on this, …" and line 109 "As for Thiel, …" as unmarked. Its marker check seems to look at the first word only.
- **Demonstratives after a leading adverbial are missed.** Line 127 "Today, these Renfields…" is reported unmarked (`marker: null`) even though "these" is a demonstrative.
- **"said" counts as a citation.** Line 15 "Like I said, I'll keep writin' 'em" scores `citation: 1`, but it is a callback to line 13, not a source.
- **No sections found (a known limit, not a bug).** The draft's section titles are plain lines ending in "(permalink)", not ATX headings, so the whole document reads as one preamble. The scan's `limits` already says this. The side effect is that list-item boundaries fill the unmarked list.

CLEAN

RESULT: CLEAN | findings=0 | uncited=0 | authorship_claims=0
