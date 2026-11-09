# Critic run — case-02

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
 "redefined": [
  {
   "key": "harrow road",
   "surface_forms": [
    "Harrow road"
   ],
   "similarity": 0,
   "a": {
    "file": "chapter-01.md",
    "line": 3,
    "offset": 81,
    "sentence": "The mill on the Harrow road was the first building she had ever loved, and the Harrow road is the old road to the coast, closed since the flood of 1898.",
    "pattern": "is-a",
    "definition": "first building she had ever loved"
   },
   "b": {
    "file": "chapter-01.md",
    "line": 3,
    "offset": 144,
    "sentence": "The mill on the Harrow road was the first building she had ever loved, and the Harrow road is the old road to the coast, closed since the flood of 1898.",
    "pattern": "is-a",
    "definition": "old road to the coast"
   }
  },
  {
   "key": "harrow road",
   "surface_forms": [
    "Harrow road"
   ],
   "similarity": 0,
   "a": {
    "file": "chapter-01.md",
    "line": 3,
    "offset": 81,
    "sentence": "The mill on the Harrow road was the first building she had ever loved, and the Harrow road is the old road to the coast, closed since the flood of 1898.",
    "pattern": "is-a",
    "definition": "first building she had ever loved"
   },
   "b": {
    "file": "notes.md",
    "line": 5,
    "offset": 115,
    "sentence": "Grey eyes (do not change this; it matters in chapter nine).",
    "pattern": "is-a",
    "definition": "road to the quarry"
   }
  },
  {
   "key": "harrow road",
   "surface_forms": [
    "Harrow road"
   ],
   "similarity": 0.333,
   "a": {
    "file": "chapter-01.md",
    "line": 3,
    "offset": 144,
    "sentence": "The mill on the Harrow road was the first building she had ever loved, and the Harrow road is the old road to the coast, closed since the flood of 1898.",
    "pattern": "is-a",
    "definition": "old road to the coast"
   },
   "b": {
    "file": "notes.md",
    "line": 5,
    "offset": 115,
    "sentence": "Grey eyes (do not change this; it matters in chapter nine).",
    "pattern": "is-a",
    "definition": "road to the quarry"
   }
  }
 ],
 "attribute_drift": [
  {
   "key": "mara",
   "surface_forms": [
    "Mara"
   ],
   "attribute": "eyes",
   "a": {
    "file": "chapter-01.md",
    "line": 3,
    "offset": 15,
    "sentence": "Mara had grey eyes and a habit of counting doors.",
    "attribute": "eyes",
    "value": "grey",
    "shape": "had"
   },
   "b": {
    "file": "chapter-02.md",
    "line": 3,
    "offset": 66,
    "sentence": "Mara had green eyes, and she crossed at the ford counting the doors of the village as she always did.",
    "attribute": "eyes",
    "value": "green",
    "shape": "had"
   },
   "source": "text"
  }
 ],
 "repeated": [
  {
   "kind": "near",
   "similarity": 0.684,
   "locations": [
    {
     "file": "chapter-01.md",
     "line": 7,
     "offset": 365,
     "text": "She told him the story about the bees: how her grandmother had sold honey in pickle jars, the labels in her own hand, and had never written anything else down.",
     "before": "He called the ledger the Book of Hours, though it recorded flour, and he had kept it for eleven years.",
     "after": null
    },
    {
     "file": "chapter-02.md",
     "line": 7,
     "offset": 394,
     "text": "She thought of her grandmother's honey, sold in pickle jars with labels in her own hand; the old woman had never written anything else down.",
     "before": "He had kept that ledger for eleven years.",
     "after": null
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
 "date_drift": [
  {
   "context": "flood",
   "a": {
    "text": "1898",
    "kind": "date",
    "offset": 212,
    "line": 3,
    "file": "chapter-01.md",
    "sentence": "The mill on the Harrow road was the first building she had ever loved, and the Harrow road is the old road to the coast, closed since the flood of 1898.",
    "context": "flood"
   },
   "b": {
    "text": "1889",
    "kind": "date",
    "offset": 205,
    "line": 5,
    "file": "chapter-02.md",
    "sentence": "Mara had green eyes, and she crossed at the ford counting the doors of the village as she always did.",
    "context": "flood"
   }
  }
 ],
 "summary": "3 redefined, 1 attribute drift, 1 date drift, 1 repeated, 0 bible conflicts"
}
```

The index is authoritative on locations. You are authoritative only on whether two of them can both hold.

## Integrity constraints — these are the point of the harness, not boilerplate

You may read exactly these files, and they are copies staged for this run:

    bundles/prose-bible/tests/runs/2026-11-09-continuity/inputs/case-02/diff.json

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
