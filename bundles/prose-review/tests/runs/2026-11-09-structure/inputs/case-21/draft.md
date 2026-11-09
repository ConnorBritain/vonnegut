# Why the roadmap must be a file

Every team I have watched lose a quarter lost it the same way. Nobody decided to stop; the plan simply stopped being anywhere. It lived in a channel, then in a head, then nowhere. This essay argues that a plan which is not a file under version control, checked by the build, is not a plan.

## Where the plan lives

A plan written in a document nobody opens is a plan nobody follows. The file next to the code is opened because the code is opened. In the last three retrospectives I sat through, the plans that survived were the ones checked in, and the ones that died were the ones linked from a wiki. That is a property of attention, not a coincidence.

## The mechanical check

So the check has to be mechanical, and a mechanical check eliminates stale plan entries entirely. Every team that has added one has seen the same result, because a script cannot forget and a person always eventually does. This is settled.

## The objection

However, the usual objection is that a mechanical check makes people update the plan without thinking. That is true, and it is fine. The edit the check forces is a small one, and a small forced edit is where a reviewer looks. What the check buys is not thoughtful updates; it is the impossibility of silent ones.

Therefore the rule is simple. Keep the plan in a file, keep the file next to the code, and make the build fail when they disagree. Everything else about planning is taste. This is the part that is not.
