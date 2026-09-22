#!/usr/bin/env node
/**
 * repurpose-check — a delivered piece against its medium profile's mechanical
 * constraints, and against the source piece it was made from.
 *
 *   node repurpose-check.mjs --profile P.json --draft D.md [--source S.md] [--json]
 *
 * Length and segment counts are counted here, on the final bytes, so the
 * medium critic never re-counts them. Semantic constraints are listed as
 * `not-evaluated` with the note that says what the critic reviews — never as
 * passed. The fidelity scan against the source is prose-review's
 * `fidelity-scan`, located at run time the way the drafting runtime locates
 * it (never imported statically across the bundle boundary); a repurposed
 * piece may legitimately drop atoms, so the scan's missing atoms are LISTED
 * for the critic and the writer and never fail the check. Without
 * prose-review the fidelity block is `not-evaluated`.
 */
import { existsSync, readFileSync, realpathSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { loadProfile } from "./lib/medium-profile.mjs";

export const CHECK_SCHEMA = "repurpose-check/1";
const HERE = dirname(fileURLToPath(import.meta.url));

const stripFrontmatter = (t) => (t.startsWith("---\n") ? t.replace(/^---\n[\s\S]*?\n---\n?/, "") : t);
const words = (t) => t.match(/\b[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*\b/gu) || [];
const URL_RE = /\bhttps?:\/\/\S+|\bwww\.\S+/i;

export function segmentsOf(text, profile) {
  if (!profile.segments) return [text.trim()];
  return text.split(profile.segments.separator).map((s) => s.trim()).filter(Boolean);
}

/** One mechanical rule on the final bytes: passed | failed, with the number that decided it. */
export function evaluateRule(rule, text, profile) {
  const body = text.trim();
  const segs = segmentsOf(body, profile);
  const count = (n, limit, what, over) => ({ status: over ? "failed" : "passed", detail: `${what}: ${n} (limit ${limit})` });
  switch (rule.type) {
    case "max_words": { const n = words(body).length; return count(n, rule.max, "words", n > rule.max); }
    case "min_words": { const n = words(body).length; return count(n, rule.min, "words", n < rule.min); }
    case "max_characters": { const n = [...body].length; return count(n, rule.max, "characters", n > rule.max); }
    case "max_segments": return count(segs.length, rule.max, "segments", segs.length > rule.max);
    case "max_segment_characters": {
      const over = segs.map((s, i) => ({ i: i + 1, n: [...s].length })).filter((s) => s.n > rule.max);
      return { status: over.length ? "failed" : "passed", detail: over.length ? `segments over ${rule.max} characters: ${over.map((s) => `#${s.i} (${s.n})`).join(", ")}` : `longest segment ${Math.max(...segs.map((s) => [...s].length))} of ${rule.max}` };
    }
    case "no_urls_in_segment": { const s = segs[rule.segment - 1] ?? ""; const hit = URL_RE.test(s); return { status: hit ? "failed" : "passed", detail: hit ? `segment ${rule.segment} contains a URL` : `segment ${rule.segment} has no URL` }; }
    case "no_headings": { const m = body.match(/^#{1,6}\s.*$/m); return { status: m ? "failed" : "passed", detail: m ? `heading found: ${JSON.stringify(m[0].slice(0, 40))}` : "no headings" }; }
    case "max_hashtags": { const n = (body.match(/(?:^|\s)#[\p{L}\p{N}_]+/gu) ?? []).length; return count(n, rule.max, "hashtags", n > rule.max); }
    case "single_paragraph": { const paras = body.split(/\n[ \t]*\n/).filter((p) => p.trim()).length; return { status: paras === 1 ? "passed" : "failed", detail: `${paras} paragraph(s)` }; }
    case "ends_with_question": return { status: /\?["”’)]*\s*$/.test(body) ? "passed" : "failed", detail: `ends with ${JSON.stringify(body.slice(-1))}` };
    default: return { status: "not-evaluated", detail: `unknown rule ${rule.type}` };
  }
}

/** prose-review's fidelity-scan, found the way the drafting runtime finds it; null when absent. */
export function findFidelityScan(env = process.env) {
  const candidates = [
    env.PROSE_REVIEW_ROOT && join(env.PROSE_REVIEW_ROOT, "tools", "fidelity-scan.mjs"),
    join(HERE, "..", "..", "..", "tools", "fidelity-scan.mjs"),                        // loose-file install beside the skills
    join(HERE, "..", "..", "..", "..", "prose-review", "tools", "fidelity-scan.mjs"),  // this repository's layout
  ];
  return candidates.find((p) => p && existsSync(p)) ?? null;
}

export async function repurposeCheck({ profileText, draft, source = null, env = process.env }) {
  const { profile, digest } = loadProfile(profileText);
  const body = stripFrontmatter(draft);
  const mechanical = profile.constraints.map((c) => c.kind === "mechanical"
    ? { id: c.id, kind: "mechanical", ...evaluateRule(c.rule, body, profile) }
    : { id: c.id, kind: "semantic", status: "not-evaluated", detail: `reviewed by the medium critic: ${c.note}` });
  const segs = segmentsOf(body, profile);
  const counts = { words: words(body).length, characters: [...body.trim()].length, segments: segs.length, longest_segment: Math.max(0, ...segs.map((s) => [...s].length)) };
  let fidelity;
  if (source === null) fidelity = { status: "not-evaluated", reason: "no source piece supplied" };
  else {
    const scanner = findFidelityScan(env);
    if (!scanner) fidelity = { status: "not-evaluated", reason: "prose-review's fidelity-scan is not installed" };
    else {
      const { scanFidelity } = await import(pathToFileURL(scanner).href);
      const scan = scanFidelity(stripFrontmatter(source), body);
      fidelity = { status: "listed", scanner: scanner, missing_atoms: scan.missing.map((m) => ({ kind: m.kind, source: m.source })), note: "A repurposed piece may legitimately drop atoms; these are listed for the critic and the writer, not failed." };
    }
  }
  const failed = mechanical.filter((m) => m.status === "failed");
  return {
    schema: CHECK_SCHEMA,
    form: profile.form, medium: profile.medium, profile_digest: digest, checked: profile.checked,
    counts, mechanical, fidelity,
    summary: { passed: mechanical.filter((m) => m.status === "passed").length, failed: failed.length, not_evaluated: mechanical.filter((m) => m.status === "not-evaluated").length },
    limits: [
      "Mechanical constraints are counted on the final bytes; a semantic constraint is listed as not-evaluated and is the critic's, never reported as passed.",
      "Word and character counts are this tool's; platforms count differently at the margin, and the profile's `checked` date says when its limits were last confirmed.",
      "Missing atoms against the source are listed, not judged: compression drops things on purpose, and which drops matter is the writer's call.",
    ],
  };
}

export function renderCheck(r) {
  const out = [`repurpose-check — ${r.form} (${r.medium}) · ${r.summary.passed} passed, ${r.summary.failed} failed, ${r.summary.not_evaluated} for the critic · ${r.counts.words} words, ${r.counts.characters} characters, ${r.counts.segments} segment(s)`];
  for (const m of r.mechanical) out.push(`  ${m.status.padEnd(13)} ${m.id} — ${m.detail}`);
  if (r.fidelity.status === "listed") { out.push(`  fidelity vs source: ${r.fidelity.missing_atoms.length} atom(s) not carried over (listed, not failed)`); for (const a of r.fidelity.missing_atoms.slice(0, 20)) out.push(`    ${a.kind.padEnd(8)} ${a.source}`); }
  else out.push(`  fidelity vs source: not evaluated — ${r.fidelity.reason}`);
  return out.join("\n");
}

const USAGE = "Usage: node repurpose-check.mjs --profile P.json --draft D.md [--source S.md] [--json]";

if (process.argv[1] && existsSync(process.argv[1]) && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2); const flags = new Map();
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--json") flags.set("--json", true);
    else if (["--profile", "--draft", "--source"].includes(args[i]) && args[i + 1] !== undefined && !args[i + 1].startsWith("--")) flags.set(args[i], resolve(args[++i]));
    else { process.stderr.write(`${USAGE}\n`); process.exit(2); }
  }
  if (!flags.has("--profile") || !flags.has("--draft")) { process.stderr.write(`${USAGE}\n`); process.exit(2); }
  repurposeCheck({ profileText: readFileSync(flags.get("--profile"), "utf8"), draft: readFileSync(flags.get("--draft"), "utf8"), source: flags.has("--source") ? readFileSync(flags.get("--source"), "utf8") : null })
    .then((r) => { process.stdout.write(flags.get("--json") ? `${JSON.stringify(r, null, 2)}\n` : `${renderCheck(r)}\n`); process.exit(r.summary.failed ? 1 : 0); })
    .catch((e) => { process.stderr.write(`repurpose-check: ${e.message}\n`); process.exit(e.message.startsWith("profile") ? 3 : 1); });
}
