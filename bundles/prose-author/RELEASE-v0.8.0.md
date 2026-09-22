# prose-author v0.8.0 release notes

v0.8.0 lets the independent claim auditor point a disclosed claim at the
writer's research ledger. When a provenance packet — ledger ids, propositions,
quotes and sources from `prose-research` — accompanies the request, a disclose
row's claim may carry `ledger: "kN"` so a downstream reviewer knows where to
look. The pointer changes nothing about the row: the claim is still disclosed,
not verified, because a ledger proves a source said something, not that it is
true. Roadmap item E ([`docs/roadmap/E-prose-research.md`](../../docs/roadmap/E-prose-research.md)).

## Changed

- `draft-claim-audit.mjs`: the disclosed-claim schema gains an optional
  `ledger` (`kN`); `applyVoiceDraftClaimAudit` accepts `{ provenance }`,
  validates the packet strictly (`claim-audit-provenance/1`), refuses a ledger
  id the packet does not hold and a ledger id given without a packet. Without
  a packet, behaviour is unchanged.
- `references/claim-audit.md`: one paragraph on the provenance packet — cite
  an entry only when its proposition is the claim being disclosed, never an id
  the packet lacks, never without a packet, and never as verification.

## Compatibility

Every existing audit validates exactly as before: the field is optional and
the packet is optional. The drafting runtime does not yet pass a packet; the
`prose-research` skill's protocol says when one exists and the session
supplies it beside the request.

## Evidence and limits

- `node bundles/prose-author/tests/selftest.mjs voice-draft`: zero failed,
  five new contract checks — a cited id the packet holds validates and stays
  disclosed; an id the packet lacks is refused by name; an id without a packet
  is refused; a malformed packet is refused before any row is read; without a
  packet the same audit validates as before.
- The runtime's claim-audit dispatch is unchanged and no model run was made
  in this environment; a packet reaching a real audit is the next session's
  job to observe.
