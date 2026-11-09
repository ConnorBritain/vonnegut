Mode: intended-outline. The outline was supplied, and n1–n4 were checked against the draft.

**Finding 1**
- **CLASS**: unsupported-claim
- **LOCATION**: line 13, "The build must fail when the plan and the code disagree."
- **EVIDENCE**: outline node n2 ("The check must be mechanical, because plan and code drift silently and nothing complains"), slots e1 and e2. In the scan, section "The check" has 1 paragraph of 1 sentence, and `heading_overlap_sentence` is null. The draft states n2 as settled with nothing after it. It never gives the "because" (silent drift). Slot e2, the case where code says 0.7.0 and the plan says 0.6.0, appears nowhere in the draft.
- **WHAT THE READER LOSES**: The reader gets the demand for a build check but not the reason it has to be mechanical. The silent-drift case that would show it is missing.
- **PLAN-ENTRY**: `{"id": "s01", "source": "structure-critic", "location": {"line": 13, "quote": "The build must fail when the plan and the code disagree."}, "change": "Support this claim in its own section with n2's reason (silent drift) and its evidence slot e2 (the 0.7.0/0.6.0 drift case).", "reason": "Outline n2 has filled evidence slots; the draft states the claim bare."}`

**Finding 2**
- **CLASS**: order
- **LOCATION**: line 17, "In 2024 our team added such a check, and the count of stale plan entries dropped from eleven to zero within a month"; compare line 13
- **EVIDENCE**: outline n2.e1 ("the 2024 script: eleven stale entries to zero") belongs to n2 (order 2). The draft puts it in "The objection" (n3, order 3), starting at line 15, after n2 has already been stated without support at line 13.
- **WHAT THE READER LOSES**: The only evidence that a mechanical check works shows up as part of the rebuttal to an objection. So the reader never sees it as the grounds for n2.
- **PLAN-ENTRY**: `{"id": "s02", "source": "structure-critic", "location": {"line": 17, "quote": "In 2024 our team added such a check, and the count of stale plan entries dropped from eleven to zero within a month"}, "change": "Move the 2024 evidence into the section on the check, where outline n2 places it.", "reason": "n2.e1 sits under n3, after n2 is stated unsupported."}`

**Finding 3**
- **CLASS**: imbalance
- **LOCATION**: lines 11–13, section "The check", "The build must fail when the plan and the code disagree."
- **EVIDENCE**: scan section "The check": 11 words, ratio_to_median 0.124 (balance.min_ratio). It carries n2, and n4 at line 19 says it follows from n1–n3.
- **WHAT THE READER LOSES**: The closing rule at line 19 depends on a section that holds one sentence. Of the three premises it rests on, the reader has been given only two.
- **PLAN-ENTRY**: `{"id": "s03", "source": "structure-critic", "location": {"line": 13, "quote": "The build must fail when the plan and the code disagree."}, "change": "Develop the section on the check to carry n2 at a weight comparable to the sections carrying n1 and n3.", "reason": "Section ratio 0.124 carries a premise of the concluding rule."}`

**Clean classes**: transition. The scan lists line 9 as unmarked, but it opens with "There is a second reason," which carries the reader on from line 7. At line 13 the heading carries the reader across, and the thesis at line 3 already set up "checked by the build". Any gap there is n2's missing support, which Finding 1 covers. Line 17 is introduced by its heading, and "a mechanical check" refers back to line 13.

**Scanner defects**: At line 9, the scan reports `linked: false` with no marker for "There is a second reason". The tool's marker list apparently doesn't include ordinal enumeration ("second", "a second reason"), so a real continuation shows up as unmarked.

REVISE
