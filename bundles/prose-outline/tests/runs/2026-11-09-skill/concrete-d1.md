I've finished the outline for the post. It passed the outline checker with no problems, but it couldn't be saved anywhere permanent, so for now it exists only in this session.

**The roadmap is a file, and the build reads it** (argument, ~900 words)

**Thesis:** A team's roadmap should be a file in the repo, checked by the build. Plans survive where the work lives, and they stay true only when the build fails if they fall behind.

1. **n1** Plans disappear because of where they live, not because teams stop caring. The plans kept next to the code outlived the ones kept on the wiki.
   - *Evidence:* your last three retrospectives (checked-in plans survived, wiki plans died)
2. **n2** Keeping the plan in the repo keeps it alive but doesn't keep it accurate. Without a check, entries go stale.
   - *Evidence:* eleven stale entries before the March 2024 script
   - **n3 (open question):** Was the plan with eleven stale entries already a file in the repo before March 2024? This claim depends on it, and the brief doesn't say.
   - **n4 (open question):** What counted as a "stale" entry, and who counted them? The post should define it in one line.
3. **n5** Tie the plan to something the build already sees: if a version bumps without a plan edit, the build fails, and stale entries stop piling up.
   - *Evidence:* script added March 2024; stale entries went from eleven to zero in a month
4. **n6** The usual objection is that a forced edit is a thoughtless edit. The answer: a thoughtless edit shows up as a diff someone can review, while a missing edit is invisible.
   - *Evidence:* the objection as stated in the brief; **second slot empty** (the brief gives nothing to fill it)
   - **n7 (open question):** Is there any data on the forced edits since March 2024, such as how many were reviewed, reverted or approved without a real look? Without it, the rebuttal rests on reasoning alone, and the post should admit that.
5. **n8** End on the rule itself: the roadmap is a file in the repo, and a version that moves without the plan moving doesn't build.
   - *Evidence:* the March 2024 build check, stated as the rule

**Open questions to settle before drafting:**
- **n3 matters most.** If the plan was already in the repo, n2 shows that being in the repo isn't enough and the build check is what fixed it. If it wasn't, the eleven-to-zero drop can't be credited to the check alone, and n2 needs new evidence or has to go.
- **n7** decides how hard n6 can push back on the objection.

**Saving:** No outline store is set up on this machine, so I didn't create one. The outline is a local file:
`/tmp/claude-0/-tmp-claude-0--home-user-vonnegut-114b4780-cec9-5a21-b936-a7727c043a5c-scratchpad-skillwork-prose-outline-concrete-d1/badcd7a0-e289-405b-84a1-8b3df696f4e8/scratchpad/proposal.json`

If you answer n3, n4 and n7, I'll revise the outline and keep each point's label (n1, n2, …), so the next comparison shows exactly what changed. Writing the post itself is a job for the `prose-draft` skill.
