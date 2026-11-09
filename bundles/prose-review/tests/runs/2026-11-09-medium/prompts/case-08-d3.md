# Critic run — case-08

Your instructions are the file below, and they are the whole of your brief. If they
were not supplied to you as a system prompt, read it first:

    bundles/prose-review/tests/runs/2026-11-09-medium/prompts/agent-prompt.md

You have a piece as it will be delivered (`piece.md`), the medium profile it was made for, and the output of `repurpose-check` over it.
Report on the piece's delivery, following your instructions exactly, including the
output contract and the closing one-line verdict.

Medium: web. Form: linkedin-post.

## medium profile (medium-profile/1)

```json
{
  "schema": "medium-profile/1",
  "form": "linkedin-post",
  "medium": "web",
  "length": { "unit": "characters", "min": 300, "max": 3000 },
  "segments": null,
  "structure": ["hook", "body", "close"],
  "constraints": [
    { "id": "platform-limit", "kind": "mechanical", "rule": { "type": "max_characters", "max": 3000 } },
    { "id": "no-headings", "kind": "mechanical", "rule": { "type": "no_headings" } },
    { "id": "hashtag-cap", "kind": "mechanical", "rule": { "type": "max_hashtags", "max": 3 } },
    { "id": "hook-above-the-fold", "kind": "semantic", "rule": { "text": "The first two lines stand alone: the platform truncates after them with a 'see more', and a reader decides there." }, "note": "whether the first two lines carry the piece's reason to exist" }
  ],
  "delivery_notes": "Rendered as plain text with line breaks; markdown does not render, so a heading marker is a literal hash. Truncated after roughly two lines until the reader expands it. Read in a feed between other posts, usually on a phone.",
  "checked": "2026-09-22"
}
```

## repurpose-check output

```json
{
 "schema": "repurpose-check/1",
 "form": "linkedin-post",
 "medium": "web",
 "profile_digest": "7d7ec5184c6b27796fe2b97f11bd0c5a879924bc7408756027083f8af9060dd2",
 "checked": "2026-09-22",
 "counts": {
  "words": 154,
  "characters": 807,
  "segments": 1,
  "longest_segment": 807
 },
 "mechanical": [
  {
   "id": "platform-limit",
   "kind": "mechanical",
   "status": "passed",
   "detail": "characters: 807 (limit 3000)"
  },
  {
   "id": "no-headings",
   "kind": "mechanical",
   "status": "passed",
   "detail": "no headings"
  },
  {
   "id": "hashtag-cap",
   "kind": "mechanical",
   "status": "passed",
   "detail": "hashtags: 0 (limit 3)"
  },
  {
   "id": "hook-above-the-fold",
   "kind": "semantic",
   "status": "not-evaluated",
   "detail": "reviewed by the medium critic: whether the first two lines carry the piece's reason to exist"
  }
 ],
 "fidelity": {
  "status": "not-evaluated",
  "reason": "no source piece supplied"
 },
 "summary": {
  "passed": 3,
  "failed": 0,
  "not_evaluated": 1
 },
 "limits": [
  "Mechanical constraints are counted on the final bytes; a semantic constraint is listed as not-evaluated and is the critic's, never reported as passed.",
  "Word and character counts are this tool's; platforms count differently at the margin, and the profile's `checked` date says when its limits were last confirmed.",
  "Missing atoms against the source are listed, not judged: compression drops things on purpose, and which drops matter is the writer's call."
 ]
}
```

The check is authoritative on counts. You are authoritative only on delivery.

## Integrity constraints — these are the point of the harness, not boilerplate

You may read exactly these files, and they are copies staged for this run:

    bundles/prose-review/tests/runs/2026-11-09-medium/inputs/case-08/piece.md
    bundles/prose-review/tests/runs/2026-11-09-medium/inputs/case-08/profile.json

You may not read, list, glob, grep or search anything else. In particular: no fixture
manifest, no other case's directory, no previous run under `runs/`, no test file, and
no corpus these copies were made from. Do not try to work out which case this is.

The expected result for this case exists in this repository. Reading it would void the
run — an earlier sweep was discarded because an expected verdict had leaked into a file
the critic reads. If you find a verdict, an expectation, a class label, a provenance
label or an `expect:` key inside the files above, STOP and report THAT instead of a
verdict. It is a harness defect and it is worth more than the run.

Line numbers you cite refer to the files exactly as given above.

Output your report and nothing else: no preamble, no summary of these instructions,
and no commentary after the verdict line.
