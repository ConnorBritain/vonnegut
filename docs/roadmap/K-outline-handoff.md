# K. Outline → draft handoff

Status: **shipped** as prose-author 0.10.0 (mirror of [`ROADMAP.md`](../ROADMAP.md);
deliverables in [`STATUS.md`](STATUS.md)). **Historical planning record.** The
durable contract is [`docs/contracts/outline-handoff.md`](../contracts/outline-handoff.md);
release notes in `bundles/prose-author/RELEASE-v0.10.0.md`. End-to-end context: [`docs/workflow.md`](../workflow.md).

## 1. Goal and non-goals

Turn an approved outline and its brief into a `prose-writing-job/1`
**mechanically**, so the drafting runtime writes the piece that was planned,
in the writer's voice. Then check the draft against that plan with the
structure critic, which already exists.

- The length band becomes a hard word-limit rule.
- Sections, with their budgets, become ordered facts.
- Filled evidence becomes facts.
- Audience, purpose and form come from the brief's decisions.
- Open questions stop the job.

Non-goals:
- Changing the runtime's drafting, review or repair loop.
- Per-section drafting. The runtime drafts the piece whole.
- Inventing anything the outline and brief do not contain.

## 2. Where it lives

`bundles/prose-author/skills/prose-draft/`:

```
tools/outline-job.mjs
tools/lib/outline-handoff.mjs      port of the validator subset prose-author reads
references/outline-handoff.md      the from-an-outline path, for the skill
SKILL.md                           gains "draft from an outline"
```

New no-owner contract: `docs/contracts/outline-handoff.md`. It names the
subset of `voice-outline/1` and `project-brief/1` that prose-author reads.
Two bundles read these schemas, and prose-author may not import prose-outline.

## 3. Contracts

The mapping in `outline-handoff.md`:

| From | To `prose-writing-job/1` |
|---|---|
| `thesis` (or premise) + chosen angle title | `brief` |
| `decisions.audience/purpose/form` (confirmed only) | `context.audience/purpose/form` |
| project name | `context.project` |
| `length {min,max}` | `rules[]`: `{kind: word-limit, minimum, maximum}` |
| claim / beat nodes in order, with `part` and `words` | `facts[]`: "Section k (≈N words, <part>): <text>" |
| filled evidence (`filled_by` non-null) | `facts[]`: "Evidence for <node>: <filled_by>" |
| `decisions.must_include` / `exclude` | `rules[]` semantic, one each, reviewable not enforced |
| open-question nodes or unconfirmed required decisions | refusal, unless `--allow-open` |

With `--allow-open`, each open question becomes a semantic rule: "Leave this
unresolved; do not assert an answer: <text>". It is reviewable, and is never
presented as enforced. The job records `outline: {project, revision, digest}`,
and the receipt carries it, so a delivery can be traced to the plan it was
written from.

## 4. Deterministic tools

- **`outline-job.mjs --outline O.json [--brief B.json] [--allow-open] [--out job.json]`.**
  - Validates both inputs with the ported subset.
  - Refuses on open questions, unconfirmed decisions or stale decisions, and
    names each one.
  - Emits the job. Every fact and rule carries a `from` pointer (node id or
    decision id), so a test can prove that nothing in the job lacks a source.
- **`lib/outline-handoff.mjs`.** A port, not a copy, because prose-author
  needs only the read subset. It is pinned by a parity test that imports
  prose-outline's `outline-schema.mjs` at test time, with a printed SKIP when
  the sibling is absent. The convention is the same as the corpus parity test.

## 5. Model surfaces

The `prose-draft` skill gains one path. When the writer has an approved outline:
1. Export it with `outline-store.mjs show`.
2. Run `outline-job.mjs`.
3. On refusal, show the open items and suggest the interview.
4. Otherwise run `prose-runtime.mjs run` on the job as usual.

After delivery, the session offers the review protocol with the structure
critic in **intended-outline mode**, using the same outline export. The skill
never re-plans the piece, and it never edits the generated job by hand.

## 6. Registry state

None new. The outline and brief are read through prose-outline's own `show`
output. The job and receipt are task-local, as today.

## 7. Protocol

Steps: approved outline (J), then `outline-job`, then the runtime, then
`delivery.md` and the receipt, then review, with the structure critic in
intended-outline mode, then L.

Without prose-outline installed, the writer can paste an outline JSON. It
must still validate against the ported subset.

## 8. Fixtures and harness

`tests/fixtures/outline-handoff/`:
- an approved outline with a brief, giving the expected job;
- an outline with open questions, giving a refusal;
- the same with `--allow-open`, giving semantic rules;
- a brief with a stale decision, giving a refusal;
- an outline with no length, giving no word-limit rule and a stated note.

The parity test runs over prose-outline's shipped outline fixtures.

Runtime path: one end-to-end runtime run is recorded as **not run** until
dispatched. Its delivery should then go through the structure critic in
intended-outline mode.

Mutations:
- open questions silently dropped;
- the length band not converted to a rule;
- a fact emitted without a `from` pointer;
- unconfirmed decisions accepted into `context`.

## 9. Decisions

- **Mechanical, not model-written.** A model summarising the outline into a
  brief would re-plan it. A script makes the job a faithful projection of what
  was approved, and the provenance pointers make that testable.
- **Port plus parity, not a copy.** prose-author needs a read subset of two
  schemas, not the store or the writer side. Copying the full schema modules
  would pin far more than prose-author uses.
- **Sections as facts, not as a template.** The runtime has no structure
  slot. Ordered facts with budgets carry the plan without changing
  `prose-writing-job/1`.
- **Refuse on open questions by default.** Drafting over an unresolved thesis
  is how invented claims get in. `--allow-open` exists because the writer
  sometimes wants to see a draft anyway, and then the gaps are explicit rules.

### Build-time decisions

- **Provenance lives in `job.handoff`**, parallel to facts and rules: the runtime
  requires facts to be strings and refuses unknown rule fields, so `from`
  cannot sit inside them. The runtime ignores `handoff`; tests read it.
- **The receipt gains one conditional line** naming the outline project,
  revision, shape and digest; receipts of jobs without an outline are unchanged.
- **Only settled answers reach the job**, optional ones included: an
  unconfirmed must-include is not a rule.
- **Without a brief, form and purpose come from flags**, because the runtime
  refuses a job without them.

## 10. Deliverables

- K1 — `docs/contracts/outline-handoff.md` + `lib/outline-handoff.mjs` port + parity test. Accept: parity over prose-outline's fixtures; SKIP printed when the sibling is absent.
- K2 — `outline-job.mjs` + fixtures. Accept: expected jobs byte-equal; refusals name each open item; every fact and rule has `from`.
- K3 — prose-draft SKILL.md path + `references/outline-handoff.md`; PROTOCOL.md (structure critic in intended-outline mode after delivery); mutations (four above); end-to-end run recorded as not run until dispatched.
- K4 — prose-author minor bump, RELEASE notes, CHANGELOG, version pin, README, ROADMAP → shipped; `--mutations` green.

## 11. Known limits

- Section budgets are guidance to the drafter. Only the overall band is enforced.
- The runtime drafts the piece whole, so a long piece may drift from a
  section's budget. The structure critic and `outline-scan` report that
  afterwards.
