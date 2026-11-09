I checked all six ledger quotes against your two sources and mapped the draft's 8 sentences to the ledger. **3 quotes match their source exactly, 2 have drifted, 1 can't be found, and 2 sentences have no ledger entry.** I also found one quote in the draft that differs from both the source and the ledger. The check tool doesn't compare the draft's own quotes against sources, so I found that one by reading.

None of this says whether a claim is true. It only says what each source said and where.

### Quotes in the draft
- **"three carts" (paragraph 1, mapped to k2).** The draft quotes the parish record as *"carried up the valley on three carts."* The source (`mill-history.txt` line 3) and k2 both say *"on two carts."* The tool reports k2 as `exact` because the ledger matches the source; it's the draft that differs.

### Drifted ledger quotes
- **k3** (s1, line 6). Ledger: *"because the bread **could** not wait"*. Source: *"because the bread **would** not wait"*. The draft has "would", which matches the source, so only the ledger entry is off.
- **k4** (s2, line 3). Ledger: *"**T**ake the quarry path…"*. Source: *"**t**ake the quarry path…"*. Only the capital letter differs, but the check counts any change in case.

### Quote not found
- **k5** cites source `s3`, and there is no s3: only two sources were given. The same words, *"the stone ran out before the men did"*, are in `valley-guide.html` line 4, which also gives the 1961 closing date. Repointing k5 to s2 line 4 would fix it, but that's your call.

### Location only
- **k6** matches exactly, but on line 10 of `mill-history.txt`, not line 40 as recorded. The draft doesn't use k6.

### Sentences with no ledger entry
- *"The ledger for that winter records forty-one sacks, more than any winter before it."* The source has "forty-one sacks" (line 7), but nothing in the sources says "more than any winter before it".
- *"Most valleys like this one lost their mills before the war."* Neither source has this.

Which sentences count as claims is my judgement. I treated all 8 as claims. The map is at `/tmp/claude-0/-tmp-claude-0--home-user-vonnegut-114b4780-cec9-5a21-b936-a7727c043a5c-scratchpad-skillwork-prose-research-positive-d1/61f2177a-2ffa-4d45-a67d-46c80f625621/scratchpad/task/map.json` if you want to check it.

### Links
- Both sources are local files, so no links were tested. Neither has been confirmed as live.

There's no project store here, so everything stayed in the scratchpad and nothing was saved. Your `ledger.json` is unchanged; the check tool needed a reformatted version, so it ran on a copy. If you want me to fix k3, k4, k5 or k6, or add entries for the two unbacked sentences, tell me which, and give me your confidence level for any new entry.
