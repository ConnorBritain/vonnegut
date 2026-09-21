# `medium-profile/1`

The shared contract between the `prose-repurpose` skill (`prose-author`), which
drafts to a profile, and `prose-medium-critic` (`prose-review`), which reviews
delivery against one. Two bundles read it and neither owns it, so it lives here.
The critic **receives** the profile as input from the session, the way every
critic receives scan JSON; it never reads a path inside another bundle's install.

Schema only, fixed in the roadmap step. Field details are finalised when item F
builds (see [`roadmap/F-prose-repurpose.md`](../roadmap/F-prose-repurpose.md));
anything added must keep the two words below distinct.

## Form versus medium

- **form** — what is being written: `newsletter`, `linkedin-post`, `thread`,
  `talk-abstract`. This is the value that scopes preferences on the existing
  `forms` axis of `voice-preferences/2`.
- **medium** — how it is delivered: `web`, `tts`, `print`. This is the vocabulary
  `PROFILES.md` already reserves for `profile.json → medium`, and it is the
  critic's spawn condition. One word, one meaning, in both bundles.

## Shape

```json
{
  "schema": "medium-profile/1",
  "form": "thread",
  "medium": "web",
  "length": { "unit": "words|characters", "min": 0, "max": 0 },
  "segments": { "max_count": 0, "max_characters": 0 },
  "structure": ["hook", "body", "close"],
  "constraints": [
    { "id": "no-links-in-first-segment", "kind": "mechanical", "rule": {} }
  ],
  "delivery_notes": "prose the critic reads: what breaks in this medium"
}
```

- `length` and `segments` are counted by `repurpose-check.mjs`; the critic never
  re-counts them.
- `constraints[].kind` is `mechanical` (checked by the script against final
  bytes) or `semantic` (reviewed by the critic, reported as such — never as
  enforced).
- `delivery_notes` is the only free text the critic weighs; it carries no
  prohibition list and no catalog.

## Degradation

- No profile supplied ⇒ the critic does not spawn; the session says so.
- A profile that fails validation ⇒ refused by name before any model call.
