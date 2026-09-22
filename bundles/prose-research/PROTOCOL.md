# The research protocol

How this bundle is meant to be run. Prose, not code; the main session executes
it, and there is no orchestrator.

```
  1  intake       source-intake over a URL, file or PDF text        (deterministic)
  2  add-source   research-store add-source … --approved            → dossier revision, text cached by sha
  3  dossier      passages proposed from the text; the writer confirms
  4  ledger       claims proposed with quote and location; the WRITER labels confidence
  5  draft        written elsewhere (prose-author, or by hand)
  6  map          the session maps each sentence: claim or not, which ledger id or null
  7  check        claims-check: quotes, links, coverage             (deterministic)
  8  revisions    provenance-scan → prose-fidelity-critic's provenance block
  9  the writer decides
```

## Step 1–2 — a source is what it said then

Intake pins text, sha256 and the retrieval instant; the store keeps the text
by sha. A page that changes is taken in again as a new source; the old one
stays so old quotes can still be checked. Nothing is stored without a yes.

## Step 3–4 — the writer's labels

Passages and claims are proposals. Confidence is asked, never assumed, and
written with `confidence_by: "writer"`. A claim the writer will not label does
not enter the ledger.

## Step 6–7 — the map is shown, the checks are quoted

The sentence map is the session's judgement of which sentences make claims and
which entry backs each. It is written to the task directory, never stored, and
shown to the writer beside the check. The check's rows are quoted as the tool
prints them: `drifted` with both wordings, `absent`, `dead`, `not-evaluated`,
`unledgered`. A draft with no claims yields an empty coverage list.

## Step 8 — provenance reaches the fidelity critic as a block

On a revision, `provenance-scan` says which quote atoms drifted from their
sources. With `prose-review` installed, that output is handed to
`prose-fidelity-critic` beside `fidelity-scan`'s, and the critic judges only
whether a drifted quote costs the reader something. Without `prose-review`,
the scan is reported as it stands and the report says no critic read it.

## What this session must never do

- Say a claim is true, false, likely or unlikely. Ledgered, unledgered, exact,
  drifted, absent are the words.
- Fill in confidence, or present it as measured.
- Rank sources, or drop one because it disagrees with another.
- Save a dossier or ledger revision as a side effect of checking.
- Invent a ledger entry or a coverage row to fill an empty list.
- State or imply who wrote a passage.

## Degradation

Without `prose-outline` and `prose-author` nothing changes at run time: the
shared modules are bundled. Without a registry the dossier and ledger are
task-local and the skill says so. Without `prose-review` the provenance scan
goes unread by a critic. Without `prose-author` claim-audit's provenance packet
is unavailable and coverage is the only claim-level signal.
