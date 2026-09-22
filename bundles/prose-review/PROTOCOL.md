# The review protocol

**Status: v0.3 ships two critics and one reviser** (`prose-voice-critic`,
`prose-fidelity-critic`, `prose-reviser`). Every step below is operative.
See [`README.md`](README.md) for the bundle contents and
[`REVISER-USAGE.md`](REVISER-USAGE.md) for the operator's how-to on the
revise → fidelity half.

The critics run at **different moments**, and only the voice critic is part of
the parallel critic fan-out at step 2. The fidelity critic reviews a *revision
against its original*, so it has nothing to read until something has rewritten
something — which is step 6, after the reviser.

How the pipeline is meant to be run. Prose, not code — there is no orchestrator
here, exactly as in `verification-gate`. The main session executes this.

## Order

```
  1  scan           tell-scan, deterministic, no model      (prose-tell-scan)
  2  critics        spawned IN PARALLEL, clean context each  (voice, others)
  3  consolidate    this session, not an agent — plan.json emerges here
  4  the author edits, OR proceeds to 5
  ─────────────────────────────────────────────────────────
  5  revise         prose-reviser (log-only), harness applies (prose-reviser)
  6  fidelity       prose-fidelity-critic at k=7             (prose-fidelity-critic)
  7  the author accepts, rejects, or adjusts
```

Steps 5-7 are the reviser pipeline. It is optional — findings plus an author's
own hand-edits (step 4) is a complete outcome. But when the author wants a
draft revised programmatically, steps 5-7 are the required path: the reviser
never emits a revision the fidelity critic has not read.

## Running the fidelity critic outside the pipeline

It does not need `prose-reviser` to be useful. Any rewrite has a before and an
after, including one a person did.

```bash
git show HEAD:draft.md > /tmp/original.md          # or keep a copy first
node tools/fidelity-scan.mjs /tmp/original.md draft.md
```

**Run the scan first and hand the critic its output.** The split is the point: the
scan is authoritative on presence, the critic only on consequence. A critic asked
to check whether a number survived will answer from the sentence's plausibility,
which is the one error the deterministic half exists to make impossible.

Give it the edit plan if one exists. Without it, item 4 — edits outside the plan —
is not assessable, and the critic will say so rather than clear the revision on
that ground.

**`MATERIAL-LOSS` is not a rejection.** It says information was lost. A revision
that dropped one date earns it, correctly, and the author decides whether they
meant it. Inside the eventual reviser pipeline the verdict is load-bearing —
`DESIGN.md` has it fail the run and restore the original — but run by hand it is
a report.

## Step 1 — scan first, and give critics the result

The deterministic pass is cheap and its output is evidence a critic would
otherwise have to estimate. A model asked to count its own frequency tics finds
the ones it remembers writing, not the ones it repeated.

Two scans, when both bundles are installed: `tell-scan` for tells and cadence,
and `prose-outline`'s `outline-scan` for structure (heading tree, section
lengths, claim markers, unmarked boundaries). Each feeds the critic that reads
it and neither is a finding on its own.

Critics receive the scan JSON. They do **not** receive the catalog: what a
pattern is called is not their business, and a critic given a prohibition list
starts hunting for prohibited things.

## Step 2 — parallel, clean context, and that is the mechanism

Every critic runs in its own context. A critic that saw the draft being written
recognises its own choices as the author's, which is the failure the isolation
exists to prevent — not a nicety.

Parallel because the wall-clock cost is then one critic rather than five.

The fan-out today: `prose-voice-critic` when a corpus exists, and
`prose-structure-critic` when the draft is an argument (an essay, post, report
or talk — not a note, a reply or reference material). The structure critic
reads `outline-scan`'s JSON from step 1 and, when the project has one, the
intended outline from `prose-outline`'s store; hand it both. With an outline it
assesses support and order and resolves uncertainty to `REVISE`; without one it
assesses only transitions and balance and resolves to silence, and it says which
mode it is in on its first line. Without `prose-outline` installed there is no
scan, the critic does not run, and the report says structure was not reviewed —
it is never estimated by eye.

`prose-medium-critic` spawns only when a medium profile is supplied — the
`prose-repurpose` skill hands one over per form — or the corpus `profile.json`
declares a `medium`. Run `repurpose-check` first and hand the critic the profile,
the check output and the piece as a block; it never reads a path in another
bundle's install, and it never re-counts what the check counted. Without a
profile it does not spawn and the report says so. Short or trivial prose skips
the protocol entirely, and this session should say so out loud when it does
rather than running five agents on a paragraph.

`prose-reader-critic` spawns only when the author names a reader — "read this
as a skeptical CTO", "as someone who has never read me", "as the person who
wants me to be wrong" — one clean-context agent per named persona, in the same
fan-out. Paste the persona file from `personas/` (or the project's own, in the
same shape, validated with `tools/persona-check.mjs`) beside the draft; the
prompt never embeds one. Each returns where that reader stops and one forced
choice. Never spawned by default, and the consolidation cap in step 3 applies
across personas as across critics.

## Step 3 — consolidation, and the part to get right

This session dedupes findings by span, ranks by severity × confidence, and emits
an ordered plan. The structure critic's findings each carry a `PLAN-ENTRY` in
[PLAN-FORMAT](PLAN-FORMAT.md) shape; paste them in as they are, deduping by
span like any other, and keep their `source: structure-critic`.

**Disagreements are surfaced, never resolved.** When the voice critic wants a
sentence kept and the substance critic wants it cut, that tension *is* the
finding. A consolidator that silently picks one has destroyed the most useful
thing on the page.

**The plan is capped.** Top findings, then a count of the rest. Five critics on
one draft produce a wall, and a wall is indistinguishable from "your writing is
bad" — a reaction that ends use of the tool faster than any false positive. The
author can ask for everything; they should not be handed it.

**Every critic's `CLEAN` is reported.** Silence from four of five is information,
and hiding it makes the one finding look like a verdict on the whole draft.

## What this session must never do

- State or imply that any passage was machine-written. No critic may produce
  that claim and no consolidation may synthesise one.
- Rewrite anything. v0.1 has no transformer; the author edits.
- Present a finding that arrived without its evidence. A voice finding with no
  corpus citation is a guess, and the prompt requires it dropped — if one
  reaches consolidation anyway, drop it here.

  **And spot-check the citations that do arrive.** Nothing verifies them
  automatically. For each high-confidence finding, open the cited sample and
  confirm the claim before passing it on: a finding asserting a construction is
  *"absent from all eleven samples"* is checkable with one grep, and a citation
  that does not survive that check is worse than no citation, because it arrives
  wearing evidence's clothes.

## Failure modes, named

**Running critics in the writer's context.** The comparison stops being honest
and nobody can see that it has.

**Firing on everything.** A critic that flags every draft is noise, and noise
gets ignored — the same outcome as not having it, after paying for it. The
acceptance harness measures this directly.

**Letting the author read a wall.** The consolidation cap is not cosmetic.
