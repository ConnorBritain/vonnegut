I indexed the book (`chapter-01.md`, `chapter-02.md`, `notes.md`), and the continuity critic found **two contradictions** for you to settle. Nothing is saved yet. There's also no writing-identity registry on this machine, so the bible will live in this task's folder only, and I won't create a registry.

## Contradictions the critic found

**1. Mara's eyes**
- `chapter-01.md:3`: "Mara had grey eyes and a habit of counting doors."
- `chapter-02.md:3`: "Mara had green eyes, and she crossed at the ford…"
- (`notes.md:3` says "Grey eyes (do not change this; it matters in chapter nine).")

**2. The year of the flood**
- `chapter-01.md:3`: "…the Harrow road is the old road to the coast, closed since the flood of 1898."
- `chapter-02.md:5`: "The Harrow road, which the flood of 1889 had taken, was where the sacks had gone."

Which version is right in each case?

The critic found no other contradictions. It dropped three candidates:
- **The bees anecdote.** It appears in both chapters, but the second time Mara is remembering it, so it doesn't count as a contradiction.
- **The Book of Hours.** The monastery-joke note fits with the ledger having that name.
- **The Harrow road.** Your note already says to fix it (below).

## Proposed entries, batch 1

The index's suggestions had some parsing errors, so I've corrected them against the text:

| id | Kind | Name | Definition / attributes | First seen |
|---|---|---|---|---|
| b1 | term | Book of Hours | Teodor's name for the flour ledger; a joke about the monastery | ch-01:5 |
| b2 | term | Harrow road | **Coast or quarry?** ch-01:3 says "old road to the coast"; `notes.md:5` says "the road to the quarry, not the coast — fix chapter one" | ch-01:3 |
| b3 | character | Mara | eyes: **grey or green?** · habit: counts doors (the note adds "when anxious") | ch-01:3 |
| b4 | character | Teodor | keeper of the ledger for eleven years; arrives at noon | ch-01:5 |

Corrections to the index's suggestions:
- **Harrow road:** the index gave its definition as "first building she had ever loved". That phrase describes the mill, not the road, so I took it out.
- **Harrow:** the index also suggested "Harrow" as its own entry. I dropped it because it's the same thing as the road. Tell me if you want it back.
- **Teodor:** the index didn't suggest him. I added him from the text. Keep him or cut him?
- **The mill** (ch-01:3, ch-02:5) could be a fifth entry if you want it.

## Limits of the index
- Pronouns aren't resolved, and attributes are only caught when they're stated in a set pattern ("had grey eyes").
- A contradiction written in different words, with no term in common, won't be caught.
- The index attached the wrong sentence to several occurrences and got a few line numbers wrong. Every quote above has been checked against the files.

Tell me which entries to keep, the right eye colour, the flood year, and coast or quarry. I'll then write the confirmed proposal to `/tmp/claude-0/-tmp-claude-0--home-user-vonnegut-114b4780-cec9-5a21-b936-a7727c043a5c-scratchpad-skillwork-prose-bible-project-d3/7101e01d-5bac-42d3-b73d-244494fe71ec/scratchpad/proposal.json`.
