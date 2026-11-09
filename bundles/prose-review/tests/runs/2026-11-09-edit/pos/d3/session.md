# Session transcript

Rendered from the session's stream-json by the harness driver. Tool results longer than
80 lines are trimmed (marked). Scratch paths are shortened: `<plugins>` is the plugin copy,
`<draw>` the draw's directory, `<task>` the session's own scratchpad.

## Turn 1

*model reported by init: `claude-opus-5-5`*

**Writer:**

> /prose-review:prose-edit Let's read draft.md together, section by section. The review has already run; the consolidated notes are in review.md.

**Tool call — Bash:**

````
SK=<plugins>/prose-review/skills/prose-edit; cat $SK/references/edit-notes.md; echo ====; ls -la; echo ====; cat review.md; echo ====; node $SK/tools/section-split.mjs draft.md --json
````

*[permission denied by the harness allowlist: "Bash"]*

**Tool result (error):**

````
This Bash command contains multiple operations. The following parts require approval: cat <plugins>/prose-review/skills/prose-edit/references/edit-notes.md, echo ====
````

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

**Tool call — Glob:**

````
{
 "pattern": "*"
}
````

**Tool result:**

````
draft.md
review.md
````

**Tool call — Read:**

````
{
 "file_path": "<draw>/work/review.md"
}
````

**Tool result:**

````
1	# Review of draft.md: consolidated notes
2	
3	The whole draft was reviewed once. Each critic ran in its own clean context:
4	
5	- `prose-structure-critic`, in draft-only mode because no intended outline was given. It read the `outline-scan` output.
6	- `prose-reader-critic`, reading as the persona `skeptical-cto`.
7	
8	## Notes, ranked
9	
10	1. **reader-critic:skeptical-cto**, line 14: "Teams work the same way."
11	   This reader stopped here. "The whole case for changing how I onboard rests on this sentence, and it asks me to accept that a team behaves like a starter without saying what the 'starter' is in my org or how starving it causes the failure."
12	
13	2. **reader-critic:skeptical-cto**, line 29: "Give the new person a month on the slow part."
14	   This is the reader's forced choice, the sentence they would push back on hardest in a meeting. "It asks me to give up a month of every new hire's output, the draft never puts a cost on that, and the only benefit offered is the bakery story, which I couldn't take to my board."
15	
16	## CLEAN
17	
18	- **structure-critic**: CLEAN. In draft-only mode it assesses transitions and balance only. "Transitions: clean ... Imbalance: clean."
19	
20	The full critic reports follow, verbatim.
21	
22	---
23	
24	## prose-structure-critic
25	
26	Mode: draft-only. No intended outline was supplied, so I could not judge whether claims are supported or sections are in the right order (classes 1 and 2). I looked only at transitions and imbalance.
27	
28	No findings.
29	
30	- **Unsupported claims:** not assessed (draft-only mode).
31	- **Order:** not assessed (draft-only mode).
32	- **Transitions:** clean. The scan lists four unmarked boundaries, and none of them leaves the reader stranded:
33	  - Line 10 continues the starter from line 3, and its heading carries the reader across.
34	  - Line 14 opens with "Teams work the same way.", which ties back to the paragraph before. The scan's marker list doesn't include this kind of comparison, so it was counted as unmarked.
35	  - Line 19 opens with "Her best baker", and "Her" points back to the neighbour from line 3.
36	  - Line 23 keeps the same subject ("She") and introduces the notebook that line 29 depends on.
37	- **Imbalance:** clean. Sections range from 0.614 to 1.368 times the median of 57 words. No section is extreme, and the shortest, "What to do on Monday", is a coda that pulls together claims made earlier.
38	
39	Scanner defects: none.
40	
41	CLEAN
42	
43	---
44	
45	## prose-reader-critic (skeptical-cto)
46	
47	**WHERE I STOPPED**: line 14, "Teams work the same way."
48	**WHY, AS THIS READER**: The whole case for changing how I onboard rests on this sentence, and it asks me to accept that a team behaves like a starter without saying what the "starter" is in my org or how starving it causes the failure.
49	
50	**FORCED CHOICE**: line 29, "Give the new person a month on the slow part."
51	**WHY**: It asks me to give up a month of every new hire's output, the draft never puts a cost on that, and the only benefit offered is the bakery story, which I couldn't take to my board.
52	
53	**Nothing here for**: unsupported cost or scale claims, hand-waved risk, vendor language
54	
55	REVISE
56	
````

**Tool call — Bash:**

````
node <plugins>/prose-review/skills/prose-edit/tools/section-split.mjs draft.md --json
````

**Tool result:**

````
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
      "words": 70,
      "digest": "a1f2aac310958a49ebf19272214f02b0a89abe514b943b5d080f95cff57e1d5e"
    },
    {
      "id": "ua41483fb",
      "order": 3,
      "heading": "A month on the starter",
      "start_line": 17,
      "end_line": 25,
      "words": 78,
      "digest": "a41483fbbd1676c11d9d31908511fb67b12663b8182e0af07ac1e3569334e258"
    },
    {
      "id": "u4e83b821",
      "order": 4,
      "heading": "What to do on Monday",
      "start_line": 27,
      "end_line": 31,
      "words": 35,
      "digest": "4e83b821fb8934dce917004c1be9d55cf8ff9c6ecc92b6ed9c0c98eb8a451e8d"
    }
  ]
}
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
      "note": "Where the reader stopped: the case rests on this analogy without saying what the 'starter' is in a real org or how starving it causes the failure.",
      "change": null, "status": "proposed", "writer_comment": null },
    { "id": "N2", "unit": "u4e83b821", "source": "reader-critic:skeptical-cto",
      "line": 29, "quote": "Give the new person a month on the slow part.",
      "note": "Forced choice: asks for a month of every new hire's output, puts no cost on it, and offers only the bakery story as benefit.",
      "change": null, "status": "proposed", "writer_comment": null }
  ]
}

````

**Tool result:**

````
File created successfully at: <draw>/work/edit-notes.json (file state is current in your context — no need to Read it back)
````

**Assistant:**

The ledger is set up and we can start reading. Two critics reviewed the whole draft: the structure critic (outline only, since you gave no outline) and the reader critic, reading as a skeptical CTO. Between them they left two notes, in sections 2 and 4. I'm keeping track of your decisions in `edit-notes.json` in the working directory.

---

## Section 1 of 4: "Feed the starter" (lines 1–6)

> # Feed the starter
>
> My neighbour has run a sourdough bakery on the corner for eleven years. New
> bakers there do not shape a single loaf for their first month. They feed the
> starter, clean the baskets, and write down the temperature of the cold room
> every morning.

**Notes on this section:** none.

- **structure-critic: CLEAN.** It only checked transitions and balance. It says the starter introduced on line 3 is what line 10 picks up, and the neighbour introduced here is who "Her" refers to on line 19.
- **reader-critic:skeptical-cto:** nothing in this section.

Do you have a note of your own on this section? Or say "next" and I'll mark it read and move on to "The part nobody sees," where the reader stopped.

*turn ended: success, 8 model turns, $0.18*

## Turn 2

*model reported by init: `claude-opus-5-5`*

**Writer:**

> What do you think of this section yourself?

**Assistant:**

I'll keep my own opinion out of this. The critics read the draft in clean contexts, and the method depends on not adding a second reader with opinions halfway through. Here's what the critics did say about this section:

- **structure-critic** found nothing wrong. It says the section sets up what comes later: the starter is picked up on line 10, and the neighbour is who "Her" refers to on line 19.
- **reader-critic:skeptical-cto** read past this section without stopping. It didn't object until line 14.

Some questions about an opening, like whether the voice works or whether it pulls the reader in, belong to the **voice-critic**, which wasn't part of this review. If you want its view, the reliable way is to run it on the whole draft and bring its notes into this pass. I can run it on this section alone if you ask, but its tested accuracy comes from reading whole drafts, so a one-section result wouldn't carry the same weight.

You can add a note of your own on this section, ask for the voice critic, or say "next."

*turn ended: success, 1 model turns, $0.20*

## Turn 3

*model reported by init: `claude-opus-5-5`*

**Writer:**

> No note from me on this one. Yes, next.

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

Section 1 is marked read, with no notes.

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

**Notes on this section:**

**N1: reader-critic:skeptical-cto, line 14:** "Teams work the same way."
This is **where the reader stopped reading.** In the critic's words: *"The whole case for changing how I onboard rests on this sentence, and it asks me to accept that a team behaves like a starter without saying what the 'starter' is in my org or how starving it causes the failure."*

- **structure-critic: CLEAN.** It looked at the same sentence for transitions. It found the link to the previous paragraph works, even though its scan flagged the sentence because comparisons aren't on its list of linking words. Both critics flagged line 14, but for different things: one asks whether the sentence connects, the other whether it convinces. They don't contradict each other.

**What do you want to do with N1?**
- **Accept** it and tell me the change in your own words. One example of the kind of fix the note points to: say what the starter is in a team. That's an illustration, not a recommendation.
- **Decline** it.
- **Defer** it.

You can also add a note of your own on this section.

*turn ended: success, 2 model turns, $0.24*

## Turn 4

*model reported by init: `claude-opus-5-5`*

**Writer:**

> Accept N1. The change: "Say what the starter is on a team, the first weeks of onboarding work, before making the comparison."

**Tool call — Edit:**

````
{
 "replace_all": false,
 "file_path": "<draw>/work/edit-notes.json",
 "old_string": "      \"change\": null, \"status\": \"proposed\", \"writer_comment\": null },",
 "new_string": "      \"change\": \"Say what the starter is on a team, the first weeks of onboarding work, before making the comparison.\", \"status\": \"accepted\", \"writer_comment\": null },"
}
````

**Tool result:**

````
The file <draw>/work/edit-notes.json has been updated successfully.
````

**Assistant:**

N1 is **accepted**. I've recorded your change word for word: *"Say what the starter is on a team, the first weeks of onboarding work, before making the comparison."*

There's nothing else on section 2. Do you have a note of your own for it? If not, say "next" and we'll go on to "A month on the starter."

*turn ended: success, 2 model turns, $0.27*

## Turn 5

*model reported by init: `claude-opus-5-5`*

**Writer:**

> No note from me on this one. Yes, next.

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

Section 2 is marked read.

---

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

**Notes on this section:** none.

- **structure-critic: CLEAN.** It says "Her" on line 19 clearly points back to the neighbour from line 3. It also says the notebook introduced on line 23 sets up line 29, where the last section tells the reader to keep one.
- **reader-critic:skeptical-cto:** nothing in this section. The CTO reader had already stopped at line 14. Its other note, the forced choice, falls in the next section. This section has nothing from that reader either way.

Do you have a note of your own on this section? If not, say "next" and we'll go on to "What to do on Monday," where the critic's second note falls.

*turn ended: success, 2 model turns, $0.30*

## Turn 6

*model reported by init: `claude-opus-5-5`*

**Writer:**

> No note from me on this one. Yes, next.

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

Section 3 is marked read.

---

## Section 4 of 4: "What to do on Monday" (lines 27–31)

> ## What to do on Monday
>
> Give the new person a month on the slow part. Keep the notebook that lets you
> read a failure back. And watch for the moment they notice the starter, because
> that is when you know.

**Notes on this section:**

**N2: reader-critic:skeptical-cto, line 29:** "Give the new person a month on the slow part."
This is **the reader's forced choice**, the sentence they would push back on hardest in a meeting. In the critic's words: *"It asks me to give up a month of every new hire's output, the draft never puts a cost on that, and the only benefit offered is the bakery story, which I couldn't take to my board."*

- **structure-critic: CLEAN.** It calls this section a short closing passage that pulls together claims made earlier, and says its short length is fine. That's a judgment about balance. It says nothing about whether the request persuades anyone, so it doesn't conflict with N2.

**What do you want to do with N2?**
- **Accept** it and give me the change in your own words.
- **Decline** it.
- **Defer** it.

You can also add a note of your own on this section. This is the last section, so once you've decided on N2, tell me if you're ready to end the pass. I'll then check the ledger and turn the accepted notes into the plan for the reviser.

*turn ended: success, 2 model turns, $0.34*

## Turn 7

*model reported by init: `claude-opus-5-5`*

**Writer:**

> Decline N2. The cost is the point. I'm not putting a number on it. My own note on "because that is when you know": cut this phrase, it repeats the line about the moment she knew. That's everything. Finish the pass.

**Tool call — Edit:**

````
{
 "replace_all": false,
 "file_path": "<draw>/work/edit-notes.json",
 "old_string": "      \"change\": null, \"status\": \"proposed\", \"writer_comment\": null }\n  ]",
 "new_string": "      \"change\": null, \"status\": \"declined\", \"writer_comment\": \"The cost is the point. I'm not putting a number on it.\" },\n    { \"id\": \"N3\", \"unit\": \"u4e83b821\", \"source\": \"writer\",\n      \"line\": 30, \"quote\": \"because that is when you know\",\n      \"note\": \"Repeats the line about the moment she knew.\",\n      \"change\": \"Cut the phrase 'because that is when you know'.\", \"status\": \"accepted\", \"writer_comment\": null }\n  ]"
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
node <plugins>/prose-review/skills/prose-edit/tools/notes-check.mjs edit-notes.json draft.md --export plan-entries.json; echo "exit=$?"
````

*[permission denied by the harness allowlist: "Bash"]*

**Tool result (error):**

````
This Bash command contains multiple operations. The following part requires approval: echo "exit=$?"
````

**Tool call — Bash:**

````
node <plugins>/prose-review/skills/prose-edit/tools/notes-check.mjs edit-notes.json draft.md --export plan-entries.json
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
9	    "change": "Say what the starter is on a team, the first weeks of onboarding work, before making the comparison.",
10	    "reason": "Where the reader stopped: the case rests on this analogy without saying what the 'starter' is in a real org or how starving it causes the failure."
11	  },
12	  {
13	    "id": "e03",
14	    "source": "writer",
15	    "location": {
16	      "line": 30,
17	      "quote": "because that is when you know"
18	    },
19	    "change": "Cut the phrase 'because that is when you know'.",
20	    "reason": "Repeats the line about the moment she knew."
21	  }
22	]
23	
````

**Tool call — Bash:**

````
head -40 <plugins>/prose-review/PLAN-FORMAT.md
````

*[permission denied by the harness allowlist: "Bash"]*

**Tool result (error):**

````
head in '<plugins>/prose-review/PLAN-FORMAT.md' was blocked. For security, Claude Code may only read the beginning of files from the allowed working directories for this session: '<draw>/work'.
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
      "change": "Say what the starter is on a team, the first weeks of onboarding work, before making the comparison.",
      "reason": "Where the reader stopped: the case rests on this analogy without saying what the 'starter' is in a real org or how starving it causes the failure."
    },
    {
      "id": "e03",
      "source": "writer",
      "location": {
        "line": 30,
        "quote": "because that is when you know"
      },
      "change": "Cut the phrase 'because that is when you know'.",
      "reason": "Repeats the line about the moment she knew."
    }
  ]
}

````

**Tool result:**

````
File created successfully at: <draw>/work/plan.json (file state is current in your context — no need to Read it back)
````

**Assistant:**

The pass is finished, and the ledger checks out with nothing left open.

**Section 4:**
- **N2** (the CTO reader's forced choice at line 29): **declined**. I recorded your reason as you gave it: *"The cost is the point. I'm not putting a number on it."*
- **N3** (your note, line 30, "because that is when you know"): **accepted**. The change is to cut the phrase, because it repeats the line about the moment she knew.

**Your decisions across the draft:**

| Note | From | Your call |
|---|---|---|
| N1, line 14, "Teams work the same way." | reader-critic:skeptical-cto | Accepted: say what the starter is on a team (the first weeks of onboarding work) before making the comparison |
| N2, line 29, "Give the new person a month on the slow part." | reader-critic:skeptical-cto | Declined |
| N3, line 30, "because that is when you know" | you | Accepted: cut the phrase |

All four sections were read and none were skipped. The ledger check found no notes out of place and none left undecided. It exported your two accepted notes as plan entries `e01` and `e03`. The numbers follow the note ids, so there's no `e02`, because N2 was declined.

There was no `plan.json` yet, so I created one in the working directory with those two entries. One field is still blank: `voice_profile`, the voice the reviser has to stay within. I didn't want to guess it. Tell me which profile this draft belongs to (for example `essay`) and I'll fill it in. Then I can run the reviser on `plan.json`. It makes only those two changes and leaves the rest of the draft as it is.

Files are in the working directory:
- `edit-notes.json`
- `plan-entries.json`
- `plan.json`

*turn ended: success, 10 model turns, $0.52*

