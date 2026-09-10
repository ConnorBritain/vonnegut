# Extraction provenance

Vonnegut starts with a writing-only snapshot of
[ConnorBritain/agent-primitives](https://github.com/ConnorBritain/agent-primitives/tree/052a54aeb8570ac1650ef256bd4472b3f93fd266)
at commit `052a54aeb8570ac1650ef256bd4472b3f93fd266`, taken on 2026-09-10.
That source was the `prose-author-v060-shared-identities` feature branch, not
agent-primitives main. The original repository and its history were not rewritten.

The initial snapshot contains only tracked files selected with `git archive`:

- `bundles/prose-author`, `bundles/prose-review`, `bundles/prose-tell-scan`;
- the seven shipped canonical writing agents and held `prose-pattern-critic`;
- installation scripts, license, contributor guidance, marketplace and supporting docs.

Subsequent extraction changes establish the Vonnegut marketplace and repository
URLs, remove unrelated catalog entries, adapt current documentation and add local
verification. Bundle versions and canonical prompt bodies are unchanged.

No `.git` history, GitHub Actions, verification-gate bundle, unrelated engineering
agents, `.planning` notes, untracked claims audit, private corpora, credentials or
personal profile/preference/history stores were imported. Tracked historical run
records are retained byte-for-byte, including any old paths, hashes and branch names:
those identify the original experiments and are not current installation instructions.

## History and licenses

Use the linked source commit for pre-extraction authorship and Git history.
Vonnegut's first commit records the snapshot; it does not backdate imported files
or claim their original Git provenance was retained locally. Old commit references
in evaluation records resolve in agent-primitives, not this new Git history.

The original MIT copyright notice remains in `LICENSE`. Vendored samples retain
their own licenses and attribution, including corpus `ATTRIBUTION*.json`, README
and fetcher files. Do not treat the whole corpus as MIT-licensed or strip those
files from redistributed test data. No source samples were modified for this move.

## Compatibility boundary

The marketplace is now `vonnegut`; the three bundle names, seven shipped agent
names, skill names, schemas and `~/.config/prose-author` defaults remain stable.
See [migration](MIGRATION.md) before switching an existing installation.
