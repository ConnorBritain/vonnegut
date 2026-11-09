Mode: intended-outline. An outline was supplied, so all four classes were assessed against it.

**Finding 1**
- **CLASS**: unsupported-claim
- **LOCATION**: line 11, "So the check has to be mechanical, and a mechanical check eliminates stale plan entries entirely. Every team that has added one has seen the same result, because a script cannot forget and a person always eventually does. This is settled."
- **EVIDENCE**: Outline node n2 ("A mechanical check reduces stale plan entries.") has slot e1 with `filled_by: null`. The draft makes a stronger claim than the outline ("eliminates … entirely" where the outline says "reduces") and calls it settled ("This is settled."). The only support is an unsourced generalisation ("Every team that has added one"). Scan section "The mechanical check": paragraph line 11, assertive markers 2, per_100_words 9.756, the highest density in the draft.
- **WHAT THE READER LOSES**: The thesis needs "checked by the build" to be justified, and the one claim that justifies it has no evidence while being presented as more certain than anything else in the essay.
- **PLAN-ENTRY**: `{"id": "s01", "source": "structure-critic", "location": {"line": 11, "quote": "a mechanical check eliminates stale plan entries entirely"}, "change": "Supply evidence for outline node n2, or reduce the claim to what the evidence supports and remove the assertion that it is settled.", "reason": "n2 evidence slot e1 is empty; the draft states the claim more strongly than the outline and as settled."}`

**Finding 2**
- **CLASS**: transition
- **LOCATION**: line 11, "So the check has to be mechanical, and a mechanical check eliminates stale plan entries entirely."
- **EVIDENCE**: Scan boundary into section "The mechanical check": `transition_in.marker: "so"`, `kind: "consequence"`, `lexical_overlap: 0.047`. The scan counts this boundary as marked. The section before it (n1, lines 5–7) shows that a plan must live next to the code. It says nothing about checking. Under n1 and n2 the two claims are siblings, so neither follows from the other.
- **WHAT THE READER LOSES**: "So" says that mechanical checking follows from where the plan lives. Nothing before line 11 shows that, so the reader is handed a step in the reasoning that never happened.
- **PLAN-ENTRY**: `{"id": "s02", "source": "structure-critic", "location": {"line": 11, "quote": "So the check has to be mechanical"}, "change": "Replace the consequence link into this section with a bridge that matches the outline's relation between n1 and n2.", "reason": "The marker claims n2 follows from n1; the outline treats them as independent claims and line 7 does not supply the premise."}`

Clean: order, imbalance.

Scanner defects: none.

REVISE
