# Dispatching run 2026-11-09-medium

12 cases × 3 draw(s) = 36 clean-context `medium` dispatches.
Every prompt is self-contained and identically shaped; nothing below should be edited per case.

## The rule that makes the run worth anything

Each dispatch gets a FRESH context and sees only its own prompt and the files that
prompt lists. One agent doing two cases has seen a second case's staged copies; one
agent doing all three draws of one case has seen its own earlier verdicts and is not
measuring anything anymore.

## Automatic

```bash
node tests/run-harness.mjs dispatch tests/runs/2026-11-09-medium
```

Uses `$CRITIC_CMD` if set, else a `claude -p` invocation whose tool allowlist is the
integrity rule. Exits 3 with these instructions if neither is available.

## By hand, or from an agent session

For each row below: spawn a fresh subagent, give it `agent-prompt.md` as its system
prompt and the case prompt as its task, and save its reply VERBATIM to the raw path.

| case | save the reply to |
|---|---|
| `prompts/case-01-d1.md` | `raw/n-loo-2026-07-29-la-la-la-la-la-d1.md` |
| `prompts/case-01-d2.md` | `raw/n-loo-2026-07-29-la-la-la-la-la-d2.md` |
| `prompts/case-01-d3.md` | `raw/n-loo-2026-07-29-la-la-la-la-la-d3.md` |
| `prompts/case-02-d1.md` | `raw/n-loo-2026-08-04-technology-freedom-cooperative-d1.md` |
| `prompts/case-02-d2.md` | `raw/n-loo-2026-08-04-technology-freedom-cooperative-d2.md` |
| `prompts/case-02-d3.md` | `raw/n-loo-2026-08-04-technology-freedom-cooperative-d3.md` |
| `prompts/case-03-d1.md` | `raw/p-thread-long-and-cut-d1.md` |
| `prompts/case-03-d2.md` | `raw/p-thread-long-and-cut-d2.md` |
| `prompts/case-03-d3.md` | `raw/p-thread-long-and-cut-d3.md` |
| `prompts/case-04-d1.md` | `raw/n-thread-clean-d1.md` |
| `prompts/case-04-d2.md` | `raw/n-thread-clean-d2.md` |
| `prompts/case-04-d3.md` | `raw/n-thread-clean-d3.md` |
| `prompts/case-05-d1.md` | `raw/n-post-hook-carries-d1.md` |
| `prompts/case-05-d2.md` | `raw/n-post-hook-carries-d2.md` |
| `prompts/case-05-d3.md` | `raw/n-post-hook-carries-d3.md` |
| `prompts/case-06-d1.md` | `raw/n-loo-2026-07-09-wilhoitian-d1.md` |
| `prompts/case-06-d2.md` | `raw/n-loo-2026-07-09-wilhoitian-d2.md` |
| `prompts/case-06-d3.md` | `raw/n-loo-2026-07-09-wilhoitian-d3.md` |
| `prompts/case-07-d1.md` | `raw/p-thread-cut-sentence-d1.md` |
| `prompts/case-07-d2.md` | `raw/p-thread-cut-sentence-d2.md` |
| `prompts/case-07-d3.md` | `raw/p-thread-cut-sentence-d3.md` |
| `prompts/case-08-d1.md` | `raw/p-post-hook-buried-d1.md` |
| `prompts/case-08-d2.md` | `raw/p-post-hook-buried-d2.md` |
| `prompts/case-08-d3.md` | `raw/p-post-hook-buried-d3.md` |
| `prompts/case-09-d1.md` | `raw/n-thread-long-but-whole-d1.md` |
| `prompts/case-09-d2.md` | `raw/n-thread-long-but-whole-d2.md` |
| `prompts/case-09-d3.md` | `raw/n-thread-long-but-whole-d3.md` |
| `prompts/case-10-d1.md` | `raw/n-loo-2026-07-13-go-meta-meta-d1.md` |
| `prompts/case-10-d2.md` | `raw/n-loo-2026-07-13-go-meta-meta-d2.md` |
| `prompts/case-10-d3.md` | `raw/n-loo-2026-07-13-go-meta-meta-d3.md` |
| `prompts/case-11-d1.md` | `raw/n-loo-2026-07-10-posthuman-as-in-no-humans-d1.md` |
| `prompts/case-11-d2.md` | `raw/n-loo-2026-07-10-posthuman-as-in-no-humans-d2.md` |
| `prompts/case-11-d3.md` | `raw/n-loo-2026-07-10-posthuman-as-in-no-humans-d3.md` |
| `prompts/case-12-d1.md` | `raw/n-loo-2026-07-14-designated-survivor-d1.md` |
| `prompts/case-12-d2.md` | `raw/n-loo-2026-07-14-designated-survivor-d2.md` |
| `prompts/case-12-d3.md` | `raw/n-loo-2026-07-14-designated-survivor-d3.md` |

The mapping is here and not in the prompt on purpose — the fixture name encodes the
expected class in its `n-`/`p-` prefix, so the critic must not be told it.

Then:

```bash
node tests/run-harness.mjs collect tests/runs/2026-11-09-medium
```
