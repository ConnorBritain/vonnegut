# Critic run — case-20

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
 "words": 2268,
 "status": "measured",
 "headings": [],
 "sections": [
  {
   "heading": null,
   "title": "(preamble)",
   "level": 0,
   "paragraphs": [
    {
     "line": 1,
     "words": 420,
     "sentences": 12,
     "first_sentence": "God Almighty first planted a garden; and, indeed, it is the purest of human pleasures; it is the greatest refreshment to the spirits of man; without which buildings and palaces are but gross handyworks; and a man shall ever see, that, when ages grow to civility and elegancy, men come to build stately, sooner than to garden finely; as if gardening were the greater perfection.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 1,
      "connective": 0,
      "numeric": 0,
      "citation": 0,
      "total": 1,
      "per_100_words": 0.238
     },
     "transition_in": null
    },
    {
     "line": 43,
     "words": 274,
     "sentences": 5,
     "first_sentence": "And because the breath of flowers is far sweeter in the air (where it comes and goes, like the warbling of music), than in the hand, therefore nothing is more fit for that delight, than to know what be the flowers and plants that do best perfume the air.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 0,
      "connective": 6,
      "numeric": 0,
      "citation": 0,
      "total": 6,
      "per_100_words": 2.19
     },
     "transition_in": {
      "marker": "and",
      "kind": "addition",
      "lexical_overlap": 0.084,
      "linked": true,
      "same_section": true
     }
    },
    {
     "line": 67,
     "words": 479,
     "sentences": 7,
     "first_sentence": "For gardens (speaking of those which are indeed prince-like, as we have done of buildings), the contents ought not well to be under thirty acres of ground, and to be divided into three parts; a green in the entrance, a heath, or desert, in the going forth, and the main garden in the midst, besides alleys on both sides; and I like well that four acres of ground be assigned to the green, six to the heath, four and four to either side, and twelve to the main garden.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 2,
      "connective": 4,
      "numeric": 0,
      "citation": 0,
      "total": 6,
      "per_100_words": 1.253
     },
     "transition_in": {
      "marker": null,
      "kind": null,
      "lexical_overlap": 0.071,
      "linked": false,
      "same_section": true
     }
    },
    {
     "line": 105,
     "words": 162,
     "sentences": 5,
     "first_sentence": "For the ordering of the ground within the great hedge, I leave it to variety of device; advising, nevertheless, that whatsoever form you cast it into first, it be not too bushy, or full of work; wherein I, for my part, do not like images cut out in juniper or other garden stuff; they be for children.",
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
      "lexical_overlap": 0.124,
      "linked": true,
      "same_section": true
     }
    },
    {
     "line": 120,
     "words": 294,
     "sentences": 5,
     "first_sentence": "For fountains, they are a great beauty and refreshment; but pools mar all, and make the garden unwholesome, and full of flies and frogs.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 2,
      "connective": 1,
      "numeric": 0,
      "citation": 0,
      "total": 3,
      "per_100_words": 1.02
     },
     "transition_in": {
      "marker": null,
      "kind": null,
      "lexical_overlap": 0.09,
      "linked": true,
      "same_section": true
     }
    },
    {
     "line": 145,
     "words": 217,
     "sentences": 3,
     "first_sentence": "For the heath, which was the third part of our plot, I wish it to be framed as much as may be to a natural wildness.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 0,
      "connective": 1,
      "numeric": 0,
      "citation": 0,
      "total": 1,
      "per_100_words": 0.461
     },
     "transition_in": {
      "marker": null,
      "kind": null,
      "lexical_overlap": 0.039,
      "linked": false,
      "same_section": true
     }
    },
    {
     "line": 164,
     "words": 170,
     "sentences": 4,
     "first_sentence": "For the side grounds, you are to fill them with variety of alleys, private, to give a full shade; some of them wheresoever the sun be.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 3,
      "connective": 1,
      "numeric": 0,
      "citation": 0,
      "total": 4,
      "per_100_words": 2.353
     },
     "transition_in": {
      "marker": null,
      "kind": null,
      "lexical_overlap": 0.083,
      "linked": true,
      "same_section": true
     }
    },
    {
     "line": 179,
     "words": 127,
     "sentences": 2,
     "first_sentence": "For the main garden, I do not deny but there should be some fair alleys ranged on both sides with fruit-trees, and some pretty tufts of fruit-trees and arbors with seats, set in some decent order; but these to be by no means set too thick, but to leave the main garden so as it be not close, but the air open and free.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 2,
      "connective": 1,
      "numeric": 0,
      "citation": 0,
      "total": 3,
      "per_100_words": 2.362
     },
     "transition_in": {
      "marker": null,
      "kind": null,
      "lexical_overlap": 0.12,
      "linked": true,
      "same_section": true
     }
    },
    {
     "line": 189,
     "words": 125,
     "sentences": 3,
     "first_sentence": "For aviaries, I like them not, except they be of that largeness as they may be turfed, and have living plants and bushes set in them; that the birds may have more scope and natural nestling, and that no foulness appear in the floor of the aviary.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 1,
      "connective": 1,
      "numeric": 0,
      "citation": 0,
      "total": 2,
      "per_100_words": 1.6
     },
     "transition_in": {
      "marker": null,
      "kind": null,
      "lexical_overlap": 0.034,
      "linked": false,
      "same_section": true
     }
    }
   ],
   "words": 2268,
   "paragraph_count": 9,
   "start_line": 1,
   "end_line": 189,
   "claim_markers": 26,
   "claim_markers_per_100_words": 1.146,
   "ratio_to_median": 1
  }
 ],
 "balance": {
  "sections": 1,
  "median_words": 2268,
  "max_ratio": 1,
  "min_ratio": 1
 },
 "transitions": {
  "boundaries": 8,
  "marked": 5,
  "unmarked": [
   {
    "line": 67,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 145,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 189,
    "section": "(preamble)",
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

    bundles/prose-review/tests/runs/2026-11-09-structure/inputs/case-20/draft.md

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
