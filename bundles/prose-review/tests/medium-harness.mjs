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
 *      posts under the newsletter profile, listed by name.
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
 * profile as `profile.json`; leave-one-out negatives stage one corpus post as `piece.md`
 * under the newsletter profile. `--only` accepts fixture names.
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
    inputs: [{ as: "piece.md", from: join(CORPUS, rel) }, { as: "profile.json", from: profilePath(manifest.leave_one_out.form) }],
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
