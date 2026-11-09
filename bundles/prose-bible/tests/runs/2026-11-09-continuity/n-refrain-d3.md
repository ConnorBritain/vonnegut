# Negative (consistent project) — refrain-d3 · CLEAN

No findings.

The one candidate is the sentence "Nobody leaves the valley in winter, and nobody ever has." It appears at part-one.md:3, part-one.md:7 and part-two.md:5. The text around each one shows it is a deliberate refrain, not information given twice:
- At part-one.md:7, the sentence before it calls it "the thing everyone says".
- At part-two.md:5, the sentence before it says "he said it again… the way you say grace".
- The sentence after part-two.md:5 says "the sentence had become a joke he told about himself."

A reader is meant to meet it more than once.

All four classes are clean: definition, attribute, date and repeat.

*Index gaps*
- The `after` text for part-one.md:3 contains the same words again, inside a longer sentence: "…and nobody leaves the valley in winter, and nobody ever has." The index did not list this as a separate repeat location. Most likely the capital letter or the sentence boundary stopped the match.
- part-one.md:3 has `before: null` but `offset: 12`. That suggests there is text before it that the index did not capture.

CLEAN

RESULT: CLEAN | findings=0 | uncited=0 | third_location=0
