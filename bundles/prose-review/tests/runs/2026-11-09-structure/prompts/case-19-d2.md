# Critic run — case-19

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
 "words": 1649,
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
     "words": 151,
     "sentences": 9,
     "first_sentence": "Nearly all the best and most precious things in the universe you can get for a halfpenny.",
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
     "line": 14,
     "words": 148,
     "sentences": 6,
     "first_sentence": "But if you want to see what a vast and bewildering array of valuable things you can get at a halfpenny each you should do as I was doing last night.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 2,
      "connective": 1,
      "numeric": 0,
      "citation": 1,
      "total": 4,
      "per_100_words": 2.703
     },
     "transition_in": {
      "marker": "but",
      "kind": "contrast",
      "lexical_overlap": 0.029,
      "linked": true,
      "same_section": true
     }
    },
    {
     "line": 26,
     "words": 0,
     "sentences": 1,
     "first_sentence": ".....",
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
     "line": 28,
     "words": 187,
     "sentences": 8,
     "first_sentence": "As I looked at that palace of pigmy wonders, at small green omnibuses, at small blue elephants, at small black dolls, and small red Noah’s arks, I must have fallen into some sort of unnatural trance.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 1,
      "connective": 2,
      "numeric": 0,
      "citation": 0,
      "total": 3,
      "per_100_words": 1.604
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
     "line": 45,
     "words": 199,
     "sentences": 10,
     "first_sentence": "Every one, I suppose, knows such stunning instants of abstraction, such brilliant blanks in the mind.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 2,
      "connective": 0,
      "numeric": 0,
      "citation": 0,
      "total": 2,
      "per_100_words": 1.005
     },
     "transition_in": {
      "marker": null,
      "kind": null,
      "lexical_overlap": 0.026,
      "linked": false,
      "same_section": true
     }
    },
    {
     "line": 61,
     "words": 115,
     "sentences": 4,
     "first_sentence": "To shake off this dangerous and dreamy sense I went into the shop and tried to buy wooden soldiers.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 0,
      "connective": 1,
      "numeric": 0,
      "citation": 0,
      "total": 1,
      "per_100_words": 0.87
     },
     "transition_in": {
      "marker": null,
      "kind": null,
      "lexical_overlap": 0.043,
      "linked": false,
      "same_section": true
     }
    },
    {
     "line": 71,
     "words": 16,
     "sentences": 4,
     "first_sentence": "“No, no,” he said vaguely.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 2,
      "connective": 0,
      "numeric": 0,
      "citation": 1,
      "total": 3,
      "per_100_words": 18.75
     },
     "transition_in": {
      "marker": null,
      "kind": null,
      "lexical_overlap": 0.019,
      "linked": false,
      "same_section": true
     }
    },
    {
     "line": 74,
     "words": 18,
     "sentences": 1,
     "first_sentence": "“Not taking money,” I replied, “seems to me more like an uncommonly new fashion than an old one.”",
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
     "line": 77,
     "words": 21,
     "sentences": 2,
     "first_sentence": "“I never have,” said the old man, blinking and blowing his nose; “I’ve always given presents.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 2,
      "connective": 0,
      "numeric": 0,
      "citation": 1,
      "total": 3,
      "per_100_words": 14.286
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
     "line": 80,
     "words": 14,
     "sentences": 4,
     "first_sentence": "“Good heavens!”",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 0,
      "connective": 0,
      "numeric": 0,
      "citation": 1,
      "total": 1,
      "per_100_words": 7.143
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
     "line": 83,
     "words": 12,
     "sentences": 1,
     "first_sentence": "“I am Father Christmas,” he said apologetically, and blew his nose again.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 0,
      "connective": 0,
      "numeric": 0,
      "citation": 1,
      "total": 1,
      "per_100_words": 8.333
     },
     "transition_in": {
      "marker": null,
      "kind": null,
      "lexical_overlap": 0.333,
      "linked": true,
      "same_section": true
     }
    },
    {
     "line": 86,
     "words": 74,
     "sentences": 5,
     "first_sentence": "The lamps could not have been lighted yet in the street outside.",
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
      "lexical_overlap": 0.05,
      "linked": false,
      "same_section": true
     }
    },
    {
     "line": 94,
     "words": 5,
     "sentences": 1,
     "first_sentence": "“I am dying,” he said.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 0,
      "connective": 0,
      "numeric": 0,
      "citation": 1,
      "total": 1,
      "per_100_words": 20
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
     "line": 96,
     "words": 11,
     "sentences": 1,
     "first_sentence": "I did not speak, and it was he who spoke again.",
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
     "line": 98,
     "words": 119,
     "sentences": 10,
     "first_sentence": "“All the new people have left my shop.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 1,
      "connective": 0,
      "numeric": 0,
      "citation": 0,
      "total": 1,
      "per_100_words": 0.84
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
     "line": 109,
     "words": 22,
     "sentences": 3,
     "first_sentence": "“You may be dead,” I replied.",
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
      "lexical_overlap": 0.071,
      "linked": false,
      "same_section": true
     }
    },
    {
     "line": 112,
     "words": 0,
     "sentences": 1,
     "first_sentence": ".....",
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
     "line": 114,
     "words": 137,
     "sentences": 6,
     "first_sentence": "A silence fell suddenly between us which I somehow expected to be unbroken.",
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
     "line": 126,
     "words": 20,
     "sentences": 4,
     "first_sentence": "“Good lord!”",
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
     "line": 129,
     "words": 22,
     "sentences": 1,
     "first_sentence": "“I’m not dead yet, Mr. Dickens,” said the old gentleman, with a feeble smile; “but I’m dying,” he hastened to add reassuringly.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 0,
      "connective": 0,
      "numeric": 0,
      "citation": 1,
      "total": 1,
      "per_100_words": 4.545
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
     "line": 132,
     "words": 23,
     "sentences": 1,
     "first_sentence": "“But, dash it all, you were dying in my time,” said Mr. Charles Dickens with animation; “and you don’t look a day older.”",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 0,
      "connective": 0,
      "numeric": 0,
      "citation": 1,
      "total": 1,
      "per_100_words": 4.348
     },
     "transition_in": {
      "marker": "but",
      "kind": "contrast",
      "lexical_overlap": 0.158,
      "linked": true,
      "same_section": true
     }
    },
    {
     "line": 135,
     "words": 11,
     "sentences": 1,
     "first_sentence": "“I’ve felt like this for a long time,” said Father Christmas.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 0,
      "connective": 0,
      "numeric": 0,
      "citation": 1,
      "total": 1,
      "per_100_words": 9.091
     },
     "transition_in": {
      "marker": null,
      "kind": null,
      "lexical_overlap": 0.125,
      "linked": true,
      "same_section": true
     }
    },
    {
     "line": 137,
     "words": 16,
     "sentences": 1,
     "first_sentence": "Mr. Dickens turned his back and put his head out of the door into the darkness.",
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
     "line": 140,
     "words": 12,
     "sentences": 1,
     "first_sentence": "“Dick,” he roared at the top of his voice; “he’s still alive.”",
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
     "line": 142,
     "words": 0,
     "sentences": 1,
     "first_sentence": ".....",
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
     "line": 144,
     "words": 82,
     "sentences": 2,
     "first_sentence": "Another shadow darkened the doorway, and a much larger and more full-blooded gentleman in an enormous periwig came in, fanning his flushed face with a military hat of the cut of Queen Anne.",
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
     "line": 152,
     "words": 27,
     "sentences": 1,
     "first_sentence": "“Indeed,” said Sir Richard Steele, “?’tis a most prodigious matter, for the man was dying when I wrote about Sir Roger de Coverley and his Christmas Day.”",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 0,
      "connective": 0,
      "numeric": 0,
      "citation": 2,
      "total": 2,
      "per_100_words": 7.407
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
     "line": 156,
     "words": 16,
     "sentences": 2,
     "first_sentence": "My senses were growing dimmer and the room darker.",
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
     "line": 159,
     "words": 72,
     "sentences": 2,
     "first_sentence": "“It hath ever been understood,” said a burly man, who carried his head humorously and obstinately a little on one side--I think he was Ben Jonson--“It hath ever been understood, consule Jacobo, under our King James and her late Majesty, that such good and hearty customs were fallen sick, and like to pass from the world.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 0,
      "connective": 0,
      "numeric": 0,
      "citation": 1,
      "total": 1,
      "per_100_words": 1.389
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
     "line": 166,
     "words": 24,
     "sentences": 1,
     "first_sentence": "And I also thought I heard a green-clad man, like Robin Hood, say in some mixed Norman French, “But I saw the man dying.”",
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
      "marker": "and",
      "kind": "addition",
      "lexical_overlap": 0.045,
      "linked": true,
      "same_section": true
     }
    },
    {
     "line": 169,
     "words": 16,
     "sentences": 1,
     "first_sentence": "“I have felt like this a long time,” said Father Christmas, in his feeble way again.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 0,
      "connective": 0,
      "numeric": 0,
      "citation": 1,
      "total": 1,
      "per_100_words": 6.25
     },
     "transition_in": {
      "marker": null,
      "kind": null,
      "lexical_overlap": 0.048,
      "linked": false,
      "same_section": true
     }
    },
    {
     "line": 172,
     "words": 8,
     "sentences": 1,
     "first_sentence": "Mr. Charles Dickens suddenly leant across to him.",
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
     "line": 174,
     "words": 8,
     "sentences": 3,
     "first_sentence": "“Since when?”",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 0,
      "connective": 2,
      "numeric": 0,
      "citation": 0,
      "total": 2,
      "per_100_words": 25
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
     "line": 176,
     "words": 16,
     "sentences": 2,
     "first_sentence": "“Yes,” said the old man, and sank shaking into a chair.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 1,
      "connective": 0,
      "numeric": 0,
      "citation": 1,
      "total": 2,
      "per_100_words": 12.5
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
     "line": 179,
     "words": 17,
     "sentences": 1,
     "first_sentence": "Mr. Dickens took off his hat with a flourish like a man calling a mob to rise.",
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
      "lexical_overlap": 0.056,
      "linked": false,
      "same_section": true
     }
    },
    {
     "line": 182,
     "words": 10,
     "sentences": 1,
     "first_sentence": "“I understand it now,” he cried, “you will never die.”",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 1,
      "connective": 0,
      "numeric": 0,
      "citation": 0,
      "total": 1,
      "per_100_words": 10
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
   "words": 1649,
   "paragraph_count": 36,
   "start_line": 1,
   "end_line": 182,
   "claim_markers": 32,
   "claim_markers_per_100_words": 1.941,
   "ratio_to_median": 1
  }
 ],
 "balance": {
  "sections": 1,
  "median_words": 1649,
  "max_ratio": 1,
  "min_ratio": 1
 },
 "transitions": {
  "boundaries": 35,
  "marked": 5,
  "unmarked": [
   {
    "line": 26,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 28,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 45,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 61,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 71,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 74,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 77,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 80,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 86,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 94,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 96,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 98,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 109,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 112,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 114,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 126,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 129,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 137,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 140,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 142,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 144,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 152,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 156,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 159,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 169,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 172,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 174,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 176,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 179,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 182,
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

    bundles/prose-review/tests/runs/2026-11-09-structure/inputs/case-19/draft.md

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
