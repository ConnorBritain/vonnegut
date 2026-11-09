# Critic run — case-10

Your instructions are the file below, and they are the whole of your brief. If they
were not supplied to you as a system prompt, read it first:

    bundles/prose-review/tests/runs/2026-11-09-structure/prompts/agent-prompt.md

You have a draft, the output of `outline-scan` over it, and the outline the writer intended.
Report on the draft's structure, following your instructions exactly, including the
mode line, the output contract and the closing one-line verdict.

Mode: intended-outline.

## outline-scan output

```json
{
 "schema": "outline-scan/1",
 "file": "draft.md",
 "markdown": true,
 "words": 336,
 "status": "measured",
 "headings": [
  {
   "index": 0,
   "level": 1,
   "text": "Why the roadmap must be a file",
   "line": 1,
   "parent": null
  },
  {
   "index": 1,
   "level": 2,
   "text": "Where the plan lives",
   "line": 5,
   "parent": 0
  },
  {
   "index": 2,
   "level": 2,
   "text": "The check",
   "line": 11,
   "parent": 0
  },
  {
   "index": 3,
   "level": 2,
   "text": "The objection",
   "line": 15,
   "parent": 0
  }
 ],
 "sections": [
  {
   "heading": 0,
   "title": "Why the roadmap must be a file",
   "level": 1,
   "paragraphs": [
    {
     "line": 3,
     "words": 56,
     "sentences": 4,
     "first_sentence": "Every team I have watched lose a quarter lost it the same way.",
     "heading_overlap_sentence": "This essay argues that a plan which is not a file under version control, checked by the build, is not a plan.",
     "heading_overlap": 0.091,
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
   "words": 56,
   "paragraph_count": 1,
   "start_line": 1,
   "end_line": 3,
   "claim_markers": 0,
   "claim_markers_per_100_words": 0,
   "ratio_to_median": 0.629
  },
  {
   "heading": 1,
   "title": "Where the plan lives",
   "level": 2,
   "paragraphs": [
    {
     "line": 7,
     "words": 64,
     "sentences": 4,
     "first_sentence": "A plan written in a document nobody opens is a plan nobody follows.",
     "heading_overlap_sentence": "A plan written in a document nobody opens is a plan nobody follows.",
     "heading_overlap": 0.143,
     "claim_markers": {
      "assertive": 0,
      "connective": 1,
      "numeric": 0,
      "citation": 0,
      "total": 1,
      "per_100_words": 1.563
     },
     "transition_in": {
      "marker": null,
      "kind": null,
      "lexical_overlap": 0.087,
      "linked": true,
      "same_section": false
     }
    },
    {
     "line": 9,
     "words": 58,
     "sentences": 4,
     "first_sentence": "There is a second reason, and it is the stronger one.",
     "heading_overlap_sentence": "When the plan changes, the diff says what changed and the commit says why.",
     "heading_overlap": 0.143,
     "claim_markers": {
      "assertive": 0,
      "connective": 1,
      "numeric": 0,
      "citation": 0,
      "total": 1,
      "per_100_words": 1.724
     },
     "transition_in": {
      "marker": null,
      "kind": null,
      "lexical_overlap": 0.07,
      "linked": false,
      "same_section": true
     }
    }
   ],
   "words": 122,
   "paragraph_count": 2,
   "start_line": 5,
   "end_line": 9,
   "claim_markers": 2,
   "claim_markers_per_100_words": 1.639,
   "ratio_to_median": 1.371
  },
  {
   "heading": 2,
   "title": "The check",
   "level": 2,
   "paragraphs": [
    {
     "line": 13,
     "words": 11,
     "sentences": 1,
     "first_sentence": "The build must fail when the plan and the code disagree.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 1,
      "connective": 0,
      "numeric": 0,
      "citation": 0,
      "total": 1,
      "per_100_words": 9.091
     },
     "transition_in": {
      "marker": null,
      "kind": null,
      "lexical_overlap": 0.036,
      "linked": false,
      "same_section": false
     }
    }
   ],
   "words": 11,
   "paragraph_count": 1,
   "start_line": 11,
   "end_line": 13,
   "claim_markers": 1,
   "claim_markers_per_100_words": 9.091,
   "ratio_to_median": 0.124
  },
  {
   "heading": 3,
   "title": "The objection",
   "level": 2,
   "paragraphs": [
    {
     "line": 17,
     "words": 93,
     "sentences": 5,
     "first_sentence": "The usual objection is that a mechanical check makes people update the plan without thinking.",
     "heading_overlap_sentence": "The usual objection is that a mechanical check makes people update the plan without thinking.",
     "heading_overlap": 0.1,
     "claim_markers": {
      "assertive": 1,
      "connective": 2,
      "numeric": 1,
      "citation": 0,
      "total": 4,
      "per_100_words": 4.301
     },
     "transition_in": {
      "marker": null,
      "kind": null,
      "lexical_overlap": 0.043,
      "linked": false,
      "same_section": false
     }
    },
    {
     "line": 19,
     "words": 39,
     "sentences": 4,
     "first_sentence": "So the rule is simple.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 0,
      "connective": 1,
      "numeric": 0,
      "citation": 0,
      "total": 1,
      "per_100_words": 2.564
     },
     "transition_in": {
      "marker": "so",
      "kind": "consequence",
      "lexical_overlap": 0.034,
      "linked": true,
      "same_section": true
     }
    }
   ],
   "words": 132,
   "paragraph_count": 2,
   "start_line": 15,
   "end_line": 19,
   "claim_markers": 5,
   "claim_markers_per_100_words": 3.788,
   "ratio_to_median": 1.483
  }
 ],
 "balance": {
  "sections": 4,
  "median_words": 89,
  "max_ratio": 1.483,
  "min_ratio": 0.124
 },
 "transitions": {
  "boundaries": 5,
  "marked": 2,
  "unmarked": [
   {
    "line": 9,
    "section": "Where the plan lives",
    "same_section": true
   },
   {
    "line": 13,
    "section": "The check",
    "same_section": false
   },
   {
    "line": 17,
    "section": "The objection",
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

## intended outline (voice-outline/1 body)

```json
{
  "mode": "argument",
  "title": "Why the roadmap must be a file",
  "thesis": "A plan that is not a file under version control, checked by the build, is not a plan.",
  "nodes": [
    { "id": "n1", "kind": "claim", "parent": null, "order": 1, "text": "A plan lives where the work lives, or it is not read.",
      "evidence": [ { "slot": "e1", "filled_by": "three retrospectives" }, { "slot": "e2", "filled_by": "a file has a history" } ] },
    { "id": "n2", "kind": "claim", "parent": null, "order": 2, "text": "The check must be mechanical, because plan and code drift silently and nothing complains.",
      "evidence": [ { "slot": "e1", "filled_by": "the 2024 script: eleven stale entries to zero" }, { "slot": "e2", "filled_by": "the silent drift case: code says 0.7.0, plan says 0.6.0" } ] },
    { "id": "n3", "kind": "claim", "parent": null, "order": 3, "text": "The forced-edit objection is true and does not matter.",
      "evidence": [ { "slot": "e1", "filled_by": "a small forced edit is where a reviewer looks" } ] },
    { "id": "n4", "kind": "claim", "parent": null, "order": 4, "text": "The rule: file, next to the code, build fails on disagreement.", "evidence": [ { "slot": "e1", "filled_by": "follows from n1–n3" } ] }
  ]
}
```

The scan is authoritative on counts. You are authoritative only on consequence.

## Integrity constraints — these are the point of the harness, not boilerplate

You may read exactly these files, and they are copies staged for this run:

    bundles/prose-review/tests/runs/2026-11-09-structure/inputs/case-10/draft.md
    bundles/prose-review/tests/runs/2026-11-09-structure/inputs/case-10/outline.json

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
