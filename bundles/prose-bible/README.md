# prose-bible

Continuity for a project: what a character looks like, what a term means, when
a thing happened, which metaphor you already used, which anecdote you already
told. One skill, one read-only critic.

**Status: v0.1.0.** See [`RELEASE-v0.1.0.md`](RELEASE-v0.1.0.md) for what
ships and the evidence; the planning record is
[`docs/roadmap/C-prose-bible.md`](../../docs/roadmap/C-prose-bible.md).

| Component | What it is | What it does |
|---|---|---|
| `skills/prose-bible/` | skill | Index a project; propose bible entries the writer confirms; save on approval |
| `.../tools/entity-index.mjs` | script | Cross-file index: names, defined terms, dates, numbers, repeated passages — every one with file, line, offset |
| `.../tools/index-diff.mjs` | script | The same term defined two ways, an attribute stated two ways, a passage repeated across files |
| `.../tools/bible-store.mjs` | script | Per-project `voice-bible/1` revisions under the identity registry, approval-gated, with undo |
| `agents/prose-continuity-critic.md` | agent | Clean-context critic: does this candidate contradiction really contradict? Cites two locations or says nothing |
| `.../tools/lib/` | scripts | `text-index`, `registry-reader`, `revision-store` — byte-identical copies of `prose-outline`'s, pinned by the packaging check |

## Why this exists

A continuity error is the loss that survives every other review. The voice is
right, the facts in each chapter are right, and the eyes that were grey in
chapter two are green in chapter nine. A writer cannot see it because they know
what they meant, and a critic reading one file at a time cannot see it because
it is not in the file. It is in the *index* — and building an index is a
script's job: every name, every "X is a …", every date, every retold passage,
with the line it sits on.

## Why a separate agent

**Because the index can only raise candidates.** "Mara" with grey eyes on one
line and green on another is a fact the script can find; whether the second is
a contradiction, a flashback, a different Mara or a lie a character tells is
not. That is the critic's question, and it answers it in a clean context with
two cited locations or not at all. A critic that guesses a location the index
never supplied is inventing a contradiction, and the prompt forbids it.

The critic is coupled to the index the way `prose-pattern-critic` is coupled
to the tell catalog, so it ships beside it rather than in `prose-review`.

## Why a separate bundle

An essayist wants outlines without a character bible; a novelist may want the
bible and not the critics. The bundle is the install and toggle unit. Its three
`lib/` modules are byte-identical copies of `prose-outline`'s, because a static
import across bundles is not allowed and a copy the packaging check pins cannot
drift.

## What it does not do

- Fact-check against the world. That is `prose-research` (roadmap item E).
- Judge voice, structure or quality.
- Store the index. It is recomputed every run; a stale index would report a
  contradiction the writer already fixed.
- Persist without being asked. Bible entries are saved only after approval,
  and only into the shared writing-identity registry.

## Testing

The critic's fixtures, echo rule and harness are in
[`tests/critic-harness.md`](tests/critic-harness.md); the skill's positive and
negative test in [`tests/skill-harness.md`](tests/skill-harness.md). Both record
that no model run has been dispatched yet, and say what a run must show.

## Install

```
/plugin marketplace add ConnorBritain/vonnegut
/plugin install prose-bible@vonnegut
```

```bash
./install.sh prose-bible                  # the skill, with its tools
./install.sh prose-continuity-critic      # the agent alone
```

Node ≥ 18, no dependencies. Other harnesses: [`AGENTS.md`](AGENTS.md). How it
is run: [`PROTOCOL.md`](PROTOCOL.md). Why it is shaped this way:
[`DESIGN.md`](DESIGN.md). Where the bible lives:
[`docs/registry-stores.md`](../../docs/registry-stores.md).

## Known limits

Names below two occurrences are invisible; definitions are three surface
patterns; passage similarity is lexical; a contradiction stated entirely in
paraphrase with no shared term is not in the index and so not in the critic's
reach. The critic's judgements have no ground truth and it ships on staying
quiet over a consistent project.
