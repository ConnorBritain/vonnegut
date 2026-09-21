# CLAUDE.md snippet

**Most people need nothing here.** The skill is dispatcher-triggered: its
`description` names the situations — outlining a brief, saying what a draft
argues, comparing outline revisions — so those requests reach it without a
rule. A planner is not a gate the model has an incentive to skip.

Add the block below only if you have the specific problem it solves: **drafts
start without an outline and nobody notices until review.**

---

```markdown
## Prose outline   <!-- vonnegut: prose-outline -->

Before drafting a piece longer than a note, produce or load its outline with
the `prose-outline` skill and show it. Save it only if I say so. When a draft
exists, run the scan rather than describing its structure by eye.

Skip for replies, notes and throwaway writing — say so when you do.
```

---

## Notes

- **State the trigger and the consequence, nothing else.** The skill's own
  file holds its method.
- **Write the exemption in.** A rule with no stated skip gets routed around
  silently the first time it is inconvenient.
- **Do not bind the structure critic here.** It lives in `prose-review` and is
  bound, if at all, by that bundle's wiring.
