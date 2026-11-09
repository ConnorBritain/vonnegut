# Critic run

You have a draft, the output of `outline-scan` over it, and no intended outline. Report on the draft's structure, following your instructions exactly, including the mode line, the output contract and the closing one-line verdict.

Mode: draft-only.

## outline-scan output

```json
{
  "schema": "outline-scan/1",
  "file": "draft.md",
  "markdown": true,
  "words": 244,
  "status": "measured",
  "headings": [
    {
      "index": 0,
      "level": 1,
      "text": "Feed the starter",
      "line": 1,
      "parent": null
    },
    {
      "index": 1,
      "level": 2,
      "text": "The part nobody sees",
      "line": 8,
      "parent": 0
    },
    {
      "index": 2,
      "level": 2,
      "text": "A month on the starter",
      "line": 17,
      "parent": 0
    },
    {
      "index": 3,
      "level": 2,
      "text": "What to do on Monday",
      "line": 27,
      "parent": 0
    }
  ],
  "sections": [
    {
      "heading": 0,
      "title": "Feed the starter",
      "level": 1,
      "paragraphs": [
        {
          "line": 3,
          "words": 44,
          "sentences": 3,
          "first_sentence": "My neighbour has run a sourdough bakery on the corner for eleven years.",
          "heading_overlap_sentence": "They feed the starter, clean the baskets, and write down the temperature of the cold room every morning.",
          "heading_overlap": 0.182,
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
      "words": 44,
      "paragraph_count": 1,
      "start_line": 1,
      "end_line": 3,
      "claim_markers": 0,
      "claim_markers_per_100_words": 0,
      "ratio_to_median": 0.772
    },
    {
      "heading": 1,
      "title": "The part nobody sees",
      "level": 2,
      "paragraphs": [
        {
          "line": 10,
          "words": 44,
          "sentences": 2,
          "first_sentence": "If the starter is weak, the loaves come out flat and sour, and nobody can fix that at the oven.",
          "heading_overlap_sentence": "If the starter is weak, the loaves come out flat and sour, and nobody can fix that at the oven.",
          "heading_overlap": 0.083,
          "claim_markers": {
            "assertive": 2,
            "connective": 0,
            "numeric": 0,
            "citation": 0,
            "total": 2,
            "per_100_words": 4.545
          },
          "transition_in": {
            "marker": null,
            "kind": null,
            "lexical_overlap": 0.044,
            "linked": false,
            "same_section": false
          }
        },
        {
          "line": 14,
          "words": 26,
          "sentences": 2,
          "first_sentence": "Teams work the same way.",
          "heading_overlap_sentence": "We reward the visible part of the work, the shaping and the scoring, and we starve the part that decides it.",
          "heading_overlap": 0.1,
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
            "same_section": true
          }
        }
      ],
      "words": 70,
      "paragraph_count": 2,
      "start_line": 8,
      "end_line": 14,
      "claim_markers": 2,
      "claim_markers_per_100_words": 2.857,
      "ratio_to_median": 1.228
    },
    {
      "heading": 2,
      "title": "A month on the starter",
      "level": 2,
      "paragraphs": [
        {
          "line": 19,
          "words": 43,
          "sentences": 4,
          "first_sentence": "Her best baker hated the first month.",
          "heading_overlap_sentence": "Her best baker hated the first month.",
          "heading_overlap": 0.2,
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
        },
        {
          "line": 23,
          "words": 35,
          "sentences": 1,
          "first_sentence": "She keeps a notebook for every batch, eleven years of them on a shelf above the ovens, and when a loaf goes wrong she reads back until she finds the day the starter got tired.",
          "heading_overlap_sentence": "She keeps a notebook for every batch, eleven years of them on a shelf above the ovens, and when a loaf goes wrong she reads back until she finds the day the starter got tired.",
          "heading_overlap": 0.05,
          "claim_markers": {
            "assertive": 1,
            "connective": 0,
            "numeric": 0,
            "citation": 0,
            "total": 1,
            "per_100_words": 2.857
          },
          "transition_in": {
            "marker": null,
            "kind": null,
            "lexical_overlap": 0,
            "linked": false,
            "same_section": true
          }
        }
      ],
      "words": 78,
      "paragraph_count": 2,
      "start_line": 17,
      "end_line": 23,
      "claim_markers": 1,
      "claim_markers_per_100_words": 1.282,
      "ratio_to_median": 1.368
    },
    {
      "heading": 3,
      "title": "What to do on Monday",
      "level": 2,
      "paragraphs": [
        {
          "line": 29,
          "words": 35,
          "sentences": 3,
          "first_sentence": "Give the new person a month on the slow part.",
          "heading_overlap_sentence": null,
          "heading_overlap": 0,
          "claim_markers": {
            "assertive": 0,
            "connective": 1,
            "numeric": 0,
            "citation": 0,
            "total": 1,
            "per_100_words": 2.857
          },
          "transition_in": {
            "marker": null,
            "kind": null,
            "lexical_overlap": 0.091,
            "linked": true,
            "same_section": false
          }
        }
      ],
      "words": 35,
      "paragraph_count": 1,
      "start_line": 27,
      "end_line": 29,
      "claim_markers": 1,
      "claim_markers_per_100_words": 2.857,
      "ratio_to_median": 0.614
    }
  ],
  "balance": {
    "sections": 4,
    "median_words": 57,
    "max_ratio": 1.368,
    "min_ratio": 0.614
  },
  "transitions": {
    "boundaries": 5,
    "marked": 1,
    "unmarked": [
      {
        "line": 10,
        "section": "The part nobody sees",
        "same_section": false
      },
      {
        "line": 14,
        "section": "The part nobody sees",
        "same_section": true
      },
      {
        "line": 19,
        "section": "A month on the starter",
        "same_section": false
      },
      {
        "line": 23,
        "section": "A month on the starter",
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

## The draft

Read it from this file (line numbers you cite refer to it exactly as given):

    <review>/pos/inputs/draft.md

You may read only that file. Output your report and nothing else.
