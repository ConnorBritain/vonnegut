# prose-author v0.7.0 release notes

v0.7.0 adds corpus intake: a writer's existing work enters `corpus/human/` from
the places it actually lives, with explicit per-item selection, per-batch
attestation in the writer's own words, provenance frontmatter, and honest
progress toward the profile and calibration floors. Roadmap item D
([`docs/roadmap/D-corpus-ingestion.md`](../../docs/roadmap/D-corpus-ingestion.md)).

## Added

- `prose-corpus` skill (`kind: author`): run one importer, present candidates
  in batches of at most ten with the register suggestion and its reason, ask
  for selection, register, group and the batch's attestation, ingest, show
  progress. It never sets `attest` from an inference, never guesses which mbox
  address is the writer's, never enables history or rhetoric, never touches
  preferences, never runs calibration.
- Four importers, each reading a folder or file and writing nothing:
  `import-substack.mjs` (`posts.csv` + `posts/*.html`; drafts and orphans
  reported as such), `import-gdocs.mjs` (`.html`, `.txt`, `.md`; `.docx`
  refused with the export instruction; Takeout sidecar dates),
  `import-vault.mjs` (recursive, frontmatter-aware, wiki links resolved,
  embeds and comment blocks dropped, index pages refused, ignore list),
  `import-mbox.mjs` (`--from` required; RFC 5322 headers, RFC 2047 subjects,
  multipart, quoted-printable and base64; `text/plain` preferred; quoted
  replies, introductions and signatures stripped).
- `corpus-candidates/1` — every candidate carries title, date (export
  metadata or null, never today's), word count, suggestion with reason, path
  and text — and `corpus-selection/1`, whose `attest` must be literally `true`.
- `corpus-ingest.mjs`: writes exactly the selected ids under the identity's
  `samples_dir/corpus/human/[group]` with the frontmatter `prose-tell-scan`
  reads plus `profile`, `form` and `imported_by`; refuses pieces under 200
  words, undated pieces and existing files (without `--force`) by name; prints
  progress per register/form against the 5-piece / 1,000-word profile floor and
  attested samples against calibration (thin 5, confident 10), re-derived from
  disk.
- `lib/html-text.mjs`, `lib/mime.mjs`, `lib/register-suggest.mjs`,
  `lib/provenance.mjs`, `lib/manifest.mjs` — dependency-free.
- `PROFILES.md` "Who reads what" gains the writer row; `PROTOCOL.md` gains
  "Corpus intake".

## Compatibility

Nothing existing changes: the runtime, the drafting and tuning skills, the
registry and every store are untouched, and `prose-tell-scan`'s `ingest.mjs`
still writes one attested file at a time. Without `prose-tell-scan`, intake
works and calibration is reported unavailable.

## Evidence and limits

- `node bundles/prose-author/tests/selftest.mjs corpus-ingestion`: 75 checks,
  zero failed — four fixture exports (synthetic, this repo's own prose)
  reproduce generated expected manifests; refusals by name for a missing
  `posts.csv`, a `.docx`, an index page, another sender, a PDF-only message and
  an all-quoted message; ingest writes exactly the selected ids and creates
  nothing but `corpus/human`; every refusal of the selection schema; the
  progress block equals an independent recount; **parity**: tell-scan's own
  `readProvenance` accepts every file written, rejects the same malformed
  files for the same reasons, its `frontmatterProfile` resolves the register,
  and its `MIN_SAMPLE_WORDS` equals this skill's floor.
- Four mutations (select everything, attest defaults true, floor removed,
  history enabled as a side effect), every one caught; the sweep's table is in
  `tests/MUTATIONS.md`.
- **No model run of the skill was dispatched**; the environment had no CLI.
  The skill's promises that a script can check are checked; that it asks
  before setting `attest` is a prompt rule and is recorded as such in
  `meta.yaml`.
- HTML conversion is heuristic; register suggestions are guesses with a
  reason; reply stripping is line-based; archives (`.zip`) must be unzipped
  first and `.docx` exported. Nothing here verifies that a human wrote a piece;
  the attestation is the writer's claim, as it is everywhere in this repo.
