I indexed `./book` (three files: `essay-01.md`, `essay-02.md`, `notes.md`) and the continuity check came back **CLEAN**. The bible is drafted but not saved anywhere yet. It needs your answers below first.

**Continuity check.** The index found no term defined two different ways, no attribute stated two ways, and no dates that disagree. Its only flag was the Cadence Rule appearing twice, nearly word for word:
- `essay-01.md:3`: "The Cadence Rule is the one habit that made the scanner useful: never calibrate on fewer than ten pieces."
- `notes.md:3`: "The Cadence Rule: never calibrate on fewer than ten pieces."

The next line in `notes.md` says to restate the rule in every essay that mentions calibration, so the critic read the repeat as deliberate.

**Proposed entries.** Tell me which to keep and what to correct:

| id | kind | name | definition (as the index read it) | first seen |
|---|---|---|---|---|
| b1 | term | Cadence Rule | "one habit that made the scanner useful" | essay-01.md:3 (4 mentions in 3 files) |
| b2 | term | lock | "named snapshot of the bands you calibrated on purpose" | essay-02.md:3 |
| b3 | term | pieces | "lock on noise" | essay-02.md:3 |

1. **b1:** do you want the definition to be the rule itself, "never calibrate on fewer than ten pieces"? Or keep the index's wording, or both?
2. **b3** is probably a misread. The sentence is "a lock made from fewer than ten pieces is a lock on noise", and the pattern-matcher took that as a definition of "pieces". Drop it, or would you like an entry for "pieces" with a different definition?
3. Is anything missing? The index only catches surface patterns, so it may have missed recurring concepts like "the scanner", "bands", "calibration" or "the corpus". Pronouns are never resolved, and a contradiction made in paraphrase with no shared term wouldn't be caught.

**Saving.** No identity registry exists on this machine (`/root/.config/prose-author/identities`). Once you confirm the entries, I'll write them to a proposal file in my scratchpad, but they can't be saved as a lasting project bible from here. I won't create a registry myself.
