# Why the roadmap must be a file

Every team I have watched lose a quarter lost it the same way. Nobody decided to stop; the plan simply stopped being anywhere. It lived in a channel, then in a head, then nowhere. This essay argues that a plan which is not a file under version control, checked by the build, is not a plan.

## Where the plan lives

A plan written in a document nobody opens is a plan nobody follows. The file next to the code is opened because the code is opened. In the last three retrospectives I sat through, the plans that survived were the ones checked in, and the ones that died were the ones linked from a wiki. That is a property of attention, not a coincidence.

There is a second reason, and it is the stronger one. A file under version control has a history, and a history is an argument you can read backwards. When the plan changes, the diff says what changed and the commit says why. A wiki page has neither, so every revision erases the reason for the last one.

## The check

The build must fail when the plan and the code disagree.

## The objection

The usual objection is that a mechanical check makes people update the plan without thinking. That is true, and it is fine. The edit the check forces is a small one, and a small forced edit is where a reviewer looks. What the check buys is not thoughtful updates; it is the impossibility of silent ones. In 2024 our team added such a check, and the count of stale plan entries dropped from eleven to zero within a month, not because anyone remembered but because the build refused to pass until they did.

So the rule is simple. Keep the plan in a file, keep the file next to the code, and make the build fail when they disagree. Everything else about planning is taste. This is the part that is not.
