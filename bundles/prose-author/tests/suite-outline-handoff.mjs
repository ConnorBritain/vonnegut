/**
 * Outline handoff (roadmap item K) — an approved outline and its brief become a
 * drafting job mechanically: every fact and rule traceable to a node or a
 * decision, open questions and unsettled decisions refused by name, the length
 * band a hard rule. The port of prose-outline's read side is pinned to
 * prose-outline's own validators by a parity test that imports them at TEST
 * time and SKIPs when the sibling is absent.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";
import { HANDOFF, HANDOFF_CASES, OUTLINE_JOB, jobFor, load, render } from "./outline-handoff-fixtures.mjs";

export async function run(t, { HERE } = {}) {
  const TOOLS = resolve(HERE, "..", "skills", "prose-draft", "tools");
  const port = await import(pathToFileURL(join(TOOLS, "lib", "outline-handoff.mjs")).href);
  const { outlineJob, HandoffRefusal } = await import(pathToFileURL(OUTLINE_JOB).href);
  const { ruleErrors } = await import(pathToFileURL(join(TOOLS, "style-rules.mjs")).href);
  const refusal = (fn) => { try { fn(); return null; } catch (e) { return e instanceof HandoffRefusal ? e.reasons : [`crashed: ${e.message}`]; } };
  const attemptAsync = async (fn) => { try { return (await fn()) ?? {}; } catch (e) { return { crashed: e.message }; } };

  t.group("outline-job — expected jobs reproduce, and nothing in a job lacks a source");
  for (const c of HANDOFF_CASES) {
    const job = await attemptAsync(() => jobFor(c));
    t.check(`${c.name}: reproduces its expected job byte for byte`, !job.crashed && readFileSync(join(HANDOFF, "expected", `${c.name}.json`), "utf8") === render(job), "rerun tests/outline-handoff-fixtures.mjs --update and review the diff");
    t.check(`${c.name}: every fact and every rule has a from pointer, one for one`, job.handoff?.facts_from?.length === job.facts?.length && job.handoff?.rules_from?.length === job.rules?.length && [...(job.handoff?.facts_from ?? []), ...(job.handoff?.rules_from ?? [])].every((f) => typeof f === "string" && f.length));
    t.check(`${c.name}: every rule is one the runtime accepts`, (job.rules ?? []).every((r) => ruleErrors(r).length === 0));
  }
  const approved = await attemptAsync(() => jobFor(HANDOFF_CASES[0]));
  const outline = load("outline.json");
  const ids = new Set(outline.nodes.map((n) => n.id));
  t.check("every fact points at a node of the outline (or a filled slot of one) — nothing invented",
    (approved.handoff?.facts_from ?? []).every((f) => ids.has(f.split(".")[0])) && approved.facts?.length === 10);
  t.check("the length band becomes a word-limit rule with the outline's bounds", approved.rules?.some((r) => r.kind === "word-limit" && r.minimum === 800 && r.maximum === 1100));
  t.check("must-include items become semantic rules — reviewable, never presented as enforced", approved.rules?.filter((r) => r.kind === "semantic" && /^Include: /.test(r.directive)).length === 2);
  t.check("context comes from the brief's confirmed decisions; the job records the outline it was made from",
    approved.context?.form === "newsletter" && /protect the unglamorous/.test(approved.context?.purpose ?? "") && /^[a-f0-9]{64}$/.test(approved.outline?.digest ?? "") && approved.outline?.shape === "problem-solution");
  t.check("sections carry their part and word budget, in reading order", /^Section 1 \(≈200 words, problem\)/.test(approved.facts?.[0] ?? "") && /^Section 5 \(≈110 words, close\)/.test(approved.facts?.[8] ?? ""));
  const unconfirmedBrief = load("brief.json"); unconfirmedBrief.decisions.must_include = { ...unconfirmedBrief.decisions.must_include, confirmed: false };
  const fromUnconfirmed = (() => { try { return outlineJob(outline, unconfirmedBrief, { harness: "claude" }); } catch (e) { return { crashed: e.message }; } })();
  t.check("an optional answer the writer has not confirmed never reaches the job", !fromUnconfirmed.crashed && !(fromUnconfirmed.rules ?? []).some((r) => /^Include: /.test(r.directive)));
  const noLength = await attemptAsync(() => jobFor(HANDOFF_CASES[2]));
  t.check("no length band ⇒ no word-limit rule, and the job says so", !noLength.rules?.some((r) => r.kind === "word-limit") && (noLength.handoff?.notes ?? []).some((n) => /no length band/.test(n)));

  t.group("outline-job — refusals name every reason at once");
  const open = refusal(() => outlineJob(load("outline-open.json"), load("brief.json"), { harness: "claude" }));
  t.check("an open question stops the job, by id and text", (open ?? []).length === 1 && /open question n6: Does the objection/.test(open[0]));
  const allowOpen = await attemptAsync(() => jobFor(HANDOFF_CASES[1]));
  t.check("--allow-open carries it forward as an explicit 'leave unresolved' rule, pointing at the question", allowOpen.rules?.some((r) => r.id === "unresolved-n6" && /do not assert an answer/.test(r.directive)) && allowOpen.handoff?.rules_from?.includes("n6"));
  const stale = refusal(() => outlineJob(load("outline.json"), load("brief-stale.json"), { harness: "codex" }));
  t.check("a brief whose audience changed after the rest was settled is refused, naming each stale decision",
    ["purpose", "form", "length", "shape", "thesis"].every((d) => (stale ?? []).some((r) => r.includes(`decision ${d} is stale`))));
  const nullThesis = { ...outline, thesis: null, nodes: [...outline.nodes, { id: "n9", kind: "open-question", parent: null, order: 9, text: "What is the claim?" }] };
  t.check("a withheld thesis stops the job", (refusal(() => outlineJob(nullThesis, load("brief.json"), { harness: "claude" })) ?? []).some((r) => /thesis is withheld/.test(r)));
  t.check("without a brief, form and purpose must be given; without a harness, the job is refused",
    (refusal(() => outlineJob(outline, null, { harness: "codex" })) ?? []).filter((r) => /no form|no purpose/.test(r)).length === 2 && (refusal(() => outlineJob(outline, load("brief.json"), {})) ?? []).some((r) => /harness/.test(r)));
  t.check("an invalid outline is refused before anything else", (refusal(() => outlineJob({ ...outline, nodes: [{ id: "x" }] }, null, { harness: "codex" })) ?? []).some((r) => /^outline: /.test(r)));
  const cli = (...a) => spawnSync(process.execPath, [OUTLINE_JOB, ...a], { encoding: "utf8" });
  t.check("CLI: exit 0 with a job, 1 refused (JSON reasons), 2 on usage",
    cli("--outline", join(HANDOFF, "outline.json"), "--brief", join(HANDOFF, "brief.json"), "--harness", "claude").status === 0
      && cli("--outline", join(HANDOFF, "outline-open.json"), "--brief", join(HANDOFF, "brief.json"), "--harness", "claude").status === 1
      && cli("--brief", join(HANDOFF, "brief.json")).status === 2);

  t.group("the receipt names the outline a piece was drafted from; the skill points at the handoff");
  {
    const { renderWritingReceipt } = await import(pathToFileURL(join(TOOLS, "writing-receipt.mjs")).href);
    const job = await attemptAsync(() => jobFor(HANDOFF_CASES[0]));
    const receipt = (() => { try { return renderWritingReceipt({ status: "checked", attempts: [] }, job); } catch (e) { return `crashed: ${e.message}`; } })();
    t.check("the receipt prints the outline project, revision, shape and digest", receipt.includes(`Drafted from outline: project not-evaluated, revision not-evaluated, shape problem-solution; outline digest ${job.outline?.digest}`));
    t.check("a job without an outline gets no outline line", !renderWritingReceipt({ status: "checked", attempts: [] }, { context: {} }).includes("Drafted from outline"));
    const skill = readFileSync(resolve(HERE, "..", "skills", "prose-draft", "SKILL.md"), "utf8");
    const ref = readFileSync(resolve(HERE, "..", "skills", "prose-draft", "references", "outline-handoff.md"), "utf8");
    t.check("SKILL.md sends an approved outline through outline-job, never a hand summary", /outline-job\.mjs/.test(skill) && /never by summarising the outline/.test(skill));
    t.check("the reference says: refused jobs are not edited by hand, --allow-open is the writer's choice, and the structure critic follows in intended-outline mode",
      /Do not edit the job by hand/.test(ref) && /writer's choice, not yours/.test(ref) && /intended-outline mode/.test(ref));
  }

  t.group("outline-handoff port — pinned to prose-outline's validators (test-time import only)");
  const OUTLINE_SKILL = resolve(HERE, "..", "..", "prose-outline", "skills");
  const schemaPath = join(OUTLINE_SKILL, "prose-outline", "tools", "lib", "outline-schema.mjs");
  const checkPath = join(OUTLINE_SKILL, "prose-interview", "tools", "brief-check.mjs");
  if (!existsSync(schemaPath) || !existsSync(checkPath)) {
    process.stdout.write("  SKIP prose-outline is absent — the port's parity with its validators is not evaluated\n");
    return;
  }
  const theirs = await import(pathToFileURL(schemaPath).href);
  const { checkBrief } = await import(pathToFileURL(checkPath).href);
  const FIX = resolve(HERE, "..", "..", "prose-outline", "tests", "fixtures");
  const docs = [
    ...readdirSync(join(FIX, "outline", "outlines")).map((f) => JSON.parse(readFileSync(join(FIX, "outline", "outlines", f), "utf8"))),
    ...readdirSync(join(FIX, "candidates")).filter((f) => f.endsWith(".json") && !f.startsWith("expected")).map((f) => JSON.parse(readFileSync(join(FIX, "candidates", f), "utf8"))),
  ];
  const variants = docs.flatMap((d) => [d,
    { ...d, title: "" }, { ...d, mode: "essay" }, { ...d, thesis: null }, { ...d, length: { unit: "words", min: 9, max: 1 } }, { ...d, shape: "Bad Shape" },
    { ...d, nodes: [...d.nodes, { ...d.nodes[0] }] }, { ...d, nodes: d.nodes.map((n, i) => (i === 0 ? { ...n, words: 0 } : n)) },
    { ...d, nodes: d.nodes.map((n, i) => (i === 0 ? { ...n, parent: "n99" } : n)) }, { ...d, brief_ref: { project: "x" } }]);
  const verdict = (fn, doc) => { try { return fn(doc).length === 0; } catch { return "crash"; } };
  const disagree = variants.filter((v) => verdict(port.outlineErrors, v) !== verdict(v.schema ? theirs.validateOutline : theirs.validateOutlineBody, v));
  t.check(`the port and prose-outline agree on validity across ${variants.length} outlines and planted defects`, disagree.length === 0, `${disagree.length} disagree`);
  const briefs = readdirSync(join(FIX, "briefs-interview")).filter((f) => f.endsWith(".json")).map((f) => [f, JSON.parse(readFileSync(join(FIX, "briefs-interview", f), "utf8"))]);
  const mismatch = briefs.filter(([, b]) => {
    const r = checkBrief(b);
    const settledThere = r.valid && [...r.open_required, ...r.unconfirmed, ...r.stale, ...r.skipped.filter((id) => port.REQUIRED.includes(id))].filter((id) => port.REQUIRED.includes(id)).length === 0;
    return (port.briefState(b).unsettled.length === 0) !== settledThere;
  }).map(([f]) => f);
  t.check(`the port's settled/unsettled call matches brief-check's on all ${briefs.length} interview briefs`, mismatch.length === 0, mismatch.join(", "));
  const { DECISIONS } = await import(pathToFileURL(join(OUTLINE_SKILL, "prose-interview", "tools", "lib", "decisions.mjs")).href);
  t.check("the port's dependency table and required set are the interview's tree", DECISIONS.every((d) => JSON.stringify(port.DECISION_DEPENDS[d.id]) === JSON.stringify(d.depends) && port.REQUIRED.includes(d.id) === d.required) && Object.keys(port.DECISION_DEPENDS).length === DECISIONS.length);
}
