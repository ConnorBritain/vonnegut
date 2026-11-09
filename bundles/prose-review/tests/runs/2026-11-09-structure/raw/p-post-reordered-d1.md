Mode: intended-outline. I checked both input files. Neither contains a verdict, expectation, class label, provenance label or `expect:` key.

**Finding 1**
- **CLASS**: order
- **LOCATION**: line 5, "## I said calibration was a one-time job", and line 13, "## I said thresholds were guesses". Also line 7, "the bands move underneath you", and line 19, "read the banner, distrust thin bands, and lock what you like".
- **EVIDENCE**: The outline puts n1 (thresholds) first, n2 (five samples) second and n3 (one-time job) third. The draft swaps n1 and n3: per the scan, n3 opens at heading index 1, line 5, and n1 sits at heading index 3, line 13. Two things show the outline order was meant. First, line 7 says bands "move" before line 11, "Five samples get you bands.", has introduced bands at all. Second, the recap at line 19 still follows the outline order n1 → n2 → n3, banner then thin then lock, so it runs backwards against the sections above it.
- **WHAT THE READER LOSES**: The reader meets drifting bands before learning what bands are or why shipped guesses need replacing. The closing recap also lists the corrections in a different order from the one they were just read in.
- **PLAN-ENTRY**: `{"id": "s01", "source": "structure-critic", "location": {"line": 5, "quote": "## I said calibration was a one-time job"}, "change": "Swap the sections headed at lines 5 and 13 so the three corrections follow outline order n1, n2, n3.", "reason": "Draft reverses n1 and n3; line 7 uses 'bands' before line 11 introduces them, and the line 19 recap follows outline order."}`

**Clean classes**
- unsupported-claim: clean. Every outline evidence slot is filled in the draft: n1 at line 15, n2 at line 11, n3 at line 7 and n4 at line 19.
- transition: clean. All four unmarked boundaries (lines 7, 11, 15 and 19) fall at headings of parallel "I said …" sections. Each heading carries the topic change, so these are deliberate cuts.
- imbalance: clean. Section ratios run from 0.75 to 1.306 against a median of 36 words, so none is extreme.

**Scanner defects**
- Line 11: `claim_markers.citation` is 1, but the paragraph cites nothing. The quoted word "thin" is probably being counted as a citation.

REVISE
