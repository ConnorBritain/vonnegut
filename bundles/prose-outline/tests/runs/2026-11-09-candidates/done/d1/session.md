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
cd <plugins>/prose-outline/skills/prose-outline; cat references/outline-schema.md; echo ----; ls shapes tools; echo ----; cat <draw>/work/brief.json; echo ----; node tools/shape-check.mjs
````

*[permission denied by the harness allowlist: "Bash"]*

**Tool result (error):**

````
cd in '<plugins>/prose-outline/skills/prose-outline' was blocked. For security, Claude Code may only change directories to the allowed working directories for this session: '<draw>/work'.
````

**Tool call — Bash:**

````
S=<plugins>/prose-outline/skills/prose-outline; cat $S/references/outline-schema.md; echo ----; ls $S/shapes $S/tools; echo ----; cat brief.json; echo ----; node $S/tools/shape-check.mjs
````

*[permission denied by the harness allowlist: "Bash"]*

**Tool result (error):**

````
This Bash command contains multiple operations. The following parts require approval: cat <plugins>/prose-outline/skills/prose-outline/references/outline-schema.md, echo ----, ls <plugins>/prose-outline/skills/prose-outline/shapes <plugins>/prose-outline/skills/prose-outline/tools
````

**Assistant:**

Using the dedicated tools instead.

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

**Tool call — Glob:**

````
{
 "pattern": "**/*",
 "path": "<plugins>/prose-outline/skills/prose-outline"
}
````

**Tool result:**

````
<plugins>/prose-outline/skills/prose-outline/meta.yaml
<plugins>/prose-outline/skills/prose-outline/tools/outline-store.mjs
<plugins>/prose-outline/skills/prose-outline/tools/lib/text-index.mjs
<plugins>/prose-outline/skills/prose-outline/tools/lib/registry-reader.mjs
<plugins>/prose-outline/skills/prose-outline/tools/outline-diff.mjs
<plugins>/prose-outline/skills/prose-outline/tools/outline-scan.mjs
<plugins>/prose-outline/skills/prose-outline/references/outline-schema.md
<plugins>/prose-outline/skills/prose-outline/shapes/letter.md
<plugins>/prose-outline/skills/prose-outline/shapes/numbered-lessons.md
<plugins>/prose-outline/skills/prose-outline/shapes/narrative-arc.md
<plugins>/prose-outline/skills/prose-outline/shapes/question-and-answer.md
<plugins>/prose-outline/skills/prose-outline/shapes/problem-solution.md
<plugins>/prose-outline/skills/prose-outline/shapes/argument-essay.md
<plugins>/prose-outline/skills/prose-outline/SKILL.md
<plugins>/prose-outline/skills/prose-outline/tools/shape-check.mjs
<plugins>/prose-outline/skills/prose-outline/tools/lib/shape.mjs
<plugins>/prose-outline/skills/prose-outline/tools/lib/revision-store.mjs
<plugins>/prose-outline/skills/prose-outline/tools/lib/outline-schema.mjs
<plugins>/prose-outline/skills/prose-outline/tools/outline-compare.mjs
<plugins>/prose-outline/skills/prose-outline/tools/proposal-check.mjs
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
 "pattern": "**/sources/ab20ffe8*",
 "path": "<scratch>"
}
````

**Tool result:**

````
<draw>/store/projects/personal/starter/brief/sources/ab20ffe81d2e1d97296cabb366bcce5c0a23608bf1249e83be2e1a39fa82f5d2.txt
<draw>/store/projects/personal/starter/brief/sources/ab20ffe81d2e1d97296cabb366bcce5c0a23608bf1249e83be2e1a39fa82f5d2.txt
<draw>/store/projects/personal/starter/brief/sources/ab20ffe81d2e1d97296cabb366bcce5c0a23608bf1249e83be2e1a39fa82f5d2.txt
````

**Tool call — Bash:**

````
node <plugins>/prose-outline/skills/prose-outline/tools/proposal-check.mjs --help 2>&1 | head -40
````

**Tool result:**

````
Usage: node proposal-check.mjs <proposal.json> [--brief <brief.md>] [--shape <shapes/x.md>] [--brief-json <brief.json>] [--json]
````

**Assistant:**

The brief's source transcript is cached elsewhere under the same digest. Reading it so the beats rest on what you actually said.

**Tool call — Read:**

````
{
 "file_path": "<draw>/store/projects/personal/starter/brief/sources/ab20ffe81d2e1d97296cabb366bcce5c0a23608bf1249e83be2e1a39fa82f5d2.txt"
}
````

**Tool result:**

````
1	Okay, so this is a voice memo about the bakery thing, and then maybe the meetings thing, and I want to get it down before I lose it.
2	
3	So my neighbour has run a sourdough bakery on the corner for eleven years, and last week I asked her how she trains new bakers. And she said, um, the first month they are not allowed to shape a single loaf. They feed the starter. They clean the proofing baskets. They watch the dough rise in the cold room overnight and they write down the temperature every morning. And I thought that was kind of brutal, honestly, like a month of feeding flour and water to a jar.
4	
5	But she said the starter is the whole bakery. If the starter is weak, the loaves come out flat and sour and nobody can fix that at the oven. You can't rescue bad fermentation with good scoring. The bakers who rush the starter never understand why their bread fails, because the failure happened twelve hours before they touched the dough.
6	
7	And she keeps a notebook for every batch, the flour, the hydration, the room temperature, how long the bulk ferment took. Eleven years of notebooks on a shelf above the ovens. When a loaf goes wrong she reads back through the notebook and she can usually find the day the starter got tired. That struck me, you know, the patience of reading back through your own records instead of guessing.
8	
9	Her best baker, the one who runs the early shift now, apparently hated the first month. He thought it was hazing. And then about three weeks in he noticed the dough rising slower on rainy days and he started adjusting the water temperature on his own. That was the moment she knew he would be good. Not his shaping, not his scoring, the fact that he noticed the starter.
10	
11	So the bread part is really about patience with the slow invisible part of the work, the part that happens before anyone sees anything.
12	
13	Anyway. The other thing I keep thinking about is our weekly team meeting, which has become, um, kind of a disaster. It is ninety minutes on a video call every Monday and half the agenda is status updates that could be a written document. People read their updates out loud from a slide. Nobody asks a question. The engineers keep their cameras off and work on other tickets, and honestly I don't blame them.
14	
15	I counted last Monday and we spent seventy minutes on updates and twenty minutes on the one decision that actually mattered, which was whether to delay the billing migration. And that decision got rushed because the meeting was already over time. So the agenda is upside down. The thing that needs the whole room gets the least time.
16	
17	What I want to try is a written update document that everyone fills in by Friday, and then the Monday meeting is only for decisions and disagreements. If there is no decision on the agenda, we cancel the meeting. I think the managers will hate that, because the meeting is where they feel informed, but the engineers will love it.
18	
19	There is a risk, I mean, that the written updates turn into a wall nobody reads. I have seen that at the last company. The update document grew to forty pages and people skimmed it. So maybe the rule is each update is three lines, what changed, what is blocked, what decision you need. Three lines and a link.
20	
21	And the meeting facilitator should change every week, so it is not always the manager running the agenda. That spreads the ownership around. I have read that some teams do a silent reading start, ten minutes where everyone reads the document on the call before talking. I want to try that too.
22	
23	Okay, last thing, and this one is more personal. I have been trying to write in public for about two years, short essays, mostly on a newsletter, and I keep stalling because every draft feels too small. I start an essay about something huge, like the future of work, and three paragraphs in I realise I have nothing specific to say about the future of work. I have a feeling, not an argument.
24	
25	The essays that actually landed with readers were all small and concrete. The one about my grandfather's toolbox. The one about the parking garage attendant who knew every car. Readers wrote back to those. Nobody wrote back to the big abstract ones. So why do I keep starting with the abstract?
26	
27	I think I start big because I want the essay to matter, and small feels like it does not matter. But the small specific thing is the only way a reader gets in. The toolbox essay was really about inheritance and silence between generations, but nobody would have read an essay titled inheritance and silence.
28	
29	Maybe the rule for my newsletter is start with one object or one person, and let the big idea show up on its own by the end, or not at all. Write the toolbox, not the thesis. I could even go back through my drafts folder, which has like thirty abandoned essays, and see which ones have a concrete thing hiding in them.
30	
31	And honestly this connects back to the bakery, doesn't it? The small invisible daily thing, the starter, the notebook, the toolbox. Maybe that is the actual essay. I don't know yet. Is it one piece or three pieces? I genuinely can't tell.
32	
33	Okay that is enough for now. I want to come back to the meeting one this week because the team needs it, and the bakery one feels like the best story I have heard in months.
34	
````

**Tool call — Bash:**

````
sha256sum <draw>/store/projects/personal/starter/brief/sources/ab20ffe81d2e1d97296cabb366bcce5c0a23608bf1249e83be2e1a39fa82f5d2.txt
````

*[permission denied by the harness allowlist: "Bash"]*

**Tool result (error):**

````
sha256sum in '<draw>/store/projects/personal/starter/brief/sources/ab20ffe81d2e1d97296cabb366bcce5c0a23608bf1249e83be2e1a39fa82f5d2.txt' was blocked. For security, Claude Code may only compute SHA-256 checksums for files in the allowed working directories for this session: '<draw>/work'.
````

**Assistant:**

Transcript lines 5, 9 and 11 match the brief's quotes, so it's the right source. Checking what the checker expects for `brief_ref`:

**Tool call — Grep:**

````
{
 "pattern": "brief_ref|revision|digest",
 "path": "<plugins>/prose-outline/skills/prose-outline/tools",
 "glob": "{proposal-check,outline-compare,lib/outline-schema}.mjs",
 "output_mode": "content"
}
````

**Tool result:**

````
<plugins>/prose-outline/skills/prose-outline/tools/lib/outline-schema.mjs:10: * Node ids are stable across revisions and the differ keys on them. A node is
<plugins>/prose-outline/skills/prose-outline/tools/lib/outline-schema.mjs:17: *   brief_ref  { project, revision, digest } — the brief the outline came from
<plugins>/prose-outline/skills/prose-outline/tools/lib/outline-schema.mjs:42:  if (!Number.isInteger(doc.revision) || doc.revision < 1) errors.push("Revision must be an integer ≥ 1");
<plugins>/prose-outline/skills/prose-outline/tools/lib/outline-schema.mjs:43:  if (doc.revision === 1 ? doc.parent_digest !== null : !DIGEST.test(doc.parent_digest ?? "")) errors.push("Invalid revision ancestry");
<plugins>/prose-outline/skills/prose-outline/tools/lib/outline-schema.mjs:90:    else for (const key of ["brief_digest", "draft_digest"]) if (src[key] !== null && src[key] !== undefined && !DIGEST.test(src[key])) errors.push(`source.${key} must be a sha256 or null`);
<plugins>/prose-outline/skills/prose-outline/tools/lib/outline-schema.mjs:98:/** The optional planning fields (item J): length, shape, brief_ref, and per-node part, words, covers. */
<plugins>/prose-outline/skills/prose-outline/tools/lib/outline-schema.mjs:106:  if (body.brief_ref !== undefined) {
<plugins>/prose-outline/skills/prose-outline/tools/lib/outline-schema.mjs:107:    const b = body.brief_ref;
<plugins>/prose-outline/skills/prose-outline/tools/lib/outline-schema.mjs:108:    if (!isObject(b) || !PROJECT.test(b.project ?? "") || !Number.isInteger(b.revision) || b.revision < 1 || !DIGEST.test(b.digest ?? "") || Object.keys(b).some((k) => !["project", "revision", "digest"].includes(k))) errors.push("brief_ref must be { project, revision, digest }");
````

**Tool call — Bash:**

````
sha256sum brief.json
````

**Tool result:**

````
718a3caff0c9ea588f3505f13c1454961fd324ec4b4d6698ef293ae4e04d261e  brief.json
````

**Tool call — Write:**

````
<task>/cand-a-narrative-arc.json
{
  "mode": "beat-sheet",
  "title": "The starter is the bakery",
  "thesis": "The slow invisible part of the work decides the result, long before anyone sees it.",
  "shape": "narrative-arc",
  "length": { "unit": "words", "min": 800, "max": 1100 },
  "brief_ref": { "project": "starter", "revision": 4, "digest": "718a3caff0c9ea588f3505f13c1454961fd324ec4b4d6698ef293ae4e04d261e" },
  "nodes": [
    { "id": "n1", "kind": "act", "parent": null, "order": 1, "part": "setup", "words": 150,
      "text": "The neighbour's sourdough bakery on the corner, eleven years running; the writer asks how she trains new bakers." },
    { "id": "n2", "kind": "beat", "parent": null, "order": 2, "part": "inciting-moment", "words": 100,
      "covers": ["must_include.0"],
      "text": "Her answer: for the first month they may not shape a single loaf. They feed the starter, clean the proofing baskets, log the cold-room temperature every morning. The writer's first reaction: that sounds brutal." },
    { "id": "n3", "kind": "beat", "parent": null, "order": 3, "part": "complication", "words": 320,
      "covers": ["must_include.1"],
      "text": "Why: the starter is the whole bakery; a weak starter makes flat, sour loaves nobody can fix at the oven, and the failure happens twelve hours before anyone touches the dough. Her proof is the shelf above the ovens: eleven years of batch notebooks she reads back to find the day the starter got tired. Even her best baker hated the month and thought it was hazing." },
    { "id": "n4", "kind": "turn", "parent": null, "order": 4, "part": "turn", "words": 170,
      "text": "Three weeks in, he notices the dough rising slower on rainy days and adjusts the water temperature on his own. 'That was the moment she knew he would be good': not his shaping, not his scoring, the fact that he noticed the starter." },
    { "id": "n5", "kind": "beat", "parent": null, "order": 5, "part": "resolution", "words": 180,
      "text": "He runs the early shift now. The piece turns to the reader: what is the starter on your team, and who is being rewarded for noticing it?" },
    { "id": "n6", "kind": "open-question", "parent": "n5", "order": 1,
      "text": "The transcript gives no team-side example of 'the starter'. Does the resolution name one for team leads, or leave the reader to find their own? The shape warns against explaining what the story already showed." }
  ],
  "source": { "brief_digest": "718a3caff0c9ea588f3505f13c1454961fd324ec4b4d6698ef293ae4e04d261e", "draft_digest": null }
}

````

**Tool result:**

````
File created successfully at: <task>/cand-a-narrative-arc.json (file state is current in your context — no need to Read it back)
````

**Tool call — Write:**

````
<task>/cand-b-argument-essay.json
{
  "mode": "argument",
  "title": "The starter is the bakery",
  "thesis": "The slow invisible part of the work decides the result, long before anyone sees it.",
  "shape": "argument-essay",
  "length": { "unit": "words", "min": 800, "max": 1100 },
  "brief_ref": { "project": "starter", "revision": 4, "digest": "718a3caff0c9ea588f3505f13c1454961fd324ec4b4d6698ef293ae4e04d261e" },
  "nodes": [
    { "id": "n1", "kind": "claim", "parent": null, "order": 1, "part": "hook", "words": 100,
      "covers": ["must_include.0"],
      "text": "There is a bakery where new bakers are not allowed to shape a loaf for their first month. They feed the starter.",
      "evidence": [ { "slot": "e1", "filled_by": "transcript line 3: first month, feed the starter, clean baskets, log temperature" } ] },
    { "id": "n2", "kind": "claim", "parent": null, "order": 2, "part": "thesis", "words": 100,
      "text": "The slow invisible part of the work decides the result, long before anyone sees it, and team leads who reward visible output are rewarding the wrong end.",
      "evidence": [ { "slot": "e1", "filled_by": "transcript line 11: 'patience with the slow invisible part of the work'" } ] },
    { "id": "n3", "kind": "claim", "parent": null, "order": 3, "part": "support", "words": 220,
      "text": "The failure happens before anyone looks: a weak starter cannot be rescued at the oven.",
      "evidence": [ { "slot": "e1", "filled_by": "transcript line 5: flat and sour, 'nobody can fix that at the oven', failure twelve hours earlier" } ] },
    { "id": "n4", "kind": "claim", "parent": null, "order": 4, "part": "support", "words": 200,
      "covers": ["must_include.1"],
      "text": "A record of the slow part is how you find what went wrong instead of guessing.",
      "evidence": [ { "slot": "e1", "filled_by": "transcript line 7: eleven years of batch notebooks; reading back to the day the starter got tired" } ] },
    { "id": "n5", "kind": "claim", "parent": null, "order": 5, "part": "support", "words": 180,
      "text": "The person worth trusting is the one who notices the slow part, not the one with the best finish.",
      "evidence": [ { "slot": "e1", "filled_by": "transcript line 9: rainy-day rise, adjusting water temperature, 'the moment she knew he would be good'" } ] },
    { "id": "n6", "kind": "claim", "parent": null, "order": 6, "part": "counterargument", "words": 130,
      "text": "Objection: a month of groundwork is hazing that drives good people away. Answer: the baker who believed exactly that is the one who noticed the starter.",
      "evidence": [ { "slot": "e1", "filled_by": "transcript line 9: 'He thought it was hazing'" } ] },
    { "id": "n7", "kind": "claim", "parent": null, "order": 7, "part": "conclusion", "words": 90,
      "text": "What a team lead should protect: their team's starter.",
      "evidence": [ { "slot": "e1", "filled_by": null } ] },
    { "id": "n8", "kind": "open-question", "parent": "n7", "order": 1,
      "text": "The brief has no team-side example of protected groundwork. The conclusion needs one, or it ends on the analogy alone." }
  ],
  "source": { "brief_digest": "718a3caff0c9ea588f3505f13c1454961fd324ec4b4d6698ef293ae4e04d261e", "draft_digest": null }
}

````

**Tool result:**

````
File created successfully at: <task>/cand-b-argument-essay.json (file state is current in your context — no need to Read it back)
````

**Tool call — Write:**

````
<task>/cand-c-problem-solution.json
{
  "mode": "argument",
  "title": "Feed the starter",
  "thesis": "The slow invisible part of the work decides the result, long before anyone sees it.",
  "shape": "problem-solution",
  "length": { "unit": "words", "min": 800, "max": 1100 },
  "brief_ref": { "project": "starter", "revision": 4, "digest": "718a3caff0c9ea588f3505f13c1454961fd324ec4b4d6698ef293ae4e04d261e" },
  "nodes": [
    { "id": "n1", "kind": "claim", "parent": null, "order": 1, "part": "problem", "words": 230,
      "text": "Team leads reward what they can see, but the result is decided upstream, before anyone looks, the way bread fails twelve hours before the dough is touched.",
      "evidence": [
        { "slot": "e1", "filled_by": "transcript line 5: failure happened twelve hours before they touched the dough" },
        { "slot": "e2", "filled_by": null }
      ] },
    { "id": "n2", "kind": "open-question", "parent": "n1", "order": 1,
      "text": "The shape fails if the problem stays abstract. What team-side moment makes a team lead recognise it? The brief gives none (slot e2)." },
    { "id": "n3", "kind": "claim", "parent": null, "order": 2, "part": "stakes", "words": 150,
      "text": "Rush the groundwork and the failure can't be fixed at the end, and the people who rushed never learn why.",
      "evidence": [ { "slot": "e1", "filled_by": "transcript line 5: 'nobody can fix that at the oven'; rushers 'never understand why their bread fails'" } ] },
    { "id": "n4", "kind": "claim", "parent": null, "order": 3, "part": "solution", "words": 200,
      "covers": ["must_include.0"],
      "text": "Protect a stretch of slow work on purpose: the bakery's first month of feeding the starter, with no loaves shaped.",
      "evidence": [ { "slot": "e1", "filled_by": "transcript line 3: the first-month rule" } ] },
    { "id": "n5", "kind": "claim", "parent": null, "order": 4, "part": "solution", "words": 170,
      "covers": ["must_include.1"],
      "text": "Keep a record of the slow part so you can read back instead of guessing.",
      "evidence": [ { "slot": "e1", "filled_by": "transcript line 7: eleven years of notebooks above the ovens" } ] },
    { "id": "n6", "kind": "claim", "parent": null, "order": 5, "part": "objection", "words": 140,
      "text": "'It's hazing.' Her best baker thought so too, until week three, when he noticed the rain slowing the rise.",
      "evidence": [ { "slot": "e1", "filled_by": "transcript line 9" } ] },
    { "id": "n7", "kind": "claim", "parent": null, "order": 6, "part": "close", "words": 100,
      "text": "The first step for a team lead on Monday.",
      "evidence": [ { "slot": "e1", "filled_by": null } ] },
    { "id": "n8", "kind": "open-question", "parent": "n7", "order": 1,
      "text": "What is the concrete first step? The brief's purpose ('protect the unglamorous early work') names the goal but not the action." }
  ],
  "source": { "brief_digest": "718a3caff0c9ea588f3505f13c1454961fd324ec4b4d6698ef293ae4e04d261e", "draft_digest": null }
}

````

**Tool result:**

````
File created successfully at: <task>/cand-c-problem-solution.json (file state is current in your context — no need to Read it back)
````

**Tool call — Bash:**

````
S=<plugins>/prose-outline/skills/prose-outline
P=<task>
B=$PWD/brief.json
for c in a-narrative-arc:narrative-arc b-argument-essay:argument-essay c-problem-solution:problem-solution; do f=${c%%:*}; s=${c##*:}; echo "== $f"; node $S/tools/proposal-check.mjs $P/cand-$f.json --shape $S/shapes/$s.md --brief-json $B; done
echo "== compare"; node $S/tools/outline-compare.mjs $P/cand-a-narrative-arc.json $P/cand-b-argument-essay.json $P/cand-c-problem-solution.json --brief-json $B
````

*[permission denied by the harness allowlist: "Bash"]*

**Tool result (error):**

````
A variable in this command can't be checked before it runs
````

**Tool call — Bash:**

````
node <plugins>/prose-outline/skills/prose-outline/tools/proposal-check.mjs <task>/cand-a-narrative-arc.json --shape <plugins>/prose-outline/skills/prose-outline/shapes/narrative-arc.md --brief-json brief.json
````

**Tool result:**

````
proposal-check — clean
  0 claims, 1 open questions, 0 empty evidence slots
  limit: Whether these are the right claims, in the right order, is not checked here.
````

**Tool call — Bash:**

````
node <plugins>/prose-outline/skills/prose-outline/tools/proposal-check.mjs <task>/cand-b-argument-essay.json --shape <plugins>/prose-outline/skills/prose-outline/shapes/argument-essay.md --brief-json brief.json
````

**Tool result:**

````
proposal-check — clean
  7 claims, 1 open questions, 1 empty evidence slots
  limit: Whether these are the right claims, in the right order, is not checked here.
````

**Tool call — Bash:**

````
node <plugins>/prose-outline/skills/prose-outline/tools/proposal-check.mjs <task>/cand-c-problem-solution.json --shape <plugins>/prose-outline/skills/prose-outline/shapes/problem-solution.md --brief-json brief.json
````

**Tool result:**

````
proposal-check — clean
  6 claims, 2 open questions, 2 empty evidence slots
  limit: Whether these are the right claims, in the right order, is not checked here.
````

**Tool call — Bash:**

````
node <plugins>/prose-outline/skills/prose-outline/tools/outline-compare.mjs <task>/cand-a-narrative-arc.json <task>/cand-b-argument-essay.json <task>/cand-c-problem-solution.json --brief-json brief.json
````

**Tool result:**

````
| | cand-a-narrative-arc | cand-b-argument-essay | cand-c-problem-solution |
|---|---|---|---|
| shape | narrative-arc (beat-sheet) | argument-essay (argument) | problem-solution (argument) |
| nodes | 6 | 8 | 8 |
| words allocated | 920 of 800–1100 | 1020 of 800–1100 | 990 of 800–1100 |
| required parts missing | none | none | none |
| must-include covered | 2 of 2 | 2 of 2 | 2 of 2 |
| open questions | 1 | 1 | 2 |
| share signals | 0 | 0 | 0 |
| findings | none | none | none |
````

**Assistant:**

I wrote three candidate outlines, each in a different shape. All three pass the checker with no findings. Each fits your 800–1100 word band, covers both must-includes, and keeps every part within its shape's share range.

### A. Narrative arc (the shape your brief already chose, 920 words)
Premise: *The slow invisible part of the work decides the result, long before anyone sees it.*
1. **Setup (150):** Your neighbour has run the corner sourdough bakery for eleven years. You ask her how she trains new bakers.
2. **Inciting moment (100):** For their first month, new bakers can't shape a single loaf. They feed the starter, clean the baskets and log the temperature every morning. Your first reaction is that it sounds brutal. *(must_include.0)*
3. **Complication (320):** The starter is the whole bakery: the bread fails twelve hours before anyone touches the dough. Her proof is eleven years of notebooks above the ovens, which she reads back to find the day the starter got tired. Even her best baker thought the month was hazing. *(must_include.1)*
4. **Turn (170):** Three weeks in, he notices the dough rising slower on rainy days and adjusts the water on his own. "That was the moment she knew he would be good."
5. **Resolution (180):** He runs the early shift now. The piece then asks the reader what the starter is on their team.
   - ❓ The transcript gives no team-side example. Should the ending name one for team leads, or leave readers to find their own? This shape goes wrong when the ending explains what the story already showed.

### B. Argument essay (1020 words)
1. **Hook (100):** A bakery where new bakers can't shape a loaf for a month. *(must_include.0, transcript l.3)*
2. **Thesis (100):** The slow part decides the result, and team leads who reward visible output are rewarding the wrong end. *(l.11)*
3. **Support (220):** The failure happens before anyone looks: a weak starter can't be rescued at the oven. *(l.5)*
4. **Support (200):** Keeping a record of the slow part lets you find what went wrong instead of guessing, as with the eleven years of notebooks. *(must_include.1, l.7)*
5. **Support (180):** Trust the person who notices the slow part, not the one with the best finish. *(l.9)*
6. **Counterargument (130):** "A month of groundwork is hazing." The baker who believed that is the one who noticed the starter. *(l.9)*
7. **Conclusion (90):** What a team lead should protect is their own team's starter. *(evidence: empty)*
   - ❓ The brief has no team-side example, so the conclusion ends on the analogy alone.

### C. Problem–solution (990 words)
1. **Problem (230):** Team leads reward what they can see, but the result is decided earlier, before anyone looks. *(l.5; second evidence slot empty)*
   - ❓ This shape fails if the problem stays abstract. What moment from a team would make a team lead recognise it?
2. **Stakes (150):** If you rush the groundwork, the failure can't be fixed at the end, and the people who rushed never learn why. *(l.5)*
3. **Solution (200):** Protect a stretch of slow work on purpose, like the first month of feeding the starter. *(must_include.0, l.3)*
4. **Solution (170):** Keep records of the slow part so you can read back instead of guessing. *(must_include.1, l.7)*
5. **Objection (140):** "It's hazing." Her best baker thought so too, until week three and the rain. *(l.9)*
6. **Close (100):** The first step for a team lead on Monday. *(evidence: empty)*
   - ❓ Your purpose names the goal but not the action. What is the concrete first step?

### Comparison (from `outline-compare`)

| | A narrative-arc | B argument-essay | C problem-solution |
|---|---|---|---|
| nodes | 6 | 8 | 8 |
| words allocated | 920 of 800–1100 | 1020 of 800–1100 | 990 of 800–1100 |
| required parts missing | none | none | none |
| must-include covered | 2 of 2 | 2 of 2 | 2 of 2 |
| open questions | 1 | 1 | 2 |
| share signals | 0 | 0 | 0 |
| findings | none | none | none |

The main difference is how much they depend on something you haven't supplied yet: an example from a team. A can mostly do without one. B needs one at the end. C needs one at the start and end, plus a concrete first step.

`brief.json` doesn't record the project name or revision. I set `brief_ref` to project `starter`, revision 4, based on the cached source path and the brief's latest decision. Correct me if that's wrong.

Tell me which one you want. Before saving, I'll check where your outline store is and show you exactly what would be written, and nothing is saved until you say yes. The other two candidates stay as working files in `<task>/`.

*turn ended: success, 28 model turns, $0.66*

## Turn 2

*model reported by init: `claude-opus-5-5`*

**Writer:**

> I'll take A, the narrative arc. It's fine as it is.

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

**Assistant:**

Store located (identity `personal`). Checking the project's current outline revision before a dry run:

**Tool call — Bash:**

````
node <plugins>/prose-outline/skills/prose-outline/tools/outline-store.mjs show --project starter
````

**Tool result (error):**

````
Exit code 1
{
  "status": "error",
  "reason": "No outline saved for project starter"
}
````

**Assistant:**

No outline is saved yet for this project, so the expected revision is 0. Here's the dry run:

**Tool call — Bash:**

````
node <plugins>/prose-outline/skills/prose-outline/tools/outline-store.mjs save --proposal <task>/cand-a-narrative-arc.json --project starter --expected-revision 0
````

**Tool result:**

````
{
  "status": "proposal",
  "identity": "personal",
  "project": "starter",
  "directory": "<draw>/store/projects/personal/starter/outlines",
  "proposal": {
    "schema": "voice-outline/1",
    "id": "starter",
    "revision": 1,
    "parent_digest": null,
    "mode": "beat-sheet",
    "title": "The starter is the bakery",
    "thesis": "The slow invisible part of the work decides the result, long before anyone sees it.",
    "shape": "narrative-arc",
    "length": {
      "unit": "words",
      "min": 800,
      "max": 1100
    },
    "brief_ref": {
      "project": "starter",
      "revision": 4,
      "digest": "718a3caff0c9ea588f3505f13c1454961fd324ec4b4d6698ef293ae4e04d261e"
    },
    "nodes": [
      {
        "id": "n1",
        "kind": "act",
        "parent": null,
        "order": 1,
        "part": "setup",
        "words": 150,
        "text": "The neighbour's sourdough bakery on the corner, eleven years running; the writer asks how she trains new bakers."
      },
      {
        "id": "n2",
        "kind": "beat",
        "parent": null,
        "order": 2,
        "part": "inciting-moment",
        "words": 100,
        "covers": [
          "must_include.0"
        ],
        "text": "Her answer: for the first month they may not shape a single loaf. They feed the starter, clean the proofing baskets, log the cold-room temperature every morning. The writer's first reaction: that sounds brutal."
      },
      {
        "id": "n3",
        "kind": "beat",
        "parent": null,
        "order": 3,
        "part": "complication",
        "words": 320,
        "covers": [
          "must_include.1"
        ],
        "text": "Why: the starter is the whole bakery; a weak starter makes flat, sour loaves nobody can fix at the oven, and the failure happens twelve hours before anyone touches the dough. Her proof is the shelf above the ovens: eleven years of batch notebooks she reads back to find the day the starter got tired. Even her best baker hated the month and thought it was hazing."
      },
      {
        "id": "n4",
        "kind": "turn",
        "parent": null,
        "order": 4,
        "part": "turn",
        "words": 170,
        "text": "Three weeks in, he notices the dough rising slower on rainy days and adjusts the water temperature on his own. 'That was the moment she knew he would be good': not his shaping, not his scoring, the fact that he noticed the starter."
      },
      {
        "id": "n5",
        "kind": "beat",
        "parent": null,
        "order": 5,
        "part": "resolution",
        "words": 180,
        "text": "He runs the early shift now. The piece turns to the reader: what is the starter on your team, and who is being rewarded for noticing it?"
      },
      {
        "id": "n6",
        "kind": "open-question",
        "parent": "n5",
… [11 more lines trimmed]
````

**Assistant:**

I haven't saved anything yet. Your outline store is set up under the identity `personal`, and project `starter` has no saved outline. Saving would write candidate A exactly as you saw it, with no changes, as **revision 1** in:

`<draw>/store/projects/personal/starter/outlines`

Two things go in with it:
- **The open question at the end stays in.** You still need to decide whether the ending names an example from a team or leaves readers to find their own.
- **It's linked to brief revision 4,** which I inferred earlier because `brief.json` doesn't record its project or revision. If that's wrong, tell me and I'll fix it before saving.

Shall I save it?

*turn ended: success, 4 model turns, $0.76*

## Turn 3

*model reported by init: `claude-opus-5-5`*

**Writer:**

> Yes, save it as project starter.

**Tool call — Bash:**

````
node <plugins>/prose-outline/skills/prose-outline/tools/outline-store.mjs save --proposal <task>/cand-a-narrative-arc.json --project starter --expected-revision 0 --approved
````

**Tool result:**

````
{
  "status": "saved",
  "identity": "personal",
  "project": "starter",
  "directory": "<draw>/store/projects/personal/starter/outlines",
  "revision": 1,
  "receipt": {
    "revision": 1,
    "parent_digest": null,
    "undo": "Undo restores revision 0 as a new revision; history is preserved."
  }
}
````

**Assistant:**

I saved the narrative-arc outline as **revision 1** of project `starter` under the identity `personal`. It's the first saved outline for this project.

If you change your mind, `undo` puts back the previous state as a new revision rather than deleting anything, so this save stays in the history. Since there was no outline before, that previous state is empty.

The outline still has one open question, at the resolution: whether the ending names an example from a team or leaves readers to find their own. You don't have to settle it before drafting, but it decides how the last 180 words read.

When you're ready to write, `prose-draft` can work from this outline. The two candidates you didn't pick weren't saved.

*turn ended: success, 2 model turns, $0.81*

