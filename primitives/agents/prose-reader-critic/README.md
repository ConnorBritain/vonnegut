# prose-reader-critic

Read-only critic that reads a draft **as one named reader** — described in a
persona file the session pastes beside the draft — and reports where that
reader stops and why, then makes one forced choice. Output contract: findings
that quote the sentence, a `FORCED CHOICE` that is always present, and a bare
`CLEAN` / `REVISE`. Bundle: `prose-review`. Personas ship in
`bundles/prose-review/personas/`.

Not whether the prose is good. Not whether it sounds like its author
(`prose-voice-critic`). Not whether the structure carries the argument
(`prose-structure-critic`). Not whether a revision kept what it had to
(`prose-fidelity-critic`). Not who wrote it — ever.

## Why this exists

Every other critic in this bundle answers a question the author asked about
the draft. This one answers a question about a reader: *would a skeptical CTO
finish this? where does someone who has never read me get lost? what would the
person who wants me to be wrong say first?* Those are the questions authors
actually ask each other in the margin, and none of them has a scan.

## Why one agent and many files

**A persona as a prompt drifts.** Four prompts would be four critics, each
needing its own harness, its own fixtures, and its own drift between primitive
and bundle copy. A persona as a data file is reviewable in a diff, and the one
prompt that reads it is tested once.

**The prompt never embeds a persona.** The rule that a bundle copy is
byte-identical to its primitive leaves no substitution surface, and that is
the point: the persona arrives as an input block, the way scan JSON arrives
for the fidelity critic. `tools/persona-check.mjs` validates the file before a
run — all four keys, non-empty lists, the two refusals every reader shares —
and the transcript's shape after it, so the harness's contract counts are
derived rather than typed.

## What it does

| # | Reports | The rule |
|---|---|---|
| 1 | Where this reader stops | Only for something the persona's `reads_for` names; quoted; one first-person sentence on why. A reaction, never a fix. |
| 2 | The forced choice | Exactly one quoted sentence, always present, even on a `CLEAN`. |
| 3 | Nothing here for | The `reads_for` items that produced no stop. Information, not a gap. |

## The error preference

Uncertainty resolves to **silence**, for the voice critic's reason and more so:
there is no ground truth at all. Nobody can check that "this reader would stop
here" is true, so a wrong finding is never caught, and it teaches the author
to write for a reader who does not exist. The critic ships on the negative
test — quiet on argumentative human essays, per persona — and makes **no
positive claim**: there is no material where a reader's stop is known by
construction. The README does not say more than that.

## When to run it

When the author names a reader: "read this as …". Never by default. Each
persona is one clean-context agent in the parallel fan-out
(`prose-review/PROTOCOL.md` step 2), and the consolidation cap applies across
them. The session pastes the persona file's contents and the draft; the critic
reads nothing else.

## Reading the output

`REVISE` says this reader stops somewhere, and each stop is quoted. `CLEAN`
says this reader finishes — and still names the sentence they liked least,
which is often the useful line. A stop is one reader's reaction; the author
decides whether that reader matters for this piece.

## Known limits

**A persona is a description, not a person.** The critic's reactions are a
model's guess at that reader's, shaped by four lines of frontmatter and a
paragraph. Two runs may stop in different places.

**The bound is measured on essays.** The leave-one-out negative is Bacon,
Chesterton and Doctorow, not the writer's own genre; a persona tuned for
pitches has not been run on pitches.

**Four personas is a starting set**, chosen because each names a question
authors ask. A project's own personas are the same file shape; they are not
stored anywhere yet.

**Its verdicts are model judgements and single draws are observations, not
rates.**

## Install

```bash
./install.sh prose-reader-critic      # → ~/.claude/agents/
```

Or install the whole bundle: `/plugin install prose-review@vonnegut`. The
persona files live in the bundle; a loose-file install copies them beside the
agent.
