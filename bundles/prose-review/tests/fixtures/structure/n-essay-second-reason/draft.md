# Why the Roadmap Must Be a File

Every team I have watched lose a quarter lost it the same way. Nobody decided to stop; the plan simply stopped being anywhere. It lived in a channel, then in a head, then nowhere. This essay argues that a plan which is not a file under version control is not a plan.

## The plan lives where the work lives

A plan written in a document nobody opens is a plan nobody follows. The file next to the code is opened because the code is opened. According to the last three retrospectives I sat through, the plans that survived were the ones checked in, and the ones that died were the ones linked from a wiki. That is not a coincidence; it is a property of attention.

There is a second reason. A file under version control has a history, and a history is an argument you can read backwards. When the plan changes, the diff says what changed and the commit says why. A wiki page has neither, so every revision erases the reason for the last one.

## What breaks when the plan drifts

However, a file alone is not enough. The file must be checked against the code, because a plan and a codebase drift apart the moment either moves. A version bump without a note in the plan is the common case, and it is silent: the code says 0.7.0, the plan says 0.6.0, and nothing complains.

So the check has to be mechanical. A script that fails when the two disagree costs nothing to run and cannot forget. In 2024 our team added one, and the count of stale plan entries dropped from eleven to zero within a month. Nobody remembered to update the plan; the build refused to pass until they did.

## The objection, and why it fails

The usual objection is that a mechanical check makes people update the plan without thinking. That is true, and it is fine. The edit the check forces is a small one, and a small forced edit is where a reviewer looks. What the check buys is not thoughtful updates; it is the impossibility of silent ones.

Therefore the rule is simple. Keep the plan in a file, keep the file next to the code, and make the build fail when they disagree. Everything else about planning is taste. This is the part that is not.
