# Session transcript

Rendered from the session's stream-json by the harness driver. Tool results longer than
80 lines are trimmed (marked). Scratch paths are shortened: `<plugins>` is the plugin copy,
`<draw>` the draw's directory, `<task>` the session's own scratchpad.

## Turn 1

*model reported by init: `claude-opus-5-5`*

**Writer:**

> /prose-author:prose-draft Draft the piece from my approved outline. The outline export is outline.json and the brief is brief.json, both in this directory.

**Assistant:**

I'll start by reading the runtime and outline-handoff references, plus your inputs.

**Tool call — Bash:**

````
S=<plugins>/prose-author/skills/prose-draft; cat $S/references/runtime.md; echo ======; cat $S/references/outline-handoff.md; echo ======; ls -la; echo ====; cat brief.json; echo ====; cat outline.json
````

*[permission denied by the harness allowlist: "Bash"]*

**Tool result (error):**

````
This Bash command contains multiple operations. The following parts require approval: cat <plugins>/prose-author/skills/prose-draft/references/runtime.md, echo ======, cat <plugins>/prose-author/skills/prose-draft/references/outline-handoff.md, echo ====
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

**Tool call — Glob:**

````
{
 "pattern": "**/tools/*.mjs",
 "path": "<plugins>"
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
<plugins>/prose-outline/skills/prose-outline/tools/outline-store.mjs
<plugins>/prose-outline/skills/prose-outline/tools/outline-diff.mjs
<plugins>/prose-outline/skills/prose-outline/tools/outline-scan.mjs
<plugins>/prose-review/tools/fidelity-scan.mjs
<plugins>/prose-review/tools/persona-check.mjs
<plugins>/prose-tell-scan/skills/tell-scan/tools/tell-scan.mjs
<plugins>/prose-tell-scan/skills/tell-scan/tools/calibrate.mjs
<plugins>/prose-tell-scan/skills/tell-scan/tools/init.mjs
<plugins>/prose-tell-scan/skills/tell-scan/tools/ingest.mjs
<plugins>/prose-outline/skills/prose-brainstorm/tools/angles-check.mjs
<plugins>/prose-outline/skills/prose-brainstorm/tools/brief-store.mjs
<plugins>/prose-outline/skills/prose-brainstorm/tools/transcript-scan.mjs
<plugins>/prose-outline/skills/prose-outline/tools/shape-check.mjs
<plugins>/prose-outline/skills/prose-outline/tools/outline-compare.mjs
<plugins>/prose-outline/skills/prose-outline/tools/proposal-check.mjs
<plugins>/prose-outline/skills/prose-interview/tools/brief-store.mjs
<plugins>/prose-outline/skills/prose-interview/tools/brief-check.mjs
<plugins>/prose-outline/skills/prose-interview/tools/transcript-scan.mjs
<plugins>/prose-review/skills/prose-edit/tools/section-split.mjs
<plugins>/prose-review/skills/prose-edit/tools/notes-check.mjs
<plugins>/prose-author/skills/prose-draft/tools/writing-receipt.mjs
<plugins>/prose-author/skills/prose-draft/tools/outline-job.mjs
````

**Tool call — Bash:**

````
ls -la; ls -la sources 2>/dev/null; which node claude codex
````

**Tool result (error):**

````
Exit code 1
total 16
drwxr-xr-x 2 root root 4096 Nov  9 18:35 .
drwxr-xr-x 5 root root 4096 Nov  9 18:35 ..
-rw-r--r-- 1 root root 4034 Nov  9 18:35 brief.json
-rw-r--r-- 1 root root 2306 Nov  9 18:35 outline.json
/opt/node22/bin/node
/opt/node22/bin/claude
````

**Assistant:**

The cached transcript isn't in this directory, so the interview's `brief-check` can't re-verify quotes. Building the job now:

**Tool call — Bash:**

````
P=<plugins>/prose-author/skills/prose-draft/tools; T=<task>/task; mkdir -p $T; node $P/outline-job.mjs --outline outline.json --brief brief.json --harness claude --out $T/job.json; echo "exit=$?"
````

*[permission denied by the harness allowlist: "Bash"]*

**Tool result (error):**

````
This Bash command contains multiple operations. The following part requires approval: echo "exit=$?"
````

**Tool call — Bash:**

````
mkdir -p <task>/task && node <plugins>/prose-author/skills/prose-draft/tools/outline-job.mjs --outline outline.json --brief brief.json --harness claude --out <task>/task/job.json
````

**Tool result:**

````
{"status":"ready","job":"<task>/task/job.json","facts":10,"rules":3,"notes":[]}
````

**Assistant:**

The builder accepted it with no notes. I'll check how it handled the shape mismatch, and resolve your writing identity.

**Tool call — Read:**

````
{
 "file_path": "<task>/task/job.json"
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

**Tool call — Edit:**

````
{
 "replace_all": false,
 "file_path": "<task>/task/job.json",
 "old_string": "  \"schema\": \"prose-writing-job/1\",\n  \"mode\": \"draft\",",
 "new_string": "  \"schema\": \"prose-writing-job/1\",\n  \"mode\": \"draft\",\n  \"writing_identity\": \"personal\","
}
````

**Tool result:**

````
The file <task>/task/job.json has been updated successfully. (file state is current in your context — no need to Read it back)
````

**Tool call — Bash:**

````
node <plugins>/prose-author/skills/prose-draft/tools/prose-runtime.mjs run --job <task>/task/job.json --out <task>/task/run-1
````

**Tool result:**

````
draft (0 completed calls)
draft: passed
task-review (1 completed calls)
task-review: passed
{"status":"checked","reason":"Exact final text checked; no resemblance, quality or factual guarantee","output_directory":"<task>/task/run-1","draft":"<task>/task/run-1/draft.md","report":"<task>/task/run-1/result.json","delivery":"<task>/task/run-1/delivery.md","model_call_records":2}
````

**Assistant:**

The run came back `checked`. Next I'll verify receipt integrity and read the delivery.

**Tool call — Bash:**

````
R=<task>/task/run-1; node <plugins>/prose-author/skills/prose-draft/tools/prose-runtime.mjs check-result --result $R/result.json --draft $R/draft.md --job $R/resolved-job.json --delivery $R/delivery.md
````

*[permission denied by the harness allowlist: "Bash"]*

**Tool result (error):**

````
A variable set in this command can't be checked before it runs
````

**Tool call — Read:**

````
{
 "file_path": "<task>/task/run-1/delivery.md"
}
````

**Tool result:**

````
1	Every bakery has two kinds of work. There's the work people see: the shaping, the scoring, the loaves cooling on the rack with their tops split open. And there's the work nobody sees, which is the starter, a jar of flour and water that has to be fed and watched and kept alive before any of the visible work can happen.
2	
3	The bakery starts new people in an odd place. Their first month has no shaping in it. None. They feed the starter. That's the job.
4	
5	Most teams run the opposite way. They reward the part of the work that photographs well: the demo, the launch, the shipped feature, the slide with the line going up. Those things are real, and they deserve credit. But they're the scoring. Whether they work was decided earlier, in some jar nobody walks past. Someone cleaned up the data model. Someone kept the test suite honest. Someone sat through the boring conversation that settled a requirement before anyone wrote code. When you reward only the visible part, you're telling people where to spend their attention. They listen. The starter goes hungry, and for a while nothing looks wrong.
6	
7	That's the trap. The failure doesn't happen where you're looking. With bread, it happens hours before anyone touches the dough, in a fermentation that went wrong while nobody was watching. By the time the loaf comes out flat, the cause is long past, and the person standing nearest the failure is the one who shaped it. There's a line for this: "You can't rescue bad fermentation with good scoring." No amount of skill at the end makes up for what went wrong at the start. Teams work the same way. The late-stage heroics get noticed, the late-stage misses get blamed, and the slow decay upstream stays invisible because nobody was assigned to watch it.
8	
9	So here's what I'd ask you to steal from the bakery. Two things.
10	
11	First, give new people a month on the starter. Not a month of shadowing the impressive work. A month of feeding the thing everything else depends on. At the bakery, that month is deliberately unglamorous: you come in, you feed, you look, you feed again. What it builds isn't a skill anyone would put on a résumé. It's a relationship with the slow part. You learn what healthy looks like by seeing it every day, and you learn what's off by seeing it the day it changes. Someone who has spent a month with the starter never again thinks of it as a jar on a shelf.
12	
13	On a team, the starter is whatever the visible work quietly rests on. Maybe it's the build pipeline, the support queue, the onboarding docs, the dataset everyone pulls from. Put the new person there first. Make it their job, not their penance, and tell them why: this is the part that decides the rest, and you want them to know it from the inside before they ever touch the part people clap for.
14	
15	Second, keep the notebook. The bakery has eleven years of them. Feedings, batches, odd days, all written down. That sounds like record-keeping for its own sake until a loaf fails. Then the notebook is the only way to read the failure back: to walk upstream from the flat bread on the rack to the morning when something in the jar was different. Without it, you're guessing, and the guess usually lands on whoever was closest to the end.
16	
17	Most teams don't keep this kind of notebook. They keep tickets for the visible work and memory for everything else, and memory is exactly the thing that fails when you need it. A notebook doesn't have to be elaborate. It has to be kept, every day, by the people doing the slow work, and it has to be read when something goes wrong. Nobody gets to eleven years of notebooks by being inspired. You get there by writing tomorrow's entry, and then the one after that.
18	
19	The two pieces depend on each other. The month teaches someone to notice. The notebook makes what they noticed outlast the moment they noticed it, and outlast them, too, if it comes to that. A team with only the month has people with good instincts and no record. A team with only the notebook has a record nobody knows how to read. You want both.
20	
21	I'll be honest about the cost. To the person doing it, the month can look like hazing. The bakery's early-shift baker hated the first month. Hated it. If you do this on your team, some people will feel the same way, and they won't be entirely wrong to: a month of unglamorous work with no visible output feels like being made to pay dues. The difference between hazing and training is whether the work matters and whether you say so. Hazing is pointless on purpose. This isn't. So say it plainly, check in often, and don't pretend the month is fun. Let the people doing it be annoyed. Just make sure they know what they're building.
22	
23	Here's how you'll know it worked. At the bakery, the moment you know someone is going to be good isn't when they shape a beautiful loaf. It's when they notice the starter: when it's raining and they adjust the water, because they've learned the jar answers to the weather. Nobody sees that adjustment. It won't show up in anything you'd put in a review. But it's the whole job, done right, long before anyone sees the result.
24	
25	Watch for that moment on your team. Then protect the work that made it possible.
26	
27	Status: checked.
28	
29	Context: newsletter; register unspecified. Profile evidence: not-evaluated (no profile supplied).
30	
31	Hard rules: 1 passed, 0 failed, 0 not-evaluated.
32	
33	Task review: passed. Voice review: not-evaluated (not required for this task). Fidelity review: not-evaluated (not required for this task).
34	
35	Artifact scan: passed. Copying check: not-evaluated.
36	
37	Preferences: revision 1, 0 active. Omissions: 0 unresolved, 0 reviewed advisory.
38	
39	Drafted from outline: project not-evaluated, revision not-evaluated, shape problem-solution; outline digest f7be2b53d9dd0c93b06a617242831772067fe2dfd1a6d1e5b9dcfbe453b40593.
40	
41	Writing identity: personal; registry revision 3. Inputs snapshotted for this run.
42	
43	Not mechanically evaluated (semantic instructions): must-include-1, must-include-2. See task review and sidecar.
44	
45	Claims disclosed for verification: 5. See sidecar.
46	
47	CLI dispatches: 2; elapsed: 57.825 s.
48	
49	This generated delivery is authoritative for the recorded checks. Host-written chat summaries are unverified.
50	
51	Checks are not a quality, resemblance or factual guarantee.
52	
````

**Tool call — Bash:**

````
node <plugins>/prose-author/skills/prose-draft/tools/prose-runtime.mjs check-result --result <task>/task/run-1/result.json --draft <task>/task/run-1/draft.md --job <task>/task/run-1/resolved-job.json --delivery <task>/task/run-1/delivery.md
````

**Tool result:**

````
{"schema":"prose-result-verification/1","status":"passed","result_status":"checked","mechanical_status":"not-evaluated","reason":"Report reproduced against exact final bytes","telemetry_status":"not-evaluated","delivery_status":"passed","claim":"Receipt integrity only; existing check statuses are unchanged, not upgraded."}
````

**Tool call — Bash:**

````
node -e 'const r=require(process.argv[1]);const pick=k=>JSON.stringify(r[k],null,1);for(const k of Object.keys(r))console.log(k);console.log(pick("claims")||"");console.log(pick("disclosed_claims")||"")' <task>/task/run-1/result.json
````

**Tool result:**

````
schema
status
reason
draft
receipt
claims
omitted
advisory_omissions
unresolved_omissions
attempts
calls
invocation
[
 {
  "quote": "With bread, it happens hours before anyone touches the dough, in a fermentation that went wrong while nobody was watching.",
  "reason": "General baking claim about fermentation timing. It extends the supplied stakes point and should be checked against the bakery's actual process."
 },
 {
  "quote": "because they've learned the jar answers to the weather",
  "reason": "The supplied facts mention adjusting the water on rainy days, but not why. Linking it to weather affecting the starter is general knowledge that needs checking."
 },
 {
  "quote": "you come in, you feed, you look, you feed again",
  "reason": "A description of the bakery's first-month routine that goes beyond the supplied note ('no shaping, only feeding'). Check it against the actual practice."
 },
 {
  "quote": "Feedings, batches, odd days, all written down.",
  "reason": "What goes into the eleven years of notebooks wasn't supplied. Check it against what the notebooks actually record."
 },
 {
  "quote": "Feedings, batches, odd days, all written down.",
  "reason": "The evidence only says 'eleven years of notebooks'. It doesn't say what the notebooks contain, so this list of contents is an inference. It's minor and plausible, but it isn't in the source."
 }
]
````

**Assistant:**

The draft is done and came back **checked**, meaning the configured checks ran on these exact bytes. That's no guarantee of quality, or that it sounds like you: your `personal` identity has no writing samples or profile yet, so this used preferences only, and there are 0 active ones.

**Authoritative delivery (draft plus generated receipt):** <task>/task/run-1/delivery.md
**Details:** <task>/task/run-1/result.json

The draft follows your outline's five parts in order: problem, stakes, solution, objection, close. It took 2 model calls and about 58 seconds. I checked the receipt against the draft and they match.

**What the receipt records (my unverified summary; the delivery file is the authority):**
- **Passed:** the 800–1,100 word rule, the task review and the artifact scan.
- **Reviewed but not counted mechanically:** "the month of feeding the starter" and "the eleven years of notebooks." Both have no exact-text check, so only the task review looked at them. Both appear in the draft.
- **Not run:** voice review (there's no profile to compare against), fidelity review and the copying check.

**Details to verify (5 flagged; 4 distinct, since one was flagged twice):**
- That bread fails "hours before anyone touches the dough" because fermentation went wrong unseen.
- The reason for adjusting the water on rainy days ("the jar answers to the weather").
- The first-month routine: "you come in, you feed, you look, you feed again."
- What the notebooks contain: "Feedings, batches, odd days."

**Please check these too:**
1. **Your brief and outline give different shapes.** In the brief you confirmed `narrative-arc`, but the outline is `problem-solution`, and the outline isn't linked to the brief. The job builder didn't flag this. I followed the outline because that's what you approved. If you meant a narrative arc, the outline needs revising first.
2. **The quote isn't verified.** "You can't rescue bad fermentation with good scoring" comes from your outline, not from the brief's transcript quotes. The draft doesn't attribute it to anyone; it introduces it as "There's a line for this." The transcript file isn't in this directory, so I couldn't run `brief-check` on it. The early-shift baker and the rainy-day water details also come only from the outline.
3. The integrity check reports `mechanical_status: not-evaluated`, but the receipt shows the word rule passing. I've left both as recorded rather than resolve the conflict myself.

Next, I can run prose-review's structure critic with your outline to check the draft against the plan. The overall word band is the only thing enforced; the section lengths were guidance to the drafter. Any changes you ask for will go through a new run.

*turn ended: success, 18 model turns, $0.51*

