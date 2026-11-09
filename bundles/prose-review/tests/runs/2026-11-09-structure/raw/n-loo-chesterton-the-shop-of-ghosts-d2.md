Mode: draft-only. No intended outline was supplied.

No findings.

- **Unsupported claims:** not assessed in draft-only mode, because there is no outline to check them against.
- **Order:** not assessed in draft-only mode, because there is no outline to check them against.
- **Missing transitions:** clean. The scan lists 30 unmarked boundaries, and none of them is a gap a reader has to cross unaided:
  - Lines 26, 112 and 142 are `.....` breaks that start a new scene on purpose.
  - Lines 71–83, 94–109, 126–140 and 152–182 are turns in a dialogue.
  - Line 45 ("Every one, I suppose, knows such stunning instants of abstraction") picks up the trance from the paragraph before through "such", which is a back-reference.
  - Lines 61, 86, 114 and 144 move the same scene forward in time order.
- **Imbalance:** clean. The scan finds one section, so `balance.max_ratio` and `min_ratio` are both 1 and there is nothing to compare.

Scanner defects:
- The `.....` lines at 26, 112 and 142 are reported as paragraphs with `words: 0` and `sentences: 1`. A sentence with no words is a contradiction. These lines are also counted as transition boundaries in both directions, which adds 6 unmarked entries that refer to no prose. The tool should either recognise this kind of break as a thematic break or leave it out of the paragraph and boundary counts.

CLEAN
