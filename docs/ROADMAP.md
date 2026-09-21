# Roadmap

The single source of truth for planned work. Each item below has a fuller spec in
[`docs/roadmap/`](roadmap/) and one checklist line per deliverable in
[`docs/roadmap/STATUS.md`](roadmap/STATUS.md). `node tools/check-roadmap.mjs` (run
first by `node tools/check.mjs`) fails when the three disagree with each other or
with the bundle manifests. See [Resuming work](../CONTRIBUTING.md#resuming-work)
for how a session picks up from here.

## Rules every item follows

- **Countable → script, judgement → model.** Anything a dependency-free Node
  script can decide is decided there, under the bundle's skill `tools/`. Models
  map, judge and propose; they never count, adjudicate truth, or persist.
- **Critics are clean-context, parallel, and receive scan JSON** — never a
  catalog, a prohibition list, or the intended answer. Every finding quotes its
  evidence with a location. Verdict tokens are bare, on the last line.
- **Persistent state lives in the shared writing-identity registry**
  (`~/.config/prose-author/identities` by default), scoped per identity and per
  project, versioned with undo, written only after the user approves. Nothing is
  written into a plugin install or a task directory as a hidden store.
- **Canonical prompts live in `primitives/agents/`** and the bundle copy is
  byte-identical (`tools/check-packaging.mjs`).
- **Every agent or skill ships with fixtures and a harness**, and
  `node tools/check.mjs` plus `--mutations` pass before it is called shipped.
- **No orchestrator code.** The main session runs each bundle's PROTOCOL.md in
  prose; the deterministic tools are invoked by skills, never by a user typing `node`.
- **Signals, never verdicts about people.** No primitive states or implies who
  or what wrote a passage, and none reports precision it does not have.
- **No cross-bundle import.** A bundle degrades gracefully when a sibling is
  absent and says so. Shared logic ships as a byte-identical copy pinned by
  `check-packaging.mjs`, or as a port pinned by a parity test; a contract two
  bundles read gets a no-owner document, the way `PROFILES.md` does.
- **Exclusivity.** Every finding has exactly one critic whose job it obviously
  was. A new critic's spec names the designed-but-unshipped sibling whose
  territory it takes, and `prose-review/DESIGN.md` is updated in the same commit.
- **Specs here are planning material.** `docs/` stays kind-agnostic: when an
  item ships, its durable rationale moves into the bundle's `DESIGN.md` /
  `README.md`, and the spec under `docs/roadmap/` becomes the record of how it
  was planned, marked as such at the top.

## Sequence and status

| Seq | Item | Bundle | Spec | Status |
|---|---|---|---|---|
| 1 | [A. prose-outline](#a-prose-outline) | `prose-outline` (new) | [A-prose-outline.md](roadmap/A-prose-outline.md) | shipped |
| 1 | [B. prose-structure-critic](#b-prose-structure-critic) | `prose-review` | [B-prose-structure-critic.md](roadmap/B-prose-structure-critic.md) | planned |
| 1 | [C. prose-bible](#c-prose-bible) | `prose-bible` (new) | [C-prose-bible.md](roadmap/C-prose-bible.md) | planned |
| 2 | [D. Corpus ingestion](#d-corpus-ingestion) | `prose-author` | [D-corpus-ingestion.md](roadmap/D-corpus-ingestion.md) | planned |
| 3 | [E. prose-research](#e-prose-research) | `prose-research` (new) | [E-prose-research.md](roadmap/E-prose-research.md) | planned |
| 3 | [F. prose-repurpose](#f-prose-repurpose) | `prose-author` (+ `prose-review` for the medium critic) | [F-prose-repurpose.md](roadmap/F-prose-repurpose.md) | planned |
| 3 | [G. Reader-persona critics](#g-reader-persona-critics) | `prose-review` | [G-reader-personas.md](roadmap/G-reader-personas.md) | planned |

Status values: `planned` | `in-progress` | `shipped`. Sequence 1 items are built
together because A and C share one text-index module and B consumes A's scan.
Within a sequence, build in the order listed; across sequences, finish the
earlier sequence first.

---

## A. prose-outline

**Goal.** Turn a brief into an outline — thesis, ordered claims, evidence slots,
open questions; beat-sheet mode for fiction — read a draft back into the outline
it implies, and diff two outline revisions. Outlines persist per project with
undo, so a draft can be checked against what it was meant to argue.

**Deterministic half.** `skills/prose-outline/tools/outline-scan.mjs` reads a
draft and emits JSON: heading tree with levels and lines; per-paragraph topic
sentence (first sentence, plus the sentence with the highest overlap with the
section heading, both reported); claim-marker density per section (assertive
verbs, "therefore/because/so", numbers, citations — counted, labelled
heuristic); transition markers per paragraph boundary; section length balance
(words per section, ratio to median). `outline-diff.mjs` diffs two
`voice-outline/1` documents (added, removed, moved, reworded nodes) by node id,
not by text. `outline-store.mjs` persists revisions. Both scan and diff carry a
`limits` block naming what is heuristic (topic-sentence choice, claim markers).

**Model half.** The `prose-outline` skill turns a brief into a `voice-outline/1`
proposal (thesis, claims, evidence slots, open questions; or acts/beats/turns in
beat-sheet mode), shows it, and saves only on approval. It reads outline-scan
output to describe what a draft currently argues; it never counts.

**Bundle.** New `prose-outline`, one skill, no agents. Would anyone want outlines
without the bible or the critics? Yes — so it is its own install unit.

**Registry state.** `<projects-dir>/<identity>/<project>/outlines/` — a
revision store with the same shape as the preference store (`current.json` →
`revisions/NNNNNN-<sha256>.json`, exclusive `.writer.lock`, undo as a new
revision restoring the parent). `<projects-dir>` defaults to
`<registry>/projects` and `PROSE_PROJECTS_DIR` overrides it, mirroring
`PROSE_PREFERENCES_DIR`. Schema `voice-outline/1`. The identity is read from
the registry read-only, through the bundle's own small reader of the documented
`voice-identity-registry/1` format (pinned to prose-author's by a parity test).
Three registry states: no registry ⇒ task-local output only, nothing persisted;
identities but no default ⇒ ask, never pick one; default ⇒ use it. No registry
schema change; the contract is in [`docs/registry-stores.md`](registry-stores.md)
and the reasons in the [A spec](roadmap/A-prose-outline.md).

**Acceptance.** outline-scan reproduces a hand-built expected JSON on five
fixtures (essay, technical doc, story chapter, two revisions of one post) and
returns an explicit `not-evaluated` on a heading-free note; diff on the two
revisions names exactly the planted moves; store refuses stale revisions, undo
round-trips, nothing is written without the approval flag; skill negative test —
an underspecified brief yields open questions, not an invented thesis; mutations
for the stale-revision guard, the approval gate and the heading-free refusal;
`node tools/check.mjs` and `--mutations` green.

**Status.** shipped

## B. prose-structure-critic

**Goal.** A clean-context reviewer of a draft's argument: order, missing
transitions, claims with no evidence behind them, section imbalance — judged
against outline-scan JSON and, when one exists, the intended outline.

**Deterministic half.** None new. It reads `outline-scan` JSON and an optional
`voice-outline/1`; `outline-diff` supplies the intended-vs-implied delta.

**Model half.** `prose-structure-critic` (reviewer, `prose-review`). Findings:
`CLASS` (order | transition | unsupported-claim | imbalance), `LOCATION`
(line + quote), `EVIDENCE` (the scan field or outline node it rests on), and a
`PLAN-ENTRY` block in [PLAN-FORMAT](../bundles/prose-review/PLAN-FORMAT.md) shape
(`source: structure-critic`) the session can paste into `plan.json`. Verdict
`CLEAN` / `REVISE`. With an intended outline, unsupported-claim and order
findings are checkable and uncertainty resolves toward `REVISE`; without one,
only imbalance and transition findings are made and uncertainty resolves to
silence — the prompt says which mode it is in.

**Bundle.** `prose-review`; wired into PROTOCOL.md step 2 fan-out beside the
voice critic. Minor version bump. Exclusivity: it owns argument order,
transitions, unsupported claims and balance — the "order" and "weakest section"
half of the unshipped `prose-adversarial-reader` and the "claims without
support" half of the unshipped `prose-substance-critic`; DESIGN.md's table is
amended in the same commit so no two critics claim these.

**Registry state.** Reads the project's current outline when the session
supplies it; writes nothing.

**Acceptance.** Fixtures classified by the four-class discipline
(scan says imbalanced / critic clears; scan clean / critic catches a missing
transition, etc.), each class ≥ 2, echo baseline reported by `verify-run.mjs`;
leave-one-out negative on argumentative human essays (Bacon, Chesterton,
Doctorow) — ≤ 2 `REVISE` of 12 stated as a default, not a measurement; zero
findings without a quote, zero authorship claims; PROTOCOL.md, AGENTS.md,
wiring and README updated; primitive/bundle pair byte-identical.

**Status.** planned

## C. prose-bible

**Goal.** A per-project continuity store — characters, defined terms, timeline,
recurring metaphors, already-said concepts — and a critic that flags
contradictions across a project's files using an index, never a guess.

**Deterministic half.** `skills/prose-bible/tools/entity-index.mjs` builds a
cross-file index: capitalised runs and single-word names seen ≥ 2 times, defined
terms ("X is …", "X, the …", "called X"), dates and numbers, and every location
(file, line, offset, sentence). `index-diff.mjs` reports the same term with two
definitions, an attribute that changed, a passage repeated across files.
`bible-store.mjs` persists `voice-bible/1` with undo. The index core
(`lib/text-index.mjs`: segmentation with locations, run/term extraction) is the
module `outline-scan` already ships — canonical in `prose-outline` because it
lands first, a byte-identical copy here, pinned by `check-packaging.mjs` the way
prompt bodies are, plus a fixture parity test and a mutation that breaks one
copy to prove the pin fires. The index is derived on demand and never stored.

**Model half.** The `prose-bible` skill proposes bible entries from the index
(the user confirms each), and `prose-continuity-critic` (reviewer) reads the
index-diff JSON plus the bible and reports contradictions: term defined two ways,
attribute drift, reused anecdote. Every finding cites two locations or is
dropped; uncertainty resolves to silence.

**Bundle.** New `prose-bible`: one skill, one agent. The critic is coupled to
the index the way `prose-pattern-critic` is coupled to the catalog, so it lives
beside it.

**Registry state.** `<projects-dir>/<identity>/<project>/bible/`, same
store shape and resolution rules as A. Approval-gated; the index itself is
derived and never stored.

**Acceptance.** entity-index reproduces expected JSON on a three-file fixture
project with planted drift (a character's eye colour changes, a term redefined,
an anecdote retold); index-diff names all three and nothing else; the parity
test proves `text-index` in both bundles agrees on shared fixtures; critic
fixtures in the four classes vs index-diff, echo baseline reported; negative
test on a consistent project returns `CLEAN`; mutations for the two-location
rule enforcement in the harness and the store guards; check + mutations green.

**Status.** planned

## D. Corpus ingestion

**Goal.** Get a writer's existing work into `corpus/human/` with provenance,
from the places it actually lives, with explicit per-item selection and honest
progress toward the profile floor — without turning on anything else.

**Deterministic half.** `skills/prose-corpus/tools/`: importers for a Substack
export folder (`posts/*.html` + `posts.csv`), a Google Docs export folder
(`.html`/`.txt`/`.md`; `.docx` refused with the export instruction), a Markdown
vault (recursive, frontmatter-aware), and `mbox` (headers, MIME, quoted-printable
and base64, `text/plain` preferred, quoted replies stripped). Each importer emits
a candidate manifest (id, title, date, words, suggested register/form from
deterministic heuristics, why) and never writes. `corpus-ingest.mjs` writes only
the ids the user selected, with the PROFILES.md frontmatter, and prints progress
per register/form against the 5-piece / 1,000-word profile floor and
tell-scan's 5/10-sample calibration floor.

**Model half.** The `prose-corpus` skill runs the importer, presents candidates
in small batches, asks the writer to confirm selection, register and — per
item, explicitly — that a human wrote it unaided, then reports progress. It
proposes; it never attests on the writer's behalf or infers `human_authored`.

**Bundle.** `prose-author`, new skill `prose-corpus`. Minor version bump.
`corpus/human/` is written today only by `prose-tell-scan`'s `ingest.mjs`, so
this item adds a writer row to `PROFILES.md` "Who reads what" and pins its
frontmatter to that tool's provenance reader with a parity test.

**Registry state.** Writes into the selected identity's registered `samples_dir`
only. Never enables history, rhetoric, or collection; never touches preferences.

**Acceptance.** Each importer has a fixture export and an expected manifest;
malformed inputs refuse with a named reason; ingest writes exactly the selected
ids and nothing when selection is empty; provenance frontmatter validates
against the calibrator's provenance reader; a mutation that makes ingest select
everything is caught; a mutation that flips a history flag is caught; the
progress report's numbers are re-derived by the test, not read from prose.

**Status.** planned

## E. prose-research

**Goal.** Take sources in (URL, PDF text, notes), keep a dossier of quotable
passages with locations, and a `claims.json` ledger — claim, source, location,
confidence — so a draft's facts can be checked against provenance, not only
against the previous draft.

**Deterministic half.** `skills/prose-research/tools/`: `source-intake.mjs`
(fetch a URL with Node's built-in `fetch`, or read a file; store text +
sha256 + retrieval time; PDFs via extracted text, with `pdftotext` used when on
PATH and a refusal otherwise), `claims-check.mjs`: quote-exactness (every ledger
quote appears verbatim, whitespace-normalised, at its recorded location in the
source text), dead-link check (status per URL; offline ⇒ `not-evaluated`),
and draft coverage (given the model's sentence→ledger map, list draft sentences
marked as claims with no ledger entry). `provenance-scan.mjs` emits the JSON the
fidelity critic reads.

**Model half.** The `prose-research` skill maps draft sentences to ledger
entries and drafts dossier summaries. It never adjudicates truth: confidence is
the writer's label, and "no entry" is a report, not a verdict.
`prose-fidelity-critic` gains an optional provenance block, deliberately narrow:
only its existing quote-atom class is judged against the source text
(provenance-scan is authoritative on presence, as fidelity-scan is), so the
critic's one question — did this keep what it had to — is unchanged and it
still refuses truth judgements. Behaviour without the block is byte-identical.
Claim-level provenance (a claim with no ledger entry) belongs to
`claim-audit.md` in `prose-author`, which already owns claim disclosure and
gains a provenance packet so disclose rows can cite ledger ids. A separate
provenance critic was considered and rejected; see the [E spec](roadmap/E-prose-research.md).

**Bundle.** New `prose-research`: one skill. Fidelity-critic and claim-audit
extensions land in their own bundles (minor bumps) in the same item.

**Registry state.** `<projects-dir>/<identity>/<project>/research/`
(dossier + ledger, revision store, approval-gated). Source text is cached there
too; it is the writer's own research material, kept outside plugin installs.

**Acceptance.** Fixture sources with planted misquotes and a dead link;
claims-check names each and nothing else; coverage reports exactly the planted
unledgered sentence; fidelity fixtures add a class where the prior draft
preserved a quote but the source disagrees; existing fidelity harness runs still
re-check byte-for-byte; claim-audit contract tests extended; mutations for the
whitespace-normalisation and offline `not-evaluated` guards.

**Status.** planned

## F. prose-repurpose

**Goal.** One piece → newsletter, LinkedIn post, thread, talk abstract, each in
the writer's voice, each under its own medium profile and preference scope, and
each reviewed by the medium critic.

**Deterministic half.** `skills/prose-repurpose/media/<form>.json` profiles in
the `medium-profile/1` contract (form name; length bands; structure; hard
constraints such as thread segment limits; and a `medium` delivery field —
`web` | `tts` | `print` — using the vocabulary `PROFILES.md` already reserves
for `profile.json → medium`) and `repurpose-check.mjs`, which checks delivered
text against the profile's mechanical constraints and against the source piece
with `fidelity-scan`. *Form* and *medium* stay distinct: newsletter, LinkedIn
post, thread and talk abstract are forms; the medium is how each is delivered.
Preference compilation uses the existing five-axis scope with `forms: [<form>]`
— `session.md` already scopes on `forms: ["reply"]`, and a new axis would break
`voice-preferences/2` for installed runtimes.

**Model half.** The `prose-repurpose` skill drives `prose-runtime.mjs run` once
per form with the medium profile as task facts and the source piece as the
rewrite passage, recording the profile in the job and receipt.
`prose-medium-critic` (reviewer; designed in prose-review DESIGN.md, unshipped)
ships in this item, in prose-review, and answers DESIGN.md open question 5: it
stays a bundle member because nobody wants it without the other critics. It
*receives* the medium profile as input from the session, exactly as critics
receive scan JSON — it never reads a path inside another plugin's install. It
owns delivery (homographs for TTS, scannability, segment limits already counted
by the check); uncertainty resolves to silence, and it ships only after the
human-corpus negative test like every other critic.

**Bundle.** `prose-author` for the skill — a skill and the runtime it invokes
install together (`CONTRIBUTING.md` sizing test), and a separate bundle could
not reach that runtime without a cross-bundle import. `prose-review` for the
medium critic. The `medium-profile/1` contract is read by both, so it gets a
no-owner document at [`docs/contracts/medium-profile.md`](contracts/medium-profile.md).
Both bundles bump minor. Options recorded in the [F spec](roadmap/F-prose-repurpose.md).

**Registry state.** Preferences saved under `forms: [<form>]` scope through
the existing preference store; no new store.

**Acceptance.** Each medium profile validates; repurpose-check flags a planted
over-length thread segment and passes a compliant one; a run produces one
`delivery.md` per medium with fidelity review recorded; medium-critic fixtures
in both disagreement directions vs repurpose-check with echo baseline; negative
test on compliant human posts; mutations for the constraint checker.

**Status.** planned

## G. Reader-persona critics

**Goal.** "Read this as a skeptical CTO / a first-time reader / an acquisitions
editor" — one clean-context reviewer prompt, parameterised by persona data
files, reporting where that reader stops and why.

**Deterministic half.** `bundles/prose-review/personas/<name>.md` (frontmatter:
`name`, `reads_for`, `never`, `forced_choice`); `persona-check.mjs` validates
persona files and the critic's output shape (every finding quotes a span; the
forced-choice line is present). No text measurement.

**Model half.** `prose-reader-critic` (reviewer): one fixed prompt body (there
is no templating surface — the bundle copy must stay byte-identical), which
receives the persona text as an input beside the draft, reports `WHERE I
STOPPED` findings with location and quote, makes one forced choice (the single
sentence this reader would object to most), and ends `CLEAN` / `REVISE`. Never
a quality verdict, never an authorship claim; no ground truth, so uncertainty
resolves to silence and it ships on "stays quiet on human prose" alone.

**Bundle.** `prose-review`, minor bump. Personas are data, not prompts, so a new
reader is a file, not a primitive. Exclusivity: this critic takes the territory
DESIGN.md gave the unshipped `prose-adversarial-reader` (strongest objection,
worst sentence) — that reader becomes a shipped persona file, and DESIGN.md's
table is updated to say so. Structure (order, transitions, support, balance)
stays with B.

**Registry state.** None. Personas ship with the bundle; project-specific
personas may live beside the project's outline store later, not now.

**Acceptance.** Three shipped personas validate; harness runs each persona
leave-one-out over human essays with the false-positive bound reported as a
default; forced choice present in every transcript; zero uncited findings, zero
authorship claims; PROTOCOL.md step 2 lists personas as conditional spawns.

**Status.** planned
