Mode: intended-outline.

**s01**
- **CLASS**: unsupported-claim
- **LOCATION**: line 13, "The build must fail when the plan and the code disagree."
- **EVIDENCE**: outline n2. The draft never states n2's premise ("plan and code drift silently and nothing complains"), and slot e2 (the 0.7.0 vs 0.6.0 drift case) is missing from the draft. Scan: "The check" has 1 paragraph of 1 sentence, and `heading_overlap_sentence` is null.
- **WHAT THE READER LOSES**: The reader is told the build must fail but never why a person can't do the job instead, so the essay's central "checked by the build" claim is stated as settled with nothing behind it.
- **PLAN-ENTRY**: `{"id": "s01", "source": "structure-critic", "location": {"line": 13, "quote": "The build must fail when the plan and the code disagree."}, "change": "Add the silent-drift premise and the n2.e2 drift case under The check, after the existing claim.", "reason": "n2's claim stands alone, with its premise and evidence slot e2 absent from the draft."}`

**s02**
- **CLASS**: order
- **LOCATION**: line 17, "In 2024 our team added such a check, and the count of stale plan entries dropped from eleven to zero within a month"
- **EVIDENCE**: outline n2.e1 ("the 2024 script: eleven stale entries to zero") belongs to n2 (order 2). The draft puts it in "The objection" (n3, order 3, lines 15–19), two sections after the claim it supports at line 13.
- **WHAT THE READER LOSES**: At the moment the check is asserted, the reader has no proof that it works. The proof turns up later as part of answering an objection.
- **PLAN-ENTRY**: `{"id": "s02", "source": "structure-critic", "location": {"line": 17, "quote": "In 2024 our team added such a check, and the count of stale plan entries dropped from eleven to zero within a month"}, "change": "Move the 2024 stale-entries evidence from The objection into The check.", "reason": "Outline places n2.e1 under n2; the draft places it under n3."}`

**s03**
- **CLASS**: imbalance
- **LOCATION**: line 13, "The build must fail when the plan and the code disagree."
- **EVIDENCE**: scan section "The check": 11 words, `ratio_to_median` 0.124 (median 89, `min_ratio`). It carries n2, which is half of the thesis ("checked by the build").
- **WHAT THE READER LOSES**: The section holding the essay's distinctive claim is the thinnest in the essay, so the argument appears to rest on "Where the plan lives" (n1) alone.
- **PLAN-ENTRY**: `{"id": "s03", "source": "structure-critic", "location": {"line": 13, "quote": "The build must fail when the plan and the code disagree."}, "change": "Check that The check carries n2's premise and both evidence slots once s01 and s02 are applied; no separate edit is needed.", "reason": "The load-bearing section is at ratio 0.124; s01 and s02 fill it."}`

Transition is clean. The unmarked boundary at line 13 is the gap that s01 covers. The one at line 17 is an objection signalled by its heading and by its opening phrase, "The usual objection". The one at line 9 opens with "There is a second reason", which carries the reader across.

*Scanner defects*: at line 9 the scan reports the boundary as unmarked (`marker: null`, `linked: false`). It doesn't treat "There is a second reason" as an enumerative transition, so its marker list seems to be missing ordinals like "second" when they aren't the first word of the sentence.

REVISE
