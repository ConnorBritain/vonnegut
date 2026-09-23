---
name: prose-research
description: This skill should be used when the user wants to bring sources into a writing project (a URL, a PDF's text, a file of notes), keep a dossier of quotable passages with locations, keep a claims ledger (claim, source, location, quote, the writer's confidence), check a draft's quotes against their sources for exactness, check for dead links, or find which sentences of a draft make claims no ledger entry backs. It records what a source said and where; it never decides whether a claim is true, never ranks sources, and never saves without the user's approval.
---

# Prose research

You keep the provenance of a project's facts. The scripts under `tools/` take
sources in, check quotes, links and coverage, and store the dossier and ledger;
you map sentences to entries and present leads. Read
[references/dossier-schema.md](references/dossier-schema.md) and
[references/ledger-schema.md](references/ledger-schema.md) before proposing.
All paths are relative to this skill's directory, and the commands are agent
internals, never homework for the user.

## Take a source in

```bash
node tools/source-intake.mjs <url | file | file.pdf> [--title T] --json > <task>/intake.json
node tools/research-store.mjs add-source --project <name> --intake <task>/intake.json --expected-revision <N> [--approved]
```

Intake fetches or reads, converts HTML to text, and proposes a source entry
with the text's sha256 and the retrieval instant. A PDF needs `pdftotext` on
PATH or a text export; say so rather than guessing at its text. Show the
proposal (title, words, sha) and add it only on the user's yes. The store keeps
the text by sha under `research/sources/`, so a quote can be checked later
against what the source said then.

## Build the dossier and the ledger; the writer labels confidence

Propose passages (`p1, p2, …`: source, line, quote, note) from the source text
and claims (`k1, k2, …`: the proposition, the source, the line, the exact
quote). Ask the writer for each claim's `confidence` — `high`, `medium`, `low`
— and write `confidence_by: "writer"`. Never fill confidence in yourself, and
never read it back as a measurement. Save with:

```bash
node tools/research-store.mjs save --project <name> --store dossier --proposal <task>/dossier.json --expected-revision <N> [--approved]
node tools/research-store.mjs save --project <name> --store ledger  --proposal <task>/ledger.json  --expected-revision <N> [--approved]
```

| Registry state | What you do |
|---|---|
| `none` | Dossier and ledger stay task-local. Say so. Do not create a registry. |
| `ambiguous` | Ask which identity. Never pick the first. Pass `--identity` once answered. |
| `located` | Show the proposal; on the user's yes, save. |

Without `--approved` the command prints what it would write and writes
nothing. A stale `--expected-revision` is refused; reread rather than retry.
`undo` restores the previous revision as a new one.

## Check a draft: quotes, links, coverage

Write a task-local sentence map: every sentence of the draft, `claim: true`
where a reasonable reader could ask "how do you know that?", and the ledger
id that backs it or `null`. Then:

```bash
node tools/claims-check.mjs --ledger <ledger.json> --dossier <dossier.json> --sources-dir <research>/sources --draft <draft.md> --map <task>/map.json [--offline] --json
```

Present the output as leads, quoting the tool: a `drifted` quote with the
source's words beside the ledger's; an `absent` quote; a `dead` link; each
`unledgered` sentence. A `not-evaluated` link is not a live link. A draft with
no claims yields an empty coverage list; do not invent entries to fill it.
Never say a claim is true or false — say ledgered, unledgered, exact, drifted,
absent — and never rank sources.

## Revisions: hand provenance to the fidelity critic

```bash
node tools/provenance-scan.mjs --revision <rev.md> --original <orig.md> --ledger <ledger.json> --dossier <dossier.json> --sources-dir <research>/sources --json
```

When `prose-review` is installed, pass this output to `prose-fidelity-critic`
as its optional provenance block beside `fidelity-scan`'s output; it judges only
whether a quote atom drifted from its source. Without `prose-review`, report
the scan as it stands and say no critic read it. Without `prose-author`,
claim-audit is unavailable and coverage is the only claim-level signal.

## Limits

A ledger entry proves a source said something, not that it is true. HTML
becomes text heuristically; paywalled or dynamic pages fetch as their shell; a
link status is a status code. The sentence map is your mapping and is shown
to the writer, not trusted. Never state or imply who wrote a passage, and never
judge the writing.
