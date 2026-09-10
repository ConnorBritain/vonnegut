# Vonnegut extraction verification

The source is recorded in [provenance](PROVENANCE.md). These are local extraction
checks on macOS with Node.js 26.8.1, recorded on 2026-09-10. No model generations
or new acceptance draws were requested. Historical model runs are retained
evidence, not freshly generated results for this repository move.

## Engineering checks

`node tools/check.mjs` completed all 16 commands successfully:

| Check | Result |
|---|---|
| Standalone packaging | Three bundles, twelve consistent manifests, seven byte-identical prompt bodies; held critic excluded |
| prose-tell-scan selftest | 334 passed, 0 failed; 1 intentional held-primitive parity skip |
| prose-tell-scan acceptance | Existing deterministic scanner acceptance passed |
| prose-author selftest | 1,377 passed, 0 failed |
| prose-review selftest | 300 passed, 0 failed |
| Harness integrity | 36 passed, 0 failed |
| Reviser harness integrity | 34 passed, 0 failed |
| Four historical run wrapping checks | All passed |
| Four historical run verifications | All passed |
| Mutation concurrency safety | 3 passed; all 275 mutations leave the actual tree unchanged |

The separate full command `node bundles/prose-author/tests/mutations.mjs`
completed with exit code 0: **275 mutations caught, zero uncaught, zero crashed**.
`MUTATIONS.md` matched the measured table without changes; mutation documentation
was not hand-edited or regenerated. The new packaging test also
checks maintained relative documentation links and safe legacy Codex-wrapper
migration. Test references to four excluded engineering documents were replaced
with four writing/install documents; assertions were not weakened.

## Installation

`node tools/check-installation.mjs` passed using the real installed Codex and
Claude CLIs in isolated temporary configuration directories:

- All three plugins install and are enabled in each host.
- Installed production inventories and bytes match this checkout.
- Both cached runtimes find the two enabled companion plugins by the new marketplace.
- Both resolve the same explicit shared-identity registry location.
- All seven Codex custom agents pass the installer check.
- Project-scoped Bash loose installation includes seven agents, three skills and
  the fidelity scanner; skill entrypoints match their sources.

After pushing extraction commit `0ef96ef`, a fresh clone of the public GitHub
repository also passed both `node tools/check.mjs` (all 16 commands) and
`node tools/check-installation.mjs`. These checks ran from the downloaded clone,
outside both the original agent-primitives checkout and the extraction checkout.

The original active installations, private corpus and shared writing-memory
stores were not changed. The Windows PowerShell installer was carried over with
documentation-only changes; it was not executed on this macOS host. No native Pi
adapter or live Devin conversational test is claimed.

All three Codex plugin manifests passed the plugin-creator validator; the Claude
marketplace passed `claude plugin validate .`; all three skills passed the
skill-creator structural validator. The validators needed PyYAML, supplied with
`uv run --with pyyaml`; the production writing runtime still has no package dependencies.

## Publication and preservation checks

- Only tracked files from the selected source paths were copied. The untracked
  claims audit and private data were excluded.
- Canonical prompt bodies, production writing/measurement tools, licensed corpus
  files and historical run directories are unchanged by extraction.
- No GitHub Actions workflow was copied; Actions is disabled on the new repository.
- `git diff --check` passed.
- Gitleaks scanned the imported Git snapshot and reported one reviewed, pre-existing
  false positive: `MyToken` in a dead, archived MySpace URL inside a licensed Doctorow
  sample. The exact occurrence and rationale were already documented in the copied
  `.gitguardian.yaml`. The sample was not altered or broadly exempted.

These checks support installation and extraction integrity. They do not establish
that every draft will be excellent, imitate a user perfectly or contain no factual errors.
