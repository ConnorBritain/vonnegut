# Critic run — case-07

Your instructions are the file below, and they are the whole of your brief. If they
were not supplied to you as a system prompt, read it first:

    bundles/prose-bible/tests/runs/2026-11-09-continuity/prompts/agent-prompt.md

You have the output of `index-diff` over a multi-file project. No bible exists for this project.
Report on the project's continuity, following your instructions exactly, including
the output contract and the closing one-line verdict.

## index-diff output

```json
{
 "schema": "index-diff/1",
 "redefined": [],
 "attribute_drift": [],
 "repeated": [
  {
   "kind": "near",
   "similarity": 0.6,
   "locations": [
    {
     "file": "essay-01.md",
     "line": 3,
     "offset": 23,
     "text": "The Cadence Rule is the one habit that made the scanner useful: never calibrate on fewer than ten pieces.",
     "before": null,
     "after": "I learned it in 2021, the year I first pointed the tool at my own newsletter and watched it flag every sentence."
    },
    {
     "file": "notes.md",
     "line": 3,
     "offset": 9,
     "text": "The Cadence Rule: never calibrate on fewer than ten pieces.",
     "before": null,
     "after": "First stated in the 2021 newsletter post; restate it in every essay that mentions calibration."
    }
   ]
  }
 ],
 "bible_conflicts": [],
 "limits": [
  "Two definitions are 'different' when their content-word overlap is below 0.5; a paraphrase can pass as the same and a different emphasis as different.",
  "Attribute values are compared after lower-casing and stripping punctuation; 'grey' and 'gray' are different values.",
  "Every entry is a candidate; a flashback, a nickname or a lie looks the same as drift here."
 ],
 "date_drift": [],
 "summary": "0 redefined, 0 attribute drift, 0 date drift, 1 repeated, 0 bible conflicts"
}
```

The index is authoritative on locations. You are authoritative only on whether two of them can both hold.

## Integrity constraints — these are the point of the harness, not boilerplate

You may read exactly these files, and they are copies staged for this run:

    bundles/prose-bible/tests/runs/2026-11-09-continuity/inputs/case-07/diff.json

You may not read, list, glob, grep or search anything else. In particular: no project
files, no fixture manifest, no other case's directory, no previous run under `runs/`,
and no test file. Do not try to work out which case this is.

The expected result for this case exists in this repository. Reading it would void the
run. If you find a verdict, an expectation or a class label inside the files above,
STOP and report THAT instead of a verdict. It is a harness defect and it is worth more
than the run.

Locations you cite are the file and line fields of the candidates exactly as given above.

Output your report and nothing else: no preamble, no summary of these instructions,
and no commentary after the verdict line.
