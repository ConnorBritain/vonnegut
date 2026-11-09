# Negative (structure holds) — loo-chesterton-humanity-an-interlude-d3 · CLEAN

Mode: draft-only. There is no intended outline, so classes 1 (unsupported-claim) and 2 (order) were not assessed.

No findings.

- **Transition: clean.** The scan lists seven unmarked boundaries. None of them is a real gap:
  - Lines 40 and 100 are `.....` lines, and so are the boundaries into lines 42 and 102 that follow them. These are deliberate scene breaks, and the cut is the device.
  - Line 42 ("For all these reasons, and many more, when I had got into Brussels…") ties the tram story explicitly to the argument about Brussels before it.
  - Line 54 starts the dialogue the paragraph at line 42 sets up.
  - Line 102 ("At this important point of evolution the tram came to a jerky stoppage") picks up where the argument before the break left off.
  - Lines 111 and 132 follow straight on in the narrative (stepping off the tram, the fields, the wood, the cottage). The reader does not need a bridge there.
- **Imbalance: clean.** The scan found one section, with a ratio to the median of 1.0, so there is nothing to compare.
- **Unsupported-claim:** not assessed (draft-only mode).
- **Order:** not assessed (draft-only mode).

No verdict, expectation, class label, provenance label or `expect:` key appears in the draft.

*Scanner defects*
- Lines 42 and 102: the transition test only checks the first word. That misses an opening reference phrase that starts with a preposition ("For all these reasons", "At this important point"), so both are reported as unmarked. The `.....` lines between them may also be blocking the comparison with the paragraph before.
- Lines 40 and 100: a `.....` line is counted as a paragraph with `words: 0` and `sentences: 1`, which contradicts itself. Each one adds two boundaries to `transitions.boundaries` and to the unmarked list. The tool's limits list says it recognises thematic breaks, but `.....` is not Markdown thematic-break syntax, so it isn't caught and the text is not marked as a scene break.

CLEAN

RESULT: CLEAN | findings=0 | uncited=0 | authorship_claims=0
