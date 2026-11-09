I've built the outline (argument mode) and it passes the checker against your brief: 5 claims, 2 open questions, 2 evidence slots left empty. The checker only checks the structure. It doesn't judge whether these are the right claims in the right order.

**Thesis:** A team's roadmap belongs in the repo as a file, and the build should fail when the code moves and the plan doesn't.

| id | kind | text | evidence |
|---|---|---|---|
| n1 | claim | Plans die where nobody has to look at them. The ones kept next to the code survive and the ones on the wiki don't. | e1: last three retros (checked-in plans survived, wiki plans died) |
| n2 | claim | Being in the repo keeps a plan alive but not current. It goes stale unless something ties it to code changes. | e1: **empty** |
| └ n3 | open question | The brief only gives the eleven stale entries from before March 2024. Is that the evidence for n2 too, or is there an earlier observation? | — |
| n4 | claim | A build check that ties the plan to releases keeps it current. | e1: March 2024 script; stale entries went from eleven to zero in a month |
| n5 | claim | The usual objection is that a forced edit is a thoughtless edit. The answer: a thoughtless edit still shows up in review, which a wiki page nobody opened never does. | e1: the objection as stated in the brief · e2: **empty** |
| └ n6 | open question | The brief has no evidence on whether the forced edits were thoughtful, such as review comments or boilerplate plan edits. Without it the rebuttal is argument only. Should the post give some ground to the objection? | — |
| n7 | claim | Close on the rule itself, stated plainly: no version bumps without a plan edit. | e1: the script's condition, restated as the rule |

**What it needs from you:** The two empty slots are real gaps, so I didn't fill them with something plausible. n6 matters most. As it stands, the answer to the objection is the weakest part of the post. A figure on review comments or reverted plan edits since March 2024 would turn it from opinion into evidence. Otherwise the post should give the objection some ground.

**Saving:** There's nowhere to save it yet, because no writing-identity store is set up on this machine. I didn't create one, so the outline exists only as a file for this task: `/tmp/claude-0/-home-user-vonnegut/114b4780-cec9-5a21-b936-a7727c043a5c/scratchpad/skillwork/prose-outline-concrete-d3/proposal.json`.

Writing the 900 words is a separate step: once the outline looks right to you, `prose-draft` writes the post from it.
