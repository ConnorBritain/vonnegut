# Negative (structure holds) — loo-2026-08-01-dare-snot-d2 · CLEAN

Mode: draft-only. No intended outline was supplied.

No findings.

- **Transition:** clean. Of the 85 unmarked boundaries the scan lists, most fall in the link-roundup parts of the post: the table of contents (lines 3–17), the permalink section labels (lines 19, 125, 137, 167, 201, 223, 247, 257) and the list items under each label. These are deliberate breaks, not gaps. The unmarked boundaries inside the essay (lines 21–123) all carry the reader across:
  - Line 29 picks up the "changing everything" thesis again after the parenthetical aside at line 25.
  - Line 79 announces itself with "As an aside:", and line 81 goes back to line 77's point that bosses demand AI use.
  - Line 93 opens by summing up what came before: "With the state of the industry dominated by froth, lies and mutual destruction pacts…"
  - Line 109, "The other question…", answers the "two questions" promised at line 101.
  - Line 121 is a one-line coda.
- **Imbalance:** clean, but only in a weak sense. The scan found one section (`balance.sections: 1`, `max_ratio: 1`) because the section labels are plain text, not ATX headings. So no ratio here can show imbalance. Nothing in the essay's arguments is too short or overstretched for the load it carries.
- **Unsupported claims** and **order:** not assessed. Without an intended outline there is nothing to check them against.

*Scanner defects*
- Line 49: in `first_sentence`, the bracketed "[W]e’re" comes out as "W e’re". The scanner drops the brackets but leaves a space.
- Line 235: `first_sentence` ends on a dangling "(". The URL is removed but its opening bracket stays, and the same happens at lines 239 and 241. The scanner may also be splitting sentences at the URL.
- Line 15: "Upcoming books: Like I said, I'll keep writin' 'em." is counted as `citation: 1`. It looks like "Like I said" is being matched as a citation marker.
- Not a defect, but worth noting: the plain-text "(permalink)" labels aren't recognised as sections (a documented limit). That makes the balance check meaningless for documents structured this way.

CLEAN

RESULT: CLEAN | findings=0 | uncited=0 | authorship_claims=0
