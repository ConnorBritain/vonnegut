# Critic run — case-07

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
 "words": 269,
 "status": "measured",
 "headings": [
  {
   "index": 0,
   "level": 1,
   "text": "What a calibrated scanner actually measures",
   "line": 1,
   "parent": null
  },
  {
   "index": 1,
   "level": 2,
   "text": "Bands, not rules",
   "line": 5,
   "parent": 0
  },
  {
   "index": 2,
   "level": 2,
   "text": "What the bands cannot see",
   "line": 13,
   "parent": 0
  }
 ],
 "sections": [
  {
   "heading": 0,
   "title": "What a calibrated scanner actually measures",
   "level": 1,
   "paragraphs": [
    {
     "line": 3,
     "words": 50,
     "sentences": 3,
     "first_sentence": "A scanner with shipped thresholds measures the distance between your draft and somebody's guess about a generic register.",
     "heading_overlap_sentence": "A calibrated one measures the distance between your draft and your own good writing.",
     "heading_overlap": 0.286,
     "claim_markers": {
      "assertive": 0,
      "connective": 0,
      "numeric": 0,
      "citation": 0,
      "total": 0,
      "per_100_words": 0
     },
     "transition_in": null
    }
   ],
   "words": 50,
   "paragraph_count": 1,
   "start_line": 1,
   "end_line": 3,
   "claim_markers": 0,
   "claim_markers_per_100_words": 0,
   "ratio_to_median": 0.725
  },
  {
   "heading": 1,
   "title": "Bands, not rules",
   "level": 2,
   "paragraphs": [
    {
     "line": 7,
     "words": 54,
     "sentences": 3,
     "first_sentence": "Calibration reads every sample in the human corpus, measures each one, and writes percentile bands: where the middle of your sentence lengths sits, how wide your variance runs, how often you reach for a given construction.",
     "heading_overlap_sentence": "A draft is then compared to those bands.",
     "heading_overlap": 0.25,
     "claim_markers": {
      "assertive": 0,
      "connective": 0,
      "numeric": 0,
      "citation": 1,
      "total": 1,
      "per_100_words": 1.852
     },
     "transition_in": {
      "marker": null,
      "kind": null,
      "lexical_overlap": 0.068,
      "linked": false,
      "same_section": false
     }
    },
    {
     "line": 9,
     "words": 42,
     "sentences": 3,
     "first_sentence": "The em dash is the clearest example.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 1,
      "connective": 1,
      "numeric": 0,
      "citation": 0,
      "total": 2,
      "per_100_words": 4.762
     },
     "transition_in": {
      "marker": null,
      "kind": null,
      "lexical_overlap": 0.063,
      "linked": false,
      "same_section": true
     }
    },
    {
     "line": 11,
     "words": 40,
     "sentences": 3,
     "first_sentence": "My grandmother kept bees on a hillside outside Ljubljana, and every August she would sell the honey in jars that had once held pickles.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 1,
      "connective": 0,
      "numeric": 0,
      "citation": 1,
      "total": 2,
      "per_100_words": 5
     },
     "transition_in": {
      "marker": null,
      "kind": null,
      "lexical_overlap": 0.021,
      "linked": false,
      "same_section": true
     }
    }
   ],
   "words": 136,
   "paragraph_count": 3,
   "start_line": 5,
   "end_line": 11,
   "claim_markers": 5,
   "claim_markers_per_100_words": 3.676,
   "ratio_to_median": 1.971
  },
  {
   "heading": 2,
   "title": "What the bands cannot see",
   "level": 2,
   "paragraphs": [
    {
     "line": 15,
     "words": 40,
     "sentences": 3,
     "first_sentence": "Absence.",
     "heading_overlap_sentence": "A draft with no concrete detail, no defended position and a voice that never shifts scores nothing on any band, because the bands measure presence.",
     "heading_overlap": 0.059,
     "claim_markers": {
      "assertive": 1,
      "connective": 1,
      "numeric": 0,
      "citation": 0,
      "total": 2,
      "per_100_words": 5
     },
     "transition_in": {
      "marker": null,
      "kind": null,
      "lexical_overlap": 0.022,
      "linked": false,
      "same_section": false
     }
    },
    {
     "line": 17,
     "words": 29,
     "sentences": 2,
     "first_sentence": "So calibrate, and then read.",
     "heading_overlap_sentence": "The bands tell you where you have drifted from yourself; they cannot tell you whether the piece is worth reading, and no ruler will.",
     "heading_overlap": 0.167,
     "claim_markers": {
      "assertive": 1,
      "connective": 1,
      "numeric": 0,
      "citation": 0,
      "total": 2,
      "per_100_words": 6.897
     },
     "transition_in": {
      "marker": "so",
      "kind": "consequence",
      "lexical_overlap": 0.03,
      "linked": true,
      "same_section": true
     }
    }
   ],
   "words": 69,
   "paragraph_count": 2,
   "start_line": 13,
   "end_line": 17,
   "claim_markers": 4,
   "claim_markers_per_100_words": 5.797,
   "ratio_to_median": 1
  }
 ],
 "balance": {
  "sections": 3,
  "median_words": 69,
  "max_ratio": 1.971,
  "min_ratio": 0.725
 },
 "transitions": {
  "boundaries": 5,
  "marked": 1,
  "unmarked": [
   {
    "line": 7,
    "section": "Bands, not rules",
    "same_section": false
   },
   {
    "line": 9,
    "section": "Bands, not rules",
    "same_section": true
   },
   {
    "line": 11,
    "section": "Bands, not rules",
    "same_section": true
   },
   {
    "line": 15,
    "section": "What the bands cannot see",
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

    bundles/prose-review/tests/runs/2026-11-09-structure/inputs/case-07/draft.md

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
