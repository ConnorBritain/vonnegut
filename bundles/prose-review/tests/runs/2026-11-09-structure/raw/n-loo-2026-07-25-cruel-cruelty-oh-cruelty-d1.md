Draft-only mode: there is no intended outline, so classes 1 (unsupported-claim) and 2 (order) were not assessed.

No findings.

- **Transition: clean.** Every unmarked boundary inside the essay (lines 21–121) carries the reader across:
  - Line 53 ("When the US government adopted…") is the example for line 51's "captive audience of broke people."
  - Line 59 ("Contract lending never went away.") repeats the term from line 53.
  - Line 83 ("There's India's subprime phone lenders…") is the first instance of the general rule stated in line 81.
  - Line 91 ("That's where the law comes in.") answers the problem set up in line 89.
  - Line 97 ("Here's where it gets interesting.") signals the pivot itself, using a marker the tool does not list.
  - Lines 105, 113, 115 and 119 each pick up "Apple," "the company" or the code from the paragraph before.

  The unmarked boundaries outside the essay (lines 3–17 and 125–255) are table-of-contents entries, link lists, event listings and the boundaries between the newsletter's sections. Those are deliberate cuts.
- **Imbalance: clean.** The scan found one section (ratio 1.0) because the draft marks its sections with "(permalink)" title lines instead of ATX headings. There is no ratio to act on, and the trailing reference sections are flat by design.

*Scanner defects*
- Line 73: `first_sentence` holds two sentences ("…a car that isn't. Some subprime cars…"). The sentence splitter missed the break after "isn't."
- Line 77: `first_sentence` is cut off inside a parenthetical at "(where else?)", which leaves the topic-sentence candidate without its subject ("Tesla").
- Line 195: the paragraph is split after "?" and the trailing "(BBC News)" is dropped.
- Lines 227, 231 and 233: `first_sentence` ends with a stray "(" where an inline URL was stripped.
- Line 15: one `citation` marker is counted in "Upcoming books: Like I said, I'll keep writin' 'em.", which contains no citation.
- "(permalink)" title lines (19, 125, 137, 163, 193, 215, 239, 249) are not recognised as section boundaries. The tool's limits say only ATX headings count, so this is a gap in coverage, not a miscount. It does make the scan's balance figures meaningless for this format.

CLEAN
