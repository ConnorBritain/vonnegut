# Critic run — case-01

Your instructions are the file below, and they are the whole of your brief. If they
were not supplied to you as a system prompt, read it first:

    bundles/prose-bible/tests/runs/2026-11-09-continuity/prompts/agent-prompt.md

You have the output of `index-diff` over a multi-file project and the project's bible.
Report on the project's continuity, following your instructions exactly, including
the output contract and the closing one-line verdict.

## index-diff output

```json
{
 "schema": "index-diff/1",
 "redefined": [],
 "attribute_drift": [
  {
   "key": "dorota",
   "surface_forms": [
    "Dorota"
   ],
   "attribute": "eyes",
   "a": {
    "bible": "b1",
    "name": "Dorota",
    "value": "grey",
    "first_seen": {
     "file": "chapter-05.md",
     "line": 3
    },
    "notes": "Grey. Her mother's eyes; it is the point of chapter twelve."
   },
   "b": {
    "file": "chapter-05.md",
    "line": 3,
    "offset": 16,
    "sentence": "Dorota had green eyes and a soldier's way of standing.",
    "attribute": "eyes",
    "value": "green",
    "shape": "had"
   },
   "source": "bible"
  }
 ],
 "repeated": [],
 "bible_conflicts": [],
 "limits": [
  "Two definitions are 'different' when their content-word overlap is below 0.5; a paraphrase can pass as the same and a different emphasis as different.",
  "Attribute values are compared after lower-casing and stripping punctuation; 'grey' and 'gray' are different values.",
  "Every entry is a candidate; a flashback, a nickname or a lie looks the same as drift here."
 ],
 "date_drift": [],
 "summary": "0 redefined, 1 attribute drift, 0 date drift, 0 repeated, 0 bible conflicts"
}
```

## bible (voice-bible/1)

```json
{
 "schema": "voice-bible/1",
 "id": "valley",
 "revision": 1,
 "parent_digest": null,
 "entries": [
  {
   "id": "b1",
   "kind": "character",
   "name": "Dorota",
   "key": "dorota",
   "attributes": {
    "eyes": "grey",
    "bearing": "a soldier's way of standing"
   },
   "definition": null,
   "first_seen": {
    "file": "chapter-05.md",
    "line": 3
   },
   "notes": "Grey. Her mother's eyes; it is the point of chapter twelve."
  }
 ]
}
```

The index is authoritative on locations. You are authoritative only on whether two of them can both hold.

## Integrity constraints — these are the point of the harness, not boilerplate

You may read exactly these files, and they are copies staged for this run:

    bundles/prose-bible/tests/runs/2026-11-09-continuity/inputs/case-01/diff.json
    bundles/prose-bible/tests/runs/2026-11-09-continuity/inputs/case-01/bible.json

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
