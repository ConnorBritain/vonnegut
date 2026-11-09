# Negative (structure holds) — essay-second-reason-d3 · CLEAN

Mode: intended-outline. I checked the draft against outline.json, nodes n1 to n4.

No findings.

- **Unsupported claims: clean.** Every outline evidence slot is filled, and each one appears in the draft after its claim:
  - n1.e1 is at line 7, "According to the last three retrospectives…".
  - n1.e2 is at line 9, "A file under version control has a history…".
  - n2.e1 is at line 15, "In 2024 our team added one…".
  - n3.e1 is at line 19, "a small forced edit is where a reviewer looks".
  - n4.e1 is at line 21, "Therefore the rule is simple." It follows from the claims before it.
- **Order: clean.** The sections run n1 (line 5), n2 (line 11), n3 (line 17), then n4 (line 21), which matches the outline's order 1 to 4. Each premise is established before the section that depends on it.
- **Transitions: clean.** The scan lists three unmarked boundaries. None of them leaves a gap:
  - **Line 7** ("A plan written in a document nobody opens is a plan nobody follows.") comes straight after the heading and restates the thesis from line 3.
  - **Line 9** ("There is a second reason.") tells the reader outright that it is adding to the point before it.
  - **Line 19** ("The usual objection is that a mechanical check makes people update the plan without thinking.") sits under a heading that announces the turn. It picks up "mechanical" from line 15.
- **Imbalance: clean.** The ratios run from 0.493 to 1.128, which is not extreme. The shortest section is "Why the Roadmap Must Be a File" (52 words, 0.493). It is the introduction that states the thesis, and it is short by design.

*Scanner defects*
- Line 9: the scan reports `transition_in.marker: null` for "There is a second reason." The tool's marker list apparently does not include ordinal words like "second". As a result, an explicitly signalled boundary shows up in `transitions.unmarked`.

CLEAN

RESULT: CLEAN | findings=0 | uncited=0 | authorship_claims=0
