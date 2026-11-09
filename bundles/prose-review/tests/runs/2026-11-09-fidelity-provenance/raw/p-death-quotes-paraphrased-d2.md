**Findings**

- **CLASS**: dropped-fact
- **ORIGINAL**: L31: `Augustus Cæsar died in a compliment: “Livia, conjugii nostri memor, vive et vale.”`
- **REVISION**: L30–31: `Augustus Cæsar died in a compliment to his wife;`
- **WHAT THE READER LOSES**: The wife's name, Livia, and what the compliment actually said ("remember our marriage, live and farewell"). The reader can no longer tell what the compliment was.

- **CLASS**: dropped-fact
- **ORIGINAL**: L32–33: `Tiberius in dissimulation, as Tacitus saith of him, “Jam Tiberium vires et corpus, non dissimulatio, deserebant:”`
- **REVISION**: L31: `Tiberius in dissimulation, as Tacitus saith of him;`
- **WHAT THE READER LOSES**: What Tacitus said: Tiberius's strength and body were failing him, but his dissimulation was not. The attribution is still there, but it now points at nothing, so the reader cannot see the evidence for "in dissimulation."

- **CLASS**: dropped-fact
- **ORIGINAL**: L33–34: `Vespasian in a jest, sitting upon the stool, “Ut puto Deus fio;”`
- **REVISION**: L31–32: `Vespasian in a jest, sitting upon the stool;`
- **WHAT THE READER LOSES**: The jest itself ("I think I am becoming a god"). The reader is told a joke was made but cannot know what it was or why it was funny.

- **CLASS**: dropped-fact
- **ORIGINAL**: L34–36: `Galba with a sentence, “Feri, si ex re sit populi Romani,” holding forth his neck;`
- **REVISION**: L32–33: `Galba with a sentence, holding forth his neck;`
- **WHAT THE READER LOSES**: The sentence itself ("Strike, if it be for the good of the Roman people"). The reader cannot tell what Galba said or why it shows a calm spirit at death.

- **CLASS**: claim-drift
- **ORIGINAL**: L47–48: `extinguisheth envy: “Extinctus amabitur idem.”`
- **REVISION**: L45: `extinguisheth envy: the man once gone will be loved.`
- **WHAT THE READER LOSES**: The quotation marks showing these are borrowed words are gone, so the line now reads as the author's own claim. The paraphrase also drops *idem* ("that same man"), which tied the line to the envy just mentioned: the man who was envied while alive is the one who will be loved.

- **CLASS**: dropped-fact
- **ORIGINAL**: L45: `the sweetest canticle is “Nunc dimittis,”`
- **REVISION**: L42–43: `the sweetest canticle is the old song of departure,`
- **WHAT THE READER LOSES**: The name of the canticle (the Song of Simeon). "The old song of departure" does not identify it, and the reader cannot get the name back from the revision.

**Immaterial losses**

- `"Pompa mortis magis terret, quam mors ipsa."`: translated in full at L13–14 ("the pomp of death frightens us more than death itself"), and it is still attributed through "it was well said that." The meaning survives.
- `"Cogita quamdiu eadem feceris; mori velle, non tantum fortis, aut mi..."`: the second half is paraphrased at L24–26 and still credited to Seneca. The first half ("think how long you have done the same things") is carried by the sentence that follows at L26–28, which was kept.
- `"Adeste, si quid mihi restat agendum,"`: paraphrased at L33–34 ("calling for whatever remained to be done"). "In dispatch" is kept, so the point about Severus's haste survives.
- `"qui finem vitæ extremum inter munera ponit naturæ."`: translated at L36–37 ("counts the end of life among the gifts of nature"), and "saith he" is kept.
- `"Extinctus amabitur idem."`: raised above as claim-drift.
- `"Livia, conjugii nostri memor, vive et vale."`: raised above.
- `"Jam Tiberium vires et corpus, non dissimulatio, deserebant:"`: raised above.
- `"Ut puto Deus fio;"`: raised above.
- `"Feri, si ex re sit populi Romani,"`: raised above.

**Scanner defects**

- The scan did not flag the quoted span `“Nunc dimittis,”` (original L45), even though it is absent from the revision. It looks like short quoted spans of two words or fewer are not being extracted, and the coverage note does not list that as an excluded category.

MATERIAL-LOSS
