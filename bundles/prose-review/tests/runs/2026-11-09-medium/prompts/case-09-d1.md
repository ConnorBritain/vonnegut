# Critic run — case-09

Your instructions are the file below, and they are the whole of your brief. If they
were not supplied to you as a system prompt, read it first:

    bundles/prose-review/tests/runs/2026-11-09-medium/prompts/agent-prompt.md

You have a piece as it will be delivered (`piece.md`), the medium profile it was made for, and the output of `repurpose-check` over it.
Report on the piece's delivery, following your instructions exactly, including the
output contract and the closing one-line verdict.

Medium: web. Form: thread.

## medium profile (medium-profile/1)

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
    { "id": "segment-count", "kind": "mechanical", "rule": { "type": "max_segments", "max": 20 } },
    { "id": "no-links-in-first-segment", "kind": "mechanical", "rule": { "type": "no_urls_in_segment", "segment": 1 } },
    { "id": "no-headings", "kind": "mechanical", "rule": { "type": "no_headings" } },
    { "id": "segments-are-sentences", "kind": "semantic", "rule": { "text": "Every segment boundary falls at a sentence boundary; no sentence is cut by the separator." }, "note": "a segment that ends mid-sentence, which the count cannot see" },
    { "id": "each-segment-stands", "kind": "semantic", "rule": { "text": "Each segment reads on its own when quoted out of the thread." }, "note": "a segment that is only a fragment of the previous one" }
  ],
  "delivery_notes": "Posted as numbered segments, each shown alone in a feed and quoted alone. The first segment is the whole piece to most readers. A link in the first segment is what the platform down-ranks and what readers skip.",
  "checked": "2026-09-22"
}
```

## repurpose-check output

```json
{
 "schema": "repurpose-check/1",
 "form": "thread",
 "medium": "web",
 "profile_digest": "6ab0547f0cf6619f5bdcee46ba1679ff3abeba74e614bea2bc6a5e4ab0c288eb",
 "checked": "2026-09-22",
 "counts": {
  "words": 94,
  "characters": 506,
  "segments": 4,
  "longest_segment": 297
 },
 "mechanical": [
  {
   "id": "segment-limit",
   "kind": "mechanical",
   "status": "failed",
   "detail": "segments over 280 characters: #1 (297)"
  },
  {
   "id": "segment-count",
   "kind": "mechanical",
   "status": "passed",
   "detail": "segments: 4 (limit 20)"
  },
  {
   "id": "no-links-in-first-segment",
   "kind": "mechanical",
   "status": "passed",
   "detail": "segment 1 has no URL"
  },
  {
   "id": "no-headings",
   "kind": "mechanical",
   "status": "passed",
   "detail": "no headings"
  },
  {
   "id": "segments-are-sentences",
   "kind": "semantic",
   "status": "not-evaluated",
   "detail": "reviewed by the medium critic: a segment that ends mid-sentence, which the count cannot see"
  },
  {
   "id": "each-segment-stands",
   "kind": "semantic",
   "status": "not-evaluated",
   "detail": "reviewed by the medium critic: a segment that is only a fragment of the previous one"
  }
 ],
 "fidelity": {
  "status": "not-evaluated",
  "reason": "no source piece supplied"
 },
 "summary": {
  "passed": 3,
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

    bundles/prose-review/tests/runs/2026-11-09-medium/inputs/case-09/piece.md
    bundles/prose-review/tests/runs/2026-11-09-medium/inputs/case-09/profile.json

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
