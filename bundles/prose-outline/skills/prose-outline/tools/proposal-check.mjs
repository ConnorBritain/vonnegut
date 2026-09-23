#!/usr/bin/env node
/**
 * proposal-check — is this outline proposal a valid voice-outline/1 body, and
 * does it keep the skill's promises about briefs?
 *
 *   node proposal-check.mjs <proposal.json> [--brief <brief.md>] [--json]
 *
 * The skill's two tests are mechanical where they can be:
 *   positive   a concrete brief → every claim carries at least one evidence slot
 *   negative   an underspecified brief → open questions, and no invented thesis
 * A brief declares which it is in frontmatter (`expect: concrete | underspecified`);
 * with no brief, only the schema is checked. What the checker cannot decide —
 * whether the claims are the right claims — is the reader's, and it says so.
 */
import { existsSync, readFileSync, realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { validateOutlineBody } from "./lib/outline-schema.mjs";

export function checkProposal(body, brief = null) {
  const report = { schema: "proposal-check/1", errors: validateOutlineBody(body), expectation: null, findings: [], limits: ["Whether these are the right claims, in the right order, is not checked here."] };
  if (report.errors.length) return { ...report, status: "invalid" };
  const claims = body.nodes.filter((n) => n.kind === "claim");
  const questions = body.nodes.filter((n) => n.kind === "open-question");
  report.counts = { nodes: body.nodes.length, claims: claims.length, open_questions: questions.length, empty_slots: claims.reduce((n, c) => n + c.evidence.filter((e) => e.filled_by === null).length, 0) };
  if (brief) {
    const expect = /^expect:\s*(concrete|underspecified)\s*$/m.exec(brief.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? "")?.[1] ?? null;
    report.expectation = expect;
    if (expect === "concrete") {
      if (body.thesis === null) report.findings.push("a concrete brief should yield a thesis, not a withheld one");
      const bare = claims.filter((c) => !c.evidence.length);
      if (bare.length) report.findings.push(`${bare.length} claim(s) carry no evidence slot: ${bare.map((c) => c.id).join(", ")}`);
    } else if (expect === "underspecified") {
      if (body.thesis !== null) report.findings.push("an underspecified brief must not yield an invented thesis (thesis should be null)");
      if (!questions.length) report.findings.push("an underspecified brief must yield at least one open question");
    } else report.findings.push("brief has no `expect: concrete | underspecified` frontmatter; expectation not checked");
  }
  return { ...report, status: report.findings.length ? "findings" : "clean" };
}

if (process.argv[1] && existsSync(process.argv[1]) && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const files = args.filter((a) => !a.startsWith("--"));
  const briefIndex = args.indexOf("--brief");
  const proposalFile = files.find((f) => briefIndex < 0 || f !== args[briefIndex + 1]);
  const unknown = args.filter((a) => a.startsWith("--") && !["--json", "--brief"].includes(a));
  if (!proposalFile || unknown.length || (briefIndex >= 0 && !args[briefIndex + 1])) { console.error("Usage: node proposal-check.mjs <proposal.json> [--brief <brief.md>] [--json]"); process.exit(2); }
  const brief = briefIndex >= 0 ? readFileSync(args[briefIndex + 1], "utf8") : null;
  const report = checkProposal(JSON.parse(readFileSync(proposalFile, "utf8")), brief);
  if (args.includes("--json")) process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  else {
    console.log(`proposal-check — ${report.status}${report.expectation ? ` (brief: ${report.expectation})` : ""}`);
    for (const e of report.errors) console.log(`  invalid: ${e}`);
    for (const f of report.findings) console.log(`  finding: ${f}`);
    if (report.counts) console.log(`  ${report.counts.claims} claims, ${report.counts.open_questions} open questions, ${report.counts.empty_slots} empty evidence slots`);
    for (const l of report.limits) console.log(`  limit: ${l}`);
  }
  // Anything but clean exits 1: a finding is a broken promise, not a note.
  process.exit(report.status === "clean" ? 0 : 1);
}
