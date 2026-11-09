# Session transcript

Rendered from the session's stream-json by the harness driver. Tool results longer than
80 lines are trimmed (marked). Scratch paths are shortened: `<plugins>` is the plugin copy,
`<draw>` the draw's directory, `<task>` the session's own scratchpad.

## Turn 1

*model reported by init: `claude-opus-5-5`*

**Writer:**

> /prose-outline:prose-outline Here's my project brief: brief.json. Show me two or three candidate outlines in different shapes so I can pick one.

**Tool call — Bash:**

````
S=<plugins>/prose-outline/skills/prose-outline; cd $S; cat references/outline-schema.md; ls shapes tools; echo ---; cat <draw>/work/brief.json; echo ---; node tools/shape-check.mjs
````

*[permission denied by the harness allowlist: "Bash"]*

**Tool result (error):**

````
This Bash command contains multiple operations. The following parts require approval: cd <plugins>/prose-outline/skills/prose-outline, echo ---
````

**Tool call — Read:**

````
{
 "file_path": "<plugins>/prose-outline/skills/prose-outline/references/outline-schema.md"
}
````

**Tool result:**

````
1	# `voice-outline/1`
2	
3	The outline the skill proposes, the store keeps and the differ compares. The
4	validator is `tools/lib/outline-schema.mjs`; this is the readable form.
5	
6	## A proposal (what the skill writes)
7	
8	```json
9	{
10	  "mode": "argument",
11	  "title": "Why the roadmap must be a file",
12	  "thesis": "A plan that is not a file under version control is not a plan.",
13	  "nodes": [
14	    { "id": "n1", "kind": "claim", "parent": null, "order": 1,
15	      "text": "A plan lives where the work lives, or it is not read.",
16	      "evidence": [ { "slot": "e1", "filled_by": "three retrospectives: checked-in plans survived" } ] },
17	    { "id": "n2", "kind": "claim", "parent": null, "order": 2,
18	      "text": "A plan and a codebase drift the moment either moves.",
19	      "evidence": [ { "slot": "e1", "filled_by": null } ] },
20	    { "id": "n3", "kind": "open-question", "parent": "n2", "order": 1,
21	      "text": "Which check catches the drift — a script, or a reviewer?" }
22	  ],
23	  "source": { "brief_digest": null, "draft_digest": null }
24	}
25	```
26	
27	The store adds the envelope (`schema`, `id` = project, `revision`,
28	`parent_digest`) on save. A proposal file may carry those keys; they are
29	dropped and replaced.
30	
31	## Fields
32	
33	| Field | Rule |
34	|---|---|
35	| `mode` | `argument` or `beat-sheet`. One schema, two node vocabularies. |
36	| `title` | Required. |
37	| `thesis` | Required — **or `null`**, and then at least one `open-question` node must say what is missing. In beat-sheet mode this is the premise. |
38	| `nodes[].id` | `n1`, `n2`, … Unique. **Stable across revisions**: the differ keys on ids and never matches by text. Reuse ids when revising; never renumber. |
39	| `nodes[].kind` | argument: `claim`, `evidence-slot`, `open-question`. beat-sheet: `act`, `beat`, `turn`, `open-question`. |
40	| `nodes[].text` | Required. |
41	| `nodes[].parent` | `null` or an existing id. |
42	| `nodes[].order` | Integer ≥ 1; position among siblings. |
43	| `nodes[].evidence` | Claims only. An array of `{ slot: "e1", filled_by: "<pointer>" \| null }`. May be empty, but a concrete brief should give every claim at least one slot. `filled_by` is a pointer in the writer's words; item E may later point it at a research-ledger id. |
44	| `source` | Optional. `brief_digest` / `draft_digest`: sha256 of the inputs the proposal was made from, or null. |
45	
46	## Planning fields (optional)
47	
48	Added for candidate mode. Validated when present; a reader that predates them
49	ignores them, so the schema stays `voice-outline/1`.
50	
51	| Field | Rule |
52	|---|---|
53	| `length` | `{ "unit": "words", "min": 800, "max": 1100 }` — the band the piece is planned to; the brief's, when there is one. |
54	| `shape` | A shape name: `shapes/<name>.md` in this skill, or a personal shapes directory. Required when any node carries `part`. |
55	| `brief_ref` | `{ "project", "revision", "digest" }` — the brief revision the outline was made from. |
56	| `nodes[].part` | One of the shape's parts. A part may repeat (one node per question, one per lesson). |
57	| `nodes[].words` | A word budget, an integer ≥ 1. No node with a budget may sit under another node with one: it would be counted twice. |
58	| `nodes[].covers` | Brief decisions the node carries, e.g. `"must_include.0"`. |
59	
60	```json
61	{ "mode": "argument", "title": "Feed the starter", "thesis": "…",
62	  "shape": "problem-solution", "length": { "unit": "words", "min": 800, "max": 1100 },
63	  "nodes": [ { "id": "n1", "kind": "claim", "parent": null, "order": 1, "part": "problem", "words": 200,
64	               "text": "…", "evidence": [ { "slot": "e1", "filled_by": null } ] } ] }
65	```
66	
67	## What the differ reports
68	
69	`added`, `removed`, `moved` (position among the same siblings), `reparented`,
70	`reworded`, `kind_changed`, `evidence` (`slot-added`, `slot-removed`, `filled`,
71	`emptied`, `refilled`), and `unchanged`. A node whose id disappears is
72	`removed`; a new id is `added`, even with identical words.
73	
74	## What the checker enforces
75	
76	`tools/proposal-check.mjs <proposal> --brief <brief>` validates the body and,
77	when the brief's frontmatter carries `expect: concrete`, requires a thesis and
78	a slot on every claim; with `expect: underspecified`, requires a null thesis and
79	at least one open question. With `--shape` it requires every required part,
80	in the shape's order, and no part the shape lacks; with a length band it
… [5 more lines trimmed]
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

**Tool call — Bash:**

````
node <plugins>/prose-outline/skills/prose-outline/tools/shape-check.mjs
````

**Tool result:**

````
  ok   argument-essay.md (argument, 5 parts)
  ok   letter.md (argument, 3 parts)
  ok   narrative-arc.md (beat-sheet, 5 parts)
  ok   numbered-lessons.md (argument, 3 parts)
  ok   problem-solution.md (argument, 5 parts)
  ok   question-and-answer.md (argument, 3 parts)
````

**Tool call — Bash:**

````
cat <plugins>/prose-outline/skills/prose-outline/shapes/*.md
````

*[permission denied by the harness allowlist: "Bash"]*

**Tool result (error):**

````
cat in '<plugins>/prose-outline/skills/prose-outline/shapes' was blocked. For security, Claude Code may only concatenate files from the allowed working directories for this session: '<draw>/work'.
````

**Tool call — Read:**

````
{
 "file_path": "<plugins>/prose-outline/skills/prose-outline/shapes/narrative-arc.md"
}
````

**Tool result:**

````
1	---
2	name: narrative-arc
3	mode: beat-sheet
4	parts:
5	  - setup | required | 0.10-0.25
6	  - inciting-moment | required | 0.05-0.15
7	  - complication | required | 0.20-0.40
8	  - turn | required | 0.10-0.20
9	  - resolution | required | 0.10-0.25
10	good_for: essay, newsletter, story, talk
11	length_hint: 500-5000
12	---
13	A story told for what it shows: a situation, the moment it changes, what gets
14	harder, the turn where something is understood or decided, and where that
15	leaves the people in it. It works when one concrete story carries the idea and
16	the idea can arrive late. It fails when the setup runs long because the writer
17	is circling the point, or when the resolution explains what the story already
18	showed.
19	
````

**Tool call — Read:**

````
{
 "file_path": "<plugins>/prose-outline/skills/prose-outline/shapes/letter.md"
}
````

**Tool result:**

````
1	---
2	name: letter
3	mode: argument
4	parts:
5	  - occasion | required | 0.05-0.15
6	  - body | required | 0.60-0.85
7	  - ask | required | 0.05-0.20
8	good_for: newsletter, open-letter, note-to-team
9	length_hint: 200-1500
10	---
11	Written to someone, about something: the occasion that prompts it, what the
12	writer wants them to understand, and what the writer is asking of them. It
13	works when the relationship between writer and reader is part of the point and
14	the voice can be direct. It fails when the addressee is a pretext and the piece
15	is really an essay with a salutation on it.
16	
````

**Tool call — Read:**

````
{
 "file_path": "<plugins>/prose-outline/skills/prose-outline/shapes/numbered-lessons.md"
}
````

**Tool result:**

````
1	---
2	name: numbered-lessons
3	mode: argument
4	parts:
5	  - intro | required | 0.05-0.15
6	  - lesson | required | 0.65-0.90
7	  - close | required | 0.05-0.15
8	good_for: newsletter, linkedin-post, blog-post
9	length_hint: 400-2500
10	---
11	An introduction that says where the lessons come from, then a run of numbered
12	lessons, each with its own example, then a close that ties them together. The
13	`lesson` part repeats, one node per lesson. It works when the material really
14	is several separate things learned from one experience. It fails when the
15	lessons are the same lesson restated, or when the numbers are doing the work an
16	argument should.
17	
````

**Tool call — Read:**

````
{
 "file_path": "<plugins>/prose-outline/skills/prose-outline/shapes/argument-essay.md"
}
````

**Tool result:**

````
1	---
2	name: argument-essay
3	mode: argument
4	parts:
5	  - hook | optional | 0.05-0.15
6	  - thesis | required | 0.05-0.15
7	  - support | required | 0.40-0.70
8	  - counterargument | optional | 0.10-0.20
9	  - conclusion | required | 0.05-0.15
10	good_for: essay, newsletter, op-ed
11	length_hint: 600-3000
12	---
13	The classic shape: say what you argue early, earn it with support, take the
14	strongest objection seriously, and end on what follows from it. It works when
15	the writer has one claim and several kinds of evidence for it. It fails as a
16	list of points that share a topic but not a claim, and when the counterargument
17	is a straw figure the reader can see through.
18	
````

**Tool call — Read:**

````
{
 "file_path": "<plugins>/prose-outline/skills/prose-outline/shapes/problem-solution.md"
}
````

**Tool result:**

````
1	---
2	name: problem-solution
3	mode: argument
4	parts:
5	  - problem | required | 0.15-0.30
6	  - stakes | required | 0.05-0.20
7	  - solution | required | 0.30-0.55
8	  - objection | optional | 0.05-0.20
9	  - close | required | 0.05-0.15
10	good_for: newsletter, essay, linkedin-post, memo
11	length_hint: 400-2500
12	---
13	Name a problem the reader recognises, say what it costs, propose what to do,
14	meet the obvious objection, and close on the first step. It works for proposals
15	and process changes, where the reader has to agree the problem is real before
16	any solution sounds necessary. It fails when the problem is stated in the
17	abstract, or the solution arrives before the stakes have made anyone care.
18	
````

**Tool call — Read:**

````
{
 "file_path": "<plugins>/prose-outline/skills/prose-outline/shapes/question-and-answer.md"
}
````

**Tool result:**

````
1	---
2	name: question-and-answer
3	mode: argument
4	parts:
5	  - framing | required | 0.05-0.15
6	  - question | required | 0.60-0.90
7	  - close | optional | 0.05-0.15
8	good_for: newsletter, explainer, faq, interview-writeup
9	length_hint: 500-3000
10	---
11	A short framing, then the questions a reader would actually ask, each answered
12	in turn; the `question` part repeats, one node per question, and its share is
13	the sum of them. It works when the reader arrives with questions and wants to
14	skip to theirs. It fails when the questions are the writer's talking points
15	dressed up, or when the answers lean on each other so they cannot be read
16	alone.
17	
````

**Tool call — Glob:**

````
{
 "pattern": "**/*"
}
````

**Tool result:**

````
brief.json
````

**Assistant:**

Only one shape fits the brief's 200–300 word band, so I'm drafting that one candidate and running the checker on it.

**Tool call — Bash:**

````
sha256sum <draw>/work/brief.json
````

**Tool result:**

````
233c9c53e4334086b660bd9ed68581e30f00f7939972ceca72c950d8eb17d697  <draw>/work/brief.json
````

**Tool call — Write:**

````
<task>/candidate-letter.json
{
  "mode": "argument",
  "title": "The starter is the bakery",
  "thesis": "The slow invisible part of the work decides the result, long before anyone sees it.",
  "shape": "letter",
  "length": { "unit": "words", "min": 200, "max": 300 },
  "brief_ref": { "project": null, "revision": 4, "digest": "233c9c53e4334086b660bd9ed68581e30f00f7939972ceca72c950d8eb17d697" },
  "nodes": [
    { "id": "n1", "kind": "claim", "parent": null, "order": 1, "part": "occasion", "words": 30,
      "text": "To team leads who reward what they can see: here is a story about what you can't see yet.",
      "evidence": [ { "slot": "e1", "filled_by": null } ] },
    { "id": "n2", "kind": "claim", "parent": null, "order": 2, "part": "body", "words": 100,
      "text": "The month of feeding the starter is where the bread is made; nothing done at the oven can rescue a weak one.",
      "covers": ["must_include.0"],
      "evidence": [ { "slot": "e1", "filled_by": "transcript s1 line 5: \"If the starter is weak, the loaves come out flat and sour and nobody can fix that at the oven.\"" } ] },
    { "id": "n3", "kind": "claim", "parent": null, "order": 3, "part": "body", "words": 90,
      "text": "The eleven years of notebooks are the same slow invisible work, kept up long enough to become judgement.",
      "covers": ["must_include.1"],
      "evidence": [
        { "slot": "e1", "filled_by": null },
        { "slot": "e2", "filled_by": "transcript s2 line 9: \"That was the moment she knew he would be good.\"" } ] },
    { "id": "n4", "kind": "open-question", "parent": "n3", "order": 1,
      "text": "The brief has no detail on the notebooks: whose they are, what is in them, and how they connect to the moment in s2 line 9." },
    { "id": "n5", "kind": "claim", "parent": null, "order": 4, "part": "ask", "words": 40,
      "text": "Protect the unglamorous early work on your team before it has anything to show.",
      "evidence": [ { "slot": "e1", "filled_by": null } ] },
    { "id": "n6", "kind": "open-question", "parent": "n5", "order": 1,
      "text": "What does protecting it look like in practice? The brief states the purpose but names no concrete action for the reader to take." }
  ],
  "source": { "brief_digest": "233c9c53e4334086b660bd9ed68581e30f00f7939972ceca72c950d8eb17d697", "draft_digest": null }
}

````

**Tool result:**

````
File created successfully at: <task>/candidate-letter.json (file state is current in your context — no need to Read it back)
````

**Tool call — Bash:**

````
node <plugins>/prose-outline/skills/prose-outline/tools/proposal-check.mjs <task>/candidate-letter.json --shape <plugins>/prose-outline/skills/prose-outline/shapes/letter.md --brief-json <draw>/work/brief.json
````

**Tool result (error):**

````
Exit code 1
proposal-check — invalid
  invalid: brief_ref must be { project, revision, digest }
  limit: Whether these are the right claims, in the right order, is not checked here.
````

**Tool call — Bash:**

````
node <plugins>/prose-outline/skills/prose-brainstorm/tools/brief-store.mjs --help 2>&1 | head -30; node <plugins>/prose-outline/skills/prose-brainstorm/tools/brief-store.mjs list 2>&1 | head -20
````

**Tool result:**

````
{
  "status": "usage",
  "reason": "brief-store: locate | show | list | add-source | save | decide | undo"
}
{
  "status": "usage",
  "reason": "brief-store list: missing --project"
}
````

**Tool call — Bash:**

````
node <plugins>/prose-outline/skills/prose-brainstorm/tools/brief-store.mjs locate 2>&1
````

**Tool result:**

````
{
  "status": "located",
  "registry": "<draw>/store/registry",
  "projects_dir": "<draw>/store/projects",
  "registry_state": "selected",
  "identity": "personal",
  "registry_revision": 2,
  "directory": null,
  "sources_dir": null
}
````

**Tool call — Bash:**

````
ls -R <draw>/store/projects
````

*[permission denied by the harness allowlist: "Bash"]*

**Tool result (error):**

````
ls in '<draw>/store/projects' was blocked. For security, Claude Code may only list files in the allowed working directories for this session: '<draw>/work'.
````

**Tool call — Glob:**

````
{
 "pattern": "*",
 "path": "<draw>/store/projects"
}
````

**Tool result:**

````
No files found
````

**Assistant:**

The brief store is empty, so the brief exists only as `brief.json`. I'm pointing the reference at that file and re-checking.

**Tool call — Bash:**

````
P=<task>/candidate-letter.json; sed -i 's/"project": null/"project": "brief.json"/' $P; T=<plugins>/prose-outline/skills/prose-outline; B=<draw>/work/brief.json; node $T/tools/proposal-check.mjs $P --shape $T/shapes/letter.md --brief-json $B; node $T/tools/outline-compare.mjs $P --brief-json $B
````

*[permission denied by the harness allowlist: "Bash"]*

**Tool result (error):**

````
A variable in this command can't be checked before it runs
````

**Tool call — Edit:**

````
{
 "replace_all": false,
 "file_path": "<task>/candidate-letter.json",
 "old_string": "\"project\": null",
 "new_string": "\"project\": \"brief.json\""
}
````

**Tool result:**

````
The file <task>/candidate-letter.json has been updated successfully. (file state is current in your context — no need to Read it back)
````

**Tool call — Bash:**

````
node <plugins>/prose-outline/skills/prose-outline/tools/proposal-check.mjs <task>/candidate-letter.json --shape <plugins>/prose-outline/skills/prose-outline/shapes/letter.md --brief-json <draw>/work/brief.json
````

**Tool result (error):**

````
Exit code 1
proposal-check — invalid
  invalid: brief_ref must be { project, revision, digest }
  limit: Whether these are the right claims, in the right order, is not checked here.
````

**Tool call — Grep:**

````
{
 "pattern": "brief_ref",
 "path": "<plugins>/prose-outline/skills/prose-outline/tools",
 "output_mode": "content",
 "-C": 4
}
````

**Tool result:**

````
<plugins>/prose-outline/skills/prose-outline/tools/lib/outline-schema.mjs-13- * Optional fields (roadmap item J), validated when present and ignored by
<plugins>/prose-outline/skills/prose-outline/tools/lib/outline-schema.mjs-14- * readers that predate them, so the schema id stays voice-outline/1:
<plugins>/prose-outline/skills/prose-outline/tools/lib/outline-schema.mjs-15- *   length     { unit: "words", min, max } — the band the piece is planned to
<plugins>/prose-outline/skills/prose-outline/tools/lib/outline-schema.mjs-16- *   shape      the shape name (shapes/<name>.md)
<plugins>/prose-outline/skills/prose-outline/tools/lib/outline-schema.mjs:17: *   brief_ref  { project, revision, digest } — the brief the outline came from
<plugins>/prose-outline/skills/prose-outline/tools/lib/outline-schema.mjs-18- *   nodes[].part    which of the shape's parts a node belongs to
<plugins>/prose-outline/skills/prose-outline/tools/lib/outline-schema.mjs-19- *   nodes[].words   the node's word budget; no node with a budget sits under another
<plugins>/prose-outline/skills/prose-outline/tools/lib/outline-schema.mjs-20- *   nodes[].covers  brief decisions the node carries, e.g. "must_include.0"
<plugins>/prose-outline/skills/prose-outline/tools/lib/outline-schema.mjs-21- * Any other unknown key is still ignored, as it always was.
--
<plugins>/prose-outline/skills/prose-outline/tools/lib/outline-schema.mjs-94-
<plugins>/prose-outline/skills/prose-outline/tools/lib/outline-schema.mjs-95-/** Children of `parent` in order. */
<plugins>/prose-outline/skills/prose-outline/tools/lib/outline-schema.mjs-96-export const children = (body, parent) => body.nodes.filter((n) => n.parent === parent).sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
<plugins>/prose-outline/skills/prose-outline/tools/lib/outline-schema.mjs-97-
<plugins>/prose-outline/skills/prose-outline/tools/lib/outline-schema.mjs:98:/** The optional planning fields (item J): length, shape, brief_ref, and per-node part, words, covers. */
<plugins>/prose-outline/skills/prose-outline/tools/lib/outline-schema.mjs-99-export function validatePlanFields(body) {
<plugins>/prose-outline/skills/prose-outline/tools/lib/outline-schema.mjs-100-  const errors = [];
<plugins>/prose-outline/skills/prose-outline/tools/lib/outline-schema.mjs-101-  if (body.length !== undefined) {
<plugins>/prose-outline/skills/prose-outline/tools/lib/outline-schema.mjs-102-    const l = body.length;
<plugins>/prose-outline/skills/prose-outline/tools/lib/outline-schema.mjs-103-    if (!isObject(l) || l.unit !== "words" || !Number.isInteger(l.min) || !Number.isInteger(l.max) || l.min < 1 || l.min > l.max || Object.keys(l).some((k) => !["unit", "min", "max"].includes(k))) errors.push('length must be { unit: "words", min, max } with 1 ≤ min ≤ max');
<plugins>/prose-outline/skills/prose-outline/tools/lib/outline-schema.mjs-104-  }
<plugins>/prose-outline/skills/prose-outline/tools/lib/outline-schema.mjs-105-  if (body.shape !== undefined && !TOKEN.test(body.shape ?? "")) errors.push("shape must be a shape name (a lower-case token)");
<plugins>/prose-outline/skills/prose-outline/tools/lib/outline-schema.mjs:106:  if (body.brief_ref !== undefined) {
<plugins>/prose-outline/skills/prose-outline/tools/lib/outline-schema.mjs:107:    const b = body.brief_ref;
<plugins>/prose-outline/skills/prose-outline/tools/lib/outline-schema.mjs:108:    if (!isObject(b) || !PROJECT.test(b.project ?? "") || !Number.isInteger(b.revision) || b.revision < 1 || !DIGEST.test(b.digest ?? "") || Object.keys(b).some((k) => !["project", "revision", "digest"].includes(k))) errors.push("brief_ref must be { project, revision, digest }");
<plugins>/prose-outline/skills/prose-outline/tools/lib/outline-schema.mjs-109-  }
<plugins>/prose-outline/skills/prose-outline/tools/lib/outline-schema.mjs-110-  const byId = new Map((body.nodes ?? []).map((n) => [n?.id, n]));
<plugins>/prose-outline/skills/prose-outline/tools/lib/outline-schema.mjs-111-  for (const n of body.nodes ?? []) {
<plugins>/prose-outline/skills/prose-outline/tools/lib/outline-schema.mjs-112-    const where = `node ${n?.id ?? "?"}`;
````

**Assistant:**

The checker needs a stored project name for `brief_ref`, and there isn't one. Rather than make one up, I'm removing that optional field. The brief's digest is still recorded under `source`.

**Tool call — Edit:**

````
{
 "replace_all": false,
 "file_path": "<task>/candidate-letter.json",
 "old_string": "  \"brief_ref\": { \"project\": \"brief.json\", \"revision\": 4, \"digest\": \"233c9c53e4334086b660bd9ed68581e30f00f7939972ceca72c950d8eb17d697\" },\n",
 "new_string": ""
}
````

**Tool result:**

````
The file <task>/candidate-letter.json has been updated successfully. (file state is current in your context — no need to Read it back)
````

**Tool call — Bash:**

````
node <plugins>/prose-outline/skills/prose-outline/tools/proposal-check.mjs <task>/candidate-letter.json --shape <plugins>/prose-outline/skills/prose-outline/shapes/letter.md --brief-json <draw>/work/brief.json
````

**Tool result:**

````
proposal-check — clean
  4 claims, 2 open questions, 3 empty evidence slots
  limit: Whether these are the right claims, in the right order, is not checked here.
````

**Tool call — Bash:**

````
node <plugins>/prose-outline/skills/prose-outline/tools/outline-compare.mjs <task>/candidate-letter.json --brief-json <draw>/work/brief.json 2>&1
````

**Tool result (error):**

````
Exit code 2
Usage: node outline-compare.mjs <a.json> <b.json> [c.json …] [--brief-json brief.json] [--shapes-dir DIR] [--json]
````

**Assistant:**

I can only show you one candidate, not two or three. Your brief caps the piece at 200–300 words, and only one of the six shapes is meant for anything that short: **letter** (200–1500).

That clashes with your brief. You confirmed **narrative-arc** as the shape, but it's meant for 500–5000 words. The other shapes start at 400 or more (argument essay at 600, Q&A at 500, problem–solution and numbered lessons at 400). Offering a second shape that doesn't fit the length wouldn't be a real choice.

## Candidate: letter (260 words of 200–300)

**Thesis:** The slow invisible part of the work decides the result, long before anyone sees it.

| id | part | words | node | evidence |
|---|---|---|---|---|
| n1 | occasion | 30 | To team leads who reward what they can see: here is a story about what you can't see yet. | e1: *empty* |
| n2 | body | 100 | The month of feeding the starter is where the bread is made; nothing done at the oven can rescue a weak one. *(covers `must_include.0`)* | e1: transcript s1 l.5, "If the starter is weak, the loaves come out flat and sour and nobody can fix that at the oven." |
| n3 | body | 90 | The eleven years of notebooks are the same slow invisible work, kept up long enough to become judgement. *(covers `must_include.1`)* | e1: *empty* · e2: transcript s2 l.9, "That was the moment she knew he would be good." |
| ↳ n4 | open question | — | The brief has no detail on the notebooks: whose they are, what is in them, and how they connect to the moment in s2 l.9. | |
| n5 | ask | 40 | Protect the unglamorous early work on your team before it has anything to show. | e1: *empty* |
| ↳ n6 | open question | — | What does protecting it look like in practice? The brief states the purpose but names no concrete action for the reader to take. | |

- **Check:** the checker found no problems. Both must-include items are covered, the budgets add up to 260 words, and each part's share of the length is within the letter shape's range.
- **Empty evidence slots:** three are left empty on purpose. The brief only gives two quotes, and I haven't filled the gaps with anything that merely sounds plausible. The transcript itself isn't in this folder.
- **No comparison table:** the comparison tool needs at least two outlines, so there's nothing to compare against.
- **Brief reference:** the outline doesn't carry its optional link back to the brief, because the brief isn't saved under a project name. The brief's fingerprint is still recorded in the outline.

## What would get you a real choice
1. **Keep 200–300 words and use the letter**, as above.
2. **Raise the length to at least 500 words.** Narrative-arc (your confirmed shape) would then fit, and so would problem–solution, numbered lessons and Q&A, so I could show you a proper set of two or three side by side.
3. **Keep narrative-arc at 200–300 anyway.** I'd draft it, but note that it's below the length the shape is meant for. That's your call to make.

Which would you like?

The candidate is task-local at `<task>/candidate-letter.json`. Nothing is saved yet. When you've picked an outline, I'll look for the outline store and save it only after you say yes.

*turn ended: success, 27 model turns, $0.56*

## Turn 2

*model reported by init: `claude-opus-5-5`*

**Writer:**

> Option 1, I'll go with the letter as it is.

**Tool call — Bash:**

````
node <plugins>/prose-outline/skills/prose-outline/tools/outline-store.mjs locate
````

**Tool result:**

````
{
  "status": "located",
  "registry": "<draw>/store/registry",
  "projects_dir": "<draw>/store/projects",
  "registry_state": "selected",
  "identity": "personal",
  "registry_revision": 2,
  "directory": null
}
````

**Tool call — Bash:**

````
node <plugins>/prose-outline/skills/prose-outline/tools/outline-store.mjs show --project starter-is-the-bakery; node <plugins>/prose-outline/skills/prose-outline/tools/outline-store.mjs save --proposal <task>/candidate-letter.json --project starter-is-the-bakery --expected-revision 0
````

**Tool result:**

````
{
  "status": "error",
  "reason": "No outline saved for project starter-is-the-bakery"
}
{
  "status": "proposal",
  "identity": "personal",
  "project": "starter-is-the-bakery",
  "directory": "<draw>/store/projects/personal/starter-is-the-bakery/outlines",
  "proposal": {
    "schema": "voice-outline/1",
    "id": "starter-is-the-bakery",
    "revision": 1,
    "parent_digest": null,
    "mode": "argument",
    "title": "The starter is the bakery",
    "thesis": "The slow invisible part of the work decides the result, long before anyone sees it.",
    "shape": "letter",
    "length": {
      "unit": "words",
      "min": 200,
      "max": 300
    },
    "nodes": [
      {
        "id": "n1",
        "kind": "claim",
        "parent": null,
        "order": 1,
        "part": "occasion",
        "words": 30,
        "text": "To team leads who reward what they can see: here is a story about what you can't see yet.",
        "evidence": [
          {
            "slot": "e1",
            "filled_by": null
          }
        ]
      },
      {
        "id": "n2",
        "kind": "claim",
        "parent": null,
        "order": 2,
        "part": "body",
        "words": 100,
        "text": "The month of feeding the starter is where the bread is made; nothing done at the oven can rescue a weak one.",
        "covers": [
          "must_include.0"
        ],
        "evidence": [
          {
            "slot": "e1",
            "filled_by": "transcript s1 line 5: \"If the starter is weak, the loaves come out flat and sour and nobody can fix that at the oven.\""
          }
        ]
      },
      {
        "id": "n3",
        "kind": "claim",
        "parent": null,
        "order": 3,
        "part": "body",
        "words": 90,
        "text": "The eleven years of notebooks are the same slow invisible work, kept up long enough to become judgement.",
        "covers": [
          "must_include.1"
        ],
        "evidence": [
          {
            "slot": "e1",
            "filled_by": null
          },
          {
            "slot": "e2",
            "filled_by": "transcript s2 line 9: \"That was the moment she knew he would be good.\""
          }
        ]
      },
      {
… [36 more lines trimmed]
````

**Assistant:**

The outline store is set up under the identity `personal`. Your brief doesn't have a project name, so I'm saving under one made from the outline's title.

**Tool call — Bash:**

````
node <plugins>/prose-outline/skills/prose-outline/tools/outline-store.mjs save --proposal <task>/candidate-letter.json --project starter-is-the-bakery --expected-revision 0 --approved 2>&1 | tail -15
````

**Tool result:**

````
{
  "status": "saved",
  "identity": "personal",
  "project": "starter-is-the-bakery",
  "directory": "<draw>/store/projects/personal/starter-is-the-bakery/outlines",
  "revision": 1,
  "receipt": {
    "revision": 1,
    "parent_digest": null,
    "undo": "Undo restores revision 0 as a new revision; history is preserved."
  }
}
````

**Assistant:**

I've saved the letter outline exactly as you approved it, as **revision 1** of project **`starter-is-the-bakery`** under your **`personal`** identity.

- **Project name:** your brief didn't have one, so I made this one from the outline's title. If you'd prefer another name, tell me and I'll save it under that instead.
- **Undo:** `undo` brings back the previous state (no outline) as a new revision, so the saved version stays in the history.
- **Still open:** three evidence slots are empty, and two questions are unanswered: what the notebooks are and how they connect to the "she knew he would be good" moment, and what "protecting" the early work looks like in practice. It's worth answering both before drafting, or while you draft.

When you're ready to write, `prose-draft` can take it from this outline.

*turn ended: success, 4 model turns, $0.67*

