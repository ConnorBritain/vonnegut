# G. Reader-persona critics

Status: **planned** (mirror of [`ROADMAP.md`](../ROADMAP.md); deliverables in
[`STATUS.md`](STATUS.md)). Planning material: on ship, rationale moves to
`primitives/agents/prose-reader-critic/README.md` and `bundles/prose-review/DESIGN.md`.

## 1. Goal and non-goals

"Read this as a skeptical CTO / a first-time reader / an acquisitions editor":
one clean-context reviewer prompt, parameterised by persona data files, that
reports where that reader stops and makes one forced choice.

Non-goals: quality verdicts, authorship claims, rewriting, persona-specific
prompts.

## 2. Where it lives

```
primitives/agents/prose-reader-critic/{agent.md, meta.yaml, README.md}
bundles/prose-review/agents/prose-reader-critic.md
bundles/prose-review/personas/{skeptical-cto,first-time-reader,acquisitions-editor,adversarial-reader}.md
bundles/prose-review/tools/persona-check.mjs
bundles/prose-review/tests/fixtures/personas/ · run-harness.mjs CRITICS.reader · verify-run.mjs
```

Existing files: manifests `agents[]`, `install-prose-codex.mjs` `AGENTS`,
`PROTOCOL.md` step 2, `README.md`, `AGENTS.md`, `DESIGN.md` (adversarial
reader row → "shipped as a persona"), wiring; version bump.

## 3. Contracts

Persona file:

```markdown
---
name: skeptical-cto
reads_for: [unsupported cost claims, hand-waved risk, vendor language]
never: [judging prose quality, guessing who wrote it]
forced_choice: the single sentence this reader would push back on hardest
---
Prose: who this reader is, what they have seen before, what makes them stop.
```

Critic: `kind: reviewer`, `verdict: [CLEAN, REVISE]`,
`uncertainty_resolves_to: silence`, `adversarial_framing: false` (no ground
truth), inputs: persona text + draft. Output per finding: `WHERE I STOPPED`
(line + quote), `WHY, AS THIS READER` (one sentence), then `FORCED CHOICE:` one
quoted sentence, always present, then bare `CLEAN` or `REVISE`.

`persona-check.mjs`: validates persona frontmatter (all four keys, lists
non-empty, `never` includes the two mandatory refusals) and a transcript's
shape (every finding quotes a span; forced-choice line present; last line a
bare verdict).

## 4. Deterministic tools

`persona-check.mjs` only; no text measurement. It exists so the harness's
contract counts are derived by a script, not typed.

## 5. Model surfaces

One prompt body, byte-identical between primitive and bundle. It never embeds a
persona; the persona arrives as an input block the session pastes, the same
way scan JSON does. Framing: you are reading as the person described below and
reporting where you, as that person, stop; you are not judging the writing and
you do not know who wrote it. Priority: (1) the places this reader would stop
and why; (2) the forced choice; (3) say which of the persona's `reads_for`
items produced nothing. When you cannot tell, say nothing.

## 6. Registry state

None. Personas ship with the bundle. Project-specific personas could live under
the project store later; not in this item.

## 7. Protocol

PROTOCOL.md step 2: personas are conditional spawns the author names ("read
this as …"); each persona is one clean-context agent in the parallel fan-out;
the consolidation cap applies across personas. Never spawned by default.

## 8. Fixtures and harness

- Four shipped personas pass `persona-check`.
- Harness: `CRITICS.reader` stages persona + draft; leave-one-out per persona
  over 12 argumentative human essays; the false-positive bound is reported as a
  default (as in `critic-harness.md`). No positive claim is made: there is no
  material where "this reader would stop here" is known by construction.
- Contract counts: `uncited` (finding without quote), `authorship_claims`,
  `missing_forced_choice` — all must be 0.
- Overlap test vs B and the voice critic on the same drafts (critic-harness
  "overlap test"): spans mostly coinciding means one critic in two costumes.

## 9. Decisions

- **One agent + data files**, not one agent per persona: a persona as a prompt
  drifts and needs its own harness; a persona as a file is reviewable data.
- **No templating.** The byte-identical rule leaves no substitution surface;
  personas are inputs.
- **Subsumes `prose-adversarial-reader`.** Its territory (strongest objection,
  worst sentence) is a persona; DESIGN.md's table is amended. Structure stays
  with B.
- **Ships on the negative test only.** No ground truth; the README claims no
  more.

## 10. Deliverables

- G1 — primitive + bundle copy + DESIGN.md amendment. Accept: packaging green.
- G2 — four personas + `persona-check.mjs` + fixtures. Accept: all validate; a persona missing `never` is refused.
- G3 — harness entry + recorded leave-one-out runs per persona + PROTOCOL/AGENTS/wiring/README.
- G4 — prose-review bump, RELEASE notes, CHANGELOG, version pin, ROADMAP → shipped; `--mutations` green.

## 11. Known limits

A persona is a description, not a person; the critic's reactions are a
model's guess at that reader's; the bound is measured on essays, not on the
writer's own genre; four personas is a starting set.
