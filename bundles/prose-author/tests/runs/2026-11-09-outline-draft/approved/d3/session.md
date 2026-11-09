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
S=<plugins>/prose-author/skills/prose-draft; cat $S/references/runtime.md; echo ======; cat $S/references/outline-handoff.md; echo =====; ls -la; ls $S $S/tools 2>/dev/null
````

*[permission denied by the harness allowlist: "Bash"]*

**Tool result (error):**

````
This Bash command contains multiple operations. The following parts require approval: cat <plugins>/prose-author/skills/prose-draft/references/runtime.md, echo ======, cat <plugins>/prose-author/skills/prose-draft/references/outline-handoff.md, echo =====, ls <plugins>/prose-author/skills/prose-draft <plugins>/prose-author/skills/prose-draft/tools
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

**Tool call — Glob:**

````
{
 "pattern": "*"
}
````

**Tool result:**

````
outline.json
brief.json
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

**Tool call — Bash:**

````
cd <plugins>/prose-author/skills/prose-draft && node tools/prose-runtime.mjs identity resolve 2>&1 | head -40; node tools/prose-runtime.mjs preferences locate 2>&1 | head -20
````

*[permission denied by the harness allowlist: "Bash"]*

**Tool result (error):**

````
This Bash command contains multiple operations. The following part requires approval: cd <plugins>/prose-author/skills/prose-draft && node tools/prose-runtime.mjs identity resolve 2>&1
````

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

**Tool call — Bash:**

````
node <plugins>/prose-author/skills/prose-draft/tools/prose-runtime.mjs preferences locate
````

**Tool result:**

````
{
  "directory": "<draw>/store/preferences",
  "exists": true,
  "preference_id": "personal"
}
````

**Tool call — Bash:**

````
node <plugins>/prose-author/skills/prose-draft/tools/outline-job.mjs --outline <draw>/work/outline.json --brief <draw>/work/brief.json --harness claude --out <task>/job.json; echo "exit=$?"
````

*[permission denied by the harness allowlist: "Bash"]*

**Tool result (error):**

````
This Bash command contains multiple operations. The following part requires approval: echo "exit=$?"
````

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

**Tool call — Glob:**

````
{
 "pattern": "**/ab20ffe81d2e1d97296cabb366bcce5c0a23608bf1249e83be2e1a39fa82f5d2*",
 "path": "<draw>"
}
````

**Tool result:**

````
No files found
````

**Assistant:**

The job is ready. Next I'm adding your writing identity to it and starting the drafting run.

**Tool call — Edit:**

````
{
 "replace_all": false,
 "file_path": "<task>/job.json",
 "old_string": "  \"examples\": true,",
 "new_string": "  \"writing_identity\": \"personal\",\n  \"examples\": true,"
}
````

**Tool result:**

````
The file <task>/job.json has been updated successfully. (file state is current in your context — no need to Read it back)
````

**Tool call — Bash:**

````
node <plugins>/prose-author/skills/prose-draft/tools/prose-runtime.mjs run --job <task>/job.json --out <draw>/work/run-1
````

**Tool result:**

````
draft (0 completed calls)
draft: passed
task-review (1 completed calls)
task-review: passed
{"status":"checked","reason":"Exact final text checked; no resemblance, quality or factual guarantee","output_directory":"<draw>/work/run-1","draft":"<draw>/work/run-1/draft.md","report":"<draw>/work/run-1/result.json","delivery":"<draw>/work/run-1/delivery.md","model_call_records":2}
````

**Tool call — Bash:**

````
node <plugins>/prose-author/skills/prose-draft/tools/prose-runtime.mjs check-result --result <draw>/work/run-1/result.json --draft <draw>/work/run-1/draft.md --job <draw>/work/run-1/resolved-job.json --delivery <draw>/work/run-1/delivery.md
````

**Tool result:**

````
{"schema":"prose-result-verification/1","status":"passed","result_status":"checked","mechanical_status":"not-evaluated","reason":"Report reproduced against exact final bytes","telemetry_status":"not-evaluated","delivery_status":"passed","claim":"Receipt integrity only; existing check statuses are unchanged, not upgraded."}
````

**Tool call — Read:**

````
{
 "file_path": "<draw>/work/run-1/delivery.md"
}
````

**Tool result:**

````
1	There's a bakery where new people spend their first month not baking. No shaping. Only feeding: the starter, every day, for a month.
2	
3	That sounds like a strange way to train a baker until you see what it protects. The starter is the bakery. Everything that comes out of the oven was decided by it long before anyone saw a loaf. Shaping is the part a customer could watch through the window. Feeding is the part nobody watches at all.
4	
5	Most teams run the other way. They reward what they can see: the demo, the shipped feature, the deck that lands well in the meeting. The work that decides whether any of that holds up gets whatever time is left over, and usually that's none. That means the cleanup, the setup, the slow feeding of a system nobody's looking at. Then the visible part fails, and everyone goes looking for the cause in the visible part, because that's where they've been looking all along.
6	
7	This isn't a character flaw. Visible output is easy to count and easy to praise. Groundwork is hard to point at. But if you lead a team, you're the one who decides which work gets fed and which work starves.
8	
9	Here's what makes this dangerous. When bread fails, it fails hours before anyone touches the dough. By the time someone is shaping and scoring, the outcome is already set. There's a line for this: 'You can't rescue bad fermentation with good scoring.'
10	
11	Your team's failures work the same way. The cause sits upstream, in work that happened quietly and early. The symptom shows up downstream, in work everyone can see. So the person holding the symptom takes the blame, and the cause goes unexamined. Nobody saw it happen, because nobody was looking there. And the next time, it happens again.
12	
13	The fix has two parts, and the bakery does both.
14	
15	First, give new people a month on the starter. Not a week of orientation and then the real work. A month in which the slow part is the real work. At the bakery, that means feeding. It's the same task every day, done while watching what changes and what doesn't. It isn't busywork. It's how someone learns what the foundation of the whole operation looks like when it's healthy, so they can tell when it isn't.
16	
17	On your team, the starter is whatever everything else depends on and nobody gets credit for. It might be the build, the data pipeline, the support queue, the test suite or the onboarding docs. Put new people there first, on purpose, and tell them why. Tell them this is the part that decides the result. Then act like it: ask about it in one-on-ones, notice when it's done well, and don't pull people off it the minute a visible project needs hands. A month sounds long. It's short next to the years someone will spend building on top of what they learned in it.
18	
19	Second, keep the notebook. The bakery has eleven years of them. That record is what lets someone read a failure back. When a batch comes out wrong, the notebooks are where you go to find out what changed before anyone could see it.
20	
21	Most teams don't keep that kind of record for their groundwork. They keep records of output: tickets closed, features shipped, incidents resolved. What they rarely write down is the state of the slow stuff, like what got changed upstream, what was quietly patched, or what someone noticed and didn't have time to chase. So when something breaks, there's nothing to read back. People guess, and they usually guess at whatever is most visible.
22	
23	A notebook doesn't need to be elaborate. It needs to be kept by the people doing the early work, and it needs to be read. Eleven years of notebooks only matter because someone opens them. Start one this week for the part of your team's work nobody sees, and make keeping it part of that first month. A new person who writes down what they notice is learning to notice. A year from now, when a failure shows up and nobody can explain it, you'll have something better than a guess.
24	
25	There's an honest objection, and it comes from the people doing the feeding. To them, it can look like hazing. The bakery had an early-shift baker who hated the first month.
26	
27	Take that seriously. If nobody explains why the slow work matters, it feels exactly like hazing: paying your dues before you're allowed near the real thing. The difference is whether the work is the real thing. Hazing is arbitrary. The month on the starter isn't, but only if you say so out loud, keep saying it, and show people what they're learning while they do it. And if you can't explain why the groundwork decides the result, maybe it doesn't. In that case, go find the work that does.
28	
29	Here's how you know it's working. At the bakery, the moment you know someone will be good is when they notice the starter. On rainy days, they adjust the water. They see something change before it shows up in the bread, and they respond where it matters, early and quietly.
30	
31	That's what you're building on your team: people who look upstream without being asked. You won't get them by rewarding only what shows up downstream. Feed the slow part. Write it down. Then watch for the day someone adjusts the water.
32	
33	Status: checked.
34	
35	Context: newsletter; register unspecified. Profile evidence: not-evaluated (no profile supplied).
36	
37	Hard rules: 1 passed, 0 failed, 0 not-evaluated.
38	
39	Task review: passed. Voice review: not-evaluated (not required for this task). Fidelity review: not-evaluated (not required for this task).
40	
41	Artifact scan: passed. Copying check: not-evaluated.
42	
43	Preferences: revision 1, 0 active. Omissions: 0 unresolved, 0 reviewed advisory.
44	
45	Drafted from outline: project not-evaluated, revision not-evaluated, shape problem-solution; outline digest f7be2b53d9dd0c93b06a617242831772067fe2dfd1a6d1e5b9dcfbe453b40593.
46	
47	Writing identity: personal; registry revision 3. Inputs snapshotted for this run.
48	
49	Not mechanically evaluated (semantic instructions): must-include-1, must-include-2. See task review and sidecar.
50	
51	Claims disclosed for verification: 1. See sidecar.
52	
53	CLI dispatches: 2; elapsed: 59.161 s.
54	
55	This generated delivery is authoritative for the recorded checks. Host-written chat summaries are unverified.
56	
57	Checks are not a quality, resemblance or factual guarantee.
58	
````

**Tool call — Read:**

````
{
 "file_path": "<draw>/work/run-1/result.json"
}
````

**Tool result:**

````
1	{
2	  "schema": "prose-writing-result/1",
3	  "status": "checked",
4	  "reason": "Exact final text checked; no resemblance, quality or factual guarantee",
5	  "draft": "There's a bakery where new people spend their first month not baking. No shaping. Only feeding: the starter, every day, for a month.\n\nThat sounds like a strange way to train a baker until you see what it protects. The starter is the bakery. Everything that comes out of the oven was decided by it long before anyone saw a loaf. Shaping is the part a customer could watch through the window. Feeding is the part nobody watches at all.\n\nMost teams run the other way. They reward what they can see: the demo, the shipped feature, the deck that lands well in the meeting. The work that decides whether any of that holds up gets whatever time is left over, and usually that's none. That means the cleanup, the setup, the slow feeding of a system nobody's looking at. Then the visible part fails, and everyone goes looking for the cause in the visible part, because that's where they've been looking all along.\n\nThis isn't a character flaw. Visible output is easy to count and easy to praise. Groundwork is hard to point at. But if you lead a team, you're the one who decides which work gets fed and which work starves.\n\nHere's what makes this dangerous. When bread fails, it fails hours before anyone touches the dough. By the time someone is shaping and scoring, the outcome is already set. There's a line for this: 'You can't rescue bad fermentation with good scoring.'\n\nYour team's failures work the same way. The cause sits upstream, in work that happened quietly and early. The symptom shows up downstream, in work everyone can see. So the person holding the symptom takes the blame, and the cause goes unexamined. Nobody saw it happen, because nobody was looking there. And the next time, it happens again.\n\nThe fix has two parts, and the bakery does both.\n\nFirst, give new people a month on the starter. Not a week of orientation and then the real work. A month in which the slow part is the real work. At the bakery, that means feeding. It's the same task every day, done while watching what changes and what doesn't. It isn't busywork. It's how someone learns what the foundation of the whole operation looks like when it's healthy, so they can tell when it isn't.\n\nOn your team, the starter is whatever everything else depends on and nobody gets credit for. It might be the build, the data pipeline, the support queue, the test suite or the onboarding docs. Put new people there first, on purpose, and tell them why. Tell them this is the part that decides the result. Then act like it: ask about it in one-on-ones, notice when it's done well, and don't pull people off it the minute a visible project needs hands. A month sounds long. It's short next to the years someone will spend building on top of what they learned in it.\n\nSecond, keep the notebook. The bakery has eleven years of them. That record is what lets someone read a failure back. When a batch comes out wrong, the notebooks are where you go to find out what changed before anyone could see it.\n\nMost teams don't keep that kind of record for their groundwork. They keep records of output: tickets closed, features shipped, incidents resolved. What they rarely write down is the state of the slow stuff, like what got changed upstream, what was quietly patched, or what someone noticed and didn't have time to chase. So when something breaks, there's nothing to read back. People guess, and they usually guess at whatever is most visible.\n\nA notebook doesn't need to be elaborate. It needs to be kept by the people doing the early work, and it needs to be read. Eleven years of notebooks only matter because someone opens them. Start one this week for the part of your team's work nobody sees, and make keeping it part of that first month. A new person who writes down what they notice is learning to notice. A year from now, when a failure shows up and nobody can explain it, you'll have something better than a guess.\n\nThere's an honest objection, and it comes from the people doing the feeding. To them, it can look like hazing. The bakery had an early-shift baker who hated the first month.\n\nTake that seriously. If nobody explains why the slow work matters, it feels exactly like hazing: paying your dues before you're allowed near the real thing. The difference is whether the work is the real thing. Hazing is arbitrary. The month on the starter isn't, but only if you say so out loud, keep saying it, and show people what they're learning while they do it. And if you can't explain why the groundwork decides the result, maybe it doesn't. In that case, go find the work that does.\n\nHere's how you know it's working. At the bakery, the moment you know someone will be good is when they notice the starter. On rainy days, they adjust the water. They see something change before it shows up in the bread, and they respond where it matters, early and quietly.\n\nThat's what you're building on your team: people who look upstream without being asked. You won't get them by rewarding only what shows up downstream. Feed the slow part. Write it down. Then watch for the day someone adjusts the water.",
6	  "receipt": {
7	    "draft_digest": "f9ae9db19db658c732c2c904d6b7561d9d886f3bef673fe9dacf386d3b00a9ac",
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
21	    "elapsed_ms": 59159,
22	    "final_check": {
23	      "cycle": 0,
24	      "draft_digest": "f9ae9db19db658c732c2c904d6b7561d9d886f3bef673fe9dacf386d3b00a9ac"
25	    },
26	    "isolation": "partial: fresh CLI context and audited tool events, not a general read-isolation guarantee"
27	  },
28	  "claims": [
29	    {
30	      "quote": "Shaping is the part a customer could watch through the window.",
31	      "reason": "Neither the brief nor the outline mentions a window or customers watching. It is worded as a possibility, but it still adds a detail about the bakery that the sources don't give."
32	    }
33	  ],
34	  "omitted": [],
35	  "advisory_omissions": [],
36	  "unresolved_omissions": [],
37	  "attempts": [
38	    {
39	      "cycle": 0,
40	      "draft": "There's a bakery where new people spend their first month not baking. No shaping. Only feeding: the starter, every day, for a month.\n\nThat sounds like a strange way to train a baker until you see what it protects. The starter is the bakery. Everything that comes out of the oven was decided by it long before anyone saw a loaf. Shaping is the part a customer could watch through the window. Feeding is the part nobody watches at all.\n\nMost teams run the other way. They reward what they can see: the demo, the shipped feature, the deck that lands well in the meeting. The work that decides whether any of that holds up gets whatever time is left over, and usually that's none. That means the cleanup, the setup, the slow feeding of a system nobody's looking at. Then the visible part fails, and everyone goes looking for the cause in the visible part, because that's where they've been looking all along.\n\nThis isn't a character flaw. Visible output is easy to count and easy to praise. Groundwork is hard to point at. But if you lead a team, you're the one who decides which work gets fed and which work starves.\n\nHere's what makes this dangerous. When bread fails, it fails hours before anyone touches the dough. By the time someone is shaping and scoring, the outcome is already set. There's a line for this: 'You can't rescue bad fermentation with good scoring.'\n\nYour team's failures work the same way. The cause sits upstream, in work that happened quietly and early. The symptom shows up downstream, in work everyone can see. So the person holding the symptom takes the blame, and the cause goes unexamined. Nobody saw it happen, because nobody was looking there. And the next time, it happens again.\n\nThe fix has two parts, and the bakery does both.\n\nFirst, give new people a month on the starter. Not a week of orientation and then the real work. A month in which the slow part is the real work. At the bakery, that means feeding. It's the same task every day, done while watching what changes and what doesn't. It isn't busywork. It's how someone learns what the foundation of the whole operation looks like when it's healthy, so they can tell when it isn't.\n\nOn your team, the starter is whatever everything else depends on and nobody gets credit for. It might be the build, the data pipeline, the support queue, the test suite or the onboarding docs. Put new people there first, on purpose, and tell them why. Tell them this is the part that decides the result. Then act like it: ask about it in one-on-ones, notice when it's done well, and don't pull people off it the minute a visible project needs hands. A month sounds long. It's short next to the years someone will spend building on top of what they learned in it.\n\nSecond, keep the notebook. The bakery has eleven years of them. That record is what lets someone read a failure back. When a batch comes out wrong, the notebooks are where you go to find out what changed before anyone could see it.\n\nMost teams don't keep that kind of record for their groundwork. They keep records of output: tickets closed, features shipped, incidents resolved. What they rarely write down is the state of the slow stuff, like what got changed upstream, what was quietly patched, or what someone noticed and didn't have time to chase. So when something breaks, there's nothing to read back. People guess, and they usually guess at whatever is most visible.\n\nA notebook doesn't need to be elaborate. It needs to be kept by the people doing the early work, and it needs to be read. Eleven years of notebooks only matter because someone opens them. Start one this week for the part of your team's work nobody sees, and make keeping it part of that first month. A new person who writes down what they notice is learning to notice. A year from now, when a failure shows up and nobody can explain it, you'll have something better than a guess.\n\nThere's an honest objection, and it comes from the people doing the feeding. To them, it can look like hazing. The bakery had an early-shift baker who hated the first month.\n\nTake that seriously. If nobody explains why the slow work matters, it feels exactly like hazing: paying your dues before you're allowed near the real thing. The difference is whether the work is the real thing. Hazing is arbitrary. The month on the starter isn't, but only if you say so out loud, keep saying it, and show people what they're learning while they do it. And if you can't explain why the groundwork decides the result, maybe it doesn't. In that case, go find the work that does.\n\nHere's how you know it's working. At the bakery, the moment you know someone will be good is when they notice the starter. On rainy days, they adjust the water. They see something change before it shows up in the bread, and they respond where it matters, early and quietly.\n\nThat's what you're building on your team: people who look upstream without being asked. You won't get them by rewarding only what shows up downstream. Feed the slow part. Write it down. Then watch for the day someone adjusts the water.",
41	      "draft_digest": "f9ae9db19db658c732c2c904d6b7561d9d886f3bef673fe9dacf386d3b00a9ac",
42	      "mechanical": {
43	        "schema": "voice-rule-report/1",
44	        "draft_digest": "f9ae9db19db658c732c2c904d6b7561d9d886f3bef673fe9dacf386d3b00a9ac",
45	        "draft_words": 915,
46	        "normalization": "visible-prose/1",
47	        "exclusions": [],
48	        "warnings": [],
49	        "checks": [
50	          {
51	            "id": "outline-length",
52	            "kind": "word-limit",
53	            "directive": "Between 800 and 1100 words, the outline's band.",
54	            "enforcement": "enforced",
55	            "actual": 915,
56	            "minimum": 800,
57	            "maximum": 1100,
58	            "occurrences": [],
59	            "status": "passed"
60	          },
61	          {
62	            "id": "must-include-1",
63	            "kind": "semantic",
64	            "directive": "Include: the month of feeding the starter",
65	            "status": "not-evaluated",
66	            "enforcement": "advisory",
67	            "reason": "Requires contextual semantic review; no mechanical verifier"
68	          },
69	          {
70	            "id": "must-include-2",
71	            "kind": "semantic",
72	            "directive": "Include: the eleven years of notebooks",
73	            "status": "not-evaluated",
74	            "enforcement": "advisory",
75	            "reason": "Requires contextual semantic review; no mechanical verifier"
76	          }
77	        ],
78	        "status": "not-evaluated"
79	      },
80	      "observed": {
… [160 more lines trimmed]
````

**Assistant:**

I've drafted the piece from your outline. It's 915 words, inside your 800–1,100 range, and the run finished with status **checked**. That means the configured checks ran on this exact text. It doesn't vouch for quality or accuracy, or that it sounds like you.

**Draft and record of checks:** [delivery.md](<draw>/work/run-1/delivery.md). The full record of each check is in [result.json](<draw>/work/run-1/result.json). I confirmed that the record matches the exact draft text.

The piece follows your five sections in order: what teams reward, why the cause goes unseen, the month on the starter plus the notebooks, the hazing objection, and the rainy-day water. It ends on "Then watch for the day someone adjusts the water." It includes both of your must-includes, the month of feeding and the eleven years of notebooks. Those two were checked by the review model rather than by a script.

**What you should look at:**

- **The structure contradicts your brief.** The outline is built as problem → solution. Your brief records "narrative-arc" as the structure you confirmed at revision 3. The outline also isn't tied to that brief version, so the job builder couldn't catch the mismatch. I drafted the outline because that's what you asked for and approved. If you meant narrative-arc, the outline needs revising before a new draft.
- **One quote can't be checked.** "You can't rescue bad fermentation with good scoring" comes from your outline. Your interview transcript isn't here, so I couldn't check the quote against it. It also doesn't match the line in the brief ("If the starter is weak… nobody can fix that at the oven"). Make sure it's a real line before publishing.
- **One added detail:** "Shaping is the part a customer could watch through the window." Neither your brief nor your outline mentions a window or customers watching. Keep it or cut it.
- **Your voice wasn't used or checked.** Your "personal" identity has no writing samples and no active saved preferences. So the draft is generic prose that follows your outline.
- **Two review tools weren't installed and didn't run.** Only a basic formatting check ran, not the separate scan for telltale AI-style phrasing. There's also no structure critic, so the draft hasn't been checked section by section against the outline. Section lengths were guidance only; only the overall word range was enforced.

The run took 2 model calls and about 59 seconds, with no repair rounds.

If you want changes, each set of edits needs a new run, because these checks only cover the current text.

*turn ended: success, 20 model turns, $0.55*

