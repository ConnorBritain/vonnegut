I checked `draft.md` against the two files in `sources/` and every claim in `ledger.json`. I couldn't fully check two quotes, the draft misquotes one source, and two sentences have no ledger entry behind them.

**How I set it up.** The project has no research store, so I built a dossier in the scratchpad and didn't create a registry. Your `ledger.json` has no dossier saying which file is which source. I read `s1` as `mill-history.txt` and `s2` as `valley-guide.html`; if that's wrong, these results are wrong too. The checker also needs a header your `ledger.json` doesn't have, so it ran on a copy with one added. Your files are unchanged.

## Ledger quotes vs. sources
| Claim | Status | Detail |
|---|---|---|
| k1 | exact | |
| k2 | exact | "…carried up the valley on **two** carts" |
| k3 | **drifted** | ledger: "because the bread **could** not wait" · source (s1 line 6): "because the bread **would** not wait" |
| k4 | **drifted** | ledger: "**Take** the quarry path…" · source (s2 line 3): "**take** the quarry path…" (a capital letter counts as drift) |
| k5 | **absent** | cites source `s3`, and no file in `sources/` corresponds to it. The same words, "the stone ran out before the men did", appear in `valley-guide.html` line 4, but the ledger doesn't cite that file. |
| k6 | exact | found at line 10, but the ledger records line 40. The draft doesn't use this claim. |

## Draft vs. ledger
The checker only compares ledger quotes to sources, so I compared the draft's quotes myself:
- **Paragraph 1:** the draft quotes the parish record as "carried up the valley on **three** carts." The source and k2 both say "**two** carts."
- **Paragraph 2:** the draft's "would not wait" matches the source. The ledger's k3 ("could") is the one that differs.

## Unledgered sentences
- "The ledger for that winter records forty-one sacks, more than any winter before it." The source does record forty-one sacks (s1 line 7). I found nothing in either source matching "more than any winter before it."
- "Most valleys like this one lost their mills before the war."

## Links
Both sources are local files, so their links were `not-evaluated`. That means unchecked, not confirmed working.

Which sentences count as claims is my own judgement, mapped in `/tmp/claude-0/-tmp-claude-0--home-user-vonnegut-114b4780-cec9-5a21-b936-a7727c043a5c-scratchpad-skillwork-prose-research-positive-d2/15906327-d55c-45da-a56b-c011e2db2c46/scratchpad/map.json`. A ledger entry only shows that a source said something, not that it's true. The confidence labels are yours, and I haven't changed them.

Do you want me to draft ledger fixes (k3 and k4 wording, k5's source, k6's line number) and a proper dossier for these two sources? I'd show them to you before saving anything.
