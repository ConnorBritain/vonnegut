#!/usr/bin/env node
/**
 * persona-check — validate a persona file, or a reader-critic transcript's shape.
 *
 *   node tools/persona-check.mjs persona <file.md> [--json]
 *   node tools/persona-check.mjs transcript <file.md> [--json]
 *
 * No text measurement. It exists so the harness's contract counts for
 * prose-reader-critic — findings without a quote, a missing forced choice,
 * a wrapped verdict — are derived by a script rather than typed.
 *
 * A persona file carries frontmatter with exactly name, reads_for, never and
 * forced_choice, and a prose body. `never` must include the two refusals every
 * reader shares: judging prose quality, and guessing who wrote it. A transcript
 * ends in a bare CLEAN or REVISE, has a FORCED CHOICE with a quotation, and
 * every WHERE I STOPPED carries a line number and a quotation.
 */
import { existsSync, readFileSync, realpathSync } from "node:fs";
import { basename, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const PERSONA_KEYS = ["name", "reads_for", "never", "forced_choice"];
export const MANDATORY_NEVER = [/judg\w* prose quality/i, /guess\w* who wrote/i];

function parseList(raw) {
  const m = raw.trim().match(/^\[([\s\S]*)\]$/);
  if (!m) return null;
  return m[1].split(",").map((s) => s.trim()).filter(Boolean);
}

/** Parse a persona file into { fields, body } or throw with the reason. */
export function parsePersona(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new TypeError("no frontmatter block");
  const fields = {};
  for (const line of m[1].split("\n")) {
    if (!line.trim()) continue;
    const f = line.match(/^([\w-]+)\s*:\s*(.*)$/);
    if (!f) throw new TypeError(`unreadable frontmatter line: ${JSON.stringify(line)}`);
    fields[f[1]] = f[2];
  }
  return { fields, body: m[2] };
}

export function validatePersona(text) {
  const errors = [];
  let parsed;
  try { parsed = parsePersona(text); } catch (e) { return [e.message]; }
  const { fields, body } = parsed;
  const keys = Object.keys(fields);
  for (const k of PERSONA_KEYS) if (!keys.includes(k)) errors.push(`missing ${k}`);
  for (const k of keys) if (!PERSONA_KEYS.includes(k)) errors.push(`unknown key ${k}`);
  if (fields.name !== undefined && !/^[a-z0-9][a-z0-9-]*$/.test(fields.name)) errors.push("name must be a lower-case token");
  for (const k of ["reads_for", "never"]) {
    if (fields[k] === undefined) continue;
    const list = parseList(fields[k]);
    if (!list) errors.push(`${k} must be a [bracketed, comma-separated] list`);
    else if (!list.length) errors.push(`${k} must not be empty`);
    else if (k === "never") for (const re of MANDATORY_NEVER) if (!list.some((x) => re.test(x))) errors.push(`never must include ${re.source.replace(/\\w\*/g, "")}`);
  }
  if (fields.forced_choice !== undefined && !/\S/.test(fields.forced_choice)) errors.push("forced_choice must say what the one choice is");
  if (!/\S/.test(body)) errors.push("the body must describe the reader in prose");
  if (/\b(CLEAN|REVISE)\b/.test(text)) errors.push("a persona must not name a verdict");
  return errors;
}

export function readPersona(text) {
  const errors = validatePersona(text);
  if (errors.length) throw new TypeError(errors.join("; "));
  const { fields, body } = parsePersona(text);
  return { name: fields.name, reads_for: parseList(fields.reads_for), never: parseList(fields.never), forced_choice: fields.forced_choice.trim(), body: body.trim() };
}

/** The shape of a reader-critic transcript: counts a harness would otherwise type by hand. */
export function checkTranscript(text) {
  const lines = text.replace(/\s+$/, "").split("\n");
  const last = lines[lines.length - 1]?.trim() ?? "";
  const verdict = ["CLEAN", "REVISE"].includes(last) ? last : null;
  const stops = [];
  for (let i = 0; i < lines.length; i++) {
    if (!/\*\*WHERE I STOPPED\*\*/.test(lines[i])) continue;
    const block = lines.slice(i, i + 3).join(" ");
    stops.push({ line: i + 1, cited: /\bline\s+\d+/i.test(block) && /["“][^"”]{3,}["”]/.test(block) });
  }
  const forced = lines.findIndex((l) => /\*\*FORCED CHOICE\*\*/.test(l));
  const forcedQuoted = forced >= 0 && /["“][^"”]{3,}["”]/.test(lines.slice(forced, forced + 3).join(" "));
  const authorship = /\b(machine|model|AI|LLM)[- ](written|generated|authored)\b|\bwritten by (a|an) (model|AI|machine)\b/i.test(text);
  return {
    verdict,
    findings: stops.length,
    uncited: stops.filter((s) => !s.cited).length,
    missing_forced_choice: forcedQuoted ? 0 : 1,
    authorship_claims: authorship ? 1 : 0,
    forced_choice_alone_as_revise: verdict === "REVISE" && stops.length === 0 ? 1 : 0,
    problems: [
      ...(verdict ? [] : ["last line is not a bare CLEAN or REVISE"]),
      ...(forcedQuoted ? [] : ["no FORCED CHOICE with a quotation"]),
      ...stops.filter((s) => !s.cited).map((s) => `stop at line ${s.line} lacks a line number or a quotation`),
      ...(verdict === "REVISE" && stops.length === 0 ? ["REVISE with no stop: a forced choice alone is never a REVISE"] : []),
      ...(authorship ? ["states or implies machine authorship"] : []),
    ],
  };
}

const USAGE = "Usage: node persona-check.mjs persona <file.md> [--json]\n       node persona-check.mjs transcript <file.md> [--json]";

if (process.argv[1] && existsSync(process.argv[1]) && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [mode, file, ...rest] = process.argv.slice(2);
  const json = rest.includes("--json");
  if (!["persona", "transcript"].includes(mode) || !file || rest.some((a) => a !== "--json")) { process.stderr.write(`${USAGE}\n`); process.exit(2); }
  const path = resolve(file);
  if (!existsSync(path)) { process.stderr.write(`persona-check: not found: ${path}\n`); process.exit(1); }
  const text = readFileSync(path, "utf8");
  if (mode === "persona") {
    const errors = validatePersona(text);
    if (json) process.stdout.write(`${JSON.stringify({ file: basename(path), ok: errors.length === 0, errors }, null, 2)}\n`);
    else process.stdout.write(errors.length ? `${basename(path)}: ${errors.join("; ")}\n` : `${basename(path)}: ok — ${readPersona(text).reads_for.length} reads_for, forced choice present\n`);
    process.exit(errors.length ? 1 : 0);
  }
  const r = checkTranscript(text);
  if (json) process.stdout.write(`${JSON.stringify({ file: basename(path), ...r }, null, 2)}\n`);
  else process.stdout.write(`${basename(path)}: ${r.verdict ?? "no verdict"} · findings=${r.findings} uncited=${r.uncited} missing_forced_choice=${r.missing_forced_choice} authorship_claims=${r.authorship_claims}${r.problems.length ? `\n  ${r.problems.join("\n  ")}` : ""}\n`);
  process.exit(r.problems.length ? 1 : 0);
}
