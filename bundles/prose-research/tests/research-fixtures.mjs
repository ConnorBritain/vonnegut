#!/usr/bin/env node
/**
 * research-fixtures — build the fixture dossier from the fixture sources, and
 * regenerate or compare the expected claims-check and provenance-scan output.
 *
 *   node tests/research-fixtures.mjs            # compare; exit 1 on any difference
 *   node tests/research-fixtures.mjs --update   # rewrite fixtures/expected/*.json
 *
 * The dossier is derived (sha256 and text_file come from the source bytes), so
 * it is never hand-edited either: `buildFixtureDossier()` writes the cached
 * source texts into a scratch sources dir and returns the dossier that names
 * them. The third source is a deliberately dead locator — a file that does not
 * exist — so the dead-link check has something to find without a network.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
export const FIXTURES = join(HERE, "fixtures");
export const TOOLS = join(HERE, "..", "skills", "prose-research", "tools");

/** Intake the two real sources through source-intake (file:// for the HTML one, so the URL path is exercised), cache their text, add the dead one. */
export async function buildFixtureDossier(sourcesDir) {
  const { intake } = await import(pathToFileURL(join(TOOLS, "source-intake.mjs")).href);
  const { sha256 } = await import(pathToFileURL(join(TOOLS, "lib", "registry-reader.mjs")).href);
  const now = new Date("2026-01-02T03:04:05.000Z");
  mkdirSync(sourcesDir, { recursive: true });
  const a = await intake(join(FIXTURES, "sources", "mill-history.txt"), { kind: "file", now });
  const b = await intake(pathToFileURL(join(FIXTURES, "sources", "valley-guide.html")).href, { kind: "url", now });
  for (const s of [a, b]) writeFileSync(join(sourcesDir, s.source.text_file), s.text);
  const deadText = "This source was once here.";
  const dead = { id: "s3", kind: "url", locator: pathToFileURL(join(FIXTURES, "sources", "gone-newsletter.html")).href, retrieved_at: now.toISOString(), sha256: sha256(deadText), text_file: `${sha256(deadText)}.txt`, title: "Parish newsletter (gone)" };
  // The dead source's text is deliberately NOT cached: its quote is absent, its link dead.
  return {
    schema: "research-dossier/1", id: "mill", revision: 1, parent_digest: null,
    sources: [{ ...a.source, id: "s1", locator: "file://<fixtures>/sources/mill-history.txt" }, { ...b.source, id: "s2", locator: "file://<fixtures>/sources/valley-guide.html" }, { ...dead, locator: "file://<fixtures>/sources/gone-newsletter.html" }],
    passages: [{ id: "p1", source: "s1", location: { line: 2, offset: 31 }, quote: "the wheel was cast in Sheffield and carried up the valley on two carts", note: "parish record" }],
  };
}

/** Portable form: the dossier with real file:// locators for the run, and <fixtures> placeholders in the expected files. */
export const realise = (dossier) => ({ ...dossier, sources: dossier.sources.map((s) => ({ ...s, locator: s.locator.replace("file://<fixtures>", pathToFileURL(FIXTURES).href) })) });

export const loadLedger = () => ({ schema: "claims-ledger/1", id: "mill", revision: 1, parent_digest: null, ...JSON.parse(readFileSync(join(FIXTURES, "ledger", "ledger.json"), "utf8")) });

export async function runChecks(sourcesDir) {
  const { claimsCheck } = await import(pathToFileURL(join(TOOLS, "claims-check.mjs")).href);
  const { provenanceScan } = await import(pathToFileURL(join(TOOLS, "provenance-scan.mjs")).href);
  const dossier = realise(await buildFixtureDossier(sourcesDir));
  const ledger = loadLedger();
  const draft = readFileSync(join(FIXTURES, "drafts", "draft.md"), "utf8");
  const map = JSON.parse(readFileSync(join(FIXTURES, "drafts", "sentence-map.json"), "utf8"));
  const check = await claimsCheck({ ledger, dossier, sourcesDir, draft, map, offline: true });
  const provenance = provenanceScan({ revision: draft, ledger, dossier, sourcesDir });
  return { dossier, ledger, check, provenance };
}

export const render = (r) => `${JSON.stringify(r, null, 2)}\n`;

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { mkdtempSync, rmSync } = await import("node:fs");
  const { tmpdir } = await import("node:os");
  const update = process.argv.includes("--update");
  const tmp = mkdtempSync(join(tmpdir(), "research-fixtures-"));
  let differing = 0;
  try {
    const r = await runChecks(tmp);
    const portable = { check: r.check, provenance: r.provenance, dossier: { ...r.dossier, sources: r.dossier.sources.map((s) => ({ ...s, locator: s.locator.replace(pathToFileURL(FIXTURES).href, "file://<fixtures>") })) } };
    for (const [name, value] of Object.entries(portable)) {
      const target = join(FIXTURES, "expected", `${name}.json`);
      const actual = render(value);
      if (update) { mkdirSync(dirname(target), { recursive: true }); writeFileSync(target, actual); console.log(`  wrote ${name}.json`); continue; }
      if (existsSync(target) && readFileSync(target, "utf8") === actual) console.log(`  ok   ${name}`);
      else { differing += 1; console.log(`  DIFF ${name} — rerun with --update and review the diff`); }
    }
  } finally { rmSync(tmp, { recursive: true, force: true }); }
  process.exit(differing ? 1 : 0);
}
