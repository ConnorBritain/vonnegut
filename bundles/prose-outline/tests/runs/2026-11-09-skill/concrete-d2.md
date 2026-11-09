I've drafted an outline for the 900-word post. The check script passed it with no errors. It isn't saved anywhere permanent, because no outline store exists on this machine, so it only lives in this session.

**The roadmap is a file, and the build reads it** (argument mode)

**Thesis:** A team's roadmap should be a file in the repo, checked by the build. Plans survive only where the work happens, and they stay accurate only when something stops them from drifting.

1. **n1 – Opening.** You've seen a quarter's plan evaporate. It didn't fail; people just stopped looking at it.
   - Evidence: *empty*
   - ❓ **n9** Is there a specific lost quarter to open on, or should the opening lean on the reader's own memory?
2. **n2 – Where the plan lives decides whether it survives.** Plans in the repo outlived plans on the wiki.
   - Evidence: your last three retrospectives
3. **n3 – Being in the repo isn't enough.** A checked-in file still goes stale unless the build ties it to the work.
   - Evidence: *empty*. This is the step between the two facts, and right now it's an argument with nothing behind it.
4. **n4 – Making the build fail fixed it fast.** When a version bump without a plan edit breaks the build, stale entries disappear.
   - Evidence: the March 2024 script, which took stale entries from eleven to zero in a month
   - ❓ **n8** What counted as a "stale entry" when you counted the eleven? Has it stayed at zero since that first month?
5. **n5 – The objection.** "A forced edit is a thoughtless edit." The post has to answer this, not wave it off.
   - Evidence e1: the objection as you stated it
   - Evidence e2: *empty*
   - ❓ **n6** What answers it? The brief shows that staleness dropped, but says nothing about whether the forced edits were any good. Do you have evidence, such as reviewed edits or examples? Or is the answer an argument: a thoughtless edit still shows up in a diff, and a missing edit doesn't?
6. **n7 – End on the rule.** No version bumps unless the plan moves with it. There's no call to action.
   - Evidence: the March 2024 build check, which is what enforces the rule

**Things to settle before drafting:**
- **n6 is the weak point.** None of your three facts rebuts the objection. If the draft goes ahead without an answer, n5 will rest on nothing.
- **n3 and n1 have no evidence.** That's fine for a hook and a step in the reasoning, but you should know they rest on argument alone.

The proposal is at `/tmp/claude-0/-tmp-claude-0--home-user-vonnegut-114b4780-cec9-5a21-b936-a7727c043a5c-scratchpad-skillwork-prose-outline-concrete-d2/885d5bf7-17f0-4a80-83fd-406bdb6dc45c/scratchpad/proposal.json`. Answer n6, n8 or n9 and I'll revise it, keeping the same node ids so the changes can be compared. Writing the actual prose is a separate step, done with `prose-draft`.
