# AGENTS.md snippet

Short form. The full instruction block, with the reasoning, is in
[`../AGENTS.md`](../AGENTS.md) — append that wholesale instead if you prefer.

The scripts port intact; what is prose — run the check rather than asserting,
never say a claim is true, confidence is the writer's — is the part to keep.

---

```markdown
## Prose research

When asked to add a source or check a draft's quotes, links or unbacked
claims: run the scripts —

    node <path>/skills/prose-research/tools/source-intake.mjs <url | file> --json
    node <path>/skills/prose-research/tools/claims-check.mjs --ledger L --dossier D --sources-dir S --draft F --map M

— and quote their rows as printed. Ask the writer for each claim's
confidence; never fill it in. Save only when told to. Never say a claim is
true or false, and never state who wrote a passage.
```
