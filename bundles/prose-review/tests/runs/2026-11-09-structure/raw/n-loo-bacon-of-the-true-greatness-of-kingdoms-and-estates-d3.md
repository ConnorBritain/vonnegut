Mode: draft-only. No intended outline was supplied.

No findings.

**Transition: clean.** The scan lists 13 unmarked boundaries. None of them is a gap. Line 23–24 announces the subject as "the true greatness of kingdoms and estates, and the means thereof". Each paragraph after that is one more item in that list of means, and each opens on its own topic sentence. Line 175 gathers what came before: "the things which we formerly have spoken of are but habilitations towards arms". Line 283 closes on "such ordinances, constitutions, and customs, as we have now touched". So the unmarked boundaries fall between list items and are not breaks in the reasoning. The boundaries at lines 109 and 111 are not topic changes either. Line 109 is a quoted line of verse that line 107 sets up with its closing ":—", and line 111 opens "Neither is that state … to be passed over", which continues the point about yeomanry and arms.

**Imbalance: clean.** The draft has no headings, so it forms a single section with a ratio of 1. The longest paragraph has 389 words (line 122) and the shortest content paragraph has 86 (line 278, a closing paragraph that is short by design).

**Unsupported claims and order: not assessed.** Without an intended outline there is nothing to check either against.

*Scanner defects*
- Line 278: "To conclude." is a concluding marker, but `transition_in.marker` is null and the boundary is listed as unmarked. The marker list appears to be missing conclusive phrases.
- Line 196: "Incident to this point is…" contains a demonstrative that refers back to the previous paragraph. The scan's limits say a demonstrative counts as a transition, yet the boundary is reported `linked: false`. The tool seems to check only the first word for a demonstrative.
- Line 109: an indented quoted line that finishes the sentence started at line 107 is treated as its own paragraph. That one sentence becomes two boundaries (109 and 111), and the 6-word "paragraph" shows up in the per-paragraph lengths.

CLEAN
