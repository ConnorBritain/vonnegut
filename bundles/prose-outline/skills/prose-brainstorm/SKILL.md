---
name: prose-brainstorm
description: This skill should be used when the user hands over a voice-memo transcript, dictation, rough spoken notes or a summary of them and wants to know what pieces the material could become, to explore angles before outlining, or to start a project brief from what they said. It cleans the transcript without losing a word, counts what is countable, proposes three to five angles that each quote the passages they rest on, and checks every quote mechanically. It does not choose the angle, outline (prose-outline does), or draft (prose-draft does). Nothing is saved without the user's approval.
---

# Prose brainstorm

You find the pieces a writer's spoken material could become. The scripts under
`tools/` clean the transcript and check your quotes; you propose. Read
[references/brief-schema.md](references/brief-schema.md) before proposing.
All paths are relative to this skill's directory, and the commands are agent
internals, never homework for the user.

## Read the transcript before proposing

```bash
node tools/transcript-scan.mjs <transcript> --json --clean-out <task-dir>/clean.txt
```

Every line number from here on refers to `clean.txt`, not the original file:
timestamps, cue numbers and speaker labels are gone, and every word the
speaker said is still there. Read `segments` (topic-shift boundaries, a
heuristic), `recurring_terms`, `questions` (what the writer asked themselves,
often the real subject), and `fillers` (a count, never a judgement). If `status`
is `not-evaluated`, say why and ask for more material; do not propose from a
fragment.

The writer's own summary, if they give one, is a second source. Quote it as
`segment: "summary"`; never blur what they wrote afterwards with what they said.

## Propose angles

An angle is a piece the material could become. Write 3–5 to a task-local
`angles.json` (`angles` and `unused_segments`, as in the schema):

- Angles differ in **thesis or audience**, not only in title. Two framings of
  the same argument for the same reader are one angle.
- Every angle quotes the passages it rests on, by segment and cleaned-text line,
  word for word. Copy; never paraphrase inside a quote.
- **Thin material yields open questions, not an invented thesis.** When the
  transcript does not say what the piece argues, `thesis` is `null` and
  `open_questions` says what is missing. Fewer honest angles beat five padded ones.
- Every segment is accounted for: used by an angle, in an angle's `leaves_out`,
  or listed in `unused_segments`. Nothing the writer said is silently dropped.
- `shape` is a lower-case word for the form you have in mind (`narrative-arc`,
  `problem-solution`, `letter`…). It is a suggestion; the interview settles it.
- Never add a fact, story or example the transcript does not contain.

## Check before showing

```bash
node tools/angles-check.mjs <task-dir>/angles.json <task-dir>/clean.txt --scan <scan.json> [--summary <summary.txt>]
```

Fix every `misplaced`, `drifted` or `absent` quote and every unaccounted
segment, then run it again. Show the angles only when it passes, and show its
result with them. A `drifted` quote means you changed the writer's words.

## Save only on approval

```bash
node tools/brief-store.mjs locate
```

| Registry state | What you do |
|---|---|
| `none` | The brief stays task-local. Say so. Do not create a registry. |
| `ambiguous` | Ask which identity. Never pick the first. Pass `--identity` once answered. |
| `located` | On the user's yes, cache the transcript, then save the angles. |

```bash
node tools/brief-store.mjs add-source --project <name> --file <transcript> --kind transcript --expected-revision <N> --approved
node tools/brief-store.mjs save --project <name> --proposal <brief.json> --expected-revision <N+1> --approved
```

`add-source` caches the cleaned transcript under the brief, so later stages can
quote it; add a summary the same way with `--kind summary`. The saved brief is
`show`'s brief with your `angles` and `unused_segments` added. Set
`chosen_angle` only when the writer chooses one. Without `--approved` nothing
is written, the cached text included. Report the identity, project and revision
from the receipt, and that `undo` restores the previous revision.

## Then stop

Name the next step and let the writer take it: the interview
(`prose-interview`) to settle audience, length, shape and thesis, or the
outline (`prose-outline`) if they already know. Do not start either yourself.

## Limits

Segments are a lexical heuristic; a long digression can split one thought or
merge two. Speakers come from labels only. Fillers are counted from a fixed list.
The check proves your quotes are real and the material accounted for, not that
the angles are good. Never state or imply who or what produced a transcript.
