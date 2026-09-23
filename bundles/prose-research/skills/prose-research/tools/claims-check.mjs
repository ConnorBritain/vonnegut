#!/usr/bin/env node
/**
 * claims-check — three deterministic checks over a ledger, a dossier and,
 * optionally, a draft with the model's sentence map.
 *
 *   node claims-check.mjs --ledger L.json --dossier D.json --sources-dir DIR [--draft F --map M.json] [--offline] [--json]
 *
 *   quotes    every ledger quote, verbatim after whitespace normalisation and
 *             nothing else, at its recorded line in the cached source text:
 *             exact | drifted (the source says something else there) | absent
 *             (the line or the source is gone). No fuzzy matching: a changed
 *             word, a changed comma or a changed case IS the drift this check
 *             exists to expose.
 *   links     one status per URL source: ok | dead | not-evaluated. --offline,
 *             or a network failure, is not-evaluated — never ok.
 *   coverage  draft sentences the map marks as claims with no ledger entry,
 *             plus map entries that are not in the draft (a model inventing
 *             sentences) and ledger ids the map cites that do not exist.
 *
 * Every row is a lead. Nothing here says a claim is true.
 */
import { existsSync, readFileSync, realpathSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { DOSSIER_SCHEMA, LEDGER_SCHEMA, normalise, validateDossier, validateLedger, validateSentenceMap } from "./lib/research-schema.mjs";

export const CHECK_SCHEMA = "claims-check/1";

export function sourceText(dossier, sourceId, sourcesDir) {
  const s = dossier.sources.find((x) => x.id === sourceId);
  if (!s) return null;
  const path = join(sourcesDir, s.text_file);
  return existsSync(path) ? readFileSync(path, "utf8") : null;
}

/** Where a normalised quote sits in a text: the 1-based line of its first character, or null. */
function locate(text, quote) {
  const n = normalise(quote);
  if (!n) return null;
  // Build a whitespace-tolerant literal: each gap in the quote matches any run of whitespace in the source.
  const pattern = new RegExp(n.split(" ").map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("\\s+"));
  const m = pattern.exec(text);
  if (!m) return null;
  return { line: text.slice(0, m.index).split("\n").length, offset: m.index, found: normalise(m[0]) };
}

export function checkQuotes(ledger, dossier, sourcesDir) {
  return ledger.claims.map((k) => {
    const text = sourceText(dossier, k.source, sourcesDir);
    if (text === null) return { claim: k.id, source: k.source, status: "absent", expected: normalise(k.quote), found: null, why: "the source text is not in the dossier's cache" };
    const hit = locate(text, k.quote);
    if (hit) return { claim: k.id, source: k.source, status: "exact", expected: normalise(k.quote), found: { line: hit.line, offset: hit.offset }, ...(hit.line !== k.location.line ? { why: `found at line ${hit.line}, recorded at line ${k.location.line}` } : {}) };
    const lines = text.split("\n");
    const at = lines[k.location.line - 1];
    if (at === undefined) return { claim: k.id, source: k.source, status: "absent", expected: normalise(k.quote), found: null, why: `the source has ${lines.length} lines; line ${k.location.line} does not exist` };
    // What stands at the recorded location: the same number of words, from the recorded offset on that line.
    const wordsWanted = normalise(k.quote).split(" ").length;
    const from = text.split("\n").slice(0, k.location.line - 1).join("\n").length + (k.location.line > 1 ? 1 : 0) + Math.min(k.location.offset, at.length);
    const tail = normalise(text.slice(from)).split(" ").slice(0, wordsWanted).join(" ");
    return { claim: k.id, source: k.source, status: tail ? "drifted" : "absent", expected: normalise(k.quote), found: tail ? { line: k.location.line, offset: k.location.offset, text: tail } : null, why: tail ? "the source says something else at the recorded location" : "nothing at the recorded location" };
  });
}

export async function checkLinks(dossier, { offline = false, timeout = 8000 } = {}) {
  const out = [];
  for (const s of dossier.sources) {
    if (s.kind !== "url") { out.push({ source: s.id, status: "not-evaluated", code: null, why: `${s.kind} source` }); continue; }
    if (s.locator.toLowerCase().startsWith("file://")) {
      let ok = false; try { ok = existsSync(fileURLToPath(s.locator)); } catch { ok = false; }
      out.push({ source: s.id, status: ok ? "ok" : "dead", code: null, why: ok ? "file exists" : "file is gone" }); continue;
    }
    if (offline) { out.push({ source: s.id, status: "not-evaluated", code: null, why: "--offline" }); continue; }
    const controller = new AbortController(); const timer = setTimeout(() => controller.abort(), timeout);
    try {
      let res = await fetch(s.locator, { method: "HEAD", redirect: "follow", signal: controller.signal });
      if (res.status === 405 || res.status === 403) res = await fetch(s.locator, { method: "GET", redirect: "follow", signal: controller.signal });
      out.push({ source: s.id, status: res.ok ? "ok" : "dead", code: res.status, why: res.ok ? "answered" : `answered ${res.status}` });
    } catch (e) {
      out.push({ source: s.id, status: "not-evaluated", code: null, why: `network: ${e.name === "AbortError" ? "timed out" : e.message}` });
    } finally { clearTimeout(timer); }
  }
  return out;
}

export function checkCoverage(map, ledger, draft) {
  const known = new Set(ledger.claims.map((k) => k.id));
  const draftNorm = normalise(draft);
  const rows = [];
  for (const s of map.sentences) {
    if (!draftNorm.includes(normalise(s.text))) { rows.push({ sentence_id: s.id, text: s.text, status: "not-in-draft", ledger: s.ledger }); continue; }
    if (s.ledger && !known.has(s.ledger)) { rows.push({ sentence_id: s.id, text: s.text, status: "unknown-ledger", ledger: s.ledger }); continue; }
    if (s.claim && !s.ledger) rows.push({ sentence_id: s.id, text: s.text, status: "unledgered", ledger: null });
  }
  return rows;
}

export async function claimsCheck({ ledger, dossier, sourcesDir, draft = null, map = null, offline = false }) {
  const le = validateLedger(ledger); if (le.length) throw new TypeError(`ledger: ${le.join("; ")}`);
  const de = validateDossier(dossier); if (de.length) throw new TypeError(`dossier: ${de.join("; ")}`);
  const unknownSources = ledger.claims.filter((k) => !dossier.sources.some((s) => s.id === k.source)).map((k) => k.id);
  const quotes = checkQuotes(ledger, dossier, sourcesDir);
  const links = await checkLinks(dossier, { offline });
  let coverage = null;
  if (map) {
    const me = validateSentenceMap(map); if (me.length) throw new TypeError(`sentence map: ${me.join("; ")}`);
    if (draft === null) throw new TypeError("a sentence map needs the draft it maps");
    coverage = checkCoverage(map, ledger, draft);
  }
  const counts = {
    quotes: Object.fromEntries(["exact", "drifted", "absent"].map((s) => [s, quotes.filter((q) => q.status === s).length])),
    links: Object.fromEntries(["ok", "dead", "not-evaluated"].map((s) => [s, links.filter((l) => l.status === s).length])),
    coverage: coverage ? Object.fromEntries(["unledgered", "not-in-draft", "unknown-ledger"].map((s) => [s, coverage.filter((c) => c.status === s).length])) : null,
  };
  return {
    schema: CHECK_SCHEMA,
    quotes, links, coverage, counts,
    ...(unknownSources.length ? { unknown_sources: unknownSources } : {}),
    limits: [
      "Quote matching normalises whitespace and nothing else; a paraphrase, a changed word, comma or case is drifted, and that is the point.",
      "A link status is an HTTP status, not a content check; not-evaluated is never ok.",
      "Coverage reads the model's sentence map: which sentences are claims is the map's judgement, shown here, not measured.",
      "Nothing here says whether a claim is true. An exact quote from a wrong source is exact.",
    ],
  };
}

export function renderCheck(r) {
  const out = [`claims-check — quotes ${r.counts.quotes.exact} exact, ${r.counts.quotes.drifted} drifted, ${r.counts.quotes.absent} absent · links ${r.counts.links.ok} ok, ${r.counts.links.dead} dead, ${r.counts.links["not-evaluated"]} not evaluated${r.coverage ? ` · coverage ${r.counts.coverage.unledgered} unledgered` : ""}`];
  for (const q of r.quotes) if (q.status !== "exact" || q.why) out.push(`  ${q.status.padEnd(8)} ${q.claim} (${q.source})${q.why ? ` — ${q.why}` : ""}${q.found?.text ? `\n           source: "${q.found.text}"\n           ledger: "${q.expected}"` : ""}`);
  for (const l of r.links) if (l.status !== "ok") out.push(`  ${l.status.padEnd(13)} ${l.source} — ${l.why}`);
  for (const c of r.coverage ?? []) out.push(`  ${c.status.padEnd(13)} ${c.sentence_id}: ${c.text.slice(0, 90)}${c.text.length > 90 ? "…" : ""}`);
  if (r.unknown_sources) out.push(`  ledger claims naming sources not in the dossier: ${r.unknown_sources.join(", ")}`);
  out.push("  Leads, not verdicts: an exact quote is what the source said, not whether it is true.");
  return out.join("\n");
}

const USAGE = "Usage: node claims-check.mjs --ledger L.json --dossier D.json --sources-dir DIR [--draft F --map M.json] [--offline] [--json]";

if (process.argv[1] && existsSync(process.argv[1]) && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2); const flags = new Map();
  for (let i = 0; i < args.length; i++) {
    if (["--json", "--offline"].includes(args[i])) flags.set(args[i], true);
    else if (["--ledger", "--dossier", "--sources-dir", "--draft", "--map"].includes(args[i]) && args[i + 1] !== undefined && !args[i + 1].startsWith("--")) flags.set(args[i], resolve(args[++i]));
    else { process.stderr.write(`${USAGE}\n`); process.exit(2); }
  }
  if (!flags.has("--ledger") || !flags.has("--dossier") || !flags.has("--sources-dir") || (flags.has("--map") !== flags.has("--draft"))) { process.stderr.write(`${USAGE}\n`); process.exit(2); }
  const read = (f) => JSON.parse(readFileSync(f, "utf8"));
  claimsCheck({ ledger: read(flags.get("--ledger")), dossier: read(flags.get("--dossier")), sourcesDir: flags.get("--sources-dir"), draft: flags.has("--draft") ? readFileSync(flags.get("--draft"), "utf8") : null, map: flags.has("--map") ? read(flags.get("--map")) : null, offline: flags.get("--offline") === true })
    .then((r) => process.stdout.write(flags.get("--json") ? `${JSON.stringify(r, null, 2)}\n` : `${renderCheck(r)}\n`))
    .catch((e) => { process.stderr.write(`claims-check: ${e.message}\n`); process.exit(1); });
}
