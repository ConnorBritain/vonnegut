# prose-author v0.9.0 release notes

v0.9.0 adds repurposing: one finished piece becomes a newsletter issue, a
LinkedIn post, a thread or a talk abstract in the writer's voice, each drafted
through the existing runtime under its own medium profile and preference scope,
checked mechanically on the final bytes, and handed to the medium critic.
Roadmap item F ([`docs/roadmap/F-prose-repurpose.md`](../../docs/roadmap/F-prose-repurpose.md)).

## Added

- `prose-repurpose` skill (`kind: author` via the runtime): pick forms, load
  profiles, one `rewrite` run per form with the source piece as the passage,
  `context.form` scoping preferences on the existing `forms` axis, the
  profile's structure and mechanical constraints as facts and its digest in
  the receipt; `repurpose-check`; the medium critic when `prose-review` is
  installed, `ungated` for medium review and said so when not. It never
  invents a fact the source lacks, never posts anywhere, never optimises for a
  metric.
- Four `medium-profile/1` profiles under `media/` — `newsletter` (web),
  `linkedin-post` (web), `thread` (web, 280-character segments), `talk-abstract`
  (print) — each with a `checked` date. *Form* is what is written and scopes
  preferences; *medium* is how it is delivered and is the critic's spawn
  condition. The contract lives at `docs/contracts/medium-profile.md`, owned by
  neither bundle.
- `tools/lib/medium-profile.mjs`: validation on load with unknown fields,
  unknown rule types and unknown rule parameters refused by name; delivery
  notes that carry a prohibition list refused ("a catalog by another name");
  a sha256 digest; `profileFacts` for the drafting job.
- `tools/repurpose-check.mjs`: ten mechanical rule types counted on the final
  bytes; every semantic constraint listed as `not-evaluated` with the critic's
  note, never as passed; `fidelity-scan` against the source located at run time
  the way the drafting runtime locates it (never imported across the bundle
  boundary), its missing atoms listed for the writer and never failed, and
  `not-evaluated` when prose-review is absent or no source is given.

## Compatibility

The runtime, the drafting, tuning and corpus skills and every store are
untouched. Preferences saved while repurposing use the existing store under the
`forms` scope; no new store, no new axis (a sixth axis would break
`voice-preferences/2` for installed runtimes).

## Evidence and limits

- `node bundles/prose-author/tests/selftest.mjs repurpose`: 46 checks, zero
  failed — the four profiles validate and no form is a medium word; eight
  refusals; an over-length first segment with a link fails two constraints by
  name with the numbers, a compliant thread passes, a newsletter under its
  floor fails with its word count while its hook stays the critic's; missing
  atoms listed and never failed; every rule type evaluates to passed or failed;
  CLI exit codes.
- Four mutations (constraints short-circuited to passed; the fidelity listing
  dropped; unknown profile fields accepted; a prohibition list accepted), every
  one caught; the sweep's table is in `tests/MUTATIONS.md`.
- **No runtime run per form was dispatched** — the environment had no CLI, so
  no `delivery.md` exists yet; the skill's negative test (a source with nothing
  an abstract could state yields a refusal, not invention) is a prompt rule
  recorded as not run, never as passed. Platform limits change; the profiles'
  `checked` dates say when they were last confirmed.
