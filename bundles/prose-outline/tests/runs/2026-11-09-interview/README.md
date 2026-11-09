# 2026-11-09 — prose-interview skill, positive and negative

The first model run of the skill, made per
[`../../skill-harness.md`](../../skill-harness.md#testing-the-prose-interview-skill).

| | |
|---|---|
| date | 2026-11-09 |
| dispatch route | `claude -p` (Claude Code 2.1.319). Each draw was one session, resumed with `--resume` for each writer reply. The plugin was a `--plugin-dir` copy of `prose-outline` with `tests/`, `RELEASE-*` and the changelog left out. The request was `/prose-outline:prose-interview Interview me about the starter project.` Driver: [`../2026-11-09-brainstorm/driver/drive.mjs`](../2026-11-09-brainstorm/driver/drive.mjs). |
| starting brief | The monologue's brief after brainstorming: the store that [`../2026-11-09-brainstorm`](../2026-11-09-brainstorm/README.md) monologue/d1 saved (revision 2, four angles, no decisions, the cleaned transcript cached). Copies are in [`start/`](start/). Each draw got its own copy of that store. |
| serving model | `claude-opus-5-5`. This is the model each session's `init` event reported on every turn (`session.md`) and the only key in the CLI's `modelUsage` (`meta.json`). |
| tools allowed | `Bash` limited to `node`, `mkdir`, `ls`, `cat`, `cp`, `wc`, `cd`, `head` and `sha256sum`, plus Read, Write, Edit, Glob, Grep and Skill. No web, Task or Agent. |
| stores | Isolated. Each draw's `PROSE_IDENTITY_DIR` was its own copy of the fixture registry `tests/fixtures/registry/selected` (`located`, identity `personal`). Its `PROSE_PROJECTS_DIR` held its own copy of the starting brief. |
| writer | **Simulated.** A separate `claude -p` process with no tools gave each reply. It saw only the visible conversation and its script, never the skill's instructions. |
| draws | 3 per script, each a fresh session |
| re-sent failures | none |
| cost | $42.65 for the skill sessions and $2.07 for the writer, both as reported by the CLI (`meta.json` per draw) |

## The writer's scripts

Both scripts were fixed before the run, and `writer-script.md` in each draw
holds the exact text. They share this opening:

> If the assistant quotes something from your memo and asks you to confirm it, confirm it when it matches the answer below for that topic, and otherwise give the answer below instead.

**Positive** answers:

| Decision | Answer |
|---|---|
| Angle | the bakery one |
| Audience | "Team leads who reward visible output over slow groundwork." |
| Purpose | "Make readers protect the unglamorous early work on their teams." |
| Form | "A newsletter, read on the web." |
| Length | "800 to 1100 words." |
| Shape | "Narrative arc." |
| Thesis | "The slow invisible part of the work decides the result, long before anyone sees it." |
| Must include | "The month of feeding the starter, and the eleven years of notebooks." |
| Exclude | "The meetings material. Leave it out." |
| Links | "None." |
| Assumptions | "None." |
| Saving | "Yes, save." |

**Negative**: the same answers, except:

- Purpose: "Your call."
- Must include: "Your call."
- Length: "Skip. I don't want to commit to a length yet." If the assistant later says the skipped length is blocking something and asks whether to answer it now, the reply is "No, leave it skipped for now."

## Files

Per script and draw, for example `negative/d1/`:

- `session.md` is the whole session: messages, tool calls and results.
- `writer-script.md` and `writer-replies.txt` are what the simulated writer was given and what it said.
- `revisions/<N>.json` holds every brief revision the draw saved. Revisions 1 and 2 are the starting brief, in `start/`.
- `brief-check-<N>.txt` and `.json` are the harness's check of each saved revision, against the cached transcript:

```bash
node skills/prose-interview/tools/brief-check.mjs revisions/<N>.json --clean start/cached-transcript.txt [--json]
```

Each draw's cached source is byte-identical to `start/cached-transcript.txt`.

## brief-check on every saved revision, verbatim

```
positive/d1/brief-check-000003.txt
brief-check: not done — next: shape (What shape should it take?)
  open (required): shape, thesis
  open (optional): must_include, exclude, links, assumptions
exit 1

positive/d1/brief-check-000004.txt
brief-check: done — next: must_include (What has to be in it — stories, examples, facts?)
  open (optional): must_include, exclude, links, assumptions
exit 0

positive/d2/brief-check-000003.txt and positive/d3/brief-check-000003.txt (identical)
brief-check: done
exit 0

negative/d1, d2 and d3 brief-check-000003.txt (identical)
brief-check: not done
  open (required): shape
  skipped: length
  blocked by: length
exit 1
```

In every `.json` output, `evidence_problems` and `evidence_unverified` are `[]`.

## The four counts the harness asks for

| draw | required questions put as confirmations of a found answer (quoted with its line) | saved `source: "transcript"` | turns asking more than one decision | `source: "writer"` holding words the writer did not say | said done while brief-check said otherwise |
|---|---|---|---|---|---|
| positive d1 | 4 of 7 required: audience (l.23), form (l.23), shape (from the brief's angle), thesis (l.11) | form | 0 | none | no |
| positive d2 | 2 of 7: form (l.23), thesis (l.11) | form | 0 | exclude: "The Monday team-meeting material" for "The meetings material" | no |
| positive d3 | 1 of 7: thesis (l.11) | none | **1**: after the required seven, one turn listed all four optional decisions together, and the writer answered them in one reply | must_include: "The first month of feeding the starter" for "the month of feeding the starter" | no |
| negative d1 | thesis (l.11) | none | 0 | exclude: "The Monday team-meeting material (transcript lines 13–21)" | no |
| negative d2 | form (l.23), thesis (l.11) | form | 0 | exclude: "The Monday team meeting material (memo lines 13-21)" | no |
| negative d3 | thesis (l.11) | none | 0 | exclude: "The Monday team meeting material (transcript lines 13-21)" | no |

I counted these by reading each session. Notes on the columns:

- **Confirmations.** A question counts when the session quoted a found answer
  and asked the writer to confirm it. It does not count when the session
  quoted the nearest line as context and then gave its own recommendation.
- **The scripted writer overrode found answers.** It changed the audience the
  sessions found ("your newsletter readers", line 23) and the thesis (line
  11), as its script told it to. Those answers are rightly saved as
  `source: "writer"`.
- **Save prompts are not counted as extra questions.** Many turns ended with
  "say save" beside the decision question.
- **The turn that reported the blocked length.** In each negative draw it asked
  both whether to set a length now and whether to save.

## Result against the promises

**Positive: not met as written, 0 of 3.** The promise is that "the first
questions are **confirmations** of answers found in the transcript". In every
draw the first question was the angle, put as an open choice. The sessions
quoted lines 31 and 33 to show that the memo leaves it undecided.

- Confirmations did occur, but later and unevenly: 4, 2 and 1 of the seven
  required questions.
- Every draw confirmed the thesis from line 11.
- The mechanical half holds: the transcript-sourced decisions that were saved
  (form, in positive d1 and d2) carry line-23 evidence that `brief-check
  --clean` verifies (`evidence_problems: []`).
- Each draw said the monologue names no audience for the bakery piece, which
  is accurate. The fixture `done.json`'s audience evidence (line 11) is a
  sentence about the bread, not about a reader. So the promise may expect more
  confirmations than this transcript supports. Reported, not changed.

**Negative: met 3 of 3 on the stated promises.**

- Every "your call" (purpose and must_include, 6 of 6) was saved as
  `source: "recommended"`, confirmed. None was saved as `writer`.
- The skip was saved as `value: null` with the writer's reason.
- No draw said done. Each said "The interview isn't finished" and named
  `length` as blocking `shape`, matching `brief-check: not done … blocked by:
  length`.
- One decision was asked per turn.
- Every save (`decide --approved`) came in the turn after the writer said
  "save", in all six draws.

**Not met in 5 of 6 draws: `source: "writer"` records hold words the writer did
not say.** All three negatives saved the exclusion as "The Monday team(-)meeting
material (transcript lines 13–21)" when the writer said "The meetings
material". positive d2 added "Monday", and positive d3 added "first" to a
must-include item. These are small additions, but they are the session's words
filed under the writer's name, which is what this count exists to catch.
Follow-up, with no prompt edited: record the writer's answer verbatim, and put
any locating detail in `evidence`, not in `value`.

These counts and readings were made by the session that ran the harness, not by a person.
