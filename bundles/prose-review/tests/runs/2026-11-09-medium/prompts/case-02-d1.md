# Critic run — case-02

Your instructions are the file below, and they are the whole of your brief. If they
were not supplied to you as a system prompt, read it first:

    bundles/prose-review/tests/runs/2026-11-09-medium/prompts/agent-prompt.md

You have a piece as it will be delivered (`piece.md`), the medium profile it was made for, and the output of `repurpose-check` over it.
Report on the piece's delivery, following your instructions exactly, including the
output contract and the closing one-line verdict.

Medium: web. Form: newsletter.

## medium profile (medium-profile/1)

```json
{
  "schema": "medium-profile/1",
  "form": "newsletter",
  "medium": "web",
  "length": { "unit": "words", "min": 400, "max": 1200 },
  "segments": null,
  "structure": ["hook", "body", "close"],
  "constraints": [
    { "id": "length-band", "kind": "mechanical", "rule": { "type": "max_words", "max": 1200 } },
    { "id": "enough-to-read", "kind": "mechanical", "rule": { "type": "min_words", "min": 400 } },
    { "id": "hook-present", "kind": "semantic", "rule": { "text": "The first paragraph gives a reader who opened this in an inbox a reason to keep reading before any context is supplied." }, "note": "whether the opening earns the scroll; a heading is not a hook" },
    { "id": "one-close", "kind": "semantic", "rule": { "text": "The piece ends once, with a close the reader can act on or sit with, not a second summary." }, "note": "double endings and trailing summaries" }
  ],
  "delivery_notes": "Read in an email client, on a phone as often as not, in one sitting or abandoned. Paragraphs longer than a phone screen lose readers who would have finished on a desktop. Links are fine in the body; a link is not a hook. The subject line is not part of the piece and is not reviewed here.",
  "checked": "2026-09-22"
}
```

## repurpose-check output

```json
{
 "schema": "repurpose-check/1",
 "form": "newsletter",
 "medium": "web",
 "profile_digest": "aa2609ea54d9637b5076966b1986c7b3a8caaa0f4e1f7339c57e5040b113366a",
 "checked": "2026-09-22",
 "counts": {
  "words": 2275,
  "characters": 15830,
  "segments": 1,
  "longest_segment": 15830
 },
 "mechanical": [
  {
   "id": "length-band",
   "kind": "mechanical",
   "status": "failed",
   "detail": "words: 2275 (limit 1200)"
  },
  {
   "id": "enough-to-read",
   "kind": "mechanical",
   "status": "passed",
   "detail": "words: 2275 (limit 400)"
  },
  {
   "id": "hook-present",
   "kind": "semantic",
   "status": "not-evaluated",
   "detail": "reviewed by the medium critic: whether the opening earns the scroll; a heading is not a hook"
  },
  {
   "id": "one-close",
   "kind": "semantic",
   "status": "not-evaluated",
   "detail": "reviewed by the medium critic: double endings and trailing summaries"
  }
 ],
 "fidelity": {
  "status": "not-evaluated",
  "reason": "no source piece supplied"
 },
 "summary": {
  "passed": 1,
  "failed": 1,
  "not_evaluated": 2
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

    bundles/prose-review/tests/runs/2026-11-09-medium/inputs/case-02/piece.md
    bundles/prose-review/tests/runs/2026-11-09-medium/inputs/case-02/profile.json

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
