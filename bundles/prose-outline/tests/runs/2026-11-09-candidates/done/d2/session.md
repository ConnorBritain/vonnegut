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
cd <plugins>/prose-outline/skills/prose-outline; cat references/outline-schema.md; echo ----; cat <draw>/work/brief.json; echo ----; node tools/shape-check.mjs; ls shapes
````

*[permission denied by the harness allowlist: "Bash"]*

**Tool result (error):**

````
cd in '<plugins>/prose-outline/skills/prose-outline' was blocked. For security, Claude Code may only change directories to the allowed working directories for this session: '<draw>/work'.
````

**Tool call — Bash:**

````
S=<plugins>/prose-outline/skills/prose-outline; cat $S/references/outline-schema.md; echo ----; cat brief.json; echo ----; node $S/tools/shape-check.mjs; ls $S/shapes
````

*[permission denied by the harness allowlist: "Bash"]*

**Tool result (error):**

````
This Bash command contains multiple operations. The following parts require approval: cat <plugins>/prose-outline/skills/prose-outline/references/outline-schema.md, echo ----, ls <plugins>/prose-outline/skills/prose-outline/shapes
````

**Assistant:**

Using the Read tool instead.

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
 "pattern": "shapes/*",
 "path": "<plugins>/prose-outline/skills/prose-outline"
}
````

**Tool result:**

````
<plugins>/prose-outline/skills/prose-outline/shapes/letter.md
<plugins>/prose-outline/skills/prose-outline/shapes/numbered-lessons.md
<plugins>/prose-outline/skills/prose-outline/shapes/narrative-arc.md
<plugins>/prose-outline/skills/prose-outline/shapes/question-and-answer.md
<plugins>/prose-outline/skills/prose-outline/shapes/problem-solution.md
<plugins>/prose-outline/skills/prose-outline/shapes/argument-essay.md
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

**Tool call — Bash:**

````
node <plugins>/prose-outline/skills/prose-brainstorm/tools/brief-store.mjs show --help 2>&1 | head -30; node <plugins>/prose-outline/skills/prose-outline/tools/outline-store.mjs locate 2>&1
````

**Tool result:**

````
{
  "status": "usage",
  "reason": "brief-store show: unknown, duplicate or valueless flag --help"
}
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

**Tool call — Grep:**

````
{
 "pattern": "brief_ref|digest",
 "path": "<plugins>/prose-outline/skills/prose-outline/tools",
 "output_mode": "content"
}
````

**Tool result:**

````
<plugins>/prose-outline/skills/prose-outline/tools/outline-store.mjs:82:    for (const key of ["schema", "id", "revision", "parent_digest"]) delete body[key];
<plugins>/prose-outline/skills/prose-outline/tools/lib/outline-schema.mjs:17: *   brief_ref  { project, revision, digest } — the brief the outline came from
<plugins>/prose-outline/skills/prose-outline/tools/lib/outline-schema.mjs:43:  if (doc.revision === 1 ? doc.parent_digest !== null : !DIGEST.test(doc.parent_digest ?? "")) errors.push("Invalid revision ancestry");
<plugins>/prose-outline/skills/prose-outline/tools/lib/outline-schema.mjs:90:    else for (const key of ["brief_digest", "draft_digest"]) if (src[key] !== null && src[key] !== undefined && !DIGEST.test(src[key])) errors.push(`source.${key} must be a sha256 or null`);
<plugins>/prose-outline/skills/prose-outline/tools/lib/outline-schema.mjs:98:/** The optional planning fields (item J): length, shape, brief_ref, and per-node part, words, covers. */
<plugins>/prose-outline/skills/prose-outline/tools/lib/outline-schema.mjs:106:  if (body.brief_ref !== undefined) {
<plugins>/prose-outline/skills/prose-outline/tools/lib/outline-schema.mjs:107:    const b = body.brief_ref;
<plugins>/prose-outline/skills/prose-outline/tools/lib/outline-schema.mjs:108:    if (!isObject(b) || !PROJECT.test(b.project ?? "") || !Number.isInteger(b.revision) || b.revision < 1 || !DIGEST.test(b.digest ?? "") || Object.keys(b).some((k) => !["project", "revision", "digest"].includes(k))) errors.push("brief_ref must be { project, revision, digest }");
<plugins>/prose-outline/skills/prose-outline/tools/lib/revision-store.mjs:10: * carries `schema`, `id`, `revision`, `parent_digest` and its payload; every
<plugins>/prose-outline/skills/prose-outline/tools/lib/revision-store.mjs:30:export const digest = (v) => sha256(stableJSON(v));
<plugins>/prose-outline/skills/prose-outline/tools/lib/revision-store.mjs:41:const revisionName = (doc) => `${String(doc.revision).padStart(6, "0")}-${digest(doc)}.json`;
<plugins>/prose-outline/skills/prose-outline/tools/lib/revision-store.mjs:54:  if (doc?.revision === 1 ? doc.parent_digest !== null : !/^[a-f0-9]{64}$/.test(doc?.parent_digest ?? "")) errors.push("Invalid revision ancestry");
<plugins>/prose-outline/skills/prose-outline/tools/lib/revision-store.mjs:66:  if (revisionName(doc) !== pointer.file) throw new TypeError("Store revision digest mismatch");
<plugins>/prose-outline/skills/prose-outline/tools/lib/revision-store.mjs:102:  if (!payload || typeof payload !== "object" || ["schema", "id", "revision", "parent_digest"].some((k) => k in payload)) throw new TypeError("Payload must be an object without envelope keys");
<plugins>/prose-outline/skills/prose-outline/tools/lib/revision-store.mjs:103:  const build = (current) => ({ schema, id, revision: (current?.revision ?? 0) + 1, parent_digest: current ? digest(current) : null, ...payload });
<plugins>/prose-outline/skills/prose-outline/tools/lib/revision-store.mjs:116:    return { status: "saved", document: next, receipt: { revision: next.revision, parent_digest: next.parent_digest, undo: `Undo restores revision ${next.revision - 1} as a new revision; history is preserved.` } };
<plugins>/prose-outline/skills/prose-outline/tools/lib/revision-store.mjs:126:  const file = readdirSync(join(directory, "revisions")).find((f) => f.endsWith(`-${current.parent_digest}.json`));
<plugins>/prose-outline/skills/prose-outline/tools/lib/revision-store.mjs:129:  const restored = { ...previous, revision: current.revision + 1, parent_digest: digest(current) };
<plugins>/prose-outline/skills/prose-outline/tools/lib/revision-store.mjs:144:    return { file, revision: doc.revision, parent_digest: doc.parent_digest };
<plugins>/prose-outline/skills/prose-outline/tools/lib/registry-reader.mjs:12: * that digest. It never writes, never migrates, and never adds a key. A parity
<plugins>/prose-outline/skills/prose-outline/tools/lib/registry-reader.mjs:28:export const sha256 = (text) => createHash("sha256").update(text, "utf8").digest("hex");
<plugins>/prose-outline/skills/prose-outline/tools/lib/registry-reader.mjs:55:  if (`${state.revision}-${sha256(bytes)}.json` !== pointer.file) throw new TypeError("Registry digest mismatch");
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

**Assistant:**

Writing three candidate outlines now (narrative arc, argument essay, letter), then running the checker and the comparison.

**Tool call — Write:**

````
<task>/a-narrative-arc.json
{
  "mode": "beat-sheet",
  "title": "The starter is the bakery",
  "thesis": "The slow invisible part of the work decides the result, long before anyone sees it.",
  "shape": "narrative-arc",
  "length": { "unit": "words", "min": 800, "max": 1100 },
  "nodes": [
    { "id": "n1", "kind": "beat", "parent": null, "order": 1, "part": "setup", "words": 150,
      "text": "The bakery as a customer sees it: loaves coming out of the oven. Then the rule underneath: if the starter is weak, the loaves come out flat and sour and nobody can fix that at the oven." },
    { "id": "n2", "kind": "beat", "parent": null, "order": 2, "part": "inciting-moment", "words": 100,
      "text": "The month of feeding the starter begins: work with nothing to show for it yet.",
      "covers": ["must_include.0"] },
    { "id": "n3", "kind": "beat", "parent": null, "order": 3, "part": "complication", "words": 300,
      "text": "The month goes on with no visible result, set against the eleven years of notebooks: the same slow, unseen kind of work, kept up for years.",
      "covers": ["must_include.1"] },
    { "id": "n4", "kind": "turn", "parent": null, "order": 4, "part": "turn", "words": 150,
      "text": "\"That was the moment she knew he would be good.\" The judgement comes from the slow work, not from a finished loaf." },
    { "id": "n5", "kind": "beat", "parent": null, "order": 5, "part": "resolution", "words": 200,
      "text": "Turn to the reader without explaining the story again: a team lead who rewards visible output is judging at the oven. Leave them with the starter." },
    { "id": "n6", "kind": "open-question", "parent": "n3", "order": 1,
      "text": "Whose notebooks are they, and what is written in them? The brief names them but doesn't say." },
    { "id": "n7", "kind": "open-question", "parent": "n4", "order": 1,
      "text": "Who are \"she\" and \"he\", and what did he do in that moment? The brief quotes the line (s2, line 9) but not what led up to it." }
  ],
  "source": { "brief_digest": null, "draft_digest": null }
}

````

**Tool result:**

````
File created successfully at: <task>/a-narrative-arc.json (file state is current in your context — no need to Read it back)
````

**Tool call — Write:**

````
<task>/b-argument-essay.json
{
  "mode": "argument",
  "title": "The starter is the bakery",
  "thesis": "The slow invisible part of the work decides the result, long before anyone sees it.",
  "shape": "argument-essay",
  "length": { "unit": "words", "min": 800, "max": 1100 },
  "nodes": [
    { "id": "n1", "kind": "claim", "parent": null, "order": 1, "part": "hook", "words": 100,
      "text": "If the starter is weak, the loaves come out flat and sour, and nobody can fix that at the oven.",
      "evidence": [ { "slot": "e1", "filled_by": "transcript s1, line 5" } ] },
    { "id": "n2", "kind": "claim", "parent": null, "order": 2, "part": "thesis", "words": 100,
      "text": "Team work runs the same way: the slow invisible part decides the result long before anyone sees it.",
      "evidence": [ { "slot": "e1", "filled_by": null } ] },
    { "id": "n3", "kind": "claim", "parent": null, "order": 3, "part": "support", "words": 180,
      "text": "The result is fixed before the visible work starts: the month of feeding the starter comes before any loaf.",
      "covers": ["must_include.0"],
      "evidence": [ { "slot": "e1", "filled_by": "brief must_include.0: the month of feeding the starter" } ] },
    { "id": "n4", "kind": "claim", "parent": null, "order": 4, "part": "support", "words": 170,
      "text": "People who know the craft judge by the slow work: \"That was the moment she knew he would be good.\"",
      "evidence": [ { "slot": "e1", "filled_by": "transcript s2, line 9" } ] },
    { "id": "n5", "kind": "claim", "parent": null, "order": 5, "part": "support", "words": 150,
      "text": "Invisible work builds up over years: the eleven years of notebooks.",
      "covers": ["must_include.1"],
      "evidence": [ { "slot": "e1", "filled_by": "brief must_include.1: the eleven years of notebooks" } ] },
    { "id": "n6", "kind": "claim", "parent": null, "order": 6, "part": "counterargument", "words": 150,
      "text": "The objection: leads reward visible output because it's the only thing they can measure, and slow groundwork can also be a place to hide.",
      "evidence": [ { "slot": "e1", "filled_by": null } ] },
    { "id": "n7", "kind": "claim", "parent": null, "order": 7, "part": "conclusion", "words": 100,
      "text": "What follows for a team lead: protect the unglamorous early work instead of waiting to judge at the oven.",
      "evidence": [ { "slot": "e1", "filled_by": null } ] },
    { "id": "n8", "kind": "open-question", "parent": "n6", "order": 1,
      "text": "How does a lead tell real groundwork from stalling? The brief raises no objection and gives no answer." },
    { "id": "n9", "kind": "open-question", "parent": "n7", "order": 1,
      "text": "What exactly should a lead do to protect the early work? The purpose names the goal but not the practice." }
  ],
  "source": { "brief_digest": null, "draft_digest": null }
}

````

**Tool result:**

````
File created successfully at: <task>/b-argument-essay.json (file state is current in your context — no need to Read it back)
````

**Tool call — Write:**

````
<task>/c-letter.json
{
  "mode": "argument",
  "title": "The starter is the bakery",
  "thesis": "The slow invisible part of the work decides the result, long before anyone sees it.",
  "shape": "letter",
  "length": { "unit": "words", "min": 800, "max": 1100 },
  "nodes": [
    { "id": "n1", "kind": "claim", "parent": null, "order": 1, "part": "occasion", "words": 120,
      "text": "To a team lead who rewards what can be seen: you are judging the loaves at the oven, and by then the bread is already decided.",
      "evidence": [ { "slot": "e1", "filled_by": "transcript s1, line 5" } ] },
    { "id": "n2", "kind": "claim", "parent": null, "order": 2, "part": "body", "words": 250,
      "text": "Here is what the work before the oven looks like: the month of feeding the starter, with nothing to show for it.",
      "covers": ["must_include.0"],
      "evidence": [ { "slot": "e1", "filled_by": "brief must_include.0: the month of feeding the starter" } ] },
    { "id": "n3", "kind": "claim", "parent": null, "order": 3, "part": "body", "words": 230,
      "text": "And this is what it looks like kept up for years: the eleven years of notebooks.",
      "covers": ["must_include.1"],
      "evidence": [ { "slot": "e1", "filled_by": "brief must_include.1: the eleven years of notebooks" } ] },
    { "id": "n4", "kind": "claim", "parent": null, "order": 4, "part": "body", "words": 200,
      "text": "Someone who knew the craft saw it in the slow work: \"That was the moment she knew he would be good.\" You can learn to look there too.",
      "evidence": [ { "slot": "e1", "filled_by": "transcript s2, line 9" } ] },
    { "id": "n5", "kind": "claim", "parent": null, "order": 5, "part": "ask", "words": 150,
      "text": "The ask: protect the unglamorous early work on your team before it has anything to show.",
      "evidence": [ { "slot": "e1", "filled_by": null } ] },
    { "id": "n6", "kind": "open-question", "parent": "n1", "order": 1,
      "text": "Who is the letter to: one real lead, or a general \"you\"? And what prompts it now? The brief names the audience but no occasion." },
    { "id": "n7", "kind": "open-question", "parent": "n5", "order": 1,
      "text": "What specific thing is the reader asked to do? A letter's ask needs to be concrete, and the brief only gives the purpose." }
  ],
  "source": { "brief_digest": null, "draft_digest": null }
}

````

**Tool result:**

````
File created successfully at: <task>/c-letter.json (file state is current in your context — no need to Read it back)
````

**Tool call — Bash:**

````
T=<plugins>/prose-outline/skills/prose-outline; P=<task>
node $T/tools/proposal-check.mjs $P/a-narrative-arc.json --shape $T/shapes/narrative-arc.md --brief-json brief.json
node $T/tools/proposal-check.mjs $P/b-argument-essay.json --shape $T/shapes/argument-essay.md --brief-json brief.json
node $T/tools/proposal-check.mjs $P/c-letter.json --shape $T/shapes/letter.md --brief-json brief.json
node $T/tools/outline-compare.mjs $P/a-narrative-arc.json $P/b-argument-essay.json $P/c-letter.json --brief-json brief.json
````

*[permission denied by the harness allowlist: "Bash"]*

**Tool result (error):**

````
A variable set in this command can't be checked before it runs
````

**Tool call — Bash:**

````
node <plugins>/prose-outline/skills/prose-outline/tools/proposal-check.mjs <task>/a-narrative-arc.json --shape <plugins>/prose-outline/skills/prose-outline/shapes/narrative-arc.md --brief-json brief.json
````

**Tool result:**

````
proposal-check — clean
  0 claims, 2 open questions, 0 empty evidence slots
  limit: Whether these are the right claims, in the right order, is not checked here.
````

**Tool call — Bash:**

````
node <plugins>/prose-outline/skills/prose-outline/tools/proposal-check.mjs <task>/b-argument-essay.json --shape <plugins>/prose-outline/skills/prose-outline/shapes/argument-essay.md --brief-json brief.json
````

**Tool result:**

````
proposal-check — clean
  7 claims, 2 open questions, 3 empty evidence slots
  limit: Whether these are the right claims, in the right order, is not checked here.
````

**Tool call — Bash:**

````
node <plugins>/prose-outline/skills/prose-outline/tools/proposal-check.mjs <task>/c-letter.json --shape <plugins>/prose-outline/skills/prose-outline/shapes/letter.md --brief-json brief.json
````

**Tool result:**

````
proposal-check — clean
  5 claims, 2 open questions, 1 empty evidence slots
  limit: Whether these are the right claims, in the right order, is not checked here.
````

**Tool call — Bash:**

````
node <plugins>/prose-outline/skills/prose-outline/tools/outline-compare.mjs <task>/a-narrative-arc.json <task>/b-argument-essay.json <task>/c-letter.json --brief-json brief.json
````

**Tool result:**

````
| | a-narrative-arc | b-argument-essay | c-letter |
|---|---|---|---|
| shape | narrative-arc (beat-sheet) | argument-essay (argument) | letter (argument) |
| nodes | 7 | 9 | 7 |
| words allocated | 900 of 800–1100 | 950 of 800–1100 | 950 of 800–1100 |
| required parts missing | none | none | none |
| must-include covered | 2 of 2 | 2 of 2 | 2 of 2 |
| open questions | 2 | 2 | 2 |
| share signals | 0 | 0 | 0 |
| findings | none | none | none |
````

**Assistant:**

I wrote three candidate outlines from `brief.json`: one in your chosen shape and two alternatives. All three passed the checker against their shape and your brief with no findings. Each one fits your 800–1,100 word band, covers both must-include items, and keeps every word-budget share inside the shape's range.

Your brief already confirms **narrative arc** as the shape (revision 3). So candidate A is your choice, and B and C are there for comparison.

| | A · narrative arc | B · argument essay | C · letter |
|---|---|---|---|
| shape | narrative-arc (beat-sheet) | argument-essay (argument) | letter (argument) |
| nodes | 7 | 9 | 7 |
| words allocated | 900 of 800–1100 | 950 of 800–1100 | 950 of 800–1100 |
| required parts missing | none | none | none |
| must-include covered | 2 of 2 | 2 of 2 | 2 of 2 |
| open questions | 2 | 2 | 2 |
| share signals | 0 | 0 | 0 |
| findings | none | none | none |

All three use your brief's thesis: *"The slow invisible part of the work decides the result, long before anyone sees it."*

### A · Narrative arc (beat-sheet, 900 words)
- **n1 setup · 150:** The bakery as a customer sees it: loaves coming out of the oven. Then the rule underneath: a weak starter means flat, sour loaves "nobody can fix at the oven."
- **n2 inciting moment · 100:** The month of feeding the starter begins, with nothing to show for it yet. *(must_include.0)*
- **n3 complication · 300:** The month goes on with no visible result, set against the eleven years of notebooks. *(must_include.1)*
  - ❓ **n6:** Whose notebooks are they, and what is written in them? The brief names them but doesn't say.
- **n4 turn · 150:** "That was the moment she knew he would be good." The judgement comes from the slow work, not from a finished loaf.
  - ❓ **n7:** Who are "she" and "he", and what did he do in that moment? The brief quotes the line (s2, line 9) but not what led up to it.
- **n5 resolution · 200:** Turn to the team lead, who is judging at the oven, without explaining the story again. Leave them with the starter.

### B · Argument essay (950 words)
- **n1 hook · 100:** A weak starter means flat, sour loaves no oven can fix. *[evidence: transcript s1, line 5]*
- **n2 thesis · 100:** Team work runs the same way. *[evidence: empty]*
- **n3 support · 180:** The result is fixed before the visible work starts: the month of feeding the starter. *[evidence: must_include.0]*
- **n4 support · 170:** People who know the craft judge by the slow work: "she knew he would be good." *[evidence: transcript s2, line 9]*
- **n5 support · 150:** Invisible work builds up over years: the eleven years of notebooks. *[evidence: must_include.1]*
- **n6 counterargument · 150:** Leads reward visible output because it's the only thing they can measure, and slow groundwork can also be a place to hide. *[evidence: empty]*
  - ❓ **n8:** How does a lead tell real groundwork from stalling? The brief doesn't answer this.
- **n7 conclusion · 100:** Protect the early work instead of judging at the oven. *[evidence: empty]*
  - ❓ **n9:** What exactly should a lead do? Your purpose names the goal but not the practice.

### C · Letter (950 words)
- **n1 occasion · 120:** To a team lead: you are judging the loaves at the oven, and by then the bread is already decided. *[evidence: transcript s1, line 5]*
  - ❓ **n6:** Is the letter to one real lead or a general "you"? What prompts it now? The brief gives no occasion.
- **n2 body · 250:** What the work before the oven looks like: the month of feeding the starter. *[evidence: must_include.0]*
- **n3 body · 230:** The same work kept up for years: the eleven years of notebooks. *[evidence: must_include.1]*
- **n4 body · 200:** Someone who knew the craft saw it in the slow work, and you can learn to look there too. *[evidence: transcript s2, line 9]*
- **n5 ask · 150:** Protect the unglamorous early work on your team. *[evidence: empty]*
  - ❓ **n7:** What specific thing is the reader asked to do? A letter's ask needs to be concrete.

I left every evidence slot empty where the brief gives nothing to fill it. I didn't have the source transcript, only the two lines the brief quotes. That's why the open questions ask about the notebooks and about who "she" and "he" are, rather than guessing.

**Saving:** I found your outline store under the `personal` identity. Nothing is saved yet, and the three candidates are only in my scratchpad. Your brief doesn't record a project name or revision, so to save the one you pick, tell me which candidate and the project name to save it under. The other two won't be kept.

*turn ended: success, 25 model turns, $0.59*

## Turn 2

*model reported by init: `claude-opus-5-5`*

**Writer:**

> I'll take candidate A, the narrative arc. Yes, save it as project starter.

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

New project, so revision 0.

**Tool call — Bash:**

````
node <plugins>/prose-outline/skills/prose-outline/tools/outline-store.mjs save --proposal <task>/a-narrative-arc.json --project starter --expected-revision 0 --approved
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

I saved candidate A, the narrative arc.

- **Identity:** `personal`
- **Project:** `starter`
- **Revision:** 1. This is a new project, so there's no earlier revision. Each later save becomes a new revision, and `undo` will bring back the previous one as a new revision without deleting any history.

The node ids n1–n7 will stay the same in later revisions, so any comparison between revisions will show changes beat by beat. Two open questions are saved with the outline, and the draft will need answers to them:

- **n6:** whose notebooks are they, and what's written in them?
- **n7:** who are "she" and "he", and what did he do in the moment the turn rests on?

I didn't save candidates B and C. When you're ready to write, `prose-draft` can work from this outline.

*turn ended: success, 3 model turns, $0.66*

