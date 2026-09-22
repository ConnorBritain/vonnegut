# Roadmap status

One line per deliverable, in sequence order. Tick the box in the same commit as the
work, and keep each item heading's status equal to its row in
[`ROADMAP.md`](../ROADMAP.md). `node tools/check-roadmap.mjs` parses this file, so
the shape is fixed: a `### <Letter>. <name> — <status>` heading per item and a
`- [ ] <Letter><n> — <text>` line per deliverable.

## Bundle versions

The one place bundle versions are pinned. `tools/check-packaging.mjs` reads its
expected versions from this table, so a bump in any manifest fails the checks
until this line moves too. That forces a `STATUS.md` edit in the same commit as a
release; it does not make the edit meaningful, which is the reviewer's job.

| Bundle | Version |
|---|---|
| prose-author | 0.8.0 |
| prose-bible | 0.1.0 |
| prose-outline | 0.1.1 |
| prose-research | 0.1.0 |
| prose-review | 0.5.0 |
| prose-tell-scan | 0.1.1 |

## Deliverables

### A. prose-outline — shipped

- [x] A1 — bundle scaffold: four manifests, marketplace entry, README, AGENTS.md, PROTOCOL.md, wiring/, `check-packaging.mjs` shared-file list, `install.sh`/`install.ps1` help, `install-prose-codex.mjs` PLUGINS; `bundles/prose-outline/tests/selftest.mjs` wired into `tools/check.mjs`
- [x] A2 — `lib/text-index.mjs` (canonical) with `tests/fixtures/text-index/` parity cases and the cross-implementation location fixture
- [x] A3 — `lib/registry-reader.mjs` read-only registry reader + parity fixture against prose-author's `identity-store.mjs`; `lib/revision-store.mjs` implementing `docs/registry-stores.md`
- [x] A4 — `outline-scan.mjs` + five fixtures + expected JSON + heading-free `not-evaluated` case
- [x] A5 — `voice-outline/1` schema, `outline-diff.mjs` + revision-pair fixture with planted moves
- [x] A6 — `outline-store.mjs`: three registry states, approval gate, stale-revision refusal, undo round-trip; mutations registered
- [x] A7 — `prose-outline` SKILL.md + meta.yaml, beat-sheet mode, positive and negative skill test recorded
- [x] A8 — RELEASE-v0.1.0.md, CHANGELOG entry, README bundle table and install lines, version pin above, ROADMAP status → shipped

### B. prose-structure-critic — shipped

- [x] B1 — primitive `prose-structure-critic` (agent.md, meta.yaml, README) + byte-identical bundle copy; manifests and `install-prose-codex.mjs` AGENTS updated; DESIGN.md exclusivity note
- [x] B2 — fixtures in the four classes vs outline-scan + harness wiring (`run-harness.mjs` CRITICS entry, `verify-run.mjs` contract counts, leak check)
- [x] B3 — negative and positive harness runs recorded with `verify-run.mjs` output; PROTOCOL.md step 2, AGENTS.md, wiring, README updated
- [x] B4 — prose-review version bump, RELEASE notes, CHANGELOG, version pin above, ROADMAP status → shipped

### C. prose-bible — shipped

- [x] C1 — bundle scaffold (manifests, marketplace, README, AGENTS.md, PROTOCOL.md, wiring/, install scripts, `check-packaging.mjs` shared-file pairs for `text-index`, `registry-reader`, `revision-store`); selftest wired into `tools/check.mjs`
- [x] C2 — `entity-index.mjs` + three-file fixture project with planted drift + expected JSON
- [x] C3 — `index-diff.mjs` naming the planted contradictions and nothing else
- [x] C4 — `voice-bible/1` schema + `bible-store.mjs` (same store contract as A6) + mutations, including one that breaks a shared-file copy to prove the pin
- [x] C5 — primitive `prose-continuity-critic` + bundle copy + fixtures in four classes vs index-diff + harness + recorded runs
- [x] C6 — `prose-bible` SKILL.md + meta.yaml, proposal/confirm flow, negative test recorded
- [x] C7 — RELEASE-v0.1.0.md, CHANGELOG, README, version pin above, ROADMAP status → shipped

### D. Corpus ingestion — shipped

- [x] D1 — `prose-corpus` skill scaffold (SKILL.md, meta.yaml) + `corpus-ingest.mjs` writing PROFILES.md frontmatter for selected ids only; provenance parity test against tell-scan's reader; PROFILES.md writer row
- [x] D2 — Substack export importer + fixture + expected manifest
- [x] D3 — Google Docs export folder importer + fixture (+ `.docx` refusal)
- [x] D4 — Markdown vault importer + fixture
- [x] D5 — mbox importer (MIME, quoted-printable, base64, reply stripping) + fixture
- [x] D6 — register/form suggestion heuristics + progress report against both floors, numbers re-derived by test; mutations (select-all, history flag)
- [x] D7 — prose-author version bump, RELEASE notes, CHANGELOG, INSTALL/README, version pin above, ROADMAP status → shipped

### E. prose-research — shipped

- [x] E1 — bundle scaffold (manifests, marketplace, README, AGENTS.md, PROTOCOL.md, wiring/, install scripts, shared-file pairs for `registry-reader`/`revision-store`); selftest wired
- [x] E2 — `research-dossier/1` + `claims-ledger/1` schemas; `source-intake.mjs` (URL, file, PDF via pdftotext-or-refuse) + fixtures
- [x] E3 — `claims-check.mjs`: quote-exactness, dead-link (offline ⇒ not-evaluated), draft coverage from a sentence→ledger map + fixtures with planted misquote, dead link, unledgered sentence; mutations
- [x] E4 — `research-store.mjs` (store contract) + `prose-research` SKILL.md + meta.yaml; negative test recorded
- [x] E5 — `provenance-scan.mjs` + `prose-fidelity-critic` optional provenance block (quote atoms only) + new fixtures in the four classes; existing runs still re-check; prose-review bump
- [x] E6 — `claim-audit.md` provenance packet + `draft-claim-audit.mjs` ledger ids + contract tests; prose-author bump
- [x] E7 — RELEASE notes for all three bundles, CHANGELOG, README, version pin above, ROADMAP status → shipped

### F. prose-repurpose — in-progress

- [x] F1 — `docs/contracts/medium-profile.md` finalised; four `media/*.json` profiles validating against it
- [x] F2 — `repurpose-check.mjs` (mechanical constraints + fidelity-scan against the source) + fixtures + mutations
- [x] F3 — `prose-repurpose` SKILL.md + meta.yaml driving one runtime run per form with `forms` scope; profile digest in job and receipt; negative test recorded
- [x] F4 — primitive `prose-medium-critic` + bundle copy in prose-review; fixtures in both disagreement directions vs repurpose-check; harness runs recorded; DESIGN.md open question 5 answered
- [ ] F5 — prose-author and prose-review bumps, RELEASE notes, CHANGELOG, README, version pin above, ROADMAP status → shipped

### G. Reader-persona critics — planned

- [ ] G1 — primitive `prose-reader-critic` + bundle copy; DESIGN.md table amended (adversarial reader becomes a persona)
- [ ] G2 — `personas/{skeptical-cto,first-time-reader,acquisitions-editor,adversarial-reader}.md` + `tools/persona-check.mjs` + fixtures
- [ ] G3 — harness entry staging the persona as input; leave-one-out runs per persona recorded; PROTOCOL.md step 2 conditional spawn; AGENTS.md, wiring, README
- [ ] G4 — prose-review bump, RELEASE notes, CHANGELOG, version pin above, ROADMAP status → shipped
