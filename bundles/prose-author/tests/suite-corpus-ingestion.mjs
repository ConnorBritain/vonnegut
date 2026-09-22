/**
 * corpus ingestion (roadmap item D) — importers propose, the writer selects and
 * attests, ingest writes exactly the selected ids with the provenance
 * frontmatter prose-tell-scan reads, and progress is re-derived from disk.
 *
 * The parity check imports tell-scan's own `readProvenance` at test time and
 * runs it over what `corpus-ingest.mjs` wrote. Shipped code never imports
 * across a bundle boundary; a test may, with a printed SKIP when the sibling is
 * absent.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";
import { CASES, IMPORTS, TOOLS, importCase, render } from "./corpus-fixtures.mjs";

const attempt = (fn) => { try { return fn() ?? {}; } catch (e) { return { crashed: e.message, code: e.code }; } };

export async function run(t, { tmp, HERE } = {}) {
  const ingestMod = await import(pathToFileURL(join(TOOLS, "corpus-ingest.mjs")).href);
  const prov = await import(pathToFileURL(join(TOOLS, "lib", "provenance.mjs")).href);
  const html = await import(pathToFileURL(join(TOOLS, "lib", "html-text.mjs")).href);
  const reg = await import(pathToFileURL(join(TOOLS, "lib", "register-suggest.mjs")).href);
  const mime = await import(pathToFileURL(join(TOOLS, "lib", "mime.mjs")).href);
  const { ingest, progress, validateSelection } = ingestMod;

  t.group("corpus importers — each fixture export reproduces its expected manifest");
  const manifests = {};
  for (const c of CASES) {
    const actual = await importCase(c);
    manifests[c.name] = actual;
    const expected = join(IMPORTS, "expected", `${c.name}.json`);
    t.check(`${c.name}: manifest matches expected/${c.name}.json`, existsSync(expected) && readFileSync(expected, "utf8") === render(actual), "rerun tests/corpus-fixtures.mjs --update and review the diff");
    t.check(`${c.name}: every candidate carries text, a word count, a suggestion with a reason, and no attestation`,
      actual.candidates.every((x) => typeof x.text === "string" && Number.isInteger(x.words) && x.suggested?.register && x.suggested.why && !("human_authored" in x) && !("attest" in x)));
    t.check(`${c.name}: the manifest's limits say attestation is the writer's`, actual.limits.some((l) => /Attestation is the writer's/.test(l)));
  }

  t.group("substack — CSV metadata, drafts, orphans, and a missing posts.csv");
  {
    const sub = await import(pathToFileURL(join(TOOLS, "import-substack.mjs")).href);
    const m = manifests.substack;
    const first = m.candidates.find((c) => c.title === "On keeping a notebook");
    t.check("title and date come from posts.csv, body from the HTML with script, style and figure dropped",
      first?.date === "2024-03-01" && !/track\(\)|margin:0/.test(first.text) && /A notebook, open/.test(first.text) && first.words > 250);
    t.check("an unpublished post is a candidate and says so", m.candidates.some((c) => /unpublished draft/.test(c.suggested.why)));
    t.check("a post with no CSV row has a null date, never today's", m.candidates.some((c) => c.path.includes("orphan") && c.date === null && /no date/.test(c.suggested.why)));
    t.check("an empty HTML file and a CSV row with no file are refused by name", m.refused.some((r) => /empty/.test(r.path)) && m.refused.some((r) => /no HTML file/.test(r.why)));
    const bad = attempt(() => sub.importSubstack(join(IMPORTS, "substack-no-csv")));
    t.check("a folder without posts.csv is not a Substack export", /posts\.csv is missing/.test(bad.crashed ?? ""));
    t.check("the entity in a blockquote is decoded", m.candidates.some((c) => /the point — it never was/.test(c.text)));
  }

  t.group("gdocs — HTML, text and markdown read; .docx refused with the export instruction; sidecar dates");
  {
    const m = manifests.gdocs;
    t.check(".docx is refused and told how to export", m.refused.some((r) => r.path === "Old-draft.docx" && /export the document as HTML or plain text/.test(r.why)));
    const notes = m.candidates.find((c) => c.title === "Field notes on editing");
    t.check("the Takeout sidecar's modifiedTime is the date; inline CSS is gone; entities decoded", notes?.date === "2023-11-20" && !/font-family/.test(notes.text) && /Don’t trust the first draft & don't/.test(notes.text));
    t.check("a letter with salutation and sign-off is suggested as correspondence", m.candidates.some((c) => c.title === "Letter to the board" && c.suggested.register === "correspondence"));
    t.check("a document with code is suggested as technical", m.candidates.some((c) => c.title === "setup guide" && c.suggested.register === "technical"));
    t.check("a file without a sidecar has a null date", m.candidates.some((c) => c.title === "Letter to the board" && c.date === null));
  }

  t.group("vault — recursive, frontmatter-aware, wiki links resolved, index pages and ignored folders skipped");
  {
    const vault = await import(pathToFileURL(join(TOOLS, "import-vault.mjs")).href);
    const m = manifests.vault;
    const nb = m.candidates.find((c) => c.title === "The notebook, again");
    t.check("frontmatter title and date are read and stripped; tags reported in why", nb?.date === "2022-09-14" && !/^---/.test(nb.text) && /tagged writing, habit/.test(nb.suggested.why));
    t.check("wiki links become their alias or name and embeds are dropped", /the one about pens/.test(nb?.text ?? "") && /See also .* and Editing\./.test(nb?.text ?? "") && !/\[\[|!\[\[|notebook\.png/.test(nb?.text ?? ""));
    t.check("a comment block is dropped and `created` is a date", m.candidates.some((c) => c.title === "pens" && c.date === "2022-10-01" && !/private comment/.test(c.text)));
    t.check("an index of links is refused", m.refused.some((r) => r.path === "Index.md" && /index of links/.test(r.why)));
    t.check("the ignored templates folder is skipped, and read when not ignored", !m.candidates.some((c) => c.path.startsWith("templates")) && vault.importVault(join(IMPORTS, "vault")).candidates.some((c) => c.path.startsWith("templates")));
    t.check(".obsidian is never read", !m.candidates.some((c) => c.path.includes(".obsidian")) && !m.refused.some((r) => r.path.includes(".obsidian")));
  }

  t.group("mbox — the writer's address is explicit; MIME, quoted-printable and base64 decoded; replies and signatures stripped");
  {
    const mbox = await import(pathToFileURL(join(TOOLS, "import-mbox.mjs")).href);
    const m = manifests.mbox;
    const bad = attempt(() => mbox.importMbox(join(IMPORTS, "mbox", "writer.mbox"), {}));
    t.check("--from is required; the importer never guesses the writer", /never guesses/.test(bad.crashed ?? ""));
    t.check("a message from another address is refused by name", m.refused.some((r) => /from friend@example\.net, not ana@example\.org/.test(r.why)));
    const first = m.candidates.find((c) => c.title === "On keeping a notebook");
    t.check("the quoted reply, its introduction line and the signature are stripped", first && !/Do you still keep|wrote:|sent from a desk|^> /m.test(first.text) && /eleven years/.test(first.text));
    const qp = m.candidates.find((c) => /part two/.test(c.title ?? ""));
    t.check("RFC 2047 subject and quoted-printable body decode; text/plain is preferred over text/html", qp?.title === "Notebooks, again — part two" && /eleven years/.test(qp.text) && /note\s?book/.test(qp.text) && !/HTML alternative/.test(qp.text));
    t.check("a base64 body decodes", m.candidates.some((c) => c.title === "Base64 body" && /throw them away/.test(c.text) && c.words > 150));
    t.check("a PDF-only message and an all-quoted message are refused with reasons", m.refused.some((r) => /application\/pdf is not text/.test(r.why)) && m.refused.some((r) => /nothing left after stripping/.test(r.why)));
    t.check("dates are ISO from the Date header", m.candidates.every((c) => /^\d{4}-\d{2}-\d{2}$/.test(c.date)));
    t.check("splitMbox does not split on a quoted >From line", mime.splitMbox("From a@b Mon Jan  1 00:00:00 2024\nFrom: a@b\n\nbody\n>From here on\n").length === 1);
  }

  t.group("register-suggest — deterministic, with a reason");
  {
    t.check("dialogue reads as narration", reg.suggestRegister({ importer: "vault", text: "\"Leave it,\" she said, and turned to the window. He walked out. She looked back. They stood.", words: 20 }).register === "narration");
    t.check("code reads as technical", reg.suggestRegister({ importer: "gdocs", text: "Run it:\n\n```\nconst x = 1;\n```\n", words: 10 }).register === "technical");
    t.check("an mbox message is correspondence/email whatever it says", reg.suggestRegister({ importer: "mbox", text: "```code```", words: 10 }).form === "email");
    t.check("every suggestion names a register tell-scan ships", ["essay", "technical", "narration", "correspondence"].every((r) => reg.REGISTERS.includes(r)));
  }

  t.group("html-text — blocks, breaks, entities, dropped elements");
  {
    const text = html.htmlToText("<head><title>T</title></head><body><h1>Head</h1><p>One &amp; two<br>three</p><script>x()</script><ul><li>a</li><li>b</li></ul><!-- c --></body>");
    t.check("block elements become paragraphs, br a line break, script and comments vanish, entities decode",
      text === "Head\n\nOne & two\nthree\n\na\n\nb" , JSON.stringify(text));
    t.check("numeric entities decode and unknown ones are left", html.decodeEntities("&#8217;&#x2014;&zzz;") === "’—&zzz;");
  }

  t.group("corpus-ingest — writes exactly the selected ids, with the frontmatter prose-tell-scan reads, and never anything else");
  const samples = join(tmp, "corpus-ingest-samples");
  mkdirSync(join(samples, "corpus", "human"), { recursive: true });
  const substack = manifests.substack;
  const base = { schema: "corpus-selection/1", ids: ["c001", "c002"], register: "essay", group: null, form: null, attest: true, source: "my Substack export, March 2024" };
  {
    const before = readdirSync(samples);
    const r = attempt(() => ingest({ manifest: substack, selection: base, samplesDir: samples }));
    const files = existsSync(join(samples, "corpus", "human")) ? readdirSync(join(samples, "corpus", "human")).sort() : [];
    t.check("two selected ids ⇒ exactly two files, named from their titles", r.status === "written" && r.written?.length === 2 && files.length === 2 && files.includes("on-keeping-a-notebook.md"), JSON.stringify(r.crashed ?? files));
    t.check("nothing outside corpus/human is created — no history, no preferences, no profile", readdirSync(samples).join() === before.join() && readdirSync(samples).join() === "corpus" && readdirSync(join(samples, "corpus")).join() === "human");
    const text = readFileSync(join(samples, "corpus", "human", "on-keeping-a-notebook.md"), "utf8");
    const p = prov.readProvenance(text);
    t.check("frontmatter: source, date, human_authored: true, ingested_from, profile, form, imported_by — in tell-scan's byte order", p.ok && p.source === base.source && p.date === "2024-03-01" && p.profile === "essay" && p.form === "newsletter" && p.imported_by === "prose-corpus/substack"
      && /^---\nsource: "my Substack export, March 2024"\ndate: 2024-03-01\nhuman_authored: true\ningested_from: posts\/100001\.on-keeping-a-notebook\.html\nprofile: essay\nform: newsletter\nimported_by: prose-corpus\/substack\n---\n\n/.test(text));
    t.check("the body is the candidate's text, frontmatter-free", p.body.trim() === substack.candidates[0].text.trim());
    // Parity with the reader that actually decides what is a sample.
    const sibling = resolve(HERE, "..", "..", "prose-tell-scan", "skills", "tell-scan", "tools", "calibrate.mjs");
    const profileLib = resolve(HERE, "..", "..", "prose-tell-scan", "skills", "tell-scan", "tools", "lib", "profile.mjs");
    if (existsSync(sibling) && existsSync(profileLib)) {
      const cal = await import(pathToFileURL(sibling).href);
      const prof = await import(pathToFileURL(profileLib).href);
      const theirs = cal.readProvenance(text);
      t.check("PARITY: prose-tell-scan's readProvenance accepts the file and agrees on source and date", theirs.ok === true && theirs.source === p.source && theirs.date === p.date && theirs.body === p.body);
      t.check("PARITY: tell-scan's frontmatterProfile resolves the register from the profile line", prof.frontmatterProfile(text) === "essay");
      t.check("PARITY: a file this module rejects, tell-scan rejects for the same reason", ["---\nsource: x\ndate: 2020-01-01\n---\nbody", "---\nsource: x\ndate: 2020-01-01\nhuman_authored: false\n---\nbody", "no frontmatter"].every((s) => cal.readProvenance(s).ok === false && cal.readProvenance(s).reason === prov.readProvenance(s).reason));
      t.check("PARITY: the word floor equals tell-scan's MIN_SAMPLE_WORDS", cal.MIN_SAMPLE_WORDS === prov.MIN_WORDS);
    } else {
      process.stdout.write("  SKIP parity — prose-tell-scan absent\n");
    }
    const again = attempt(() => ingest({ manifest: substack, selection: base, samplesDir: samples }));
    t.check("re-ingesting the same ids is refused per file without --force, and nothing is rewritten", again.status === "nothing-written" && again.refused?.length === 2 && /already in this corpus/.test(again.refused[0].why));
    const forced = attempt(() => ingest({ manifest: substack, selection: base, samplesDir: samples, force: true }));
    t.check("--force rewrites them", forced.written?.length === 2);
  }
  {
    const refusal = (selection, pattern, name) => {
      const before = readdirSync(join(samples, "corpus", "human")).length;
      const r = attempt(() => ingest({ manifest: substack, selection, samplesDir: samples }));
      t.check(name, r.code === 3 && pattern.test(r.crashed ?? "") && readdirSync(join(samples, "corpus", "human")).length === before, r.crashed ?? r.status);
    };
    refusal({ ...base, ids: ["c004"], attest: false }, /attest must be literally true/, "attest: false ⇒ refused, exit 3, nothing written");
    refusal({ ...base, ids: ["c004"], attest: "yes" }, /attest must be literally true/, "attest: \"yes\" is not true");
    refusal({ ...base, ids: [] }, /empty selection ingests nothing/, "an empty selection is refused, not silently a no-op");
    refusal({ ...base, ids: ["c999"] }, /not in the manifest/, "an id the manifest does not have is refused");
    refusal({ ...base, ids: ["c004"], source: " " }, /source must name/, "a blank source is refused");
    refusal({ ...base, ids: ["c004"], register: "poetry" }, /register must be one of/, "an unknown register is refused");
    refusal({ ...base, ids: ["c004"], group: "Bad Group" }, /group must be a lower-case token/, "a group that is not a token is refused");
    t.check("validateSelection lists every problem at once", validateSelection({}).length >= 5);
    const short = attempt(() => ingest({ manifest: substack, selection: { ...base, ids: ["c003"] }, samplesDir: samples }));
    t.check("a candidate under 200 words is refused with its count, and the batch still succeeds for nothing", short.status === "nothing-written" && /23 words, needs 200/.test(short.refused?.[0]?.why ?? ""));
    const undatedManifest = { ...substack, candidates: [{ ...substack.candidates[0], id: "c010", title: "undated", date: null }] };
    const undated = attempt(() => ingest({ manifest: undatedManifest, selection: { ...base, ids: ["c010"] }, samplesDir: samples }));
    t.check("a candidate with no date is refused rather than dated today", undated.status === "nothing-written" && /no date in the export/.test(undated.refused?.[0]?.why ?? ""));
    const grouped = attempt(() => ingest({ manifest: manifests.mbox, selection: { ...base, ids: ["c001"], register: "correspondence", group: "letters", form: "email", source: "mail archive" }, samplesDir: samples }));
    t.check("a group is a subdirectory of corpus/human, one level deep", grouped.written?.length === 1 && grouped.written[0].file.includes(join("corpus", "human", "letters")) && existsSync(join(samples, "corpus", "human", "letters", "on-keeping-a-notebook.md")));
    const badManifest = attempt(() => ingest({ manifest: { schema: "nope" }, selection: base, samplesDir: samples }));
    t.check("a document that is not a corpus-candidates/1 manifest is refused", badManifest.code === 1 && /schema must be corpus-candidates\/1/.test(badManifest.crashed ?? ""));
  }

  t.group("progress — re-derived from disk by the test, against both floors");
  {
    const p = progress(samples);
    // Independent recount: walk corpus/human, keep attested files with >= 200 words, group by profile/form/group.
    const recount = new Map(); let n = 0;
    const walk = (dir, group) => { for (const e of readdirSync(dir, { withFileTypes: true })) {
      if (e.isDirectory()) { walk(join(dir, e.name), e.name); continue; }
      const txt = readFileSync(join(dir, e.name), "utf8"); const fm = txt.match(/^---\n([\s\S]*?)\n---\n/); if (!fm || !/^human_authored: true$/m.test(fm[1])) continue;
      const body = txt.slice(fm[0].length); const w = (body.match(/\b[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*\b/gu) ?? []).length; if (w < 200) continue;
      n += 1; const key = `${fm[1].match(/^profile: (.+)$/m)?.[1]}/${fm[1].match(/^form: (.+)$/m)?.[1]}/${group ?? ""}`;
      recount.set(key, (recount.get(key) ?? { pieces: 0, words: 0 })); recount.get(key).pieces += 1; recount.get(key).words += w;
    } };
    walk(join(samples, "corpus", "human"), null);
    t.check("group rows equal an independent recount of pieces and words", p.groups.length === recount.size && p.groups.every((g) => { const r = recount.get(`${g.register}/${g.form}/${g.group ?? ""}`); return r && r.pieces === g.pieces && r.words === g.words; }), JSON.stringify(p.groups));
    t.check("the profile floor is 5 pieces / 1,000 words and no row is supported yet", p.groups.every((g) => g.floor_pieces === 5 && g.floor_words === 1000 && g.supported === false));
    t.check("calibration counts attested samples against thin 5 / confident 10 and is below floor", p.calibration.human_samples === n && p.calibration.thin === 5 && p.calibration.confident === 10 && p.calibration.status === "below-floor");
    for (let i = 0; i < 8; i += 1) writeFileSync(join(samples, "corpus", "human", `extra-${i}.md`), `---\nsource: notebook\ndate: 2021-04-0${i + 1}\nhuman_authored: true\nprofile: essay\nform: newsletter\n---\n${"word ".repeat(260)}\n`);
    writeFileSync(join(samples, "corpus", "human", "not-attested.md"), `---\nsource: draft\ndate: 2021-04-01\nhuman_authored: false\n---\n${"word ".repeat(260)}\n`);
    const p2 = progress(samples);
    const essay = p2.groups.find((g) => g.register === "essay" && g.form === "newsletter" && g.group === null);
    t.check("after eight more attested essays the essay/newsletter row is supported and calibration is confident; the unattested file is excluded", essay?.pieces === 10 && essay.supported === true && p2.calibration.human_samples === 11 && p2.calibration.status === "confident" && p2.calibration.excluded === 1);
  }

  t.group("corpus-ingest CLI — usage, progress subcommand, exit codes");
  {
    const tool = join(TOOLS, "corpus-ingest.mjs");
    const usage = spawnSync(process.execPath, [tool], { encoding: "utf8" });
    t.check("no arguments ⇒ usage, exit 2", usage.status === 2 && /Usage:/.test(usage.stderr));
    const prog = spawnSync(process.execPath, [tool, "progress", "--samples-dir", samples, "--json"], { encoding: "utf8" });
    t.check("progress --json prints the same numbers the module returns", prog.status === 0 && JSON.parse(prog.stdout).calibration.human_samples === 11);
    const mPath = join(tmp, "manifest.json"), sPath = join(tmp, "selection.json");
    writeFileSync(mPath, JSON.stringify(substack)); writeFileSync(sPath, JSON.stringify({ ...base, attest: false }));
    const ref = spawnSync(process.execPath, [tool, "--manifest", mPath, "--selection", sPath, "--samples-dir", samples], { encoding: "utf8" });
    t.check("a refused selection exits 3 with the reason on stderr", ref.status === 3 && /attest must be literally true/.test(ref.stderr));
    const missing = spawnSync(process.execPath, [tool, "--manifest", mPath, "--selection", sPath, "--samples-dir", join(tmp, "nope")], { encoding: "utf8" });
    t.check("a samples dir that does not exist is an error, never created here", missing.status === 1 && /does not exist/.test(missing.stderr) && !existsSync(join(tmp, "nope")));
    const imp = spawnSync(process.execPath, [join(TOOLS, "import-substack.mjs"), join(IMPORTS, "substack")], { encoding: "utf8" });
    t.check("an importer's human output ends by saying candidates only", imp.status === 0 && /Candidates only\. Selection, register and attestation are the writer's/.test(imp.stdout));
    const nofrom = spawnSync(process.execPath, [join(TOOLS, "import-mbox.mjs"), join(IMPORTS, "mbox", "writer.mbox")], { encoding: "utf8" });
    t.check("import-mbox without --from exits 1 with the reason", nofrom.status === 1 && /never guesses/.test(nofrom.stderr));
  }
}
