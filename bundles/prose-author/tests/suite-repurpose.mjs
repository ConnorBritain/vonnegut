/**
 * prose-repurpose (roadmap item F) — medium profiles validate and refuse unknown
 * fields; repurpose-check counts on the final bytes, lists semantic constraints
 * as the critic's, lists missing atoms against the source and never fails on
 * them; the profile digest is what a receipt records.
 *
 * fidelity-scan is prose-review's, located at run time as the drafting runtime
 * locates it; the test points PROSE_REVIEW_ROOT at the sibling checkout and
 * SKIPs the fidelity checks when it is absent.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";

export async function run(t, { HERE } = {}) {
  const SKILL = resolve(HERE, "..", "skills", "prose-repurpose");
  const MEDIA = join(SKILL, "media");
  const FIX = join(HERE, "fixtures", "repurpose");
  const REVIEW = resolve(HERE, "..", "..", "prose-review");
  const env = { ...process.env, PROSE_REVIEW_ROOT: REVIEW };
  const mp = await import(pathToFileURL(join(SKILL, "tools", "lib", "medium-profile.mjs")).href);
  const rc = await import(pathToFileURL(join(SKILL, "tools", "repurpose-check.mjs")).href);
  const read = (p) => readFileSync(p, "utf8");
  const attempt = (fn) => { try { return fn() ?? {}; } catch (e) { return { crashed: e.message }; } };

  t.group("medium profiles — four ship, all validate, unknown fields and prohibition lists refused");
  {
    const files = readdirSync(MEDIA).filter((f) => f.endsWith(".json")).sort();
    t.check("the four forms ship as profiles", files.join(",") === "linkedin-post.json,newsletter.json,talk-abstract.json,thread.json");
    for (const f of files) {
      const p = JSON.parse(read(join(MEDIA, f)));
      const errors = mp.validateProfile(p);
      t.check(`${f} validates`, errors.length === 0, errors.join("; "));
      t.check(`${f}: form is the file name and medium is web, tts or print`, p.form === f.replace(/\.json$/, "") && mp.MEDIA.includes(p.medium));
      t.check(`${f}: every semantic constraint says what the critic reviews`, p.constraints.filter((c) => c.kind === "semantic").every((c) => c.note && c.rule?.text));
    }
    const base = JSON.parse(read(join(MEDIA, "thread.json")));
    const bad = (mutate, pattern, name) => { const b = JSON.parse(JSON.stringify(base)); mutate(b); const e = mp.validateProfile(b); t.check(name, e.some((x) => pattern.test(x)), e.join("; ")); };
    bad((b) => { b.platform = "x"; }, /unknown field platform/, "an unknown top-level field is refused by name");
    bad((b) => { b.medium = "audio"; }, /medium must be one of/, "a medium outside web|tts|print is refused");
    bad((b) => { b.constraints[0].rule = { type: "max_lines", max: 3 }; }, /rule\.type must be one of/, "an unknown mechanical rule type is refused");
    bad((b) => { b.constraints[0].rule.extra = 1; }, /unknown parameter extra/, "an unknown rule parameter is refused");
    bad((b) => { b.constraints.push({ id: "segment-limit", kind: "mechanical", rule: { type: "max_segments", max: 2 } }); }, /duplicate id/, "a duplicate constraint id is refused");
    bad((b) => { b.delivery_notes = "Never say leverage or synergy in this medium."; }, /prohibition list/, "delivery notes that carry a prohibition list are refused: that is a catalog by another name");
    bad((b) => { delete b.checked; }, /missing checked/, "a profile without a checked date is refused");
    bad((b) => { b.constraints[4].note = ""; }, /note must say what the critic reviews/, "a semantic constraint without a note is refused");
    const loaded = mp.loadProfile(read(join(MEDIA, "thread.json")));
    t.check("loadProfile returns the profile and a sha256 digest of its bytes", loaded.profile.form === "thread" && /^[a-f0-9]{64}$/.test(loaded.digest));
    t.check("profileFacts renders structure and mechanical constraints as plain facts, and marks semantic ones as reviewed not enforced", mp.profileFacts(loaded.profile).some((f) => /Structure, in order: hook, body, close/.test(f)) && mp.profileFacts(loaded.profile).some((f) => /no segment over 280 characters/.test(f)) && mp.profileFacts(loaded.profile).some((f) => /reviewed, not enforced/.test(f)));
    t.check("form is not medium: no profile uses a medium word as its form", files.every((f) => !mp.MEDIA.includes(f.replace(/\.json$/, ""))));
  }

  t.group("repurpose-check — counts on the final bytes, semantic constraints for the critic, atoms listed not failed");
  {
    const thread = read(join(MEDIA, "thread.json"));
    const over = await rc.repurposeCheck({ profileText: thread, draft: read(join(FIX, "thread-over.md")), source: read(join(FIX, "source.md")), env });
    const by = (r) => Object.fromEntries(r.mechanical.map((m) => [m.id, m]));
    t.check("an over-length first segment with a link fails segment-limit and no-links-in-first-segment by name, with the numbers", by(over)["segment-limit"].status === "failed" && /#1 \(\d+\)/.test(by(over)["segment-limit"].detail) && by(over)["no-links-in-first-segment"].status === "failed" && over.summary.failed === 2);
    t.check("semantic constraints are not-evaluated with the critic's note, never passed", over.mechanical.filter((m) => m.kind === "semantic").every((m) => m.status === "not-evaluated" && /medium critic/.test(m.detail)));
    const ok = await rc.repurposeCheck({ profileText: thread, draft: read(join(FIX, "thread-ok.md")), source: read(join(FIX, "source.md")), env });
    t.check("a compliant thread passes every mechanical constraint", ok.summary.failed === 0 && ok.counts.segments === 5);
    if (existsSync(join(REVIEW, "tools", "fidelity-scan.mjs"))) {
      t.check("missing atoms against the source are listed, not failed: the compliant thread drops the years and still passes", ok.fidelity.status === "listed" && ok.fidelity.missing_atoms.some((a) => a.source === "2019" || a.source === "2008") && ok.summary.failed === 0);
      t.check("the over-length thread lists what it dropped too", over.fidelity.status === "listed" && over.fidelity.missing_atoms.length > 0);
    } else {
      process.stdout.write("  SKIP fidelity listing — prose-review absent\n");
    }
    const noReview = await rc.repurposeCheck({ profileText: thread, draft: read(join(FIX, "thread-ok.md")), source: read(join(FIX, "source.md")), env: { PROSE_REVIEW_ROOT: join(HERE, "nope") } });
    t.check("without prose-review the fidelity block is not-evaluated, never ok", noReview.fidelity.status === "not-evaluated" && /not installed/.test(noReview.fidelity.reason) || rc.findFidelityScan({ PROSE_REVIEW_ROOT: join(HERE, "nope") }) !== null);
    const news = await rc.repurposeCheck({ profileText: read(join(MEDIA, "newsletter.json")), draft: read(join(FIX, "newsletter-short.md")), env });
    t.check("a newsletter under its floor fails enough-to-read with its word count, and the hook is the critic's, not a pass", by(news)["enough-to-read"].status === "failed" && /words: \d+ \(limit 400\)/.test(by(news)["enough-to-read"].detail) && by(news)["hook-present"].status === "not-evaluated");
    t.check("no source ⇒ fidelity not-evaluated with the reason", news.fidelity.status === "not-evaluated" && /no source/.test(news.fidelity.reason));
    const badProfile = await (async () => { try { return await rc.repurposeCheck({ profileText: JSON.stringify({ schema: "medium-profile/1", form: "x" }), draft: "x" }); } catch (e) { return { crashed: e.message }; } })();
    t.check("a profile that fails validation is refused before anything is counted", /profile refused/.test(badProfile.crashed ?? ""));
    t.check("the report's limits say semantic constraints are never reported as passed", over.limits.some((l) => /never reported as passed/.test(l)));
    t.check("the profile digest in the report equals loadProfile's", over.profile_digest === mp.loadProfile(thread).digest);
    // Rule coverage: every rule type the validator admits is evaluated by the check.
    for (const type of Object.keys(mp.RULE_TYPES)) {
      const rule = { type, max: 1, min: 1, segment: 1 };
      for (const k of Object.keys(rule)) if (k !== "type" && !mp.RULE_TYPES[type].includes(k)) delete rule[k];
      const r = rc.evaluateRule(rule, "one two three\n\n# head\n---\nsecond #tag", { segments: { separator: "\n---\n" } });
      t.check(`rule ${type} evaluates to passed or failed, never not-evaluated`, ["passed", "failed"].includes(r.status), r.detail);
    }
  }

  t.group("repurpose-check CLI — exit codes");
  {
    const tool = join(SKILL, "tools", "repurpose-check.mjs");
    const over = spawnSync(process.execPath, [tool, "--profile", join(MEDIA, "thread.json"), "--draft", join(FIX, "thread-over.md"), "--json"], { encoding: "utf8", env });
    t.check("a failing draft exits 1 and prints the report as JSON", over.status === 1 && JSON.parse(over.stdout).summary.failed === 2);
    const ok = spawnSync(process.execPath, [tool, "--profile", join(MEDIA, "thread.json"), "--draft", join(FIX, "thread-ok.md")], { encoding: "utf8", env });
    t.check("a passing draft exits 0 and the human report names the critic's constraints", ok.status === 0 && /for the critic/.test(ok.stdout));
    t.check("usage exits 2", spawnSync(process.execPath, [tool], { encoding: "utf8" }).status === 2);
  }
}
