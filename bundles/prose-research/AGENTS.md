# Prose research

Portable form of the [`prose-research`](README.md) bundle, for harnesses with
no skill registry.

> **Read this first.** Intake, the checks and the store are dependency-free
> scripts and plain files, so they are identical on every harness. What is
> prose — never say a claim is true, confidence is the writer's, save only on
> a yes — is a request elsewhere. `docs/portability.md` grades that degradation
> as **moderate**: the scripts still refuse the wrong inputs, but a model that
> asserts a quote is exact from memory instead of running the check has
> nothing stopping it. Run the checks yourself.

## Setup

Copy `skills/prose-research/` anywhere; it is self-contained.

```bash
node <path>/skills/prose-research/tools/source-intake.mjs <url | file> --json
node <path>/skills/prose-research/tools/claims-check.mjs --ledger L --dossier D --sources-dir S [--draft F --map M] [--offline]
```

## Instruction block

Paste into your project `AGENTS.md`.

```markdown
## Prose research

When asked to add a source, keep a dossier or ledger, or check a draft's
quotes, links or unbacked claims:

1. Run source-intake over the source and show the proposal. Add it to the
   dossier only when told to, through the store's --approved flag, and report
   the identity, project and revision. If no writing identity is selected,
   say the dossier and ledger are task-local.
2. Propose passages and claims with the source's exact words and location.
   Ask the writer for each claim's confidence (high, medium, low) and write
   confidence_by: "writer". Never fill it in.
3. To check a draft, write a sentence map (every sentence; claim true or
   false; the ledger id or null) and run claims-check with it. Quote its rows
   as printed: drifted with both wordings, absent, dead, not-evaluated,
   unledgered. Do not assert a quote is exact from memory; run the check.
4. Never say a claim is true or false, never rank sources, never invent an
   entry for a draft that has no claims, never state who wrote a passage.
```

## What degrades

| Property | Claude Code | Elsewhere |
|---|---|---|
| Intake, checks, store | ✅ | ✅ identical — scripts and files |
| Approval gate | flag the script honours | same flag; that the model asks first is prose |
| Confidence is the writer's | prompt + schema (`confidence_by`) | schema still refuses anything else |
| "Run the check, do not assert" | dispatcher-triggered skill | ⚠️ prose only — the rule to keep |
