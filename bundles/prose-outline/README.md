# prose-outline

Outlines for prose, and the steps before one: brainstorming angles from a
voice-memo transcript into a project brief, and an interview that settles what
the piece is. Three skills, no agents.

**Status: v0.1.1.** See [`RELEASE-v0.1.1.md`](RELEASE-v0.1.1.md) and [`RELEASE-v0.1.0.md`](RELEASE-v0.1.0.md) for what
ships and the evidence; the planning record is
[`docs/roadmap/A-prose-outline.md`](../../docs/roadmap/A-prose-outline.md).

| Component | What it is | What it does |
|---|---|---|
| `skills/prose-outline/` | skill | Brief → outline proposal; draft → implied outline; diff; save on approval |
| `.../tools/outline-scan.mjs` | script | Heading tree, topic-sentence candidates, claim-marker density, transitions, section balance — as JSON |
| `.../tools/outline-diff.mjs` | script | Two `voice-outline/1` revisions → added, removed, moved, reworded nodes, by id |
| `.../tools/outline-store.mjs` | script | Per-project revisions under the identity registry, approval-gated, with undo |
| `.../tools/lib/text-index.mjs` | script | Segmentation with locations; the canonical copy that `prose-bible` mirrors byte-for-byte |
| `skills/prose-brainstorm/` | skill | Transcript → 3–5 angles that quote what they rest on → a project brief, saved on approval |
| `.../tools/transcript-scan.mjs` | script | SRT, WebVTT, speaker-labelled or plain transcript → cleaned text with stable lines; words, turns, recurring terms, questions, fillers, topic segments |
| `.../tools/angles-check.mjs` | script | Every quote verbatim at its line; every segment accounted for; the skill's two promises |
| `.../tools/brief-store.mjs` | script | `project-brief/1` revisions and cached sources under the identity registry, approval-gated, with undo |
| `skills/prose-interview/` | skill | One question at a time, a recommended answer each, sourced answers confirmed before recording, until the brief's decisions are settled |
| `.../tools/brief-check.mjs` | script | The next question in dependency order, stale answers, blocking skips, re-verified evidence, done |
| `.../tools/lib/decisions.mjs` | script | The decision tree as data, with validators for answers and links |
| `tests/selftest.mjs` | script | Fixtures, parity cases, store guards |
| `tests/brainstorm-selftest.mjs` | script | Transcript, angle and interview fixtures; brief store guards |

## Why this exists

A draft can be checked against many things — the author's voice, its previous
version, a tell catalog — but not, until now, against what it was *meant to
argue*. An outline is the one artefact a writer produces before the prose that
can be compared to the prose afterwards, and the comparison is largely
countable: which headings exist, in what order, how long each section runs,
where the transitions are, which claims sit in a section with nothing behind
them. Counting is a script's job. Saying what the counts cost the argument is a
critic's job, and that critic (`prose-structure-critic`, in `prose-review`)
reads this bundle's scan rather than estimating structure by eye.

## Why brainstorming lives here

Most pieces start before there is a brief: a voice memo, a ramble, a summary
written afterwards. The brainstorm turns that into candidate angles and a
project brief, and the brief exists to become an outline — nobody wants one
without the other, so they install together. Its rules are the outline's rules
moved upstream: quote the writer's exact words at the line they said them,
account for everything they said, and when the material has no point yet, ask
rather than supply one. The interview settles the brief's decisions —
audience, length, shape, thesis — on the same terms: it looks answers up in the
writer's material before asking, and a script, not the model, decides what to
ask next and when it is finished. The end-to-end path is in
[`docs/workflow.md`](../../docs/workflow.md).

## Why a separate bundle

Someone writing essays wants outlines without a character bible; someone
reviewing a draft wants the critic without a store. The bundle is the install
and toggle unit, so this is its own. It shares its text-indexing core with
`prose-bible` as a byte-identical copy pinned by the packaging check, because a
static import across bundles is not allowed here.

## What it does not do

- Transcribe audio, choose an angle for the writer, or invent material the
  transcript does not contain.
- Draft prose. That is `prose-draft`.
- Judge whether the argument is good. That is the structure critic.
- Score anything, or say who wrote anything.
- Persist without being asked. Briefs and outlines are saved only after approval, and only
  into the shared writing-identity registry — never into this install.

## Install

```
/plugin marketplace add ConnorBritain/vonnegut
/plugin install prose-outline@vonnegut
```

```bash
./install.sh prose-outline        # → ~/.claude/skills/prose-outline/
./install.sh prose-brainstorm     # → ~/.claude/skills/prose-brainstorm/
./install.sh prose-interview      # → ~/.claude/skills/prose-interview/
```

Node ≥ 18, no dependencies. Other harnesses: see [`AGENTS.md`](AGENTS.md).
How it is meant to be run: [`PROTOCOL.md`](PROTOCOL.md). Why it is shaped this
way: [`DESIGN.md`](DESIGN.md). Where outlines live:
[`docs/registry-stores.md`](../../docs/registry-stores.md).

## Known limits

English sentence heuristics; transcript topic segments are a lexical-cohesion
heuristic and speakers come from labels only; claim markers are a word-class count, not a claim
detector; topic-sentence candidates are positional, not semantic; the store
coordinates local files, not machines.
