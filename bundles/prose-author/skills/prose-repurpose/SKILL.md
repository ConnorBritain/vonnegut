---
name: prose-repurpose
description: This skill should be used when the user wants one finished piece turned into other forms - a newsletter issue, a LinkedIn post, a thread, a talk abstract - in their own voice, each drafted through the production runtime under that form's medium profile and preference scope, checked mechanically against the profile and the source, and reviewed by the medium critic. It compresses and reshapes; it never invents facts the source lacks and never publishes anywhere.
---

# Prose repurpose

You turn one piece into others. The runtime drafts each form in the writer's
voice; `tools/repurpose-check.mjs` counts what the profile counts and lists
what the source lost; the medium critic reads the result as it will be
delivered. All paths are relative to this skill's directory, and the commands
are agent internals, never homework for the user.

## Pick forms and load their profiles

The profiles ship in `media/`: `newsletter`, `linkedin-post`, `thread`,
`talk-abstract`. Ask which forms the writer wants; do not produce all four
unasked. Each profile is `medium-profile/1`
([docs/contracts/medium-profile.md](../../../../docs/contracts/medium-profile.md)):
*form* is what is written and scopes preferences on the `forms` axis; *medium*
(`web`, `tts`, `print`) is how it is delivered and is what the critic reads
for. A profile that fails validation is refused by name before any model call;
do not edit one to make it pass.

## One runtime run per form

For each form, write a `prose-writing-job/1` for the sibling runtime
([../prose-draft/references/runtime.md](../prose-draft/references/runtime.md)):

- `mode: "rewrite"`, `source_file` = the source piece;
- `context.form` = the profile's `form`, so saved preferences scoped
  `forms: [<form>]` apply and new ones save there through `prose-style-tune`;
- `facts` = the profile's structure and mechanical constraints as facts
  (`profileFacts` in `tools/lib/medium-profile.mjs` renders them) plus the
  source's facts the writer names; never a fact the source does not contain;
- `medium_profile: { path, digest }` recorded in the job so the receipt carries
  which profile, at which bytes, the piece was made for.

Run `node ../prose-draft/tools/prose-runtime.mjs run --job <job> --out <dir>`
once per form. A source with nothing an abstract could state - no claim, no
takeaway - yields a refusal from the runtime; report it, do not draft around it.

## Check, then hand the piece to the medium critic

```bash
node tools/repurpose-check.mjs --profile media/<form>.json --draft <out>/delivery.md --source <source.md> --json
```

Mechanical constraints pass or fail on the final bytes; a failure goes back to
the runtime as a repair with the constraint as a rule, at most twice. Semantic
constraints are `not-evaluated` and the critic's. The missing-atoms list is
shown to the writer as what the compression dropped; it is never a failure.

When `prose-review` is installed, spawn `prose-medium-critic` in a clean
context with the profile, the check output and the piece, and nothing else.
Without it the delivery is `ungated` for medium review and says so. Deliver
one `delivery.md` per form with its receipt, and say what was dropped.

## Never

- Invent a claim, a number or a quotation the source piece does not contain.
- Post, schedule or publish anywhere; the output is files.
- Optimise for engagement, reach or a metric; the profile's constraints are
  the platform's shape, not a target.
- Re-count what the check counted, or edit a profile to make a draft pass.
- State or imply who wrote the source.
