Mode: draft-only. There is no intended outline, so classes 1 (unsupported-claim) and 2 (order) were not assessed.

**Findings**

None.

**Clean classes**

- **transition**: clean. The scan lists 13 unmarked boundaries, and I checked each one. The draft is built as a catalogue. Line 23 sets it up: "let us speak of the work; that is, the true greatness of kingdoms and estates, and the means thereof." Line 175 looks back over it: "the things which we formerly have spoken of are but habilitations towards arms." Line 283 sums it up: "such ordinances, constitutions, and customs, as we have now touched." Each unmarked paragraph from line 43 to line 255 opens the next means in that list: stock of people, taxes, the nobility, free servants, naturalization, sedentary arts, just occasions of war, exercise in war, the sea, and military honours. Because the frame announces the list and then returns to it, these are deliberate list boundaries, not gaps. Line 109 is a verse quotation that finishes the sentence ending at line 107 ("which he gives to ancient Italy:—"). It is not a change of topic. At lines 30, 43, 223, 236 and 255 the boundary might be a gap or might be a cut. I couldn't tell, so I'm not raising them.
- **imbalance**: clean. The draft has one section (`balance.sections: 1`, `max_ratio: 1`, `min_ratio: 1`), so there is no ratio to compare.
- **unsupported-claim**: not assessed (draft-only mode).
- **order**: not assessed (draft-only mode).

**Scanner defects**

- Line 278 opens with "To conclude.", a standard concluding marker. The scan reports `marker: null`, `linked: false`. Either the marker list doesn't include it, or a one-sentence lead (`first_sentence: "To conclude."`) skips the marker check.
- Line 196 opens with "Incident to this point is…", which explicitly points back to the paragraph before. The scan reports `marker: null`, `linked: false`. Its `limits` say a demonstrative counts as a transition, but "this" seems to be caught only when it is the first word. A demonstrative later in the opening phrase is missed.
- Line 111 opens with "Neither is that state … to be passed over". That is an additive opener with a demonstrative ("that state") in its first clause, and the scan reports it unlinked. This is probably the same cause as line 196.
- Line 109 is a two-space-indented verse line that finishes the sentence from line 107. The scan counts it as its own paragraph and adds two boundaries (109 and 111) that don't exist in the argument. That changes `boundaries`, the `unmarked` list and `paragraph_count`.

I checked for harness leakage and found none: no verdict, expectation, class label, provenance label or `expect:` key appears in the staged draft.

CLEAN
