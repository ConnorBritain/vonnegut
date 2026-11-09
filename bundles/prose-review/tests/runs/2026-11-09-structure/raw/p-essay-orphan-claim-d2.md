Mode: intended-outline. I checked the draft against outline nodes n1–n4.

**1**
- **CLASS**: unsupported-claim
- **LOCATION**: line 13, "The build must fail when the plan and the code disagree."
- **EVIDENCE**: Outline n2 ("The check must be mechanical, because plan and code drift silently and nothing complains") has two filled slots. Slot e2 ("the silent drift case: code says 0.7.0, plan says 0.6.0") appears nowhere in the draft. The draft also leaves out the n2 reason, "drift silently and nothing complains". In the scan, section "The check" has 1 paragraph of 1 sentence, and its topic sentence is followed by no other sentence.
- **WHAT THE READER LOSES**: The reader is told the build must fail but not why. This is the step from "a file" to "checked by the build" in the thesis, and it is the only part of the thesis the draft states without support.
- **PLAN-ENTRY**: `{"id": "s01", "source": "structure-critic", "location": {"line": 13, "quote": "The build must fail when the plan and the code disagree."}, "change": "Support the claim in 'The check' with outline n2's reason (silent drift) and its e2 evidence, the 0.7.0/0.6.0 drift case.", "reason": "n2 is asserted with no support in its own section; slot e2 is missing from the draft."}`

**2**
- **CLASS**: order
- **LOCATION**: line 17, "In 2024 our team added such a check, and the count of stale plan entries dropped from eleven to zero within a month…", which supports line 13, "The build must fail when the plan and the code disagree."
- **EVIDENCE**: Outline n2 slot e1 ("the 2024 script: eleven stale entries to zero") belongs to n2, which comes second in the outline. The draft puts it inside section "The objection", which is n3 and comes third. The section order matches the outline, but n2's only evidence in the draft arrives after the n3 objection has started.
- **WHAT THE READER LOSES**: The check is first stated as bare and only gets its support later, as part of the answer to an objection. So the strongest evidence for the mechanical check reads as rebuttal, not as the reason for it.
- **PLAN-ENTRY**: `{"id": "s02", "source": "structure-critic", "location": {"line": 17, "quote": "In 2024 our team added such a check, and the count of stale plan entries dropped from eleven to zero within a month"}, "change": "Move the 2024 stale-entries evidence from 'The objection' into 'The check', where outline n2 places it.", "reason": "n2's e1 evidence sits under n3, after the claim it supports."}`

**3**
- **CLASS**: imbalance
- **LOCATION**: line 13, "The build must fail when the plan and the code disagree."
- **EVIDENCE**: Section "The check" has 11 words and `ratio_to_median` 0.124 (`balance.min_ratio`; median 89). It carries n2, which n4's slot e1 ("follows from n1–n3") rests on.
- **WHAT THE READER LOSES**: n2 is a premise the closing rule at line 19 depends on, yet it gets one sentence while the sections around it get 122 and 132 words. That makes it look like a section break, not a step in the argument.
- **PLAN-ENTRY**: `{"id": "s03", "source": "structure-critic", "location": {"line": 13, "quote": "The build must fail when the plan and the code disagree."}, "change": "Give 'The check' enough length to carry n2 as a premise on a par with n1 and n3.", "reason": "Ratio 0.124 on a section that n4 depends on."}`

**Clean classes:**
- **Transitions:** clean. The scan lists line 9, but it opens with "There is a second reason", which links back to the paragraph before. Line 17 opens with "The usual objection", a deliberate turn marked by its heading. Line 13's gap is the n2 support problem covered in finding 1, not a separate transition finding.
- **Unsupported-claim, order and imbalance:** findings 1–3 above.
- **Other nodes:** n1 (line 7, e1; line 9, e2), n3 (line 17, e1) and n4 (line 19) are supported and in outline order.

**Scanner defects**
- The scan marks line 9's boundary as unmarked, but "There is a second reason" is an enumerative transition. The tool's marker list does not cover ordinal "second … reason" openings.

REVISE
