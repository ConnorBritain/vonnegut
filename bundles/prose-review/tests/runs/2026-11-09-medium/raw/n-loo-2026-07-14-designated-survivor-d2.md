**Findings**

- **CLASS**: constraint-unmet
- **LOCATION**: lines 1–17. The piece opens with "Today's links", then "Gerontocracy's failure mode: Where are the designated survivors?" and "Hey look at this: Delights to delectate.", and goes on to "Colophon: All the rest."
- **AS DELIVERED**: Someone who opens this in an inbox first sees a heading and then seventeen lines of section labels. The labels read like link text, but nothing in the delivered text links anywhere. The first sentence that gives a reason to keep reading is at line 21, more than a phone screen down. Many phone readers will stop before they get there.
- **CONSTRAINT**: hook-present

**Check defects**

- The `mechanical` array holds `hook-present` and `one-close`, but both are `kind: semantic`. The statuses and `summary` totals are consistent with each other, but the array's name misdescribes what it contains.

REVISE
