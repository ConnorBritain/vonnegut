# Prose review

Portable form of the [`prose-review`](README.md) bundle, for harnesses with no
agent registry.

> **Read this first.** Unlike `prose-tell-scan`, which is a script and ports
> perfectly, this bundle loses the most in translation. `docs/portability.md`
> grades reviewer degradation as **severe**, and the reason applies exactly here:
> **context isolation is the mechanism.** A critic that saw the draft being
> written recognises its own choices as the author's, and the comparison stops
> being honest without anything visibly changing.
>
> If you can only recover one property elsewhere, recover that one — a fresh
> subprocess with only the draft and the corpus.

## Instruction block

Paste into your project `AGENTS.md`.

```markdown
## Prose voice review

When asked whether a draft sounds like its author, and a writing corpus exists:

1. Read the voice card and every corpus sample BEFORE the draft.
2. If there is no corpus, say so and stop. Without it you can flag internal
   inconsistency but nothing about THIS author's voice.
3. Look for: register breaks, constructions absent from the corpus, vocabulary
   from a different register, rhythm that flattens, a voice that never shifts.
4. EVERY finding must cite how the author writes instead, with a sample
   reference. A finding without that citation is a guess — drop it.
5. When you cannot tell, say nothing. A wrong "this doesn't sound like you"
   teaches someone to write blandly; a missed passage costs one paragraph.
6. Never state or imply that a passage was machine-written.
7. End with CLEAN or REVISE. CLEAN is the expected result on a draft the author
   wrote, and returning it is not a failure.

Do not judge quality, clarity, or correctness. This is one question only.
```

```markdown
## Prose fidelity review

When a revision must be checked against the text it replaced:

1. If there is no original, stop. Fidelity is a comparison; judging the revision
   on its own terms is a different question.
2. Run the deterministic scan FIRST and read its output:
   `node tools/fidelity-scan.mjs <original> <revision>`
3. The scan is authoritative on PRESENCE. Never claim a flagged atom is present.
   If you think the scan is wrong, say so under "Scanner defects" as a bug report
   about the tool, and do not fold it into a fidelity finding.
4. Look for, in order: flagged atoms genuinely gone; claim drift the scan cannot
   see (polarity reversed, hedge removed, attribution dropped); dropped
   qualifications and scope limits; edits outside the plan; a heading rename that
   took its section with it.
5. Account for EVERY flagged atom. Anything you did not raise goes under
   "Immaterial losses" with a reason, one line each.
6. Every finding quotes both the original span and what stands in its place. One
   that does not is a guess — drop it.
7. When you cannot tell whether a loss matters, it matters. A loss waved through
   ships; a wrong finding costs a glance at two lines.
8. End with FAITHFUL or MATERIAL-LOSS. MATERIAL-LOSS says information was lost,
   not that the revision is bad.

Do not judge whether it reads better, and do not judge voice — that is the voice
critic's question. Do not propose fixes.
```

```markdown
## Prose structure review

When a draft is an argument and its structure should be checked, and
`prose-outline`'s scan is available:

1. Run the scan FIRST and read its JSON:
   `node <path>/skills/prose-outline/tools/outline-scan.mjs <draft> --json`
   If there is no scan, say structure was not reviewed. Do not estimate
   section lengths or transitions by eye.
2. Say which mode you are in. With the intended outline supplied, assess
   unsupported claims and order against it and resolve uncertainty toward
   REVISE. Without one, assess only transitions and balance, say support and
   order were not assessed, and resolve uncertainty to silence.
3. The scan is authoritative on counts. Never re-count words or re-classify a
   marker; dispute the tool under "Scanner defects".
4. Every finding quotes a span and names the scan field or outline node it
   rests on, and carries a PLAN-ENTRY saying what to do, never how the new
   text should read. A finding without those is a guess — drop it.
5. A flat reference document is correctly flat. Length alone is never a finding.
6. Never state or imply that a passage was machine-written.
7. End with CLEAN or REVISE. CLEAN is the expected result on a draft whose
   structure does its job.

Do not judge voice, fidelity, truth or prose quality. This is one question only.
```

## Prose medium review

Only when a medium profile is supplied (or the corpus profile declares a
`medium`), and after `repurpose-check` has run over the piece:

1. Paste the profile, the check output and the piece. Read the profile's
   `delivery_notes` as the description of the medium; bring no list of your own.
2. The check is authoritative on counts. Never re-count a length or a segment;
   a mechanical constraint the check failed is the writer's to fix, not a
   finding. Dispute the tool under "Check defects".
3. Report only what a count cannot see: a construction that breaks in this
   medium, a segment boundary that cuts a sentence, a semantic constraint the
   check lists as not-evaluated and the piece does not meet. Quote the span.
4. When you cannot tell, say nothing. Never state or imply that the piece was
   machine-written.
5. End with CLEAN or REVISE. CLEAN is the expected result on a piece that
   survives delivery.

Do not judge voice, structure, fidelity or prose quality. This is one question only.
```

## The one thing worth getting right, per critic

**Voice: rule 4.** A voice finding without evidence of how the author writes
instead is an opinion wearing a citation's clothes, and opinions about someone's
voice are the failure mode that costs the most.

**Fidelity: rule 3.** A model asked whether a number survived a rewrite will
answer from how plausible the sentence sounds, and it will be confident. The
deterministic scan is there to make that error impossible, and a critic allowed
to overrule it has given the property back.

**Structure: rule 2.** Order and support have no referent without an intended
outline. A critic that assesses them on its own authority teaches the writer
to write to a template, so the mode line is the whole safeguard: with an
outline, check against it; without one, stay quiet on those two classes.

Note that rules 7 in one block and 5 in the other point in **opposite
directions**. That is deliberate, and it is the part most likely to be
"corrected" by someone tidying the two blocks into one voice. Voice resolves to
silence; fidelity resolves to MATERIAL-LOSS. Do not harmonise them.

## What degrades

| Property | Claude Code | Elsewhere |
|---|---|---|
| Read-only | ✅ tool allowlist | ❌ a request |
| Clean context | ✅ | ❌ unless you run a fresh subprocess |
| Corpus-citation requirement (voice) | prompt | prompt — survives intact |
| The error preference, both directions | prompt | prompt — survives intact |
| Scan-is-authoritative (fidelity) | prompt + tool | prompt + tool — **survives**, if you run the scan |
| Scan-is-authoritative and the mode line (structure) | prompt + tool | prompt + tool — **survives**, if you run `outline-scan` and say the mode |
| Check-is-authoritative (medium) | prompt + tool | prompt + tool — **survives**, if you run `repurpose-check` and paste the profile |

The ones that survive are the ones that matter most, which is the only good news
in this table. The fidelity row is the best case in the bundle: its load-bearing
half is a script, and a script ports.
