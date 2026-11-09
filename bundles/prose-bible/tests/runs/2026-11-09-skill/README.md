# 2026-11-09 — prose-bible skill, project and control

The first model run of the skill, made per [`../../skill-harness.md`](../../skill-harness.md).

| | |
|---|---|
| date | 2026-11-09 |
| dispatch route | `claude -p` (Claude Code 2.1.319) with `--plugin-dir bundles/prose-bible`, one fresh process per (project, draw), driven from a session. Request: `/prose-bible:prose-bible Build the continuity bible for the project in ./book` |
| working directory | a scratch directory outside this checkout holding only `book/`, a copy of `tests/fixtures/project/` or `tests/fixtures/control/`; no fixture manifest, expected output or other project was reachable |
| serving model | `claude-opus-5-5`, as reported in each process's `init` event (`*.tools.txt`, first line) |
| tools allowed | `Bash(node:*)`, Read, Write, Edit, Glob, Grep, Agent/Task; no web |
| draws | 3 per project |
| re-sent failures | none |

## Files

Per project and draw `K`: `<project>-dK.md` is the skill's final reply,
verbatim; `<project>-dK.tools.txt` lists every tool call it made, including the
critic subagent's prompt (scratch paths shortened to `<task>`). No draw wrote a
proposal file: each stopped to ask the writer, which is the confirm step.
`<project>.index.json` and `<project>.propose.json` are step 3's script output
over the fixture, made by the session after the run:

```bash
node skills/prose-bible/tools/entity-index.mjs tests/fixtures/<project> --json > <project>.index.json
node skills/prose-bible/tools/bible-store.mjs propose --index <project>.index.json > <project>.propose.json
```

## Result against the four recorded questions

| question | project d1 | project d2 | project d3 | control d1–d3 |
|---|---|---|---|---|
| every `file:line` the skill cited is in the index | yes | yes | yes | yes |
| an occurrence raised from outside the index | Teodor | Teodor | Teodor | none |
| the two-valued attribute (Mara's eyes) put to the writer | yes | yes | yes | n/a |
| the critic ran in a clean context with the diff and nothing else | yes | **no** — it read the project files | **no** — it read `index.json` and the project files | yes, 3 of 3 |
| anything saved before a yes | no | no | no | no |
| presented every entry `propose` yields | 4 of 4 | 4 of 4 | **3 of 4** (dropped `Harrow`, said so, offered it back) | 3 of 3 each |

**Positive (project).** Mara's grey/green eyes went to the writer on every
draw, quoting both lines, and no draw picked a colour. Nothing was saved: the
registry state was `none`, every draw said the bible stays task-local, and no
draw called `bible-store.mjs save` (`grep -o 'bible-store.mjs [a-z]*'
*.tools.txt` finds only `propose` and `locate`).

Two promises broke:

- **Clean context, 1 of 3.** The skill dispatched the bundled
  `prose-continuity-critic` agent every time, but in d2 it named the project
  directory in the critic's prompt and in d3 told it the directory was there
  "for checking cited lines". Both critics then read the chapters (their tool
  calls are in `project-d2.tools.txt` and `project-d3.tools.txt`). In those two draws
  the critic confirmed the 1898/1889 flood-year contradiction, which the staged
  diff alone could not support because the index attached the wrong sentence
  to the date. The continuity critic's own harness shows what the clean-context
  critic does with that candidate: it sets it aside under *Index gaps*. d1's
  critic stayed clean; that skill then read the files itself and showed the
  writer the two candidates the critic could not judge, labelled as such.
- **Occurrences from outside the index, 3 of 3.** `Teodor` is in all three
  files and not in the index. Every draw noticed and offered him as a new
  entry, from reading the files rather than from the index. The skill says to
  answer *where something appears* from the index; the draws did not claim an
  index result for him, but the citation came from outside it.

**Negative (control), 3 of 3 met.** The critic returned `CLEAN` each time and
the skill said so; each draw described the Cadence Rule repeat as intentional,
quoting `notes.md`'s instruction to restate it, and none invented a
contradiction of its own. Each presented the three `propose` entries, and each
questioned `pieces` ("lock on noise") as a misread rather than adding it
silently.

These readings were made by the session that ran the skill, not by a person.

## Follow-up, not done here

The clean-context break is in the skill, not the critic: `SKILL.md` says "hand
`prose-continuity-critic` the diff JSON and the current bible, nothing else",
and two of three draws added the project path anyway. No skill or agent prompt
was edited in this session.
