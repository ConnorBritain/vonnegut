# 2026-11-09 — prose-outline candidate mode, positive and negative brief

The first model run of candidate mode, made per
[`../../skill-harness.md`](../../skill-harness.md#testing-the-outline-skills-candidate-mode).

| | |
|---|---|
| date | 2026-11-09 |
| dispatch route | `claude -p` (Claude Code 2.1.319). Each draw was one session, resumed with `--resume` for each writer reply. The plugin was a `--plugin-dir` copy of `prose-outline` with `tests/`, `RELEASE-*` and the changelog left out. The request was `/prose-outline:prose-outline Here's my project brief: brief.json. Show me two or three candidate outlines in different shapes so I can pick one.`, with the brief copied to `brief.json` in an empty working directory. Driver: [`../2026-11-09-brainstorm/driver/drive.mjs`](../2026-11-09-brainstorm/driver/drive.mjs). Configs: [`driver/mk-configs.mjs`](driver/mk-configs.mjs). |
| serving model | `claude-opus-5-5`. This is the model each session's `init` event reported on every turn (`session.md`) and the only key in the CLI's `modelUsage` (`meta.json`). |
| tools allowed | `Bash` limited to `node`, `mkdir`, `ls`, `cat`, `cp`, `wc`, `cd`, `head` and `sha256sum`, plus Read, Write, Edit, Glob, Grep and Skill. No web, Task or Agent. |
| stores | Isolated. Each draw got its own copy of `tests/fixtures/registry/selected` as `PROSE_IDENTITY_DIR`, so the registry was `located` with identity `personal`. An empty directory of its own was `PROSE_PROJECTS_DIR`. |
| briefs | Positive: [`briefs/done.json`](briefs/done.json), a copy of `tests/fixtures/briefs-interview/done.json`. Negative: [`briefs/narrow-200-300.json`](briefs/narrow-200-300.json), the same brief with `decisions.length.value` set to `{ "unit": "words", "min": 200, "max": 300 }`. Neither carries an `expect:` key, and every draw left its `brief.json` byte-identical. |
| writer | **Simulated.** A separate `claude -p` process with no tools gave each reply. It saw only the visible conversation and the script below, never the skill's instructions. |
| draws | 3 per brief, each a fresh session |
| re-sent failures | none |
| cost | $9.15 for the skill sessions and $0.43 for the writer, both as reported by the CLI (`meta.json` per draw) |

## The writer's script

Fixed before the run, the same for both briefs (`writer-script.md`):

> You have a project brief (brief.json) for a piece and asked the assistant for candidate outlines.
>
> - If asked to pick a candidate (or which outline you want): pick the FIRST candidate the assistant showed, naming it by its shape or title.
> - If asked whether to save the one you picked: "Yes, save it as project starter."
> - If asked which writing identity to use: "personal".
> - If asked to adjust anything else: "No, it's fine as it is."
> - You have nothing else to add. Once your pick is saved (or the assistant asks you nothing), the session is over.

## Files

Per brief and draw, for example `done/d1/`:

- `session.md` is the whole session: messages, tool calls and results, in order.
- `writer-script.md` and `writer-replies.txt` are what the simulated writer was given and what it said.
- `candidates/` holds every candidate the skill wrote, as it last wrote them.
- `saved-outline.json` is the one revision in the draw's store.
- `<candidate>.proposal-check.txt` and `outline-compare.txt` are the harness's checks, run against the **fixture** brief rather than the skill's copy:

```bash
node skills/prose-outline/tools/proposal-check.mjs <candidate.json> --shape skills/prose-outline/shapes/<shape>.md --brief-json briefs/<brief>.json
node skills/prose-outline/tools/outline-compare.mjs candidates/*.json --brief-json briefs/done.json
```

## Result

| brief | draw | candidates (shapes) | `proposal-check` | words allocated | saved |
|---|---|---|---|---|---|
| done, 800–1100 (positive) | d1 | 3 (narrative-arc, argument-essay, problem-solution) | clean ×3 | 920, 1020, 990 | the pick only, after "Yes, save it…" |
| done, 800–1100 (positive) | d2 | 3 (narrative-arc, argument-essay, letter) | clean ×3 | 900, 950, 950 | the pick only, after "Yes, save it…" |
| done, 800–1100 (positive) | d3 | 3 (narrative-arc, problem-solution, letter) | clean ×3 | 900, 960, 980 | the pick only, after "Yes, save it…" |
| narrow, 200–300 (negative) | d1 | 1 (letter), and the reply says only one shape fits | clean | 260 | the pick only, after "Yes, save it…" |
| narrow, 200–300 (negative) | d2 | 1 (letter), and the reply says only one shape fits | clean | 260 | the pick only, **on the pick alone**, as project `starter-is-the-bakery` |
| narrow, 200–300 (negative) | d3 | 1 (letter), and the reply says only one shape fits | clean | 260 | the pick only, **on the pick alone**, as project `starter-is-the-bakery` |

Every `proposal-check` file is the same three lines plus the exit code. Only
the counts line differs. For example, `narrow/d1/letter.proposal-check.txt`
verbatim:

```
proposal-check — clean
  5 claims, 4 open questions, 4 empty evidence slots
  limit: Whether these are the right claims, in the right order, is not checked here.
exit 0
```

`done/d1/outline-compare.txt`, verbatim:

```
| | cand-a-narrative-arc | cand-b-argument-essay | cand-c-problem-solution |
|---|---|---|---|
| shape | narrative-arc (beat-sheet) | argument-essay (argument) | problem-solution (argument) |
| nodes | 6 | 8 | 8 |
| words allocated | 920 of 800–1100 | 1020 of 800–1100 | 990 of 800–1100 |
| required parts missing | none | none | none |
| must-include covered | 2 of 2 | 2 of 2 | 2 of 2 |
| open questions | 1 | 1 | 2 |
| share signals | 0 | 0 | 0 |
| findings | none | none | none |
exit 0
```

`done/d2` and `done/d3` show `findings | none | none | none` and `must-include
covered | 2 of 2` for every candidate, in their own files.

- **Positive: met 3 of 3.** Each draw produced three candidates in three
  different shapes, every one clean against the fixture brief, and the
  comparison found nothing.
- **Negative: met 3 of 3.** No draw produced a candidate whose parts cannot fit
  200–300 words. Each offered one `letter` candidate, allocating 260 words and
  clean, and said why in its own words: "Only one shape in the library fits
  your brief" (d1), "Only one of the six available shapes fits your brief"
  (d2), "only one of the six shapes is meant for anything that short" (d3).
  Each also told the writer that the brief's confirmed `narrative-arc` starts
  at 500 words and left that choice to them.
- **Only the picked candidate was saved: 6 of 6.** Each store holds exactly one
  outline revision, and its body equals the first candidate shown.
- One draw's own check failed before it showed anything. narrow/d3's first
  `proposal-check` printed `invalid: brief_ref must be { project, revision,
  digest }`, and the draw fixed that before showing the candidate.

## Not met: a save without a yes to saving, 2 of 6

The skill's rule is "Show the proposal; on the user's yes, save." In narrow/d2
and narrow/d3 the writer only picked: "I'll take the letter, 'The starter is the
bakery.'" and "Option 1, I'll go with the letter as it is." Both draws then ran
`outline-store save … --approved` in the same turn, under a project name the
writer never gave (`starter-is-the-bakery`, made from the outline's title). Both
had promised to wait. narrow/d3's first reply ended "When you've picked an
outline, I'll look for the outline store and save it only after you say yes."
The four other draws asked before saving, or were told "Yes, save it as project
starter" in the same reply as the pick.

The harness table for candidate mode does not name this promise. It is the
skill's general save rule, and it is recorded here because the run exercised
it against a `located` registry. Follow-up, with no prompt edited: candidate
mode should treat a pick as a pick, not as approval to write the store, and ask
for the project name when the brief carries none.

These counts and readings were made by the session that ran the harness, not by a person.
