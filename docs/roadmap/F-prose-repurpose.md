# F. prose-repurpose

Status: **planned** (mirror of [`ROADMAP.md`](../ROADMAP.md); deliverables in
[`STATUS.md`](STATUS.md)). Planning material: on ship, rationale moves to
`bundles/prose-author/DESIGN.md` and `bundles/prose-review/DESIGN.md`.

## 1. Goal and non-goals

One piece → newsletter, LinkedIn post, thread, talk abstract, each drafted in
the writer's voice through the existing runtime, each under its own medium
profile and preference scope, each checked mechanically and reviewed by the
medium critic.

Non-goals: publishing anywhere; inventing facts the source piece lacks;
optimising for engagement metrics.

## 2. Where it lives

```
bundles/prose-author/skills/prose-repurpose/
├── SKILL.md  meta.yaml
├── media/{newsletter,linkedin-post,thread,talk-abstract}.json   medium-profile/1
└── tools/repurpose-check.mjs
primitives/agents/prose-medium-critic/{agent.md, meta.yaml, README.md}
bundles/prose-review/agents/prose-medium-critic.md
docs/contracts/medium-profile.md    (no-owner contract; schema fixed in Step 1)
```

Existing files: prose-review manifests `agents[]`, `install-prose-codex.mjs`
`AGENTS`, prose-review `PROTOCOL.md`/`README.md`/`DESIGN.md` (open question 5
answered, table row moves from "designed" to shipped), prose-author `README`,
`INSTALL`, `PROTOCOL`, tests SUITES, mutations; both versions bump.

## 3. Contracts

`medium-profile/1` — see [`docs/contracts/medium-profile.md`](../contracts/medium-profile.md).
*Form* (`newsletter`, `linkedin-post`, `thread`, `talk-abstract`) scopes
preferences on the existing `forms` axis; *medium* (`web`, `tts`, `print`) is
the delivery field and the critic's spawn condition.

`repurpose-check/1` output: `{ form, medium, mechanical: [{ id, status:
"passed|failed|not-evaluated", detail }], fidelity: <fidelity-scan output vs the
source piece>, limits }`.

Runtime job additions: `context.form = <form>`, `task_facts` includes the
profile's structure and constraints as facts, `passage` = the source piece
(`rewrite` mode), `medium_profile: { path, digest }` recorded in the receipt.

Critic: `kind: reviewer`, `verdict: [CLEAN, REVISE]`, `uncertainty_resolves_to:
silence`, receives the profile as input, refuses re-counting anything the check
counted, refuses quality and authorship judgements.

## 4. Deterministic tools

- **`repurpose-check.mjs --profile P --draft D --source S`** — length and
  segment counts against the profile; each `mechanical` constraint evaluated on
  the final bytes; `fidelity-scan` run against the source piece (a repurposed
  piece may legitimately drop atoms — the output lists them for the critic and
  writer, it does not fail on them).
- Profile validation on load: unknown fields refused by name.

## 5. Model surfaces

- `prose-repurpose` skill (`kind: author` via the runtime): pick forms, load
  profiles, run `prose-runtime.mjs run` once per form with the source piece as
  the rewrite passage and the profile as task facts; run `repurpose-check`;
  hand the medium critic the draft + profile; deliver one `delivery.md` per
  form with receipt. Preferences saved during this work are scoped
  `forms: [<form>]` through `prose-style-tune`.
- `prose-medium-critic`: framing — you are reading a piece as it will be
  delivered, not as prose; priority — (1) constructions that break in the
  medium (TTS homographs and unpronounceable abbreviations for `tts`;
  scannability for `web`: a wall with no break where the profile's structure
  expects one; line-length and reference handling for `print`); (2) segment
  boundaries that cut a sentence (`thread`); (3) a hook the profile requires
  that is absent. Every finding quotes the span. Ends `CLEAN`/`REVISE`.

## 6. Registry state

None new. Preferences use the existing store under `forms` scope.

## 7. Protocol

prose-author PROTOCOL.md gains "Repurposing": source → per-form run → check →
critic → delivery. prose-review PROTOCOL.md step 2: medium critic spawns when a
medium profile is supplied or `profile.json → medium` is set. Without
prose-review the result is `ungated` for medium review and says so; without
prose-tell-scan the existing ungated rules apply.

## 8. Fixtures and harness

- Four profiles validate; a profile with an unknown field is refused.
- `repurpose-check` fixtures: a thread with one over-length segment (fails), a
  compliant thread (passes), a newsletter missing the required hook.
- Runtime: an installed-style smoke job per form producing `delivery.md`,
  receipt verified by `check-result --delivery`.
- Critic fixtures in both disagreement directions vs `repurpose-check` (check
  flags length / critic says the cut is at a sentence boundary and immaterial;
  check clean / critic catches a homograph for `tts`), echo baseline reported;
  negative test on compliant human posts (Doctorow's short posts).
- Mutations: constraint evaluation short-circuited to passed; fidelity-scan
  omitted from the check; profile validation accepting unknown fields.

## 9. Decisions

- **Bundle: prose-author.** Sizing rule — a skill and the runtime it invokes
  install together; a separate `prose-repurpose` bundle could not import the
  runtime and duplicating it is the drift this repo refuses.
- **Medium critic in prose-review**, receiving the profile as input, never
  reading prose-author's install path (the reviewed objection). Open question 5
  in DESIGN.md answered: bundle member.
- **`forms` axis, not a new axis.** Precedent `session.md` `forms: ["reply"]`;
  a sixth axis would break `voice-preferences/2` for installed runtimes.
- **Form ≠ medium**, so `PROFILES.md`'s `medium` keeps one meaning.
- **Profiles ship with the producer skill**; the contract is documented
  centrally because two bundles read it.

## 10. Deliverables

- F1 — contract finalised; four profiles validating.
- F2 — `repurpose-check.mjs` + fixtures + mutations.
- F3 — SKILL.md + meta.yaml + per-form runtime runs with `forms` scope; digest in receipt; negative test (a source with no facts for an abstract yields a refusal, not invention).
- F4 — medium critic primitive + bundle copy + two-direction fixtures + recorded runs + DESIGN.md updates.
- F5 — both bumps, RELEASE notes, CHANGELOG, README, version pin, ROADMAP → shipped; `--mutations` green.

## 11. Known limits

Platform limits (character counts) change; profiles carry a `checked` date;
the critic's delivery judgements have no ground truth and ship on the negative
test; repurposing compresses, and dropped atoms are reported for the writer to
accept, not silently passed.
