I've indexed the three files in `./book`, drafted bible entries and run the continuity check. Nothing has been saved, and nothing can be yet: there's no writing-identity registry on this machine, so the bible stays local to this session. I haven't created a registry.

## Contradictions

**One confirmed: Mara's eye colour.**
- `book/chapter-01.md:3`: "Mara had grey eyes and a habit of counting doors."
- `book/chapter-02.md:3`: "Mara had green eyes, and she crossed at the ford…"
- Your note at `book/notes.md:3` says "Grey eyes (do not change this; it matters in chapter nine)." Which is right?

**Two more the check couldn't judge.** The indexing tool attached the wrong sentences to these two spots, so the checker had nothing usable to quote and dropped them. This is what the files actually say at the lines it flagged. You decide whether they conflict:
- **Year of the flood:** `book/chapter-01.md:3` says "closed since the flood of 1898". `book/chapter-02.md:5` says "the flood of 1889 had taken".
- **Where the Harrow road goes:** `book/chapter-01.md:3` says "the old road to the coast". `book/notes.md:5` says "The Harrow road is the road to the quarry, not the coast — fix chapter one."

**Repeated passage, treated as intentional:** the grandmother's honey in pickle jars appears in both `book/chapter-01.md:7` (she tells Teodor) and `book/chapter-02.md:7` (she remembers it). The check read the second as a callback, not an accidental repeat.

## Draft entries (batch 1)

| id | name | kind | what the draft says | first seen |
|---|---|---|---|---|
| b1 | Book of Hours | term | "joke about the monastery" (from your notes) | `book/chapter-01.md:5` |
| b2 | Harrow | concept | no definition | `book/chapter-01.md:3` |
| b3 | Harrow road | term | "first building she had ever loved" | `book/chapter-01.md:3` |
| b4 | Mara | character | eyes: **grey or green? (your call)**, habit: counts doors when anxious | `book/chapter-01.md:3` |

Corrections I'd suggest:
- **b3:** the auto-extracted definition is wrong. That phrase describes the mill, not the road. Once you settle the coast-or-quarry question, I'll put the right definition in.
- **b2:** this is probably redundant with b3. Drop it unless "Harrow" means something on its own.
- **b1:** should the definition also say what it is, along the lines of "Teodor's name for the flour ledger; a joke about the monastery"?

The index didn't pick up **Teodor** as a name, so he isn't in the draft. He appears in all three files: he has kept the ledger for eleven years and arrives at noon. Do you want him added as a character?

Tell me which entries to keep, the corrections, and your answers on the eye colour, flood year and road. I'll write the confirmed set to a local file in my scratchpad. I can save it permanently only after a writing identity is set up on this machine.

Limits of the check: it doesn't work out who "she" or "he" refers to. It only catches descriptions and definitions written in a few fixed sentence patterns. A contradiction phrased without any shared wording won't be caught.
