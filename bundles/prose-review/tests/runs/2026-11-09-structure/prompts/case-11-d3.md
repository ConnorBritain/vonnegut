# Critic run — case-11

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
 "words": 242,
 "status": "measured",
 "headings": [
  {
   "index": 0,
   "level": 1,
   "text": "Chapter Three",
   "line": 1,
   "parent": null
  }
 ],
 "sections": [
  {
   "heading": 0,
   "title": "Chapter Three",
   "level": 1,
   "paragraphs": [
    {
     "line": 3,
     "words": 55,
     "sentences": 4,
     "first_sentence": "The rain had stopped by the time Mara reached the bridge, but the river had not noticed.",
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
     "transition_in": null
    },
    {
     "line": 5,
     "words": 53,
     "sentences": 4,
     "first_sentence": "The mill was where she had left it, which was the first surprise of the day.",
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
      "lexical_overlap": 0.095,
      "linked": true,
      "same_section": true
     }
    },
    {
     "line": 9,
     "words": 44,
     "sentences": 4,
     "first_sentence": "Teodor had never been late in the eleven years she had known him.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 2,
      "connective": 1,
      "numeric": 0,
      "citation": 0,
      "total": 3,
      "per_100_words": 6.818
     },
     "transition_in": {
      "marker": null,
      "kind": null,
      "lexical_overlap": 0.152,
      "linked": true,
      "same_section": true
     }
    },
    {
     "line": 11,
     "words": 44,
     "sentences": 4,
     "first_sentence": "She read the ledger line again.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 0,
      "connective": 1,
      "numeric": 1,
      "citation": 1,
      "total": 3,
      "per_100_words": 6.818
     },
     "transition_in": {
      "marker": null,
      "kind": null,
      "lexical_overlap": 0.028,
      "linked": false,
      "same_section": true
     }
    },
    {
     "line": 15,
     "words": 44,
     "sentences": 3,
     "first_sentence": "By dusk she had decided.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 0,
      "connective": 2,
      "numeric": 0,
      "citation": 0,
      "total": 2,
      "per_100_words": 4.545
     },
     "transition_in": {
      "marker": null,
      "kind": null,
      "lexical_overlap": 0.121,
      "linked": true,
      "same_section": true
     }
    }
   ],
   "words": 240,
   "paragraph_count": 5,
   "start_line": 1,
   "end_line": 15,
   "claim_markers": 8,
   "claim_markers_per_100_words": 3.333,
   "ratio_to_median": 1
  }
 ],
 "balance": {
  "sections": 1,
  "median_words": 240,
  "max_ratio": 1,
  "min_ratio": 1
 },
 "transitions": {
  "boundaries": 4,
  "marked": 3,
  "unmarked": [
   {
    "line": 11,
    "section": "Chapter Three",
    "same_section": true
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

    bundles/prose-review/tests/runs/2026-11-09-structure/inputs/case-11/draft.md

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
