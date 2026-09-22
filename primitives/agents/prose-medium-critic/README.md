# prose-medium-critic

Read-only critic that answers one question: **does this piece survive the
medium it will be delivered in?** Read aloud by a synthetic voice, scrolled on
a phone in a feed, printed in a programme, split into segments. Judged against
a `medium-profile/1` the session supplies and the output of `repurpose-check`,
which has already counted everything countable. Output contract: findings with
a quoted span, then `CLEAN` / `REVISE`. Bundle: `prose-review`.

Not whether the prose is good. Not whether it sounds like the author
(`prose-voice-critic`). Not whether the structure carries the argument
(`prose-structure-critic`). Not whether the compression kept what mattered
(`repurpose-check` lists the missing atoms; the writer decides).

## Why this exists

A piece that is right on the page can be wrong in the ear or in the feed. A
homograph a reader resolves without noticing is a word a synthetic voice gets
wrong out loud; a paragraph that is fine on a desktop is a wall on a phone;
the first two lines of a post are the whole post to most readers; a thread
segment that ends mid-sentence is quoted alone as nonsense. None of that is a
property of the prose, and no other critic reads for it.

## Why a separate agent

**Because the check can only count.** `repurpose-check.mjs` evaluates every
mechanical constraint on the final bytes - lengths, segment sizes, a URL in
the first segment, a heading where the platform renders a literal hash - and
lists the semantic constraints as `not-evaluated` with a note saying what the
critic reviews. Whether a segment boundary cuts a sentence, whether an
opening earns the scroll, whether *read* will be read as *red*: those are
judgements, and they are made in a clean context by a critic that did not
draft the piece.

**It receives the profile; it never reads one.** The profiles ship with
`prose-author`'s repurpose skill. The critic lives in `prose-review` and never
reads a path inside another bundle's install: the session pastes the profile,
the check output and the piece, the way every critic here receives scan JSON.
`docs/contracts/medium-profile.md` is the contract both bundles read and
neither owns. This answers `DESIGN.md`'s open question 5: the critic is a
bundle member, because nobody wants it without the other critics.

## What it does

| # | Looks for | The rule |
|---|---|---|
| 1 | A construction that breaks in this medium | TTS homographs and unspoken symbols; a wall or a truncated hook on the web; a link-only reference in print. Judged from `delivery_notes`, which carry no prohibition list. |
| 2 | A segment boundary that cuts a sentence | The check counts segments; it cannot see where a sentence ends. |
| 3 | A semantic constraint the profile requires and the piece lacks | Exactly the constraints the check lists as `not-evaluated`, no others. |

A `failed` mechanical constraint is the writer's to fix and not a finding here.

## The error preference

Uncertainty resolves to **silence**, for the voice critic's reason: no ground
truth. Nobody can check "a listener would mishear this", so a wrong finding
is never caught and teaches an author to flatten prose for a delivery problem
that was not there. The critic ships on the negative test - quiet on
compliant human posts - and its positive fixtures are synthetic.

## When to run it

Only when a medium profile is supplied, or the corpus `profile.json` declares
a `medium` (`prose-review/PROTOCOL.md` step 2). Never by default. After
`repurpose-check` has run, in a clean context, with the profile, the check
output and the piece.

## Reading the output

`REVISE` says the medium does something to this piece that the writer should
see, quoted. `CLEAN` says it survives delivery. Neither says anything about
the writing.

## Known limits

**No ground truth**, as above. **Delivery is a moving target**: platform
limits and TTS behaviour change, and the profile's `checked` date says when
its limits were last confirmed. **It inherits the check's counting**: if the
check miscounts, the critic reports it under *Check defects* and cannot fix
it. **Its verdicts are model judgements and single draws are observations,
not rates.**

## Install

```bash
./install.sh prose-medium-critic      # → ~/.claude/agents/
```

Or install the whole bundle: `/plugin install prose-review@vonnegut`. The
profiles it reads for ship with `prose-author`'s `prose-repurpose` skill.
