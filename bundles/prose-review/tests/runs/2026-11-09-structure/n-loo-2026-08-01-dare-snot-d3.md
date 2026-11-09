# Negative (structure holds) — loo-2026-08-01-dare-snot-d3 · CLEAN

Mode: draft-only. No intended outline was supplied, so I made only transition and imbalance findings.

**Findings:** none.

**Transitions (class 3): clean.** The scan lists 85 unmarked boundaries, and none of them is a real gap.
- **Lines 3–17 and 125–263:** these are a table of contents, link lists, dated entries, event listings and book listings. Each entry stands alone, and the plain-text "(permalink)" lines (125, 137, 167, 201, 223, 247, 257) work as section breaks. These are deliberate cuts and list items, not missing transitions.
- **Lines 19–123 (the essay):**
  - The unmarked boundaries in lines 57–97 sit inside a single run on Suresh's essay. Most of these paragraphs open by naming Suresh or by picking up the previous paragraph's subject.
  - Line 79 opens "As an aside:", which signals the break on purpose.
  - Line 109 opens "The other question Suresh implicitly raises is…" and answers the "two questions" set up at line 101.
  - Line 121 ("As ever, the most important fact about a given technology…") and line 123 close the essay as a coda.

**Imbalance (class 4): clean.** The scan found one section with a ratio of 1.0, so there is nothing to compare.

**Not assessed:** unsupported claims (class 1) and order (class 2). Without an intended outline there is nothing to check them against.

**Scanner defects**
- **No headings found.** The draft marks its sections with plain-text "Title (permalink)" lines, not ATX headings. The scan therefore reads the whole document as one preamble section of 3502 words, and its balance figures (median 3502, max/min ratio 1) say nothing about the real sections. The heading lines are also counted as paragraphs and as unmarked boundaries. The scan's limits do declare this behaviour, but it means the imbalance check could not do any work on this draft.
- **Line 49, garbled text.** `first_sentence` reads "W e’re facing…", but the source has "[W]e’re". The bracketed editorial insertion seems to have been handled as link syntax, which split the word.
- **Line 15, likely misclassified marker.** `citation: 1` is counted on "Like I said, I'll keep writin' 'em." This looks like "said" being matched as a citation verb inside a casual phrase.
- **Missed transition openers.** "As an aside:" (line 79) and "The other question…" (line 109) are not on the marker list. Both are reported as unmarked even though the text marks them.

CLEAN

RESULT: CLEAN | findings=0 | uncited=0 | authorship_claims=0
