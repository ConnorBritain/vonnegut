# Vonnegut

Personal-style writing tools for coding agents. Draft, rewrite and continue prose
using your examples and preferences; keep corrections, profiles and optional
writing metrics in one shared place across compatible installations.

You ask your coding agent to write. The skills handle preparation, model calls,
checks and bounded repairs. There is no separate writing application to operate.

## What you can do

- Draft a reply, turn an outline into a post, rewrite a passage or continue it.
- Learn advisory patterns from attributable human writing and select whole examples.
- Save explicit style preferences with scope, version history and undo.
- Check supported mechanical rules against the delivered text; review voice and fidelity.
- Opt into numerical history to compare patterns over time without retaining the
  source prose in the metrics store.

Observed frequencies are tendencies, not compulsory quotas. Missing checks stay
visible. These tools do not guarantee resemblance, quality, factual accuracy or
detector outcomes. Example facts are not automatically facts about you.

## Four independently installable bundles

| Bundle | Version | Purpose |
|---|---|---|
| [prose-author](bundles/prose-author/) | 0.6.0 | Drafting, profiles, persistent preferences and opt-in history |
| [prose-review](bundles/prose-review/) | 0.3.0 | Voice and fidelity critics, plus a plan-based reviser |
| [prose-tell-scan](bundles/prose-tell-scan/) | 0.1.1 | Deterministic prose measurements and report-only signals |
| [prose-outline](bundles/prose-outline/) | 0.1.0 | Outlines from a brief, a draft's implied outline, diffs, per-project persistence |

Install all four for the complete writing workflow. Seven agents and four
skills ship; the experimental `prose-pattern-critic` source remains held.

## Install

Use Node.js 22+ and an authenticated Claude Code or Codex CLI for the full runtime.
Model calls use the configured CLI sessions; no separate API key is required.

### Codex

```bash
git clone https://github.com/ConnorBritain/vonnegut.git
cd vonnegut
node install-prose-codex.mjs
node install-prose-codex.mjs --check
```

This installs the local checkout's four plugins and seven custom agents. Keep
the checkout at that path. Start a new session, then ask for `$prose-draft`,
`$prose-style-tune`, `$tell-scan` or `$prose-outline`.

### Claude Code

```text
/plugin marketplace add ConnorBritain/vonnegut
/plugin install prose-author@vonnegut
/plugin install prose-review@vonnegut
/plugin install prose-tell-scan@vonnegut
/plugin install prose-outline@vonnegut
```

Restart the session and ask for `prose-draft`, `prose-style-tune` or `prose-outline`.
For loose files, clone the repo and run `./install.sh` (Windows: `./install.ps1`).
Use `--project` (`-Project` on Windows) to install into the current project.

The [installation guide](bundles/prose-author/INSTALL.md) covers updates, local
candidates, dependency discovery and other harnesses. If you already use the
agent-primitives versions, read [migration](docs/MIGRATION.md) before enabling duplicates.

### Shared writing memory

Ask: “Set up one shared personal writing identity for my writing tools.”
The registry defaults to `~/.config/prose-author/identities`, outside plugin
installations. The repo rename does not move your corpus, profiles, preferences
or history. Installation does not enable collection. See [shared identities](bundles/prose-author/skills/prose-draft/references/identities.md).

Codex and Claude extensions inside Devin use their respective native installations.
Other hosts need skill discovery and a supported CLI backend. Pi's adapter
interface is documented, but there is no native Pi generation adapter.

## Development and evidence

Canonical agent prompts live in `primitives/agents/`; deployable bundles live in
`bundles/`. Their prompt bodies must match exactly. The runtime is dependency-free
Node.js; skills carry their tooling through relative paths.

Run the engineering checks locally:

```bash
node tools/check.mjs
node tools/check.mjs --mutations
```

The second command adds the full mutation sweep. Neither command generates new
model drafts. There are no GitHub Actions workflows. See [contributing](CONTRIBUTING.md),
[portability](docs/portability.md), [wiring](docs/wiring.md) and [extraction verification](docs/EXTRACTION-VERIFICATION.md).
Planned work lives in the [roadmap](docs/ROADMAP.md); its [status checklist](docs/roadmap/STATUS.md)
also pins every bundle version, and the checks fail when the two drift.

With both CLIs installed, `node tools/check-installation.mjs` tests plugin and
loose-file installation in temporary configuration directories, without changing
your active installations or making model calls.

This toolkit was developed in [agent-primitives](https://github.com/ConnorBritain/agent-primitives)
and extracted at commit `052a54a`. Historical tests and licensed evaluation corpora
remain available; old acceptance thresholds are historical evidence, not current
runtime promises. [Provenance](docs/PROVENANCE.md) records what moved and what did not.

## License

Code and original prompts: [MIT](LICENSE). Vendored writing samples retain their
individual public-domain or Creative Commons terms and attribution files; the MIT
license does not replace those terms. This project is not affiliated with or
endorsed by Kurt Vonnegut or his estate.
