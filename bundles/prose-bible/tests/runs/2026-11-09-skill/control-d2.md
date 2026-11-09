I indexed the three files in `./book` (essay-01.md, essay-02.md, notes.md), checked them for contradictions, and the index produced three candidate entries for the bible. Nothing is saved yet. I need you to confirm or correct each candidate first.

## Contradictions: none

The continuity checker found no contradictions. It flagged one passage as repeated:

- **essay-01.md:3**: "The Cadence Rule is the one habit that made the scanner useful: never calibrate on fewer than ten pieces."
- **notes.md:3**: "The Cadence Rule: never calibrate on fewer than ten pieces."

Both say the same rule, and notes.md tells you to "restate it in every essay that mentions calibration", so the repeat looks intentional. 2021 appears in all three files, always as the same year, so the dates don't conflict either.

## Candidate entries

| id | kind | name | definition (as the index extracted it) | first seen |
|---|---|---|---|---|
| b1 | term | Cadence Rule | "one habit that made the scanner useful" | essay-01.md:3 |
| b2 | term | lock | "named snapshot of the bands you calibrated on purpose" | essay-02.md:3 |
| b3 | term | pieces | "lock on noise" | essay-02.md:3 |

Points to decide:

1. **b1 Cadence Rule:** the index only captured the "is a…" clause. Should the definition include the rule itself ("never calibrate on fewer than ten pieces")? It is used in all three files.
2. **b2 lock:** keep it as written?
3. **b3 pieces:** this came from matching the words "ten pieces is a lock on noise" in essay-02.md:3. It reads less like a definition of "pieces" than the others do. Keep, reword, or drop?
4. **Anything missing?** The index can only find capitalised names and terms defined in a few fixed sentence shapes, so it may have missed things you'd want in the bible. One example is the 2021 newsletter post, which all three files mention.

## Saving

No writing-identity registry exists on this machine, so the bible can't be saved to a project store. Once you've confirmed the entries, I'll write them to a proposal file in my scratchpad folder, and the bible will exist only there for this session.
