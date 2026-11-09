# Critic run — case-18

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
 "words": 3398,
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
     "words": 9,
     "sentences": 1,
     "first_sentence": "Apple's robo-repo: Privatizing the risk premium, socializing its costs.",
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
     "words": 35,
     "sentences": 1,
     "first_sentence": "Object permanence: Printed batteries; Monopoly credit cards; Mapping airport power outlets; EMI loves pirates; Mexican indigenous phone co-op; Sewer cover textiles; Surge pricing v antitrust; Carbon offsets v forest fires; Charter schools as money laundries.",
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
     "words": 3,
     "sentences": 1,
     "first_sentence": "Apple's robo-repo (permalink)",
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
     "words": 63,
     "sentences": 2,
     "first_sentence": "It may strike you as weird, but lenders love to lend money to poor people who will have trouble paying back their loans.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 3,
      "connective": 0,
      "numeric": 0,
      "citation": 0,
      "total": 3,
      "per_100_words": 4.762
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
     "line": 23,
     "words": 57,
     "sentences": 3,
     "first_sentence": "In other words: because poor people have a higher likelihood of defaulting, their loans come with higher interest rates and worse terms.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 0,
      "connective": 1,
      "numeric": 0,
      "citation": 0,
      "total": 1,
      "per_100_words": 1.754
     },
     "transition_in": {
      "marker": null,
      "kind": null,
      "lexical_overlap": 0.14,
      "linked": true,
      "same_section": true
     }
    },
    {
     "line": 25,
     "words": 48,
     "sentences": 2,
     "first_sentence": "Lenders are always seeking the highest possible return on their loan-books, which makes that \"risk premium\" awfully tempting.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 1,
      "connective": 0,
      "numeric": 4,
      "citation": 0,
      "total": 5,
      "per_100_words": 10.417
     },
     "transition_in": {
      "marker": null,
      "kind": null,
      "lexical_overlap": 0.098,
      "linked": true,
      "same_section": true
     }
    },
    {
     "line": 27,
     "words": 112,
     "sentences": 5,
     "first_sentence": "Obviously, the fly in the ointment here is the risk in \"risk premium.\"",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 1,
      "connective": 0,
      "numeric": 0,
      "citation": 0,
      "total": 1,
      "per_100_words": 0.893
     },
     "transition_in": {
      "marker": null,
      "kind": null,
      "lexical_overlap": 0.058,
      "linked": false,
      "same_section": true
     }
    },
    {
     "line": 29,
     "words": 46,
     "sentences": 3,
     "first_sentence": "That's where Klarna makes its money: people who miss their burrito installment payments.",
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
      "lexical_overlap": 0.092,
      "linked": true,
      "same_section": true
     }
    },
    {
     "line": 31,
     "words": 86,
     "sentences": 3,
     "first_sentence": "\"Financial innovation\" is often just a project to decrease the risk in risky loans, but without decreasing the risk premium you get paid for issuing those loans.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 0,
      "connective": 1,
      "numeric": 0,
      "citation": 0,
      "total": 1,
      "per_100_words": 1.163
     },
     "transition_in": {
      "marker": null,
      "kind": null,
      "lexical_overlap": 0.017,
      "linked": false,
      "same_section": true
     }
    },
    {
     "line": 33,
     "words": 107,
     "sentences": 4,
     "first_sentence": "Remember the subprime crisis?",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 1,
      "connective": 1,
      "numeric": 0,
      "citation": 1,
      "total": 3,
      "per_100_words": 2.804
     },
     "transition_in": {
      "marker": null,
      "kind": null,
      "lexical_overlap": 0.047,
      "linked": false,
      "same_section": true
     }
    },
    {
     "line": 35,
     "words": 75,
     "sentences": 3,
     "first_sentence": "Those subprime mortgages came with cheap \"teaser rates\" – the interest rate you paid over the first couple years – but then the interest payments \"ballooned\" to farcical sums that borrowers had no hope of repaying.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 0,
      "connective": 0,
      "numeric": 3,
      "citation": 0,
      "total": 3,
      "per_100_words": 4
     },
     "transition_in": {
      "marker": "those",
      "kind": "demonstrative",
      "lexical_overlap": 0.073,
      "linked": true,
      "same_section": true
     }
    },
    {
     "line": 37,
     "words": 65,
     "sentences": 3,
     "first_sentence": "But it wasn't all financial engineering: subprime mortgage salesmen could also promise customers that they wouldn't lose everything even after a wave of borrower bankruptcies and defaults.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 0,
      "connective": 1,
      "numeric": 0,
      "citation": 0,
      "total": 1,
      "per_100_words": 1.538
     },
     "transition_in": {
      "marker": "but",
      "kind": "contrast",
      "lexical_overlap": 0.079,
      "linked": true,
      "same_section": true
     }
    },
    {
     "line": 39,
     "words": 59,
     "sentences": 2,
     "first_sentence": "Now, the finance sector did repossess a fuckton of houses after the crash.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 0,
      "connective": 2,
      "numeric": 0,
      "citation": 0,
      "total": 2,
      "per_100_words": 3.39
     },
     "transition_in": {
      "marker": "now",
      "kind": "sequence",
      "lexical_overlap": 0.065,
      "linked": true,
      "same_section": true
     }
    },
    {
     "line": 43,
     "words": 54,
     "sentences": 2,
     "first_sentence": "But even with these foreclosures, lenders and their customers lost hundreds of billions on the subprime crisis.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 0,
      "connective": 2,
      "numeric": 0,
      "citation": 0,
      "total": 2,
      "per_100_words": 3.704
     },
     "transition_in": {
      "marker": "but",
      "kind": "contrast",
      "lexical_overlap": 0.074,
      "linked": true,
      "same_section": true
     }
    },
    {
     "line": 45,
     "words": 100,
     "sentences": 4,
     "first_sentence": "Collateralization – backing loans with legally binding promises to surrender some asset if you default – is a way to reduce risk, but it can't eliminate it.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 1,
      "connective": 1,
      "numeric": 2,
      "citation": 0,
      "total": 4,
      "per_100_words": 4
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
     "line": 47,
     "words": 60,
     "sentences": 3,
     "first_sentence": "The point being that risk mitigation is never risk elimination, but markets have a hard time distinguishing between the two.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 1,
      "connective": 2,
      "numeric": 0,
      "citation": 0,
      "total": 3,
      "per_100_words": 5
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
     "line": 49,
     "words": 53,
     "sentences": 2,
     "first_sentence": "So many of our crises come from the intersection of these two phenomena: the promise of reducing loan risks without losing the risk premium and the fact that risk reduction can fail suddenly (or be revealed as nothing more than risk-shifting).",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 0,
      "connective": 1,
      "numeric": 0,
      "citation": 0,
      "total": 1,
      "per_100_words": 1.887
     },
     "transition_in": {
      "marker": "so",
      "kind": "consequence",
      "lexical_overlap": 0.02,
      "linked": true,
      "same_section": true
     }
    },
    {
     "line": 51,
     "words": 47,
     "sentences": 2,
     "first_sentence": "This leaves would-be usurers on an endless quest for new ways to lend money at a premium to poor people while reducing their own risk.",
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
      "marker": "this",
      "kind": "demonstrative",
      "lexical_overlap": 0.067,
      "linked": true,
      "same_section": true
     }
    },
    {
     "line": 53,
     "words": 69,
     "sentences": 2,
     "first_sentence": "When the US government adopted the racist practice of \"redlining\" (denying government-backed loans to Black borrowers), they created a market for predatory pseudo-mortgages called \"contract buying.\"",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 0,
      "connective": 0,
      "numeric": 1,
      "citation": 0,
      "total": 1,
      "per_100_words": 1.449
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
     "line": 55,
     "words": 50,
     "sentences": 2,
     "first_sentence": "Lenders can tip the scales in their favor by making up arbitrary junk fees, and a smart lender waits until the house is almost paid off before whacking the borrower with a ton of these fees.",
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
      "lexical_overlap": 0.073,
      "linked": false,
      "same_section": true
     }
    },
    {
     "line": 59,
     "words": 110,
     "sentences": 5,
     "first_sentence": "Contract lending never went away.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 1,
      "connective": 0,
      "numeric": 1,
      "citation": 0,
      "total": 2,
      "per_100_words": 1.818
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
     "line": 61,
     "words": 90,
     "sentences": 4,
     "first_sentence": "But the exploitation of truckers doesn't stop with mere wage theft.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 0,
      "connective": 1,
      "numeric": 0,
      "citation": 0,
      "total": 1,
      "per_100_words": 1.111
     },
     "transition_in": {
      "marker": "but",
      "kind": "contrast",
      "lexical_overlap": 0.069,
      "linked": true,
      "same_section": true
     }
    },
    {
     "line": 65,
     "words": 86,
     "sentences": 3,
     "first_sentence": "Subprime auto-loans bring this same profitable arrangement to regular drivers who just need a car to commute, pick up groceries, and shuttle the kids to and from school.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 1,
      "connective": 0,
      "numeric": 0,
      "citation": 0,
      "total": 1,
      "per_100_words": 1.163
     },
     "transition_in": {
      "marker": null,
      "kind": null,
      "lexical_overlap": 0.025,
      "linked": false,
      "same_section": true
     }
    },
    {
     "line": 69,
     "words": 87,
     "sentences": 4,
     "first_sentence": "But the subprime car industry puts a decidedly modern spin on the contract lending scam that has been used to profitably rob so many Black home borrowers and long-haul truckers.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 0,
      "connective": 1,
      "numeric": 0,
      "citation": 0,
      "total": 1,
      "per_100_words": 1.149
     },
     "transition_in": {
      "marker": "but",
      "kind": "contrast",
      "lexical_overlap": 0.038,
      "linked": true,
      "same_section": true
     }
    },
    {
     "line": 71,
     "words": 115,
     "sentences": 5,
     "first_sentence": "This is where tech comes in.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 2,
      "connective": 2,
      "numeric": 0,
      "citation": 0,
      "total": 4,
      "per_100_words": 3.478
     },
     "transition_in": {
      "marker": "this",
      "kind": "demonstrative",
      "lexical_overlap": 0.087,
      "linked": true,
      "same_section": true
     }
    },
    {
     "line": 73,
     "words": 113,
     "sentences": 4,
     "first_sentence": "The next wave of automotive usury-tech was a kind of systematic exploration of the entire space between a car that is repossessed and a car that isn't. Some subprime cars are fitted with an extra stereo system that can only be controlled by the lender over a wireless connection.",
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
      "lexical_overlap": 0.058,
      "linked": false,
      "same_section": true
     }
    },
    {
     "line": 77,
     "words": 58,
     "sentences": 3,
     "first_sentence": "But the apex of this usury-tech comes from (where else?)",
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
      "lexical_overlap": 0.097,
      "linked": true,
      "same_section": true
     }
    },
    {
     "line": 81,
     "words": 45,
     "sentences": 2,
     "first_sentence": "The cheaper the repo, the riskier the loan can be; the riskier the loan, the higher the risk premium.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 0,
      "connective": 1,
      "numeric": 0,
      "citation": 0,
      "total": 1,
      "per_100_words": 2.222
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
     "line": 83,
     "words": 56,
     "sentences": 3,
     "first_sentence": "There's India's subprime phone lenders, who pre-install usury-tech on their phones.",
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
     "line": 87,
     "words": 57,
     "sentences": 3,
     "first_sentence": "It's the digital version of the mob loan-shark who breaks a finger, then your hand, then your arm.",
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
     "line": 89,
     "words": 94,
     "sentences": 6,
     "first_sentence": "Digital arm-breakers aren't an epiphenomenon of digitization alone.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 1,
      "connective": 0,
      "numeric": 0,
      "citation": 0,
      "total": 1,
      "per_100_words": 1.064
     },
     "transition_in": {
      "marker": null,
      "kind": null,
      "lexical_overlap": 0.014,
      "linked": false,
      "same_section": true
     }
    },
    {
     "line": 91,
     "words": 117,
     "sentences": 7,
     "first_sentence": "That's where the law comes in.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 1,
      "connective": 2,
      "numeric": 4,
      "citation": 0,
      "total": 7,
      "per_100_words": 5.983
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
     "line": 93,
     "words": 24,
     "sentences": 1,
     "first_sentence": "DMCA 1201 is the reason you can't neutralize the digital arm-breakers by deleting or blocking the usury-tech in your car, phone or other device:",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 1,
      "connective": 0,
      "numeric": 1,
      "citation": 0,
      "total": 2,
      "per_100_words": 8.333
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
     "line": 97,
     "words": 87,
     "sentences": 4,
     "first_sentence": "Here's where it gets interesting.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 0,
      "connective": 1,
      "numeric": 2,
      "citation": 0,
      "total": 3,
      "per_100_words": 3.448
     },
     "transition_in": {
      "marker": null,
      "kind": null,
      "lexical_overlap": 0.074,
      "linked": false,
      "same_section": true
     }
    },
    {
     "line": 101,
     "words": 49,
     "sentences": 1,
     "first_sentence": "And Apple says the reason it blocks you from installing apps without using its App Store is to protect you from malicious apps – not to control the app marketplace, where it makes $100b/year on payment processing junk-fees, siphoning off 30% of every dollar you spend in an app:",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 0,
      "connective": 0,
      "numeric": 1,
      "citation": 0,
      "total": 1,
      "per_100_words": 2.041
     },
     "transition_in": {
      "marker": "and",
      "kind": "addition",
      "lexical_overlap": 0.061,
      "linked": true,
      "same_section": true
     }
    },
    {
     "line": 105,
     "words": 61,
     "sentences": 2,
     "first_sentence": "Apple's greatest accomplishment isn't technological, it's psychological.",
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
      "lexical_overlap": 0.055,
      "linked": false,
      "same_section": true
     }
    },
    {
     "line": 109,
     "words": 53,
     "sentences": 2,
     "first_sentence": "But moral behavior doesn't consist solely of resisting the temptation to do bad things – to be truly moral, you must not put yourself in temptation's path in the first place.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 1,
      "connective": 0,
      "numeric": 0,
      "citation": 0,
      "total": 1,
      "per_100_words": 1.887
     },
     "transition_in": {
      "marker": "but",
      "kind": "contrast",
      "lexical_overlap": 0.035,
      "linked": true,
      "same_section": true
     }
    },
    {
     "line": 113,
     "words": 39,
     "sentences": 2,
     "first_sentence": "By giving itself a veto over its customers' choices, Apple deliberately sailed into siren-infested waters, after first putting a gun on every mantelpiece it could find.",
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
     "words": 76,
     "sentences": 4,
     "first_sentence": "Today, the company is getting into the leasing business.",
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
     "line": 119,
     "words": 60,
     "sentences": 2,
     "first_sentence": "The code steals a trick from India's subprime phone lenders, giving Apple the ability to \"restrict apps and services when payments are missed.\"",
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
      "lexical_overlap": 0.028,
      "linked": false,
      "same_section": true
     }
    },
    {
     "line": 121,
     "words": 86,
     "sentences": 5,
     "first_sentence": "This was always the trajectory of Apple's decision to sell you a computer that takes orders from its manufacturer, rather than its owner.",
     "heading_overlap_sentence": null,
     "heading_overlap": 0,
     "claim_markers": {
      "assertive": 1,
      "connective": 0,
      "numeric": 0,
      "citation": 0,
      "total": 1,
      "per_100_words": 1.163
     },
     "transition_in": {
      "marker": "this",
      "kind": "demonstrative",
      "lexical_overlap": 0.076,
      "linked": true,
      "same_section": true
     }
    },
    {
     "line": 125,
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
     "line": 127,
     "words": 15,
     "sentences": 1,
     "first_sentence": "Public opinion on abortion has shifted 4 years after Dobbs decision overturned Roe v. Wade",
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
     "line": 129,
     "words": 5,
     "sentences": 1,
     "first_sentence": "Reading “Do Artifacts Have Politics?”",
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
     "words": 11,
     "sentences": 1,
     "first_sentence": "Google hit with $1 billion fine for breaking EU antitrust rules",
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
     "line": 133,
     "words": 5,
     "sentences": 1,
     "first_sentence": "Why Paramount Should Be Worried",
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
     "line": 135,
     "words": 7,
     "sentences": 1,
     "first_sentence": "The Plain Language Guide to Digital Privacy",
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
     "line": 137,
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
     "line": 139,
     "words": 4,
     "sentences": 1,
     "first_sentence": "#25yrsago Shapeable printed batteries",
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
     "line": 141,
     "words": 7,
     "sentences": 1,
     "first_sentence": "#20yrsago Monopoly replaces play-money with fake credit-cards",
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
     "line": 143,
     "words": 9,
     "sentences": 1,
     "first_sentence": "#20yrsago HOWTO build a fax out of salmon tins",
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
     "line": 145,
     "words": 6,
     "sentences": 1,
     "first_sentence": "#20yrsago Power outlets in airports wiki",
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
     "line": 147,
     "words": 12,
     "sentences": 1,
     "first_sentence": "#20yrsago How iTunes is bad for the music industry and the public",
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
     "line": 149,
     "words": 14,
     "sentences": 1,
     "first_sentence": "#15yrsago Ousted EMI boss: pirates are our best customers, suing is bad for business",
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
      "lexical_overlap": 0.067,
      "linked": false,
      "same_section": true
     }
    },
    {
     "line": 151,
     "words": 11,
     "sentences": 1,
     "first_sentence": "#15yrsago Patent trolls and shakedowns: Intellectual Ventures and the “little guy”",
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
     "line": 153,
     "words": 7,
     "sentences": 1,
     "first_sentence": "#10yrsago Textiles printed directly from sewer covers",
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
     "line": 155,
     "words": 12,
     "sentences": 1,
     "first_sentence": "#10yrsago Mexican indigenous groups form co-op phone company to serve 356 municipalities",
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
     "line": 157,
     "words": 6,
     "sentences": 1,
     "first_sentence": "#5yrsago Surge pricing violates antitrust law",
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
     "words": 8,
     "sentences": 1,
     "first_sentence": "#5yrsago Oregon's carbon offsets go up in smoke",
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
     "line": 161,
     "words": 6,
     "sentences": 1,
     "first_sentence": "#5yrsago Charter schools are money laundries",
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
      "lexical_overlap": 0.111,
      "linked": true,
      "same_section": true
     }
    },
    {
     "line": 163,
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
     "line": 165,
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
     "line": 169,
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
     "line": 173,
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
     "line": 177,
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
     "line": 181,
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
     "line": 185,
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
     "line": 189,
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
     "line": 193,
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
     "line": 195,
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
     "line": 199,
     "words": 9,
     "sentences": 1,
     "first_sentence": "Waarom jij straks het hulpje van AI bent (VPRO)",
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
     "words": 5,
     "sentences": 1,
     "first_sentence": "Talk Tech Bock (Vera Linß)",
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
     "line": 207,
     "words": 12,
     "sentences": 1,
     "first_sentence": "How To Think About AI Before It’s Too Late (This Is Hell)",
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
     "words": 9,
     "sentences": 1,
     "first_sentence": "AI Won't Replace You… But This Might (Deep Focus)",
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
     "line": 217,
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
     "line": 221,
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
     "line": 223,
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
     "line": 227,
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
     "line": 229,
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
     "line": 231,
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
     "line": 233,
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
     "line": 235,
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
     "line": 237,
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
     "line": 239,
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
     "line": 241,
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
     "line": 243,
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
     "line": 245,
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
     "line": 247,
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
     "line": 249,
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
     "line": 251,
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
     "line": 253,
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
     "line": 255,
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
   "words": 3398,
   "paragraph_count": 100,
   "start_line": 1,
   "end_line": 255,
   "claim_markers": 82,
   "claim_markers_per_100_words": 2.413,
   "ratio_to_median": 1
  }
 ],
 "balance": {
  "sections": 1,
  "median_words": 3398,
  "max_ratio": 1,
  "min_ratio": 1
 },
 "transitions": {
  "boundaries": 99,
  "marked": 31,
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
    "line": 27,
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
    "line": 45,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 47,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 53,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 55,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 59,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 65,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 73,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 81,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 83,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 87,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 89,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 91,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 93,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 97,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 105,
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
    "line": 119,
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
    "line": 133,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 135,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 137,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 139,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 141,
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
    "line": 181,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 189,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 193,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 195,
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
    "line": 217,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 221,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 223,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 233,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 235,
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
    "line": 247,
    "section": "(preamble)",
    "same_section": true
   },
   {
    "line": 249,
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

    bundles/prose-review/tests/runs/2026-11-09-structure/inputs/case-18/draft.md

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
