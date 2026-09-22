# D. Corpus ingestion

Status: **in-progress** (mirror of [`ROADMAP.md`](../ROADMAP.md); deliverables in
[`STATUS.md`](STATUS.md)). Planning material: on ship, rationale moves to
`bundles/prose-author/DESIGN.md` and the skill README.

## 1. Goal and non-goals

Bring a writer's existing work into `corpus/human/` with provenance from the
places it lives — a Substack export, a Google Docs export folder, a Markdown
vault, an mbox — with explicit per-item selection, a register suggestion the
writer confirms, and progress toward the profile floor.

Non-goals: enabling history or rhetoric, changing preferences, inferring
authorship, importing archives (`.zip`, `.docx`) in this item.

## 2. Where it lives

```
bundles/prose-author/skills/prose-corpus/
├── SKILL.md  meta.yaml
└── tools/
    ├── import-substack.mjs   import-gdocs.mjs   import-vault.mjs   import-mbox.mjs
    ├── corpus-ingest.mjs
    └── lib/{html-text.mjs, mime.mjs, register-suggest.mjs, provenance.mjs}
bundles/prose-author/tests/suite-corpus-ingestion.mjs  (+ fixtures/corpus-imports/)
```

Existing files: `bundles/prose-author/tests/selftest.mjs` SUITES;
`tests/mutations.mjs`; `bundles/prose-tell-scan/PROFILES.md` "Who reads what"
gains a writer row for `corpus-ingest.mjs`; `bundles/prose-author/{README,
INSTALL, PROTOCOL, AGENTS}.md`; version bump.

## 3. Contracts

Candidate manifest `corpus-candidates/1`:

```json
{ "schema": "corpus-candidates/1", "importer": "substack", "source_root": "…",
  "candidates": [ { "id": "c001", "title": "…", "date": "2024-03-01|null", "words": 812,
    "suggested": { "register": "essay", "form": "newsletter", "why": "substack post" },
    "path": "posts/…html", "refused": null } ],
  "refused": [ { "path": "…", "why": "not text" } ] }
```

Selection `corpus-selection/1`: `{ ids: [...], register, group?, attest: true,
source: "<free text>" }` — `attest` must be literally `true`, set by the skill
only after the writer confirms per batch. Ingest writes frontmatter exactly as
`prose-tell-scan`'s `ingest.mjs` does (`source`, `date`, `human_authored: true`,
`ingested_from`) plus `imported_by: prose-corpus/<importer>`.

Progress report: per register/form, `pieces`, `words`, `floor_pieces: 5`,
`floor_words: 1000` (profile floor, from prose-author), and `calibration_floor:
{thin: 5, confident: 10}` (tell-scan), numbers only.

## 4. Deterministic tools

- Importers read a **folder**, never write, emit the manifest. Substack:
  `posts.csv` for titles/dates, `posts/*.html` bodies; Google Docs: `.html`,
  `.txt`, `.md` (`.docx` refused: "export as HTML or plain text"); vault:
  recursive, frontmatter-aware, honours an ignore list; mbox: `From ` line
  split, RFC 5322 headers, MIME multipart, quoted-printable and base64 decode,
  `text/plain` preferred, quoted replies and signatures stripped, one candidate
  per message with the writer as sender (the `--from` address is required, not
  inferred).
- `lib/html-text.mjs`: dependency-free HTML → text (block elements → paragraphs,
  entities decoded, scripts/styles dropped).
- `lib/register-suggest.mjs`: deterministic heuristics (importer kind, length,
  salutation/sign-off presence, heading density) → suggestion + `why`.
- `corpus-ingest.mjs --manifest M --selection S --samples-dir D`: writes only
  the selected ids; below 200 words refused (tell-scan's `MIN_WORDS`); prints
  progress.

## 5. Model surfaces

`prose-corpus` skill (`kind: author` — it writes files — with the same
`denied_inputs` discipline as `prose-draft`): run one importer, present
candidates in batches of at most ten with suggestion and reason, ask for
selection, register/group, and the per-batch attestation in the writer's own
words, then ingest, then show progress. It never sets `attest` from an
inference, never runs `calibrate`, `history`, or `preferences` commands, and
tells the writer that corpus additions are worth their own commit.

## 6. Registry state

Resolves the selected identity's `samples_dir` through `identity resolve`;
writes only under `<samples_dir>/corpus/human/[<group>/]`. Nothing else.

## 7. Protocol

PROTOCOL.md gains a "Corpus" section: import → select → attest → ingest →
progress → (later, explicitly) profile refresh via the existing path. Without
`prose-tell-scan`, ingestion still works (the frontmatter contract is
PROFILES.md's), and the skill says calibration is unavailable.

## 8. Fixtures and harness

- `tests/fixtures/corpus-imports/{substack,gdocs,vault,mbox}/` — small synthetic
  exports with an expected manifest each; malformed variants (missing
  `posts.csv`, a `.docx`, a binary attachment, a base64 body) with expected
  refusals.
- Provenance parity: run `prose-tell-scan`'s provenance reader over ingested
  files (existing cross-bundle contract-test pattern in prose-author's tests).
- Progress numbers re-derived by the test from the written files.
- Mutations: ingest selects everything; attest defaults true; a history flag is
  set as a side effect; word floor removed.

## 9. Decisions

- **New skill in prose-author**, not in `prose-style-tune` (different job) and
  not in `prose-tell-scan` (its `ingest.mjs` is per-file; the importer proposes
  and selects). Frontmatter is reproduced, not imported, and pinned by parity.
- **Folders only.** A dependency-free unzip via `zlib.inflateRaw` is feasible
  but out of scope; recorded for a later item.
- **mbox sender is explicit.** Guessing which address is the writer is exactly
  the inference this repo refuses.
- **Attestation per batch, in the writer's words**, mirroring `--attest`.

### Build-time decisions

- **Candidates carry their text.** The manifest embeds each candidate's
  extracted text, so `corpus-ingest.mjs` needs no importer at write time and an
  mbox message — which is not a file — ingests like a file. The cost is a large
  task-local JSON; the benefit is one write path with one contract.
- **Register goes into frontmatter as `profile:`**, which tell-scan's profile
  resolver already reads, plus `form:`; progress groups by both. An identity's
  `samples_dir` is one profile directory, so register is a file property, not a
  directory.
- **An undated piece is refused, never dated today.** Export metadata or
  nothing; the writer can supply a date by re-running with a corrected
  manifest. A file's mtime is when it was downloaded, and calibrate's age
  reasoning would be fed a lie.
- **Progress is re-derived from disk**, never from what was just written, and
  the suite recounts it independently — the pattern `cross-count.mjs` set.
- **The word floor, profile floor and calibration floor are reproduced as
  constants** in `lib/provenance.mjs` with their origins named, and the parity
  test asserts the word floor equals tell-scan's `MIN_SAMPLE_WORDS`.

## 10. Deliverables

- D1 — skill scaffold + `corpus-ingest.mjs` + provenance parity test + PROFILES.md writer row. Accept: writes selected ids only; parity green.
- D2 — Substack importer + fixture + expected manifest.
- D3 — Google Docs importer + fixture + `.docx` refusal.
- D4 — Vault importer + fixture.
- D5 — mbox importer + fixture (MIME, QP, base64, reply stripping).
- D6 — suggestion heuristics + progress report + mutations. Accept: numbers re-derived; all mutations caught.
- D7 — prose-author bump, RELEASE notes, CHANGELOG, INSTALL/README, version pin, ROADMAP → shipped.

## 11. Known limits

HTML conversion is heuristic; dates come from export metadata or are null;
register suggestions are guesses the writer overrides; nothing here verifies
that a human wrote a piece — the attestation is the writer's claim, as it is
everywhere else in this repo.
