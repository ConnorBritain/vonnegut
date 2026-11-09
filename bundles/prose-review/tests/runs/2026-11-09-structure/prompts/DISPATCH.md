# Dispatching run 2026-11-09-structure

21 cases × 3 draw(s) = 63 clean-context `structure` dispatches.
Every prompt is self-contained and identically shaped; nothing below should be edited per case.

## The rule that makes the run worth anything

Each dispatch gets a FRESH context and sees only its own prompt and the files that
prompt lists. One agent doing two cases has seen a second case's staged copies; one
agent doing all three draws of one case has seen its own earlier verdicts and is not
measuring anything anymore.

## Automatic

```bash
node tests/run-harness.mjs dispatch tests/runs/2026-11-09-structure
```

Uses `$CRITIC_CMD` if set, else a `claude -p` invocation whose tool allowlist is the
integrity rule. Exits 3 with these instructions if neither is available.

## By hand, or from an agent session

For each row below: spawn a fresh subagent, give it `agent-prompt.md` as its system
prompt and the case prompt as its task, and save its reply VERBATIM to the raw path.

| case | save the reply to |
|---|---|
| `prompts/case-01-d1.md` | `raw/n-loo-chesterton-humanity-an-interlude-d1.md` |
| `prompts/case-01-d2.md` | `raw/n-loo-chesterton-humanity-an-interlude-d2.md` |
| `prompts/case-01-d3.md` | `raw/n-loo-chesterton-humanity-an-interlude-d3.md` |
| `prompts/case-02-d1.md` | `raw/n-loo-bacon-of-seditions-and-troubles-d1.md` |
| `prompts/case-02-d2.md` | `raw/n-loo-bacon-of-seditions-and-troubles-d2.md` |
| `prompts/case-02-d3.md` | `raw/n-loo-bacon-of-seditions-and-troubles-d3.md` |
| `prompts/case-03-d1.md` | `raw/n-loo-bacon-of-the-true-greatness-of-kingdoms-and-estates-d1.md` |
| `prompts/case-03-d2.md` | `raw/n-loo-bacon-of-the-true-greatness-of-kingdoms-and-estates-d2.md` |
| `prompts/case-03-d3.md` | `raw/n-loo-bacon-of-the-true-greatness-of-kingdoms-and-estates-d3.md` |
| `prompts/case-04-d1.md` | `raw/n-loo-chesterton-a-somewhat-improbable-story-d1.md` |
| `prompts/case-04-d2.md` | `raw/n-loo-chesterton-a-somewhat-improbable-story-d2.md` |
| `prompts/case-04-d3.md` | `raw/n-loo-chesterton-a-somewhat-improbable-story-d3.md` |
| `prompts/case-05-d1.md` | `raw/n-technical-flat-d1.md` |
| `prompts/case-05-d2.md` | `raw/n-technical-flat-d2.md` |
| `prompts/case-05-d3.md` | `raw/n-technical-flat-d3.md` |
| `prompts/case-06-d1.md` | `raw/n-post-marked-d1.md` |
| `prompts/case-06-d2.md` | `raw/n-post-marked-d2.md` |
| `prompts/case-06-d3.md` | `raw/n-post-marked-d3.md` |
| `prompts/case-07-d1.md` | `raw/p-essay-topic-jump-d1.md` |
| `prompts/case-07-d2.md` | `raw/p-essay-topic-jump-d2.md` |
| `prompts/case-07-d3.md` | `raw/p-essay-topic-jump-d3.md` |
| `prompts/case-08-d1.md` | `raw/n-loo-bacon-of-friendship-d1.md` |
| `prompts/case-08-d2.md` | `raw/n-loo-bacon-of-friendship-d2.md` |
| `prompts/case-08-d3.md` | `raw/n-loo-bacon-of-friendship-d3.md` |
| `prompts/case-09-d1.md` | `raw/n-loo-2026-07-16-lucky-orifices-d1.md` |
| `prompts/case-09-d2.md` | `raw/n-loo-2026-07-16-lucky-orifices-d2.md` |
| `prompts/case-09-d3.md` | `raw/n-loo-2026-07-16-lucky-orifices-d3.md` |
| `prompts/case-10-d1.md` | `raw/p-essay-orphan-claim-d1.md` |
| `prompts/case-10-d2.md` | `raw/p-essay-orphan-claim-d2.md` |
| `prompts/case-10-d3.md` | `raw/p-essay-orphan-claim-d3.md` |
| `prompts/case-11-d1.md` | `raw/n-chapter-scene-breaks-d1.md` |
| `prompts/case-11-d2.md` | `raw/n-chapter-scene-breaks-d2.md` |
| `prompts/case-11-d3.md` | `raw/n-chapter-scene-breaks-d3.md` |
| `prompts/case-12-d1.md` | `raw/p-post-reordered-d1.md` |
| `prompts/case-12-d2.md` | `raw/p-post-reordered-d2.md` |
| `prompts/case-12-d3.md` | `raw/p-post-reordered-d3.md` |
| `prompts/case-13-d1.md` | `raw/n-loo-2026-07-31-just-do-it-d1.md` |
| `prompts/case-13-d2.md` | `raw/n-loo-2026-07-31-just-do-it-d2.md` |
| `prompts/case-13-d3.md` | `raw/n-loo-2026-07-31-just-do-it-d3.md` |
| `prompts/case-14-d1.md` | `raw/n-loo-2026-08-01-dare-snot-d1.md` |
| `prompts/case-14-d2.md` | `raw/n-loo-2026-08-01-dare-snot-d2.md` |
| `prompts/case-14-d3.md` | `raw/n-loo-2026-08-01-dare-snot-d3.md` |
| `prompts/case-15-d1.md` | `raw/n-loo-chesterton-the-diabolist-d1.md` |
| `prompts/case-15-d2.md` | `raw/n-loo-chesterton-the-diabolist-d2.md` |
| `prompts/case-15-d3.md` | `raw/n-loo-chesterton-the-diabolist-d3.md` |
| `prompts/case-16-d1.md` | `raw/n-essay-second-reason-d1.md` |
| `prompts/case-16-d2.md` | `raw/n-essay-second-reason-d2.md` |
| `prompts/case-16-d3.md` | `raw/n-essay-second-reason-d3.md` |
| `prompts/case-17-d1.md` | `raw/n-listicle-cuts-d1.md` |
| `prompts/case-17-d2.md` | `raw/n-listicle-cuts-d2.md` |
| `prompts/case-17-d3.md` | `raw/n-listicle-cuts-d3.md` |
| `prompts/case-18-d1.md` | `raw/n-loo-2026-07-25-cruel-cruelty-oh-cruelty-d1.md` |
| `prompts/case-18-d2.md` | `raw/n-loo-2026-07-25-cruel-cruelty-oh-cruelty-d2.md` |
| `prompts/case-18-d3.md` | `raw/n-loo-2026-07-25-cruel-cruelty-oh-cruelty-d3.md` |
| `prompts/case-19-d1.md` | `raw/n-loo-chesterton-the-shop-of-ghosts-d1.md` |
| `prompts/case-19-d2.md` | `raw/n-loo-chesterton-the-shop-of-ghosts-d2.md` |
| `prompts/case-19-d3.md` | `raw/n-loo-chesterton-the-shop-of-ghosts-d3.md` |
| `prompts/case-20-d1.md` | `raw/n-loo-bacon-of-gardens-d1.md` |
| `prompts/case-20-d2.md` | `raw/n-loo-bacon-of-gardens-d2.md` |
| `prompts/case-20-d3.md` | `raw/n-loo-bacon-of-gardens-d3.md` |
| `prompts/case-21-d1.md` | `raw/p-essay-unsupported-d1.md` |
| `prompts/case-21-d2.md` | `raw/p-essay-unsupported-d2.md` |
| `prompts/case-21-d3.md` | `raw/p-essay-unsupported-d3.md` |

The mapping is here and not in the prompt on purpose — the fixture name encodes the
expected class in its `n-`/`p-` prefix, so the critic must not be told it.

Then:

```bash
node tests/run-harness.mjs collect tests/runs/2026-11-09-structure
```
