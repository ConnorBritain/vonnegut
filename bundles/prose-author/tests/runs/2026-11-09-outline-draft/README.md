# 2026-11-09 — prose-draft from an approved outline, positive and negative

The first end-to-end model run of drafting from an outline, made per
[`../../../skills/prose-draft/references/outline-handoff.md`](../../../skills/prose-draft/references/outline-handoff.md).

| | |
|---|---|
| date | 2026-11-09 |
| dispatch route | `claude -p` (Claude Code 2.1.319), one session per draw, resumed with `--resume` for a writer reply. The plugin was a `--plugin-dir` copy of `prose-author`, with `tests/`, `RELEASE-*` and the changelog left out. `prose-review` and `prose-tell-scan` were copied beside it, so the runtime found its companions the way a repository install does. The request was `/prose-author:prose-draft Draft the piece from my approved outline. The outline export is outline.json and the brief is brief.json, both in this directory.` Driver: [`../../../../prose-outline/tests/runs/2026-11-09-brainstorm/driver/drive.mjs`](../../../../prose-outline/tests/runs/2026-11-09-brainstorm/driver/drive.mjs). Configs: [`../../../../prose-outline/tests/runs/2026-11-09-candidates/driver/mk-configs.mjs`](../../../../prose-outline/tests/runs/2026-11-09-candidates/driver/mk-configs.mjs). |
| inputs | Positive: `tests/fixtures/outline-handoff/outline.json` and `brief.json`. Negative: `outline-open.json`, copied as `outline.json` so its name gives nothing away, with the same `brief.json`. Copies are in [`inputs/`](inputs/). |
| serving model | `claude-opus-5-5`. The session's `init` event and the CLI's `modelUsage` both report it (`session.md`, `meta.json`). Each runtime dispatch (`call-*.json`, not committed) reports `canonicalModel: "claude-opus-5-5"`. |
| tools allowed | `Bash` limited to `node`, `mkdir`, `ls`, `cat`, `cp`, `wc`, `cd`, `head` and `sha256sum`, plus Read, Write, Edit, Glob, Grep and Skill. The runtime starts its own `claude` processes from `node`. |
| stores | Isolated, with one deviation from the fixture, stated here. Each draw got its own copy of `prose-outline/tests/fixtures/registry/selected` as `PROSE_IDENTITY_DIR`. That fixture's identity points at `/private/writing/personal`, which does not exist, and the runtime refuses a registered corpus that is missing (`identity-store.mjs`: "Registered human corpus is unavailable"). So before the run, each copy had identity `personal` re-registered through the runtime's own `identity register` (revision 2 → 3; `identity-register.txt`), with `samples_dir`, `profile_file` and `history_directory` set to null and `preference_store` pointing at a fresh store made with `preferences init`. The drafts are therefore **preference-only**, and their voice was not evaluated. |
| writer | **Simulated.** A separate `claude -p` process with no tools gave each reply, from the script below. |
| draws | 3 per input, each a fresh session |
| re-sent failures | none |
| cost | $3.43 for the skill sessions, $0.21 for the writer, and $0.51 for the runtime's six dispatches, all as reported by the CLI |

## The writer's script

Fixed before the run (`writer-script.md`):

> - If asked whether to go ahead and draft: "Yes, go ahead."
> - If asked which writing identity to use: "personal, the default."
> - If asked whether to carry open questions forward unresolved (allow open questions): "No. Don't draft around them; I'll fix the outline first."
> - If asked to edit the outline or the job yourself: "No, leave them as they are."
> - If asked about running a review afterwards: "Not now."

## Files

Per input and draw, for example `approved/d1/`:

- `session.md` is the whole session, `writer-replies.txt` what the writer said, and `meta.json` the turns and costs.
- `run/` holds the runtime's output: `job.json`, `resolved-job.json`, `draft.md`, `delivery.md`, `receipt.md` and `result.json`. The per-call prompts and responses (`call-*.json`) are left out.
- `receipt-outline-line.txt` is the receipt's "Drafted from outline" line, extracted with `grep`.
- `word-count.json` is the delivered draft counted with the runtime's own counter: `visible-prose.mjs`'s `wordCount`, run through `style-rules.mjs` `checkRules` with an 800–1100 `word-limit` rule.
- `check-result.json` is the harness's own re-run of `prose-runtime.mjs check-result --delivery` on the run.

## Result

### Positive: met 3 of 3

| draw | receipt line | words (runtime counter) | `check-result` | job vs a fresh `outline-job` |
|---|---|---|---|---|
| d1 | present | 970 | `"status":"passed"`, `"delivery_status":"passed"` | identical `outline`, `handoff`, `facts`, `rules`, `brief`, `context`, `mode` |
| d2 | present | 942 | same | identical |
| d3 | present | 915 | same | identical |

The receipt line, verbatim and the same in all three:

```
Drafted from outline: project not-evaluated, revision not-evaluated, shape problem-solution; outline digest f7be2b53d9dd0c93b06a617242831772067fe2dfd1a6d1e5b9dcfbe453b40593.
```

`approved/d1/word-count.json`, verbatim (d2 and d3 differ only in the count):

```
{
  "counter": "visible-prose/1: Unicode letter/number runs, retaining internal straight or curly apostrophes; hyphens separate words.",
  "words": 970,
  "band": [
    800,
    1100
  ],
  "within": true,
  "checkRules": {
    "id": "band",
    "kind": "word-limit",
    "directive": "800–1100 words",
    "enforcement": "enforced",
    "actual": 970,
    "minimum": 800,
    "maximum": 1100,
    "occurrences": [],
    "status": "passed"
  }
}
```

`check-result.json`, verbatim and the same in all three:

```
{"schema":"prose-result-verification/1","status":"passed","result_status":"checked","mechanical_status":"not-evaluated","reason":"Report reproduced against exact final bytes","telemetry_status":"not-evaluated","delivery_status":"passed","claim":"Receipt integrity only; existing check statuses are unchanged, not upgraded."}
exit 0
```

More detail on the positive draws:

- Every draw built its job with `outline-job.mjs --harness claude` and ran it
  with `prose-runtime.mjs run`, two dispatches each.
- Every draw ran `check-result` itself before handing over.
- The job's content keys match a harness-built job from the same fixtures.
  The only added keys are `identity_resolution` and `preferences`, which come
  from the writing identity. So nothing was hand-edited.
- Each `draft.md` appears byte for byte inside its `delivery.md`.
- Each receipt reads `Status: checked.` with `Hard rules: 1 passed, 0 failed`.
  The two must-include items are semantic rules, so they were
  "Not mechanically evaluated".

### Negative: met 3 of 3

Every draw ran `outline-job` and reported its refusal. The skill's own output
matches the harness's run of the same command (`inputs/outline-job-open.refusal.txt`):

```
{
  "status": "refused",
  "reasons": [
    "outline: open question n6: Does the objection need its own section, or a sentence in the solution?"
  ]
}
```

In each draw:

- `--allow-open` was used 0 times. The draw offered it as the writer's
  choice, and the writer declined.
- `prose-runtime.mjs run` was called 0 times.
- Write and Edit were called 0 times, so no job or outline was edited.
- Each draw named the open question and suggested revising the outline.

## Found by the run

- **A fixture problem: shape mismatch.** `outline.json` and `outline-open.json`
  have shape `problem-solution`, but `brief.json`'s confirmed `shape` decision
  is `narrative-arc`. `outline-job` does not compare the two. All six draws
  noticed and told the writer, and the three positive drafts followed the
  outline. Either the fixture should agree with itself, or `outline-job`
  should flag the mismatch. Follow-up; neither is changed here.
- **The receipt says `project not-evaluated, revision not-evaluated`.** The
  fixture outline is a bare `voice-outline/1` body, not an `outline-store
  show` export, so it carries no project or revision. The line is present and
  honest. It just has nothing to name.
- **No transcript check.** `brief.json` points at a cached transcript that the
  fixture does not include, so the skill could not run `brief-check` first, as
  the reference asks. Every draw said so.

These counts and readings were made by the session that ran the harness, not by a person.

## Fixed after this run (prose-author 0.10.1)

- The fixture brief's `shape` decision is now `problem-solution`, so it agrees
  with `outline.json`.
- `outline-job` now refuses an outline whose shape or length band contradicts the
  brief's settled one, naming both. A new fixture, `brief-other-shape.json`, and a
  mutation cover it.

This run's drafts used the earlier brief. That changes nothing it measured,
because the job does not carry the shape.
