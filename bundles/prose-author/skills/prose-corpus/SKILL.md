---
name: prose-corpus
description: This skill should be used when the user wants to bring their existing writing into their human corpus — from a Substack export, a Google Docs export folder, a Markdown vault (Obsidian, Logseq, a folder of notes) or an mbox of sent mail — asks what is in an export, asks how far their corpus is from the profile or calibration floor, or asks to add pieces to their corpus with provenance. It imports candidates, the writer selects and attests per batch, and only the selected pieces are written. It never enables history, never changes preferences, never decides who wrote something, and never runs calibration.
---

# Prose corpus

You get a writer's existing work into `corpus/human/` with provenance, from the
places it actually lives. The scripts under `tools/` propose and write; the
writer selects and attests. All paths are relative to this skill's directory,
and the commands are agent internals, never homework for the user.

## Resolve the identity, then import

Use the sibling runtime's `identity resolve` (see
[the identity reference](../prose-draft/references/identities.md)) to find the
selected identity's `samples_dir`. No registry or no default ⇒ ask which
identity, or which directory, before anything is written; never pick one and
never create a registry here.

```bash
node tools/import-substack.mjs <export-dir> --json > <task>/candidates.json
node tools/import-gdocs.mjs    <folder>     --json > <task>/candidates.json
node tools/import-vault.mjs    <vault-dir>  [--ignore templates,daily] --json > <task>/candidates.json
node tools/import-mbox.mjs     <file.mbox>  --from <the writer's address> --json > <task>/candidates.json
```

Importers read a folder and write nothing. Each candidate carries its title,
date (from export metadata, or null — never today's), word count, a register
and form suggestion with the reason, and its text. A `.docx` is refused with
the export instruction; a `.zip` must be unzipped first. For mbox, ask the
writer which address is theirs; the importer refuses to guess.

## Present in batches; the writer selects and attests

Show at most ten candidates at a time: id, title, date, words, suggested
register/form and why. Ask which to keep, which register (`essay`, `technical`,
`narration`, `correspondence`) and optional group and form, and then — for this
batch, in the writer's own words — whether they wrote these pieces unaided.
Write the answer to a task-local selection file:

```json
{ "schema": "corpus-selection/1", "ids": ["c001", "c002"], "register": "essay",
  "group": null, "form": "newsletter", "attest": true,
  "source": "my Substack export, March 2024" }
```

`attest: true` is set only after a yes for this batch. Never set it from an
inference, from the importer's suggestion, or from an earlier batch's answer.
A candidate the writer edited from a model draft is not human corpus material;
leave it out and say why.

## Ingest only the selected ids, then show progress

```bash
node tools/corpus-ingest.mjs --manifest <task>/candidates.json --selection <task>/selection.json --samples-dir <samples_dir>
node tools/corpus-ingest.mjs progress --samples-dir <samples_dir>
```

Ingest writes the selected ids and nothing else, with the provenance
frontmatter `prose-tell-scan` reads; a piece under 200 words, an undated piece
or a file already present is refused by name and the rest still lands. Report
what was written, what was refused and why, and the progress block as the
tool prints it: pieces and words per register/form against the profile floor
(5 pieces, 1,000 words) and attested samples against calibration (thin at 5,
confident at 10). Do not restate the numbers in your own words. Tell the
writer that corpus additions are worth their own commit.

## Never

- Enable numerical history or rhetoric collection, touch preferences, publish
  a profile, or run `calibrate` — a corpus change is a reason to *offer* a
  profile refresh through the existing path, not to do it.
- Write into a plugin directory, a task directory as a hidden store, or any
  path but the resolved `samples_dir`.
- State or imply who wrote a piece. The attestation is the writer's claim, as
  it is everywhere in this repo.
- Import `corpus/ai/` or `corpus/approved/` material through this skill; those
  have their own contracts.

Without `prose-tell-scan`, ingestion still works — the frontmatter contract is
PROFILES.md's — and you say that calibration is unavailable until it is installed.
