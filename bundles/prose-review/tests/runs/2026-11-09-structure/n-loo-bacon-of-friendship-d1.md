# Negative (structure holds) — loo-bacon-of-friendship-d1 · CLEAN

Mode: draft-only. No intended outline was supplied, so only transition and imbalance findings are made.

No findings.

**Clean classes**
- **transition:** clean. The scan lists 5 boundaries as unmarked: lines 25, 36, 54, 94 and 119. None of them leaves the reader with nothing to carry across:
  - **Line 25** ("A principal fruit of friendship…") picks up "unfit for friendship" from the end of the paragraph before. It opens a list of friendship's fruits, and the paragraphs at lines 119 and 191 continue that list.
  - **Line 36** says "this fruit of friendship whereof we speak" in its first sentence, which points back to the paragraph before.
  - **Line 54** ("L. Sylla, when he commanded Rome…") is a deliberate cut into examples. It directly follows the claim at line 47, "this hath been done… by the wisest and most politic", which those examples support.
  - **Line 94** ("It is not to be forgotten…") is a continuation phrase. The paragraph closes the first fruit itself at line 105: "wherewith I will conclude this first fruit".
  - **Line 119** ("The second fruit of friendship…") is a numbered step in the list, signalled in its opening words.
- **imbalance:** clean. There is one section, with `ratio_to_median` 1 and `max_ratio`/`min_ratio` both 1, so there is nothing to compare.
- **unsupported-claim** and **order** were not assessed. Without an intended outline, there is nothing to check support or order against.

**Scanner defects**
- An ordinal or enumerative opening does not count as a transition marker. Line 119 starts "The second fruit of friendship", which explicitly carries the topic across, but the scan reports `marker: null, linked: false`. Line 25 ("A principal fruit…") is the same kind of opening. As a result, a list's steps are reported as unmarked boundaries.
- A demonstrative only counts at the very start of a paragraph. At line 36 the reference back, "this fruit… whereof we speak", comes later in the first sentence, and it is not detected.

CLEAN

RESULT: CLEAN | findings=0 | uncited=0 | authorship_claims=0
