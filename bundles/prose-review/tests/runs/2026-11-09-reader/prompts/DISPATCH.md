# Dispatching run 2026-11-09-reader

48 cases × 3 draw(s) = 144 clean-context `reader` dispatches.
Every prompt is self-contained and identically shaped; nothing below should be edited per case.

## The rule that makes the run worth anything

Each dispatch gets a FRESH context and sees only its own prompt and the files that
prompt lists. One agent doing two cases has seen a second case's staged copies; one
agent doing all three draws of one case has seen its own earlier verdicts and is not
measuring anything anymore.

## Automatic

```bash
node tests/run-harness.mjs dispatch tests/runs/2026-11-09-reader
```

Uses `$CRITIC_CMD` if set, else a `claude -p` invocation whose tool allowlist is the
integrity rule. Exits 3 with these instructions if neither is available.

## By hand, or from an agent session

For each row below: spawn a fresh subagent, give it `agent-prompt.md` as its system
prompt and the case prompt as its task, and save its reply VERBATIM to the raw path.

| case | save the reply to |
|---|---|
| `prompts/case-01-d1.md` | `raw/n-first-time-reader-2026-07-16-lucky-orifices-d1.md` |
| `prompts/case-01-d2.md` | `raw/n-first-time-reader-2026-07-16-lucky-orifices-d2.md` |
| `prompts/case-01-d3.md` | `raw/n-first-time-reader-2026-07-16-lucky-orifices-d3.md` |
| `prompts/case-02-d1.md` | `raw/n-acquisitions-editor-2026-07-31-just-do-it-d1.md` |
| `prompts/case-02-d2.md` | `raw/n-acquisitions-editor-2026-07-31-just-do-it-d2.md` |
| `prompts/case-02-d3.md` | `raw/n-acquisitions-editor-2026-07-31-just-do-it-d3.md` |
| `prompts/case-03-d1.md` | `raw/n-first-time-reader-bacon-of-friendship-d1.md` |
| `prompts/case-03-d2.md` | `raw/n-first-time-reader-bacon-of-friendship-d2.md` |
| `prompts/case-03-d3.md` | `raw/n-first-time-reader-bacon-of-friendship-d3.md` |
| `prompts/case-04-d1.md` | `raw/n-skeptical-cto-chesterton-the-shop-of-ghosts-d1.md` |
| `prompts/case-04-d2.md` | `raw/n-skeptical-cto-chesterton-the-shop-of-ghosts-d2.md` |
| `prompts/case-04-d3.md` | `raw/n-skeptical-cto-chesterton-the-shop-of-ghosts-d3.md` |
| `prompts/case-05-d1.md` | `raw/n-adversarial-reader-chesterton-humanity-an-interlude-d1.md` |
| `prompts/case-05-d2.md` | `raw/n-adversarial-reader-chesterton-humanity-an-interlude-d2.md` |
| `prompts/case-05-d3.md` | `raw/n-adversarial-reader-chesterton-humanity-an-interlude-d3.md` |
| `prompts/case-06-d1.md` | `raw/n-acquisitions-editor-2026-07-25-cruel-cruelty-oh-cruelty-d1.md` |
| `prompts/case-06-d2.md` | `raw/n-acquisitions-editor-2026-07-25-cruel-cruelty-oh-cruelty-d2.md` |
| `prompts/case-06-d3.md` | `raw/n-acquisitions-editor-2026-07-25-cruel-cruelty-oh-cruelty-d3.md` |
| `prompts/case-07-d1.md` | `raw/n-skeptical-cto-bacon-of-seditions-and-troubles-d1.md` |
| `prompts/case-07-d2.md` | `raw/n-skeptical-cto-bacon-of-seditions-and-troubles-d2.md` |
| `prompts/case-07-d3.md` | `raw/n-skeptical-cto-bacon-of-seditions-and-troubles-d3.md` |
| `prompts/case-08-d1.md` | `raw/n-first-time-reader-chesterton-the-diabolist-d1.md` |
| `prompts/case-08-d2.md` | `raw/n-first-time-reader-chesterton-the-diabolist-d2.md` |
| `prompts/case-08-d3.md` | `raw/n-first-time-reader-chesterton-the-diabolist-d3.md` |
| `prompts/case-09-d1.md` | `raw/n-skeptical-cto-2026-07-16-lucky-orifices-d1.md` |
| `prompts/case-09-d2.md` | `raw/n-skeptical-cto-2026-07-16-lucky-orifices-d2.md` |
| `prompts/case-09-d3.md` | `raw/n-skeptical-cto-2026-07-16-lucky-orifices-d3.md` |
| `prompts/case-10-d1.md` | `raw/n-adversarial-reader-bacon-of-the-true-greatness-of-kingdoms-and-estates-d1.md` |
| `prompts/case-10-d2.md` | `raw/n-adversarial-reader-bacon-of-the-true-greatness-of-kingdoms-and-estates-d2.md` |
| `prompts/case-10-d3.md` | `raw/n-adversarial-reader-bacon-of-the-true-greatness-of-kingdoms-and-estates-d3.md` |
| `prompts/case-11-d1.md` | `raw/n-adversarial-reader-bacon-of-friendship-d1.md` |
| `prompts/case-11-d2.md` | `raw/n-adversarial-reader-bacon-of-friendship-d2.md` |
| `prompts/case-11-d3.md` | `raw/n-adversarial-reader-bacon-of-friendship-d3.md` |
| `prompts/case-12-d1.md` | `raw/n-adversarial-reader-chesterton-the-shop-of-ghosts-d1.md` |
| `prompts/case-12-d2.md` | `raw/n-adversarial-reader-chesterton-the-shop-of-ghosts-d2.md` |
| `prompts/case-12-d3.md` | `raw/n-adversarial-reader-chesterton-the-shop-of-ghosts-d3.md` |
| `prompts/case-13-d1.md` | `raw/n-acquisitions-editor-chesterton-the-diabolist-d1.md` |
| `prompts/case-13-d2.md` | `raw/n-acquisitions-editor-chesterton-the-diabolist-d2.md` |
| `prompts/case-13-d3.md` | `raw/n-acquisitions-editor-chesterton-the-diabolist-d3.md` |
| `prompts/case-14-d1.md` | `raw/n-adversarial-reader-2026-07-25-cruel-cruelty-oh-cruelty-d1.md` |
| `prompts/case-14-d2.md` | `raw/n-adversarial-reader-2026-07-25-cruel-cruelty-oh-cruelty-d2.md` |
| `prompts/case-14-d3.md` | `raw/n-adversarial-reader-2026-07-25-cruel-cruelty-oh-cruelty-d3.md` |
| `prompts/case-15-d1.md` | `raw/n-first-time-reader-chesterton-the-shop-of-ghosts-d1.md` |
| `prompts/case-15-d2.md` | `raw/n-first-time-reader-chesterton-the-shop-of-ghosts-d2.md` |
| `prompts/case-15-d3.md` | `raw/n-first-time-reader-chesterton-the-shop-of-ghosts-d3.md` |
| `prompts/case-16-d1.md` | `raw/n-acquisitions-editor-bacon-of-friendship-d1.md` |
| `prompts/case-16-d2.md` | `raw/n-acquisitions-editor-bacon-of-friendship-d2.md` |
| `prompts/case-16-d3.md` | `raw/n-acquisitions-editor-bacon-of-friendship-d3.md` |
| `prompts/case-17-d1.md` | `raw/n-first-time-reader-bacon-of-seditions-and-troubles-d1.md` |
| `prompts/case-17-d2.md` | `raw/n-first-time-reader-bacon-of-seditions-and-troubles-d2.md` |
| `prompts/case-17-d3.md` | `raw/n-first-time-reader-bacon-of-seditions-and-troubles-d3.md` |
| `prompts/case-18-d1.md` | `raw/n-skeptical-cto-chesterton-humanity-an-interlude-d1.md` |
| `prompts/case-18-d2.md` | `raw/n-skeptical-cto-chesterton-humanity-an-interlude-d2.md` |
| `prompts/case-18-d3.md` | `raw/n-skeptical-cto-chesterton-humanity-an-interlude-d3.md` |
| `prompts/case-19-d1.md` | `raw/n-first-time-reader-bacon-of-the-true-greatness-of-kingdoms-and-estates-d1.md` |
| `prompts/case-19-d2.md` | `raw/n-first-time-reader-bacon-of-the-true-greatness-of-kingdoms-and-estates-d2.md` |
| `prompts/case-19-d3.md` | `raw/n-first-time-reader-bacon-of-the-true-greatness-of-kingdoms-and-estates-d3.md` |
| `prompts/case-20-d1.md` | `raw/n-first-time-reader-2026-07-31-just-do-it-d1.md` |
| `prompts/case-20-d2.md` | `raw/n-first-time-reader-2026-07-31-just-do-it-d2.md` |
| `prompts/case-20-d3.md` | `raw/n-first-time-reader-2026-07-31-just-do-it-d3.md` |
| `prompts/case-21-d1.md` | `raw/n-acquisitions-editor-bacon-of-the-true-greatness-of-kingdoms-and-estates-d1.md` |
| `prompts/case-21-d2.md` | `raw/n-acquisitions-editor-bacon-of-the-true-greatness-of-kingdoms-and-estates-d2.md` |
| `prompts/case-21-d3.md` | `raw/n-acquisitions-editor-bacon-of-the-true-greatness-of-kingdoms-and-estates-d3.md` |
| `prompts/case-22-d1.md` | `raw/n-acquisitions-editor-chesterton-the-shop-of-ghosts-d1.md` |
| `prompts/case-22-d2.md` | `raw/n-acquisitions-editor-chesterton-the-shop-of-ghosts-d2.md` |
| `prompts/case-22-d3.md` | `raw/n-acquisitions-editor-chesterton-the-shop-of-ghosts-d3.md` |
| `prompts/case-23-d1.md` | `raw/n-acquisitions-editor-chesterton-humanity-an-interlude-d1.md` |
| `prompts/case-23-d2.md` | `raw/n-acquisitions-editor-chesterton-humanity-an-interlude-d2.md` |
| `prompts/case-23-d3.md` | `raw/n-acquisitions-editor-chesterton-humanity-an-interlude-d3.md` |
| `prompts/case-24-d1.md` | `raw/n-first-time-reader-chesterton-a-somewhat-improbable-story-d1.md` |
| `prompts/case-24-d2.md` | `raw/n-first-time-reader-chesterton-a-somewhat-improbable-story-d2.md` |
| `prompts/case-24-d3.md` | `raw/n-first-time-reader-chesterton-a-somewhat-improbable-story-d3.md` |
| `prompts/case-25-d1.md` | `raw/n-first-time-reader-2026-08-01-dare-snot-d1.md` |
| `prompts/case-25-d2.md` | `raw/n-first-time-reader-2026-08-01-dare-snot-d2.md` |
| `prompts/case-25-d3.md` | `raw/n-first-time-reader-2026-08-01-dare-snot-d3.md` |
| `prompts/case-26-d1.md` | `raw/n-acquisitions-editor-2026-07-16-lucky-orifices-d1.md` |
| `prompts/case-26-d2.md` | `raw/n-acquisitions-editor-2026-07-16-lucky-orifices-d2.md` |
| `prompts/case-26-d3.md` | `raw/n-acquisitions-editor-2026-07-16-lucky-orifices-d3.md` |
| `prompts/case-27-d1.md` | `raw/n-adversarial-reader-2026-07-16-lucky-orifices-d1.md` |
| `prompts/case-27-d2.md` | `raw/n-adversarial-reader-2026-07-16-lucky-orifices-d2.md` |
| `prompts/case-27-d3.md` | `raw/n-adversarial-reader-2026-07-16-lucky-orifices-d3.md` |
| `prompts/case-28-d1.md` | `raw/n-skeptical-cto-2026-08-01-dare-snot-d1.md` |
| `prompts/case-28-d2.md` | `raw/n-skeptical-cto-2026-08-01-dare-snot-d2.md` |
| `prompts/case-28-d3.md` | `raw/n-skeptical-cto-2026-08-01-dare-snot-d3.md` |
| `prompts/case-29-d1.md` | `raw/n-adversarial-reader-chesterton-a-somewhat-improbable-story-d1.md` |
| `prompts/case-29-d2.md` | `raw/n-adversarial-reader-chesterton-a-somewhat-improbable-story-d2.md` |
| `prompts/case-29-d3.md` | `raw/n-adversarial-reader-chesterton-a-somewhat-improbable-story-d3.md` |
| `prompts/case-30-d1.md` | `raw/n-first-time-reader-bacon-of-gardens-d1.md` |
| `prompts/case-30-d2.md` | `raw/n-first-time-reader-bacon-of-gardens-d2.md` |
| `prompts/case-30-d3.md` | `raw/n-first-time-reader-bacon-of-gardens-d3.md` |
| `prompts/case-31-d1.md` | `raw/n-adversarial-reader-bacon-of-seditions-and-troubles-d1.md` |
| `prompts/case-31-d2.md` | `raw/n-adversarial-reader-bacon-of-seditions-and-troubles-d2.md` |
| `prompts/case-31-d3.md` | `raw/n-adversarial-reader-bacon-of-seditions-and-troubles-d3.md` |
| `prompts/case-32-d1.md` | `raw/n-skeptical-cto-chesterton-the-diabolist-d1.md` |
| `prompts/case-32-d2.md` | `raw/n-skeptical-cto-chesterton-the-diabolist-d2.md` |
| `prompts/case-32-d3.md` | `raw/n-skeptical-cto-chesterton-the-diabolist-d3.md` |
| `prompts/case-33-d1.md` | `raw/n-adversarial-reader-2026-08-01-dare-snot-d1.md` |
| `prompts/case-33-d2.md` | `raw/n-adversarial-reader-2026-08-01-dare-snot-d2.md` |
| `prompts/case-33-d3.md` | `raw/n-adversarial-reader-2026-08-01-dare-snot-d3.md` |
| `prompts/case-34-d1.md` | `raw/n-acquisitions-editor-bacon-of-gardens-d1.md` |
| `prompts/case-34-d2.md` | `raw/n-acquisitions-editor-bacon-of-gardens-d2.md` |
| `prompts/case-34-d3.md` | `raw/n-acquisitions-editor-bacon-of-gardens-d3.md` |
| `prompts/case-35-d1.md` | `raw/n-acquisitions-editor-2026-08-01-dare-snot-d1.md` |
| `prompts/case-35-d2.md` | `raw/n-acquisitions-editor-2026-08-01-dare-snot-d2.md` |
| `prompts/case-35-d3.md` | `raw/n-acquisitions-editor-2026-08-01-dare-snot-d3.md` |
| `prompts/case-36-d1.md` | `raw/n-skeptical-cto-bacon-of-friendship-d1.md` |
| `prompts/case-36-d2.md` | `raw/n-skeptical-cto-bacon-of-friendship-d2.md` |
| `prompts/case-36-d3.md` | `raw/n-skeptical-cto-bacon-of-friendship-d3.md` |
| `prompts/case-37-d1.md` | `raw/n-skeptical-cto-2026-07-25-cruel-cruelty-oh-cruelty-d1.md` |
| `prompts/case-37-d2.md` | `raw/n-skeptical-cto-2026-07-25-cruel-cruelty-oh-cruelty-d2.md` |
| `prompts/case-37-d3.md` | `raw/n-skeptical-cto-2026-07-25-cruel-cruelty-oh-cruelty-d3.md` |
| `prompts/case-38-d1.md` | `raw/n-adversarial-reader-bacon-of-gardens-d1.md` |
| `prompts/case-38-d2.md` | `raw/n-adversarial-reader-bacon-of-gardens-d2.md` |
| `prompts/case-38-d3.md` | `raw/n-adversarial-reader-bacon-of-gardens-d3.md` |
| `prompts/case-39-d1.md` | `raw/n-adversarial-reader-chesterton-the-diabolist-d1.md` |
| `prompts/case-39-d2.md` | `raw/n-adversarial-reader-chesterton-the-diabolist-d2.md` |
| `prompts/case-39-d3.md` | `raw/n-adversarial-reader-chesterton-the-diabolist-d3.md` |
| `prompts/case-40-d1.md` | `raw/n-acquisitions-editor-chesterton-a-somewhat-improbable-story-d1.md` |
| `prompts/case-40-d2.md` | `raw/n-acquisitions-editor-chesterton-a-somewhat-improbable-story-d2.md` |
| `prompts/case-40-d3.md` | `raw/n-acquisitions-editor-chesterton-a-somewhat-improbable-story-d3.md` |
| `prompts/case-41-d1.md` | `raw/n-skeptical-cto-chesterton-a-somewhat-improbable-story-d1.md` |
| `prompts/case-41-d2.md` | `raw/n-skeptical-cto-chesterton-a-somewhat-improbable-story-d2.md` |
| `prompts/case-41-d3.md` | `raw/n-skeptical-cto-chesterton-a-somewhat-improbable-story-d3.md` |
| `prompts/case-42-d1.md` | `raw/n-first-time-reader-2026-07-25-cruel-cruelty-oh-cruelty-d1.md` |
| `prompts/case-42-d2.md` | `raw/n-first-time-reader-2026-07-25-cruel-cruelty-oh-cruelty-d2.md` |
| `prompts/case-42-d3.md` | `raw/n-first-time-reader-2026-07-25-cruel-cruelty-oh-cruelty-d3.md` |
| `prompts/case-43-d1.md` | `raw/n-acquisitions-editor-bacon-of-seditions-and-troubles-d1.md` |
| `prompts/case-43-d2.md` | `raw/n-acquisitions-editor-bacon-of-seditions-and-troubles-d2.md` |
| `prompts/case-43-d3.md` | `raw/n-acquisitions-editor-bacon-of-seditions-and-troubles-d3.md` |
| `prompts/case-44-d1.md` | `raw/n-adversarial-reader-2026-07-31-just-do-it-d1.md` |
| `prompts/case-44-d2.md` | `raw/n-adversarial-reader-2026-07-31-just-do-it-d2.md` |
| `prompts/case-44-d3.md` | `raw/n-adversarial-reader-2026-07-31-just-do-it-d3.md` |
| `prompts/case-45-d1.md` | `raw/n-skeptical-cto-2026-07-31-just-do-it-d1.md` |
| `prompts/case-45-d2.md` | `raw/n-skeptical-cto-2026-07-31-just-do-it-d2.md` |
| `prompts/case-45-d3.md` | `raw/n-skeptical-cto-2026-07-31-just-do-it-d3.md` |
| `prompts/case-46-d1.md` | `raw/n-first-time-reader-chesterton-humanity-an-interlude-d1.md` |
| `prompts/case-46-d2.md` | `raw/n-first-time-reader-chesterton-humanity-an-interlude-d2.md` |
| `prompts/case-46-d3.md` | `raw/n-first-time-reader-chesterton-humanity-an-interlude-d3.md` |
| `prompts/case-47-d1.md` | `raw/n-skeptical-cto-bacon-of-gardens-d1.md` |
| `prompts/case-47-d2.md` | `raw/n-skeptical-cto-bacon-of-gardens-d2.md` |
| `prompts/case-47-d3.md` | `raw/n-skeptical-cto-bacon-of-gardens-d3.md` |
| `prompts/case-48-d1.md` | `raw/n-skeptical-cto-bacon-of-the-true-greatness-of-kingdoms-and-estates-d1.md` |
| `prompts/case-48-d2.md` | `raw/n-skeptical-cto-bacon-of-the-true-greatness-of-kingdoms-and-estates-d2.md` |
| `prompts/case-48-d3.md` | `raw/n-skeptical-cto-bacon-of-the-true-greatness-of-kingdoms-and-estates-d3.md` |

The mapping is here and not in the prompt on purpose — the fixture name encodes the
expected class in its `n-`/`p-` prefix, so the critic must not be told it.

Then:

```bash
node tests/run-harness.mjs collect tests/runs/2026-11-09-reader
```
