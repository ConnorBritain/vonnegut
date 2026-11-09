# Critic run — case-13

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
 "words": 3307,
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
     "words": 2,
     "sentences": 1,
     "first_sentence": "Today's links",
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
     "line": 3,
     "words": 17,
     "sentences": 1,
     "first_sentence": "Better to beg forgiveness: Don't ring the doorbell at the house of no unless you absolutely must.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 1,
      "connective": 0,
      "numeric": 0,
      "citation": 0,
      "total": 1,
      "per_100_words": 5.882
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
     "line": 5,
     "words": 7,
     "sentences": 1,
     "first_sentence": "Hey look at this: Delights to delectate.",
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
     "line": 7,
     "words": 53,
     "sentences": 1,
     "first_sentence": "Object permanence: RIP Poul Anderson; P2P at PC Forum; Waitress handed her own stolen ID by carded diner; PDX bans fixies; Digital Economy Bill was a stitch up; NZ copyright disconnection flowchart; Fry v Widdicombe on Catholic Church; Moxie Marlinspike profile; V&A bans sketching; Gernsback's intro to the first Amazing Stories; \"Simplicity.\"",
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
     "line": 9,
     "words": 9,
     "sentences": 1,
     "first_sentence": "Upcoming appearances: Edinburgh, Sydney, Melbourne, Brighton, London, South Bend.",
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
     "line": 11,
     "words": 5,
     "sentences": 1,
     "first_sentence": "Recent appearances: Where I've been.",
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
      "lexical_overlap": 0.091,
      "linked": true,
      "same_section": true
     }
    },
    {
     "line": 13,
     "words": 10,
     "sentences": 1,
     "first_sentence": "Latest books: You keep readin' em, I'll keep writin' 'em.",
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
     "line": 15,
     "words": 9,
     "sentences": 1,
     "first_sentence": "Upcoming books: Like I said, I'll keep writin' 'em.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 0,
      "connective": 0,
      "numeric": 0,
      "citation": 1,
      "total": 1,
      "per_100_words": 11.111
     },
     "transition_in": {
      "marker": null,
      "kind": null,
      "lexical_overlap": 0.444,
      "linked": true,
      "same_section": true
     }
    },
    {
     "line": 17,
     "words": 4,
     "sentences": 1,
     "first_sentence": "Colophon: All the rest.",
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
     "line": 19,
     "words": 5,
     "sentences": 1,
     "first_sentence": "Better to beg forgiveness (permalink)",
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
     "line": 21,
     "words": 57,
     "sentences": 2,
     "first_sentence": "From its inception, I've loved Creative Commons.",
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
     "line": 25,
     "words": 49,
     "sentences": 2,
     "first_sentence": "In those early days, CC licenses were primarily of interest to people who were steeped in copyright law, lore and litigation; so many of the early debates about these licenses turned on esoteric (but important!)",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 0,
      "connective": 1,
      "numeric": 0,
      "citation": 0,
      "total": 1,
      "per_100_words": 2.041
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
     "line": 27,
     "words": 58,
     "sentences": 3,
     "first_sentence": "You see, copyright has never meant the absolute right to control all uses of a work.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 1,
      "connective": 0,
      "numeric": 0,
      "citation": 0,
      "total": 1,
      "per_100_words": 1.724
     },
     "transition_in": {
      "marker": null,
      "kind": null,
      "lexical_overlap": 0.128,
      "linked": true,
      "same_section": true
     }
    },
    {
     "line": 29,
     "words": 75,
     "sentences": 5,
     "first_sentence": "Fair use is (potentially) extremely broad, but it's also extremely \"fact-intensive\" – that's the phrase lawyers use to describe the kind of legal question whose answer is almost always \"it depends.\"",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 1,
      "connective": 0,
      "numeric": 0,
      "citation": 0,
      "total": 1,
      "per_100_words": 1.333
     },
     "transition_in": {
      "marker": null,
      "kind": null,
      "lexical_overlap": 0.085,
      "linked": true,
      "same_section": true
     }
    },
    {
     "line": 31,
     "words": 53,
     "sentences": 3,
     "first_sentence": "If you know anything about fair use, it's probably something about a \"four-step test\" used to determine if a usage is fair.",
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
      "lexical_overlap": 0.057,
      "linked": false,
      "same_section": true
     }
    },
    {
     "line": 33,
     "words": 28,
     "sentences": 4,
     "first_sentence": "I. What was the \"nature and purpose\" of your use?",
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
      "lexical_overlap": 0.063,
      "linked": false,
      "same_section": true
     }
    },
    {
     "line": 35,
     "words": 24,
     "sentences": 3,
     "first_sentence": "II.",
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
      "lexical_overlap": 0.1,
      "linked": true,
      "same_section": true
     }
    },
    {
     "line": 37,
     "words": 27,
     "sentences": 3,
     "first_sentence": "III.",
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
     "line": 39,
     "words": 22,
     "sentences": 3,
     "first_sentence": "IV.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 0,
      "connective": 1,
      "numeric": 0,
      "citation": 0,
      "total": 1,
      "per_100_words": 4.545
     },
     "transition_in": {
      "marker": null,
      "kind": null,
      "lexical_overlap": 0.053,
      "linked": false,
      "same_section": true
     }
    },
    {
     "line": 43,
     "words": 66,
     "sentences": 4,
     "first_sentence": "These questions are indeed enshrined in US copyright law, but (for better and for worse) you can't figure out if a use is \"fair\" just by asking these questions.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 3,
      "connective": 0,
      "numeric": 0,
      "citation": 0,
      "total": 3,
      "per_100_words": 4.545
     },
     "transition_in": {
      "marker": "these",
      "kind": "demonstrative",
      "lexical_overlap": 0.108,
      "linked": true,
      "same_section": true
     }
    },
    {
     "line": 45,
     "words": 58,
     "sentences": 2,
     "first_sentence": "For example, the author of a book called The Wind Done Gone was sued for taking the characters, plot and setting of Gone With the Wind in order to tell the same story from the perspective of the enslaved Africans who were denied agency and moral consideration in the original.",
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
      "marker": "for example",
      "kind": "example",
      "lexical_overlap": 0,
      "linked": true,
      "same_section": true
     }
    },
    {
     "line": 49,
     "words": 92,
     "sentences": 3,
     "first_sentence": "Wind Done Gone took the \"heart\" of Gone With the Wind (III), but then again, Done Gone was highly transformative (I), Gone With was also a work of fiction, entitled to the highest level of protection (II).",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 0,
      "connective": 1,
      "numeric": 0,
      "citation": 0,
      "total": 1,
      "per_100_words": 1.087
     },
     "transition_in": {
      "marker": null,
      "kind": null,
      "lexical_overlap": 0.068,
      "linked": false,
      "same_section": true
     }
    },
    {
     "line": 53,
     "words": 85,
     "sentences": 3,
     "first_sentence": "But even after you've acquired an appreciation of the fact-intensive, nuanced flexibility of fair use, you still don't understand copyright's limitations and exceptions.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 1,
      "connective": 0,
      "numeric": 0,
      "citation": 0,
      "total": 1,
      "per_100_words": 1.176
     },
     "transition_in": {
      "marker": "but",
      "kind": "contrast",
      "lexical_overlap": 0.057,
      "linked": true,
      "same_section": true
     }
    },
    {
     "line": 57,
     "words": 57,
     "sentences": 2,
     "first_sentence": "When it comes to copyright's limitations and exceptions, \"fair use\" and \"first sale\" are the big ones, but just as important are the small ones – the really small ones.",
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
      "lexical_overlap": 0.127,
      "linked": true,
      "same_section": true
     }
    },
    {
     "line": 61,
     "words": 99,
     "sentences": 5,
     "first_sentence": "Technically, it may be trespassing to step on someone else's yard.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 0,
      "connective": 1,
      "numeric": 0,
      "citation": 0,
      "total": 1,
      "per_100_words": 1.01
     },
     "transition_in": {
      "marker": null,
      "kind": null,
      "lexical_overlap": 0.18,
      "linked": true,
      "same_section": true
     }
    },
    {
     "line": 63,
     "words": 47,
     "sentences": 3,
     "first_sentence": "These limitations and exceptions all apply without permission from rightsholders.",
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
      "marker": "these",
      "kind": "demonstrative",
      "lexical_overlap": 0.032,
      "linked": true,
      "same_section": true
     }
    },
    {
     "line": 65,
     "words": 48,
     "sentences": 3,
     "first_sentence": "And that's where the esoteric early Creative Commons copyright debate comes in.",
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
      "lexical_overlap": 0.071,
      "linked": true,
      "same_section": true
     }
    },
    {
     "line": 67,
     "words": 117,
     "sentences": 4,
     "first_sentence": "If I want to let you adapt one of my short stories for the stage, we should both probably hire copyright lawyers at several hundred dollars per hour to draft and review a contract setting out what my permission really means.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 2,
      "connective": 1,
      "numeric": 0,
      "citation": 0,
      "total": 3,
      "per_100_words": 2.564
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
     "line": 69,
     "words": 78,
     "sentences": 3,
     "first_sentence": "Creative Commons cuts through this with its standardized licenses, which spell out in plain language which permissions are being granted.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 1,
      "connective": 0,
      "numeric": 0,
      "citation": 0,
      "total": 1,
      "per_100_words": 1.282
     },
     "transition_in": {
      "marker": null,
      "kind": null,
      "lexical_overlap": 0.057,
      "linked": false,
      "same_section": true
     }
    },
    {
     "line": 71,
     "words": 67,
     "sentences": 2,
     "first_sentence": "Those uses – turning a story into an animation, using a 3D model, syncing a soundtrack to a video – are all pretty ambitious uses, especially if you're going to make the final result indefinitely available to the general public.",
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
      "marker": "those",
      "kind": "demonstrative",
      "lexical_overlap": 0.095,
      "linked": true,
      "same_section": true
     }
    },
    {
     "line": 73,
     "words": 63,
     "sentences": 4,
     "first_sentence": "But there are plenty of uses that don't need licenses – even ambitious ones.",
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
      "marker": "but",
      "kind": "contrast",
      "lexical_overlap": 0.067,
      "linked": true,
      "same_section": true
     }
    },
    {
     "line": 75,
     "words": 62,
     "sentences": 3,
     "first_sentence": "These copyright flexibilities are critical.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 0,
      "connective": 1,
      "numeric": 0,
      "citation": 0,
      "total": 1,
      "per_100_words": 1.613
     },
     "transition_in": {
      "marker": "these",
      "kind": "demonstrative",
      "lexical_overlap": 0.059,
      "linked": true,
      "same_section": true
     }
    },
    {
     "line": 77,
     "words": 40,
     "sentences": 3,
     "first_sentence": "Today – 25 years later!- CC is an unqualified success.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 0,
      "connective": 0,
      "numeric": 1,
      "citation": 0,
      "total": 1,
      "per_100_words": 2.5
     },
     "transition_in": {
      "marker": null,
      "kind": null,
      "lexical_overlap": 0.023,
      "linked": false,
      "same_section": true
     }
    },
    {
     "line": 79,
     "words": 51,
     "sentences": 3,
     "first_sentence": "But, also, 25 years later, the world is even more convinced that you should always ask permission: \"better safe than sorry.\"",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 3,
      "connective": 0,
      "numeric": 1,
      "citation": 0,
      "total": 4,
      "per_100_words": 7.843
     },
     "transition_in": {
      "marker": "but",
      "kind": "contrast",
      "lexical_overlap": 0.071,
      "linked": true,
      "same_section": true
     }
    },
    {
     "line": 81,
     "words": 30,
     "sentences": 1,
     "first_sentence": "As the creator of more than 30 books, hundreds of collages, and tens of thousands of essays and blog-posts, I am often on the receiving end of these permission requests.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 0,
      "connective": 0,
      "numeric": 1,
      "citation": 0,
      "total": 1,
      "per_100_words": 3.333
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
     "line": 83,
     "words": 83,
     "sentences": 3,
     "first_sentence": "For example, people often ask me if they can use my CC licensed works in ways that the associated licenses clearly permit.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 1,
      "connective": 0,
      "numeric": 0,
      "citation": 0,
      "total": 1,
      "per_100_words": 1.205
     },
     "transition_in": {
      "marker": "for example",
      "kind": "example",
      "lexical_overlap": 0.043,
      "linked": true,
      "same_section": true
     }
    },
    {
     "line": 85,
     "words": 80,
     "sentences": 5,
     "first_sentence": "This is time-consuming work that often involves several volleys of email just to confirm that, no, they're just asking if they can do something I've already told them they can do.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 1,
      "connective": 0,
      "numeric": 0,
      "citation": 0,
      "total": 1,
      "per_100_words": 1.25
     },
     "transition_in": {
      "marker": "this",
      "kind": "demonstrative",
      "lexical_overlap": 0.127,
      "linked": true,
      "same_section": true
     }
    },
    {
     "line": 87,
     "words": 95,
     "sentences": 4,
     "first_sentence": "There are also a lot of requests that clearly amount to fair use and/or de minimis usage.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 1,
      "connective": 1,
      "numeric": 0,
      "citation": 0,
      "total": 2,
      "per_100_words": 2.105
     },
     "transition_in": {
      "marker": null,
      "kind": null,
      "lexical_overlap": 0.055,
      "linked": false,
      "same_section": true
     }
    },
    {
     "line": 89,
     "words": 43,
     "sentences": 1,
     "first_sentence": "Finally, there's the people who email me about their desire to make uses that are more (ahem) ambitious, but that no one could possibly find out about or get angry over…except for the fact that they emailed me to ask my permission.",
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
      "marker": "finally",
      "kind": "sequence",
      "lexical_overlap": 0.05,
      "linked": true,
      "same_section": true
     }
    },
    {
     "line": 91,
     "words": 72,
     "sentences": 2,
     "first_sentence": "You want to make a tiny bootleg edition of one of my novels for your anarchist book fair?",
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
      "lexical_overlap": 0.053,
      "linked": false,
      "same_section": true
     }
    },
    {
     "line": 93,
     "words": 78,
     "sentences": 4,
     "first_sentence": "But my publisher won't ever find out about it – unless you email me asking for permission.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 2,
      "connective": 1,
      "numeric": 0,
      "citation": 0,
      "total": 3,
      "per_100_words": 3.846
     },
     "transition_in": {
      "marker": "but",
      "kind": "contrast",
      "lexical_overlap": 0.094,
      "linked": true,
      "same_section": true
     }
    },
    {
     "line": 95,
     "words": 104,
     "sentences": 5,
     "first_sentence": "Buying a classroom set of books, but you also want to paste chunks of one of my books into your educational institution's classroom intranet for use as a teaching aid?",
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
      "lexical_overlap": 0.086,
      "linked": true,
      "same_section": true
     }
    },
    {
     "line": 97,
     "words": 56,
     "sentences": 3,
     "first_sentence": "Let's be clear: I'm not giving you permission to pirate my work.",
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
      "lexical_overlap": 0.027,
      "linked": false,
      "same_section": true
     }
    },
    {
     "line": 99,
     "words": 54,
     "sentences": 2,
     "first_sentence": "What I'm saying is, all of your interactions with copyrighted works need not involve the author and publisher.",
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
      "lexical_overlap": 0.018,
      "linked": false,
      "same_section": true
     }
    },
    {
     "line": 101,
     "words": 66,
     "sentences": 5,
     "first_sentence": "I get it.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 2,
      "connective": 0,
      "numeric": 0,
      "citation": 0,
      "total": 2,
      "per_100_words": 3.03
     },
     "transition_in": {
      "marker": null,
      "kind": null,
      "lexical_overlap": 0.111,
      "linked": true,
      "same_section": true
     }
    },
    {
     "line": 103,
     "words": 61,
     "sentences": 3,
     "first_sentence": "This is one of those areas where I break with my friend, the wonderful John Hodgman.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 1,
      "connective": 0,
      "numeric": 0,
      "citation": 0,
      "total": 1,
      "per_100_words": 1.639
     },
     "transition_in": {
      "marker": "this",
      "kind": "demonstrative",
      "lexical_overlap": 0,
      "linked": true,
      "same_section": true
     }
    },
    {
     "line": 107,
     "words": 117,
     "sentences": 4,
     "first_sentence": "John says you should always ask the cashier.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 2,
      "connective": 0,
      "numeric": 1,
      "citation": 0,
      "total": 3,
      "per_100_words": 2.564
     },
     "transition_in": {
      "marker": null,
      "kind": null,
      "lexical_overlap": 0.068,
      "linked": false,
      "same_section": true
     }
    },
    {
     "line": 109,
     "words": 112,
     "sentences": 3,
     "first_sentence": "There's a lot of normal, perfectly fine stuff that technically violates copyright that I can't give you permission to do, because I've signed a contract with my publisher.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 2,
      "connective": 2,
      "numeric": 0,
      "citation": 0,
      "total": 4,
      "per_100_words": 3.571
     },
     "transition_in": {
      "marker": null,
      "kind": null,
      "lexical_overlap": 0.02,
      "linked": false,
      "same_section": true
     }
    },
    {
     "line": 111,
     "words": 40,
     "sentences": 3,
     "first_sentence": "Are there instances in which you might misjudge which category your use falls under and end up in court?",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 0,
      "connective": 2,
      "numeric": 0,
      "citation": 0,
      "total": 2,
      "per_100_words": 5
     },
     "transition_in": {
      "marker": null,
      "kind": null,
      "lexical_overlap": 0.03,
      "linked": false,
      "same_section": true
     }
    },
    {
     "line": 113,
     "words": 3,
     "sentences": 1,
     "first_sentence": "Life is hard.",
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
     "line": 115,
     "words": 2,
     "sentences": 1,
     "first_sentence": "Read books.",
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
     "line": 117,
     "words": 5,
     "sentences": 1,
     "first_sentence": "Hey look at this (permalink)",
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
     "line": 119,
     "words": 5,
     "sentences": 1,
     "first_sentence": "AOC Must Run For President",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 1,
      "connective": 0,
      "numeric": 0,
      "citation": 0,
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
     "line": 121,
     "words": 9,
     "sentences": 1,
     "first_sentence": "Role confusion: one more reason we can’t trust LLMs",
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
     "line": 123,
     "words": 8,
     "sentences": 1,
     "first_sentence": "Ida Tarbell: The Journalist Who Took Down Rockefeller",
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
     "line": 125,
     "words": 4,
     "sentences": 1,
     "first_sentence": "Medusa Joins the Club",
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
     "line": 127,
     "words": 6,
     "sentences": 1,
     "first_sentence": "Hot Centrist Summer Was a Bust",
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
     "words": 3,
     "sentences": 1,
     "first_sentence": "Object permanence (permalink)",
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
     "line": 131,
     "words": 4,
     "sentences": 1,
     "first_sentence": "#25yrsago RIP, Poul Anderson",
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
     "line": 133,
     "words": 6,
     "sentences": 1,
     "first_sentence": "#25yrsago Talking P2P at PC Forum",
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
      "lexical_overlap": 0.143,
      "linked": true,
      "same_section": true
     }
    },
    {
     "line": 135,
     "words": 7,
     "sentences": 1,
     "first_sentence": "#25yrsago CD DRM cracked in 2 weeks",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 0,
      "connective": 0,
      "numeric": 1,
      "citation": 0,
      "total": 1,
      "per_100_words": 14.286
     },
     "transition_in": {
      "marker": null,
      "kind": null,
      "lexical_overlap": 0.143,
      "linked": true,
      "same_section": true
     }
    },
    {
     "line": 137,
     "words": 10,
     "sentences": 1,
     "first_sentence": "#20yrsago Waitress cards drinker, is handed her own stolen ID",
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
     "line": 139,
     "words": 11,
     "sentences": 1,
     "first_sentence": "#20yrsago How POWs in a Nazi camp got a Disney insignia",
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
      "lexical_overlap": 0.083,
      "linked": true,
      "same_section": true
     }
    },
    {
     "line": 141,
     "words": 5,
     "sentences": 1,
     "first_sentence": "#20yrsago Fixies illegal in Portland",
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
      "lexical_overlap": 0.1,
      "linked": true,
      "same_section": true
     }
    },
    {
     "line": 143,
     "words": 20,
     "sentences": 1,
     "first_sentence": "#15yrsago Freedom of Information requests show that UK copyright consultation was a stitch-up; Internet disconnection rules are a foregone conclusion",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 1,
      "connective": 0,
      "numeric": 0,
      "citation": 0,
      "total": 1,
      "per_100_words": 5
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
     "line": 145,
     "words": 9,
     "sentences": 1,
     "first_sentence": "#15yrsago What Murdoch’s media empire did: the big picture",
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
      "lexical_overlap": 0.053,
      "linked": false,
      "same_section": true
     }
    },
    {
     "line": 147,
     "words": 11,
     "sentences": 1,
     "first_sentence": "#15yrsago Flowchart shows the complexity of NZ Internet Disconnection copyright law",
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
      "lexical_overlap": 0.071,
      "linked": false,
      "same_section": true
     }
    },
    {
     "line": 149,
     "words": 12,
     "sentences": 1,
     "first_sentence": "#15yrsago Married lesbian couple rescued 40 teenagers from drowning during Utøya shooting",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 0,
      "connective": 0,
      "numeric": 1,
      "citation": 0,
      "total": 1,
      "per_100_words": 8.333
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
     "line": 151,
     "words": 13,
     "sentences": 1,
     "first_sentence": "#15yrsago Stephen Fry debating Ann Widdecombe on the worth of the Catholic Church",
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
      "lexical_overlap": 0.059,
      "linked": false,
      "same_section": true
     }
    },
    {
     "line": 153,
     "words": 15,
     "sentences": 1,
     "first_sentence": "#10yrsago Jacksonville police pension fund blows $1.8M worth of tax-dollars fighting open records requests",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 0,
      "connective": 0,
      "numeric": 1,
      "citation": 0,
      "total": 1,
      "per_100_words": 6.667
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
     "line": 155,
     "words": 16,
     "sentences": 1,
     "first_sentence": "#10yrsago A profile of Moxie Marlinspike: the seagoing anarchist cryptographer who brought private messaging to millions",
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
      "lexical_overlap": 0.045,
      "linked": false,
      "same_section": true
     }
    },
    {
     "line": 157,
     "words": 15,
     "sentences": 1,
     "first_sentence": "#10yrsago Burying the past in glass coffins: Victoria & Albert museum bans sketching in temporary exhibitions",
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
      "lexical_overlap": 0.045,
      "linked": false,
      "same_section": true
     }
    },
    {
     "line": 159,
     "words": 12,
     "sentences": 1,
     "first_sentence": "#10yrsago Hugo Gernsback’s introduction to the first issue of Amazing Stories, 1926",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 0,
      "connective": 0,
      "numeric": 1,
      "citation": 0,
      "total": 1,
      "per_100_words": 8.333
     },
     "transition_in": {
      "marker": null,
      "kind": null,
      "lexical_overlap": 0.053,
      "linked": false,
      "same_section": true
     }
    },
    {
     "line": 161,
     "words": 12,
     "sentences": 1,
     "first_sentence": "#10yrsago Afterbrexit: Scotland trolls Theresa May by passing laws she has ridiculed",
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
      "lexical_overlap": 0.059,
      "linked": false,
      "same_section": true
     }
    },
    {
     "line": 163,
     "words": 4,
     "sentences": 1,
     "first_sentence": "#5yrsago Managing aggregate demand",
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
     "line": 165,
     "words": 4,
     "sentences": 1,
     "first_sentence": "#1yrago Mattie Lubchansky's 'Simplicity'",
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
     "line": 167,
     "words": 3,
     "sentences": 1,
     "first_sentence": "Upcoming appearances (permalink)",
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
     "line": 169,
     "words": 9,
     "sentences": 1,
     "first_sentence": "Virtual: EFFecting Change: Who the Machine Serves, Aug 12",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 0,
      "connective": 0,
      "numeric": 1,
      "citation": 0,
      "total": 1,
      "per_100_words": 11.111
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
     "line": 173,
     "words": 9,
     "sentences": 1,
     "first_sentence": "Edinburgh International Book Festival with Jimmy Wales, Aug 17",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 0,
      "connective": 0,
      "numeric": 1,
      "citation": 0,
      "total": 1,
      "per_100_words": 11.111
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
     "line": 177,
     "words": 8,
     "sentences": 1,
     "first_sentence": "Sydney: The Festival of Dangerous Ideas, Aug 23-24",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 0,
      "connective": 0,
      "numeric": 2,
      "citation": 0,
      "total": 2,
      "per_100_words": 25
     },
     "transition_in": {
      "marker": null,
      "kind": null,
      "lexical_overlap": 0.182,
      "linked": true,
      "same_section": true
     }
    },
    {
     "line": 181,
     "words": 8,
     "sentences": 1,
     "first_sentence": "Melbourne: Enshittification at the Wheeler Centre, Aug 25",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 0,
      "connective": 0,
      "numeric": 1,
      "citation": 0,
      "total": 1,
      "per_100_words": 12.5
     },
     "transition_in": {
      "marker": null,
      "kind": null,
      "lexical_overlap": 0.1,
      "linked": true,
      "same_section": true
     }
    },
    {
     "line": 185,
     "words": 16,
     "sentences": 1,
     "first_sentence": "Brighton: The Reverse Centaur's Guide to Life After AI with Carole Cadwalladr (Brighton Dome), Sep 8",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 0,
      "connective": 0,
      "numeric": 1,
      "citation": 0,
      "total": 1,
      "per_100_words": 6.25
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
     "line": 189,
     "words": 16,
     "sentences": 1,
     "first_sentence": "London: The Reverse Centaur's Guide to Life After AI with Riley Quinn (Foyle's Picadilly), Sep 9",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 0,
      "connective": 0,
      "numeric": 1,
      "citation": 0,
      "total": 1,
      "per_100_words": 6.25
     },
     "transition_in": {
      "marker": null,
      "kind": null,
      "lexical_overlap": 0.357,
      "linked": true,
      "same_section": true
     }
    },
    {
     "line": 193,
     "words": 11,
     "sentences": 1,
     "first_sentence": "South Bend: An Evening With Cory Doctorow (Notre Dame), Oct 6",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 0,
      "connective": 0,
      "numeric": 1,
      "citation": 0,
      "total": 1,
      "per_100_words": 9.091
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
     "line": 197,
     "words": 3,
     "sentences": 1,
     "first_sentence": "Recent appearances (permalink)",
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
     "line": 199,
     "words": 12,
     "sentences": 1,
     "first_sentence": "Why AI Won't Replace Workers, But Will Crash The Economy (Smart Cookies)",
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
     "line": 203,
     "words": 11,
     "sentences": 1,
     "first_sentence": "AI and the Enshittification Era (The Weekly Show with Jon Stewart)",
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
      "lexical_overlap": 0,
      "linked": false,
      "same_section": true
     }
    },
    {
     "line": 207,
     "words": 5,
     "sentences": 1,
     "first_sentence": "AI is not inevitable (Betakit)",
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
     "line": 211,
     "words": 10,
     "sentences": 1,
     "first_sentence": "A Conversation with Lina Khan (Law and Economy Student Network)",
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
     "line": 215,
     "words": 13,
     "sentences": 2,
     "first_sentence": "Will AI ever come alive, and what happens if it does?",
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
     "line": 219,
     "words": 3,
     "sentences": 1,
     "first_sentence": "Latest books (permalink)",
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
     "line": 221,
     "words": 20,
     "sentences": 1,
     "first_sentence": "\"The Reverse-Centaur's Guide to AI,\" a short book about being a better AI critic, Farrar, Straus and Giroux, June 2026",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 0,
      "connective": 0,
      "numeric": 1,
      "citation": 0,
      "total": 1,
      "per_100_words": 5
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
     "line": 225,
     "words": 16,
     "sentences": 1,
     "first_sentence": "\"Canny Valley\": A limited edition collection of the collages I create for Pluralistic, self-published, September 2025",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 0,
      "connective": 0,
      "numeric": 1,
      "citation": 0,
      "total": 1,
      "per_100_words": 6.25
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
     "line": 227,
     "words": 18,
     "sentences": 1,
     "first_sentence": "\"Enshittification: Why Everything Suddenly Got Worse and What to Do About It,\" Farrar, Straus, Giroux, October 7 2025",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 0,
      "connective": 0,
      "numeric": 1,
      "citation": 0,
      "total": 1,
      "per_100_words": 5.556
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
     "line": 231,
     "words": 25,
     "sentences": 1,
     "first_sentence": "\"Picks and Shovels\": a sequel to \"Red Team Blues,\" about the heroic era of the PC, Tor Books (US), Head of Zeus (UK), February 2025 (",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 0,
      "connective": 0,
      "numeric": 1,
      "citation": 0,
      "total": 1,
      "per_100_words": 4
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
     "line": 233,
     "words": 24,
     "sentences": 1,
     "first_sentence": "\"The Bezzle\": a sequel to \"Red Team Blues,\" about prison-tech and other grifts, Tor Books (US), Head of Zeus (UK), February 2024 (thebezzle.org).",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 0,
      "connective": 0,
      "numeric": 1,
      "citation": 0,
      "total": 1,
      "per_100_words": 4.167
     },
     "transition_in": {
      "marker": null,
      "kind": null,
      "lexical_overlap": 0.476,
      "linked": true,
      "same_section": true
     }
    },
    {
     "line": 235,
     "words": 21,
     "sentences": 1,
     "first_sentence": "\"The Lost Cause:\" a solarpunk novel of hope in the climate emergency, Tor Books (US), Head of Zeus (UK), November 2023 (",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 0,
      "connective": 0,
      "numeric": 1,
      "citation": 0,
      "total": 1,
      "per_100_words": 4.762
     },
     "transition_in": {
      "marker": null,
      "kind": null,
      "lexical_overlap": 0.16,
      "linked": true,
      "same_section": true
     }
    },
    {
     "line": 237,
     "words": 19,
     "sentences": 1,
     "first_sentence": "\"The Internet Con\": A nonfiction book about interoperability and Big Tech (Verso) September 2023 ( Signed copies at Book Soup (",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 0,
      "connective": 0,
      "numeric": 1,
      "citation": 0,
      "total": 1,
      "per_100_words": 5.263
     },
     "transition_in": {
      "marker": null,
      "kind": null,
      "lexical_overlap": 0.038,
      "linked": false,
      "same_section": true
     }
    },
    {
     "line": 239,
     "words": 24,
     "sentences": 2,
     "first_sentence": "\"Red Team Blues\": \"A grabby, compulsive thriller that will leave you knowing more about how the world works than you did before.\"",
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
      "lexical_overlap": 0.037,
      "linked": false,
      "same_section": true
     }
    },
    {
     "line": 241,
     "words": 30,
     "sentences": 1,
     "first_sentence": "\"Chokepoint Capitalism: How to Beat Big Tech, Tame Big Content, and Get Artists Paid, with Rebecca Giblin\", on how to unrig the markets for creative labor, Beacon Press/Scribe 2022",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 0,
      "connective": 0,
      "numeric": 1,
      "citation": 0,
      "total": 1,
      "per_100_words": 3.333
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
     "line": 243,
     "words": 3,
     "sentences": 1,
     "first_sentence": "Upcoming books (permalink)",
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
     "line": 245,
     "words": 15,
     "sentences": 1,
     "first_sentence": "\"The Post-American Internet,\" a geopolitical sequel of sorts to Enshittification, Farrar, Straus and Giroux, 2027",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 0,
      "connective": 0,
      "numeric": 1,
      "citation": 0,
      "total": 1,
      "per_100_words": 6.667
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
     "line": 247,
     "words": 19,
     "sentences": 1,
     "first_sentence": "\"Unauthorized Bread\": a middle-grades graphic novel adapted from my novella about refugees, toasters and DRM, FirstSecond, April 20, 2027",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 0,
      "connective": 0,
      "numeric": 1,
      "citation": 0,
      "total": 1,
      "per_100_words": 5.263
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
     "line": 249,
     "words": 17,
     "sentences": 1,
     "first_sentence": "\"Enshittification, Why Everything Suddenly Got Worse and What to Do About It\" (the graphic novel), Firstsecond, 2027",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 0,
      "connective": 0,
      "numeric": 1,
      "citation": 0,
      "total": 1,
      "per_100_words": 5.882
     },
     "transition_in": {
      "marker": null,
      "kind": null,
      "lexical_overlap": 0.263,
      "linked": true,
      "same_section": true
     }
    },
    {
     "line": 251,
     "words": 7,
     "sentences": 1,
     "first_sentence": "\"The Memex Method,\" Farrar, Straus, Giroux, 2027",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 0,
      "connective": 0,
      "numeric": 1,
      "citation": 0,
      "total": 1,
      "per_100_words": 14.286
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
     "line": 253,
     "words": 2,
     "sentences": 1,
     "first_sentence": "Colophon (permalink)",
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
     "line": 255,
     "words": 3,
     "sentences": 1,
     "first_sentence": "Today's top sources:",
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
     "line": 257,
     "words": 32,
     "sentences": 3,
     "first_sentence": "Currently writing: \"The Post-American Internet,\" a sequel to \"Enshittification,\" about the better world the rest of us get to have now that Trump has torched America.",
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
     "line": 259,
     "words": 9,
     "sentences": 1,
     "first_sentence": "A Little Brother short story about DIY insulin PLANNING",
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
      "lexical_overlap": 0.037,
      "linked": false,
      "same_section": true
     }
    }
   ],
   "words": 3307,
   "paragraph_count": 109,
   "start_line": 1,
   "end_line": 259,
   "claim_markers": 70,
   "claim_markers_per_100_words": 2.117,
   "ratio_to_median": 1
  }
 ],
 "balance": {
  "sections": 1,
  "median_words": 3307,
  "max_ratio": 1,
  "min_ratio": 1
 },
 "transitions": {
  "boundaries": 108,
  "marked": 35,
  "unmarked": [
   {
    "line": 3,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 5,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 7,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 9,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 13,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 17,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 19,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 21,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 25,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 31,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 33,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 37,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 39,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 49,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 67,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 69,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 77,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 81,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 87,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 91,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 97,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 99,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 107,
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
    "line": 113,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 115,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 117,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 119,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 121,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 123,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 125,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 127,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 129,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 131,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 137,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 143,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 145,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 147,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 149,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 151,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 153,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 155,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 157,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 159,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 161,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 163,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 165,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 167,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 169,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 185,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 193,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 197,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 199,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 203,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 207,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 211,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 215,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 219,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 221,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 225,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 227,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 237,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 239,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 241,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 243,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 245,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 247,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 251,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 253,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 255,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 257,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 259,
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

    bundles/prose-review/tests/runs/2026-11-09-structure/inputs/case-13/draft.md

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
