# Critic run — case-03

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
 "words": 3183,
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
     "words": 325,
     "sentences": 7,
     "first_sentence": "The speech of Themistocles, the Athenian, which was haughty and arrogant, in taking so much to himself, had been a grave and wise observation and censure, applied at large to others.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 6,
      "connective": 2,
      "numeric": 0,
      "citation": 2,
      "total": 10,
      "per_100_words": 3.077
     },
     "transition_in": null
    },
    {
     "line": 30,
     "words": 146,
     "sentences": 4,
     "first_sentence": "The greatness of an estate, in bulk and territory, doth fall under measure; and the greatness of finances and revenue doth fall under computation.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 1,
      "connective": 1,
      "numeric": 0,
      "citation": 0,
      "total": 2,
      "per_100_words": 1.37
     },
     "transition_in": {
      "marker": null,
      "kind": null,
      "lexical_overlap": 0.051,
      "linked": false,
      "same_section": true
     }
    },
    {
     "line": 43,
     "words": 372,
     "sentences": 7,
     "first_sentence": "Walled towns, stored arsenals and armories, goodly races of horse, chariots of war, elephants, ordnance, artillery, and the like; all this is but a sheep in a lion’s skin, except the breed and disposition of the people be stout and warlike.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 2,
      "connective": 3,
      "numeric": 0,
      "citation": 3,
      "total": 8,
      "per_100_words": 2.151
     },
     "transition_in": {
      "marker": null,
      "kind": null,
      "lexical_overlap": 0.056,
      "linked": false,
      "same_section": true
     }
    },
    {
     "line": 75,
     "words": 138,
     "sentences": 3,
     "first_sentence": "The blessing of Judah and Issachar will never meet; that the same people, or nation, should be both the lion’s whelp and the ass between burdens; neither will it be, that a people overlaid with taxes should ever become valiant and martial.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 5,
      "connective": 2,
      "numeric": 0,
      "citation": 0,
      "total": 7,
      "per_100_words": 5.072
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
     "line": 87,
     "words": 258,
     "sentences": 5,
     "first_sentence": "Let states that aim at greatness take heed how their nobility and gentlemen do multiply too fast; for that maketh the common subject grow to be a peasant and base swain, driven out of heart, and, in effect, but the gentleman’s laborer.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 1,
      "connective": 3,
      "numeric": 0,
      "citation": 0,
      "total": 4,
      "per_100_words": 1.55
     },
     "transition_in": {
      "marker": null,
      "kind": null,
      "lexical_overlap": 0.072,
      "linked": false,
      "same_section": true
     }
    },
    {
     "line": 109,
     "words": 6,
     "sentences": 1,
     "first_sentence": "“Terra potens armis atque ubere glebæ.”",
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
      "same_section": true
     }
    },
    {
     "line": 111,
     "words": 98,
     "sentences": 1,
     "first_sentence": "Neither is that state (which, for anything I know, is almost peculiar to England, and hardly to be found anywhere else, except it be, perhaps, in Poland), to be passed over; I mean the state of free servants and attendants upon noblemen and gentlemen, which are noways inferior unto the yeomanry for arms; and, therefore, out of all question, the splendor and magnificence, and great retinues, and hospitality of noblemen and gentlemen received into custom, do much conduce unto martial greatness; whereas, contrariwise, the close and reserved living of noblemen and gentlemen causeth a penury of military forces.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 0,
      "connective": 1,
      "numeric": 0,
      "citation": 0,
      "total": 1,
      "per_100_words": 1.02
     },
     "transition_in": {
      "marker": null,
      "kind": null,
      "lexical_overlap": 0,
      "linked": false,
      "same_section": true
     }
    },
    {
     "line": 122,
     "words": 389,
     "sentences": 7,
     "first_sentence": "By all means, it is to be procured that the trunk of Nebuchadnezzar’s tree of monarchy be great enough to bear the branches and the boughs; that is, that the natural subjects of the crown, or state, bear a sufficient proportion to the stranger subjects that they govern.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 2,
      "connective": 5,
      "numeric": 0,
      "citation": 0,
      "total": 7,
      "per_100_words": 1.799
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
     "line": 157,
     "words": 160,
     "sentences": 3,
     "first_sentence": "It is certain that sedentary and within-door arts, and delicate manufactures (that require rather the finger than the arm), have in their nature a contrariety to a military disposition; and, generally, all warlike people are a little idle, and love danger better than travail; neither must they be too much broken of it, if they shall be preserved in vigor.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 1,
      "connective": 1,
      "numeric": 0,
      "citation": 0,
      "total": 2,
      "per_100_words": 1.25
     },
     "transition_in": {
      "marker": null,
      "kind": null,
      "lexical_overlap": 0.065,
      "linked": false,
      "same_section": true
     }
    },
    {
     "line": 173,
     "words": 258,
     "sentences": 5,
     "first_sentence": "But, above all, for empire and greatness, it importeth most, that a nation do profess arms as their principal honor, study, and occupation; for the things which we formerly have spoken of are but habilitations towards arms; and what is habilitation without intention and act?",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 3,
      "connective": 1,
      "numeric": 0,
      "citation": 1,
      "total": 5,
      "per_100_words": 1.938
     },
     "transition_in": {
      "marker": "but",
      "kind": "contrast",
      "lexical_overlap": 0.07,
      "linked": true,
      "same_section": true
     }
    },
    {
     "line": 196,
     "words": 319,
     "sentences": 6,
     "first_sentence": "Incident to this point is, for a state to have those laws or customs which may reach forth unto them just occasions (as may be pretended) of war; for there is that justice imprinted in the nature of men, that they enter not upon wars (whereof so many calamities do ensue), but upon some, at the least specious grounds and quarrels.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 2,
      "connective": 2,
      "numeric": 0,
      "citation": 0,
      "total": 4,
      "per_100_words": 1.254
     },
     "transition_in": {
      "marker": null,
      "kind": null,
      "lexical_overlap": 0.07,
      "linked": false,
      "same_section": true
     }
    },
    {
     "line": 223,
     "words": 149,
     "sentences": 3,
     "first_sentence": "Nobody can be healthful without exercise, neither natural body nor politic; and, certainly, to a kingdom, or estate, a just and honorable war is the true exercise.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 3,
      "connective": 0,
      "numeric": 0,
      "citation": 0,
      "total": 3,
      "per_100_words": 2.013
     },
     "transition_in": {
      "marker": null,
      "kind": null,
      "lexical_overlap": 0.076,
      "linked": false,
      "same_section": true
     }
    },
    {
     "line": 236,
     "words": 223,
     "sentences": 7,
     "first_sentence": "To be master of the sea is an abridgment of a monarchy.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 0,
      "connective": 3,
      "numeric": 0,
      "citation": 0,
      "total": 3,
      "per_100_words": 1.345
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
     "line": 255,
     "words": 256,
     "sentences": 4,
     "first_sentence": "The wars of latter ages seem to be made in the dark, in respect of the glory and honor which reflected upon men from the wars in ancient time.",
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
      "lexical_overlap": 0.034,
      "linked": false,
      "same_section": true
     }
    },
    {
     "line": 278,
     "words": 86,
     "sentences": 2,
     "first_sentence": "To conclude.",
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
      "lexical_overlap": 0.016,
      "linked": false,
      "same_section": true
     }
    }
   ],
   "words": 3183,
   "paragraph_count": 15,
   "start_line": 1,
   "end_line": 278,
   "claim_markers": 56,
   "claim_markers_per_100_words": 1.759,
   "ratio_to_median": 1
  }
 ],
 "balance": {
  "sections": 1,
  "median_words": 3183,
  "max_ratio": 1,
  "min_ratio": 1
 },
 "transitions": {
  "boundaries": 14,
  "marked": 1,
  "unmarked": [
   {
    "line": 30,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 43,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 75,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 87,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 109,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 111,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 122,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 157,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 196,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 223,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 236,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 255,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 278,
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

    bundles/prose-review/tests/runs/2026-11-09-structure/inputs/case-03/draft.md

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
