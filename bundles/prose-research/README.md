# prose-research

Provenance for a project's facts: which sources it rests on, what each one
actually said, and which sentences of a draft rest on nothing. One skill, no
agents; it extends two critics that live in other bundles.

**Status: v0.1.0 in progress.** Deliverables land one commit at a time and are
tracked in [`docs/roadmap/STATUS.md`](../../docs/roadmap/STATUS.md); the plan
is [`docs/roadmap/E-prose-research.md`](../../docs/roadmap/E-prose-research.md).
Until that checklist is complete this bundle is a candidate, not a release.

| Component | What it is | What it does |
|---|---|---|
| `skills/prose-research/` | skill | Take sources in; propose passages and claims the writer labels; check quotes, links and coverage; save on approval |
| `tools/source-intake.mjs` | script | URL, file or PDF (via `pdftotext`) → text, sha256, retrieval instant |
| `tools/claims-check.mjs` | script | Every ledger quote exact / drifted / absent; every link ok / dead / not-evaluated; every unledgered claim sentence |
| `tools/provenance-scan.mjs` | script | Quote atoms in a revision against their ledger sources, for `prose-fidelity-critic` |
| `tools/research-store.mjs` | script | Dossier and ledger revisions under the registry, source text cached by sha, undo |

## Why this exists

A rewrite can keep every fact the original had and still be wrong, because the
original was wrong. The fidelity critic checks a revision against its previous
draft; nothing checks either against where the facts came from. A quote drifts
one word at a time across four revisions, a link dies, and a claim that was
"I think" in the notes ships as a sentence in the indicative. This bundle
keeps the sources, keeps what they said at the time, and checks the draft
against that — with a script wherever a script can decide.

## What the scripts decide and what they do not

- **Quote exactness** is a string comparison after whitespace normalisation
  and nothing else. A changed word, a changed comma, a changed case is
  `drifted`, and the source's words are shown beside the ledger's. There is no
  fuzzy matching, because a near-match is exactly the drift the check exists
  to expose.
- **Link status** is an HTTP status. `--offline`, or a network failure, is
  `not-evaluated`, which is never `ok`.
- **Coverage** reads the skill's own sentence map — which sentences are
  claims, and which ledger entry backs each — and reports the claims with no
  entry. The map is a model's judgement, shown to the writer, not measured.
- **Truth is never assessed.** An exact quote from a wrong source is exact. A
  ledger entry proves a source said something. `confidence` is the writer's
  label and the schema carries `confidence_by: "writer"` so nothing downstream
  can read it as a measurement.

## What it does not do

Not fact-checking (nothing here knows whether the parish record is right). Not
continuity across a project's own files (`prose-bible`). Not whether a revision
kept what the original had (`prose-fidelity-critic`, which this bundle feeds).
Not search, not summarising the web, not ranking sources.

## Testing

[`tests/selftest.mjs`](tests/selftest.mjs) runs offline: the URL path goes
through `file://`, the dead link is a file that does not exist. The fixture
dossier is derived from the fixture sources by
[`tests/research-fixtures.mjs`](tests/research-fixtures.mjs), and the expected
check and scan output is regenerated with `--update`, never hand-edited.
[`tests/skill-harness.md`](tests/skill-harness.md) records the skill's
positive and negative test and that neither has been run here.

## Install

```
/plugin marketplace add ConnorBritain/vonnegut
/plugin install prose-research@vonnegut
```

```bash
./install.sh prose-research               # the skill, with its tools
```

Node ≥ 18, no dependencies; `pdftotext` (poppler) optional. Other harnesses:
[`AGENTS.md`](AGENTS.md). How it is meant to be run: [`PROTOCOL.md`](PROTOCOL.md).
Why it is shaped this way: [`DESIGN.md`](DESIGN.md).

## Known limits

HTML becomes text heuristically: tables flatten, dynamic pages fetch as their
shell, paywalls fetch as the paywall. PDF text is `pdftotext`'s or the
writer's export; nothing here reads a PDF. A link status says a server
answered, not that the page still says what it said. The sentence map is only
as good as the model that wrote it, and the writer sees it. Nothing here
states or implies who wrote anything.
