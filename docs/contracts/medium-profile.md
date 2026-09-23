# `medium-profile/1`

The shared contract between the `prose-repurpose` skill (`prose-author`), which
drafts to a profile, and `prose-medium-critic` (`prose-review`), which reviews
delivery against one. Two bundles read it and neither owns it, so it lives here.
The critic **receives** the profile as input from the session, the way every
critic receives scan JSON; it never reads a path inside another bundle's install.

Finalised with item F ([`roadmap/F-prose-repurpose.md`](../roadmap/F-prose-repurpose.md)).
The validator is `bundles/prose-author/skills/prose-repurpose/tools/lib/medium-profile.mjs`;
this page is the contract it enforces, and the two must not disagree. Unknown
fields anywhere are refused by name.

## Form versus medium

- **form** — what is being written: `newsletter`, `linkedin-post`, `thread`,
  `talk-abstract`. This is the value that scopes preferences on the existing
  `forms` axis of `voice-preferences/2`. A lower-case token, at most 64 characters.
- **medium** — how it is delivered: `web`, `tts`, `print`. This is the vocabulary
  `PROFILES.md` already reserves for `profile.json → medium`, and it is the
  critic's spawn condition. One word, one meaning, in both bundles.

## Shape

```json
{
  "schema": "medium-profile/1",
  "form": "thread",
  "medium": "web",
  "length": { "unit": "characters", "min": 200, "max": 5600 },
  "segments": { "max_count": 20, "max_characters": 280, "separator": "\n---\n" },
  "structure": ["hook", "body", "close"],
  "constraints": [
    { "id": "segment-limit", "kind": "mechanical", "rule": { "type": "max_segment_characters", "max": 280 } },
    { "id": "segments-are-sentences", "kind": "semantic",
      "rule": { "text": "Every segment boundary falls at a sentence boundary." },
      "note": "a segment that ends mid-sentence, which the count cannot see" }
  ],
  "delivery_notes": "prose the critic reads: what breaks in this medium",
  "checked": "2026-09-22"
}
```

| Field | Required | Meaning |
|---|---|---|
| `schema` | yes | exactly `medium-profile/1` |
| `form`, `medium` | yes | as above |
| `length` | yes | `{ unit: words \| characters, min, max }`, non-negative integers, `min ≤ max`; counted by the script |
| `segments` | no | `{ max_count, max_characters, separator }`; present only for segmented forms; the separator is the literal string between segments in the delivered text |
| `structure` | yes | non-empty ordered list of lower-case part names; a fact for the drafting job, never re-counted |
| `constraints` | yes | array, may be empty; ids unique lower-case tokens |
| `delivery_notes` | yes | the only free text the critic weighs |
| `checked` | yes | ISO date the platform limits were last confirmed; profiles carry their own staleness |

### Constraints

`constraints[].kind` is one of two words, and the word decides who evaluates it:

- **`mechanical`** — checked by `repurpose-check.mjs` on the final bytes, never by
  the critic. `rule.type` is one of the types below, with exactly the parameters
  listed (positive integers; `segment` is 1-based):

  | `rule.type` | parameters |
  |---|---|
  | `max_words`, `max_characters`, `max_segments`, `max_segment_characters`, `max_hashtags` | `max` |
  | `min_words` | `min` |
  | `no_urls_in_segment` | `segment` |
  | `no_headings`, `single_paragraph`, `ends_with_question` | none |

  A type outside this table is refused, not skipped: a constraint nobody can
  count would otherwise read as enforced.
- **`semantic`** — reviewed by the critic and reported as reviewed, never as
  enforced. `rule` is `{ text }` or omitted; `note` is required and says what the
  critic looks for. Every semantic constraint is a judgement the count cannot make.

`delivery_notes` carries no prohibition list and no catalog; a note of the form
"never say / avoid the word …" is refused by the validator, because that is a
catalog by another name and critics do not receive catalogs.

## Digest

The skill records the profile's sha256 (over the file bytes) in the job and the
receipt, so a delivery can be re-checked against the profile it was written to
even after the profile changes.

## Degradation

- No profile supplied ⇒ the critic does not spawn; the session says so.
- A profile that fails validation ⇒ refused by name before any model call.
- `checked` is reported, not judged: `repurpose-check.mjs` echoes it beside its
  counts and states in its `limits` block that platforms count differently at the
  margin. A platform limit is the platform's to move; the date is how a writer notices.
