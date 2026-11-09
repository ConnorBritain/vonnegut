# Positive (lossy revision) — tihonov-summarised-d1 · MATERIAL-LOSS

**Findings**

1. **CLASS**: dropped-fact
   **ORIGINAL**: L12 "I was born in Taganrog in 1860."
   **REVISION**: L12–13 "I was born in Taganrog around the middle of the century"
   **WHAT THE READER LOSES**: The birth year. "Mid-century" covers about a decade, so the reader can no longer work out his age when he left school, took his degree or won the prize.

2. **CLASS**: dropped-fact
   **ORIGINAL**: L12–13 "I finished the course at Taganrog high school in 1879."
   **REVISION**: L13 "finished at the Taganrog high school"
   **WHAT THE READER LOSES**: The year he left school. That year is also the reference point for every relative date that follows in the revision.

3. **CLASS**: dropped-fact
   **ORIGINAL**: L13–14 "In 1884 I took my degree in medicine at the University of Moscow."
   **REVISION**: L13–14 "and some years later took my degree in medicine at the University of Moscow"
   **WHAT THE READER LOSES**: The year of his medical degree. "Some years later" hangs off a school date the revision no longer gives.

4. **CLASS**: dropped-fact
   **ORIGINAL**: L14–15 "In 1888 I gained the Pushkin prize."
   **REVISION**: L14–15 "I won a literary prize not long after"
   **WHAT THE READER LOSES**: Both the year and which prize it was. "A literary prize" cannot be identified, and "not long after" the degree gives no date.

5. **CLASS**: dropped-fact
   **ORIGINAL**: L15–16 "In 1890 I made a journey to Sahalin across Siberia and back by sea."
   **REVISION**: L15–16 "travelled to Sahalin across Siberia and back by sea"
   **WHAT THE READER LOSES**: The year of the Sahalin journey. The revision gives it no date at all, not even a relative one.

6. **CLASS**: dropped-fact
   **ORIGINAL**: L16 "In 1891 I made a tour in Europe"
   **REVISION**: L16 "and the following year made a tour in Europe"
   **WHAT THE READER LOSES**: The year of the European tour. "The following year" counts from the Sahalin journey, whose year is also gone (finding 5), so the date cannot be worked out.

7. **CLASS**: claim-drift
   **ORIGINAL**: L17–18 "In 1892 I took part in an orgy in the company of V. A. Tihonov at a name-day party."
   **REVISION**: L17–18 "Last year I took part in an orgy in the company of V. A. Tihonov at a name-day party."
   **WHAT THE READER LOSES**: The letter is dated February 1892, so "last year" moves the event to 1891. That breaks its link to the Shtcheglov name-day party in the first paragraph, which happened recently, and now reads as a different, earlier party. The scan did not flag this because "1892" is still in the dateline at L2.

8. **CLASS**: dropped-fact
   **ORIGINAL**: L18 "I began writing in 1879."
   **REVISION**: L18–19 "I began writing while still at school."
   **WHAT THE READER LOSES**: The year he started writing. The revision also replaces it with a claim the original does not make: 1879 is the year he finished school, so "while still at school" is the reviser's inference, not the author's fact.

9. **CLASS**: dropped-fact
   **ORIGINAL**: L19–20 "The published collections of my works are: “Motley Tales,” “In the Twilight,” “Stories,” “Surly People,” and a novel, “The Duel.”"
   **REVISION**: L19–20 "Several collections of my stories have been published, along with a novel."
   **WHAT THE READER LOSES**: Every title: four named collections and the novel. The reader can no longer name or find any of his published works, or tell that there were exactly four collections. The scan did not extract "Stories" because it is a single word, but it is gone too.

10. **CLASS**: dropped-fact
    **ORIGINAL**: L24–25 "The mysteries of love I fathomed at the age of thirteen."
    **REVISION**: L24 "The mysteries of love I fathomed young."
    **WHAT THE READER LOSES**: The age, thirteen. The scan does not extract numbers written as words, so it missed this one.

11. **CLASS**: dropped-fact
    **ORIGINAL**: L28 "though I have not done so for two or three years."
    **REVISION**: L28 "though I have not done so for some time."
    **WHAT THE READER LOSES**: How long it has been since his last post-mortem, two or three years. "Some time" could mean months or a decade. This is another number written as words, so the scan missed it.

**Immaterial losses**

None. Every atom the scan flagged is raised above:
- "1860": finding 1
- "1879": findings 2 and 8
- "1884": finding 3
- "1888": finding 4
- "1890": finding 5
- "1891": finding 6
- "In the Twilight," "Motley Tales", "Surly People" and "The Duel": finding 9

**Scanner defects**

- The scan checks only whether a token appears anywhere in the revision, not how many times. "1892" appears twice in the original (L2 dateline, L17 orgy). The L17 one is gone and its meaning changed (finding 7), but the scan stayed quiet because the dateline copy survives. Its coverage notes do not list this blind spot.

No verdict, expectation, class label, provenance label or `expect:` key appears in either input file.

MATERIAL-LOSS

RESULT: MATERIAL-LOSS | findings=11 | uncited=0 | contradicts_scan=0
