# Outline handoff

The contract between `prose-outline`, which writes `voice-outline/1` and
`project-brief/1`, and `prose-author`, which drafts from them. Two bundles read
these schemas, prose-outline owns them, and neither may import the other's
code, so the subset prose-author reads is written down here.

- **Implementation on the reading side:**
  `bundles/prose-author/skills/prose-draft/tools/lib/outline-handoff.mjs`. It is
  a port of the read side only.
- **Pin:** a parity test runs it against prose-outline's own validators over
  prose-outline's fixtures.

## What prose-author reads

From the **outline** (`outline-store show`, the `outline` object):

| Field | Used for |
|---|---|
| `mode`, `title`, `thesis` | `thesis` (or the premise) is the brief's spine. A `null` thesis stops the job, because the outline has not settled what the piece argues. |
| `nodes[]` in reading order | Each claim, beat, act or turn becomes an ordered fact. `part` and `words` go into the fact text. |
| `nodes[].evidence[].filled_by` | A filled slot becomes a fact. An empty slot becomes nothing, never a guess. |
| `nodes[]` of kind `open-question` | Stops the job unless the writer carries them forward explicitly. |
| `length` | Becomes a `word-limit` rule (`minimum`, `maximum`). |
| `shape`, `brief_ref`, `id`, `revision` | Recorded, not interpreted. |

From the **brief** (`brief-store show`, the `brief` object; optional):

| Field | Used for |
|---|---|
| `decisions.audience`, `purpose`, `form` | `context.audience`, `context.purpose` and `context.form`, used only when confirmed and not stale. |
| `decisions.must_include`, `exclude` | One semantic rule each. These are reviewable and never presented as enforced. |
| `chosen_angle` + `angles[].title` | Prefix of the job's `brief` text. |
| every other required decision | Must be settled: present, confirmed, not skipped, not stale. Staleness is computed from `at_revision` and the interview's dependency table. |

Anything else in either document is ignored. A field this contract does not
list carries no meaning on the drafting side.

## Refusals

`outline-job.mjs` refuses, naming each item, when:
- the outline has open questions or a null thesis;
- the brief leaves a required decision open, skipped, unconfirmed or stale;
- either document fails validation.

`--allow-open` carries open questions forward instead. Each one becomes a
semantic rule, "leave this unresolved; do not assert an answer", so the gap is
explicit in the job and reviewable in the draft.

## What the reading side does not check

It does not re-verify a brief's transcript quotes. That needs the cached
transcript and is `brief-check`'s job, so run brief-check before handing off.
It writes nothing to either store.
