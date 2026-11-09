# 2026-11-09 — prose-brainstorm skill, positive and negative transcript

The first model run of the skill, made per
[`../../skill-harness.md`](../../skill-harness.md#testing-the-prose-brainstorm-skill).

| | |
|---|---|
| date | 2026-11-09 |
| dispatch route | `claude -p` (Claude Code 2.1.319). Each draw was one session, resumed with `--resume` for the writer's reply. Plugins were `--plugin-dir` copies of the bundles with `tests/`, `RELEASE-*` and the changelog left out, so no harness doc, fixture or `expect:` key was reachable. The request was `/prose-outline:prose-brainstorm memo.txt`, with the fixture transcript copied to `memo.txt` in an empty working directory. The fixtures carry no frontmatter. Driver: [`driver/drive.mjs`](driver/drive.mjs). |
| serving model | `claude-opus-5-5`. This is the model each session's `init` event reported (`session.md`, every turn) and the only key in the CLI's `modelUsage` (`meta.json`). |
| tools allowed | `Bash` limited to `node`, `mkdir`, `ls`, `cat`, `cp`, `wc`, `cd`, `head` and `sha256sum`, plus Read, Write, Edit, Glob, Grep and Skill. No web, Task or Agent. Compound commands outside the list were denied, and those denials are visible in `session.md`. |
| stores | Isolated. Each draw got its own copy of `tests/fixtures/registry/selected` as `PROSE_IDENTITY_DIR`, so the registry was `located` with identity `personal`. An empty directory of its own was `PROSE_PROJECTS_DIR`. `~/.config/prose-author` does not exist on this machine, before or after the run. |
| writer | **Simulated.** A separate `claude -p` process with no tools gave each reply. It saw only the visible conversation and the script below, never the skill's instructions. |
| draws | 3 per transcript, each a fresh session |
| re-sent failures | none |
| cost | $8.12 for the skill sessions and $0.31 for the writer, both as reported by the CLI (`meta.json` per draw) |

## The writer's script

Fixed before the run. The same for both transcripts except the project name
(`starter` for the monologue, `walk` for the ramble); `writer-script.md` in
each draw holds the exact text:

> You recorded a voice memo (memo.txt) and handed it to the assistant to see what pieces it could become.
>
> - If asked whether to save anything (the brief, the angles, the transcript): "Yes, save it as project starter."
> - If asked which writing identity to use: "personal".
> - If asked to choose an angle: "Not yet — I'll decide later."
> - You have nothing else to add. Once the angles have been shown and saved (or the assistant asks you nothing), the session is over.

## Files

Per transcript and draw, for example `monologue/d1/`:

- `session.md` is the whole session: every message, tool call and tool result, in order. Results over 80 lines are trimmed, and the trim is marked.
- `writer-script.md` and `writer-replies.txt` are what the simulated writer was given and what it said.
- `angles.json`, `clean.txt` and `scan.json` are the skill's own task-local files, as it last wrote them.
- `saved-brief.json` is the brief revision the skill saved.
- `check.json` and `check.txt` are the harness's check over the skill's files:

```bash
node skills/prose-brainstorm/tools/angles-check.mjs angles.json clean.txt --scan scan.json --expect <concrete|underspecified> [--json]
```

`check-rescan.txt` repeats that check against the harness's own scan of the
fixture (`harness-rescan/`). It was needed because monologue/d1's `scan.json`
is a trimmed copy the session wrote out by hand: it keeps the segments but
drops `recurring_terms`. Every draw's `clean.txt` is byte-identical to the
harness's.

Scratch paths are shortened. `<plugins>` is the plugin copy, `<draw>` the
draw's directory, and `<task>` the session's own scratchpad.

## Result

`check.txt`, verbatim, is identical on all six draws:

```
angles-check: ok
exit 0
```

`check-rescan.txt` is the same on all six. The expectation block of
`check.json`, verbatim, for monologue/d1 and rambling/d1 (the other draws match
their transcript's):

```
  "expectation": {
    "expect": "concrete",
    "findings": []
  },
  "ok": true
```

```
  "expectation": {
    "expect": "underspecified",
    "findings": []
  },
  "ok": true
```

| transcript | draw | angles | with a thesis | quotes exact | segments unaccounted | `--expect` findings | saved without a yes |
|---|---|---|---|---|---|---|---|
| monologue (positive) | d1 | 4 | 3 | 21 of 21 | 0 | none | no |
| monologue (positive) | d2 | 4 | 3 | 25 of 25 | 0 | none | no |
| monologue (positive) | d3 | 4 | 3 | 20 of 20 | 0 | none | no |
| rambling (negative) | d1 | 3 | 0 | 9 of 9 | 0 | none | no |
| rambling (negative) | d2 | 3 | 0 | 9 of 9 | 0 | none | no |
| rambling (negative) | d3 | 3 | 0 | 6 of 6 | 0 | none | no |

- **Positive: met 3 of 3.** Each draw proposed four angles. Three carry a thesis,
  and the fourth (the thread the writer says they "don't know yet") is
  `thesis: null` with three open questions.
- **Negative: met 3 of 3.** Each draw proposed three angles. None has a thesis,
  each has two or three open questions, and every draw said in its reply that
  it had stopped short of inventing a point.
- **Quotes fixed before showing: 0 of 6.** In every draw, the skill's first
  `angles-check` over its angles returned `ok`.
- **Saved or cached without a yes: 0 of 6.** Every `add-source` and `save`
  (`--approved`) came in the turn after the writer's "Yes, save it…". None came
  in the turn that showed the angles.

## Found by the run: the store refuses a null audience the check accepts

On 4 of 6 draws (rambling d1–d3 and monologue d2), the first `brief-store save`
was refused:

```
"reason": "Proposal is not a valid brief: angles[0].audience is required; angles[1].audience is required; angles[2].audience is required"
```

(rambling/d2, verbatim from `session.md`.) Each of those draws had left an
angle's `audience` null because the memo names no reader. `angles-check`
passes that, and the SKILL.md says nothing about audience being required.
Every draw then put a placeholder string into the field and saved it:
`"undecided"` or `"undecided; the memo names no reader"`. So the saved briefs
carry a stand-in audience that the writer never gave and the material never
named. It is not a thesis, and no checker flags it.

Follow-up (not done here; no SKILL.md, schema or tool was edited): the brief
schema and the skill should agree. Either `audience` may be `null` with an open
question, as `thesis` already may, or the skill says it is required and what to
put there.

These counts and readings were made by the session that ran the harness, not by a person.
