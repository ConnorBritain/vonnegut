I checked the draft against the ledger. The checker found 3 quotes that match their source exactly, 2 where the ledger's wording differs from the source, 1 whose source isn't in `./sources`, and 2 draft sentences with no ledger entry. Reading the draft myself, I also found one quote where the draft's own wording differs from both the ledger and the source.

**Setup:** you didn't provide a dossier, so I built a temporary one in my scratchpad. Your files are unchanged and nothing was saved to a project store.
- **Source ids are my guess.** I matched `s1` to `mill-history.txt` and `s2` to `valley-guide.html`. Neither file has an `s3`. Tell me if any of that is wrong.
- **Ledger wrapper:** `ledger.json` is missing the header fields the checker needs, so I checked a copy with those fields added.
- **Sentence map:** this is my reading of which sentences in the draft are claims, and which ledger entry backs each one. It's in `/tmp/claude-0/-tmp-claude-0--home-user-vonnegut-114b4780-cec9-5a21-b936-a7727c043a5c-scratchpad-skillwork-prose-research-positive-d3/cee94670-578a-4aeb-9e97-43a44d462544/scratchpad/task/map.json` for you to look over.

## Ledger quotes vs. sources

**Drifted (the ledger's words differ from the source's):**
- **k3**, `mill-history.txt` line 6
  - ledger: "…because the bread **could** not wait"
  - source: "…because the bread **would** not wait"
  - Your draft has "would", which matches the source. The ledger entry is the one that differs.
- **k4**, `valley-guide.html` line 3
  - ledger: "**Take** the quarry path in wet weather…"
  - source: "**take** the quarry path in wet weather…"
  - Only the capital letter differs. The checker counts any change, even case, as drift.

**Absent:**
- **k5** cites `s3`, and no `s3` exists. The checker's note: "the source text is not in the dossier's cache". The same words, "the stone ran out before the men did", are on line 4 of `valley-guide.html`, which also says the quarry closed in 1961. Whether k5 should point there is your call, so I haven't changed it.

**Exact:**
- **k1** and **k2** match the source.
- **k6** also matches, but at line 10, not the line 40 the ledger records. The draft doesn't use k6.

## The draft's own quote (my reading, not the checker's)
The checker compares ledger entries with sources, not the draft's quotes with the ledger. Reading them side by side:
- **Paragraph 1:** the draft quotes the parish record as "carried up the valley on **three** carts". Ledger entry k2 and `mill-history.txt` line 3 both say "**two** carts".

## Draft sentences with no ledger entry
- "The ledger for that winter records forty-one sacks, more than any winter before it." The forty-one sacks figure is on line 7 of `mill-history.txt`, but no ledger entry records it.
- "Most valleys like this one lost their mills before the war."

## Links
Both sources are local files, so neither link was tested. That means their status is unknown, not that they work.

This only checks that a source says what the ledger says it does. It doesn't check whether any claim is true.
