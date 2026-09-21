# prose-outline

Outlines for prose. One skill, no agents.

**Status: v0.1.0.** See [`RELEASE-v0.1.0.md`](RELEASE-v0.1.0.md) for what
ships and the evidence; the planning record is
[`docs/roadmap/A-prose-outline.md`](../../docs/roadmap/A-prose-outline.md).

| Component | What it is | What it does |
|---|---|---|
| `skills/prose-outline/` | skill | Brief → outline proposal; draft → implied outline; diff; save on approval |
| `.../tools/outline-scan.mjs` | script | Heading tree, topic-sentence candidates, claim-marker density, transitions, section balance — as JSON |
| `.../tools/outline-diff.mjs` | script | Two `voice-outline/1` revisions → added, removed, moved, reworded nodes, by id |
| `.../tools/outline-store.mjs` | script | Per-project revisions under the identity registry, approval-gated, with undo |
| `.../tools/lib/text-index.mjs` | script | Segmentation with locations; the canonical copy that `prose-bible` mirrors byte-for-byte |
| `tests/selftest.mjs` | script | Fixtures, parity cases, store guards |

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

## Why a separate bundle

Someone writing essays wants outlines without a character bible; someone
reviewing a draft wants the critic without a store. The bundle is the install
and toggle unit, so this is its own. It shares its text-indexing core with
`prose-bible` as a byte-identical copy pinned by the packaging check, because a
static import across bundles is not allowed here.

## What it does not do

- Draft prose. That is `prose-draft`.
- Judge whether the argument is good. That is the structure critic.
- Score anything, or say who wrote anything.
- Persist without being asked. Outlines are saved only after approval, and only
  into the shared writing-identity registry — never into this install.

## Install

```
/plugin marketplace add ConnorBritain/vonnegut
/plugin install prose-outline@vonnegut
```

```bash
./install.sh prose-outline        # → ~/.claude/skills/prose-outline/
```

Node ≥ 18, no dependencies. Other harnesses: see [`AGENTS.md`](AGENTS.md).
How it is meant to be run: [`PROTOCOL.md`](PROTOCOL.md). Why it is shaped this
way: [`DESIGN.md`](DESIGN.md). Where outlines live:
[`docs/registry-stores.md`](../../docs/registry-stores.md).

## Known limits

English sentence heuristics; claim markers are a word-class count, not a claim
detector; topic-sentence candidates are positional, not semantic; the store
coordinates local files, not machines.
