/**
 * medium-harness — what `run-harness.mjs`, `verify-run.mjs` and `selftest.mjs`
 * share about prose-medium-critic's fixtures. Neither runner may import the
 * other, so the three things they must agree on live here once:
 *
 *   1. THE ECHO RULE. `checkSays(check)` is the verdict a critic would return by
 *      parroting repurpose-check: flagged when any mechanical constraint failed.
 *      It is NOT a finding and the check never prints it; it exists so the
 *      harness can report the echo baseline beside the critic's and classify
 *      fixtures by whether the critic must agree or disagree with the tool.
 *   2. THE FIXTURE SET. Six synthetic pieces under fixtures/medium/, each naming
 *      the profile it was made for, plus a leave-one-out set of six Doctorow
 *      essays under the newsletter profile. Each essay is EXTRACTED from its
 *      Pluralistic issue by `extractEssay` and committed under
 *      fixtures/medium/loo/: the issue around it (a contents list, link
 *      roundups, a colophon) is not a newsletter piece as delivered, and the
 *      first run's critic was right to say so (runs/2026-11-09-medium).
 *   3. THE TASK TEXT the critic receives: the profile, the check output, and
 *      which medium that puts it in.
 *
 * The profiles and repurpose-check live in prose-author's prose-repurpose skill
 * and are imported here at TEST time only (a consumer importing the producer it
 * reads, the way the structure harness imports outline-scan). Shipped code
 * never imports across bundles; the critic receives the profile as a block.
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const TESTS = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(TESTS, "..", "..", "..");
export const MEDIUM_FIXTURES = join(TESTS, "fixtures", "medium");
export const REPURPOSE = join(REPO, "bundles", "prose-author", "skills", "prose-repurpose");
const CORPUS = join(REPO, "bundles", "prose-tell-scan", "tests", "corpus", "human-essays");

export const LOO_DIR = join(MEDIUM_FIXTURES, "loo");
export const looName = (rel) => rel.split("/").pop().replace(/\.txt$/, "");

/**
 * The essay inside a Pluralistic issue: from its title line (the first line
 * ending "(permalink)") up to the "Hey look at this (permalink)" roundup. Three
 * kinds of web scaffolding are dropped, because none is prose written for the
 * reader: the "(permalink)" marker on the title, lines that are only a URL (the
 * link targets of anchors in the surrounding text) and "(Image: …)" credits for
 * a header image the text does not carry. Every other line is kept verbatim.
 */
export function extractEssay(text) {
  const lines = text.replace(/\r\n?/g, "\n").split("\n");
  const start = lines.findIndex((l) => / \(permalink\)$/.test(l));
  const end = lines.findIndex((l) => l === "Hey look at this (permalink)");
  if (start < 0 || end <= start) throw new Error("not a Pluralistic issue: no titled essay before the link roundup");
  const kept = lines.slice(start, end).filter((l) => !/^\s*https?:\/\/\S+\s*$/.test(l) && !/^\(Image: .*\)$/.test(l.trim()));
  kept[0] = kept[0].replace(/ \(permalink\)$/, "");
  // Attribution travels with the extract (the corpus is CC-BY-4.0); the harness strips
  // frontmatter before staging, so the critic never sees it.
  const front = /^---\n([\s\S]*?)\n---\n/.exec(lines.join("\n"))?.[1] ?? "";
  const keep = front.split("\n").filter((l) => /^(source|author|license|permalink):/.test(l));
  return `---\n${[...keep, "extracted: the essay alone, by tests/medium-harness.mjs extractEssay"].join("\n")}\n---\n${kept.join("\n").replace(/\n{3,}/g, "\n\n").trim()}\n`;
}
/** The extract without its attribution frontmatter: what the critic is staged with. */
export const essayBody = (extract) => extract.replace(/^---\n[\s\S]*?\n---\n/, "");
export const looSource = (rel) => join(CORPUS, rel);

export const ECHO_RULE = { description: "flagged when repurpose-check reports any mechanical constraint as failed" };

/** The parrot's verdict. A check in, one of two words out; never a finding. */
export function checkSays(check) {
  return check.mechanical.some((m) => m.status === "failed") ? "REVISE" : "CLEAN";
}

export const loadMediumManifest = () => JSON.parse(readFileSync(join(MEDIUM_FIXTURES, "fixtures.json"), "utf8"));
export const profilePath = (form) => join(REPURPOSE, "media", `${form}.json`);
export const repurposePresent = () => existsSync(join(REPURPOSE, "tools", "repurpose-check.mjs"));

export async function checkPiece(piece, form) {
  const { repurposeCheck } = await import(pathToFileURL(join(REPURPOSE, "tools", "repurpose-check.mjs")).href);
  return repurposeCheck({ profileText: readFileSync(profilePath(form), "utf8"), draft: piece, source: null, env: { PROSE_REVIEW_ROOT: resolve(TESTS, "..") } });
}

/**
 * Fixtures for `run-harness.mjs prepare medium`. Synthetic cases stage `piece.md` and the
 * profile as `profile.json`; leave-one-out negatives stage one extracted essay
 * (fixtures/medium/loo/) as `piece.md` under the newsletter profile. `--only`
 * accepts fixture names.
 */
export function mediumFixtures(opts = {}) {
  const manifest = loadMediumManifest();
  const dir = opts.fixturesDir ?? MEDIUM_FIXTURES;
  const synthetic = manifest.fixtures.map((f) => ({
    name: f.name, kind: f.kind, form: f.form,
    inputs: [{ as: "piece.md", from: join(dir, f.name, "piece.md") }, { as: "profile.json", from: profilePath(f.form) }],
  }));
  const negatives = manifest.leave_one_out.essays.map((rel) => ({
    name: `n-loo-${rel.split("/").pop().replace(/\.txt$/, "")}`, kind: "negative", form: manifest.leave_one_out.form,
    inputs: [{ as: "piece.md", from: join(LOO_DIR, `${looName(rel)}.md`) }, { as: "profile.json", from: profilePath(manifest.leave_one_out.form) }],
  }));
  return [...synthetic, ...negatives];
}

/** The task text: the profile, the check output (computed on the STAGED piece), the medium. */
export async function mediumTask(staged) {
  const { repurposeCheck } = await import(pathToFileURL(join(REPURPOSE, "tools", "repurpose-check.mjs")).href);
  const check = await repurposeCheck({ profileText: staged["profile.json"], draft: staged["piece.md"], source: null, env: { PROSE_REVIEW_ROOT: resolve(TESTS, "..") } });
  const profile = JSON.parse(staged["profile.json"]);
  return [
    `You have a piece as it will be delivered (\`piece.md\`), the medium profile it was made for, and the output of \`repurpose-check\` over it.`,
    "Report on the piece's delivery, following your instructions exactly, including the",
    "output contract and the closing one-line verdict.",
    "",
    `Medium: ${profile.medium}. Form: ${profile.form}.`,
    "",
    "## medium profile (medium-profile/1)",
    "",
    "```json",
    staged["profile.json"].trim(),
    "```",
    "",
    "## repurpose-check output",
    "",
    "```json",
    JSON.stringify(check, null, 1),
    "```",
    "",
    "The check is authoritative on counts. You are authoritative only on delivery.",
  ].join("\n");
}

/**
 * Regenerate or compare the committed leave-one-out essays:
 *   node tests/medium-harness.mjs           # compare; exit 1 on any difference
 *   node tests/medium-harness.mjs --update  # rewrite fixtures/medium/loo/*.md
 */
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { mkdirSync, writeFileSync } = await import("node:fs");
  const update = process.argv.includes("--update");
  let differing = 0;
  mkdirSync(LOO_DIR, { recursive: true });
  for (const rel of loadMediumManifest().leave_one_out.essays) {
    const target = join(LOO_DIR, `${looName(rel)}.md`);
    const text = extractEssay(readFileSync(looSource(rel), "utf8"));
    if (update) { writeFileSync(target, text); console.log(`  wrote loo/${looName(rel)}.md`); continue; }
    if (existsSync(target) && readFileSync(target, "utf8") === text) console.log(`  ok   loo/${looName(rel)}.md`);
    else { differing += 1; console.log(`  DIFF loo/${looName(rel)}.md — rerun with --update and review the diff`); }
  }
  process.exit(differing ? 1 : 0);
}
