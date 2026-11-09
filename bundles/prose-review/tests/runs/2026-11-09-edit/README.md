# 2026-11-09 — prose-edit skill, positive and negative

The first model run of the chief editor's reading pass, made per the skill
harness in [`docs/roadmap/L-chief-editor.md`](../../../../../docs/roadmap/L-chief-editor.md)
§8.

| | |
|---|---|
| date | 2026-11-09 |
| dispatch route | `claude -p` (Claude Code 2.1.319), one session per draw, resumed with `--resume` for each writer reply. The plugin was a `--plugin-dir` copy of `prose-review` with `tests/`, `RELEASE-*` and the changelog left out. The request was `/prose-review:prose-edit Let's read draft.md together, section by section. The review has already run; the consolidated notes are in review.md.`, with `draft.md` and `review.md` in an empty working directory. Driver: [`../../../../prose-outline/tests/runs/2026-11-09-brainstorm/driver/drive.mjs`](../../../../prose-outline/tests/runs/2026-11-09-brainstorm/driver/drive.mjs). |
| serving model | `claude-opus-5-5`. Every skill session's `init` event reported it on every turn (`session.md`), and it is the only key in the CLI's `modelUsage` (`meta.json`). The three critic calls' `modelUsage` reported it too. |
| tools allowed | `Bash` limited to `node`, `mkdir`, `ls`, `cat`, `cp`, `wc`, `cd`, `head` and `sha256sum`, plus Read, Write, Edit, Glob, Grep and Skill. No web, Task or Agent. |
| stores | The skill writes no store, and its ledger is task-local. `PROSE_IDENTITY_DIR` and `PROSE_PROJECTS_DIR` still pointed at empty per-draw directories. |
| writer | **Simulated.** A separate `claude -p` process with no tools gave each reply from the script below. It saw only the visible conversation. |
| draws | 3 per draft, each a fresh session. All six used the same review, which was run once beforehand. |
| re-sent failures | none |
| cost | $14.07 for the skill sessions, $1.43 for the writer and $0.89 for the three critic calls, all as reported by the CLI |

## The review the pass reads (PROTOCOL.md steps 1–3, run once, before the draws)

Everything is in [`review/`](review/).

- **Positive draft:** `tests/fixtures/edit/draft-sectioned.md`.
  - Step 1: `outline-scan`.
  - Step 2: two critics in parallel, each its own `claude -p` process with its
    `agent.md` as the system prompt and Read limited to the staged draft.
    `prose-structure-critic` ran in draft-only mode on the scan, and
    `prose-reader-critic` ran with `personas/skeptical-cto.md` pasted in.
  - Results: the structure critic returned **CLEAN**. The reader critic
    returned **REVISE**, with WHERE I STOPPED at line 14 ("Teams work the same
    way.") and FORCED CHOICE at line 29 ("Give the new person a month on the
    slow part.").
  - Step 3: this session consolidated the reports into `review/pos/review.md`:
    two ranked notes, the structure critic's CLEAN, and both reports verbatim.
- **Negative draft:**
  `prose-tell-scan/tests/corpus/human-essays/gutenberg/chesterton-humanity-an-interlude.txt`,
  with its frontmatter stripped (no provenance label reached the skill).
  - It was chosen because it was CLEAN on 3 of 3 draws as `case-01` of
    [`2026-11-09-structure`](../2026-11-09-structure/README.md), and because
    `section-split` gives it four units.
  - `prose-structure-critic` was run fresh in draft-only mode and returned
    **CLEAN** ("No findings."). So `review/neg/review.md` holds no notes, only
    that CLEAN.
  - Its scanner-defect remarks are kept in the report as filed.

## The writer's scripts

Fixed before the run (`writer-script.md`). Shared lines:

> - The FIRST time the assistant shows you a section, before deciding anything, ask exactly once: "What do you think of this section yourself?" Never ask it again.
> - If asked whether to move on to the next section: "Yes, next." … When every section has been read …: "That's everything. Finish the pass." … reviser or plan: "Not now."

**Positive** answers:

- Accept the note on "Teams work the same way.", with the change "Say what the starter is on a team, the first weeks of onboarding work, before making the comparison."
- Decline the note on "Give the new person a month on the slow part.", because "The cost is the point. I'm not putting a number on it."
- Defer any other critic note.
- In "What to do on Monday", add the writer's own note on "because that is when you know": "Cut this phrase. It repeats the line about the moment she knew."

**Negative** answers:

- On "I began to hear what they were saying.", add the writer's own note: "Cut this sentence. The dialogue that follows makes it obvious."
- Defer any critic note.

## Files

Per draft and draw, for example `pos/d1/`:

- `session.md`, `writer-script.md`, `writer-replies.txt` and `meta.json`.
- `edit-notes.json` is the skill's ledger. `plan.json` and `plan-entries.json` are what the skill wrote.
- `notes-check.txt`, `notes-check.json` and `entries.json` are the harness's own re-run against the review's copy of the draft:

```bash
node skills/prose-edit/tools/notes-check.mjs edit-notes.json review/<pos|neg>/draft.md --export entries.json
```

## Result

`notes-check.txt`, verbatim and the same in all three positive draws:

```
notes-check: clean — 2 accepted, 1 declined, 0 deferred, 0 proposed
  exported 2 plan entries
exit 0
```

And the same in all three negative draws:

```
notes-check: clean — 1 accepted, 0 declined, 0 deferred, 0 proposed
  exported 1 plan entries
exit 0
```

| draft | draw | units read | critic notes in the ledger | writer notes | asked "what do you think?" | the draft |
|---|---|---|---|---|---|---|
| pos | d1 | 4 of 4 | N1 (line 14) in its unit; N2 (line 29) in its unit | 1 | declined to give its own read | unchanged |
| pos | d2 | 4 of 4 | same | 1 | declined | unchanged |
| pos | d3 | 4 of 4 | same | 1 | declined | unchanged |
| neg | d1 | 4 of 4 | **0** | 1 | declined | unchanged |
| neg | d2 | 4 of 4 | **0** | 1 | declined | unchanged |
| neg | d3 | 4 of 4 | **0** | 1 | declined | unchanged |

- **Positive: met 3 of 3.** Each consolidated finding appears in exactly one
  unit. Both reader-critic notes are in each ledger once, in two different
  units, and `notes-check` places each quote inside its unit.
  - Accepted notes were exported to the plan, and the declined note was not:
    `entries.json` holds `e01` (reader-critic, line 14) and `e03` (writer,
    line 30).
  - No critic was re-run, and the draft is byte-identical to the reviewed copy.
- **Negative: met 3 of 3.** The pass surfaced no notes except the writer's: one
  `source: "writer"` note in each ledger, and no critic or session source.
- **"Adds no finding of its own": met 6 of 6 by the ledger and by the reply.**
  To "What do you think of this section yourself?", every draw declined. Some
  examples:
  - "I won't give you my own read." (neg d1, neg d3)
  - "I'll keep my own opinion out of this." (pos d3)
  - "I'll stay out of it." (pos d2)

  Each then restated what the critics had found and named which critic owns
  each kind of question.

## Worth knowing

- **4 of 6 draws named specific passages when routing the question to an unrun
  critic.** These were neg d1–d3 and pos d1. For example: "the long run of
  paradoxes in the first paragraph ('crown of roses is also a crown of
  thorns'…)" (neg d1), and "the 'eleven years' detail or the rhythm of the list
  in lines 5–6" (pos d1). No judgement was attached to any of these, and no
  note entered a ledger. But pointing at a passage while saying "voice-critic
  would look at this" comes close to the opinion the skill rules out. Reported
  as a signal, not a breach.
- **pos d1 reworded the writer's change** to "Before 'Teams work the same
  way.', say what the starter is on a team: the first weeks of onboarding
  work." The skill asks for "the change, in their terms". pos d2 and d3
  recorded it verbatim.
- **neg d1 and neg d3 anchored the writer's note on the whole sentence.** The
  writer named "I began to hear what they were saying." The two draws quoted
  the sentence that ends with it, starting "And about the time that we reached
  the suburb of the city, …", because the scripted words are only the end of
  that sentence. neg d2 quoted the exact words. `notes-check` accepts both.

These counts and readings were made by the session that ran the harness, not by a person.
