# Historical v0.3 prompt contracts

These are exact copies of the three primitive sources at commit `71d0a3f`,
before the current runtime's /5 transport and advisory-tendency semantics replaced
the earlier quota-based protocol. They are historical test/acceptance inputs,
not installed agents. Existing raw runs, profiles, scores and thresholds remain
unchanged. Tests of the old protocol and its mutations use these frozen sources;
current prompt parity, behavior and evidence are checked separately.

Do not update these files to match a current agent or invoke them as the ordinary
writing workflow. A historical artifact is not evidence for a current prompt.

`draft-claim-audit.mjs` — the claim auditor as the v0.3 canary locked it, archived when
roadmap item E (prose-author 0.8.0) taught the live auditor to attach a research ledger id to
a disclosed claim. The canary still runs against these bytes.
