# Negative (structure holds) — loo-chesterton-the-diabolist-d1 · CLEAN

Mode: draft-only. No intended outline was supplied.

**Findings:** none.

**Classes**
- **Unsupported claims:** not assessed. With no outline, there is no stated intent to check support against.
- **Order:** not assessed, for the same reason.
- **Transitions:** clean. The scan lists 15 unmarked boundaries, and none of them leaves the reader stranded:
  - Lines 54, 56, 69 and 71 sit on the two `.....` scene breaks, which are deliberate cuts.
  - Lines 76, 86, 90, 98, 100, 120, 127, 130 and 133 are dialogue turns, or narration between turns, inside one continuous scene.
  - At line 14, "The thing befell me…", "the thing" refers back to the conversation announced in lines 5–12.
  - At line 28, "I value that time, in short…", "that time" refers back to the art-school period in line 14.
- **Imbalance:** clean. The draft has one section (ratio 1, max/min 1). Paragraph lengths follow the pace of the scene and leave no claim without its paragraph.

**Scanner defects**
- Line 56 `first_sentence` stops at "St." because the abbreviation list doesn't include "St." before "Paul's".
- Line 102 `first_sentence` runs two sentences together ("…said I. “Give me…"), so the sentence split missed the boundary after a closing quotation.
- Lines 54 and 69 (`.....`) are reported as paragraphs with `words: 0` but `sentences: 1`. A paragraph with no words shouldn't have a sentence. A run of dots is also not recognised as a break between scenes.
- The section's `end_line` is 145, but the last paragraph runs to line 149. The field seems to record where the last paragraph starts rather than where the section ends.
- Spoken dialogue (for example line 98, "“Aren’t those sparks splendid?”") counts as `citation`. In fiction or narrative essays this inflates the claim-marker density.

CLEAN

RESULT: CLEAN | findings=0 | uncited=0 | authorship_claims=0
