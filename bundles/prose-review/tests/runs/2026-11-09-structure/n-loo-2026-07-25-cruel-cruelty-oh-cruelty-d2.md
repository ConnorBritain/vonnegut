# Negative (structure holds) — loo-2026-07-25-cruel-cruelty-oh-cruelty-d2 · CLEAN

Mode: draft-only. No intended outline was supplied, so I only checked transitions and imbalance.

No findings.

- **Transitions: clean.** The scan lists 68 unmarked boundaries. None is a gap that leaves the reader without a link to the paragraph before:
  - **Lines 21–123 (the essay):** each unmarked opening still picks up the previous paragraph's content or works as a deliberate hinge. Examples: line 27 "Obviously, the fly in the ointment here is the risk in 'risk premium.'", line 53 starting the redlining example after line 51's "You don't need technology", line 83 starting the list that line 81 sets up, and line 97 "Here's where it gets interesting." moving from DMCA 1201 to Apple's defence of it.
  - **Lines 1–17 and 125–255:** this is a table of contents, link lists, event listings, book listings and a colophon. These are list items and deliberate breaks between sections.
- **Imbalance: clean.** The scan has no ATX headings, so it reads the draft as one section at ratio 1. That leaves no ratio to assess. The "(permalink)" lines act as section dividers in a flat newsletter layout, and the layout matches the contents list at lines 3–17.
- **Unsupported claims and order: not assessed.** With no intended outline, there is nothing to check them against.

Scanner defects:
- **Line 73:** the `first_sentence` runs two sentences together. The splitter missed the boundary after "a car that isn't."
- **Line 77:** the `first_sentence` stops at "(where else?)", so the splitter broke the sentence in the middle at a "?" inside brackets.
- **Line 15:** "Like I said, I'll keep writin' 'em." is counted as a `citation` marker. It looks like "said" matched the citation list even though nothing is being cited.
- **Lines 227, 231, 233:** the `first_sentence` values are cut off at "(" where a URL was removed.
- **Line 195:** counted as 2 sentences because of a "?" followed by "(BBC News)".

CLEAN

RESULT: CLEAN | findings=0 | uncited=0 | authorship_claims=0
