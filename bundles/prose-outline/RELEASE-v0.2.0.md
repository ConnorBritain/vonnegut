# prose-outline v0.2.0 release notes

v0.2.0 adds the step before an outline: the `prose-brainstorm` skill turns a
voice-memo transcript, plus an optional summary the writer wrote, into three
to five candidate angles, each quoting the passages it rests on, and keeps them
in a per-project brief. Roadmap item H
([`docs/roadmap/H-transcript-brainstorm.md`](../../docs/roadmap/H-transcript-brainstorm.md));
the end-to-end path is [`docs/workflow.md`](../../docs/workflow.md).

## Added

- `skills/prose-brainstorm/` (kind planner): scan the transcript, propose
  angles that differ in thesis or audience, check every quote before showing
  anything, save only on approval, then stop and name the next step.
- `tools/transcript-scan.mjs`:
  - cleans SRT, WebVTT, speaker-labelled (inline or Otter-style) and plain
    transcripts, removing timestamps, cue numbers and labels and keeping every
    word the speaker said, fillers included;
  - counts words, turns, recurring terms, questions and fillers, and finds
    topic-shift segments (TextTiling, labelled heuristic);
  - under 150 words it is `not-evaluated`.
- `tools/angles-check.mjs`:
  - every quote must start on the cleaned-text line it names, with whitespace
    the only normalisation; each is reported as exact, misplaced, drifted or
    absent;
  - every topic segment must be used, left out or listed as unused;
  - `--expect concrete|underspecified` checks the skill's two promises.
- `project-brief/1` and `tools/brief-store.mjs`: a new `brief` store under the
  writing-identity registry ([`docs/registry-stores.md`](../../docs/registry-stores.md)),
  approval-gated with the cached source text included, with stale-revision
  refusal and undo. A transcript is cached as its cleaned text, because that is
  what every line number refers to.
- `tests/brainstorm-selftest.mjs`, wired into `node tools/check.mjs`. Its
  fixtures are:
  - seven transcripts (monologue, SRT, WebVTT, a two-speaker interview, an Otter
    export, a ramble and a fragment), each with its expected scan JSON;
  - six angle proposals, each naming exactly its planted problem.

## Compatibility

The outline skill, `voice-outline/1`, the scan, the diff and the outline store
are unchanged. `revision-store.mjs` accepts the new `brief` store name. It is
byte-identical in prose-outline, prose-bible and prose-research, and the change
is the same one line in each.

## Evidence and limits

- `node bundles/prose-outline/tests/brainstorm-selftest.mjs`: zero failed. Every
  transcript reproduces its expected JSON. Cleaning keeps every SRT cue's text
  word for word and every filler, and a segment starts within two lines of each
  planted topic change in the monologue.
- The full mutation sweep is green. It ran once, at the commit that also
  carries the interview's core (roadmap item I, I1–I3), and backs this release
  and 0.3.0. H's code is unchanged there except that quote verification moved
  into a shared module. Five mutations in the new `brainstorm` suite are all
  caught; the table is in
  [`bundles/prose-author/tests/MUTATIONS.md`](../prose-author/tests/MUTATIONS.md):
  - a case-changed quote passing;
  - an unaccounted segment ignored;
  - an invented thesis on thin material;
  - the transcript cached without approval;
  - SRT cue numbers kept.
- **Measured on 2026-11-09:** 3 draws per transcript
  ([`tests/runs/2026-11-09-brainstorm`](tests/runs/2026-11-09-brainstorm/README.md),
  harness in [`tests/skill-harness.md`](tests/skill-harness.md)).
  - The checker printed `angles-check: ok` on all six.
  - Positive (monologue): `"expect": "concrete", "findings": []`, met 3/3.
  - Negative (ramble): `"expect": "underspecified", "findings": []`, met 3/3,
    with no thesis on any angle.
  - No quote needed fixing, and nothing was saved or cached without a yes, 0 of
    6 each.
  - The store refused a null angle `audience` that the check accepts. 4 of 6
    draws then saved a placeholder ("undecided"). Fixed in 0.4.1: the schema now
    takes `null` with an open question ([`RELEASE-v0.4.1.md`](RELEASE-v0.4.1.md)).
- Known limits:
  - topic segments are a lexical heuristic;
  - speakers come from labels only, with no diarisation;
  - fillers are counted from a fixed list;
  - the check proves quotes are real and material is accounted for, not that
    an angle is good.
