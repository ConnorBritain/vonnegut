# Dispatching run 2026-11-09-fidelity-provenance

16 cases × 3 draw(s) = 48 clean-context `fidelity` dispatches.
Every prompt is self-contained and identically shaped; nothing below should be edited per case.

## The rule that makes the run worth anything

Each dispatch gets a FRESH context and sees only its own prompt and the files that
prompt lists. One agent doing two cases has seen a second case's staged copies; one
agent doing all three draws of one case has seen its own earlier verdicts and is not
measuring anything anymore.

## Automatic

```bash
node tests/run-harness.mjs dispatch tests/runs/2026-11-09-fidelity-provenance
```

Uses `$CRITIC_CMD` if set, else a `claude -p` invocation whose tool allowlist is the
integrity rule. Exits 3 with these instructions if neither is available.

## By hand, or from an agent session

For each row below: spawn a fresh subagent, give it `agent-prompt.md` as its system
prompt and the case prompt as its task, and save its reply VERBATIM to the raw path.

| case | save the reply to |
|---|---|
| `prompts/case-01-d1.md` | `raw/p-death-severus-unnamed-d1.md` |
| `prompts/case-01-d2.md` | `raw/p-death-severus-unnamed-d2.md` |
| `prompts/case-01-d3.md` | `raw/p-death-severus-unnamed-d3.md` |
| `prompts/case-02-d1.md` | `raw/p-anger-scripture-misquoted-d1.md` |
| `prompts/case-02-d2.md` | `raw/p-anger-scripture-misquoted-d2.md` |
| `prompts/case-02-d3.md` | `raw/p-anger-scripture-misquoted-d3.md` |
| `prompts/case-03-d1.md` | `raw/n-beauty-modernised-d1.md` |
| `prompts/case-03-d2.md` | `raw/n-beauty-modernised-d2.md` |
| `prompts/case-03-d3.md` | `raw/n-beauty-modernised-d3.md` |
| `prompts/case-04-d1.md` | `raw/p-beauty-qualifications-dropped-d1.md` |
| `prompts/case-04-d2.md` | `raw/p-beauty-qualifications-dropped-d2.md` |
| `prompts/case-04-d3.md` | `raw/p-beauty-qualifications-dropped-d3.md` |
| `prompts/case-05-d1.md` | `raw/n-tihonov-reordered-d1.md` |
| `prompts/case-05-d2.md` | `raw/n-tihonov-reordered-d2.md` |
| `prompts/case-05-d3.md` | `raw/n-tihonov-reordered-d3.md` |
| `prompts/case-06-d1.md` | `raw/n-rossolimo-island-dropped-d1.md` |
| `prompts/case-06-d2.md` | `raw/n-rossolimo-island-dropped-d2.md` |
| `prompts/case-06-d3.md` | `raw/n-rossolimo-island-dropped-d3.md` |
| `prompts/case-07-d1.md` | `raw/n-tihonov-moscow-university-d1.md` |
| `prompts/case-07-d2.md` | `raw/n-tihonov-moscow-university-d2.md` |
| `prompts/case-07-d3.md` | `raw/n-tihonov-moscow-university-d3.md` |
| `prompts/case-08-d1.md` | `raw/n-rossolimo-tightened-d1.md` |
| `prompts/case-08-d2.md` | `raw/n-rossolimo-tightened-d2.md` |
| `prompts/case-08-d3.md` | `raw/n-rossolimo-tightened-d3.md` |
| `prompts/case-09-d1.md` | `raw/p-tihonov-summarised-d1.md` |
| `prompts/case-09-d2.md` | `raw/p-tihonov-summarised-d2.md` |
| `prompts/case-09-d3.md` | `raw/p-tihonov-summarised-d3.md` |
| `prompts/case-10-d1.md` | `raw/p-rossolimo-hedges-removed-d1.md` |
| `prompts/case-10-d2.md` | `raw/p-rossolimo-hedges-removed-d2.md` |
| `prompts/case-10-d3.md` | `raw/p-rossolimo-hedges-removed-d3.md` |
| `prompts/case-11-d1.md` | `raw/p-sister-fourmis-cut-d1.md` |
| `prompts/case-11-d2.md` | `raw/p-sister-fourmis-cut-d2.md` |
| `prompts/case-11-d3.md` | `raw/p-sister-fourmis-cut-d3.md` |
| `prompts/case-12-d1.md` | `raw/n-anger-scripture-exact-d1.md` |
| `prompts/case-12-d2.md` | `raw/n-anger-scripture-exact-d2.md` |
| `prompts/case-12-d3.md` | `raw/n-anger-scripture-exact-d3.md` |
| `prompts/case-13-d1.md` | `raw/p-anger-seneca-misquoted-d1.md` |
| `prompts/case-13-d2.md` | `raw/p-anger-seneca-misquoted-d2.md` |
| `prompts/case-13-d3.md` | `raw/p-anger-seneca-misquoted-d3.md` |
| `prompts/case-14-d1.md` | `raw/p-sister-scope-dropped-d1.md` |
| `prompts/case-14-d2.md` | `raw/p-sister-scope-dropped-d2.md` |
| `prompts/case-14-d3.md` | `raw/p-sister-scope-dropped-d3.md` |
| `prompts/case-15-d1.md` | `raw/p-death-quotes-paraphrased-d1.md` |
| `prompts/case-15-d2.md` | `raw/p-death-quotes-paraphrased-d2.md` |
| `prompts/case-15-d3.md` | `raw/p-death-quotes-paraphrased-d3.md` |
| `prompts/case-16-d1.md` | `raw/n-sister-condensed-d1.md` |
| `prompts/case-16-d2.md` | `raw/n-sister-condensed-d2.md` |
| `prompts/case-16-d3.md` | `raw/n-sister-condensed-d3.md` |

The mapping is here and not in the prompt on purpose — the fixture name encodes the
expected class in its `n-`/`p-` prefix, so the critic must not be told it.

Then:

```bash
node tests/run-harness.mjs collect tests/runs/2026-11-09-fidelity-provenance
```
