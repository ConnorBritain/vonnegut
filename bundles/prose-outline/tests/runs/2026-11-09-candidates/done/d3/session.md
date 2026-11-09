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
cd <draw>/work; ls -la; cat brief.json; S=<plugins>/prose-outline/skills/prose-outline; ls $S $S/shapes $S/tools; cat $S/references/outline-schema.md
````

*[permission denied by the harness allowlist: "Bash"]*

**Tool result (error):**

````
A variable in this command can't be checked before it runs
````

**Tool call — Bash:**

````
ls -la && cat brief.json && cd <plugins>/prose-outline/skills/prose-outline && ls . shapes tools && cat references/outline-schema.md
````

*[permission denied by the harness allowlist: "Bash"]*

**Tool result (error):**

````
cd in '<plugins>/prose-outline/skills/prose-outline' was blocked. For security, Claude Code may only change directories to the allowed working directories for this session: '<draw>/work'.
````

**Tool call — Bash:**

````
ls -la; cat brief.json; ls <plugins>/prose-outline/skills/prose-outline <plugins>/prose-outline/skills/prose-outline/shapes <plugins>/prose-outline/skills/prose-outline/tools; cat <plugins>/prose-outline/skills/prose-outline/references/outline-schema.md
````

*[permission denied by the harness allowlist: "Bash"]*

**Tool result (error):**

````
This Bash command contains multiple operations. The following parts require approval: ls <plugins>/prose-outline/skills/prose-outline <plugins>/prose-outline/skills/prose-outline/shapes <plugins>/prose-outline/skills/prose-outline/tools, cat <plugins>/prose-outline/skills/prose-outline/references/outline-schema.md
````

**Assistant:**

Using dedicated tools instead.

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
 "file_path": "<plugins>/prose-outline/skills/prose-outline/tools/proposal-check.mjs"
}
````

**Tool result:**

````
1	#!/usr/bin/env node
2	/**
3	 * proposal-check — is this outline proposal a valid voice-outline/1 body, and
4	 * does it keep the skill's promises about briefs?
5	 *
6	 *   node proposal-check.mjs <proposal.json> [--brief <brief.md>] [--shape <shapes/x.md>] [--brief-json <brief.json>] [--json]
7	 *
8	 * The skill's two tests are mechanical where they can be:
9	 *   positive   a concrete brief → every claim carries at least one evidence slot
10	 *   negative   an underspecified brief → open questions, and no invented thesis
11	 * A brief declares which it is in frontmatter (`expect: concrete | underspecified`);
12	 * with no brief, only the schema is checked. What the checker cannot decide —
13	 * whether the claims are the right claims — is the reader's, and it says so.
14	 *
15	 * Plan checks (roadmap item J), each a finding when broken:
16	 *   --shape       every required part has a node; parts appear in the shape's
17	 *                 order; no node names a part the shape lacks; the mode agrees
18	 *   budget        node word budgets sum to within the outline's length band
19	 *   --brief-json  every must-include item in the brief is covered by a node,
20	 *                 and the outline's length band is the brief's
21	 * A part's share outside the shape's range is a SIGNAL, reported but never a
22	 * finding: share ranges are starting values, not measurements.
23	 */
24	import { existsSync, readFileSync, realpathSync } from "node:fs";
25	import { fileURLToPath } from "node:url";
26	import { readingOrder, validateOutlineBody } from "./lib/outline-schema.mjs";
27	import { loadShape } from "./lib/shape.mjs";
28	
29	export function checkProposal(body, brief = null, { shape = null, briefDoc = null } = {}) {
30	  const report = { schema: "proposal-check/1", errors: validateOutlineBody(body), expectation: null, findings: [], limits: ["Whether these are the right claims, in the right order, is not checked here."] };
31	  if (report.errors.length) return { ...report, status: "invalid" };
32	  const claims = body.nodes.filter((n) => n.kind === "claim");
33	  const questions = body.nodes.filter((n) => n.kind === "open-question");
34	  report.counts = { nodes: body.nodes.length, claims: claims.length, open_questions: questions.length, empty_slots: claims.reduce((n, c) => n + c.evidence.filter((e) => e.filled_by === null).length, 0) };
35	  if (brief) {
36	    const expect = /^expect:\s*(concrete|underspecified)\s*$/m.exec(brief.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? "")?.[1] ?? null;
37	    report.expectation = expect;
38	    if (expect === "concrete") {
39	      if (body.thesis === null) report.findings.push("a concrete brief should yield a thesis, not a withheld one");
40	      const bare = claims.filter((c) => !c.evidence.length);
41	      if (bare.length) report.findings.push(`${bare.length} claim(s) carry no evidence slot: ${bare.map((c) => c.id).join(", ")}`);
42	    } else if (expect === "underspecified") {
43	      if (body.thesis !== null) report.findings.push("an underspecified brief must not yield an invented thesis (thesis should be null)");
44	      if (!questions.length) report.findings.push("an underspecified brief must yield at least one open question");
45	    } else report.findings.push("brief has no `expect: concrete | underspecified` frontmatter; expectation not checked");
46	  }
47	  report.findings.push(...planFindings(body, { shape, briefDoc, report }));
48	  return { ...report, status: report.findings.length ? "findings" : "clean" };
49	}
50	
51	/** The item-J checks. Fills report.plan and report.signals; returns findings. */
52	export function planFindings(body, { shape = null, briefDoc = null, report = {} } = {}) {
53	  const findings = [];
54	  const signals = [];
55	  const ordered = readingOrder(body);
56	  const budgeted = ordered.filter((n) => n.words !== undefined);
57	  const total = budgeted.reduce((a, n) => a + n.words, 0);
58	  const plan = { shape: body.shape ?? null, length: body.length ?? null, words_allocated: budgeted.length ? total : null, parts: {} };
59	  if (body.length && !budgeted.length) findings.push("the outline has a length band but no node carries a word budget");
60	  if (budgeted.length && !body.length) findings.push("nodes carry word budgets but the outline has no length band to hold them to");
61	  if (body.length && budgeted.length && (total < body.length.min || total > body.length.max)) findings.push(`word budgets sum to ${total}, outside the length band ${body.length.min}–${body.length.max}`);
62	  if (shape) {
63	    if (body.shape !== undefined && body.shape !== shape.name) findings.push(`the outline says shape ${body.shape} but was checked against ${shape.name}`);
64	    if (body.mode !== shape.mode) findings.push(`shape ${shape.name} is a ${shape.mode} shape; the outline is in ${body.mode} mode`);
65	    const names = shape.parts.map((p) => p.part);
66	    const unknown = [...new Set(ordered.filter((n) => n.part !== undefined && !names.includes(n.part)).map((n) => n.part))];
67	    if (unknown.length) findings.push(`nodes name parts shape ${shape.name} does not have: ${unknown.join(", ")}`);
68	    const missing = shape.parts.filter((p) => p.required === "required" && !ordered.some((n) => n.part === p.part)).map((p) => p.part);
69	    if (missing.length) findings.push(`required parts with no node: ${missing.join(", ")}`);
70	    // Order: the sequence of parts as they first appear must follow the shape.
71	    const seen = [];
72	    for (const n of ordered) if (n.part !== undefined && names.includes(n.part) && seen[seen.length - 1] !== n.part) seen.push(n.part);
73	    const outOfOrder = seen.find((part, i) => i > 0 && names.indexOf(part) < names.indexOf(seen[i - 1]));
74	    if (outOfOrder) findings.push(`parts out of the shape's order: ${seen.join(" → ")}`);
75	    if (total > 0) for (const p of shape.parts) {
76	      const words = budgeted.filter((n) => n.part === p.part).reduce((a, n) => a + n.words, 0);
77	      const share = Math.round((words / total) * 1000) / 1000;
78	      plan.parts[p.part] = { words, share, range: p.share };
79	      if (words && (share < p.share[0] || share > p.share[1])) signals.push(`part ${p.part} takes ${share} of the budget; the shape's range is ${p.share[0]}–${p.share[1]}`);
80	    }
… [49 more lines trimmed]
````

**Tool call — Read:**

````
{
 "file_path": "<plugins>/prose-outline/skills/prose-outline/tools/lib/outline-schema.mjs"
}
````

**Tool result:**

````
1	/**
2	 * voice-outline/1 — the outline document the skill proposes, the store keeps
3	 * and the differ compares.
4	 *
5	 * Two modes share one schema. `argument` nodes are claims (each with evidence
6	 * slots), evidence-slots standing alone, and open questions; `beat-sheet` nodes
7	 * are acts, beats and turns, plus open questions. The vocabulary is the only
8	 * thing that differs, so there is one store, one differ and one set of guards.
9	 *
10	 * Node ids are stable across revisions and the differ keys on them. A node is
11	 * never matched by its text.
12	 *
13	 * Optional fields (roadmap item J), validated when present and ignored by
14	 * readers that predate them, so the schema id stays voice-outline/1:
15	 *   length     { unit: "words", min, max } — the band the piece is planned to
16	 *   shape      the shape name (shapes/<name>.md)
17	 *   brief_ref  { project, revision, digest } — the brief the outline came from
18	 *   nodes[].part    which of the shape's parts a node belongs to
19	 *   nodes[].words   the node's word budget; no node with a budget sits under another
20	 *   nodes[].covers  brief decisions the node carries, e.g. "must_include.0"
21	 * Any other unknown key is still ignored, as it always was.
22	 */
23	export const OUTLINE_SCHEMA = "voice-outline/1";
24	export const MODES = Object.freeze({
25	  argument: ["claim", "evidence-slot", "open-question"],
26	  "beat-sheet": ["act", "beat", "turn", "open-question"],
27	});
28	const ID = /^n[1-9]\d*$/;
29	const SLOT = /^e[1-9]\d*$/;
30	const DIGEST = /^[a-f0-9]{64}$/;
31	const TOKEN = /^[a-z][a-z0-9-]{0,63}$/;
32	const COVER = /^[a-z][a-z_]*(?:\.\d+)?$/;
33	const PROJECT = /^[a-zA-Z0-9][a-zA-Z0-9_-]{0,63}$/;
34	const isObject = (v) => v !== null && typeof v === "object" && !Array.isArray(v);
35	const nonempty = (s) => typeof s === "string" && s.trim().length > 0;
36	
37	/** Errors for a full document (envelope included). Empty array means valid. */
38	export function validateOutline(doc) {
39	  const errors = [];
40	  if (doc?.schema !== OUTLINE_SCHEMA) return [`Expected schema ${OUTLINE_SCHEMA}`];
41	  if (!nonempty(doc.id)) errors.push("Outline needs a project id");
42	  if (!Number.isInteger(doc.revision) || doc.revision < 1) errors.push("Revision must be an integer ≥ 1");
43	  if (doc.revision === 1 ? doc.parent_digest !== null : !DIGEST.test(doc.parent_digest ?? "")) errors.push("Invalid revision ancestry");
44	  errors.push(...validateOutlineBody(doc));
45	  return errors;
46	}
47	
48	/** Errors for the body alone — what the skill proposes before the store adds an envelope. */
49	export function validateOutlineBody(body) {
50	  const errors = [];
51	  if (!Object.hasOwn(MODES, body?.mode)) return [`mode must be ${Object.keys(MODES).join(" | ")}`];
52	  const kinds = MODES[body.mode];
53	  if (!nonempty(body.title)) errors.push("title is required");
54	  if (!Array.isArray(body.nodes)) return [...errors, "nodes must be an array"];
55	  // A thesis may be withheld — but only when the outline says why, with at
56	  // least one open question. An underspecified brief yields questions, not an
57	  // invented thesis; a proposal with neither is not an outline.
58	  const openQuestions = body.nodes.filter((n) => n?.kind === "open-question").length;
59	  if (body.thesis === null) { if (!openQuestions) errors.push("thesis may be null only when at least one open-question node says what is missing"); }
60	  else if (!nonempty(body.thesis)) errors.push(body.mode === "argument" ? "thesis is required (or null with open questions)" : "thesis (the premise) is required (or null with open questions)");
61	  const ids = new Set();
62	  for (const n of body.nodes) {
63	    const where = `node ${n?.id ?? "?"}`;
64	    if (!ID.test(n?.id ?? "")) { errors.push(`${where}: id must look like n1, n2, …`); continue; }
65	    if (ids.has(n.id)) errors.push(`${where}: duplicate id`);
66	    ids.add(n.id);
67	    if (!kinds.includes(n.kind)) errors.push(`${where}: kind must be ${kinds.join(" | ")} in ${body.mode} mode`);
68	    if (!nonempty(n.text)) errors.push(`${where}: text is required`);
69	    if (!Number.isInteger(n.order) || n.order < 1) errors.push(`${where}: order must be an integer ≥ 1`);
70	    if (n.parent !== null && !ID.test(n.parent ?? "")) errors.push(`${where}: parent must be null or a node id`);
71	    if (n.kind === "claim") {
72	      if (!Array.isArray(n.evidence)) errors.push(`${where}: a claim carries an evidence array (may be empty)`);
73	      else {
74	        const slots = new Set();
75	        for (const e of n.evidence) {
76	          if (!SLOT.test(e?.slot ?? "")) errors.push(`${where}: evidence slot ids look like e1, e2, …`);
77	          if (slots.has(e?.slot)) errors.push(`${where}: duplicate evidence slot ${e.slot}`);
78	          slots.add(e?.slot);
79	          if (e?.filled_by !== null && !nonempty(e?.filled_by)) errors.push(`${where}: filled_by is null or a non-empty pointer`);
80	        }
… [56 more lines trimmed]
````

**Tool call — Read:**

````
{
 "file_path": "<plugins>/prose-outline/skills/prose-outline/tools/outline-compare.mjs"
}
````

**Tool result:**

````
1	#!/usr/bin/env node
2	/**
3	 * outline-compare — candidate outlines for one brief, side by side, as facts.
4	 *
5	 *   node outline-compare.mjs <a.json> <b.json> [c.json …] [--brief-json brief.json] [--shapes-dir DIR] [--json]
6	 *
7	 * Each candidate is checked against its own `shape` (from this skill's shapes/,
8	 * or --shapes-dir) and the brief, exactly as proposal-check does, and the
9	 * results are tabulated: shape and mode, nodes, words allocated against the
10	 * band, required parts present or missing, part shares outside the shape's
11	 * ranges (signals), must-include coverage, open questions, findings.
12	 *
13	 * No scores and no ordering beyond the input order: which shape suits the idea
14	 * is the writer's judgement, and this table is what they judge with.
15	 * Exit 0 when every candidate is clean, 1 when any has findings, 2 on usage.
16	 */
17	import { existsSync, readFileSync } from "node:fs";
18	import { basename, resolve } from "node:path";
19	import { fileURLToPath } from "node:url";
20	import { checkProposal } from "./proposal-check.mjs";
21	import { loadShapes, SHIPPED } from "./shape-check.mjs";
22	
23	export const COMPARE_SCHEMA = "outline-compare/1";
24	
25	export function compareCandidates(candidates, { briefDoc = null, shapes = loadShapes() } = {}) {
26	  const rows = candidates.map(({ name, body }) => {
27	    const shape = body?.shape ? shapes.get(body.shape) ?? null : null;
28	    const report = checkProposal(body, null, { shape, briefDoc });
29	    const findings = [...(report.errors ?? []).map((e) => `invalid: ${e}`), ...(report.findings ?? [])];
30	    if (body?.shape && !shape) findings.push(`no shape file named ${body.shape}`);
31	    if (!body?.shape) findings.push("the candidate names no shape");
32	    const required = shape ? shape.parts.filter((p) => p.required === "required").map((p) => p.part) : [];
33	    const nodes = Array.isArray(body?.nodes) ? body.nodes : [];
34	    const plan = report.plan ?? {};
35	    return {
36	      name, title: body?.title ?? null, shape: body?.shape ?? null, mode: body?.mode ?? null, nodes: nodes.length,
37	      length: plan.length ?? null, words_allocated: plan.words_allocated ?? null,
38	      within_band: plan.length && plan.words_allocated !== null ? plan.words_allocated >= plan.length.min && plan.words_allocated <= plan.length.max : null,
39	      required_parts: { present: required.filter((p) => nodes.some((n) => n.part === p)), missing: required.filter((p) => !nodes.some((n) => n.part === p)) },
40	      parts: plan.parts ?? {},
41	      must_include: plan.must_include ?? null,
42	      open_questions: nodes.filter((n) => n.kind === "open-question").length,
43	      signals: report.signals ?? [], findings, clean: findings.length === 0,
44	    };
45	  });
46	  const shapesUsed = rows.map((r) => r.shape).filter(Boolean);
47	  const notes = [];
48	  if (new Set(shapesUsed).size < shapesUsed.length) notes.push("two candidates share a shape; candidates are a choice only when their shapes differ");
49	  return { schema: COMPARE_SCHEMA, brief_length: briefDoc?.decisions?.length?.value ?? null, candidates: rows, notes };
50	}
51	
52	export function renderMarkdown(result) {
53	  const cell = (v) => (v === null || v === undefined ? "—" : String(v));
54	  const lines = ["| | " + result.candidates.map((c) => c.name).join(" | ") + " |", "|---|" + result.candidates.map(() => "---").join("|") + "|"];
55	  const row = (label, fn) => lines.push(`| ${label} | ${result.candidates.map((c) => cell(fn(c))).join(" | ")} |`);
56	  row("shape", (c) => `${c.shape ?? "—"} (${c.mode ?? "?"})`);
57	  row("nodes", (c) => c.nodes);
58	  row("words allocated", (c) => (c.words_allocated === null ? null : `${c.words_allocated}${c.length ? ` of ${c.length.min}–${c.length.max}${c.within_band ? "" : " ✗"}` : ""}`));
59	  row("required parts missing", (c) => (c.required_parts.missing.length ? c.required_parts.missing.join(", ") : "none"));
60	  row("must-include covered", (c) => (c.must_include ? `${c.must_include.covered} of ${c.must_include.total}` : null));
61	  row("open questions", (c) => c.open_questions);
62	  row("share signals", (c) => c.signals.length);
63	  row("findings", (c) => (c.findings.length ? c.findings.join("; ") : "none"));
64	  return `${lines.join("\n")}\n${result.notes.map((n) => `\nNote: ${n}`).join("")}${result.notes.length ? "\n" : ""}`;
65	}
66	
67	function main(argv) {
68	  const valued = ["--brief-json", "--shapes-dir"];
69	  const value = (f) => { const i = argv.indexOf(f); return i >= 0 ? argv[i + 1] : null; };
70	  const files = argv.filter((a, i) => !a.startsWith("--") && !valued.includes(argv[i - 1]));
71	  const unknown = argv.filter((a) => a.startsWith("--") && !["--json", ...valued].includes(a));
72	  if (files.length < 2 || unknown.length || valued.some((f) => argv.includes(f) && !value(f))) {
73	    console.error("Usage: node outline-compare.mjs <a.json> <b.json> [c.json …] [--brief-json brief.json] [--shapes-dir DIR] [--json]");
74	    return 2;
75	  }
76	  let briefDoc = value("--brief-json") ? JSON.parse(readFileSync(value("--brief-json"), "utf8")) : null;
77	  if (briefDoc?.status === "current" && briefDoc.brief) briefDoc = briefDoc.brief;
78	  const dir = value("--shapes-dir") ? resolve(value("--shapes-dir")) : SHIPPED;
79	  if (!existsSync(dir)) { console.error(`outline-compare: ${dir} does not exist`); return 2; }
80	  const result = compareCandidates(files.map((f) => ({ name: basename(f, ".json"), body: JSON.parse(readFileSync(f, "utf8")) })), { briefDoc, shapes: loadShapes(dir) });
… [6 more lines trimmed]
````

**Tool call — Glob:**

````
{
 "pattern": "skills/*/tools/*.mjs",
 "path": "<plugins>/prose-outline"
}
````

**Tool result:**

````
<plugins>/prose-outline/skills/prose-outline/tools/outline-store.mjs
<plugins>/prose-outline/skills/prose-outline/tools/outline-diff.mjs
<plugins>/prose-outline/skills/prose-outline/tools/outline-scan.mjs
<plugins>/prose-outline/skills/prose-brainstorm/tools/angles-check.mjs
<plugins>/prose-outline/skills/prose-brainstorm/tools/brief-store.mjs
<plugins>/prose-outline/skills/prose-brainstorm/tools/transcript-scan.mjs
<plugins>/prose-outline/skills/prose-outline/tools/shape-check.mjs
<plugins>/prose-outline/skills/prose-outline/tools/outline-compare.mjs
<plugins>/prose-outline/skills/prose-outline/tools/proposal-check.mjs
<plugins>/prose-outline/skills/prose-interview/tools/brief-store.mjs
<plugins>/prose-outline/skills/prose-interview/tools/brief-check.mjs
<plugins>/prose-outline/skills/prose-interview/tools/transcript-scan.mjs
````

**Tool call — Bash:**

````
sha256sum brief.json; node <plugins>/prose-outline/skills/prose-outline/tools/shape-check.mjs
````

**Tool result:**

````
718a3caff0c9ea588f3505f13c1454961fd324ec4b4d6698ef293ae4e04d261e  brief.json
  ok   argument-essay.md (argument, 5 parts)
  ok   letter.md (argument, 3 parts)
  ok   narrative-arc.md (beat-sheet, 5 parts)
  ok   numbered-lessons.md (argument, 3 parts)
  ok   problem-solution.md (argument, 5 parts)
  ok   question-and-answer.md (argument, 3 parts)
````

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
    { "id": "n1", "kind": "beat", "parent": null, "order": 1, "part": "setup", "words": 170,
      "text": "The bakery and its starter: if the starter is weak, the loaves come out flat and sour and nobody can fix that at the oven (transcript line 5)." },
    { "id": "n2", "kind": "beat", "parent": null, "order": 2, "part": "inciting-moment", "words": 100,
      "text": "The month of feeding the starter begins: work that will show nothing for weeks.",
      "covers": ["must_include.0"] },
    { "id": "n3", "kind": "beat", "parent": null, "order": 3, "part": "complication", "words": 300,
      "text": "The long, unseen middle: the month goes on with nothing to show, set against the eleven years of notebooks.",
      "covers": ["must_include.0", "must_include.1"] },
    { "id": "n6", "kind": "open-question", "parent": "n3", "order": 1,
      "text": "Whose notebooks are the eleven years, and what do they record? The brief names them but doesn't say." },
    { "id": "n4", "kind": "turn", "parent": null, "order": 4, "part": "turn", "words": 150,
      "text": "\"That was the moment she knew he would be good.\" (transcript line 9): the slow work is recognised before any loaf proves it." },
    { "id": "n7", "kind": "open-question", "parent": "n4", "order": 1,
      "text": "Who are she and he, and what happened in that moment? The brief quotes the line but not the scene." },
    { "id": "n5", "kind": "beat", "parent": null, "order": 5, "part": "resolution", "words": 180,
      "text": "Hand it to the team lead: the slow invisible part of the work decided the result (transcript line 11). Leave the reader to protect it, and don't explain the story back to them." }
  ],
  "source": { "brief_digest": "718a3caff0c9ea588f3505f13c1454961fd324ec4b4d6698ef293ae4e04d261e", "draft_digest": null }
}

````

**Tool result:**

````
File created successfully at: <task>/a-narrative-arc.json (file state is current in your context — no need to Read it back)
````

**Tool call — Write:**

````
<task>/b-problem-solution.json
{
  "mode": "argument",
  "title": "Protect the starter",
  "thesis": "The slow invisible part of the work decides the result, long before anyone sees it.",
  "shape": "problem-solution",
  "length": { "unit": "words", "min": 800, "max": 1100 },
  "nodes": [
    { "id": "n1", "kind": "claim", "parent": null, "order": 1, "part": "problem", "words": 230,
      "text": "Team leads reward the output they can see, so the slow groundwork goes unrewarded and unprotected.",
      "evidence": [
        { "slot": "e1", "filled_by": "transcript line 11: \"patience with the slow invisible part of the work\"" },
        { "slot": "e2", "filled_by": null }
      ] },
    { "id": "n2", "kind": "claim", "parent": null, "order": 2, "part": "stakes", "words": 150,
      "text": "By the time the output is visible, the result is already decided, and it can't be fixed at that stage.",
      "evidence": [
        { "slot": "e1", "filled_by": "transcript line 5: \"If the starter is weak, the loaves come out flat and sour and nobody can fix that at the oven.\"" }
      ] },
    { "id": "n3", "kind": "claim", "parent": null, "order": 3, "part": "solution", "words": 380,
      "text": "Protect the unglamorous early work the way a baker protects the starter: the month of feeding it, the eleven years of notebooks.",
      "covers": ["must_include.0", "must_include.1"],
      "evidence": [
        { "slot": "e1", "filled_by": "brief must_include.0: the month of feeding the starter" },
        { "slot": "e2", "filled_by": "brief must_include.1: the eleven years of notebooks" },
        { "slot": "e3", "filled_by": null }
      ] },
    { "id": "n6", "kind": "open-question", "parent": "n3", "order": 1,
      "text": "What does protecting early work actually look like on a team? The brief has the bakery side of it but no team practice." },
    { "id": "n4", "kind": "open-question", "parent": null, "order": 4, "part": "objection", "words": 100,
      "text": "Which objection will a team lead raise first? The brief doesn't name one, so this part is held open." },
    { "id": "n5", "kind": "claim", "parent": null, "order": 5, "part": "close", "words": 100,
      "text": "First step: learn to see quality in the slow part, the way she knew he would be good before any loaf proved it.",
      "evidence": [
        { "slot": "e1", "filled_by": "transcript line 9: \"That was the moment she knew he would be good.\"" }
      ] }
  ],
  "source": { "brief_digest": "718a3caff0c9ea588f3505f13c1454961fd324ec4b4d6698ef293ae4e04d261e", "draft_digest": null }
}

````

**Tool result:**

````
File created successfully at: <task>/b-problem-solution.json (file state is current in your context — no need to Read it back)
````

**Tool call — Write:**

````
<task>/c-letter.json
{
  "mode": "argument",
  "title": "A letter to the team lead about the starter",
  "thesis": "The slow invisible part of the work decides the result, long before anyone sees it.",
  "shape": "letter",
  "length": { "unit": "words", "min": 800, "max": 1100 },
  "nodes": [
    { "id": "n1", "kind": "claim", "parent": null, "order": 1, "part": "occasion", "words": 100,
      "text": "To the team lead who rewards visible output: here is something I learned from bread.",
      "evidence": [
        { "slot": "e1", "filled_by": "brief audience: team leads who reward visible output over slow groundwork" }
      ] },
    { "id": "n6", "kind": "open-question", "parent": "n1", "order": 1,
      "text": "What prompts the letter now, and who is the writer to this reader? A letter needs that relationship, and the brief doesn't give it." },
    { "id": "n2", "kind": "claim", "parent": null, "order": 2, "part": "body", "words": 300,
      "text": "The starter decides the loaf: weak starter, flat sour bread, and nothing at the oven fixes it. That's why the month of feeding it matters.",
      "covers": ["must_include.0"],
      "evidence": [
        { "slot": "e1", "filled_by": "transcript line 5: \"If the starter is weak, the loaves come out flat and sour and nobody can fix that at the oven.\"" },
        { "slot": "e2", "filled_by": "brief must_include.0: the month of feeding the starter" }
      ] },
    { "id": "n3", "kind": "claim", "parent": null, "order": 3, "part": "body", "words": 250,
      "text": "The eleven years of notebooks are the same patience at a longer scale.",
      "covers": ["must_include.1"],
      "evidence": [
        { "slot": "e1", "filled_by": "brief must_include.1: the eleven years of notebooks" },
        { "slot": "e2", "filled_by": null }
      ] },
    { "id": "n7", "kind": "open-question", "parent": "n3", "order": 1,
      "text": "Whose notebooks are they, and what do they record? The brief doesn't say." },
    { "id": "n4", "kind": "claim", "parent": null, "order": 4, "part": "body", "words": 200,
      "text": "Good judges see quality in the slow part: she knew he would be good before any result showed it.",
      "evidence": [
        { "slot": "e1", "filled_by": "transcript line 9: \"That was the moment she knew he would be good.\"" }
      ] },
    { "id": "n5", "kind": "claim", "parent": null, "order": 5, "part": "ask", "words": 130,
      "text": "My ask: protect the unglamorous early work on your team, before it has anything to show.",
      "evidence": [
        { "slot": "e1", "filled_by": "brief purpose: make readers protect the unglamorous early work on their teams" }
      ] }
  ],
  "source": { "brief_digest": "718a3caff0c9ea588f3505f13c1454961fd324ec4b4d6698ef293ae4e04d261e", "draft_digest": null }
}

````

**Tool result:**

````
File created successfully at: <task>/c-letter.json (file state is current in your context — no need to Read it back)
````

**Assistant:**

Three candidate outlines are drafted. Now I'm running the checker on each and the comparison.

**Tool call — Bash:**

````
T=<plugins>/prose-outline/skills/prose-outline
P=<task>
node $T/tools/proposal-check.mjs $P/a-narrative-arc.json --shape $T/shapes/narrative-arc.md --brief-json brief.json
node $T/tools/proposal-check.mjs $P/b-problem-solution.json --shape $T/shapes/problem-solution.md --brief-json brief.json
node $T/tools/proposal-check.mjs $P/c-letter.json --shape $T/shapes/letter.md --brief-json brief.json
node $T/tools/outline-compare.mjs $P/a-narrative-arc.json $P/b-problem-solution.json $P/c-letter.json --brief-json brief.json
node $T/tools/outline-store.mjs locate
````

*[permission denied by the harness allowlist: "Bash"]*

**Tool result (error):**

````
A variable set in this command can't be checked before it runs
````

**Tool call — Bash:**

````
node <plugins>/prose-outline/skills/prose-outline/tools/proposal-check.mjs <task>/a-narrative-arc.json --shape <plugins>/prose-outline/skills/prose-outline/shapes/narrative-arc.md --brief-json brief.json; node <plugins>/prose-outline/skills/prose-outline/tools/proposal-check.mjs <task>/b-problem-solution.json --shape <plugins>/prose-outline/skills/prose-outline/shapes/problem-solution.md --brief-json brief.json; node <plugins>/prose-outline/skills/prose-outline/tools/proposal-check.mjs <task>/c-letter.json --shape <plugins>/prose-outline/skills/prose-outline/shapes/letter.md --brief-json brief.json
````

**Tool result:**

````
proposal-check — clean
  0 claims, 2 open questions, 0 empty evidence slots
  limit: Whether these are the right claims, in the right order, is not checked here.
proposal-check — clean
  4 claims, 2 open questions, 2 empty evidence slots
  limit: Whether these are the right claims, in the right order, is not checked here.
proposal-check — clean
  5 claims, 2 open questions, 1 empty evidence slots
  limit: Whether these are the right claims, in the right order, is not checked here.
````

**Tool call — Bash:**

````
node <plugins>/prose-outline/skills/prose-outline/tools/outline-compare.mjs <task>/a-narrative-arc.json <task>/b-problem-solution.json <task>/c-letter.json --brief-json brief.json
````

**Tool result:**

````
| | a-narrative-arc | b-problem-solution | c-letter |
|---|---|---|---|
| shape | narrative-arc (beat-sheet) | problem-solution (argument) | letter (argument) |
| nodes | 7 | 6 | 7 |
| words allocated | 900 of 800–1100 | 960 of 800–1100 | 980 of 800–1100 |
| required parts missing | none | none | none |
| must-include covered | 2 of 2 | 2 of 2 | 2 of 2 |
| open questions | 2 | 2 | 2 |
| share signals | 0 | 0 | 0 |
| findings | none | none | none |
````

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

I've drafted three outlines for the brief, each in a different shape. All three pass the checker with no findings. They keep your thesis word for word ("The slow invisible part of the work decides the result, long before anyone sees it") and stay within your 800–1100 word band. Each one includes both must-include items: the month of feeding the starter and the eleven years of notebooks.

One thing to know first: your brief already lists **narrative-arc** as the agreed shape. Candidate A uses it, and B and C are there so you have real alternatives to compare it with.

### A · Narrative arc (story first, 900 words)
**Premise:** the thesis
1. **Setup (170):** The bakery and its starter. "If the starter is weak, the loaves come out flat and sour and nobody can fix that at the oven." (transcript, line 5)
2. **Inciting moment (100):** The month of feeding the starter begins, and it shows nothing for weeks. *(must-include 0)*
3. **Complication (300):** The long middle where nothing shows, set against the eleven years of notebooks. *(must-include 0 and 1)*
   - ❓ Whose notebooks are they, and what do they record?
4. **Turn (150):** "That was the moment she knew he would be good." (line 9) Someone sees the slow work's worth before any loaf proves it.
   - ❓ Who are "she" and "he", and what happened in that moment? The brief quotes the line but doesn't describe the scene.
5. **Resolution (180):** Turn it over to the team lead: the slow part decided the result (line 11). The reader is left to protect it, without the story being explained back to them.

### B · Problem–solution (argument, 960 words)
1. **Problem (230):** Team leads reward the output they can see, so groundwork goes unprotected. Evidence: line 11, plus one empty slot.
2. **Stakes (150):** By the time output is visible, the result is already decided and can't be fixed. Evidence: line 5.
3. **Solution (380):** Protect early work the way a baker protects the starter: the month of feeding, the eleven years of notebooks. *(must-include 0 and 1; one empty slot)*
   - ❓ What does protecting early work look like on an actual team? The brief covers the bakery side but gives no team practice.
4. **Objection (100):** ❓ Which objection will a team lead raise first? The brief doesn't name one, so this part is left open.
5. **Close (100):** First step: learn to see quality in the slow part, the way "she knew he would be good". Evidence: line 9.

### C · Letter (to the team lead, 980 words)
1. **Occasion (100):** "To the team lead who rewards visible output…" Evidence: the audience in your brief.
   - ❓ What prompts the letter now, and who are you to this reader? A letter depends on that relationship, and the brief doesn't give it.
2. **Body (300):** The starter decides the loaf (line 5), which is why the month of feeding matters. *(must-include 0)*
3. **Body (250):** The eleven years of notebooks are the same patience on a longer scale. *(must-include 1; one empty slot)*
   - ❓ Whose notebooks are they, and what do they record?
4. **Body (200):** Good judges see quality in the slow part: "she knew he would be good" (line 9).
5. **Ask (130):** Protect the unglamorous early work on your team. Evidence: the purpose in your brief.

### Side by side

| | A · narrative-arc | B · problem-solution | C · letter |
|---|---|---|---|
| mode | beat-sheet | argument | argument |
| nodes | 7 | 6 | 7 |
| words allocated | 900 of 800–1100 | 960 of 800–1100 | 980 of 800–1100 |
| required parts missing | none | none | none |
| must-include covered | 2 of 2 | 2 of 2 | 2 of 2 |
| open questions | 2 | 2 | 2 |
| sections outside the shape's usual size | 0 | 0 | 0 |
| findings | none | none | none |

The table doesn't score them, so it's your call.

**Gaps in the brief:** I left some evidence slots empty rather than filling them with something that merely sounds plausible. The open questions are things the brief doesn't settle. The brief only quotes a few transcript lines, and the full transcript wasn't with it, so I couldn't look up who "she" and "he" are or whose notebooks they are.

**Saving:** I found your outline store under the "personal" identity. Nothing has been saved yet. Tell me which candidate you want and the project name to save it under (`brief.json` doesn't include one), and I'll save it with your OK. The other two won't be saved.

The candidate files are:
- `<task>/a-narrative-arc.json`
- `<task>/b-problem-solution.json`
- `<task>/c-letter.json`

*turn ended: success, 26 model turns, $0.70*

## Turn 2

*model reported by init: `claude-opus-5-5`*

**Writer:**

> I'll take A, the narrative arc. Yes, save it as project starter.

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

The `starter` project has no outline yet, so I'm saving at revision 0 (new project).

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

I saved candidate A, the narrative arc, as project **starter**. It's the first saved version (revision 1) in your personal store, and there's no earlier outline under that name. If you change your mind, I can undo the save. That keeps the history, so revision 1 stays on record.

I didn't save B and C. They're still in the scratchpad if you want to look at them again.

Two open questions in the saved outline need answers before drafting goes smoothly:
- **Beat 3:** whose eleven years of notebooks are these, and what do they record?
- **Beat 4:** who are "she" and "he", and what happened at that moment?

When you're ready, the prose-draft skill can write from this outline. If you revise the outline first, I'll compare the new version against this one.

*turn ended: success, 3 model turns, $0.79*

