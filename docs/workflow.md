# From a spoken idea to a finished piece

This page describes the path from a voice-memo transcript to a reviewed draft.
It spans five bundles, and no single bundle owns it, so it lives here. Every
stage is usable alone. You can enter at any stage, and skipping one costs only
what that stage would have caught.

Stages marked *planned* are roadmap sequence 4 ([`ROADMAP.md`](ROADMAP.md),
items H–L). The rest ship today.

```
transcript (+ your summary)
   │  H  brainstorm ── angles, each resting on quoted transcript spans     planned
   ▼
project brief
   │  I  interview ─── one question at a time, a recommended answer each   planned
   ▼
decisions (audience, length, shape, thesis, must-include, links)
   │  J  outline ───── 2–3 candidate outlines in different shapes          planned
   ▼
approved outline  (prose-outline, ships today as one proposal)
   │  K  handoff ───── outline + brief → a drafting job, mechanically      planned
   ▼
draft in your voice  (prose-draft runtime, ships)
   │     review ────── scans + clean-context critics, consolidated         ships
   ▼
   │  L  editor pass ─ read it section by section with the notes beside it planned
   ▼
plan → reviser → fidelity check → accept  (prose-review, ships)
```

## What each stage is for

- **Brainstorm (H).** The transcript is raw material. A script cleans it
  without losing line numbers and counts what is countable: length, recurring
  terms, the questions you asked yourself, and where the topic shifts. The model
  proposes three to five *angles*. Each angle is a possible piece, with a working
  thesis, an audience, a suggested shape and the transcript passages it would
  use. Every quoted passage is checked verbatim against the transcript. Every
  segment of the transcript is either used by an angle or listed as unused, so
  nothing you said is silently dropped.
- **Interview (I).** This stage is adapted from the "grill me" pattern. The
  session walks a fixed decision tree with you, one question at a time, and
  offers its recommended answer with each one. If the transcript, your summary,
  an earlier outline, your continuity bible or your research ledger already
  answers a question, the session shows you that answer and asks you to confirm
  it, instead of asking the question fresh. A script, not the model, decides
  which decision comes next and whether the interview is done. When an upstream
  answer changes, it marks the answers downstream of it as stale.
- **Outline baselines (J).** Shapes ship as data files: argument essay,
  narrative arc, problem and solution, questions and answers, numbered lessons,
  and letter. From one brief the session proposes two or three outlines in
  different shapes. Each section carries a word budget. A script checks that
  each candidate fits the brief's length band, has its shape's required parts
  and covers every must-include item. You pick one, and only that one is saved.
- **Handoff (K).** A script turns the approved outline and the brief into a
  drafting job:
  - the length band becomes a word-limit rule;
  - sections become ordered facts with their budgets;
  - filled evidence becomes facts;
  - open questions stop the job unless you explicitly carry them forward
    unresolved.

  The drafting runtime then writes in your voice from your saved preferences
  and exemplars. After drafting, the structure critic checks the draft against
  the outline you intended.
- **Editor pass (L).** The critics still run once, on the whole draft, under
  the conditions their numbers were measured on. The editor pass is how you
  *read* their results. The session walks the draft section by section and shows
  the consolidated notes that fall in each section. You accept, decline or defer
  each note, and add your own. Accepted notes become the reviser's plan. The
  session adds no critique of its own.

## Where state lives

Each stage writes to at most one approval-gated store under your writing
identity ([`registry-stores.md`](registry-stores.md)). Nothing persists without a yes.

| Stage | Store | Schema |
|---|---|---|
| H, I | `brief/` (planned) | `project-brief/1` |
| J | `outlines/` | `voice-outline/1`, with optional length, shape and section budgets |
| draft | task directory + receipt | `prose-writing-job/1` |
| review, L | task directory | `plan.json`, `edit-notes/1` |

No stage reads another bundle's store. When the interview needs your bible or
research ledger, the session runs that bundle's own read tool and passes the
result in as input, the same way critics receive scan output. If that bundle
is not installed, the interview says so and asks you instead.

## Entering midway

- **No transcript.** Start at the interview with a typed brief.
- **An outline you wrote yourself.** Paste it, validate it, and go to the handoff.
- **A draft already written.** Go straight to review and the editor pass. The
  outline skill can read the draft back into the outline it implies, so the
  structure critic still has something to compare against.
