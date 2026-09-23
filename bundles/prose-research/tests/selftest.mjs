#!/usr/bin/env node
/**
 * prose-research selftest.
 *
 *   node bundles/prose-research/tests/selftest.mjs
 *
 * Every case builds its scratch state under the OS temp directory and touches
 * nothing in the repo. No model is dispatched and no network is used: the URL
 * path runs through file:// and every link check runs --offline or against a
 * file locator.
 */
import { existsSync, mkdtempSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";
import { FIXTURES, TOOLS, buildFixtureDossier, loadLedger, realise, render, runChecks } from "./research-fixtures.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const BUNDLE = resolve(HERE, "..");
const REPO = resolve(BUNDLE, "..", "..");
const SKILL = join(BUNDLE, "skills", "prose-research");

let passed = 0, failed = 0, skipped = 0;
const failures = [], skips = [];
function check(name, condition, detail = "") {
  if (condition) { passed += 1; process.stdout.write(`  ok   ${name}\n`); }
  else { failed += 1; failures.push(`${name}${detail ? ` — ${detail}` : ""}`); process.stdout.write(`  FAIL ${name}${detail ? ` — ${detail}` : ""}\n`); }
}
const group = (title) => process.stdout.write(`\n${title}\n`);
const attempt = (fn) => { try { return fn() ?? {}; } catch (e) { return { crashed: e.message, code: e.code }; } };
const attemptAsync = async (fn) => { try { return (await fn()) ?? {}; } catch (e) { return { crashed: e.message, code: e.code }; } };
const skip = (what, why) => { skipped += 1; skips.push(`${what} — ${why}`); process.stdout.write(`  SKIP ${what} — ${why}\n`); };

const tmp = mkdtempSync(join(tmpdir(), "prose-research-selftest-"));
try {
  /* ---------------------------------------------------------------- */
  group("Packaging — four manifests, no agents, the shared libs byte-identical to their canonical copies");
  {
    const manifests = [".claude-plugin", ".codex-plugin", ".cursor-plugin", ".plugin"].map((f) => JSON.parse(readFileSync(join(BUNDLE, f, "plugin.json"), "utf8")));
    check("all four manifests name prose-research with one version", manifests.every((m) => m.name === "prose-research") && new Set(manifests.map((m) => m.version)).size === 1);
    check("no manifest declares agents: this bundle ships a skill and extends critics that live elsewhere", manifests.every((m) => !Array.isArray(m.agents)));
    const pairs = [["registry-reader.mjs", join(REPO, "bundles", "prose-outline", "skills", "prose-outline", "tools", "lib")], ["revision-store.mjs", join(REPO, "bundles", "prose-outline", "skills", "prose-outline", "tools", "lib")], ["html-text.mjs", join(REPO, "bundles", "prose-author", "skills", "prose-corpus", "tools", "lib")]];
    for (const [lib, dir] of pairs) {
      if (!existsSync(join(dir, lib))) { skip(`${lib} parity`, "canonical bundle absent"); continue; }
      check(`lib/${lib} is byte-identical to its canonical copy`, readFileSync(join(SKILL, "tools", "lib", lib)).equals(readFileSync(join(dir, lib))));
    }
    const skill = readFileSync(join(SKILL, "SKILL.md"), "utf8");
    check("SKILL.md references tools by relative path, states the approval rule, and never adjudicates truth", !skill.includes("CLAUDE_PLUGIN_ROOT") && /node tools\/source-intake\.mjs/.test(skill) && /--approved/.test(skill) && /never .{0,40}true/i.test(skill));
    const meta = readFileSync(join(SKILL, "meta.yaml"), "utf8");
    check("meta.yaml declares kind investigator, surface skill and honest enforcement per harness", /kind: investigator/.test(meta) && ["claude-code", "cursor", "codex", "agents-md"].every((h) => new RegExp(`${h}:\\n\\s+enforcement: (enforced|partial|advisory)`).test(meta)));
  }

  /* ---------------------------------------------------------------- */
  group("schemas — dossier, ledger, sentence map");
  const schema = await import(pathToFileURL(join(TOOLS, "lib", "research-schema.mjs")).href);
  {
    const sources = join(tmp, "sources-a");
    const dossier = realise(await buildFixtureDossier(sources));
    check("the fixture dossier validates", schema.validateDossier(dossier).length === 0, schema.validateDossier(dossier).join("; "));
    check("the fixture ledger validates", schema.validateLedger(loadLedger()).length === 0, schema.validateLedger(loadLedger()).join("; "));
    const bad = (mutate, pattern, name, fn = schema.validateDossierBody, base = dossier) => { const b = JSON.parse(JSON.stringify(base)); mutate(b); const e = fn(b); check(name, e.some((x) => pattern.test(x)), e.join("; ")); };
    bad((b) => { b.sources[0].text_file = "other.txt"; }, /must be <sha256>\.txt/, "a text_file that is not the sha is refused");
    bad((b) => { b.passages[0].source = "s9"; }, /must name a source/, "a passage citing a source the dossier lacks is refused");
    bad((b) => { b.sources[1].kind = "web"; }, /kind must be one of/, "an unknown source kind is refused");
    const ledger = loadLedger();
    bad((b) => { b.claims[0].confidence_by = "model"; }, /confidence is a label, never a measurement/, "confidence_by must be writer", schema.validateLedgerBody, ledger);
    bad((b) => { b.claims[0].confidence = "certain"; }, /confidence must be/, "an unknown confidence is refused", schema.validateLedgerBody, ledger);
    bad((b) => { b.claims[1].id = "k1"; }, /duplicate id/, "a duplicate claim id is refused", schema.validateLedgerBody, ledger);
    const map = JSON.parse(readFileSync(join(FIXTURES, "drafts", "sentence-map.json"), "utf8"));
    check("the fixture sentence map validates", schema.validateSentenceMap(map).length === 0);
    bad((b) => { b.sentences[0].claim = false; }, /cannot cite the ledger/, "a non-claim sentence cannot cite the ledger", schema.validateSentenceMap, map);
    check("normalise touches whitespace and nothing else", schema.normalise("  a\n b\t c ") === "a b c" && schema.normalise("A, b.") === "A, b.");
  }

  /* ---------------------------------------------------------------- */
  group("source-intake — file, URL from file, HTML to text, PDF refusal, no store touched");
  const intakeMod = await import(pathToFileURL(join(TOOLS, "source-intake.mjs")).href);
  {
    const now = new Date("2026-01-02T03:04:05.000Z");
    const a = await intakeMod.intake(join(FIXTURES, "sources", "mill-history.txt"), { now });
    check("a text file: kind file, sha256 of the text, text_file named by the sha, retrieved_at from the clock", a.source.kind === "file" && /^[a-f0-9]{64}$/.test(a.source.sha256) && a.source.text_file === `${a.source.sha256}.txt` && a.source.retrieved_at === "2026-01-02T03:04:05.000Z" && a.text.includes("forty-one sacks"));
    const b = await intakeMod.intake(pathToFileURL(join(FIXTURES, "sources", "valley-guide.html")).href, { now });
    check("a file:// URL exercises the URL path: HTML becomes text, the title is read, script and style are gone", b.source.kind === "url" && b.source.title === "A walker's guide to the valley" && !/void 0|p\{\}/.test(b.text) && /take the quarry path in wet weather/.test(b.text));
    const missing = await attemptAsync(() => intakeMod.intake(join(FIXTURES, "sources", "nope.txt")));
    check("a missing file is an error, not an empty source", /not found/.test(missing.crashed ?? ""));
    const pdf = await attemptAsync(() => intakeMod.intake(join(FIXTURES, "sources", "mill-history.txt"), { kind: "pdf" }));
    const hasPdftotext = spawnSync(process.platform === "win32" ? "where" : "which", ["pdftotext"]).status === 0;
    if (hasPdftotext) check("pdftotext is on PATH here, so a non-PDF handed to it fails as pdftotext's error", /pdftotext failed/.test(pdf.crashed ?? ""));
    else check("without pdftotext a PDF is refused with the export instruction, exit 3", pdf.code === 3 && /supply a text export/.test(pdf.crashed ?? ""));
    check("the proposal says nothing is stored", /Nothing is stored/.test(a.receipt));
    const cli = spawnSync(process.execPath, [join(TOOLS, "source-intake.mjs"), join(FIXTURES, "sources", "mill-history.txt"), "--json"], { encoding: "utf8" });
    check("the CLI prints the same proposal as JSON", cli.status === 0 && JSON.parse(cli.stdout).source.sha256 === a.source.sha256);
    check("usage without an argument exits 2", spawnSync(process.execPath, [join(TOOLS, "source-intake.mjs")], { encoding: "utf8" }).status === 2);
  }

  /* ---------------------------------------------------------------- */
  group("claims-check — quote exactness without fuzz, links offline, coverage from the map");
  const checkMod = await import(pathToFileURL(join(TOOLS, "claims-check.mjs")).href);
  const sourcesB = join(tmp, "sources-b");
  const run = await runChecks(sourcesB);
  {
    for (const name of ["check", "provenance", "dossier"]) {
      const expected = join(FIXTURES, "expected", `${name}.json`);
      const actual = name === "dossier" ? { ...run.dossier, sources: run.dossier.sources.map((s) => ({ ...s, locator: s.locator.replace(pathToFileURL(FIXTURES).href, "file://<fixtures>") })) } : run[name];
      check(`${name} matches expected/${name}.json`, existsSync(expected) && readFileSync(expected, "utf8") === render(actual), "rerun tests/research-fixtures.mjs --update and review the diff");
    }
    const q = Object.fromEntries(run.check.quotes.map((x) => [x.claim, x]));
    check("a verbatim quote is exact", q.k1.status === "exact" && q.k2.status === "exact");
    check("one changed word is drifted, with the source's words shown beside the ledger's", q.k3.status === "drifted" && /would not/.test(q.k3.found.text) && /could not/.test(q.k3.expected));
    check("a changed case is drifted too — whitespace is the only normalisation", q.k4.status === "drifted");
    check("a quote whose source text is not cached is absent, with the reason", q.k5.status === "absent" && /not in the dossier's cache/.test(q.k5.why));
    check("a quote found on another line is exact and says where", q.k6.status === "exact" && /found at line 10, recorded at line 40/.test(q.k6.why));
    const l = Object.fromEntries(run.check.links.map((x) => [x.source, x]));
    check("a file source is not evaluated, an existing file:// locator is ok, a missing one is dead", l.s1.status === "not-evaluated" && l.s2.status === "ok" && l.s3.status === "dead");
    const dossier = run.dossier;
    const withHttp = { ...dossier, sources: [...dossier.sources, { ...dossier.sources[0], id: "s4", kind: "url", locator: "https://example.invalid/never" }] };
    const offline = await checkMod.claimsCheck({ ledger: run.ledger, dossier: withHttp, sourcesDir: sourcesB, offline: true });
    check("--offline ⇒ an http source is not-evaluated, never ok", offline.links.find((x) => x.source === "s4").status === "not-evaluated" && offline.links.find((x) => x.source === "s4").why === "--offline");
    const c = Object.fromEntries(run.check.coverage.map((x) => [x.sentence_id, x]));
    check("the two sentences the map marks as claims with no ledger entry are the coverage rows, and nothing else", run.check.coverage.length === 2 && c.p2s3?.status === "unledgered" && c.p4s1?.status === "unledgered");
    const map = JSON.parse(readFileSync(join(FIXTURES, "drafts", "sentence-map.json"), "utf8"));
    const draft = readFileSync(join(FIXTURES, "drafts", "draft.md"), "utf8");
    const invented = { ...map, sentences: [...map.sentences, { id: "p9s1", text: "The mill was demolished in 1970.", claim: true, ledger: "k1" }, { id: "p9s2", text: "The quarry closed in 1961; its last foreman said \"the stone ran out before the men did.\"", claim: true, ledger: "k99" }] };
    const cov = await checkMod.claimsCheck({ ledger: run.ledger, dossier, sourcesDir: sourcesB, draft, map: invented, offline: true });
    check("a map sentence that is not in the draft, and a ledger id that does not exist, are reported by name", cov.coverage.some((x) => x.sentence_id === "p9s1" && x.status === "not-in-draft") && cov.coverage.some((x) => x.sentence_id === "p9s2" && x.status === "unknown-ledger"));
    const empty = await checkMod.claimsCheck({ ledger: run.ledger, dossier, sourcesDir: sourcesB, draft: readFileSync(join(FIXTURES, "drafts", "no-claims.md"), "utf8"), map: JSON.parse(readFileSync(join(FIXTURES, "drafts", "no-claims-map.json"), "utf8")), offline: true });
    check("NEGATIVE: a draft with no claims yields an empty coverage list, not invented entries", empty.coverage.length === 0 && empty.counts.coverage.unledgered === 0);
    check("the report's limits say an exact quote is not a true claim", run.check.limits.some((x) => /exact quote from a wrong source is exact/.test(x)));
    const badLedger = await attemptAsync(() => checkMod.claimsCheck({ ledger: { ...run.ledger, claims: [{ ...run.ledger.claims[0], confidence_by: "model" }] }, dossier, sourcesDir: sourcesB }));
    check("an invalid ledger is refused before any check runs", /confidence_by must be "writer"/.test(badLedger.crashed ?? ""));
    const mapNoDraft = await attemptAsync(() => checkMod.claimsCheck({ ledger: run.ledger, dossier, sourcesDir: sourcesB, map, offline: true }));
    check("a sentence map without its draft is refused", /needs the draft/.test(mapNoDraft.crashed ?? ""));
  }

  /* ---------------------------------------------------------------- */
  group("provenance-scan — fidelity-scan's quote atoms against their ledger sources");
  const provMod = await import(pathToFileURL(join(TOOLS, "provenance-scan.mjs")).href);
  {
    const p = Object.fromEntries(run.provenance.quotes.map((x) => [x.ledger ?? x.atom, x]));
    check("a quote the draft changed (three carts for two) is drifted against its source, with the ledger's span shown", p.k2?.status === "drifted" && /two carts/.test(p.k2.source_span));
    check("a quote that matches the source is exact even though the LEDGER misquotes it — presence is about the source", p.k3?.status === "exact");
    check("a quote whose ledger source is not cached is absent, not drifted", p.k5?.status === "absent");
    check("closing punctuation inside the quote is not drift", run.provenance.quotes.every((x) => x.status !== "drifted" || !/did\.$|wait\.$/.test(x.atom)));
    check("atoms follow fidelity-scan's rule: three words or more, whitespace-normalised, none spanning a blank line",
      provMod.quoteAtoms("He said \"no way\" and \"this is a longer\nquote\" and \"broken\n\nquote here now\"").join("|") === "this is a longer quote");
    const unl = provMod.provenanceScan({ revision: "She wrote \"an entirely different sentence here\".", ledger: run.ledger, dossier: run.dossier, sourcesDir: sourcesB });
    check("an atom no ledger quote shares 60% of its words with is unledgered — not a finding", unl.quotes[0].status === "unledgered" && unl.quotes[0].ledger === null);
    const both = provMod.provenanceScan({ revision: "\"the stone ran out before the men did\"", original: "\"the stone ran out before the men did\" and \"an ornament, not an engine\"", ledger: run.ledger, dossier: run.dossier, sourcesDir: sourcesB });
    check("atoms are attributed to original, revision or both", both.quotes.find((x) => /stone/.test(x.atom)).in === "both" && both.quotes.find((x) => /ornament/.test(x.atom)).in === "original");
    // Parity with fidelity-scan's own atoms, at test time.
    const fidelity = join(REPO, "bundles", "prose-review", "tools", "fidelity-scan.mjs");
    if (!existsSync(fidelity)) skip("quote-rule parity", "prose-review absent");
    else {
      const fs = await import(pathToFileURL(fidelity).href);
      const texts = [readFileSync(join(FIXTURES, "drafts", "draft.md"), "utf8"), readFileSync(join(FIXTURES, "sources", "mill-history.txt"), "utf8"), "“curly one two three” and ‘single four five six’ and \"a\nsplit quote here\" and \"no\n\nway here at all\""];
      check("PARITY: the same quote atoms as prose-review's fidelity-scan on three texts", typeof fs.extractAtoms === "function" && texts.every((t) => fs.extractAtoms(t).filter((a) => a.kind === "quote").map((a) => a.source).join("|") === provMod.quoteAtoms(t).join("|")));
    }
  }

  /* ---------------------------------------------------------------- */
  group("research-store — add-source and save under approval, ledger sources checked against the dossier, three registry states");
  const store = await import(pathToFileURL(join(TOOLS, "research-store.mjs")).href);
  {
    const REG = join(REPO, "bundles", "prose-outline", "tests", "fixtures", "registry");
    if (!existsSync(REG)) skip("registry states", "prose-outline's registry fixtures absent");
    else {
      const env = { PROSE_PROJECTS_DIR: join(tmp, "projects") };
      const intakeFile = join(tmp, "intake.json");
      writeFileSync(intakeFile, JSON.stringify(await intakeMod.intake(join(FIXTURES, "sources", "mill-history.txt"), { now: new Date("2026-01-02T03:04:05.000Z") })));
      const refusal = (argv) => { try { store.runStore(argv, env); return null; } catch (e) { return e; } };
      let r = refusal(["add-source", "--project", "mill", "--intake", intakeFile, "--expected-revision", "0", "--approved", "--registry", join(tmp, "none")]);
      check("no registry ⇒ cannot persist, exit 3, nothing on disk", r?.code === 3 && !existsSync(join(tmp, "projects")));
      r = refusal(["add-source", "--project", "mill", "--intake", intakeFile, "--expected-revision", "0", "--approved", "--registry", join(REG, "ambiguous")]);
      check("identities without a default ⇒ cannot persist, never picking the first", r?.code === 3 && r.identities?.join() === "personal,work");
      const sel = ["--registry", join(REG, "selected")];
      const dry = attempt(() => store.runStore(["add-source", "--project", "mill", "--intake", intakeFile, "--expected-revision", "0", ...sel], env));
      check("add-source without --approved proposes and writes nothing, not even the source text", dry.status === "proposal" && dry.source_id === "s1" && !existsSync(join(tmp, "projects")));
      const added = attempt(() => store.runStore(["add-source", "--project", "mill", "--intake", intakeFile, "--expected-revision", "0", "--approved", ...sel], env));
      const research = join(tmp, "projects", "personal", "mill", "research");
      check("approved ⇒ dossier revision 1 with s1, and the source text cached by sha under research/sources", added.status === "saved" && added.revision === 1 && existsSync(join(research, "dossier", "current.json")) && readdirSync(join(research, "sources")).length === 1);
      const again = refusal(["add-source", "--project", "mill", "--intake", intakeFile, "--expected-revision", "1", "--approved", ...sel]);
      check("the same text twice is refused by its existing id", /already in the dossier as s1/.test(again?.message ?? ""));
      const ledgerFile = join(tmp, "ledger.json");
      writeFileSync(ledgerFile, JSON.stringify({ claims: [{ id: "k1", claim: "x", source: "s2", location: { line: 1, offset: 0 }, quote: "the mill", confidence: "low", confidence_by: "writer" }] }));
      r = refusal(["save", "--project", "mill", "--store", "ledger", "--proposal", ledgerFile, "--expected-revision", "0", "--approved", ...sel]);
      check("a ledger claim citing a source the dossier does not have is refused", /cite sources the dossier does not have: k1→s2/.test(r?.message ?? ""));
      writeFileSync(ledgerFile, JSON.stringify({ claims: [{ id: "k1", claim: "x", source: "s1", location: { line: 1, offset: 0 }, quote: "The mill on the Harrow road", confidence: "low", confidence_by: "writer" }] }));
      const saved = attempt(() => store.runStore(["save", "--project", "mill", "--store", "ledger", "--proposal", ledgerFile, "--expected-revision", "0", "--approved", ...sel], env));
      check("a ledger whose sources exist saves as revision 1 of its own store", saved.status === "saved" && saved.revision === 1 && existsSync(join(research, "ledger", "current.json")));
      const shown = attempt(() => store.runStore(["show", "--project", "mill", "--store", "ledger", ...sel], env));
      check("show returns a valid claims-ledger/1", shown.ledger?.schema === "claims-ledger/1" && schema.validateLedger(shown.ledger).length === 0);
      r = refusal(["save", "--project", "mill", "--store", "ledger", "--proposal", ledgerFile, "--expected-revision", "0", "--approved", ...sel]);
      check("a stale expected revision is refused", /Stale revision/.test(r?.message ?? ""));
      attempt(() => store.runStore(["save", "--project", "mill", "--store", "ledger", "--proposal", ledgerFile, "--expected-revision", "1", "--approved", ...sel], env));
      const undone = attempt(() => store.runStore(["undo", "--project", "mill", "--store", "ledger", "--expected-revision", "2", "--approved", ...sel], env));
      check("undo writes revision 3 restoring revision 1", undone.status === "saved" && undone.revision === 3);
      const located = attempt(() => store.runStore(["locate", ...sel], env));
      check("locate reports the identity and where research would live", located.status === "located" && located.identity === "personal");
      check("usage: --store must be dossier or ledger", refusal(["show", "--project", "mill", "--store", "notes", ...sel])?.code === 2);
    }
  }
} finally { rmSync(tmp, { recursive: true, force: true }); }

process.stdout.write(`\n${"─".repeat(60)}\n`);
process.stdout.write(`${passed} passed, ${failed} failed${skipped ? `, ${skipped} skipped` : ""}\n`);
if (skipped) process.stdout.write(`\nSkipped (precondition absent):\n${skips.map((s) => `  - ${s}`).join("\n")}\n`);
if (failed) process.stdout.write(`\nFailures:\n${failures.map((f) => `  - ${f}`).join("\n")}\n`);
process.exit(failed ? 1 : 0);
