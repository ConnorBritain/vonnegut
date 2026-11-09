# Session transcript

Rendered from the session's stream-json by the harness driver. Tool results longer than
80 lines are trimmed (marked). Scratch paths are shortened: `<plugins>` is the plugin copy,
`<draw>` the draw's directory, `<task>` the session's own scratchpad.

## Turn 1

*model reported by init: `claude-opus-5-5`*

**Writer:**

> /prose-author:prose-draft Draft the piece from my approved outline. The outline export is outline.json and the brief is brief.json, both in this directory.

**Tool call — Bash:**

````
S=<plugins>/prose-author/skills/prose-draft; cat $S/references/runtime.md; echo ======; cat $S/references/outline-handoff.md; echo =====; ls -la; cat brief.json; echo; head -c 4000 outline.json
````

*[permission denied by the harness allowlist: "Bash"]*

**Tool result (error):**

````
This Bash command contains multiple operations. The following parts require approval: cat <plugins>/prose-author/skills/prose-draft/references/runtime.md, echo ======, cat <plugins>/prose-author/skills/prose-draft/references/outline-handoff.md, echo =====, echo
````

**Tool call — Read:**

````
{
 "file_path": "<plugins>/prose-author/skills/prose-draft/references/runtime.md"
}
````

**Tool result:**

````
1	# Production writing runtime
2	
3	Resolve paths relative to the installed skill directory. Node.js is the only
4	runtime dependency. Adapter names are `claude` or `codex`; the product-name alias
5	`claude-code` is normalized to the same `claude` transport without changing the
6	model or authentication. Other unknown adapters remain unsupported.
7	The current harness's authenticated `claude` or `codex` CLI
8	must be on PATH. Omit model overrides to preserve configured models. If these
9	dependencies are missing, explain the unavailable check; do not simulate a run.
10	
11	## Prepare one job
12	
13	Resolve the shared writing identity first (`identity resolve`). See
14	[identities.md](identities.md) for setup and selection. `writing_identity` selects
15	an ID or opts out with null; optional `identity_registry` selects an absolute
16	registry path. With no explicit author inputs, the selected default is automatic.
17	Resolved inputs are frozen before model dispatch. Do not redundantly insert
18	legacy default preference paths into an identity-based job; explicit author
19	inputs without an explicit identity intentionally bypass default inheritance.
20	
21	Create a private task directory and an input JSON file. Do not put a private
22	corpus or call transcripts into a public repository. Use an existing persistent
23	preference-store path when the user has one; keep temporary outputs separate.
24	Use `preferences locate` at session start to discover the shared default store
25	without creating it. Pass the returned existing directory as `preference_store`
26	so a new conversation applies the same saved corrections. An explicit user
27	store/identity takes precedence; do not combine two authors' rules.
28	
29	```json
30	{
31	  "schema": "prose-writing-job/1",
32	  "mode": "draft",
33	  "brief": "Decline the invitation warmly, without proposing another date.",
34	  "context": {"form": "reply", "purpose": "decline", "register": null, "audience": null, "project": null},
35	  "facts": ["I appreciate the invitation.", "I cannot attend on Friday."],
36	  "adapter": {"harness": "codex"},
37	  "rules": [{"id": "short-reply", "kind": "word-limit", "directive": "Keep this under 60 words.", "minimum": 1, "maximum": 59}],
38	  "examples": true,
39	  "review": "standard"
40	}
41	```
42	
43	Use `claude` for Claude. Optional file inputs, resolved relative to the job:
44	
45	- `preference_store`: the persistent directory, never a manually assembled
46	  replacement for its current revision.
47	- `samples_dir`: the author's profile directory with `corpus/human/`. Samples
48	  need `human_authored: true`, attribution (`author`, `source`) and may include
49	  `register`, `form`, and `date` frontmatter. Whole attributable short samples
50	  count; generated text belongs outside this directory.
51	- `profile_file`: an existing `voice-profile/3`. Supplying samples too allows
52	  source revalidation and independent voice review.
53	- `source_file`: the exact passage for `rewrite` or `continue`.
54	
55	Inline `samples`, `profile`, `preferences`, and `source_text` are also supported.
56	Do not supply both an inline field and its file equivalent. A run with samples
57	and no profile renders one automatically. Use `profile_policy: "none"` only for
58	an explicitly examples-only or preference-only condition; it does not remove a
59	supplied profile silently. `examples: false` with a profile means profile-only
60	generation; the reviewer can still use authorized samples.
61	
62	Automatic rendering summarizes the supplied samples. `context.register` and
63	`context.form` guide drafting, example selection and comparisons; they do not
64	filter the renderer's corpus. For a register-specific profile, supply the
65	explicitly selected whole human pieces through `samples` (or a selected corpus
66	directory), preserving their attribution and metadata. Do not invent labels for
67	unknown samples. A mixed corpus remains limited evidence overall, with support
68	reported separately for its known groups.
69	
70	The five scope axes are exact labels. Reuse saved labels instead of inventing
71	synonyms that would make a scoped preference silently inactive. An explicit
72	one-off rule with the same ID replaces that saved rule for this job only.
73	Unsupported semantic requests use `kind: "semantic"` and a `directive`, not
74	invented counters. For rule shapes and persistent choices, read the sibling
75	[session reference](../../prose-style-tune/references/session.md).
76	
77	Encode requested hard rules with their supported kinds, not as semantic rules
78	or facts alone. These task-local examples do not change saved preferences:
79	
80	```json
… [89 more lines trimmed]
````

**Tool call — Read:**

````
{
 "file_path": "<plugins>/prose-author/skills/prose-draft/references/outline-handoff.md"
}
````

**Tool result:**

````
1	# Drafting from an approved outline
2	
3	When the writer has an outline saved by prose-outline (and usually a brief
4	from its interview), the job is built by a script, so the draft is the piece
5	that was planned. The contract between the two bundles is
6	[`docs/contracts/outline-handoff.md`](../../../../../docs/contracts/outline-handoff.md).
7	
8	## Build the job
9	
10	Export what the stores hold (prose-outline's tools; they live beside this skill
11	when both bundles are installed):
12	
13	```bash
14	node <prose-outline skill>/tools/outline-store.mjs show --project <name> > outline.json
15	node <prose-brainstorm or prose-interview skill>/tools/brief-store.mjs show --project <name> > brief.json
16	```
17	
18	Run the interview's `brief-check` with the cached transcript first, if there is
19	a transcript: this tool does not re-verify quotes. Then:
20	
21	```bash
22	node tools/outline-job.mjs --outline outline.json --brief brief.json --harness <codex|claude> --out job.json
23	```
24	
25	- **Refused:** the output lists every reason: open questions, a withheld
26	  thesis, a required decision open, skipped, unconfirmed or stale. Show them,
27	  and suggest the interview or an outline revision. Do not edit the job by hand
28	  to get past a refusal.
29	- **`--allow-open`** is the writer's choice, not yours. Each open question
30	  becomes a "leave unresolved; do not assert an answer" rule, so the gap is
31	  explicit and reviewable.
32	- **No brief:** pass `--form` and `--purpose` the writer gave you.
33	
34	The job carries `outline` (project, revision, digest, shape), which the receipt
35	prints, and `handoff`, which maps every fact and rule to the node or decision it
36	came from. Add the writer's identity or preference store to the job as usual,
37	then run it:
38	
39	```bash
40	node tools/prose-runtime.mjs run --job job.json --out <task-dir>
41	```
42	
43	## After delivery
44	
45	With prose-review installed, offer its review with the structure critic in
46	**intended-outline mode**, given the same outline export. That is how the draft
47	is checked against the plan. Section budgets are guidance to the drafter; only
48	the overall band is enforced, and the scan shows the real section lengths.
49	
````

**Tool call — Read:**

````
{
 "file_path": "<draw>/work/brief.json"
}
````

**Tool result:**

````
1	{
2	  "sources": [
3	    {
4	      "kind": "transcript",
5	      "digest": "ab20ffe81d2e1d97296cabb366bcce5c0a23608bf1249e83be2e1a39fa82f5d2",
6	      "words": 962,
7	      "cached": "sources/ab20ffe81d2e1d97296cabb366bcce5c0a23608bf1249e83be2e1a39fa82f5d2.txt",
8	      "format": "plain"
9	    }
10	  ],
11	  "angles": [
12	    {
13	      "id": "a1",
14	      "title": "The starter is the bakery",
15	      "thesis": "The slow invisible part of the work decides the result, long before anyone sees it.",
16	      "audience": "team leads who reward visible output",
17	      "shape": "narrative-arc",
18	      "uses": [
19	        {
20	          "segment": "s1",
21	          "line": 5,
22	          "quote": "If the starter is weak, the loaves come out flat and sour and nobody can fix that at the oven."
23	        },
24	        {
25	          "segment": "s2",
26	          "line": 9,
27	          "quote": "That was the moment she knew he would be good."
28	        }
29	      ],
30	      "leaves_out": [
31	        "s3",
32	        "s4"
33	      ],
34	      "open_questions": []
35	    },
36	    {
37	      "id": "a2",
38	      "title": "Meetings for decisions only",
39	      "thesis": "A weekly meeting should exist only when there is a decision on the agenda.",
40	      "audience": "engineering managers",
41	      "shape": "problem-solution",
42	      "uses": [
43	        {
44	          "segment": "s3",
45	          "line": 15,
46	          "quote": "So the agenda is upside down."
47	        },
48	        {
49	          "segment": "s4",
50	          "line": 17,
51	          "quote": "If there is no decision on the agenda, we cancel the meeting."
52	        }
53	      ],
54	      "leaves_out": [
55	        "s1",
56	        "s2",
57	        "s5",
58	        "s6"
59	      ],
60	      "open_questions": [
61	        "Will managers accept losing the meeting where they feel informed?"
62	      ]
63	    },
64	    {
65	      "id": "a3",
66	      "title": "Write the toolbox, not the thesis",
67	      "thesis": null,
68	      "audience": "newsletter readers who write",
69	      "shape": "letter",
70	      "uses": [
71	        {
72	          "segment": "s5",
73	          "line": 25,
74	          "quote": "The essays that actually landed with readers were all small and concrete."
75	        },
76	        {
77	          "segment": "s6",
78	          "line": 29,
79	          "quote": "Write the toolbox, not the thesis."
80	        }
… [77 more lines trimmed]
````

**Tool call — Read:**

````
{
 "file_path": "<draw>/work/outline.json"
}
````

**Tool result:**

````
1	{
2	  "mode": "argument",
3	  "title": "Feed the starter",
4	  "thesis": "The slow invisible part of the work decides the result, long before anyone sees it.",
5	  "shape": "problem-solution",
6	  "length": {
7	    "unit": "words",
8	    "min": 800,
9	    "max": 1100
10	  },
11	  "nodes": [
12	    {
13	      "id": "n1",
14	      "kind": "claim",
15	      "parent": null,
16	      "order": 1,
17	      "text": "Teams reward the visible part of the work and starve the part that decides it.",
18	      "part": "problem",
19	      "words": 200,
20	      "evidence": [
21	        {
22	          "slot": "e1",
23	          "filled_by": "the bakery's first month: no shaping, only feeding"
24	        }
25	      ]
26	    },
27	    {
28	      "id": "n2",
29	      "kind": "claim",
30	      "parent": null,
31	      "order": 2,
32	      "text": "The failure happens hours before anyone touches the dough, so nobody sees its cause.",
33	      "part": "stakes",
34	      "words": 120,
35	      "evidence": [
36	        {
37	          "slot": "e1",
38	          "filled_by": "'You can't rescue bad fermentation with good scoring.'"
39	        }
40	      ]
41	    },
42	    {
43	      "id": "n3",
44	      "kind": "claim",
45	      "parent": null,
46	      "order": 3,
47	      "text": "Give new people a month on the starter, and keep the notebook that lets you read the failure back.",
48	      "part": "solution",
49	      "words": 380,
50	      "evidence": [
51	        {
52	          "slot": "e1",
53	          "filled_by": "the month of feeding; eleven years of notebooks"
54	        }
55	      ],
56	      "covers": [
57	        "must_include.0",
58	        "must_include.1"
59	      ]
60	    },
61	    {
62	      "id": "n4",
63	      "kind": "claim",
64	      "parent": null,
65	      "order": 4,
66	      "text": "It looks like hazing to the people doing it.",
67	      "part": "objection",
68	      "words": 120,
69	      "evidence": [
70	        {
71	          "slot": "e1",
72	          "filled_by": "the early-shift baker who hated the first month"
73	        }
74	      ]
75	    },
76	    {
77	      "id": "n5",
78	      "kind": "claim",
79	      "parent": null,
80	      "order": 5,
… [17 more lines trimmed]
````

**Tool call — Bash:**

````
ls <plugins>/prose-author/skills/*/tools/; ls <plugins>/prose-author/skills/; ls -la
````

*[permission denied by the harness allowlist: "Bash"]*

**Tool result (error):**

````
This Bash command contains multiple operations. The following parts require approval: ls <plugins>/prose-author/skills/*/tools/, ls <plugins>/prose-author/skills/
````

**Tool call — Glob:**

````
{
 "pattern": "*/tools/*.mjs",
 "path": "<plugins>/prose-author/skills"
}
````

**Tool result:**

````
<plugins>/prose-author/skills/prose-corpus/tools/import-gdocs.mjs
<plugins>/prose-author/skills/prose-corpus/tools/import-vault.mjs
<plugins>/prose-author/skills/prose-corpus/tools/corpus-ingest.mjs
<plugins>/prose-author/skills/prose-corpus/tools/import-substack.mjs
<plugins>/prose-author/skills/prose-corpus/tools/import-mbox.mjs
<plugins>/prose-author/skills/prose-repurpose/tools/repurpose-check.mjs
<plugins>/prose-author/skills/prose-draft/tools/installed-dependencies.mjs
<plugins>/prose-author/skills/prose-draft/tools/draft-contract.mjs
<plugins>/prose-author/skills/prose-draft/tools/preferences-v2.mjs
<plugins>/prose-author/skills/prose-draft/tools/draft-targets.mjs
<plugins>/prose-author/skills/prose-draft/tools/draft-claim-audit.mjs
<plugins>/prose-author/skills/prose-draft/tools/profile-current.mjs
<plugins>/prose-author/skills/prose-draft/tools/writing-runtime.mjs
<plugins>/prose-author/skills/prose-draft/tools/runtime-adapters.mjs
<plugins>/prose-author/skills/prose-draft/tools/draft-residual-prune.mjs
<plugins>/prose-author/skills/prose-draft/tools/style-rules.mjs
<plugins>/prose-author/skills/prose-draft/tools/profile-assemble.mjs
<plugins>/prose-author/skills/prose-draft/tools/ingest-edit.mjs
<plugins>/prose-author/skills/prose-draft/tools/history-cli.mjs
<plugins>/prose-author/skills/prose-draft/tools/runtime-contract.mjs
<plugins>/prose-author/skills/prose-draft/tools/draft-controls.mjs
<plugins>/prose-author/skills/prose-draft/tools/prose-runtime.mjs
<plugins>/prose-author/skills/prose-draft/tools/profile-measure.mjs
<plugins>/prose-author/skills/prose-draft/tools/identity-store.mjs
<plugins>/prose-author/skills/prose-draft/tools/exemplars.mjs
<plugins>/prose-author/skills/prose-draft/tools/history-measure.mjs
<plugins>/prose-author/skills/prose-draft/tools/preference-store.mjs
<plugins>/prose-author/skills/prose-draft/tools/history-session.mjs
<plugins>/prose-author/skills/prose-draft/tools/profile-contract.mjs
<plugins>/prose-author/skills/prose-draft/tools/visible-prose.mjs
<plugins>/prose-author/skills/prose-draft/tools/draft-conformance.mjs
<plugins>/prose-author/skills/prose-draft/tools/profile-v3.mjs
<plugins>/prose-author/skills/prose-draft/tools/history-store.mjs
<plugins>/prose-author/skills/prose-draft/tools/draft-claim-repair.mjs
<plugins>/prose-author/skills/prose-draft/tools/history-rhetoric.mjs
<plugins>/prose-author/skills/prose-draft/tools/history-report.mjs
<plugins>/prose-author/skills/prose-draft/tools/style-session.mjs
<plugins>/prose-author/skills/prose-draft/tools/verify.mjs
<plugins>/prose-author/skills/prose-draft/tools/draft-assemble.mjs
<plugins>/prose-author/skills/prose-style-tune/tools/style-contract.mjs
<plugins>/prose-author/skills/prose-draft/tools/writing-receipt.mjs
<plugins>/prose-author/skills/prose-draft/tools/outline-job.mjs
````

**Tool call — Glob:**

````
{
 "pattern": "**/*"
}
````

**Tool result:**

````
outline.json
brief.json
````

**Tool call — Bash:**

````
node <plugins>/prose-author/skills/prose-draft/tools/outline-job.mjs --outline outline.json --brief brief.json --harness claude --out <task>/job.json; echo "exit $?"
````

*[permission denied by the harness allowlist: "Bash"]*

**Tool result (error):**

````
This Bash command contains multiple operations. The following part requires approval: echo "exit $?"
````

**Assistant:**

Building the writing job from your outline and brief with the handoff script.

**Tool call — Bash:**

````
node <plugins>/prose-author/skills/prose-draft/tools/outline-job.mjs --outline <draw>/work/outline.json --brief <draw>/work/brief.json --harness claude --out <task>/job.json
````

**Tool result:**

````
{"status":"ready","job":"<task>/job.json","facts":10,"rules":3,"notes":[]}
````

**Tool call — Read:**

````
{
 "file_path": "<task>/job.json"
}
````

**Tool result:**

````
1	{
2	  "schema": "prose-writing-job/1",
3	  "mode": "draft",
4	  "brief": "The starter is the bakery: The slow invisible part of the work decides the result, long before anyone sees it.",
5	  "context": {
6	    "form": "newsletter",
7	    "purpose": "Make readers protect the unglamorous early work on their teams.",
8	    "register": null,
9	    "audience": "Team leads who reward visible output over slow groundwork.",
10	    "project": null
11	  },
12	  "facts": [
13	    "Section 1 (≈200 words, problem): Teams reward the visible part of the work and starve the part that decides it.",
14	    "Evidence for section 1: the bakery's first month: no shaping, only feeding",
15	    "Section 2 (≈120 words, stakes): The failure happens hours before anyone touches the dough, so nobody sees its cause.",
16	    "Evidence for section 2: 'You can't rescue bad fermentation with good scoring.'",
17	    "Section 3 (≈380 words, solution): Give new people a month on the starter, and keep the notebook that lets you read the failure back.",
18	    "Evidence for section 3: the month of feeding; eleven years of notebooks",
19	    "Section 4 (≈120 words, objection): It looks like hazing to the people doing it.",
20	    "Evidence for section 4: the early-shift baker who hated the first month",
21	    "Section 5 (≈110 words, close): The moment you know someone will be good is when they notice the starter.",
22	    "Evidence for section 5: adjusting the water on rainy days"
23	  ],
24	  "rules": [
25	    {
26	      "id": "outline-length",
27	      "kind": "word-limit",
28	      "directive": "Between 800 and 1100 words, the outline's band.",
29	      "minimum": 800,
30	      "maximum": 1100
31	    },
32	    {
33	      "id": "must-include-1",
34	      "kind": "semantic",
35	      "directive": "Include: the month of feeding the starter"
36	    },
37	    {
38	      "id": "must-include-2",
39	      "kind": "semantic",
40	      "directive": "Include: the eleven years of notebooks"
41	    }
42	  ],
43	  "examples": true,
44	  "review": "standard",
45	  "adapter": {
46	    "harness": "claude"
47	  },
48	  "outline": {
49	    "project": null,
50	    "revision": null,
51	    "digest": "f7be2b53d9dd0c93b06a617242831772067fe2dfd1a6d1e5b9dcfbe453b40593",
52	    "shape": "problem-solution"
53	  },
54	  "handoff": {
55	    "schema": "outline-handoff/1",
56	    "facts_from": [
57	      "n1",
58	      "n1.e1",
59	      "n2",
60	      "n2.e1",
61	      "n3",
62	      "n3.e1",
63	      "n4",
64	      "n4.e1",
65	      "n5",
66	      "n5.e1"
67	    ],
68	    "rules_from": [
69	      "length",
70	      "must_include.0",
71	      "must_include.1"
72	    ],
73	    "notes": [],
74	    "brief_revision": null
75	  }
76	}
77	
````

**Assistant:**

Job built (status ready). Now checking for your writing identity / saved preferences.

**Tool call — Bash:**

````
node <plugins>/prose-author/skills/prose-draft/tools/prose-runtime.mjs identity resolve
````

**Tool result:**

````
{
  "samples_dir": null,
  "profile_file": null,
  "preference_store": "<draw>/store/preferences",
  "history_directory": null,
  "id": "personal",
  "history_identity": "personal",
  "profile_digest": null,
  "registry_directory": "<draw>/store/registry",
  "registry_revision": 3
}
````

**Assistant:**

Identity `personal` resolved: saved preferences, no corpus or profile. Adding it to the job and running the drafter.

**Tool call — Edit:**

````
{
 "replace_all": false,
 "file_path": "<task>/job.json",
 "old_string": "  \"mode\": \"draft\",",
 "new_string": "  \"mode\": \"draft\",\n  \"writing_identity\": \"personal\","
}
````

**Tool result:**

````
The file <task>/job.json has been updated successfully. (file state is current in your context — no need to Read it back)
````

**Tool call — Bash:**

````
node <plugins>/prose-author/skills/prose-draft/tools/prose-runtime.mjs run --job <task>/job.json --out <task>/run1
````

**Tool result:**

````
draft (0 completed calls)
draft: passed
task-review (1 completed calls)
task-review: passed
{"status":"checked","reason":"Exact final text checked; no resemblance, quality or factual guarantee","output_directory":"<task>/run1","draft":"<task>/run1/draft.md","report":"<task>/run1/result.json","delivery":"<task>/run1/delivery.md","model_call_records":2}
````

**Assistant:**

Run finished as `checked`. Verifying the delivery and reading the result.

**Tool call — Bash:**

````
node <plugins>/prose-author/skills/prose-draft/tools/prose-runtime.mjs check-result --result <task>/run1/result.json --draft <task>/run1/draft.md --job <task>/run1/resolved-job.json --delivery <task>/run1/delivery.md
````

**Tool result:**

````
{"schema":"prose-result-verification/1","status":"passed","result_status":"checked","mechanical_status":"not-evaluated","reason":"Report reproduced against exact final bytes","telemetry_status":"not-evaluated","delivery_status":"passed","claim":"Receipt integrity only; existing check statuses are unchanged, not upgraded."}
````

**Tool call — Read:**

````
{
 "file_path": "<task>/run1/delivery.md"
}
````

**Tool result:**

````
1	The starter is the bakery. Everything a customer sees, from the crust to the open crumb to the loaf on the counter, is decided by a jar of flour and water that nobody photographs. The slow, invisible part of the work decides the result, long before anyone sees it.
2	
3	Most teams have this backwards. They reward the part of the work that shows up in a demo, a dashboard or a Friday update. That's the shaping. Meanwhile they starve the part that decides whether the shaping will matter: the setup, the groundwork, the boring maintenance that has to happen every day whether or not anyone is watching.
4	
5	The bakery's first month runs against that instinct. New people don't shape loaves. They don't score them or bake them. They feed the starter, and for a month that's all they do. No shaping, only feeding.
6	
7	If you lead a team, notice how strange that sounds to you. A month without visible output feels like a month wasted. You'd want to see something. You'd want a loaf. That want is the problem. It pulls attention and praise toward the end of the process, where the result gets shown, and away from the beginning, where the result gets made.
8	
9	Here's why it matters. When bread fails, it usually fails hours before anyone touches the dough. The starter was sluggish, or the fermentation ran short. By the time the loaf comes out flat and dense, the cause is long gone. It's sitting in a jar from the day before.
10	
11	You can't rescue bad fermentation with good scoring.
12	
13	Your team works the same way. The failure you see in the launch, the missed quarter or the brittle release was set in motion weeks earlier, in work nobody reviewed because it didn't look like anything. So the post-mortem blames the last visible step. The person who shaped the loaf takes the heat, and the jar sits there, unexamined, ready to do it again.
14	
15	Two things fix this, and the bakery does both.
16	
17	The first is the month. Give new people a month on the starter. Don't treat it as a test, or as a waiting room before the real job. It is the real job. A month of feeding teaches things nothing else can: how the jar smells when it's ready and when it's tired, how it behaves from one morning to the next, what happens when a feeding gets skipped. By the end, a new baker has a feel for the one part of the process that decides all the others. They've spent a month learning to care about something nobody will ever compliment.
18	
19	Now apply that to your team. Your starter might be the data pipeline, the test suite, the customer research or the onboarding docs. Whatever it is, put new people on it first and leave them there long enough to understand it. A week of shadowing isn't enough. Leave them there until they start to notice when something is off.
20	
21	The second thing is the notebook. The bakery has kept them for eleven years. The notebooks record what happened to the starter and the dough: when it was fed, how it behaved, how the bread came out. Most entries are dull, and that's the point. When a batch fails, the notebook lets you read the failure back. You can turn to the page from the day before and see what changed. Without it you're guessing, and a guess usually lands on whatever step is easiest to see.
22	
23	Eleven years of notebooks isn't a record of brilliance. It's a record of attention, kept long enough to become useful.
24	
25	Your team needs the same thing, and the people doing the slow work should be the ones who keep it. This isn't a status report written for leadership. It's a working log of the groundwork: what was changed, what was noticed, what looked a little wrong. When something breaks downstream, that log lets you trace it back upstream to the cause, instead of punishing the last pair of hands it passed through.
26	
27	The month and the notebook work together. The month teaches people to pay attention to the invisible part. The notebook makes that attention outlast any one person's memory. Protect both. If the log gets skipped when things are busy, or the month gets cut short because you need hands on the visible work, you're trading the result for the look of progress.
28	
29	There's an honest objection, and it comes from the people doing the feeding. To them, it looks like hazing.
30	
31	The bakery had an early-shift baker who hated the first month. Feeding a jar while other people made bread felt like being kept out on purpose. From the inside, a month of groundwork can look like a gate the old hands put up so newcomers suffer the way they did.
32	
33	Take that seriously. If you can't explain why the slow work matters, it is hazing. So explain it. Show them the notebook. Show them a failed batch and trace it back. Whether it's hazing or training comes down to whether the person understands what the work is for.
34	
35	And then, at some point, something shifts.
36	
37	The moment you know someone will be good is when they notice the starter. Nobody had to tell them. It's raining, and they adjust the water on their own. They've learned that the jar responds to the day it's in, and that tomorrow's bread depends on what they do with it today.
38	
39	That's what you're waiting for on your team: the person who notices the groundwork before anything has gone wrong. You won't see it in a demo. It won't show up in the weekly update. It looks like a small change to the water on a rainy day.
40	
41	Protect the month that makes it possible.
42	
43	Status: checked.
44	
45	Context: newsletter; register unspecified. Profile evidence: not-evaluated (no profile supplied).
46	
47	Hard rules: 1 passed, 0 failed, 0 not-evaluated.
48	
49	Task review: passed. Voice review: not-evaluated (not required for this task). Fidelity review: not-evaluated (not required for this task).
50	
51	Artifact scan: passed. Copying check: not-evaluated.
52	
53	Preferences: revision 1, 0 active. Omissions: 0 unresolved, 0 reviewed advisory.
54	
55	Drafted from outline: project not-evaluated, revision not-evaluated, shape problem-solution; outline digest f7be2b53d9dd0c93b06a617242831772067fe2dfd1a6d1e5b9dcfbe453b40593.
56	
57	Writing identity: personal; registry revision 3. Inputs snapshotted for this run.
58	
59	Not mechanically evaluated (semantic instructions): must-include-1, must-include-2. See task review and sidecar.
60	
61	Claims disclosed for verification: 8. See sidecar.
62	
63	CLI dispatches: 2; elapsed: 68.388 s.
64	
65	This generated delivery is authoritative for the recorded checks. Host-written chat summaries are unverified.
66	
67	Checks are not a quality, resemblance or factual guarantee.
68	
````

**Tool call — Read:**

````
{
 "file_path": "<task>/run1/result.json"
}
````

**Tool result:**

````
1	{
2	  "schema": "prose-writing-result/1",
3	  "status": "checked",
4	  "reason": "Exact final text checked; no resemblance, quality or factual guarantee",
5	  "draft": "The starter is the bakery. Everything a customer sees, from the crust to the open crumb to the loaf on the counter, is decided by a jar of flour and water that nobody photographs. The slow, invisible part of the work decides the result, long before anyone sees it.\n\nMost teams have this backwards. They reward the part of the work that shows up in a demo, a dashboard or a Friday update. That's the shaping. Meanwhile they starve the part that decides whether the shaping will matter: the setup, the groundwork, the boring maintenance that has to happen every day whether or not anyone is watching.\n\nThe bakery's first month runs against that instinct. New people don't shape loaves. They don't score them or bake them. They feed the starter, and for a month that's all they do. No shaping, only feeding.\n\nIf you lead a team, notice how strange that sounds to you. A month without visible output feels like a month wasted. You'd want to see something. You'd want a loaf. That want is the problem. It pulls attention and praise toward the end of the process, where the result gets shown, and away from the beginning, where the result gets made.\n\nHere's why it matters. When bread fails, it usually fails hours before anyone touches the dough. The starter was sluggish, or the fermentation ran short. By the time the loaf comes out flat and dense, the cause is long gone. It's sitting in a jar from the day before.\n\nYou can't rescue bad fermentation with good scoring.\n\nYour team works the same way. The failure you see in the launch, the missed quarter or the brittle release was set in motion weeks earlier, in work nobody reviewed because it didn't look like anything. So the post-mortem blames the last visible step. The person who shaped the loaf takes the heat, and the jar sits there, unexamined, ready to do it again.\n\nTwo things fix this, and the bakery does both.\n\nThe first is the month. Give new people a month on the starter. Don't treat it as a test, or as a waiting room before the real job. It is the real job. A month of feeding teaches things nothing else can: how the jar smells when it's ready and when it's tired, how it behaves from one morning to the next, what happens when a feeding gets skipped. By the end, a new baker has a feel for the one part of the process that decides all the others. They've spent a month learning to care about something nobody will ever compliment.\n\nNow apply that to your team. Your starter might be the data pipeline, the test suite, the customer research or the onboarding docs. Whatever it is, put new people on it first and leave them there long enough to understand it. A week of shadowing isn't enough. Leave them there until they start to notice when something is off.\n\nThe second thing is the notebook. The bakery has kept them for eleven years. The notebooks record what happened to the starter and the dough: when it was fed, how it behaved, how the bread came out. Most entries are dull, and that's the point. When a batch fails, the notebook lets you read the failure back. You can turn to the page from the day before and see what changed. Without it you're guessing, and a guess usually lands on whatever step is easiest to see.\n\nEleven years of notebooks isn't a record of brilliance. It's a record of attention, kept long enough to become useful.\n\nYour team needs the same thing, and the people doing the slow work should be the ones who keep it. This isn't a status report written for leadership. It's a working log of the groundwork: what was changed, what was noticed, what looked a little wrong. When something breaks downstream, that log lets you trace it back upstream to the cause, instead of punishing the last pair of hands it passed through.\n\nThe month and the notebook work together. The month teaches people to pay attention to the invisible part. The notebook makes that attention outlast any one person's memory. Protect both. If the log gets skipped when things are busy, or the month gets cut short because you need hands on the visible work, you're trading the result for the look of progress.\n\nThere's an honest objection, and it comes from the people doing the feeding. To them, it looks like hazing.\n\nThe bakery had an early-shift baker who hated the first month. Feeding a jar while other people made bread felt like being kept out on purpose. From the inside, a month of groundwork can look like a gate the old hands put up so newcomers suffer the way they did.\n\nTake that seriously. If you can't explain why the slow work matters, it is hazing. So explain it. Show them the notebook. Show them a failed batch and trace it back. Whether it's hazing or training comes down to whether the person understands what the work is for.\n\nAnd then, at some point, something shifts.\n\nThe moment you know someone will be good is when they notice the starter. Nobody had to tell them. It's raining, and they adjust the water on their own. They've learned that the jar responds to the day it's in, and that tomorrow's bread depends on what they do with it today.\n\nThat's what you're waiting for on your team: the person who notices the groundwork before anything has gone wrong. You won't see it in a demo. It won't show up in the weekly update. It looks like a small change to the water on a rainy day.\n\nProtect the month that makes it possible.",
6	  "receipt": {
7	    "draft_digest": "22d3757eb184867e4e749c080fdb0650166614d01cd9396331fe8a1b5a17c607",
8	    "profile_digest": null,
9	    "preference_digest": "ae2296b2109619edc0a3ec1c159beecf65bbfd759179a02c5ce5e4eb0e85d6af",
10	    "preference_revision": 1,
11	    "active_preferences": [],
12	    "overrides": [
13	      "outline-length",
14	      "must-include-1",
15	      "must-include-2"
16	    ],
17	    "examples": [],
18	    "example_exclusions": [],
19	    "example_warnings": [],
20	    "model_calls": 2,
21	    "elapsed_ms": 68373,
22	    "final_check": {
23	      "cycle": 0,
24	      "draft_digest": "22d3757eb184867e4e749c080fdb0650166614d01cd9396331fe8a1b5a17c607"
25	    },
26	    "isolation": "partial: fresh CLI context and audited tool events, not a general read-isolation guarantee"
27	  },
28	  "claims": [
29	    {
30	      "quote": "The notebooks record what happened to the starter and the dough: when it was fed, how it behaved, how the bread came out.",
31	      "reason": "The facts only mention eleven years of notebooks. What the notebooks actually contain is my inference and needs checking."
32	    },
33	    {
34	      "quote": "Feeding a jar while other people made bread felt like being kept out on purpose.",
35	      "reason": "The facts say only that the early-shift baker hated the first month. The reason given here is invented and needs checking."
36	    },
37	    {
38	      "quote": "The bakery had an early-shift baker who hated the first month.",
39	      "reason": "The facts don't say whether this baker still works there. I used the past tense; check whether that's right."
40	    },
41	    {
42	      "quote": "It's raining, and they adjust the water on their own.",
43	      "reason": "The facts mention adjusting the water on rainy days. The idea that someone does this without being told is my framing and needs checking."
44	    },
45	    {
46	      "quote": "how the jar smells when it's ready and when it's tired, how it behaves from one morning to the next, what happens when a feeding gets skipped",
47	      "reason": "These details about what new people learn come from general knowledge of sourdough, not from the supplied facts, and need checking."
48	    },
49	    {
50	      "quote": "The starter was sluggish, or the fermentation ran short.",
51	      "reason": "These causes of failure come from general baking knowledge, not from the supplied facts."
52	    },
53	    {
54	      "quote": "The notebooks record what happened to the starter and the dough: when it was fed, how it behaved, how the bread came out.",
55	      "reason": "The evidence only says there are eleven years of notebooks that let you read a failure back. What the notebooks contain is added detail."
56	    },
57	    {
58	      "quote": "Feeding a jar while other people made bread felt like being kept out on purpose.",
59	      "reason": "The evidence says only that the early-shift baker hated the first month. The reason given for that feeling is not in the evidence."
60	    }
61	  ],
62	  "omitted": [],
63	  "advisory_omissions": [],
64	  "unresolved_omissions": [],
65	  "attempts": [
66	    {
67	      "cycle": 0,
68	      "draft": "The starter is the bakery. Everything a customer sees, from the crust to the open crumb to the loaf on the counter, is decided by a jar of flour and water that nobody photographs. The slow, invisible part of the work decides the result, long before anyone sees it.\n\nMost teams have this backwards. They reward the part of the work that shows up in a demo, a dashboard or a Friday update. That's the shaping. Meanwhile they starve the part that decides whether the shaping will matter: the setup, the groundwork, the boring maintenance that has to happen every day whether or not anyone is watching.\n\nThe bakery's first month runs against that instinct. New people don't shape loaves. They don't score them or bake them. They feed the starter, and for a month that's all they do. No shaping, only feeding.\n\nIf you lead a team, notice how strange that sounds to you. A month without visible output feels like a month wasted. You'd want to see something. You'd want a loaf. That want is the problem. It pulls attention and praise toward the end of the process, where the result gets shown, and away from the beginning, where the result gets made.\n\nHere's why it matters. When bread fails, it usually fails hours before anyone touches the dough. The starter was sluggish, or the fermentation ran short. By the time the loaf comes out flat and dense, the cause is long gone. It's sitting in a jar from the day before.\n\nYou can't rescue bad fermentation with good scoring.\n\nYour team works the same way. The failure you see in the launch, the missed quarter or the brittle release was set in motion weeks earlier, in work nobody reviewed because it didn't look like anything. So the post-mortem blames the last visible step. The person who shaped the loaf takes the heat, and the jar sits there, unexamined, ready to do it again.\n\nTwo things fix this, and the bakery does both.\n\nThe first is the month. Give new people a month on the starter. Don't treat it as a test, or as a waiting room before the real job. It is the real job. A month of feeding teaches things nothing else can: how the jar smells when it's ready and when it's tired, how it behaves from one morning to the next, what happens when a feeding gets skipped. By the end, a new baker has a feel for the one part of the process that decides all the others. They've spent a month learning to care about something nobody will ever compliment.\n\nNow apply that to your team. Your starter might be the data pipeline, the test suite, the customer research or the onboarding docs. Whatever it is, put new people on it first and leave them there long enough to understand it. A week of shadowing isn't enough. Leave them there until they start to notice when something is off.\n\nThe second thing is the notebook. The bakery has kept them for eleven years. The notebooks record what happened to the starter and the dough: when it was fed, how it behaved, how the bread came out. Most entries are dull, and that's the point. When a batch fails, the notebook lets you read the failure back. You can turn to the page from the day before and see what changed. Without it you're guessing, and a guess usually lands on whatever step is easiest to see.\n\nEleven years of notebooks isn't a record of brilliance. It's a record of attention, kept long enough to become useful.\n\nYour team needs the same thing, and the people doing the slow work should be the ones who keep it. This isn't a status report written for leadership. It's a working log of the groundwork: what was changed, what was noticed, what looked a little wrong. When something breaks downstream, that log lets you trace it back upstream to the cause, instead of punishing the last pair of hands it passed through.\n\nThe month and the notebook work together. The month teaches people to pay attention to the invisible part. The notebook makes that attention outlast any one person's memory. Protect both. If the log gets skipped when things are busy, or the month gets cut short because you need hands on the visible work, you're trading the result for the look of progress.\n\nThere's an honest objection, and it comes from the people doing the feeding. To them, it looks like hazing.\n\nThe bakery had an early-shift baker who hated the first month. Feeding a jar while other people made bread felt like being kept out on purpose. From the inside, a month of groundwork can look like a gate the old hands put up so newcomers suffer the way they did.\n\nTake that seriously. If you can't explain why the slow work matters, it is hazing. So explain it. Show them the notebook. Show them a failed batch and trace it back. Whether it's hazing or training comes down to whether the person understands what the work is for.\n\nAnd then, at some point, something shifts.\n\nThe moment you know someone will be good is when they notice the starter. Nobody had to tell them. It's raining, and they adjust the water on their own. They've learned that the jar responds to the day it's in, and that tomorrow's bread depends on what they do with it today.\n\nThat's what you're waiting for on your team: the person who notices the groundwork before anything has gone wrong. You won't see it in a demo. It won't show up in the weekly update. It looks like a small change to the water on a rainy day.\n\nProtect the month that makes it possible.",
69	      "draft_digest": "22d3757eb184867e4e749c080fdb0650166614d01cd9396331fe8a1b5a17c607",
70	      "mechanical": {
71	        "schema": "voice-rule-report/1",
72	        "draft_digest": "22d3757eb184867e4e749c080fdb0650166614d01cd9396331fe8a1b5a17c607",
73	        "draft_words": 970,
74	        "normalization": "visible-prose/1",
75	        "exclusions": [],
76	        "warnings": [],
77	        "checks": [
78	          {
79	            "id": "outline-length",
80	            "kind": "word-limit",
… [217 more lines trimmed]
````

**Assistant:**

The draft is written and the run came back **`checked`**: 970 words against your 800–1,100 band, 2 model calls, about 68 seconds. I re-checked that the receipt matches the final text and it does.

- **Checked delivery (draft plus the runtime's receipt):** `<task>/run1/delivery.md`
- **Details file:** `<task>/run1/result.json`

**What ran and what didn't (my summary; the receipt is the authoritative record):** The word count was checked automatically and passed. Your two must-includes (the month of feeding, the eleven years of notebooks) have no automatic check. The review pass found both in the text. The scan for leftover formatting or generation artifacts passed. Three checks didn't run because the `personal` identity has no writing samples or voice profile:
- the voice review
- the comparison against how you usually write
- the check for text copied from your samples

So this draft isn't tuned to your voice and hasn't been tested against it. You have 0 saved preferences, so none were applied.

**Three things to check before you trust it:**

1. **The structure doesn't match your brief.** Your outline uses a problem-solution structure, but the brief records narrative-arc as the structure you confirmed (revision 3). I followed the outline, because that's what you approved. The outline file also has no project, revision or brief link, so the tool couldn't tell whether it's out of date. That's why the receipt shows project and revision as "not-evaluated."
2. **The quoted line wasn't checked against your transcript.** "You can't rescue bad fermentation with good scoring" comes from your outline and appears word for word as its own paragraph. It isn't one of the quotes recorded in your brief. The quote-checking step couldn't run because neither the cached transcript nor the interview's brief-check tool is here.
3. **The drafter added details that aren't in your material.** Six need checking (the details file lists eight entries, with two repeated):
   - what the notebooks actually record
   - why the early-shift baker hated the first month ("felt like being kept out on purpose")
   - past tense for that baker, as if they no longer work there
   - "adjust the water on their own," meaning nobody told them to
   - what a month of feeding teaches (the smells, morning-to-morning behaviour, skipped feedings), taken from general sourdough knowledge
   - the causes of failure ("sluggish" starter, fermentation that "ran short"), also from general baking knowledge

If you want to check the draft against your outline section by section, prose-review can do that if it's installed. If any of the added details are wrong, tell me what's true and I'll do a new rewrite run, which gets its own checks.

*turn ended: success, 18 model turns, $0.54*

