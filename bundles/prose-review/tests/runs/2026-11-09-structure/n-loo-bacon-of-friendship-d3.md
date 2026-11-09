# Negative (structure holds) — loo-bacon-of-friendship-d3 · CLEAN

Mode: draft-only. No intended outline was supplied, so I made only transition and imbalance findings. I made no assessment of support (class 1) or order (class 2).

No findings.

- **Unsupported claims:** not assessed, because there is no intended outline.
- **Order:** not assessed, because there is no intended outline.
- **Transitions:** clean. The scan lists five unmarked boundaries, and the paragraph after each one does pick up from the paragraph before it:
  - **Line 25.** "A principal fruit of friendship…" follows a paragraph that ends on being "unfit for friendship". This is the essay moving from its premise to its first argument, not a gap.
  - **Line 36.** "…this fruit of friendship whereof we speak" points straight back to the paragraph before.
  - **Line 54.** The run of examples (Sylla, Cæsar, Augustus, Tiberius, Severus) supports the line 47 claim "this hath been done… by the wisest and most politic", and line 84 ("Now, if these princes…") draws the conclusion from them.
  - **Line 94.** The draft returns to the first fruit and says so at lines 104–105: "wherewith I will conclude this first fruit of friendship".
  - **Line 119.** "The second fruit of friendship is healthful and sovereign for the understanding, as the first is for the affections" names both the fruit it is leaving and the one it is starting.
- **Imbalance:** clean. The scan finds one section (ratio_to_median 1, max_ratio 1, min_ratio 1), so there is nothing to compare.

*Scanner defects*
- **`sections[0].end_line` is 191.** That is the line where the last paragraph starts, but that paragraph runs to line 217. If `end_line` is supposed to mean the section's last line, the scan's number is wrong.
- **The transition check doesn't see some links.** At line 119, "The second fruit… as the first" is reported as unmarked because ordinal links like "second… first" aren't on the scan's list of markers. At line 36, the "this" in "this fruit" isn't the first word of the paragraph, so the scan doesn't count it. Both follow from the scan's stated definition, but they make the unmarked count higher than it should be for numbered argument structures like this one.

CLEAN

RESULT: CLEAN | findings=0 | uncited=0 | authorship_claims=0
