# E. prose-research

Status: **planned** (mirror of [`ROADMAP.md`](../ROADMAP.md); deliverables in
[`STATUS.md`](STATUS.md)). Planning material: on ship, rationale moves to
`bundles/prose-research/README.md` and `DESIGN.md`.

## 1. Goal and non-goals

Source intake (URL, PDF text, notes) → a dossier of quotable passages with
locations; a `claims.json` ledger (claim, source, location, confidence);
deterministic checks for quote exactness, dead links and unledgered claims; and
provenance-aware fidelity and claim auditing.

Non-goals: adjudicating truth, ranking sources, summarising the web, storing
anything without approval.

## 2. Where it lives

```
bundles/prose-research/
├── four manifests · README.md · AGENTS.md · PROTOCOL.md · DESIGN.md · RELEASE-v0.1.0.md · wiring/
├── skills/prose-research/
│   ├── SKILL.md  meta.yaml  references/{dossier-schema.md, ledger-schema.md}
│   └── tools/
│       ├── lib/registry-reader.mjs · lib/revision-store.mjs   byte-identical copies (pinned)
│       ├── source-intake.mjs
│       ├── claims-check.mjs
│       ├── provenance-scan.mjs
│       └── research-store.mjs
└── tests/selftest.mjs · fixtures/{sources,ledger,drafts}/
```

Other bundles: `primitives/agents/prose-fidelity-critic/{agent.md,meta.yaml}` +
bundle copy (optional provenance block); `bundles/prose-review/tests/fixtures/fidelity/`
gains provenance cases; `bundles/prose-author/skills/prose-draft/references/claim-audit.md`
and `tools/draft-claim-audit.mjs` (ledger ids in disclose rows); both bundles
bump minor.

## 3. Contracts

`research-dossier/1`: `{ schema, id: "<project>", revision, parent_digest,
sources: [{ id: "s1", kind: "url|file|pdf|notes", locator, retrieved_at,
sha256, text_file, title }], passages: [{ id: "p1", source: "s1", location:
{line, offset}, quote, note }] }`.

`claims-ledger/1`: `{ schema, id, revision, parent_digest, claims: [{ id: "k1",
claim, source: "s1", location: {line, offset}, quote, confidence: "high|medium|low",
confidence_by: "writer" }] }`. `confidence` is the writer's label; the schema
carries `confidence_by` so nothing can later read it as a measurement.

`claims-check/1` output: `{ quotes: [{ claim, status: "exact|drifted|absent",
expected, found }], links: [{ source, status: "ok|dead|not-evaluated", code }],
coverage: [{ sentence_id, text, ledger: null }], limits }`.

`provenance-scan/1` (for the fidelity critic): `{ quotes: [{ atom, source,
status: "exact|drifted|absent", source_span }] }` — presence only.

## 4. Deterministic tools

- **`source-intake.mjs <url|file> --project P`** — Node `fetch` for URLs (HTML
  → text via the same dependency-free converter pattern as D), files read as
  text, PDFs through `pdftotext` when on PATH else refused with the message
  "supply a text export". Stores text + sha256 + retrieval time in the
  proposal; never writes the store without `--approved`.
- **`claims-check.mjs --ledger L --dossier D [--draft F --map M] [--offline]`** —
  quote exactness with whitespace normalisation only (no fuzzy match: a changed
  word is `drifted`); dead links by HTTP status, `not-evaluated` when
  `--offline` or the network fails; coverage from the model's sentence→ledger
  map file: draft sentences the map marks `claim: true` with `ledger: null`.
- **`provenance-scan.mjs --original O --revision R --ledger L --dossier D`** —
  for each quote atom fidelity-scan would extract, whether it matches its
  source span. Presence only; consumed by the fidelity critic.
- **`research-store.mjs`** — store ops for dossier and ledger, approval-gated.

## 5. Model surfaces

- `prose-research` skill (`kind: investigator`): intake → dossier proposal →
  approval; maps draft sentences to ledger entries (`sentence-map/1`, task-local)
  and marks which sentences are claims; presents claims-check output as leads;
  never says a claim is true, only ledgered / unledgered / drifted.
- `prose-fidelity-critic` extension: an optional `## Provenance` input block.
  Priority item 1 gains "or a quote atom whose text no longer matches its ledger
  source per provenance-scan"; refusals gain "judging truth or claim support
  even when a ledger is present". Without the block, behaviour is byte-identical.
- `claim-audit.md`: a provenance packet (ledger ids and quotes) becomes a
  supplied factual packet; a disclose row may cite `ledger: "k1"` so downstream
  verification knows where to look. Still never verifies truth.

## 6. Registry state

`<projects-dir>/<identity>/<project>/research/` holding dossier, ledger and
cached source text, per [`docs/registry-stores.md`](../registry-stores.md).

## 7. Protocol

intake → dossier → ledger → draft → sentence map → claims-check → (fidelity
critic with provenance block, on revisions) → author decides. Without
prose-review, claims-check still runs and the report says no critic read it.
Without prose-author, claim-audit is unavailable and coverage is the only
claim-level signal.

## 8. Fixtures and harness

- `fixtures/sources/`: two text sources (public-domain corpus files), one URL
  fixture served from a local file (`file://` path in the dossier), one
  deliberately dead locator.
- `fixtures/ledger/`: a ledger with one exact quote, one drifted (a word
  changed), one absent, one pointing at the dead source.
- `fixtures/drafts/`: a draft + sentence map with one unledgered claim planted.
- Fidelity: new cases in the four-class discipline where the prior draft
  preserved a quote but provenance-scan says the source disagrees (class D
  relative to fidelity-scan); existing runs re-check byte-for-byte; MANIFEST
  pins the old prompt sha for historical runs.
- Claim-audit contract tests: a disclose row with a ledger id validates; a
  ledger id not in the packet is rejected.
- Mutations: whitespace-only normalisation widened to fuzzy; offline
  `not-evaluated` turned into `ok`; provenance block changing behaviour when
  absent.

## 9. Decisions

- **Extend the fidelity critic narrowly rather than add a provenance critic.**
  The reviewed objection: fidelity's remit is before/after preservation with
  ground truth by construction. Answer: a quote that no longer matches its
  source *is* item 1's atom class, and provenance-scan supplies presence the
  same way fidelity-scan does; everything beyond quotes stays refused. Options
  recorded; revisit if the harness shows the block raises false positives on
  the existing fixtures.
- **PDF extraction is not reimplemented.** `pdftotext` or a text export;
  known limit.
- **No fuzzy quote matching.** A near-match is exactly the drift the check
  exists to expose.
- **Confidence is the writer's label**, carried with `confidence_by: "writer"`.

## 10. Deliverables

- E1 — scaffold + shared-file pairs + selftest wired.
- E2 — schemas + `source-intake.mjs` + fixtures (URL-from-file, text, PDF refusal).
- E3 — `claims-check.mjs` + fixtures (misquote, dead link, unledgered sentence) + mutations.
- E4 — `research-store.mjs` + SKILL.md + meta.yaml + negative test (a draft with no claims yields an empty map, not invented entries).
- E5 — `provenance-scan.mjs` + fidelity-critic provenance block + new fixtures; existing runs still re-check; prose-review bump.
- E6 — claim-audit provenance packet + `draft-claim-audit.mjs` ledger ids + contract tests; prose-author bump.
- E7 — RELEASE notes ×3, CHANGELOG, README, version pin, ROADMAP → shipped; `--mutations` green.

## 11. Known limits

A ledger entry proves a source said something, not that it is true; HTML→text
loses tables; paywalled or dynamic pages fetch as their shell; the dead-link
check is a status code, not a content check; the sentence map is a model's
mapping and is shown, not trusted.
