# Negative (structure holds) — loo-chesterton-the-shop-of-ghosts-d3 · CLEAN

Mode: draft-only. No intended outline was supplied.

No findings.

- **Missing transitions:** clean. The scan lists 30 unmarked boundaries, and none of them leaves the reader without a bridge:
  - Lines 26, 112 and 142 are `.....` scene breaks. They are deliberate cuts.
  - Lines 28, 114 and 144 open new scenes after those breaks. Each one is tied back by its own first sentence: "As I looked at that palace of pigmy wonders", "A silence fell suddenly between us" and "Another shadow darkened the doorway".
  - Lines 71–110 and 126–182 are alternating dialogue turns, where each reply answers the line before it.
  - Lines 45 and 61 do change topic, but each opens on a link to the paragraph before. Line 45 ("Every one, I suppose, knows such stunning instants of abstraction") picks up the trance at line 30. Line 61 ("To shake off this dangerous and dreamy sense") picks up line 59.
  - Line 86 ("The lamps could not have been lighted yet in the street outside.") returns to the setting straight after the revelation, and the narrator's line at 91–92 ties it back to the conversation.
- **Imbalance:** clean. The scan finds one section (preamble, 1649 words, ratio_to_median 1), so imbalance cannot arise.
- **Unsupported claims and order:** not assessed. There is no intended outline to check them against.

No verdict, expectation, class label, provenance label or `expect:` key appears in draft.md.

Scanner defects:
- The `.....` separator lines (26, 112, 142) are counted as paragraphs with 0 words and 1 sentence each. Each one therefore creates two unmarked boundaries (26/28, 112/114, 142/144) where the text has one deliberate break. The tool's thematic-break recognition does not cover this pattern.
- Sentence splitting cuts dialogue at `!` or `?` inside the quotation marks, before the speech tag. Examples: line 80 `first_sentence` is "“Good heavens!”", and line 126 is "“Good lord!”". This inflates sentence counts in dialogue paragraphs.
- Speech-tag paragraphs pick up `citation` marker counts (lines 83, 94, 135, 169), and temporal "since" at line 174 counts as `connective` = 2. As a result, short dialogue lines show high `per_100_words` values (18.75–25) that do not reflect any claim density.

CLEAN

RESULT: CLEAN | findings=0 | uncited=0 | authorship_claims=0
