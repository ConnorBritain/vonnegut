Mode: intended-outline. An outline was supplied (`outline.json`, voice-outline/1).

**Finding s01**
- **CLASS**: unsupported-claim
- **LOCATION**: line 11, "So the check has to be mechanical, and a mechanical check eliminates stale plan entries entirely." and "This is settled."
- **EVIDENCE**: Outline node n2 ("A mechanical check reduces stale plan entries") has `evidence[e1].filled_by: null`. The draft states a stronger version of the claim ("eliminates … entirely") and calls it settled. The only support offered is "Every team that has added one has seen the same result", which matches no outline slot. Scan: section "The mechanical check", paragraph at line 11, 41 words, ratio 0.683. It has the highest claim-marker density in the draft (assertive 2, connective 2, 9.756 per 100 words).
- **WHAT THE READER LOSES**: The rule at line 17 rests on n1–n3, but n2 reaches the reader as a bare claim the outline never backed, so the conclusion stands on an unsupported link.
- **PLAN-ENTRY**: `{"id": "s01", "source": "structure-critic", "location": {"line": 11, "quote": "So the check has to be mechanical, and a mechanical check eliminates stale plan entries entirely."}, "change": "Supply evidence for the mechanical-check claim or reduce it to the outline's strength and stop presenting it as settled.", "reason": "Outline n2 evidence slot e1 is empty, yet the draft states the claim more strongly than the outline and calls it settled."}`

**Clean classes**
- Order: clean. The draft's sections follow the outline order n1 → n2 → n3 → n4.
- Transition: clean. The scan reports 4 of 4 boundaries marked and `unmarked: []`.
- Imbalance: clean. Section ratios run from 0.683 to 1.6, and none is extreme.

**Scanner defects**: none.

REVISE
