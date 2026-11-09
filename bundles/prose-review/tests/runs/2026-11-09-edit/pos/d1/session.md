# Session transcript

Rendered from the session's stream-json by the harness driver. Tool results longer than
80 lines are trimmed (marked). Scratch paths are shortened: `<plugins>` is the plugin copy,
`<draw>` the draw's directory, `<task>` the session's own scratchpad.

## Turn 1

*model reported by init: `claude-opus-5-5`*

**Writer:**

> /prose-review:prose-edit Let's read draft.md together, section by section. The review has already run; the consolidated notes are in review.md.

**Tool call — Read:**

````
{
 "file_path": "<plugins>/prose-review/skills/prose-edit/references/edit-notes.md"
}
````

**Tool result:**

````
1	# `edit-notes/1`
2	
3	The editor's ledger for one draft: which reading units were read, and what
4	the writer decided about each note. It is task-local, beside `plan.json`, and
5	never a registry store. The validator and exporter is `tools/notes-check.mjs`.
6	
7	```json
8	{
9	  "schema": "edit-notes/1",
10	  "draft_digest": "<sha256 of the draft the notes were made on>",
11	  "finished": false,
12	  "units": [ { "id": "ua1f2aac3", "status": "read", "skip_reason": null } ],
13	  "notes": [
14	    { "id": "N1", "unit": "ua1f2aac3", "source": "voice-critic",
15	      "line": 15, "quote": "we starve the part that decides it",
16	      "note": "what the critic found, in one line",
17	      "change": "replace 'starve' with 'neglect'",
18	      "status": "accepted", "writer_comment": null }
19	  ]
20	}
21	```
22	
23	| Field | Rule |
24	|---|---|
25	| `units[].id` | A `section-split` unit id. These are derived from the unit's text, so they are stable while it is unchanged. |
26	| `units[].status` | `read`, or `skipped` with the writer's `skip_reason`. |
27	| `notes[].source` | Exactly one of: a critic (`voice-critic`, `structure-critic`, `fidelity-critic`, `medium-critic`, `continuity-critic`, `reader-critic:<persona>`), or `writer`. The session itself is never a source. |
28	| `notes[].quote` | The span the note rests on. It must be inside the unit the note is filed under. The quote is the anchor, and `line` is reported if it moved. |
29	| `notes[].status` | `proposed` → `accepted` / `declined` / `deferred`. Only the writer moves a note out of `proposed`. |
30	| `notes[].change` | Required when accepted: a short imperative the reviser can execute (PLAN-FORMAT). |
31	| `finished` | Set when the writer ends the pass. A finished ledger has every unit read or skipped, and no note still proposed. |
32	
33	`notes-check --export` writes the accepted notes, and only those, as
34	[PLAN-FORMAT](../../../PLAN-FORMAT.md) entries:
35	- `id`: `eNN`;
36	- `source` and `location` carried over;
37	- `change`;
38	- `reason`: the note text.
39	
40	These are appended to `plan.json` for the reviser.
41	
````

**Tool call — Bash:**

````
ls -la && cat review.md && node <plugins>/prose-review/skills/prose-edit/tools/section-split.mjs draft.md --json
````

**Tool result:**

````
total 16
drwxr-xr-x 2 root root 4096 Nov  9 18:35 .
drwxr-xr-x 4 root root 4096 Nov  9 18:35 ..
-rw-r--r-- 1 root root 1301 Nov  9 18:35 draft.md
-rw-r--r-- 1 root root 3072 Nov  9 18:35 review.md
# Review of draft.md: consolidated notes

The whole draft was reviewed once. Each critic ran in its own clean context:

- `prose-structure-critic`, in draft-only mode because no intended outline was given. It read the `outline-scan` output.
- `prose-reader-critic`, reading as the persona `skeptical-cto`.

## Notes, ranked

1. **reader-critic:skeptical-cto**, line 14: "Teams work the same way."
   This reader stopped here. "The whole case for changing how I onboard rests on this sentence, and it asks me to accept that a team behaves like a starter without saying what the 'starter' is in my org or how starving it causes the failure."

2. **reader-critic:skeptical-cto**, line 29: "Give the new person a month on the slow part."
   This is the reader's forced choice, the sentence they would push back on hardest in a meeting. "It asks me to give up a month of every new hire's output, the draft never puts a cost on that, and the only benefit offered is the bakery story, which I couldn't take to my board."

## CLEAN

- **structure-critic**: CLEAN. In draft-only mode it assesses transitions and balance only. "Transitions: clean ... Imbalance: clean."

The full critic reports follow, verbatim.

---

## prose-structure-critic

Mode: draft-only. No intended outline was supplied, so I could not judge whether claims are supported or sections are in the right order (classes 1 and 2). I looked only at transitions and imbalance.

No findings.

- **Unsupported claims:** not assessed (draft-only mode).
- **Order:** not assessed (draft-only mode).
- **Transitions:** clean. The scan lists four unmarked boundaries, and none of them leaves the reader stranded:
  - Line 10 continues the starter from line 3, and its heading carries the reader across.
  - Line 14 opens with "Teams work the same way.", which ties back to the paragraph before. The scan's marker list doesn't include this kind of comparison, so it was counted as unmarked.
  - Line 19 opens with "Her best baker", and "Her" points back to the neighbour from line 3.
  - Line 23 keeps the same subject ("She") and introduces the notebook that line 29 depends on.
- **Imbalance:** clean. Sections range from 0.614 to 1.368 times the median of 57 words. No section is extreme, and the shortest, "What to do on Monday", is a coda that pulls together claims made earlier.

Scanner defects: none.

CLEAN

---

## prose-reader-critic (skeptical-cto)

**WHERE I STOPPED**: line 14, "Teams work the same way."
**WHY, AS THIS READER**: The whole case for changing how I onboard rests on this sentence, and it asks me to accept that a team behaves like a starter without saying what the "starter" is in my org or how starving it causes the failure.

**FORCED CHOICE**: line 29, "Give the new person a month on the slow part."
**WHY**: It asks me to give up a month of every new hire's output, the draft never puts a cost on that, and the only benefit offered is the bakery story, which I couldn't take to my board.

**Nothing here for**: unsupported cost or scale claims, hand-waved risk, vendor language

REVISE
{
  "schema": "section-split/1",
  "draft_digest": "b7469508565a75b304c9efa2839fcffc051c674bc894c294df6fd10c1ba0d4e3",
  "window": null,
  "units": [
    {
      "id": "u48cf569d",
      "order": 1,
      "heading": "Feed the starter",
      "start_line": 1,
      "end_line": 6,
      "words": 44,
      "digest": "48cf569d566db66584a1db5619a85db85639af4c5cdf67f3b0390024442fa8eb"
    },
    {
      "id": "ua1f2aac3",
      "order": 2,
      "heading": "The part nobody sees",
      "start_line": 8,
      "end_line": 15,
… [23 more lines trimmed]
````

**Tool call — Read:**

````
{
 "file_path": "<draw>/work/draft.md"
}
````

**Tool result:**

````
1	# Feed the starter
2	
3	My neighbour has run a sourdough bakery on the corner for eleven years. New
4	bakers there do not shape a single loaf for their first month. They feed the
5	starter, clean the baskets, and write down the temperature of the cold room
6	every morning.
7	
8	## The part nobody sees
9	
10	If the starter is weak, the loaves come out flat and sour, and nobody can fix
11	that at the oven. The failure happens twelve hours before anyone touches the
12	dough, which is why the bakers who rush it never learn why their bread fails.
13	
14	Teams work the same way. We reward the visible part of the work, the shaping
15	and the scoring, and we starve the part that decides it.
16	
17	## A month on the starter
18	
19	Her best baker hated the first month. He thought it was hazing. Three weeks in,
20	he noticed the dough rising slower on rainy days and started adjusting the
21	water temperature on his own. That was the moment she knew he would be good.
22	
23	She keeps a notebook for every batch, eleven years of them on a shelf above the
24	ovens, and when a loaf goes wrong she reads back until she finds the day the
25	starter got tired.
26	
27	## What to do on Monday
28	
29	Give the new person a month on the slow part. Keep the notebook that lets you
30	read a failure back. And watch for the moment they notice the starter, because
31	that is when you know.
32	
````

**Tool call — Write:**

````
<draw>/work/edit-notes.json
{
  "schema": "edit-notes/1",
  "draft_digest": "b7469508565a75b304c9efa2839fcffc051c674bc894c294df6fd10c1ba0d4e3",
  "finished": false,
  "units": [],
  "notes": [
    { "id": "N1", "unit": "ua1f2aac3", "source": "reader-critic:skeptical-cto",
      "line": 14, "quote": "Teams work the same way.",
      "note": "Reader stopped here: the case rests on a team behaving like a starter, without saying what the 'starter' is in their org or how starving it causes the failure.",
      "change": null, "status": "proposed", "writer_comment": null },
    { "id": "N2", "unit": "u4e83b821", "source": "reader-critic:skeptical-cto",
      "line": 29, "quote": "Give the new person a month on the slow part.",
      "note": "Forced choice: asks for a month of every new hire's output with no cost put on it; the only benefit offered is the bakery story, which this reader couldn't take to a board.",
      "change": null, "status": "proposed", "writer_comment": null }
  ]
}

````

**Tool result:**

````
File created successfully at: <draw>/work/edit-notes.json (file state is current in your context — no need to Read it back)
````

**Assistant:**

I've split the draft into four sections. The review used two critics, both from `review.md`: **structure-critic**, which only checked transitions and balance because no outline was given, and **reader-critic**, reading as the persona `skeptical-cto`. Between them there are two notes, and they fall in sections 2 and 4. I'm keeping track of your decisions in `edit-notes.json`.

---

## Section 1 of 4: "Feed the starter" (lines 1–6)

> # Feed the starter
>
> My neighbour has run a sourdough bakery on the corner for eleven years. New
> bakers there do not shape a single loaf for their first month. They feed the
> starter, clean the baskets, and write down the temperature of the cold room
> every morning.

**Notes:** none.

**Clean here:** structure-critic and reader-critic:skeptical-cto. Structure-critic did point out that the starter introduced here is picked up again at line 10, and that "Her" at line 19 refers back to this neighbour. Both links work.

Do you want to add a note of your own to this section? If not, say when you're ready and we'll go to section 2, "The part nobody sees", which has the reader's stopping point.

*turn ended: success, 5 model turns, $0.15*

## Turn 2

*model reported by init: `claude-opus-5-5`*

**Writer:**

> What do you think of this section yourself?

**Assistant:**

I'll pass on that one, because the way this review works, opinions come only from the critics. If I added my own, the edit notes would be carrying an extra reviewer that nobody checked.

Here's what the critics did say about section 1:

- **structure-critic** found nothing to fix. The section sets up the starter that line 10 picks up and the neighbour that "Her" at line 19 points back to, and both links work.
- **reader-critic:skeptical-cto** had no note on these lines. It kept reading and first stopped at line 14.

Some questions about this section neither critic looked at:

- **Voice and wording**, such as the "eleven years" detail or the rhythm of the list in lines 5–6, belong to **voice-critic**.
- **Whether the bakery facts are accurate or the opening overclaims** belongs to **fidelity-critic**.
- **Whether the opening suits where it will be published** belongs to **medium-critic**.

None of those three ran in this review. If you want one of them, I can run it on the whole draft so it stays within its tested limits. I can also run it on just this section, but those limits were measured on whole drafts, so a section-only result would be weaker evidence. Or you can add a note of your own here.

If you'd rather go on, section 2 is next. That's where the skeptical CTO stopped reading.

*turn ended: success, 1 model turns, $0.18*

## Turn 3

*model reported by init: `claude-opus-5-5`*

**Writer:**

> Yes, next.

**Tool call — Edit:**

````
{
 "replace_all": false,
 "file_path": "<draw>/work/edit-notes.json",
 "old_string": "  \"units\": [],",
 "new_string": "  \"units\": [\n    { \"id\": \"u48cf569d\", \"status\": \"read\", \"skip_reason\": null }\n  ],"
}
````

**Tool result:**

````
The file <draw>/work/edit-notes.json has been updated successfully. (file state is current in your context — no need to Read it back)
````

**Assistant:**

I've marked section 1 as read, with no notes.

---

## Section 2 of 4: "The part nobody sees" (lines 8–15)

> ## The part nobody sees
>
> If the starter is weak, the loaves come out flat and sour, and nobody can fix
> that at the oven. The failure happens twelve hours before anyone touches the
> dough, which is why the bakers who rush it never learn why their bread fails.
>
> Teams work the same way. We reward the visible part of the work, the shaping
> and the scoring, and we starve the part that decides it.

**Notes:**

**N1: reader-critic:skeptical-cto**, line 14: "Teams work the same way."
This reader stopped reading here. In the reader's words: "The whole case for changing how I onboard rests on this sentence, and it asks me to accept that a team behaves like a starter without saying what the 'starter' is in my org or how starving it causes the failure."

**Clean here:** structure-critic. It looked at this same sentence and decided that "Teams work the same way." connects properly to the paragraph before. Its scan had marked the sentence as an unmarked transition only because the scan doesn't recognise comparisons. That doesn't contradict N1. The two critics are judging different things: structure-critic asks whether the sentence links to what came before, and the reader asks whether it persuades.

**Your call on N1:**
- **Accept:** tell me what you want changed, in your own words. For example, you might name what the "starter" is on a team, or show how neglecting it leads to the failure.
- **Decline**
- **Defer**

You can also add a note of your own to this section.

*turn ended: success, 2 model turns, $0.21*

## Turn 4

*model reported by init: `claude-opus-5-5`*

**Writer:**

> Accept N1. Say what the starter is on a team, the first weeks of onboarding work, before making the comparison.

**Tool call — Edit:**

````
{
 "replace_all": false,
 "file_path": "<draw>/work/edit-notes.json",
 "old_string": "      \"change\": null, \"status\": \"proposed\", \"writer_comment\": null },",
 "new_string": "      \"change\": \"Before 'Teams work the same way.', say what the starter is on a team: the first weeks of onboarding work.\", \"status\": \"accepted\", \"writer_comment\": null },"
}
````

**Tool result:**

````
The file <draw>/work/edit-notes.json has been updated successfully.
````

**Tool call — Edit:**

````
{
 "replace_all": false,
 "file_path": "<draw>/work/edit-notes.json",
 "old_string": "    { \"id\": \"u48cf569d\", \"status\": \"read\", \"skip_reason\": null }",
 "new_string": "    { \"id\": \"u48cf569d\", \"status\": \"read\", \"skip_reason\": null },\n    { \"id\": \"ua1f2aac3\", \"status\": \"read\", \"skip_reason\": null }"
}
````

**Tool result:**

````
The file <draw>/work/edit-notes.json has been updated successfully.
````

**Assistant:**

I've marked N1 as **accepted**. The instruction the reviser will get is:

> Before "Teams work the same way.", say what the starter is on a team: the first weeks of onboarding work.

Section 2 is marked as read.

Do you want to add a note of your own to this section? If not, say "next" and we'll go to section 3, "A month on the starter".

*turn ended: success, 3 model turns, $0.25*

## Turn 5

*model reported by init: `claude-opus-5-5`*

**Writer:**

> No note of my own here. Next.

**Assistant:**

## Section 3 of 4: "A month on the starter" (lines 17–25)

> ## A month on the starter
>
> Her best baker hated the first month. He thought it was hazing. Three weeks in,
> he noticed the dough rising slower on rainy days and started adjusting the
> water temperature on his own. That was the moment she knew he would be good.
>
> She keeps a notebook for every batch, eleven years of them on a shelf above the
> ovens, and when a loaf goes wrong she reads back until she finds the day the
> starter got tired.

**Notes:** none.

**Clean here:** structure-critic and reader-critic:skeptical-cto. Structure-critic checked two links here and found both work. "Her best baker" at line 19 refers back to the neighbour from line 3. Line 23 keeps "She" as the subject and introduces the notebook that line 29 relies on. The reader read through this section without stopping.

Do you want to add a note of your own here? If not, say "next" and we'll go to section 4, "What to do on Monday". That's where the reader's forced choice is.

*turn ended: success, 1 model turns, $0.27*

## Turn 6

*model reported by init: `claude-opus-5-5`*

**Writer:**

> No note of my own here. Next.

**Tool call — Edit:**

````
{
 "replace_all": false,
 "file_path": "<draw>/work/edit-notes.json",
 "old_string": "    { \"id\": \"ua1f2aac3\", \"status\": \"read\", \"skip_reason\": null }",
 "new_string": "    { \"id\": \"ua1f2aac3\", \"status\": \"read\", \"skip_reason\": null },\n    { \"id\": \"ua41483fb\", \"status\": \"read\", \"skip_reason\": null }"
}
````

**Tool result:**

````
The file <draw>/work/edit-notes.json has been updated successfully.
````

**Assistant:**

I've marked section 3 as read, with no notes.

---

## Section 4 of 4: "What to do on Monday" (lines 27–31)

> ## What to do on Monday
>
> Give the new person a month on the slow part. Keep the notebook that lets you
> read a failure back. And watch for the moment they notice the starter, because
> that is when you know.

**Notes:**

**N2: reader-critic:skeptical-cto**, line 29: "Give the new person a month on the slow part."
This is the reader's forced choice, the sentence this reader would push back on hardest in a meeting. In the reader's words: "It asks me to give up a month of every new hire's output, the draft never puts a cost on that, and the only benefit offered is the bakery story, which I couldn't take to my board."

**Clean here:** structure-critic. This is the shortest section, at 0.614 of the median length, and structure-critic decided that's fine because it's a closing section that pulls together claims made earlier.

**Your call on N2:**
- **Accept:** tell me what you want changed, in your own words.
- **Decline**
- **Defer**

You can also add a note of your own here. This is the last section, so after you decide on N2 and say you're done, I'll mark the pass finished, check the edit notes, and export the accepted notes into the reviser's plan.

*turn ended: success, 2 model turns, $0.31*

## Turn 7

*model reported by init: `claude-opus-5-5`*

**Writer:**

> Decline N2. The cost is the point. I'm not putting a number on it. I also want to add my own note on "because that is when you know": cut this phrase, because it repeats the line about the moment she knew.

**Tool call — Edit:**

````
{
 "replace_all": false,
 "file_path": "<draw>/work/edit-notes.json",
 "old_string": "      \"change\": null, \"status\": \"proposed\", \"writer_comment\": null }\n  ]",
 "new_string": "      \"change\": null, \"status\": \"declined\", \"writer_comment\": \"The cost is the point. Not putting a number on it.\" },\n    { \"id\": \"N3\", \"unit\": \"u4e83b821\", \"source\": \"writer\",\n      \"line\": 30, \"quote\": \"because that is when you know\",\n      \"note\": \"Repeats the earlier line about the moment she knew (line 21).\",\n      \"change\": \"Cut the phrase 'because that is when you know'.\",\n      \"status\": \"accepted\", \"writer_comment\": null }\n  ]"
}
````

**Tool result:**

````
The file <draw>/work/edit-notes.json has been updated successfully.
````

**Tool call — Edit:**

````
{
 "replace_all": false,
 "file_path": "<draw>/work/edit-notes.json",
 "old_string": "    { \"id\": \"ua41483fb\", \"status\": \"read\", \"skip_reason\": null }",
 "new_string": "    { \"id\": \"ua41483fb\", \"status\": \"read\", \"skip_reason\": null },\n    { \"id\": \"u4e83b821\", \"status\": \"read\", \"skip_reason\": null }"
}
````

**Tool result:**

````
The file <draw>/work/edit-notes.json has been updated successfully.
````

**Assistant:**

I've recorded both:

- **N2: declined.** I saved your reason: "The cost is the point. Not putting a number on it."
- **N3: your note, accepted.** It's filed against line 30, "because that is when you know". The reason recorded is that it repeats the earlier line about the moment she knew (line 21). The instruction to the reviser is: *Cut the phrase "because that is when you know."* The comma before it will have to go too, leaving "…watch for the moment they notice the starter." I've left that tidying to the reviser.

All four sections are now marked as read. Here's where the edit notes stand:

| Note | Source | Decision |
|---|---|---|
| N1, line 14 | reader-critic:skeptical-cto | accepted |
| N2, line 29 | reader-critic:skeptical-cto | declined |
| N3, line 30 | writer | accepted |

Shall I end the pass? If so, I'll mark it finished, run the check, export N1 and N3 into `plan.json`, and offer to hand the plan to the reviser.

*turn ended: success, 3 model turns, $0.36*

## Turn 8

*model reported by init: `claude-opus-5-5`*

**Writer:**

> That's everything. Finish the pass.

**Tool call — Edit:**

````
{
 "replace_all": false,
 "file_path": "<draw>/work/edit-notes.json",
 "old_string": "  \"finished\": false,",
 "new_string": "  \"finished\": true,"
}
````

**Tool result:**

````
The file <draw>/work/edit-notes.json has been updated successfully.
````

**Tool call — Bash:**

````
node ../../../../plugins/prose-review/skills/prose-edit/tools/notes-check.mjs edit-notes.json draft.md --export plan-entries.json; echo "exit=$?"; cat plan-entries.json 2>/dev/null; ls
````

*[permission denied by the harness allowlist: "Bash"]*

**Tool result (error):**

````
This Bash command contains multiple operations. The following part requires approval: echo "exit=$?"
````

**Tool call — Bash:**

````
node <plugins>/prose-review/skills/prose-edit/tools/notes-check.mjs <draw>/work/edit-notes.json <draw>/work/draft.md --export <draw>/work/plan-entries.json
````

**Tool result:**

````
notes-check: clean — 2 accepted, 1 declined, 0 deferred, 0 proposed
  exported 2 plan entries
````

**Tool call — Read:**

````
{
 "file_path": "<draw>/work/plan-entries.json"
}
````

**Tool result:**

````
1	[
2	  {
3	    "id": "e01",
4	    "source": "reader-critic:skeptical-cto",
5	    "location": {
6	      "line": 14,
7	      "quote": "Teams work the same way."
8	    },
9	    "change": "Before 'Teams work the same way.', say what the starter is on a team: the first weeks of onboarding work.",
10	    "reason": "Reader stopped here: the case rests on a team behaving like a starter, without saying what the 'starter' is in their org or how starving it causes the failure."
11	  },
12	  {
13	    "id": "e03",
14	    "source": "writer",
15	    "location": {
16	      "line": 30,
17	      "quote": "because that is when you know"
18	    },
19	    "change": "Cut the phrase 'because that is when you know'.",
20	    "reason": "Repeats the earlier line about the moment she knew (line 21)."
21	  }
22	]
23	
````

**Tool call — Glob:**

````
{
 "pattern": "plan.json"
}
````

**Tool result:**

````
No files found
````

**Tool call — Read:**

````
{
 "file_path": "<plugins>/prose-review/PLAN-FORMAT.md"
}
````

**Tool result:**

````
1	# Edit plan format
2	
3	The contract `prose-reviser` reads and writes to. Held in this document rather than
4	in a schema file because there is one consumer and one producer today, and a schema
5	that has never validated anything is worth less than a paragraph that describes what
6	is required and why.
7	
8	## The unit
9	
10	A **plan** is a JSON object. It names a draft, names the voice profile the reviser
11	should stay inside, and carries an ordered list of **entries**. Each entry is one
12	edit the reviser is authorised to make.
13	
14	```json
15	{
16	  "draft": "path/to/original.md",
17	  "voice_profile": "essay",
18	  "mode": "plan-only",
19	  "entries": [
20	    {
21	      "id": "e01",
22	      "source": "voice-critic",
23	      "location": {"line": 42, "quote": "the utilised approach"},
24	      "change": "replace with 'the approach we used'",
25	      "reason": "voice-critic flagged 'utilised' as outside the corpus register"
26	    }
27	  ]
28	}
29	```
30	
31	## Field-by-field, and why each is required
32	
33	**`draft`** — a path to the original text. The reviser reads it and does not
34	edit it. The fidelity gate uses it as ground truth.
35	
36	**`voice_profile`** — the profile name (`essay`, `technical`, etc.) whose corpus
37	the reviser must stay inside. Not the same thing as "which corpus to imitate" — the
38	reviser is not a drafter; it makes small changes that a fresh reader would not
39	notice as a change of hand. The profile is the fence, not the goal.
40	
41	**`mode`** — `plan-only` or `plan-plus-prose`. Default is `plan-only`.
42	- `plan-only` — the reviser sees the entries below and nothing else. Small
43	  attack surface, clean traceability, no critic overconfidence leaking into an
44	  edit.
45	- `plan-plus-prose` — each entry may carry a `critic_transcript` field, and the
46	  reviser reads it as context. The transcript never authorises an edit the plan
47	  does not already; it only supplies reasoning the reviser may weigh. Use when a
48	  plan entry's `change` is genuinely underdetermined and the critic's argument
49	  is the missing half.
50	
51	Two modes exist because DESIGN.md's open question 4 ("does the reviser see the
52	critics' prose, or only the plan?") is a real fork. The default is the safer
53	half; the other half is available and its extra risk is stated on the tin.
54	
55	**`entries[]`** — the actual work.
56	
57	- **`id`** — a short string, unique within the plan. The reviser echoes this on
58	  every diff it makes, which is how the fidelity critic checks "edits outside
59	  the plan" — an atom whose span is not inside any entry's `location.quote`, or
60	  a diff whose change log carries no matching `id`, is out of plan by definition.
61	
62	- **`source`** — where the entry came from. Free-form (`voice-critic`,
63	  `substance-critic`, `author`, `consolidator`) but recorded so a run log can
64	  explain which critic's finding drove which change. The reviser does not act
65	  on this — it is provenance, not instruction.
66	
67	- **`location`** — `{line: N, quote: "..."}`. The `quote` is what
68	  `prose-fidelity-critic` matches spans against. The `line` is for the
69	  operator's report and is not load-bearing; if a document was reflowed between
70	  the plan being written and the reviser reading it, the quote is the anchor.
71	
72	- **`change`** — a short imperative sentence. What to do. Not why. If the
73	  reviser cannot execute the change as stated (the quote does not match, the
74	  change is ambiguous), it refuses that entry rather than guessing. Silence is
75	  better than a plausible wrong edit.
76	
77	- **`reason`** — one line, echoed into the change log unedited. This is the
78	  audit trail: any diff the reviser made, why it made it.
79	
80	- **`critic_transcript`** *(optional, `plan-plus-prose` only)* — inline text or
… [68 more lines trimmed]
````

**Tool call — Write:**

````
<draw>/work/plan.json
{
  "draft": "draft.md",
  "voice_profile": null,
  "mode": "plan-only",
  "entries": [
    {
      "id": "e01",
      "source": "reader-critic:skeptical-cto",
      "location": {
        "line": 14,
        "quote": "Teams work the same way."
      },
      "change": "Before 'Teams work the same way.', say what the starter is on a team: the first weeks of onboarding work.",
      "reason": "Reader stopped here: the case rests on a team behaving like a starter, without saying what the 'starter' is in their org or how starving it causes the failure."
    },
    {
      "id": "e03",
      "source": "writer",
      "location": {
        "line": 30,
        "quote": "because that is when you know"
      },
      "change": "Cut the phrase 'because that is when you know'.",
      "reason": "Repeats the earlier line about the moment she knew (line 21)."
    }
  ]
}

````

**Tool result:**

````
File created successfully at: <draw>/work/plan.json (file state is current in your context — no need to Read it back)
````

**Assistant:**

The pass is finished. All four sections are marked read, nothing is left undecided, and the check came back clean: 2 accepted, 1 declined, 0 deferred, 0 undecided.

There was no `plan.json` yet, so I created one in the working folder. It holds the two accepted changes:

- **e01, line 14** (from reader-critic:skeptical-cto): before "Teams work the same way.", say what the starter is on a team, which is the first weeks of onboarding work.
- **e03, line 30** (your note): cut "because that is when you know".

The IDs follow the original note numbers, so N2, which you declined, has no entry and the plan skips from e01 to e03.

Before the reviser can run, the plan needs one thing from you: a **voice profile**, such as `essay` or `technical`. The reviser has to keep its edits within that style, and nothing in this session tells me which one fits, so I've left it blank rather than guess. Tell me the profile and I'll fill it in and hand the plan to the reviser. It will run in plan-only mode, so it sees only these two entries and won't change anything else.

Files are in <draw>/work:
- edit-notes.json
- plan-entries.json
- plan.json

*turn ended: success, 8 model turns, $0.51*

## Turn 9

*model reported by init: `claude-opus-5-5`*

**Writer:**

> Not now.

**Assistant:**

Okay, I'll leave the reviser for now. `plan.json` is saved with the two changes, and the voice profile is still blank. When you want to go ahead, tell me the profile and I'll fill it in and run the reviser.

*turn ended: success, 1 model turns, $0.52*

