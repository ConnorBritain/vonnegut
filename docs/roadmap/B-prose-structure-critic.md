# B. prose-structure-critic

Status: **shipped** as prose-review 0.4.0 (mirror of [`ROADMAP.md`](../ROADMAP.md);
deliverables in [`STATUS.md`](STATUS.md)). **Historical planning record.** The
durable rationale now lives in `primitives/agents/prose-structure-critic/README.md`,
`bundles/prose-review/DESIGN.md` and `bundles/prose-review/RELEASE-v0.4.0.md`;
read those for what shipped. Decisions taken during the build that this spec did
not anticipate are appended to §9.
## 1. Goal and non-goals

A clean-context reviewer of a draft's argument: order, missing transitions,
claims with no evidence behind them, section imbalance — judged against
`outline-scan` JSON and, when supplied, the intended `voice-outline/1`.

Non-goals: voice (voice critic), fidelity (fidelity critic), reader reception
(G), prose quality, any rewrite.

## 2. Where it lives

- `primitives/agents/prose-structure-critic/{agent.md, meta.yaml, README.md}`
- `bundles/prose-review/agents/prose-structure-critic.md` (byte-identical body;
  frontmatter keys from meta.yaml)
- `bundles/prose-review/.claude-plugin/plugin.json` `agents[]` + the other three
  manifests' descriptions; `install-prose-codex.mjs` `AGENTS`
- `bundles/prose-review/tests/fixtures/structure/` + `fixtures.json`
- `bundles/prose-review/tests/run-harness.mjs` (`CRITICS.structure`),
  `verify-run.mjs` (vocabulary `CLEAN`/`REVISE`, contract counts `uncited`,
  `authorship_claims`)
- `bundles/prose-review/{PROTOCOL.md, README.md, AGENTS.md, DESIGN.md, wiring/}`

## 3. Contracts

`meta.yaml`: `kind: reviewer`, `read_only: true`, `clean_context: true`,
`scope: file`, `verdict: [CLEAN, REVISE]`, `reads_tool: outline-scan.mjs
(prose-outline)`, `uncertainty_resolves_to: mode-dependent` with the two modes
recorded, `adversarial_framing: true` only in intended-outline mode. Refuses:
any finding without a quoted span; any finding without the scan field or
outline node it rests on; claims about authorship; judging voice or quality;
proposing replacement text.

Output per finding: `CLASS` (order | transition | unsupported-claim |
imbalance), `LOCATION` (line + quote), `EVIDENCE` (scan field or outline node
id), `PLAN-ENTRY` (a PLAN-FORMAT entry: `id`, `source: structure-critic`,
`location {line, quote}`, `change` imperative, `reason`). Then which of the four
classes are clean. Last line: bare `CLEAN` or `REVISE`.

## 4. Deterministic tools

None new. Inputs: `outline-scan --json` (A), optional `voice-outline/1`, optional
`outline-diff` of intended vs implied. The critic never re-counts words or
markers; it argues about consequence.

## 5. Model surfaces

Prompt shape (framing · scope · priority list · output · terse):

- Framing: you did not write this; your one question is whether its structure
  carries its argument. The scan has counted; you decide what the counts cost.
- Scope: draft, scan JSON, intended outline if any. Never the corpus or catalog.
- Priority: (1) with an intended outline, claims present in the outline but
  absent from the draft, and draft claims whose evidence slot is empty; (2)
  order: a section that depends on one that follows it; (3) transitions: a
  paragraph boundary with no marker and no lexical link where the scan shows a
  topic change; (4) imbalance only when the ratio is extreme *and* the short
  section carries a load-bearing claim.
- Two modes, stated in the output header: **intended-outline mode** — findings
  in (1) and (2) are checkable, uncertainty resolves to `REVISE`;
  **draft-only mode** — only (3) and (4), uncertainty resolves to silence, and
  the critic says it could not assess support or order against an intent.
- What is not a finding: length alone; a deliberate reversal the outline
  records; formatting.

## 6. Registry state

Reads the current outline when the session hands it over. Writes nothing.

## 7. Protocol

PROTOCOL.md step 2: spawned in parallel with the voice critic when a draft is
an argument (say so when skipping for notes); step 1 gains "run outline-scan
alongside tell-scan". Step 3 consolidation pastes `PLAN-ENTRY` blocks into
`plan.json`, deduping by span. Without `prose-outline` installed the critic is
not run and the report says structure was not reviewed.

## 8. Fixtures and harness

Four-class discipline vs outline-scan, `fixtures.json` mirrors the fidelity
set's fields (`class`, `scan_says`, `expect`, `revision_does`), originals
byte-identical to corpus files:

| class | scan says | critic must say |
|---|---|---|
| A | balanced, transitions present | CLEAN |
| B | imbalance flagged | CLEAN (short section is a deliberate coda) |
| C | imbalance / missing marker | REVISE naming which one matters |
| D | clean | REVISE — order or unsupported claim vs intended outline |

Each class ≥ 2. Echo baseline from `verify-run.mjs`. Negative: leave-one-out
over 12 argumentative human essays (Bacon, Chesterton, Doctorow) in draft-only
mode; ≤ 2 `REVISE` of 12 is a default, not a measurement, and is labelled so.
Contract counts `uncited` and `authorship_claims` must be 0. Staged inputs are
frontmatter-stripped and leak-checked for `CLEAN`/`REVISE`.

## 9. Decisions

- **Two tie-breaks in one prompt**, each derived from whether the finding is
  checkable (CONTRIBUTING "Ground truth"). Recorded in meta.yaml.
- **Exclusivity**: takes order/weakest-section from the unshipped
  `prose-adversarial-reader` and claims-without-support from the unshipped
  `prose-substance-critic`. DESIGN.md's table is amended in the same commit.
- **Emits plan entries, not a plan.** The session still consolidates
  (no orchestrator code); the block is a convenience in PLAN-FORMAT shape.

### Build-time decisions

- **B3's "recorded runs" ships as a recorded non-run.** The build environment
  had no authenticated CLI, so no structure run was dispatched. The protocol,
  the commands and the echo block are in `tests/critic-harness.md`, marked
  *not run, never as passed*; the first real run is the next session's job.
  Rejected: holding the item until a run exists (the fixtures, harness and
  wiring are testable without one, and a blocked item hides finished work) and
  fabricating a table from a dry read of the prompts.
- **The echo rule is guarded by a mutation.** `structure-harness.mjs`'s
  `scanSays` is the one place the four-class table depends on; a mutation that
  makes it never flag breaks the selftest's re-derivation. Registered in the
  review suite.
- **Class D positives are synthetic drafts with intended outlines.** No corpus
  essay has an outline, so the "only the outline exposes it" cases are this
  repo's own writing; the leave-one-out negatives stay corpus essays staged
  draft-only. Recorded in `fixtures.json`.

## 10. Deliverables

- B1 — primitive + byte-identical bundle copy + manifests + `AGENTS` + DESIGN.md note. Accept: packaging check green.
- B2 — fixtures in four classes + harness wiring. Accept: `selftest.mjs` fails if any class < 2; `prepare` stages leak-free prompts.
- B3 — recorded negative and positive runs (`verify-run.mjs` output quoted); PROTOCOL.md, AGENTS.md, wiring, README.
- B4 — prose-review bump, RELEASE notes, CHANGELOG, version pin, ROADMAP → shipped; `--mutations` green.

## 11. Known limits

No ground truth for "order" without an intended outline; the leave-one-out
corpus measures register, not argument quality; imbalance is a ratio, not a
judgement, and the critic must not treat it as one.
