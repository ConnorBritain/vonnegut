# Critic run — case-17

Your instructions are the file below, and they are the whole of your brief. If they
were not supplied to you as a system prompt, read it first:

    bundles/prose-review/tests/runs/2026-11-09-structure/prompts/agent-prompt.md

You have a draft, the output of `outline-scan` over it, and no intended outline.
Report on the draft's structure, following your instructions exactly, including the
mode line, the output contract and the closing one-line verdict.

Mode: draft-only.

## outline-scan output

```json
{
 "schema": "outline-scan/1",
 "file": "draft.md",
 "markdown": true,
 "words": 249,
 "status": "measured",
 "headings": [
  {
   "index": 0,
   "level": 1,
   "text": "Five things to do before you calibrate",
   "line": 1,
   "parent": null
  },
  {
   "index": 1,
   "level": 2,
   "text": "The list",
   "line": 5,
   "parent": 0
  },
  {
   "index": 2,
   "level": 2,
   "text": "After that",
   "line": 17,
   "parent": 0
  }
 ],
 "sections": [
  {
   "heading": 0,
   "title": "Five things to do before you calibrate",
   "level": 1,
   "paragraphs": [
    {
     "line": 3,
     "words": 37,
     "sentences": 3,
     "first_sentence": "Calibration is the step that turns the scanner from a guess into a measurement of your own writing.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 1,
      "connective": 1,
      "numeric": 0,
      "citation": 0,
      "total": 2,
      "per_100_words": 5.405
     },
     "transition_in": null
    }
   ],
   "words": 37,
   "paragraph_count": 1,
   "start_line": 1,
   "end_line": 3,
   "claim_markers": 2,
   "claim_markers_per_100_words": 5.405,
   "ratio_to_median": 1
  },
  {
   "heading": 1,
   "title": "The list",
   "level": 2,
   "paragraphs": [
    {
     "line": 7,
     "words": 30,
     "sentences": 3,
     "first_sentence": "Gather ten pieces you wrote unaided, in one register.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 0,
      "connective": 0,
      "numeric": 0,
      "citation": 1,
      "total": 1,
      "per_100_words": 3.333
     },
     "transition_in": {
      "marker": null,
      "kind": null,
      "lexical_overlap": 0,
      "linked": false,
      "same_section": false
     }
    },
    {
     "line": 9,
     "words": 39,
     "sentences": 2,
     "first_sentence": "Strip anything a tool wrote for you.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 0,
      "connective": 0,
      "numeric": 0,
      "citation": 1,
      "total": 1,
      "per_100_words": 2.564
     },
     "transition_in": {
      "marker": null,
      "kind": null,
      "lexical_overlap": 0.033,
      "linked": false,
      "same_section": true
     }
    },
    {
     "line": 11,
     "words": 31,
     "sentences": 2,
     "first_sentence": "Attach provenance to every file: where it came from, when you wrote it, and your own attestation that no model touched it.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 0,
      "connective": 0,
      "numeric": 0,
      "citation": 1,
      "total": 1,
      "per_100_words": 3.226
     },
     "transition_in": {
      "marker": null,
      "kind": null,
      "lexical_overlap": 0.067,
      "linked": false,
      "same_section": true
     }
    },
    {
     "line": 13,
     "words": 35,
     "sentences": 2,
     "first_sentence": "Keep registers apart.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 0,
      "connective": 0,
      "numeric": 0,
      "citation": 0,
      "total": 0,
      "per_100_words": 0
     },
     "transition_in": {
      "marker": null,
      "kind": null,
      "lexical_overlap": 0.029,
      "linked": false,
      "same_section": true
     }
    },
    {
     "line": 15,
     "words": 43,
     "sentences": 2,
     "first_sentence": "Commit the corpus on its own.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 1,
      "connective": 0,
      "numeric": 0,
      "citation": 0,
      "total": 1,
      "per_100_words": 2.326
     },
     "transition_in": {
      "marker": null,
      "kind": null,
      "lexical_overlap": 0.024,
      "linked": false,
      "same_section": true
     }
    }
   ],
   "words": 178,
   "paragraph_count": 5,
   "start_line": 5,
   "end_line": 15,
   "claim_markers": 4,
   "claim_markers_per_100_words": 2.247,
   "ratio_to_median": 4.811
  },
  {
   "heading": 2,
   "title": "After that",
   "level": 2,
   "paragraphs": [
    {
     "line": 19,
     "words": 23,
     "sentences": 1,
     "first_sentence": "Run the calibrator with the write flag, read the thin-corpus warning if it prints one, and lock what you like before it drifts.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 0,
      "connective": 0,
      "numeric": 0,
      "citation": 0,
      "total": 0,
      "per_100_words": 0
     },
     "transition_in": {
      "marker": null,
      "kind": null,
      "lexical_overlap": 0,
      "linked": false,
      "same_section": false
     }
    }
   ],
   "words": 23,
   "paragraph_count": 1,
   "start_line": 17,
   "end_line": 19,
   "claim_markers": 0,
   "claim_markers_per_100_words": 0,
   "ratio_to_median": 0.622
  }
 ],
 "balance": {
  "sections": 3,
  "median_words": 37,
  "max_ratio": 4.811,
  "min_ratio": 0.622
 },
 "transitions": {
  "boundaries": 6,
  "marked": 0,
  "unmarked": [
   {
    "line": 7,
    "section": "The list",
    "same_section": false
   },
   {
    "line": 9,
    "section": "The list",
    "same_section": true
   },
   {
    "line": 11,
    "section": "The list",
    "same_section": true
   },
   {
    "line": 13,
    "section": "The list",
    "same_section": true
   },
   {
    "line": 15,
    "section": "The list",
    "same_section": true
   },
   {
    "line": 19,
    "section": "After that",
    "same_section": false
   }
  ]
 },
 "limits": [
  "Topic-sentence candidates are positional (first sentence) and lexical (highest heading overlap); neither is a semantic judgement.",
  "Claim markers are counts of listed word classes, not a claim detector; the lists are in the tool and are the whole definition.",
  "A transition is a listed opening marker, a demonstrative, or content-word overlap ≥ 0.08 with the previous paragraph; absence of all three is reported, not judged.",
  "Sections are ATX headings; a document with other structure reads as one preamble section.",
  "Sentence boundaries are an English heuristic with a finite abbreviation list.",
  "A capitalised run is a surface pattern, not a named entity; sentence-initial function words are excluded by a stoplist, nothing else is.",
  "Defined terms are matched by three surface patterns ('X is', 'X, the', 'called X').",
  "Dates are recognised in numeric and month-name forms only.",
  "Markdown structure recognised: ATX headings, fenced and inline code, links, frontmatter, list and quote markers, tables, thematic breaks."
 ]
}
```

The scan is authoritative on counts. You are authoritative only on consequence.

## Integrity constraints — these are the point of the harness, not boilerplate

You may read exactly these files, and they are copies staged for this run:

    bundles/prose-review/tests/runs/2026-11-09-structure/inputs/case-17/draft.md

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
